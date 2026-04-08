# AI Event Organizer - Setup & Deployment Guide

A production-ready Full Stack Jamstack application for AI-powered event planning.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Deployment](#deployment)
- [Project Structure](#project-structure)

---

## ✨ Features

### Core Features
- 🔐 **Authentication** - Secure login/signup with Clerk
- 📅 **Event Management** - Create, edit, delete events with Sanity CMS
- 🤖 **AI Event Assistant** - Generate comprehensive event plans with OpenAI
- 📊 **Analytics Dashboard** - Track event performance with Recharts
- 🎨 **Modern UI** - Beautiful SaaS-style design with shadcn/ui
- 🌓 **Dark Mode** - Toggle between light and dark themes
- 📱 **Responsive** - Works on desktop, tablet, and mobile

### AI Capabilities
- Automatic event schedule generation
- Budget breakdown suggestions
- Guest list ideas
- Planning checklists with priorities
- Vendor recommendations
- Expert suggestions

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS 4**
- **Framer Motion** (animations)

### UI Components
- **shadcn/ui** (Radix UI primitives)
- Custom design system with Indigo/Cyan gradients

### Backend (Jamstack)
- **Sanity.io** - Headless CMS as database
- **GROQ** - Query language
- Real-time subscriptions

### Authentication
- **Clerk** - User authentication

### AI
- **OpenRouter** - Multi-model AI gateway (OpenAI, Anthropic, Google, Meta, etc.)
- Configurable model via environment variable
- Default: `arcee-ai/trinity-large-preview:free`

### Deployment
- **Vercel** - Hosting and CI/CD

---

## 📦 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18+ installed
- **npm** or **yarn** package manager
- Accounts for:
  - [Sanity.io](https://sanity.io)
  - [Clerk](https://clerk.com)
  - [OpenRouter](https://openrouter.ai)
  - [Vercel](https://vercel.com)

---

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
cd ai-event-organizer
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Sanity.io

1. **Create a Sanity Account**
   - Go to [sanity.io](https://sanity.io) and sign up
   - Create a new project called "AI Event Organizer"
   - Create a dataset named "production"

2. **Get Your Sanity Credentials**
   - Project ID: Found in your Sanity dashboard
   - Dataset: `production`
   - API Token: Generate in Settings → API → Tokens

3. **Deploy Sanity Studio** (Optional - for CMS UI)
   ```bash
   npm install -g @sanity/cli
   sanity login
   sanity install
   sanity start
   ```

### 4. Setup Clerk

1. **Create a Clerk Account**
   - Go to [clerk.com](https://clerk.com) and sign up
   - Create a new application

2. **Get Your Clerk Keys**
   - Go to API Keys in the Clerk dashboard
   - Copy the Publishable Key and Secret Key

3. **Configure Clerk**
   - Enable email/password authentication
   - Configure allowed origins for development

### 5. Setup OpenRouter

1. **Create an OpenRouter Account**
   - Go to [openrouter.ai](https://openrouter.ai)
   - Sign up (you can use Google, GitHub, or email)

2. **Get Your API Key**
   - Go to Keys section in the dashboard
   - Create a new API key
   - Copy the key securely

3. **Choose Your Model**
   - Browse available models at [openrouter.ai/models](https://openrouter.ai/models)
   - Default: `arcee-ai/trinity-large-preview:free` (free tier)
   - Popular alternatives:
     - `anthropic/claude-3.5-sonnet` (premium)
     - `openai/gpt-4o-mini` (cost-effective)
     - `google/gemini-flash-1.5` (fast)
     - `meta-llama/llama-3.1-70b-instruct` (open source)

### 6. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Sanity.io
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key

# OpenRouter
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=arcee-ai/trinity-large-preview:free

# Optional: For production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

---

## 💻 Development

### Start Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

### Run Production Build

```bash
npm start
```

### Lint Code

```bash
npm run lint
```

---

## 🌐 Deployment

### Deploy to Vercel

1. **Install Vercel CLI** (Optional)
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Configure Environment Variables in Vercel**
   - Go to your project in Vercel dashboard
   - Navigate to Settings → Environment Variables
   - Add all variables from `.env.local`

4. **Production Deployment**
   ```bash
   vercel --prod
   ```

### Vercel Dashboard Setup

1. Import your GitHub repository to Vercel
2. Add environment variables
3. Deploy automatically on push to main branch

---

## 📁 Project Structure

```
ai-event-organizer/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── dashboard/          # Protected dashboard pages
│   │   │   ├── events/         # Event management pages
│   │   │   ├── ai-assistant/   # AI planning page
│   │   │   ├── analytics/      # Analytics dashboard
│   │   │   └── settings/       # Settings page
│   │   ├── api/                # API routes
│   │   │   ├── ai/             # AI endpoints
│   │   │   └── events/         # Event endpoints
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Landing page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── dashboard/          # Dashboard components
│   │   ├── analytics/          # Analytics components
│   │   ├── layout/             # Layout components
│   │   └── theme-provider.tsx  # Dark mode
│   ├── lib/
│   │   ├── sanityClient.ts     # Sanity configuration
│   │   ├── groqQueries.ts      # GROQ queries
│   │   ├── openai.ts           # OpenAI integration
│   │   └── utils.ts            # Utility functions
│   ├── schemas/                # Sanity schemas
│   │   ├── event.ts            # Event schema
│   │   └── aiPlan.ts           # AI Plan schema
│   └── actions/                # Server actions
│       ├── eventActions.ts     # Event CRUD
│       └── aiPlanActions.ts    # AI plan actions
├── sanity/                     # Sanity Studio
│   ├── schemaTypes.ts          # Schema exports
│   └── config.ts               # Sanity config
├── middleware.ts               # Clerk middleware
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── .env.local                  # Environment variables
```

---

## 🔑 Sanity Schemas

### Event Schema
```typescript
{
  title: string;
  description: string;
  date: datetime;
  location: string;
  status: "upcoming" | "completed" | "cancelled";
  attendees: string[];
  createdBy: string; // Clerk ID
  budget?: string;
  category?: string;
}
```

### AI Plan Schema
```typescript
{
  event: reference to Event;
  schedule: Array<{
    time: string;
    activity: string;
    duration: number;
    location?: string;
    notes?: string;
  }>;
  budget: string;
  suggestions: string;
  guestIdeas: string[];
  checklist: Array<{
    task: string;
    completed: boolean;
    priority: "high" | "medium" | "low";
  }>;
}
```

---

## 🎨 Design System

### Colors
- **Primary**: Indigo (#6366F1)
- **Secondary**: Cyan (#06B6D4)
- **Success**: Emerald (#10B981)
- **Warning**: Amber (#F59E0B)
- **Danger**: Red (#EF4444)

### Gradients
- Buttons: `from-indigo-600 to-cyan-500`
- Accents: Soft gradient backgrounds

### UI Style
- Rounded-2xl cards
- Soft shadows
- Smooth animations
- Glass morphism effects

---

## 🔒 Security

- All routes protected by Clerk
- Server-side validation
- Environment variables for secrets
- CORS configured for API routes
- Rate limiting on AI endpoints

---

## 📊 Features Breakdown

### Dashboard
- Overview stats
- Upcoming events
- Quick actions
- Recent activity

### Events
- Create/Edit/Delete
- Filter by status/category
- Search functionality
- AI plan generation

### AI Assistant
- Event idea input
- Custom plan generation
- Schedule optimization
- Budget suggestions

### Analytics
- Events by month chart
- Category breakdown
- Completion rate
- Average attendees

---

## 🐛 Troubleshooting

### Common Issues

**Sanity Connection Errors**
- Verify Project ID and Dataset name
- Check API token permissions
- Ensure CORS is configured

**Clerk Authentication Issues**
- Verify keys are correct
- Check allowed origins
- Clear browser cache

**OpenRouter API Errors**
- Check API key validity
- Verify model name is correct
- Check model availability and credits
- Review rate limits at openrouter.ai

---

## 📝 License

MIT License - feel free to use for personal and commercial projects.

---

## 🤝 Support

For issues or questions:
1. Check the documentation
2. Review environment variables
3. Check console for errors

---

## 🎉 Next Steps

1. Customize the landing page
2. Add more AI features
3. Implement email invitations
4. Add PDF export
5. Integrate payment processing

---

Built with ❤️ using Next.js, Sanity, Clerk, and OpenAI
