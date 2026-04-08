import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/sanityClient";

export async function POST(
  request: NextRequest
) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch all unread notifications for the user
    const unreadNotifications = await client.fetch(
      `*[_type == "notification" && userId == $userId && isRead == false]`,
      { userId }
    );

    if (unreadNotifications.length === 0) {
      return NextResponse.json({ success: true, updated: 0 });
    }

    // Mark all as read using transaction
    const transaction = client.transaction();
    unreadNotifications.forEach((notification: any) => {
      transaction.patch(notification._id, { set: { isRead: true } });
    });
    await transaction.commit();

    return NextResponse.json({ 
      success: true, 
      updated: unreadNotifications.length 
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return NextResponse.json(
      { error: "Failed to mark all notifications as read" },
      { status: 500 }
    );
  }
}
