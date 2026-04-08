import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/sanityClient";
import { verifyToken } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ notificationId: string }> }
) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const userId = payload.userId;
    const { notificationId } = await params;

    try {
      // Verify the notification belongs to this user
      const notification = await client.fetch(
        `*[_type == "notification" && _id == $notificationId && userId == $userId][0]`,
        { notificationId, userId }
      );

      if (!notification) {
        return NextResponse.json(
          { error: "Notification not found" },
          { status: 404 }
        );
      }

      // Mark notification as read
      await client.patch(notificationId).set({ isRead: true }).commit();
    } catch (sanityError) {
      // Log the error but don't fail the request
      // This allows navigation to work even if token is read-only
      console.warn("Could not mark notification as read (token may be read-only):", sanityError);
      // Return success anyway so the UI can proceed
      return NextResponse.json({ success: true, warning: "Notification not marked as read" });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ notificationId: string }> }
) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const userId = payload.userId;
    const { notificationId } = await params;

    try {
      // Verify the notification belongs to this user
      const notification = await client.fetch(
        `*[_type == "notification" && _id == $notificationId && userId == $userId][0]`,
        { notificationId, userId }
      );

      if (!notification) {
        return NextResponse.json(
          { error: "Notification not found" },
          { status: 404 }
        );
      }

      await client.delete(notificationId);
    } catch (sanityError) {
      // Log the error but don't fail the request
      console.warn("Could not delete notification (token may be read-only):", sanityError);
      // Return success anyway so the UI can proceed
      return NextResponse.json({ success: true, warning: "Notification not deleted" });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 500 }
    );
  }
}
