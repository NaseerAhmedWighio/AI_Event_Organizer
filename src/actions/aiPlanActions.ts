"use server";

import { client } from "@/lib/sanityClient";
import { revalidatePath } from "next/cache";
import { generateEventPlan, type AIEventPlan } from "@/lib/openai";
import { z } from "zod";
import { createNotification } from "./notificationActions";

/**
 * Zod schema for AI plan creation validation
 */
const createAIPlanSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
  eventTitle: z.string().min(3, "Event title must be at least 3 characters"),
  eventDescription: z.string().min(10, "Description must be at least 10 characters"),
  eventDate: z.string().refine(
    (val) => {
      const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;
      return isoRegex.test(val);
    },
    {
      message: "Invalid date format. Please use YYYY-MM-DDTHH:MM format",
    }
  ),
  location: z.string().min(1, "Location is required"),
  category: z.string().min(1, "Category is required"),
  expectedAttendees: z.coerce.number().int().min(0).optional().default(0),
});

export type CreateAIPlanInput = z.infer<typeof createAIPlanSchema>;

/**
 * Creates a new AI plan in Sanity CMS
 * @param input - AI plan creation data
 * @returns Success status and created plan or error message
 */
export async function createAIPlan(input: CreateAIPlanInput) {
  try {
    // Validate input
    const validatedData = createAIPlanSchema.parse(input);

    // Generate AI plan
    const aiPlan = await generateEventPlan({
      eventTitle: validatedData.eventTitle,
      eventDescription: validatedData.eventDescription,
      eventDate: validatedData.eventDate,
      location: validatedData.location,
      category: validatedData.category,
      expectedAttendees: validatedData.expectedAttendees || 0,
    });

    // Create document in Sanity
    const doc = {
      _type: "aiPlan",
      event: {
        _type: "reference",
        _key: "event_ref",
        _ref: validatedData.eventId,
      },
      schedule: aiPlan.schedule,
      budget: aiPlan.budget,
      suggestions: aiPlan.suggestions,
      guestIdeas: aiPlan.guestIdeas,
      vendorRecommendations: aiPlan.vendorRecommendations,
      checklist: aiPlan.checklist,
    };

    const createdPlan = await client.create(doc);

    // Create notification for the user
    const event = await client.fetch(
      `*[_type == "event" && _id == $eventId][0] { _id, title, createdBy }`,
      { eventId: validatedData.eventId }
    );

    if (event?.createdBy) {
      await createNotification({
        userId: event.createdBy,
        title: "AI Plan Ready",
        message: `Your AI plan for "${event.title}" has been generated successfully.`,
        type: "success",
        relatedEventId: validatedData.eventId,
        actionUrl: `/dashboard/events/${validatedData.eventId}`,
      });
    }

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/events/${validatedData.eventId}`);

    return { success: true, plan: createdPlan };
  } catch (error) {
    console.error("Error creating AI plan:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        details: error.issues.map((e: z.ZodIssue) => e.message)
      };
    }
    
    // Pass through specific error messages from the AI service
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred while generating the AI plan. Please try again."
    };
  }
}

export async function updateAIPlanChecklist(
  planId: string,
  checklistIndex: number,
  completed: boolean
) {
  try {
    const updatedPlan = await client
      .patch(planId)
      .set({ [`checklist[${checklistIndex}].completed`]: completed })
      .commit();

    revalidatePath("/dashboard");

    return { success: true, plan: updatedPlan };
  } catch (error) {
    console.error("Error updating checklist:", error);
    return { success: false, error: "Failed to update checklist" };
  }
}

/**
 * Replaces the entire checklist array (for adding/removing items)
 */
export async function updateAIPlanChecklistBulk(
  planId: string,
  checklist: Array<{ task: string; completed: boolean; priority: "high" | "medium" | "low" }>
) {
  try {
    const updatedPlan = await client
      .patch(planId)
      .set({ checklist })
      .commit();

    revalidatePath("/dashboard");

    return { success: true, plan: updatedPlan };
  } catch (error) {
    console.error("Error updating checklist:", error);
    return { success: false, error: "Failed to update checklist" };
  }
}

export async function updateAIPlanSchedule(
  planId: string,
  schedule: AIEventPlan["schedule"]
) {
  try {
    const updatedPlan = await client
      .patch(planId)
      .set({ schedule })
      .commit();
    
    revalidatePath("/dashboard");
    
    return { success: true, plan: updatedPlan };
  } catch (error) {
    console.error("Error updating schedule:", error);
    return { success: false, error: "Failed to update schedule" };
  }
}

export async function deleteAIPlan(planId: string) {
  try {
    await client.delete(planId);
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting AI plan:", error);
    return { success: false, error: "Failed to delete AI plan" };
  }
}

export async function regenerateAIPlan(input: CreateAIPlanInput) {
  try {
    // First delete existing plan
    const existingPlans = await client.fetch(
      `*[_type == "aiPlan" && event._ref == $eventId] { _id }`,
      { eventId: input.eventId }
    );

    const mutations = existingPlans.map((plan: any) => client.delete(plan._id));
    
    // Generate new plan
    const aiPlan = await generateEventPlan({
      eventTitle: input.eventTitle,
      eventDescription: input.eventDescription,
      eventDate: input.eventDate,
      location: input.location,
      category: input.category,
      expectedAttendees: input.expectedAttendees,
    });

    // Create new document
    const doc = {
      _type: "aiPlan",
      event: {
        _type: "reference",
        _key: "event_ref",
        _ref: input.eventId,
      },
      schedule: aiPlan.schedule,
      budget: aiPlan.budget,
      suggestions: aiPlan.suggestions,
      guestIdeas: aiPlan.guestIdeas,
      vendorRecommendations: aiPlan.vendorRecommendations,
      checklist: aiPlan.checklist,
    };

    const createdPlan = await client.create(doc);

    // Create notification for the user
    const event = await client.fetch(
      `*[_type == "event" && _id == $eventId][0] { _id, title, createdBy }`,
      { eventId: input.eventId }
    );

    if (event?.createdBy) {
      await createNotification({
        userId: event.createdBy,
        title: "AI Plan Regenerated",
        message: `Your AI plan for "${event.title}" has been regenerated successfully.`,
        type: "success",
        relatedEventId: input.eventId,
        actionUrl: `/dashboard/events/${input.eventId}`,
      });
    }

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/events/${input.eventId}`);

    return { success: true, plan: createdPlan };
  } catch (error) {
    console.error("Error regenerating AI plan:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to regenerate AI plan" 
    };
  }
}
