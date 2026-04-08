"use client";

import { useState } from "react";
import { useUser } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useNotifications, getNotificationIcon, getNotificationColor, getNotificationTypeLabel } from "@/hooks/useNotifications";
import { Bell, Check, CheckCheck, Trash2, ExternalLink, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

export function NotificationDropdown() {
  const { user } = useUser();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const {
    notifications,
    stats,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications({
    userId: user?.id || "",
    enabled: !!user,
    enableRealTime: true,
  });

  const handleNotificationClick = async (notification: any) => {
    // Try to mark as read, but don't block navigation if it fails
    if (!notification.isRead) {
      try {
        await markAsRead(notification._id);
      } catch (error) {
        console.warn("Failed to mark notification as read:", error);
        // Continue anyway - don't block navigation
      }
    }
    
    // Always navigate to the action URL if it exists
    if (notification.actionUrl) {
      setIsOpen(false);
      router.push(notification.actionUrl);
    }
  };

  const handleDelete = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    await deleteNotification(notificationId);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-xl hover:bg-muted transition-colors"
        >
          <Bell className="h-5 w-5" />
          {stats && stats.unread > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold rounded-full"
            >
              {stats.unread > 99 ? "99+" : stats.unread}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80 md:w-96 p-0" align="end">
        <DropdownMenuLabel className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <span>Notifications</span>
            {stats && (
              <Badge variant="secondary" className="ml-2">
                {stats.total}
              </Badge>
            )}
          </div>
          {stats && stats.unread > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-8 text-xs"
            >
              <CheckCheck className="h-4 w-4 mr-1" />
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>

        <ScrollArea className="max-h-[400px]">
          {isLoading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Inbox className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No notifications yet
              </p>
              <p className="text-xs text-muted-foreground/50 mt-1">
                We&apos;ll notify you when something arrives
              </p>
            </div>
          ) : (
            <DropdownMenuGroup className="p-2">
              {notifications.map((notification) => (
                <div key={notification._id} className="relative">
                  <DropdownMenuItem
                    className={`flex flex-col items-start gap-2 p-4 cursor-pointer transition-colors ${
                      !notification.isRead
                        ? "bg-blue-50/50 dark:bg-blue-900/10"
                        : ""
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center text-lg shrink-0 ${getNotificationColor(
                          notification.type
                        )}`}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={`text-sm font-medium ${
                              !notification.isRead
                                ? "text-foreground"
                                : "text-foreground/80"
                            }`}
                          >
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <div className="h-2 w-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant="outline"
                            className="text-xs"
                          >
                            {getNotificationTypeLabel(notification.type)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(
                              new Date(notification.createdAt),
                              { addSuffix: true }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {notification.actionUrl && (
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    )}
                  </DropdownMenuItem>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7 opacity-0 hover:opacity-100 transition-opacity"
                    onClick={(e) => handleDelete(e, notification._id)}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-red-500" />
                  </Button>

                  <DropdownMenuSeparator className="last:hidden" />
                </div>
              ))}
            </DropdownMenuGroup>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <DropdownMenuSeparator />
        )}

        {notifications.length > 0 && (
          <div className="p-3 text-center">
            <Button variant="ghost" size="sm" className="w-full text-xs">
              View all notifications
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
