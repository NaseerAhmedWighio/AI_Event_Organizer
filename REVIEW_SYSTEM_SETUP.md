# Review System Setup Guide

## Overview
The review system allows logged-in users to submit reviews that are stored in Sanity CMS and displayed on the landing page after admin approval.

## Components Involved

### 1. Review Schema (`src/schemas/review.ts`)
Defines the structure of reviews in Sanity:
- `userId`: Clerk user ID
- `userName`: User's display name
- `userEmail`: User's email
- `eventId`: Optional reference to an event
- `reviewText`: The review content (10-1000 characters)
- `rating`: 1-5 star rating
- `isApproved`: Admin approval status (default: false)
- `createdAt`: Timestamp

### 2. Review Actions (`src/actions/reviewActions.ts`)
Server actions for review operations:
- `createReview()`: Creates a new review (requires validation)
- `getApprovedReviews()`: Fetches all approved reviews for display
- `getReviewsForEvent()`: Fetches reviews for a specific event
- `updateReview()`: Updates review (admin use)
- `deleteReview()`: Deletes review (admin use)

### 3. Reviews Section Component (`src/components/landing/reviews-section.tsx`)
The UI component that:
- Shows review submission form for logged-in users
- Shows sign-in prompt for non-authenticated users
- Displays approved reviews in a grid layout
- Handles form submission with validation
- Shows toast notifications for success/error states

### 4. Toaster Component (`src/components/ui/toaster.tsx`)
Displays toast notifications for user feedback.

## Setup Instructions

### Step 1: Configure Sanity CMS

1. **Create a Sanity Project** (if you haven't already):
   ```bash
   npm create sanity@latest
   ```

2. **Get Your Sanity Project ID**:
   - Go to [Sanity Manage](https://www.sanity.io/manage)
   - Select your project
   - Copy the Project ID

3. **Create an API Token**:
   - Go to your Sanity project settings
   - Navigate to "API" section
   - Click "Add API token"
   - Name it (e.g., "AI Event Organizer")
   - Set permissions to "Editor" (to allow creating/updating documents)
   - Copy the token

4. **Update Environment Variables**:
   Edit `.env.local` file with your Sanity credentials:
   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-actual-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=your-actual-api-token
   ```

### Step 2: Deploy Sanity Schema

1. **Install Sanity CLI** (if not already installed):
   ```bash
   npm install -g @sanity/cli
   ```

2. **Login to Sanity**:
   ```bash
   sanity login
   ```

3. **Deploy the Schema**:
   ```bash
   cd sanity
   sanity deploy
   ```

4. **Start Sanity Studio** (for local development):
   ```bash
   sanity dev
   ```
   This will open Sanity Studio at `http://localhost:3333`

### Step 3: Test the Review System

1. **Start the Development Server**:
   ```bash
   npm run dev
   ```

2. **Submit a Test Review**:
   - Navigate to `http://localhost:3000`
   - Sign in with your Clerk account
   - Scroll to the "Loved by Event Planners" section
   - Fill out the review form and submit
   - You should see a success toast notification

3. **Approve the Review in Sanity Studio**:
   - Open Sanity Studio (`http://localhost:3333` or your deployed URL)
   - Navigate to "User Reviews" section
   - Find your submitted review
   - Toggle the "Approved" checkbox to `true`
   - Save the document

4. **Verify the Review Appears**:
   - Refresh the landing page
   - The approved review should now be visible in the reviews grid

## Admin Workflow

### Approving Reviews
1. Open Sanity Studio
2. Go to "User Reviews"
3. Click on a review to edit
4. Toggle "Approved" to `true`
5. Click "Publish"

### Managing Reviews
- **Edit**: Modify review text if needed
- **Delete**: Remove inappropriate reviews
- **Filter**: Use the "isApproved" field to see pending vs approved reviews

## Security Features

1. **Authentication Required**: Only logged-in users can submit reviews
2. **Input Validation**: Zod schema validates all inputs before submission
3. **Email Validation**: Ensures valid email format
4. **Character Limits**: Review text limited to 10-1000 characters
5. **Rating Validation**: Rating must be between 1-5
6. **Approval System**: Reviews require admin approval before public display
7. **User Tracking**: Each review is linked to a Clerk user ID

## Customization Options

### Modify Review Schema
Edit `src/schemas/review.ts` to add/remove fields. After changes, redeploy:
```bash
cd sanity
sanity deploy
```

### Change Review Display
Edit `src/components/landing/reviews-section.tsx` to:
- Change the number of reviews displayed
- Modify the grid layout
- Add sorting/filtering options
- Change styling and animations

### Adjust Validation Rules
Edit `src/actions/reviewActions.ts` and modify the `createReviewSchema`:
```typescript
const createReviewSchema = z.object({
  // Modify validation rules here
  reviewText: z.string().min(10).max(1000), // Change limits
  rating: z.number().min(1).max(5), // Change rating range
});
```

## Troubleshooting

### Reviews Not Submitting
1. Check browser console for errors
2. Verify Sanity environment variables are set correctly
3. Ensure Sanity API token has correct permissions
4. Check network tab for failed API requests

### Reviews Not Appearing After Approval
1. Verify `isApproved` is set to `true` in Sanity Studio
2. Check if `getApprovedReviews()` query is correct
3. Clear Next.js cache: `rm -rf .next`
4. Restart development server

### Toast Notifications Not Showing
1. Verify `Toaster` component is included in `layout.tsx`
2. Check if `useToast` hook is being called correctly
3. Ensure toast component dependencies are installed

## API Reference

### `createReview(input: CreateReviewInput)`
Creates a new review.

**Parameters:**
- `userId`: string - Clerk user ID
- `userName`: string - User's display name
- `userEmail`: string - User's email
- `reviewText`: string - Review content (10-1000 chars)
- `rating`: number - Star rating (1-5)
- `eventId?`: string - Optional event reference

**Returns:**
```typescript
{
  success: boolean,
  review?: SanityDocument,
  error?: string
}
```

### `getApprovedReviews()`
Fetches all approved reviews (up to 10).

**Returns:**
```typescript
{
  success: boolean,
  reviews?: Review[],
  error?: string
}
```

## Next Steps

1. Configure your Sanity project with the environment variables
2. Deploy the schema to Sanity
3. Test the review submission flow
4. Set up admin workflow for approving reviews
5. Customize the UI to match your branding

## Support

For Sanity-related issues:
- [Sanity Documentation](https://www.sanity.io/docs)
- [Sanity Slack Community](https://slack.sanity.io/)

For Clerk authentication issues:
- [Clerk Documentation](https://clerk.com/docs)
