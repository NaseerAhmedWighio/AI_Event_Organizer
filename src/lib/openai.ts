import OpenAI from "openai";

// OpenRouter API configuration - Optimized for speed
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    "X-Title": "AI Event Organizer",
  },
  timeout: 30000, // 30 second timeout (reduced from 60s)
  maxRetries: 1, // Only 1 retry (reduced from 2)
});

// Faster model option - using a faster model by default
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || "arcee-ai/trinity-large-preview:free";
// Alternative fast models:
// - "google/gemini-flash-1.5" (very fast, good quality)
// - "meta-llama/llama-3.1-70b-instruct" (fast open source)
// - "mistralai/mistral-large" (good balance)

export interface AIEventPlan {
  schedule: Array<{
    time: string;
    activity: string;
    duration: number;
    location?: string;
    notes?: string;
  }>;
  budget: string | Record<string, string | number>;
  suggestions: string;
  guestIdeas: string[];
  vendorRecommendations: string;
  checklist: Array<{
    task: string;
    completed: boolean;
    priority: "high" | "medium" | "low";
  }>;
}

export async function generateEventPlan({
  eventTitle,
  eventDescription,
  eventDate,
  location,
  category,
  expectedAttendees,
  model = DEFAULT_MODEL,
}: {
  eventTitle: string;
  eventDescription: string;
  eventDate: string;
  location: string;
  category: string;
  expectedAttendees?: number;
  model?: string;
}): Promise<AIEventPlan> {
  // Concise prompt for faster generation
  const prompt = `Create an event plan in JSON format for:
**${eventTitle}** - ${eventDescription}
Date: ${eventDate} | Location: ${location} | Category: ${category} | Attendees: ${expectedAttendees || "TBD"}

Return ONLY valid JSON with this structure:
{
  "schedule": [{"time": "09:00 AM", "activity": "Registration", "duration": 60, "location": "Lobby", "notes": ""}],
  "budget": {"Venue": 500, "Catering": 300, "Equipment": 200},
  "suggestions": "Brief expert tips",
  "guestIdeas": ["Industry professionals", "Stakeholders"],
  "vendorRecommendations": "Key vendor types needed",
  "checklist": [{"task": "Book venue", "completed": false, "priority": "high"}]
}

Rules:
- 6-8 schedule items with realistic times
- 5+ budget categories as object
- 5+ guest ideas
- 10+ checklist items with priorities (high/medium/low)
- Be specific and practical`;

  // Reduced retries for speed
  const maxRetries = 2;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[AI Plan] Attempt ${attempt}/${maxRetries} for: ${eventTitle}`);

      const completion = await openai.chat.completions.create({
        model: model,
        messages: [
          {
            role: "system",
            content: "Event planning expert. Return ONLY valid JSON matching the requested structure.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500, // Reduced from 2000 for faster response
        response_format: { type: "json_object" },
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error("No response from OpenRouter");
      }

      const plan = JSON.parse(response) as AIEventPlan;

      // Handle budget object conversion
      let budgetString = plan.budget || "Budget not specified";
      if (typeof plan.budget === "object" && plan.budget !== null) {
        budgetString = Object.entries(plan.budget)
          .map(([category, amount]) => `${category}: $${typeof amount === 'number' ? amount.toLocaleString() : amount}`)
          .join('\n');
      }

      console.log(`[AI Plan] Success on attempt ${attempt}`);

      return {
        schedule: plan.schedule || [],
        budget: budgetString,
        suggestions: plan.suggestions || "No suggestions available",
        guestIdeas: plan.guestIdeas || [],
        vendorRecommendations: plan.vendorRecommendations || "No vendor recommendations",
        checklist: plan.checklist || [],
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`[AI Plan] Attempt ${attempt} failed:`, lastError.message);

      if (attempt === maxRetries) {
        console.error(`[AI Plan] All attempts failed`);
        break;
      }

      // Shorter wait between retries (1.5s instead of 2s)
      const waitTime = 1500;
      console.log(`[AI Plan] Retrying in ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  // All retries failed
  console.error("[AI Plan] Final error:", lastError);

  if (lastError) {
    if (lastError.message.includes("ECONNRESET") || lastError.message.includes("timeout")) {
      throw new Error("AI service connection failed. Please try again.");
    }
    if (lastError.message.includes("401") || lastError.message.includes("Unauthorized")) {
      throw new Error("Invalid AI API key. Check your configuration.");
    }
    if (lastError.message.includes("429") || lastError.message.includes("rate limit")) {
      throw new Error("Rate limit exceeded. Wait a moment and try again.");
    }
    if (lastError.message.includes("500") || lastError.message.includes("503")) {
      throw new Error("AI service unavailable. Try again later.");
    }
  }

  throw new Error("Failed to generate plan. Check connection and try again.");
}

export async function optimizeEventSchedule({
  schedule,
  constraints,
  model = DEFAULT_MODEL,
}: {
  schedule: Array<{ time: string; activity: string; duration: number }>;
  constraints?: string;
  model?: string;
}): Promise<Array<{ time: string; activity: string; duration: number; notes?: string }>> {
  const prompt = `Optimize the following event schedule${constraints ? `\n\nConstraints: ${constraints}` : ""}:

Current Schedule:
${JSON.stringify(schedule, null, 2)}

Please analyze and suggest optimizations for better flow, timing, and attendee experience. Return the optimized schedule in JSON format with the same structure, adding a "notes" field where helpful.`;

  try {
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: "You are an expert event scheduler. Optimize schedules for maximum efficiency and attendee satisfaction.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.5,
      max_tokens: 1500,
      response_format: { type: "json_object" },
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error("No response from OpenRouter");
    }

    return JSON.parse(response);
  } catch (error) {
    console.error("Error optimizing schedule:", error);
    return schedule;
  }
}

export async function suggestEventImprovements({
  eventDetails,
  feedback,
  model = DEFAULT_MODEL,
}: {
  eventDetails: string;
  feedback?: string;
  model?: string;
}): Promise<string> {
  const prompt = `Based on the following event details${feedback ? ` and feedback` : ""}, suggest specific improvements:

Event Details:
${eventDetails}

${feedback ? `Feedback Received:\n${feedback}` : ""}

Provide actionable, specific recommendations for improving future iterations of this event.`;

  try {
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: "You are an event improvement consultant. Provide practical, actionable advice.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0]?.message?.content || "No suggestions available";
  } catch (error) {
    console.error("Error suggesting improvements:", error);
    return "Unable to generate suggestions at this time.";
  }
}

// Get available models (for future use)
export async function getAvailableModels() {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
    });
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching models:", error);
    return [];
  }
}
