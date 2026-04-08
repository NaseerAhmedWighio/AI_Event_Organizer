"use server";

import { client } from "@/lib/sanityClient";
import { revalidatePath } from "next/cache";
import { z } from "zod";

/**
 * Zod schema for event creation validation
 * Note: datetime-local input returns format like "2024-03-30T14:30" without timezone
 * We need to handle this format and convert it to ISO string
 */
const createEventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string()
    .min(1, "Date is required")
    .refine(
      (val) => {
        // Accept both ISO datetime and date-only format (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}/;
        return dateRegex.test(val);
      },
      {
        message: "Invalid date format. Please use YYYY-MM-DD format",
      }
    ),
  location: z.string().min(1, "Location is required"),
  status: z.enum(["upcoming", "completed", "cancelled"]).optional(),
  attendees: z.array(z.string().email("Invalid email address")).optional(),
  budget: z.string().optional(),
  category: z.string().optional(),
  clerkId: z.string().min(1, "User ID is required"),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;

/**
 * Zod schema for event update validation
 */
const updateEventSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
  title: z.string().min(3).max(100).optional(),
  description: z.string().min(10).optional(),
  date: z.string().datetime().optional(),
  location: z.string().min(1).optional(),
  status: z.enum(["upcoming", "completed", "cancelled"]).optional(),
  attendees: z.array(z.string().email()).optional(),
  budget: z.string().optional(),
  category: z.string().optional(),
});

export type UpdateEventInput = z.infer<typeof updateEventSchema>;

export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string[];
}

/**
 * Creates a new event in Sanity CMS
 * @param input - Event creation data
 * @returns Success status and created event or error message
 */
export async function createEvent(input: CreateEventInput): Promise<ActionResult<any>> {
  try {
    // Validate input
    const validatedData = createEventSchema.parse(input);

    // Convert date format to ISO string for Sanity
    // Date input returns "2024-03-30" but we want to store as full day
    let isoDateString: string;
    if (validatedData.date.includes('T')) {
      // Already has time component
      isoDateString = new Date(validatedData.date).toISOString();
    } else {
      // Date only - add time as 00:00:00
      isoDateString = new Date(validatedData.date + 'T00:00:00').toISOString();
    }

    const doc = {
      _type: "event",
      title: validatedData.title,
      description: validatedData.description,
      date: isoDateString,
      location: validatedData.location,
      status: validatedData.status || "upcoming",
      attendees: validatedData.attendees || [],
      createdBy: validatedData.clerkId,
      budget: validatedData.budget,
      category: validatedData.category || "other",
    };

    const createdEvent = await client.create(doc);

    // Revalidate relevant paths
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/events");
    revalidatePath("/dashboard/analytics");

    return {
      success: true,
      data: createdEvent
    };
  } catch (error) {
    console.error("Error creating event:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        details: error.issues.map((e: z.ZodIssue) => e.message)
      };
    }

    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to create event" 
    };
  }
}

/**
 * Updates an existing event in Sanity CMS
 * @param input - Event update data
 * @returns Success status and updated event or error message
 */
export async function updateEvent(input: UpdateEventInput): Promise<ActionResult<any>> {
  try {
    // Validate input
    const validatedData = updateEventSchema.parse(input);

    const updates: Record<string, any> = {};

    if (validatedData.title !== undefined) updates.title = validatedData.title;
    if (validatedData.description !== undefined) updates.description = validatedData.description;
    if (validatedData.date !== undefined) {
      // Convert datetime-local format to ISO string for Sanity
      const dateObj = new Date(validatedData.date);
      updates.date = dateObj.toISOString();
    }
    if (validatedData.location !== undefined) updates.location = validatedData.location;
    if (validatedData.status !== undefined) updates.status = validatedData.status;
    if (validatedData.attendees !== undefined) updates.attendees = validatedData.attendees;
    if (validatedData.budget !== undefined) updates.budget = validatedData.budget;
    if (validatedData.category !== undefined) updates.category = validatedData.category;

    const updatedEvent = await client
      .patch(validatedData.eventId)
      .set(updates)
      .commit();

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/events");
    revalidatePath(`/dashboard/events/${validatedData.eventId}`);
    revalidatePath("/dashboard/analytics");

    return {
      success: true,
      data: updatedEvent
    };
  } catch (error) {
    console.error("Error updating event:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        details: error.issues.map((e: z.ZodIssue) => e.message)
      };
    }

    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update event" 
    };
  }
}

export async function deleteEvent(eventId: string): Promise<ActionResult<void>> {
  try {
    // First, delete any associated AI plans
    const aiPlans = await client.fetch(
      `*[_type == "aiPlan" && event._ref == $eventId] { _id }`,
      { eventId }
    );

    const mutations = aiPlans.map((plan: any) =>
      client.delete(plan._id)
    );

    // Delete the event
    mutations.push(client.delete(eventId));

    await client.transaction(mutations).commit();

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/events");
    revalidatePath("/dashboard/analytics");

    return { success: true };
  } catch (error) {
    console.error("Error deleting event:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to delete event" 
    };
  }
}

export async function addAttendee(eventId: string, email: string): Promise<ActionResult<any>> {
  try {
    const updatedEvent = await client
      .patch(eventId)
      .setIfMissing({ attendees: [] })
      .append("attendees", [email])
      .commit();

    revalidatePath(`/dashboard/events/${eventId}`);

    return { success: true, data: updatedEvent };
  } catch (error) {
    console.error("Error adding attendee:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to add attendee" 
    };
  }
}

export async function removeAttendee(eventId: string, email: string): Promise<ActionResult<any>> {
  try {
    const updatedEvent = await client
      .patch(eventId)
      .unset([`attendees[@=="${email}"]`])
      .commit();

    revalidatePath(`/dashboard/events/${eventId}`);

    return { success: true, data: updatedEvent };
  } catch (error) {
    console.error("Error removing attendee:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to remove attendee" 
    };
  }
}

export async function updateEventStatus(
  eventId: string,
  status: "upcoming" | "completed" | "cancelled"
): Promise<ActionResult<any>> {
  try {
    const updatedEvent = await client
      .patch(eventId)
      .set({ status })
      .commit();

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/events");
    revalidatePath("/dashboard/analytics");

    return { success: true, data: updatedEvent };
  } catch (error) {
    console.error("Error updating event status:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update event status"
    };
  }
}

/**
 * Checks if an event's date has passed and all checklist items are completed,
 * then automatically marks the event as completed
 */
export async function autoMarkEventAsCompleted(eventId: string): Promise<ActionResult<any>> {
  try {
    // Fetch the event and its AI plan
    const event = await client.fetch(
      `*[_type == "event" && _id == $eventId][0] {
        _id,
        date,
        status,
        "aiPlan": *[_type == "aiPlan" && event._ref == ^._id][0] {
          checklist
        }
      }`,
      { eventId }
    );

    if (!event) {
      return {
        success: false,
        error: "Event not found"
      };
    }

    // Only process if event is still "upcoming"
    if (event.status !== "upcoming") {
      return {
        success: false,
        error: "Event is not in upcoming status"
      };
    }

    // Check if date has passed
    const eventDate = new Date(event.date);
    const now = new Date();
    const hasPassed = eventDate < now;

    if (!hasPassed) {
      return {
        success: false,
        error: "Event date has not passed yet"
      };
    }

    // Check if all checklist items are completed (if AI plan exists)
    if (event.aiPlan?.checklist && event.aiPlan.checklist.length > 0) {
      const allCompleted = event.aiPlan.checklist.every((item: any) => item.completed);
      
      if (!allCompleted) {
        return {
          success: false,
          error: "Not all checklist items are completed"
        };
      }
    }

    // Mark as completed
    const updatedEvent = await client
      .patch(eventId)
      .set({ status: "completed" })
      .commit();

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/events");
    revalidatePath("/dashboard/analytics");

    return { success: true, data: updatedEvent };
  } catch (error) {
    console.error("Error auto-marking event as completed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to auto-mark event"
    };
  }
}

/**
 * Manual action to mark an event as completed (regardless of date/checklist)
 */
export async function markEventAsCompleted(eventId: string): Promise<ActionResult<any>> {
  try {
    const updatedEvent = await client
      .patch(eventId)
      .set({ status: "completed" })
      .commit();

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/events");
    revalidatePath("/dashboard/analytics");

    return { success: true, data: updatedEvent };
  } catch (error) {
    console.error("Error marking event as completed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to mark event as completed"
    };
  }
}
