"use server";

import { client, isSanityConfigured } from "@/lib/sanityClient";
import { revalidatePath } from "next/cache";
import { z } from "zod";

/**
 * Zod schema for review validation
 */
const createReviewSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  userName: z.string().min(2, "Name must be at least 2 characters").max(100),
  userEmail: z.string().email("Invalid email address"),
  userProfilePic: z.string().nullable().optional(),
  eventId: z.string().optional(),
  reviewText: z.string().min(10, "Review must be at least 10 characters").max(1000),
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;

/**
 * Creates a new review in Sanity CMS
 * @param input - Review creation data
 * @returns Success status and created review or error message
 */
export async function createReview(input: CreateReviewInput) {
  try {
    if (!isSanityConfigured()) {
      return { success: false, error: "Sanity CMS is not configured" };
    }

    // Validate input
    const validatedData = createReviewSchema.parse(input);

    const doc = {
      _type: "review",
      userId: validatedData.userId,
      userName: validatedData.userName,
      userEmail: validatedData.userEmail,
      userProfilePic: validatedData.userProfilePic || null,
      eventId: validatedData.eventId
        ? {
            _type: "reference",
            _ref: validatedData.eventId,
          }
        : undefined,
      reviewText: validatedData.reviewText,
      rating: validatedData.rating,
      isApproved: true, // Auto-approve reviews
      createdAt: new Date().toISOString(),
    };

    const createdReview = await client.create(doc);
    revalidatePath("/");

    return { success: true, review: createdReview };
  } catch (error) {
    console.error("Error creating review:", error);
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: "Validation failed",
        details: error.issues.map((e: z.ZodIssue) => e.message)
      };
    }
    
    return { success: false, error: "Failed to create review" };
  }
}

/**
 * Fetches all approved reviews for the landing page
 * @returns Array of approved reviews
 */
export async function getApprovedReviews() {
  try {
    if (!isSanityConfigured()) {
      return { success: true, reviews: [] };
    }

    const query = `
      *[_type == "review" && isApproved == true] | order(createdAt desc) [0...10] {
        _id,
        userId,
        userName,
        userEmail,
        userProfilePic,
        reviewText,
        rating,
        createdAt,
        "event": event->{
          _id,
          title
        }
      }
    `;

    const reviews = await client.fetch(query);
    return { success: true, reviews };
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return { success: false, error: "Failed to fetch reviews", reviews: [] };
  }
}

/**
 * Fetches reviews for a specific event
 * @param eventId - The event ID to fetch reviews for
 * @returns Array of approved reviews for the event
 */
export async function getReviewsForEvent(eventId: string) {
  try {
    const query = `
      *[_type == "review" && isApproved == true && event._ref == $eventId] | order(createdAt desc) {
        _id,
        userName,
        userEmail,
        reviewText,
        rating,
        createdAt
      }
    `;

    const reviews = await client.fetch(query, { eventId });
    return { success: true, reviews };
  } catch (error) {
    console.error("Error fetching event reviews:", error);
    return { success: false, error: "Failed to fetch reviews", reviews: [] };
  }
}

/**
 * Updates a review (for admin use)
 * @param reviewId - The review ID to update
 * @param updates - The fields to update
 * @returns Success status and updated review or error message
 */
export async function updateReview(
  reviewId: string,
  updates: { isApproved?: boolean; reviewText?: string }
) {
  try {
    const updateData: Record<string, any> = {};

    if (updates.isApproved !== undefined) {
      updateData.isApproved = updates.isApproved;
    }

    if (updates.reviewText !== undefined) {
      updateData.reviewText = updates.reviewText;
    }

    const updatedReview = await client
      .patch(reviewId)
      .set(updateData)
      .commit();

    revalidatePath("/");

    return { success: true, review: updatedReview };
  } catch (error) {
    console.error("Error updating review:", error);
    return { success: false, error: "Failed to update review" };
  }
}

/**
 * Deletes a review (for admin use)
 * @param reviewId - The review ID to delete
 * @returns Success status or error message
 */
export async function deleteReview(reviewId: string) {
  try {
    await client.delete(reviewId);
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error deleting review:", error);
    return { success: false, error: "Failed to delete review" };
  }
}
