# AI Event Organizer 🎉

> **Plan Events Smarter, Not Harder** — A production-ready, AI-powered event planning platform

## 📖 Table of Contents

- [Overview](#-overview)
- [Live Demo & Screenshots](#-live-demo--screenshots)
- [Features](#-features)
- [User Journey](#-user-journey)
- [How It Works](#-how-it-works)
  - [Event Lifecycle](#-event-lifecycle)
  - [Dashboard Sections](#-dashboard-sections)
  - [AI Plan Generation](#-ai-plan-generation)
  - [Analytics](#-analytics-dashboard)
  - [Event Completion](#-event-completion)
  - [Notification System](#-notification-system)
  - [Review System](#-review-system)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Deployment](#-deployment)
- [Design System](#-design-system)
- [Security](#-security)
- [Performance](#-performance)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)
- [Credits & Portfolio](#-credits--portfolio)

---

## 🌟 Overview

**AI Event Organizer** is a modern, full-stack SaaS application that transforms event planning with artificial intelligence. Whether you're organizing corporate conferences, workshops, weddings, or birthday parties, this platform provides intelligent suggestions, optimized schedules, budget breakdowns, and comprehensive analytics — all in real-time.

### Key Highlights

- 🤖 **AI-Powered Planning** — Generate comprehensive event plans with schedules, budgets, and checklists
- 📊 **Real-Time Analytics** — Track performance with beautiful charts and 8+ metrics
- ⚡ **Live Updates** — Instant synchronization across all devices via Sanity subscriptions
- 🔔 **Smart Notifications** — Get notified when AI plans are ready
- 🌓 **Dark Mode** — Beautiful light/dark themes with system preference detection
- 📱 **Fully Responsive** — Mobile-first design that works on all devices
- ⭐ **User Reviews** — Collect and display user feedback with star ratings
- 🎯 **100% Type-Safe** — Complete TypeScript coverage

---

## 🚀 Live Demo & Screenshots

**Coming Soon** — Deploy to Vercel to see it in action!

---

## ✨ Features

### Core Features

- 🔐 **Secure Authentication** — Clerk-powered sign-in/sign-up with OAuth support (Google, GitHub, etc.)
- 📅 **Complete Event CRUD** — Create, read, update, delete events with Sanity CMS
- 🤖 **AI Event Planning** — OpenRouter generates comprehensive plans with schedules, budgets, suggestions, guest ideas, and checklists
- 📊 **Analytics Dashboard** — 8+ metrics, bar charts, line charts, pie/donut charts, category performance
- 📋 **Event Planner** — Cross-event progress tracking with checklist completion rates
- 🔔 **Real-Time Notifications** — 6 notification types with live badge counter
- ⭐ **User Reviews** — 1-5 star ratings with text reviews displayed on landing page
- 🌓 **Dark Mode** — System preference detection with localStorage persistence
- 📱 **Responsive Design** — Mobile-first with breakpoints for all screen sizes
- ⚡ **Real-Time Updates** — Sanity `listen()` subscriptions with auto-reconnection
- 🔍 **Global Search** — Search across events and AI plans with debounced queries
- 📤 **Analytics Export** — Export to CSV, text reports, and print functionality

### Event Management

- ✅ Create events with title, description, date/time, location, category, budget
- ✅ Filter by status (upcoming, completed, cancelled) and 7 categories
- ✅ Search by title or description
- ✅ Add/remove attendees by email
- ✅ Edit or delete events
- ✅ Real-time event list updates

### AI-Powered Features

- 🎯 Generate optimized event schedules
- 💰 Budget breakdown suggestions
- 💡 Expert recommendations
- 👥 Guest type suggestions
- ✅ Planning checklists with priorities (high/medium/low)
- 🔄 Regenerate plans anytime
- 📊 Progress tracking with completion percentages

### User Experience

- 🎨 Modern SaaS-style design with indigo/cyan gradients
- ✨ GSAP scroll-triggered animations on landing page
- 🔄 Framer Motion page transitions
- 📊 Recharts for beautiful analytics visualizations
- 🔔 Sonner toast notifications
- ✅ Zod form validation with real-time feedback
- 🌈 Color-coded status badges and category labels

---

## 🎯 User Journey

### 1. Landing Page (`/`)

When users first visit the application, they see:

- **Hero Section** — Animated title with fluid gradient text, subtitle, and CTA buttons
- **Stats Section** — Count-up animations showing platform achievements
- **Features Grid** — 6 feature cards explaining core capabilities
- **Reviews Section** — User reviews with star ratings (authenticated users can submit reviews)
- **Footer** — Portfolio attribution and links

### 2. Authentication

- Click **"Get Started"** or **"Sign In"**
- Clerk handles sign-in/sign-up with email or OAuth
- After authentication, redirected to `/dashboard`

### 3. Dashboard Home (`/dashboard`)

The main hub shows:

- **Welcome Message** — Personalized greeting
- **Overview Stats** — Total events, upcoming, completed, AI plans
- **Upcoming Events** — Grid of next 4 events
- **Quick Actions** — Links to AI Assistant, All Events, Analytics, Checklists

### 4. Creating an Event

1. Click **"Create Event"** button
2. Fill in the form:
   - **Title** (3-100 characters)
   - **Description** (minimum 10 characters)
   - **Date & Time** (datetime picker)
   - **Location** (venue or virtual)
   - **Category** (Conference, Workshop, Meetup, Wedding, Birthday, Corporate, Other)
   - **Status** (Upcoming, Completed, Cancelled)
   - **Budget** (optional)
3. Real-time validation on each field
4. Submit → Event created → Redirected to event detail page

### 5. AI Plan Generation

1. Navigate to event detail page
2. Click **"Generate AI Plan"**
3. AI analyzes event details and generates:
   - **Schedule** — Time-blocked agenda with activities
   - **Budget** — Categorized cost breakdown
   - **Suggestions** — Expert recommendations
   - **Guest Ideas** — Suggested attendee types
   - **Checklist** — Task list with priorities
4. Plan saved to Sanity, notification created
5. Interactive UI shows progress bar and all plan sections

### 6. Managing the Event

- **Checklist** — Check off tasks as completed (updates progress bar)
- **Attendees** — Add/remove attendees by email
- **Guest Ideas** — Import AI suggestions as attendees
- **Edit/Delete** — Modify event details or remove entirely

### 7. Event Completion

When event date passes:

- Event card shows **"Date Passed"** badge
- Warning card appears on event detail page
- **"Mark as Completed"** button becomes available
- If all checklist items are done, can auto-mark as completed
- Moves to Completed Events section

### 8. Analytics & Insights

Navigate to `/dashboard/analytics` to see:

- **Overview Stats** — 8+ key metrics
- **Completion Rate** — Percentage with progress bar
- **Monthly Trends** — Bar or line chart
- **Status Distribution** — Donut chart
- **Category Breakdown** — Donut chart
- **Category Performance** — Completion rates by category
- **Export Options** — CSV, text report, print

### 9. Reviews & Feedback

- Go to landing page after using the platform
- Authenticated users can submit reviews (1-5 stars + text)
- Reviews displayed on landing page after admin approval
- Featured review gets highlighted styling

---

## 🔧 How It Works

### Event Lifecycle

```
┌──────────────────────────────────────────────────────────────┐
│                    EVENT LIFECYCLE                           │
│                                                              │
│  1. CREATE                                                   │
│     User fills form → Validation → Save to Sanity            │
│                                                              │
│  2. PLAN                                                     │
│     Click "Generate AI Plan" → OpenRouter AI generates       │
│     schedule, budget, checklist → Save to Sanity             │
│                                                              │
│  3. MANAGE                                                   │
│     Check off tasks → Add attendees → Import guests          │
│     Real-time sync across all devices                        │
│                                                              │
│  4. COMPLETE                                                 │
│     Date passes + all tasks done → Mark as Completed         │
│     Analytics update automatically                           │
│                                                              │
│  5. ANALYZE                                                  │
│     View analytics → Export reports → Learn insights         │
│                                                              │
│  6. REVIEW                                                   │
│     Submit feedback → Share experience → Help others         │
└──────────────────────────────────────────────────────────────┘
```

### Dashboard Sections

#### 🏠 Dashboard Home (`/dashboard`)

**Purpose:** Quick overview and entry point

- Welcome message with stats cards
- Upcoming events preview (next 4 events)
- Quick action links to main features
- Server-side rendering for fast initial load

#### 📅 Events (`/dashboard/events`)

**Purpose:** Manage all events in one place

- **Search** — Find events by title or description
- **Filters** — Status (All/Upcoming/Completed/Cancelled), Category (7 types)
- **Tabs** — View events by status with counts
- **Event Cards** — Show date, location, attendees, AI plan status, date passed badge
- **Bulk Actions** — Link to completed events page

**Sub-pages:**
- **Create Event** (`/dashboard/events/new`) — Form with real-time validation
- **Event Detail** (`/dashboard/events/[eventId]`) — Full info + AI plan + attendees
- **Completed Events** (`/dashboard/events/completed`) — Stats + completed events list

#### 📋 Planner (`/dashboard/planner`)

**Purpose:** Cross-event planning progress

- Aggregates all AI plans across events
- Shows task completion rates
- Progress bars for each event
- Quick links to individual event planners

#### 🤖 AI Assistant (`/dashboard/ai-assistant`)

**Purpose:** Generate AI plans from scratch

- Form to describe event idea
- Event type selector (7 categories)
- Expected attendees count
- Budget range input
- Special requirements textarea
- Results displayed in cards:
  - **Schedule** — Timeline view
  - **Budget** — Breakdown by category
  - **Suggestions** — Expert advice
  - **Guest Ideas** — Tag chips

#### 📊 Analytics (`/dashboard/analytics`)

**Purpose:** Data-driven insights

- **Live Indicator** — Shows real-time connection status
- **8+ Metrics** — Total events, attendees, completion rate, AI plans, etc.
- **Charts:**
  - Monthly Events (bar or line chart toggle)
  - Status Distribution (donut chart)
  - Category Breakdown (donut chart)
  - Category Performance (horizontal bars)
- **Export Options** — CSV, text report, print
- **Refresh Button** — Manual data refresh

#### ⚙️ Settings (`/dashboard/settings`)

**Purpose:** User preferences

- **Profile** — View/edit name, email, avatar (via Clerk)
- **Preferences** — Dark mode, language
- **Integrations** — Sanity CMS status, Clerk auth status
- **Danger Zone** — Sign out button

---

### AI Plan Generation

**How AI Planning Works:**

1. **User Initiates** — Clicks "Generate AI Plan" on event detail page
2. **Server Action** — `createAIPlan()` validates input with Zod
3. **OpenRouter Call** — Sends event details to AI model with system prompt
4. **AI Response** — Returns JSON with complete event plan
5. **Save to Sanity** — Creates `aiPlan` document with reference to event
6. **Create Notification** — "AI Plan Ready" notification appears in bell icon
7. **Display Plan** — Interactive UI with schedule, budget, suggestions, checklist

**AI Model Configuration:**
- **Default Model:** `arcee-ai/trinity-large-preview:free` (free tier)
- **Configurable:** Change via `OPENROUTER_MODEL` environment variable
- **Supported Models:** OpenAI, Anthropic, Google, Meta, and more
- **Examples:**
  ```env
  OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
  OPENROUTER_MODEL=openai/gpt-4o-mini
  OPENROUTER_MODEL=google/gemini-flash-1.5
  ```

---

### Analytics Dashboard

**Data Flow:**

```
User Opens Analytics Page
        ↓
useAnalytics Hook Fetches Data
        ↓
Parallel GROQ Queries to Sanity
  - Event stats
  - Monthly trends
  - Category distribution
  - Status breakdown
  - Category performance
        ↓
Data Processed & Formatted
        ↓
Recharts Renders Charts
        ↓
Real-Time Subscription Active
  → Auto-updates on data changes
```

**Metrics Tracked:**

| Metric | Description |
|--------|-------------|
| Total Events | All events created by user |
| Upcoming Events | Events with status "upcoming" |
| Completed Events | Events with status "completed" |
| Cancelled Events | Events with status "cancelled" |
| Completion Rate | (Completed / Total) × 100% |
| Total Attendees | Sum of all attendee emails |
| Avg. Attendees | Average per event |
| Total AI Plans | Number of generated AI plans |
| Monthly Events | Events created each month |
| Category Performance | Completion rate by category |

---

### Event Completion

**How Events Get Marked as Completed:**

#### Method 1: Manual Marking
- User clicks **"Mark as Completed"** button
- Server action updates event status
- Analytics recalculate automatically

#### Method 2: Auto-Mark (Smart Completion)
- System checks:
  1. Event status is "upcoming"
  2. Event date has passed
  3. All AI checklist items are completed (if checklist exists)
- If all conditions met → Auto-marks as completed

#### Visual Indicators
- **Date Passed Badge** — Amber badge on event cards when date elapsed
- **Warning Card** — Prominent warning on event detail page
- **Progress Bar** — Shows checklist completion percentage

#### Completed Events Page
- Dedicated page at `/dashboard/events/completed`
- Stats cards: Total Completed, Total Attendees, Categories Used, Latest Event
- Grid of all completed events
- Easy access to review past events

---

### Notification System

**Overview:**

Notifications keep users informed about important events in the system.

**Notification Types:**

| Type | Icon | Color | When Used |
|------|------|-------|-----------|
| Event Reminder | 📅 | Blue | Upcoming event alerts |
| Event Update | 🔄 | Cyan | Event changes |
| AI Suggestion | ✨ | Yellow | AI recommendations |
| System | ⚙️ | Gray | System messages |
| Success | ✅ | Green | Plan generated |
| Warning | ⚠️ | Red | Important alerts |

**How Notifications Work:**

1. **Trigger** — Server action creates notification (e.g., AI plan ready)
2. **Storage** — Saved to Sanity with user ID, title, message, type, action URL
3. **Real-Time Sync** — Sanity `listen()` detects new notification
4. **Badge Update** — Bell icon shows unread count (up to 99+)
5. **User Sees** — Red badge appears on bell icon in navbar
6. **Dropdown** — Click bell to see all notifications sorted by date
7. **Action** — Click notification → Mark as read → Navigate to action URL
8. **Management** — Mark all as read, delete individual notifications

**Features:**
- ✅ Real-time updates (no refresh needed)
- ✅ Auto-reconnect on connection loss
- ✅ Unread indicator (blue dot)
- ✅ Click-to-navigate
- ✅ Mark as read/all read
- ✅ Delete notifications
- ✅ Scrollable list (400px max height)

---

### Review System

**Purpose:** Collect and display user feedback on the landing page.

**User Flow:**

1. **Authenticated User** — Sees review form on landing page
2. **Fill Review** — Star rating (1-5) + text (10-1000 characters)
3. **Submit** — Server validates and saves with `isApproved: true` (auto-approve)
4. **Display** — Review appears in grid with user avatar, name, rating
5. **Featured Review** — Middle review gets gradient background badge

**Admin Flow:**

1. Open Sanity Studio
2. Navigate to "User Reviews"
3. Toggle `isApproved` field to true/false
4. Approved reviews show on landing page

**Display Features:**
- Responsive grid layout
- Star rating with yellow stars
- User avatar (Clerk image or initials fallback)
- Relative timestamps
- "Show More" button (loads 3 at a time)
- Featured review highlighting

---

## 🛠️ Tech Stack

### Frontend Framework
- **[Next.js 16](https://nextjs.org/)** — React framework with App Router, SSR, server actions
- **[React 19](https://react.dev/)** — UI library
- **[TypeScript](https://www.typescriptlang.org/)** — Type safety

### Styling & UI
- **[Tailwind CSS 4](https://tailwindcss.com/)** — Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** — Beautiful, accessible components
- **[Framer Motion](https://www.framer.com/motion/)** — Smooth animations
- **[GSAP](https://gsap.com/)** — Landing page scroll animations

### Backend & Database
- **[Sanity.io](https://www.sanity.io/)** — Headless CMS with real-time subscriptions
- **[GROQ](https://www.sanity.io/docs/groq)** — Query language for Sanity
- **Server Actions** — Next.js server-side mutations

### Authentication
- **[Clerk](https://clerk.com/)** — Complete auth solution with OAuth support

### AI Integration
- **[OpenRouter](https://openrouter.ai/)** — Multi-model AI gateway
- **OpenAI SDK** — Client for AI API calls
- **Configurable Models** — OpenAI, Anthropic, Google, Meta, and more

### Charts & Visualization
- **[Recharts](https://recharts.org/)** — Composable chart library (Bar, Line, Pie)

### Validation & Forms
- **[Zod](https://zod.dev/)** — Schema validation with TypeScript

### Notifications
- **[Sonner](https://sonner.emilkowal.ski/)** — Beautiful toast notifications

### Icons
- **[Lucide React](https://lucide.dev/)** — Modern icon library

### Deployment
- **[Vercel](https://vercel.com/)** — Edge hosting, CI/CD, serverless functions

---

## 📁 Project Structure

```
ai-event-organizer/
├── 📄 Configuration Files
│   ├── package.json                    # Dependencies and scripts
│   ├── next.config.ts                  # Next.js configuration
│   ├── tailwind.config.ts              # Tailwind CSS configuration
│   ├── tsconfig.json                   # TypeScript configuration
│   ├── middleware.ts                   # Clerk authentication middleware
│   ├── eslint.config.mjs               # ESLint configuration
│   └── postcss.config.mjs              # PostCSS configuration
│
├── 📚 Documentation
│   ├── README.md                       # This file
│   ├── ARCHITECTURE.md                 # System architecture
│   ├── SETUP_GUIDE.md                  # Setup instructions
│   ├── DEPLOYMENT.md                   # Deployment guide
│   ├── REVIEW_SYSTEM_SETUP.md          # Review system guide
│   └── UPGRADE_SUMMARY.md              # Upgrade notes
│
├── sanity/                             # Sanity CMS Studio
│   ├── config.ts                       # Sanity Studio configuration
│   ├── schemaTypes.ts                  # Schema index
│   └── schemaTypes/
│       ├── event.ts                    # Event document schema
│       ├── user.ts                     # User document schema
│       ├── notification.ts             # Notification document schema
│       └── analyticsSnapshot.ts        # Analytics snapshot schema
│
└── src/
    ├── app/                            # Next.js App Router
    │   ├── layout.tsx                  # Root layout (Clerk, Theme, Toaster)
    │   ├── page.tsx                    # Landing page (hero, features, reviews)
    │   ├── globals.css                 # Global styles
    │   ├── loading.tsx                 # Global loading state
    │   ├── error.tsx                   # Global error boundary
    │   │
    │   ├── sign-in/[[...sign-in]]/     # Sign-in page (Clerk)
    │   ├── sign-up/[[...sign-up]]/     # Sign-up page (Clerk)
    │   │
    │   ├── api/                        # API Routes
    │   │   ├── ai/plan/                # AI plan generation endpoint
    │   │   ├── auth/webhook/           # Clerk webhook handler
    │   │   └── events/                 # Events API
    │   │
    │   └── dashboard/                  # Protected Dashboard Routes
    │       ├── page.tsx                # Dashboard home
    │       ├── loading.tsx             # Dashboard loading
    │       ├── error.tsx               # Dashboard error boundary
    │       │
    │       ├── events/                 # Event Management
    │       │   ├── page.tsx            # Events list with filters
    │       │   ├── new/page.tsx        # Create event form
    │       │   ├── [eventId]/page.tsx  # Event detail + AI plan
    │       │   └── completed/page.tsx  # Completed events
    │       │
    │       ├── planner/page.tsx        # Cross-event planner
    │       ├── ai-assistant/page.tsx   # AI planning form
    │       ├── analytics/page.tsx      # Analytics dashboard
    │       └── settings/page.tsx       # User settings
    │
    ├── actions/                        # Server Actions (Mutations)
    │   ├── eventActions.ts             # Event CRUD + completion
    │   ├── aiPlanActions.ts            # AI plan generation
    │   ├── analyticsActions.ts         # Analytics data fetching
    │   ├── reviewActions.ts            # Review management
    │   └── notificationActions.ts      # Notification creation
    │
    ├── components/                     # React Components
    │   ├── ui/                         # shadcn/ui primitives
    │   │   ├── button.tsx
    │   │   ├── card.tsx
    │   │   ├── dialog.tsx
    │   │   ├── badge.tsx
    │   │   ├── count-up.tsx            # Animated counter
    │   │   ├── grid-background.tsx     # Hero dot grid
    │   │   └── ...
    │   │
    │   ├── dashboard/                  # Dashboard Components
    │   │   ├── event-card.tsx          # Event preview card
    │   │   ├── dashboard-stats.tsx     # Stats cards
    │   │   ├── delete-event-button.tsx
    │   │   ├── mark-completed-button.tsx
    │   │   └── generate-ai-plan-button.tsx
    │   │
    │   ├── analytics/                  # Analytics Components
    │   │   ├── dashboard-stats.tsx
    │   │   ├── monthly-events-chart.tsx
    │   │   ├── status-pie-chart.tsx
    │   │   └── category-performance.tsx
    │   │
    │   ├── planner/                    # Planner Components
    │   │   ├── ai-plan-section.tsx
    │   │   ├── checklist-manager.tsx
    │   │   ├── attendee-manager.tsx
    │   │   └── guest-ideas-importer.tsx
    │   │
    │   ├── layout/                     # Layout Components
    │   │   ├── dashboard-layout.tsx
    │   │   ├── sidebar.tsx
    │   │   ├── navbar.tsx
    │   │   ├── footer.tsx
    │   │   ├── notification-dropdown.tsx
    │   │   └── global-search.tsx
    │   │
    │   └── landing/                    # Landing Page Components
    │       └── reviews-section.tsx
    │
    ├── hooks/                          # Custom React Hooks
    │   ├── useEvents.ts                # Event data + real-time
    │   ├── useAnalytics.ts             # Analytics data + real-time
    │   ├── useAIPlan.ts                # AI plan data
    │   └── useNotifications.ts         # Notification management
    │
    ├── lib/                            # Utilities & Config
    │   ├── sanityClient.ts             # Sanity CMS client
    │   ├── groqQueries.ts              # All GROQ queries
    │   ├── openai.ts                   # OpenRouter AI integration
    │   ├── utils.ts                    # Helper functions
    │   └── analytics-export.ts         # CSV/text export
    │
    └── schemas/                        # Sanity Document Schemas
        ├── event.ts                    # Event schema
        ├── aiPlan.ts                   # AI Plan schema
        └── review.ts                   # Review schema
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- Accounts for:
  - [Sanity.io](https://www.sanity.io/) — CMS/Database
  - [Clerk](https://clerk.com/) — Authentication
  - [OpenRouter](https://openrouter.ai/) — AI API Gateway
  - [Vercel](https://vercel.com/) — Hosting (optional)

### Step-by-Step Setup

#### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd ai-event-organizer
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Set Up Sanity.io

1. **Create Account** — Go to [sanity.io](https://www.sanity.io/) and sign up
2. **Create Project** — Name it "AI Event Organizer"
3. **Create Dataset** — Name it `production`
4. **Get Project ID** — Found in your Sanity dashboard
5. **Generate API Token** — Settings → API → Tokens (use Editor permissions)

#### 4. Set Up Clerk

1. **Create Account** — Go to [clerk.com](https://clerk.com/) and sign up
2. **Create Application** — Name your app
3. **Get API Keys** — Copy Publishable Key and Secret Key
4. **Configure Auth** — Enable email/password and OAuth providers

#### 5. Set Up OpenRouter

1. **Create Account** — Go to [openrouter.ai](https://openrouter.ai/)
2. **Generate API Key** — Dashboard → Keys → Create new key
3. **Choose Model** — Default: `arcee-ai/trinity-large-preview:free` (free tier)

#### 6. Configure Environment Variables

Create `.env.local` in the root directory:

```env
# Sanity.io
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token_here

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key_here
CLERK_SECRET_KEY=your_secret_key_here

# OpenRouter
OPENROUTER_API_KEY=your_openrouter_key_here
OPENROUTER_MODEL=arcee-ai/trinity-large-preview:free

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### 7. Deploy Sanity Schema

```bash
# Install Sanity CLI globally
npm install -g @sanity/cli

# Login to Sanity
sanity login

# Deploy schema to Sanity
cd sanity
sanity deploy
```

#### 8. Start Development Server

```bash
npm run dev
```

Visit **[http://localhost:3000](http://localhost:3000)** 🎉

---

## 🔐 Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project identifier | ✅ | `abc123def` |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset name | ✅ | `production` |
| `SANITY_API_TOKEN` | Sanity API token (Editor permissions) | ✅ | `sk_...` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public API key | ✅ | `pk_test_...` |
| `CLERK_SECRET_KEY` | Clerk secret API key | ✅ | `sk_test_...` |
| `OPENROUTER_API_KEY` | OpenRouter API key | ✅ | `sk-or-...` |
| `OPENROUTER_MODEL` | AI model identifier | ❌ | `arcee-ai/trinity-large-preview:free` |
| `NEXT_PUBLIC_APP_URL` | Application base URL | ❌ | `http://localhost:3000` |

**⚠️ Important:** Never commit `.env.local` to version control. It's already in `.gitignore`.

---

## 📦 Available Scripts

| Command | Description | Usage |
|---------|-------------|-------|
| `npm run dev` | Start development server | Development |
| `npm run build` | Build for production | Production prep |
| `npm start` | Start production server | Production |
| `npm run lint` | Run ESLint checks | Code quality |
| `npm run lint:fix` | Auto-fix linting issues | Code quality |
| `npm run type-check` | TypeScript type checking | Type safety |
| `npm run sanity:start` | Start Sanity Studio locally | CMS development |
| `npm run sanity:deploy` | Deploy Sanity schema | CMS deployment |
| `npm run vercel` | Deploy to Vercel preview | Staging |
| `npm run vercel:prod` | Deploy to Vercel production | Production |

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

#### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

#### Option 2: GitHub Integration

1. **Push to GitHub** — Commit and push your code
2. **Import to Vercel** — Go to [vercel.com](https://vercel.com/) → New Project
3. **Connect Repository** — Select your GitHub repo
4. **Add Environment Variables** — Copy all from `.env.local`
5. **Deploy** — Click Deploy!

#### Environment Variables in Vercel

Go to **Settings → Environment Variables** in Vercel dashboard and add:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_TOKEN`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL`

### Deploy Sanity Studio

```bash
cd sanity
sanity deploy
```

This deploys the Sanity Studio CMS interface to a custom URL.

---

## 🎨 Design System

### Color Palette

| Color | Hex Code | Usage |
|-------|----------|-------|
| **Primary (Indigo)** | `#6366F1` | Main actions, buttons |
| **Secondary (Cyan)** | `#06B6D4` | Accents, highlights |
| **Success (Emerald)** | `#10B981` | Positive feedback, completed |
| **Warning (Amber)** | `#F59E0B` | Alerts, date passed badges |
| **Danger (Red)** | `#EF4444` | Errors, cancelled events |

### Gradients

**Primary Gradient:**
```css
background: linear-gradient(to right, #6366f1, #06b6d4);
```

Used on buttons, badges, stat cards, and accent elements throughout the app.

### UI Style Guide

- **Cards:** `rounded-2xl` with soft shadows
- **Buttons:** `rounded-xl` with gradient or solid fills
- **Inputs:** `rounded-xl` with focus rings
- **Badges:** `rounded-lg` with muted backgrounds
- **Typography:** Geist Sans for body, Geist Mono for code
- **Shadows:** Layered shadows for depth (`shadow-sm`, `shadow-lg`, `shadow-xl`)
- **Animations:** Framer Motion for transitions, GSAP for scroll triggers

---

## 🔒 Security

### Authentication & Authorization
- ✅ All `/dashboard/*` routes protected by Clerk middleware
- ✅ Server actions verify user identity
- ✅ User ID stored on all documents for data isolation
- ✅ OAuth tokens handled securely by Clerk

### Data Protection
- ✅ Environment variables for all API keys
- ✅ Server-side validation with Zod schemas
- ✅ No client-side direct database access
- ✅ CORS configured for Sanity API

### Input Validation
- ✅ All forms validated with Zod on client and server
- ✅ Email validation for attendees
- ✅ Character limits on text fields
- ✅ Date format validation

### Best Practices
- ✅ Secrets never exposed to client bundle
- ✅ `NEXT_PUBLIC_` prefix only for public variables
- ✅ Rate limiting on AI endpoints
- ✅ TypeScript for type safety

---

## ⚡ Performance

### Optimizations

1. **Next.js App Router**
   - Server Components for data fetching
   - Reduced JavaScript bundle
   - Faster initial page load

2. **Real-Time with Fallback**
   - Primary: Sanity `listen()` WebSocket
   - Auto-reconnection on connection loss
   - Manual refetch capability

3. **Code Splitting**
   - Automatic with Next.js App Router
   - Dynamic imports for heavy components (GSAP)

4. **Image Optimization**
   - Next.js `<Image>` component
   - Automatic WebP conversion
   - Lazy loading

5. **Static Generation**
   - Landing page pre-rendered
   - ISR (Incremental Static Regeneration) where applicable

6. **Database Queries**
   - Parallel GROQ queries
   - Indexed fields for faster lookups
   - Minimal field selection

---

## 🐛 Troubleshooting

### Common Issues

#### Sanity Connection Errors

**Symptoms:** Events not loading, console errors

**Solutions:**
1. Verify `NEXT_PUBLIC_SANITY_PROJECT_ID` is correct
2. Check `SANITY_API_TOKEN` has Editor permissions
3. Ensure CORS is configured in Sanity dashboard
4. Run `sanity start` to test Studio connection

#### Clerk Authentication Issues

**Symptoms:** Can't sign in, redirect loops

**Solutions:**
1. Verify both publishable and secret keys
2. Check allowed origins in Clerk dashboard
3. Clear browser cache and cookies
4. Ensure middleware.ts is configured correctly

#### OpenRouter API Errors

**Symptoms:** "Failed to generate AI plan" error

**Solutions:**
1. Check `OPENROUTER_API_KEY` is valid
2. Verify model name in `OPENROUTER_MODEL`
3. Check model availability and credits at [openrouter.ai/models](https://openrouter.ai/models)
4. Review rate limits

#### Build Failures

**Symptoms:** `npm run build` fails

**Solutions:**
1. Run `npm run type-check` to see TypeScript errors
2. Run `npm run lint` to see linting errors
3. Check all environment variables are set
4. Clear `.next` folder: `rm -rf .next` (or `rmdir /s /q .next` on Windows)
5. Reinstall dependencies: `rm -rf node_modules && npm install`

#### Real-Time Updates Not Working

**Symptoms:** Changes don't appear without refresh

**Solutions:**
1. Check browser console for WebSocket errors
2. Verify Sanity token has read permissions
3. Check network tab for failed `listen()` requests
4. Ensure `enableRealTime: true` in hooks

---

## 📝 License

**MIT License** — Feel free to use for personal and commercial projects.

---

## 🙏 Credits & Portfolio

### Built By

**[Naseer Ahmed Wighio](https://naseerahmedwighio.vercel.app)** — Expert in custom web development, AI-powered applications, and scalable SaaS solutions.

🔗 **Portfolio:** [naseerahmedwighio.vercel.app](https://naseerahmedwighio.vercel.app)  
📧 **Contact:** Get in touch for your next project!

### Technologies Used

- [Next.js](https://nextjs.org/) — React Framework
- [Sanity.io](https://www.sanity.io/) — Headless CMS
- [Clerk](https://clerk.com/) — Authentication
- [OpenRouter](https://openrouter.ai/) — AI Gateway
- [shadcn/ui](https://ui.shadcn.com/) — UI Components
- [Tailwind CSS](https://tailwindcss.com/) — Styling
- [Framer Motion](https://www.framer.com/motion/) — Animations
- [GSAP](https://gsap.com/) — Scroll Animations
- [Recharts](https://recharts.org/) — Charts
- [Zod](https://zod.dev/) — Validation
- [Lucide Icons](https://lucide.dev/) — Icons

---

## 📚 Additional Resources

- [ARCHITECTURE.md](./ARCHITECTURE.md) — Detailed system architecture
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) — Comprehensive setup instructions
- [DEPLOYMENT.md](./DEPLOYMENT.md) — Deployment strategies
- [REVIEW_SYSTEM_SETUP.md](./REVIEW_SYSTEM_SETUP.md) — Review system guide

---

<div align="center">

**Built with ❤️ for event planners everywhere**

⭐ Star this repo if you found it helpful!

</div>