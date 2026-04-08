export default {
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    {
      name: 'userId',
      title: 'User ID',
      type: 'string',
      description: 'Unique identifier for the user',
      validation: (Rule: any) => Rule.required().unique(),
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule: any) => Rule.required().email(),
    },
    {
      name: 'password',
      title: 'Password Hash',
      type: 'string',
      hidden: true,
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'firstName',
      title: 'First Name',
      type: 'string',
    },
    {
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
    },
    {
      name: 'profileImageUrl',
      title: 'Profile Image URL',
      type: 'url',
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    },
    {
      name: 'lastLoginAt',
      title: 'Last Login',
      type: 'datetime',
    },
  ],
  orderings: [
    {
      title: 'Creation Date (Newest)',
      name: 'createdDesc',
      by: [
        {field: 'createdAt', order: 'desc'}
      ]
    }
  ]
};
