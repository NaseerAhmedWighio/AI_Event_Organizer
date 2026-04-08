# AI Event Organizer - Production Deployment Guide

## 📁 Project Structure

```
ai-event-organizer/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── dashboard/                # Protected dashboard routes
│   │   │   ├── analytics/            # Analytics page
│   │   │   ├── events/               # Event management pages
│   │   │   │   ├── [eventId]/        # Event detail page
│   │   │   │   └── new/              # Create event page
│   │   │   ├── ai-assistant/         # AI assistant page
│   │   │   ├── planner/              # Event planner page
│   │   │   ├── settings/             # User settings
│   │   │   ├── page.tsx              # Dashboard home
│   │   │   ├── loading.tsx           # Dashboard loading state
│   │   │   └── error.tsx             # Dashboard error boundary
│   │   ├── sign-in/                  # Clerk sign-in page
│   │   ├── sign-up/                  # Clerk sign-up page
│   │   ├── api/                      # API endpoints
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Landing page
│   │   ├── globals.css               # Global styles
│   │   └── loading.tsx               # Global loading state
│   │
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── sonner.tsx            # Toast notifications
│   │   │   └── ...
│   │   │
│   │   ├── analytics/                # Analytics components
│   │   │   ├── dashboard-stats.tsx   # Stats cards
│   │   │   ├── monthly-events-chart.tsx
│   │   │   ├── status-pie-chart.tsx
│   │   │   ├── category-performance.tsx
│   │   │   ├── category-breakdown.tsx
│   │   │   └── analytics-chart.tsx
│   │   │
│   │   ├── dashboard/                # Dashboard components
│   │   │   ├── dashboard-stats.tsx
│   │   │   ├── event-card.tsx
│   │   │   ├── delete-event-button.tsx
│   │   │   └── generate-ai-plan-button.tsx
│   │   │
│   │   ├── layout/                   # Layout components
│   │   │   ├── dashboard-layout.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── navbar.tsx
│   │   │   └── header.tsx
│   │   │
│   │   ├── landing/                  # Landing page components
│   │   ├── planner/                  # Event planner components
│   │   └── providers.tsx             # Context providers
│   │
│   ├── actions/                      # Server Actions
│   │   ├── eventActions.ts           # Event CRUD operations
│   │   ├── analyticsActions.ts       # Analytics data fetching
│   │   ├── aiPlanActions.ts          # AI plan generation
│   │   └── reviewActions.ts          # Review management
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useEvents.ts              # Events data + real-time
│   │   ├── useAnalytics.ts           # Analytics data + real-time
│   │   └── use-toast.ts              # Toast notifications
│   │
│   ├── lib/                          # Utilities & configurations
│   │   ├── sanityClient.ts           # Sanity client setup
│   │   ├── groqQueries.ts            # All GROQ queries
│   │   ├── openai.ts                 # OpenAI/OpenRouter setup
│   │   └── utils.ts                  # Helper functions
│   │
│   └── schemas/                      # Zod validation schemas
│       ├── event.ts
│       ├── aiPlan.ts
│       └── review.ts
│
├── sanity/                           # Sanity Studio
│   ├── schemaTypes/                  # Sanity schemas
│   │   ├── event.ts
│   │   ├── user.ts
│   │   └── analyticsSnapshot.ts
│   ├── schemaTypes.ts                # Schema index
│   ├── config.ts                     # Sanity config
│   └── cli.ts                        # Sanity CLI
│
├── public/                           # Static assets
├── .env.example                      # Environment variables template
├── .env.local                        # Local environment (gitignored)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── README.md
```

## 🚀 Pre-Deployment Checklist

### 1. Environment Variables

Ensure all environment variables are set in Vercel:

```env
# Sanity.io
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# OpenRouter
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=arcee-ai/trinity-large-preview:free

# Optional
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_DEBUG=false
```

### 2. Sanity Setup

1. **Create Sanity Project** (if not done):
   ```bash
   npm run sanity:start
   ```

2. **Deploy Sanity Studio**:
   ```bash
   npm run sanity:deploy
   ```

3. **Verify Schemas**:
   - Event schema with all required fields
   - User schema (optional)
   - Analytics Snapshot schema (optional)

4. **Generate API Token**:
   - Go to Sanity Dashboard → Project Settings → API
   - Create token with **Editor** or **Admin** permissions
   - Add to environment variables

### 3. Clerk Setup

1. **Create Clerk Application**:
   - Go to [clerk.com](https://clerk.com)
   - Create new application
   - Copy publishable key and secret key

2. **Configure OAuth Providers** (optional):
   - Google, GitHub, etc.

3. **Set Redirect URLs**:
   - Add your production domain to allowed redirect URLs

### 4. OpenRouter Setup

1. **Get API Key**:
   - Visit [openrouter.ai](https://openrouter.ai)
   - Create account and generate API key

2. **Choose Model**:
   - Default: `arcee-ai/trinity-large-preview:free`
   - Or select from available models

## 📦 Deployment Steps

### Deploy to Vercel

#### Option 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link project
vercel link

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

#### Option 2: GitHub Integration

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import from GitHub
   - Select repository
   - Add environment variables
   - Click "Deploy"

### Post-Deployment

1. **Verify Deployment**:
   - Visit your production URL
   - Test authentication flow
   - Create a test event
   - Check analytics page

2. **Set Up Custom Domain** (optional):
   - Go to Vercel Project Settings → Domains
   - Add your domain
   - Configure DNS records

3. **Enable Analytics** (optional):
   - Vercel Analytics
   - Sanity Real-time dashboard

## 🔧 Configuration

### Next.js Configuration (`next.config.ts`)

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['cdn.sanity.io', 'images.clerk.dev'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.sanity.io',
      },
    ],
  },
  // Enable static exports if needed
  // output: 'export',
};

export default nextConfig;
```

### Tailwind Configuration

The project uses Tailwind CSS v4 with the following features:
- Indigo → Cyan gradient system
- Dark mode support
- Custom animations
- Responsive breakpoints

### TypeScript Configuration

Strict type checking is enabled. All server actions and hooks are fully typed.

## 📊 Monitoring & Maintenance

### Sanity Dashboard

- Monitor content changes
- View real-time updates
- Manage event data
- Check API usage

### Vercel Dashboard

- View deployment logs
- Monitor performance
- Set up alerts
- Analyze traffic

### Clerk Dashboard

- Monitor user sign-ups
- View authentication logs
- Manage user sessions

## 🐛 Troubleshooting

### Common Issues

#### 1. "Failed to fetch events"
- Check Sanity API token permissions
- Verify project ID and dataset
- Ensure GROQ queries are valid

#### 2. Authentication errors
- Verify Clerk keys are correct
- Check middleware configuration
- Ensure redirect URLs are whitelisted

#### 3. Real-time not working
- Check Sanity CORS settings
- Verify subscription query syntax
- Ensure WebSocket connection is allowed

#### 4. Build failures
- Run `npm run type-check` locally
- Check for missing environment variables
- Verify all imports are correct

### Debug Mode

Enable debug mode in `.env.local`:
```env
NEXT_PUBLIC_DEBUG=true
```

This will show additional console logs for troubleshooting.

## 📈 Performance Optimization

### Implemented Optimizations

1. **Server Components**: Data fetching done on server
2. **Incremental Static Regeneration (ISR)**: Cached with revalidation
3. **Real-time Subscriptions**: Only for interactive pages
4. **Code Splitting**: Automatic with Next.js
5. **Image Optimization**: Next.js Image component

### Additional Recommendations

1. **Enable Vercel Caching**:
   ```typescript
   // In server components
   export const revalidate = 3600; // 1 hour
   ```

2. **Use Edge Functions** (if needed):
   ```typescript
   export const runtime = 'edge';
   ```

3. **Optimize Images**:
   - Use WebP format
   - Proper sizing
   - Lazy loading

## 🔐 Security Best Practices

1. **Environment Variables**: Never commit `.env.local`
2. **API Tokens**: Rotate regularly
3. **CORS**: Configure in Sanity dashboard
4. **Rate Limiting**: Enable in Clerk settings
5. **Input Validation**: All forms use Zod schemas

## 📝 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://sanity.io/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [OpenRouter Documentation](https://openrouter.ai/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Recharts Documentation](https://recharts.org)

## 🎉 Success Criteria

Your deployment is successful when:

- ✅ Landing page loads correctly
- ✅ Authentication works (sign up/sign in)
- ✅ Dashboard displays stats
- ✅ Can create new events
- ✅ Events appear in real-time
- ✅ Analytics page shows charts
- ✅ Mobile responsive design works
- ✅ Dark mode functions properly

---

**Built with ❤️ for production**

For support, check the documentation or contact the development team.
