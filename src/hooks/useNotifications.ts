"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { client } from "@/lib/sanityClient";

export interface Notification {
  _id: string;
  _createdAt: string;
  userId: string;
  title: string;
  message: string;
  type: "event_reminder" | "event_update" | "ai_suggestion" | "system" | "success" | "warning";
  isRead: boolean;
  relatedEventId?: string;
  actionUrl?: string;
  scheduledAt?: string;
  expiresAt?: string;
  createdAt: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  read: number;
}

interface UseNotificationsOptions {
  clerkId: string;
  enabled?: boolean;
  enableRealTime?: boolean;
  autoMarkAsRead?: boolean;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  stats: NotificationStats | null;
  isLoading: boolean;
  error: Error | null;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  refetch: () => Promise<void>;
  hasRealTime: boolean;
}

const NOTIFICATION_TYPE_ICONS: Record<string, string> = {
  event_reminder: "📅",
  event_update: "🔄",
  ai_suggestion: "✨",
  system: "⚙️",
  success: "✅",
  warning: "⚠️",
};

const NOTIFICATION_TYPE_COLORS: Record<string, string> = {
  event_reminder: "bg-info/10 text-info",
  event_update: "bg-chart-3/10 text-chart-3",
  ai_suggestion: "bg-warning/10 text-warning",
  system: "bg-muted text-muted-foreground",
  success: "bg-success/10 text-success",
  warning: "bg-danger-muted text-danger",
};

/**
 * Custom hook for managing notifications with real-time updates
 * Features:
 * - Fetch notifications for user
 * - Real-time updates via Sanity listen()
 * - Mark as read/unread functionality
 * - Delete notifications
 * - Notification stats (total, unread, read)
 *
 * @param options - Configuration including clerkId and fetch options
 * @returns Notifications, stats, and management functions
 */
export function useNotifications({
  clerkId,
  enabled = true,
  enableRealTime = true,
  autoMarkAsRead = false,
}: UseNotificationsOptions): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasRealTime, setHasRealTime] = useState(false);
  const subscriptionRef = useRef<any>(null);

  const processNotifications = useCallback((fetchedNotifications: Notification[]) => {
    const sorted = fetchedNotifications.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setNotifications(sorted);

    const unreadCount = fetchedNotifications.filter((n) => !n.isRead).length;
    setStats({
      total: fetchedNotifications.length,
      unread: unreadCount,
      read: fetchedNotifications.length - unreadCount,
    });
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!clerkId || !enabled) return;

    setIsLoading(true);
    try {
      const query = `*[_type == "notification" && userId == $clerkId] {
        _id,
        _createdAt,
        userId,
        title,
        message,
        type,
        isRead,
        relatedEventId,
        actionUrl,
        scheduledAt,
        expiresAt,
        createdAt
      } | order(createdAt desc)`;

      const fetchedNotifications = await client.fetch(query, { clerkId });
      processNotifications(fetchedNotifications);
      setError(null);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch notifications"));
    } finally {
      setIsLoading(false);
    }
  }, [clerkId, enabled, processNotifications]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
      );
      setStats((prev) =>
        prev
          ? { ...prev, unread: Math.max(0, prev.unread - 1), read: prev.read + 1 }
          : null
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
      throw err;
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.isRead);
      if (unreadNotifications.length === 0) return;

      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: clerkId }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setStats((prev) => (prev ? { ...prev, unread: 0, read: prev.total } : null));
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      throw err;
    }
  }, [notifications, clerkId]);

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }

      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
      setStats((prev) => (prev ? { ...prev, total: prev.total - 1 } : null));
    } catch (err) {
      console.error("Error deleting notification:", err);
      throw err;
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Real-time subscription
  useEffect(() => {
    if (!enableRealTime || !clerkId || !enabled) {
      setHasRealTime(false);
      return;
    }

    let subscription: any;

    const setupSubscription = () => {
      try {
        const observable = client.listen(
          `*[_type == "notification" && userId == $clerkId]`,
          { clerkId },
          {
            includeResult: true,
            visibility: "query",
          }
        );

        subscription = observable.subscribe(
          ({ result, type }: any) => {
            if (result) {
              fetchNotifications();
              setHasRealTime(true);
            }
          },
          (err: Error) => {
            console.error("Notification subscription error:", err);
            setHasRealTime(false);
            setTimeout(setupSubscription, 3000);
          }
        );
      } catch (err) {
        console.error("Failed to set up notification subscription:", err);
        setHasRealTime(false);
      }
    };

    setupSubscription();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [clerkId, enabled, enableRealTime, fetchNotifications]);

  return {
    notifications,
    stats,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch: fetchNotifications,
    hasRealTime,
  };
}

export function getNotificationIcon(type: string): string {
  return NOTIFICATION_TYPE_ICONS[type] || "📬";
}

export function getNotificationColor(type: string): string {
  return NOTIFICATION_TYPE_COLORS[type] || NOTIFICATION_TYPE_COLORS.system;
}

export function getNotificationTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    event_reminder: "Event Reminder",
    event_update: "Event Update",
    ai_suggestion: "AI Suggestion",
    system: "System",
    success: "Success",
    warning: "Warning",
  };
  return labels[type] || type;
}
