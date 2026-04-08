export default {
  name: "event",
  title: "Events",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Event Title",
      type: "string",
      validation: (Rule: any) => Rule.required().min(3).max(100),
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (Rule: any) => Rule.required().min(10),
    },
    {
      name: "date",
      title: "Event Date & Time",
      type: "datetime",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "location",
      title: "Location",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Upcoming", value: "upcoming" },
          { title: "Completed", value: "completed" },
          { title: "Cancelled", value: "cancelled" },
        ],
        layout: "radio",
      },
      initialValue: "upcoming",
    },
    {
      name: "attendees",
      title: "Attendees (Emails)",
      type: "array",
      of: [{ type: "string" }],
      description: "List of attendee email addresses",
    },
    {
      name: "createdBy",
      title: "Created By (Clerk ID)",
      type: "string",
      validation: (Rule: any) => Rule.required(),
      description: "Clerk user ID who created this event",
    },
    {
      name: "budget",
      title: "Budget",
      type: "string",
      description: "Event budget (e.g., $500, $1000-2000)",
    },
    {
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Conference", value: "conference" },
          { title: "Workshop", value: "workshop" },
          { title: "Meetup", value: "meetup" },
          { title: "Wedding", value: "wedding" },
          { title: "Birthday", value: "birthday" },
          { title: "Corporate", value: "corporate" },
          { title: "Other", value: "other" },
        ],
      },
      initialValue: "other",
    },
  ],
  preview: {
    select: {
      title: "title",
      date: "date",
      location: "location",
      createdBy: "createdBy",
    },
    prepare(selection: any) {
      const { title, date, location } = selection;
      const dateStr = date ? new Date(date).toLocaleDateString() : "No date";
      return {
        title,
        subtitle: `${dateStr} • ${location}`,
      };
    },
  },
};
