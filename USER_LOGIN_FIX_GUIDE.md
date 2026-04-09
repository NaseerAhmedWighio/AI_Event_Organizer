# User Login Fix & Management Guide

## 🔧 Issues Fixed

### 1. Login Issue - Password Incorrect Error
**Problem**: Login was failing even with correct password

**Root Cause**: 
- The `findUserByEmail` and `findUserById` queries were mapping `_id` incorrectly
- The `updateLastLogin` function was using `userId` instead of Sanity's `_id`

**Fix Applied**:
- ✅ Updated queries to return both `_id` (Sanity doc ID) and `userId` (custom ID)
- ✅ Fixed `updateLastLogin` to find the Sanity `_id` first before patching
- ✅ Updated `StoredUser` interface to include both `_id` and `userId` fields

### 2. User Viewing System
**What Was Added**:
- ✅ New API endpoint: `/api/admin/users` - Returns all users with credentials
- ✅ Admin page: `/admin/users` - Beautiful UI to view all users
- ✅ Password visibility toggle
- ✅ Copy to clipboard functionality
- ✅ Password testing interface

### 3. Complete Plan Button
**What Was Added**:
- ✅ "Complete Plan" button in AI Plan section header
- ✅ Shows only for upcoming events
- ✅ Marks event as completed
- ✅ Redirects to completed events page
- ✅ Loading state and toast notifications

---

## 📋 How to View All Users & Passwords

### Method 1: Admin UI (Recommended)
1. Start your app: `npm run dev`
2. Login to your account
3. Navigate to: `http://localhost:3000/admin/users`
4. You'll see:
   - All registered users
   - Email addresses
   - Password hashes (click eye icon to reveal)
   - User IDs
   - Creation dates
   - Last login times

### Method 2: API Endpoint
```bash
# While logged in, call the API
curl http://localhost:3000/api/admin/users
```

### Method 3: Direct Sanity Query
You can also query Sanity directly:
```typescript
import { client } from '@/lib/sanityClient';

const users = await client.fetch(`*[_type == "user"] {
  _id,
  userId,
  email,
  password,
  firstName,
  lastName,
  createdAt,
  lastLoginAt
}`);

console.log(users);
```

---

## 🔐 Testing Password for a User

### Option 1: Use the Login Page
1. Go to `http://localhost:3000/sign-in`
2. Enter the user's email
3. Try different passwords until one works

### Option 2: Use the Admin Page
1. Go to `/admin/users`
2. Expand "Test Password Verification" for a user
3. Enter a password to test

### Option 3: Create a Test Script
Create a file `test-password.js`:
```javascript
const bcrypt = require('bcryptjs');

// The hashed password from your database
const hashedPassword = '$2b$10$CX.TiK7fYPMVqjVRfyw7UOkVbp9ZZhAhn5YPEF6Vo7BkiXuBuZJCy';

// Test password
const testPassword = 'your-test-password';

// Verify
bcrypt.compare(testPassword, hashedPassword).then(match => {
  console.log('Password match:', match);
});
```

---

## 🎯 New Features Added

### 1. Complete Plan Button
**Location**: Event detail page → AI Plan section header

**Functionality**:
- Only shows for events with "upcoming" status
- Clicking it marks the event as completed
- Shows success toast notification
- Redirects to `/dashboard/events/completed` page
- Has loading state while processing

**UI**:
- Green gradient button with CheckCircle icon
- Shows "Complete Plan" when not clicked
- Shows "Completing..." with spinner while processing

### 2. Admin Users Page
**Route**: `/admin/users`

**Features**:
- View all registered users
- Toggle password hash visibility
- Copy user details to clipboard
- View creation dates and last login times
- Test password verification interface

**Security Note**: This page should be protected with admin-only access in production!

---

## 🧪 Testing the Login Fix

### Step 1: Verify Your User Exists
```bash
# Check the data/users.json file
cat data/users.json
```

You should see your user:
```json
{
  "id": "user_1775668940152_3r2xx7igw",
  "email": "naseerahmedwighio@gmail.com",
  "firstName": "Naseer",
  "lastName": "Ahmed",
  "password": "$2b$10$CX.TiK7fYPMVqjVRfyw7UOkVbp9ZZhAhn5YPEF6Vo7BkiXuBuZJCy"
}
```

### Step 2: Check Sanity Database
Your user should also exist in Sanity CMS. You can verify via:
1. Sanity Studio dashboard
2. Or the `/admin/users` page

### Step 3: Test Login
1. Go to `http://localhost:3000/sign-in`
2. Enter: `naseerahmedwighio@gmail.com`
3. Enter your password
4. Should login successfully!

### Step 4: If Still Having Issues
Check the browser console for errors and look at the server logs. The most common issues are:
- Wrong password (try resetting it)
- User doesn't exist in Sanity (re-register)
- JWT_SECRET environment variable not set

---

## 📝 Creating a New User (If Needed)

### Via Sign-Up Page
1. Go to `http://localhost:3000/sign-up`
2. Fill in your details
3. Submit the form
4. User will be created in Sanity with hashed password

### Via API
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

---

## 🚀 Next Steps

1. **Test Login**: Try logging in with your credentials
2. **View Users**: Go to `/admin/users` to see all users
3. **Test Complete Button**: 
   - Create an event
   - Generate AI plan
   - Click "Complete Plan" button
   - Verify redirect to completed events

---

## ⚠️ Security Notes

1. **Remove Password Exposure in Production**
   - The `/api/admin/users` endpoint exposes password hashes
   - Add admin role checking before exposing in production
   - Consider removing password display entirely

2. **Secure JWT_SECRET**
   - Make sure your `.env.local` has a strong JWT_SECRET
   - Never commit it to version control

3. **Password Hashing**
   - Passwords are properly hashed with bcrypt (10 rounds)
   - Never store or display plain text passwords

---

## 🐛 Troubleshooting

### Login Still Failing?
1. Check browser console for errors
2. Check server logs for error messages
3. Verify user exists in Sanity:
   ```bash
   # In Sanity Studio or via API
   *[_type == "user"]
   ```
4. Try registering a new user and test with that

### Complete Button Not Working?
1. Make sure event status is "upcoming"
2. Check that AI plan has been generated
3. Look for error toasts or console errors
4. Verify `markEventAsCompleted` action is working

### Can't Access /admin/users?
1. Make sure you're logged in
2. The route requires authentication
3. Check middleware.ts if it's blocking access

---

**Updated**: 2026-04-09
**Status**: All fixes applied and ready for testing! ✅
