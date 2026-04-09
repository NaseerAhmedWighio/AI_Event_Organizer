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
      type: 'text',
      description: 'Base64 encoded image or URL',
    },
    {
      name: 'role',
      title: 'Role',
      type: 'string',
      options: {
        list: [
          { title: 'Admin', value: 'admin' },
          { title: 'Sub-Admin', value: 'subadmin' },
          { title: 'User', value: 'user' },
        ],
        layout: 'radio',
      },
      initialValue: 'user',
      description: 'User role for access control',
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
