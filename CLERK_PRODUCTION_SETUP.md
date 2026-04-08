# 🔧 How to Fix Clerk Authentication on Vercel

## ❌ Current Problem
Your Vercel deployment is using **TEST Clerk keys** (`pk_test_` and `sk_test_`) which only work on `localhost`. Production deployments require **PRODUCTION keys** (`pk_prod_` and `sk_prod_`).

## ✅ Solution: Get Production Clerk Keys

### Step 1: Access Clerk Dashboard
1. Go to https://dashboard.clerk.com
2. Sign in and select your application: **"AI Event Organizer"** or **"prime-bengal-17"**

### Step 2: Configure Production Environment
1. Click on **"API Keys"** in the left sidebar
2. Switch to the **"Production"** tab (currently you're on "Test")
3. If production is not activated:
   - Click **"Activate production"** or **"Configure production"**
   - Add your production domain: `ai-event-organizers.vercel.app`
   - Complete the setup wizard
   - Verify your email if prompted

### Step 3: Copy Production Keys
Once production is activated, you'll see:
- **Publishable Key**: `pk_prod_xxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **Secret Key**: `sk_prod_xxxxxxxxxxxxxxxxxxxxxxxxxxxx`

**⚠️ Important:** These keys start with `pk_prod_` and `sk_prod_` (NOT `pk_test_` or `sk_test_`)

### Step 4: Update Vercel Environment Variables

1. Go to https://vercel.com
2. Select your project: **ai-event-organizers**
3. Click on **"Settings"** (top menu)
4. Click on **"Environment Variables"** (left sidebar)

5. **Update** these variables with your **PRODUCTION** keys:

   | Variable Name | Value | Environment |
   |---------------|-------|-------------|
   | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_prod_...` (your production key) | Production, Preview, Development |
   | `CLERK_SECRET_KEY` | `sk_prod_...` (your production key) | Production, Preview, Development |

6. Make sure to select **ALL environments** (Production, Preview, Development) when adding/updating

### Step 5: Verify Other Environment Variables

Make sure these are also set in Vercel:

| Variable Name | Value |
|---------------|-------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `2qtywgk1` |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `SANITY_API_TOKEN` | Your Sanity token |
| `OPENROUTER_API_KEY` | Your OpenRouter API key |
| `OPENROUTER_MODEL` | `arcee-ai/trinity-large-preview:free` |

### Step 6: Redeploy

After updating the environment variables:

1. Go to Vercel Dashboard → Your Project
2. Click on **"Deployments"** tab
3. Click on the latest deployment
4. Click the **"..."** (more options) menu
5. Click **"Redeploy"**
6. Confirm the redeployment

OR simply push a new commit to trigger automatic redeployment.

## 🔍 How to Verify It's Working

After redeployment:

1. Visit: https://ai-event-organizers.vercel.app
2. Click **"Sign In"**
3. You should **NOT** see the warning: *"Clerk has been loaded with development keys"*
4. Sign in with your account
5. You should be redirected to `/dashboard` and it should load properly

## 🆘 Still Not Working?

### Check Browser Console
1. Open your deployed site
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Look for any Clerk-related errors

### Check Vercel Logs
1. Go to Vercel Dashboard
2. Click on **"Deployments"**
3. Click on the latest deployment
4. Click on **"Functions"** tab
5. Check for any server-side errors

### Common Issues:

**Issue:** "Invalid publishable key"
- **Fix:** Make sure you're using `pk_prod_` not `pk_test_`

**Issue:** "Domain not allowed"
- **Fix:** In Clerk Dashboard → Production → Domains, add `ai-event-organizers.vercel.app`

**Issue:** Still seeing development keys warning
- **Fix:** Clear your browser cache and cookies, then hard refresh (Ctrl+Shift+R)

## 📝 Quick Reference

### Test Keys (❌ WRONG for Vercel)
- `pk_test_...` - Only for localhost development
- `sk_test_...` - Only for localhost development

### Production Keys (✅ CORRECT for Vercel)
- `pk_prod_...` - Use this in Vercel
- `sk_prod_...` - Use this in Vercel

---

## 🎯 Summary

1. ✅ Get **production keys** from Clerk Dashboard
2. ✅ Add them to **Vercel Environment Variables**
3. ✅ **Redeploy** your application
4. ✅ Test the authentication flow

Your authentication will work perfectly once you switch to production keys! 🚀
