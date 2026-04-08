export default {
  name: "review",
  title: "User Reviews",
  type: "document",
  fields: [
    {
      name: "userId",
      title: "User ID (Clerk)",
      type: "string",
      validation: (Rule: any) => Rule.required(),
      description: "Clerk user ID who wrote the review",
    },
    {
      name: "userName",
      title: "User Name",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "userEmail",
      title: "User Email",
      type: "string",
      validation: (Rule: any) => Rule.required().email(),
    },
    {
      name: "userProfilePic",
      title: "User Profile Picture URL",
      type: "url",
      validation: (Rule: any) => Rule.optional(),
    },
    {
      name: "eventId",
      title: "Event (Optional)",
      type: "reference",
      to: [{ type: "event" }],
      description: "Link to specific event (optional for general reviews)",
    },
    {
      name: "reviewText",
      title: "Review Text",
      type: "text",
      rows: 4,
      validation: (Rule: any) => Rule.required().min(10).max(1000),
    },
    {
      name: "rating",
      title: "Rating",
      type: "number",
      validation: (Rule: any) => Rule.required().min(1).max(5),
      options: {
        list: [
          { title: "1 Star", value: 1 },
          { title: "2 Stars", value: 2 },
          { title: "3 Stars", value: 3 },
          { title: "4 Stars", value: 4 },
          { title: "5 Stars", value: 5 },
        ],
        layout: "radio",
      },
    },
    {
      name: "isApproved",
      title: "Approved",
      type: "boolean",
      initialValue: false,
      description: "Approve review to display on landing page",
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
      userName: "userName",
      rating: "rating",
      reviewText: "reviewText",
      createdAt: "createdAt",
    },
    prepare(selection: any) {
      const { userName, rating, reviewText, createdAt } = selection;
      const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
      const dateStr = createdAt ? new Date(createdAt).toLocaleDateString() : "No date";
      return {
        title: `${userName} - ${stars}`,
        subtitle: `${dateStr} • ${reviewText?.slice(0, 50)}...`,
      };
    },
  },
};
