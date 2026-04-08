export default {
  name: "notification",
  title: "Notifications",
  type: "document",
  fields: [
    {
      name: "userId",
      title: "User ID (Clerk)",
      type: "string",
      validation: (Rule: any) => Rule.required(),
      description: "Clerk user ID this notification belongs to",
    },
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule: any) => Rule.required().max(100),
    },
    {
      name: "message",
      title: "Message",
      type: "text",
      rows: 3,
      validation: (Rule: any) => Rule.required().max(500),
    },
    {
      name: "type",
      title: "Notification Type",
      type: "string",
      options: {
        list: [
          { title: "Event Reminder", value: "event_reminder" },
          { title: "Event Update", value: "event_update" },
          { title: "AI Suggestion", value: "ai_suggestion" },
          { title: "System", value: "system" },
          { title: "Success", value: "success" },
          { title: "Warning", value: "warning" },
        ],
      },
      initialValue: "system",
    },
    {
      name: "isRead",
      title: "Is Read",
      type: "boolean",
      initialValue: false,
    },
    {
      name: "relatedEventId",
      title: "Related Event ID",
      type: "string",
      description: "Reference to related event (optional)",
    },
    {
      name: "actionUrl",
      title: "Action URL",
      type: "string",
      description: "URL to navigate when notification is clicked (optional)",
    },
    {
      name: "scheduledAt",
      title: "Scheduled At",
      type: "datetime",
      description: "When to show this notification",
    },
    {
      name: "expiresAt",
      title: "Expires At",
      type: "datetime",
      description: "When this notification should be removed",
    },
    {
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    },
  ],
  preview: {
    select: {
      title: "title",
      message: "message",
      type: "type",
      isRead: "isRead",
      createdAt: "createdAt",
    },
    prepare(selection: any) {
      const { title, message, type, isRead, createdAt } = selection;
      const dateStr = createdAt ? new Date(createdAt).toLocaleDateString() : "No date";
      const status = isRead ? "Read" : "Unread";
      return {
        title,
        subtitle: `${message?.slice(0, 50)}... • ${type} • ${status} • ${dateStr}`,
      };
    },
  },
};
