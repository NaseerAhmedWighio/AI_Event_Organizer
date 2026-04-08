export default {
  name: "aiPlan",
  title: "AI Event Plans",
  type: "document",
  fields: [
    {
      name: "event",
      title: "Event",
      type: "reference",
      to: [{ type: "event" }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "schedule",
      title: "Event Schedule",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "time",
              title: "Time",
              type: "string",
              description: "e.g., 09:00 AM, 14:30 PM",
            },
            {
              name: "activity",
              title: "Activity",
              type: "string",
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "duration",
              title: "Duration (minutes)",
              type: "number",
            },
            {
              name: "location",
              title: "Location",
              type: "string",
            },
            {
              name: "notes",
              title: "Notes",
              type: "text",
              rows: 2,
            },
          ],
          preview: {
            select: {
              time: "time",
              activity: "activity",
              duration: "duration",
            },
            prepare(selection: any) {
              const { time, activity, duration } = selection;
              return {
                title: `${time} - ${activity}`,
                subtitle: duration ? `${duration} min` : undefined,
              };
            },
          },
        },
      ],
    },
    {
      name: "budget",
      title: "Budget Breakdown",
      type: "text",
      description: "Detailed budget breakdown from AI",
      rows: 5,
    },
    {
      name: "suggestions",
      title: "AI Suggestions",
      type: "text",
      description: "General AI suggestions for the event",
      rows: 5,
    },
    {
      name: "guestIdeas",
      title: "Guest Ideas",
      type: "array",
      of: [{ type: "string" }],
      description: "AI-generated guest list ideas or types",
    },
    {
      name: "vendorRecommendations",
      title: "Vendor Recommendations",
      type: "text",
      description: "AI-suggested vendors or services",
      rows: 3,
    },
    {
      name: "checklist",
      title: "Planning Checklist",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "task",
              title: "Task",
              type: "string",
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "completed",
              title: "Completed",
              type: "boolean",
              initialValue: false,
            },
            {
              name: "priority",
              title: "Priority",
              type: "string",
              options: {
                list: [
                  { title: "High", value: "high" },
                  { title: "Medium", value: "medium" },
                  { title: "Low", value: "low" },
                ],
              },
            },
          ],
          preview: {
            select: {
              task: "task",
              completed: "completed",
              priority: "priority",
            },
            prepare(selection: any) {
              const { task, completed, priority } = selection;
              return {
                title: task,
                subtitle: `${completed ? "✓" : "○"} • ${priority || "medium"}`,
              };
            },
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      eventTitle: "event.title",
      eventDate: "event.date",
    },
    prepare(selection: any) {
      const { eventTitle, eventDate } = selection;
      return {
        title: `AI Plan: ${eventTitle}`,
        subtitle: eventDate ? new Date(eventDate).toLocaleDateString() : undefined,
      };
    },
  },
};
