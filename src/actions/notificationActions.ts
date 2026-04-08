"use server";

import { client } from "@/lib/sanityClient";
import { revalidatePath } from "next/cache";

/**
 * Creates a notification in Sanity CMS
 * @param params - Notification data
 * @returns Success status and created notification or error message
 */
export async function createNotification(params: {
  userId: string;
  title: string;
  message: string;
  type: "event_reminder" | "event_update" | "ai_suggestion" | "system" | "success" | "warning";
  relatedEventId?: string;
  actionUrl?: string;
}) {
  try {
    const notification = await client.create({
      _type: "notification",
      userId: params.userId,
      title: params.title,
      message: params.message,
      type: params.type,
      isRead: false,
      relatedEventId: params.relatedEventId,
      actionUrl: params.actionUrl,
      createdAt: new Date().toISOString(),
    });

    return { success: true, notification };
  } catch (error) {
    console.error("Error creating notification:", error);
    return { success: false, error: "Failed to create notification" };
  }
}
