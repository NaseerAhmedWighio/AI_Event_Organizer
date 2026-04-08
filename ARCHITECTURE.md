# AI Event Organizer - Architecture Documentation

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   Landing   │  │  Dashboard  │  │      Analytics          │ │
│  │    Page     │  │    Pages    │  │        Pages            │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
│         │                │                      │               │
│         └────────────────┴──────────────────────┘               │
│                            │                                    │
│              ┌─────────────┴─────────────┐                      │
│              │   React Components + Hooks │                     │
│              │  - useEvents (real-time)   │                     │
│              │  - useAnalytics (real-time)│                     │
│              │  - shadcn/ui components    │                     │
│              └────────────────────────────┘                     │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS
                            │
┌─────────────────────────────────────────────────────────────────┐
│                      Next.js App Router                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  Server Actions │  │  Server Components │  │  API Routes   │ │
│  │  - createEvent  │  │  - Data Fetching   │  │  (if needed)  │ │
│  │  - updateEvent  │  │  - SSR/SSG         │  │               │ │
│  │  - deleteEvent  │  │  - Revalidation    │  │               │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                            │                                    │
│              ┌─────────────┴─────────────┐                      │
│              │    Middleware (Clerk)     │                     │
│              │    - Auth Protection      │                     │
│              │    - User Context         │                     │
│              └────────────────────────────┘                     │
└─────────────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            │               │               │
            │               │               │
    ┌───────▼───────┐ ┌────▼─────┐ ┌──────▼──────┐
    │   Sanity.io   │ │  Clerk   │ │ OpenRouter  │
    │   (Database)  │ │  (Auth)  │ │    (AI)     │
    │               │ │          │ │             │
    │ - Events      │ │ - Users  │ │ - GPT-4     │
    │ - AI Plans    │ │ - Sessions│ │ - Claude   │
    │ - Reviews     │ │ - OAuth  │ │ - Others    │
    └───────────────┘ └──────────┘ └─────────────┘
```

## 📦 Data Flow

### 1. Event Creation Flow

```
User Input → Form Validation (Zod) → Server Action → Sanity
     ↓                                         ↓
  Loading State                         Real-time Update
     ↓                                         ↓
  Success Toast ← Response ← Revalidation ← Subscription
     ↓
  Redirect to Event Detail
```

### 2. Real-time Updates Flow

```
Sanity (Data Change)
     ↓
  listen() API
     ↓
  Client Subscription (useEvents hook)
     ↓
  State Update (useState)
     ↓
  Component Re-render
     ↓
  UI Updates Automatically
```

### 3. Analytics Data Flow

```
Dashboard Mount
     ↓
  useAnalytics Hook
     ↓
  Parallel GROQ Queries
     ↓
  Data Processing
     ↓
  Chart Data Generation
     ↓
  Recharts Rendering
     ↓
  Real-time Subscription (auto-refresh on changes)
```

## 🗄️ Database Schema (Sanity)

### Event Document

```typescript
{
  _type: "event",
  title: string (3-100 chars, required),
  description: string (10+ chars, required),
  date: datetime (required),
  location: string (required),
  status: "upcoming" | "completed" | "cancelled",
  attendees: string[] (emails),
  createdBy: string (Clerk ID, required),
  budget?: string,
  category: string,
  _createdAt: datetime,
  _updatedAt: datetime
}
```

### AI Plan Document

```typescript
{
  _type: "aiPlan",
  event: reference → event,
  schedule: Array<{
    time: string,
    activity: string,
    description?: string
  }>,
  budget: string,
  suggestions: string,
  guestIdeas: string[],
  checklist: Array<{
    task: string,
    completed: boolean
  }>,
  vendorRecommendations?: string[]
}
```

### User Document (Optional)

```typescript
{
  _type: "user",
  clerkId: string (unique, required),
  name: string (required),
  email: string (required),
  imageUrl?: url,
  createdAt: datetime,
  updatedAt: datetime
}
```

## 🔌 API Integration

### Sanity Client Configuration

```typescript
// src/lib/sanityClient.ts
import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false, // Always false for real-time
  token: process.env.SANITY_API_TOKEN,
});
```

### GROQ Query Pattern

```typescript
// Basic fetch
const events = await client.fetch(query, { clerkId });

// Real-time subscription
const subscription = client.listen(
  query,
  { clerkId },
  { includeResult: true, includePrevious: true }
);
```

### Server Action Pattern

```typescript
"use server";

import { client } from "@/lib/sanityClient";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({ /* validation */ });

export async function createEvent(input: InputType) {
  try {
    const validated = schema.parse(input);
    const result = await client.create({ /* doc */ });
    revalidatePath("/dashboard");
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

## 🎨 Component Architecture

### Component Hierarchy

```
App
├── RootLayout
│   ├── ClerkProvider
│   └── ThemeProvider
│
├── Landing Page
│   ├── Header
│   ├── Hero Section
│   ├── Features Section
│   └── Footer
│
└── Dashboard Layout
    ├── Sidebar
    ├── Navbar
    └── Page Content
        ├── Dashboard Home
        │   ├── DashboardStats
        │   └── EventCard[]
        ├── Analytics
        │   ├── AnalyticsStatsCards
        │   ├── MonthlyEventsChart
        │   ├── StatusPieChart
        │   └── CategoryPerformanceList
        └── Events
            ├── EventCard[]
            └── EventForm
```

### Custom Hooks

#### useEvents

```typescript
interface UseEventsReturn {
  events: Event[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  hasRealTime: boolean;
  isReconnecting: boolean;
  lastUpdated: Date | null;
}
```

Features:
- Real-time updates via Sanity listen()
- Automatic reconnection
- Loading states
- Manual refetch
- Optimistic updates (create, update, delete hooks)

#### useAnalytics

```typescript
interface UseAnalyticsReturn {
  stats: AnalyticsStats | null;
  monthlyData: MonthlyData[];
  categoryData: CategoryData[];
  statusData: StatusData[];
  weeklyData: WeeklyData[];
  categoryPerformance: CategoryPerformance[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  hasRealTime: boolean;
  lastUpdated: Date | null;
}
```

Features:
- Comprehensive analytics data
- Real-time updates
- Optional weekly trends
- Category performance metrics
- Auto-refresh on data changes

## 🔐 Authentication Flow

```
User visits app
     ↓
Clerk Middleware checks auth
     ↓
┌─────────────────┬─────────────────┐
│   Unauthenticated │  Authenticated  │
│        ↓             │       ↓        │
│   Sign In Page      │  Dashboard     │
│        ↓             │       ↓        │
│   OAuth/Email       │  Fetch Events  │
│        ↓             │       ↓        │
│   Create Session    │  Real-time Sub │
│        ↓             │                │
│   Redirect to Dash  │                │
└─────────────────────┴────────────────┘
```

## ⚡ Performance Optimizations

### 1. Server Components

- Data fetching done on server
- Reduced bundle size
- Faster initial load

### 2. Incremental Static Regeneration (ISR)

```typescript
// Revalidate every hour
export const revalidate = 3600;
```

### 3. Real-time with Fallback

- Primary: Sanity listen() API
- Fallback: Polling interval (optional)
- Reconnection logic included

### 4. Code Splitting

- Automatic with Next.js App Router
- Dynamic imports for heavy components

### 5. Image Optimization

```typescript
import Image from "next/image";
// Automatic WebP conversion and lazy loading
```

## 🛡️ Security Measures

### 1. Input Validation

All forms use Zod schemas:

```typescript
const eventSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10),
  date: z.string().datetime(),
  location: z.string().min(1),
  // ...
});
```

### 2. Server-Side Protection

- All mutations go through Server Actions
- Clerk user ID verified server-side
- No client-side direct database access

### 3. Environment Variables

- All API keys stored securely
- Never exposed to client bundle
- Prefix with `NEXT_PUBLIC_` only when needed

### 4. CORS Configuration

Configured in Sanity dashboard:
- Allowed origins: production domain
- Credentials: included for auth

## 📊 State Management

### Client State

- React useState for local state
- Custom hooks for shared state
- No global state management needed

### Server State

- Sanity as single source of truth
- Real-time subscriptions keep clients in sync
- Revalidation ensures fresh data

### Optimistic Updates

```typescript
// Example: Update event status
const updateEventStatus = async (eventId: string, status: Status) => {
  // Optimistically update UI
  setEvents(prev => prev.map(e => 
    e._id === eventId ? { ...e, status } : e
  ));
  
  // Then update server
  await client.patch(eventId).set({ status }).commit();
};
```

## 🧪 Testing Strategy

### Unit Tests (Recommended)

- Test utility functions
- Test validation schemas
- Test GROQ query builders

### Integration Tests

- Test server actions
- Test API endpoints
- Test authentication flow

### E2E Tests (Recommended)

- Test critical user flows
- Test real-time updates
- Test responsive design

## 📈 Scalability Considerations

### Current Architecture

- Supports: 1000s of events per user
- Real-time: 100s of concurrent users
- Database: Sanity managed infrastructure

### Future Scaling

1. **Database Indexing**: Add indexes on frequently queried fields
2. **CDN**: Use Sanity CDN for images
3. **Caching**: Implement Redis for frequently accessed data
4. **Microservices**: Separate AI processing to dedicated service
5. **Queue System**: Use for batch operations

## 🔄 CI/CD Pipeline

```
Git Push
   ↓
GitHub Actions (optional)
   ↓
   ├─ Lint
   ├─ Type Check
   └─ Test
   ↓
Vercel Deploy (Preview)
   ↓
Review
   ↓
Merge to Main
   ↓
Vercel Deploy (Production)
   ↓
Sanity Deploy (if schemas changed)
```

## 📝 Design Decisions

### Why Next.js App Router?

- Server Components for performance
- Built-in routing
- Easy API routes
- Vercel integration

### Why Sanity?

- Real-time capabilities
- Flexible schema
- GROQ query language
- Managed infrastructure

### Why Clerk?

- Complete auth solution
- Multiple providers
- User management
- Easy integration

### Why shadcn/ui?

- Customizable components
- Tailwind CSS based
- No runtime overhead
- Copy-paste components

---

**Architecture Version**: 2.0  
**Last Updated**: 2026-03-30  
**Maintained By**: Development Team
