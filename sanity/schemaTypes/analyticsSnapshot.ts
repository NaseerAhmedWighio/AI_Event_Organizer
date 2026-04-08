export default {
  name: "analyticsSnapshot",
  title: "Analytics Snapshots",
  type: "document",
  fields: [
    {
      name: "userId",
      title: "User ID",
      type: "string",
      validation: (Rule: any) => Rule.required(),
      description: "User ID this analytics snapshot belongs to",
    },
    {
      name: "snapshotDate",
      title: "Snapshot Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "totalEvents",
      title: "Total Events",
      type: "number",
      readOnly: true,
    },
    {
      name: "upcomingEvents",
      title: "Upcoming Events",
      type: "number",
      readOnly: true,
    },
    {
      name: "completedEvents",
      title: "Completed Events",
      type: "number",
      readOnly: true,
    },
    {
      name: "cancelledEvents",
      title: "Cancelled Events",
      type: "number",
      readOnly: true,
    },
    {
      name: "totalAttendees",
      title: "Total Attendees",
      type: "number",
      readOnly: true,
    },
    {
      name: "totalAIPlans",
      title: "Total AI Plans",
      type: "number",
      readOnly: true,
    },
    {
      name: "eventsByCategory",
      title: "Events by Category",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "category", type: "string" },
            { name: "count", type: "number" },
          ],
          preview: {
            select: {
              category: "category",
              count: "count",
            },
            prepare: (selection: any) => ({
              title: selection.category,
              subtitle: `${selection.count} events`,
            }),
          },
        },
      ],
      readOnly: true,
    },
    {
      name: "period",
      title: "Period",
      type: "string",
      options: {
        list: [
          { title: "Daily", value: "daily" },
          { title: "Weekly", value: "weekly" },
          { title: "Monthly", value: "monthly" },
        ],
      },
      initialValue: "daily",
    },
  ],
  preview: {
    select: {
      title: "userId",
      date: "snapshotDate",
      totalEvents: "totalEvents",
    },
    prepare(selection: any) {
      const { title, date, totalEvents } = selection;
      const dateStr = date ? new Date(date).toLocaleDateString() : "No date";
      return {
        title: `Analytics for ${title?.slice(0, 8)}...`,
        subtitle: `${dateStr} • ${totalEvents || 0} total events`,
      };
    },
  },
};
