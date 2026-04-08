import OpenAI from "openai";

// OpenRouter API configuration
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    "X-Title": "AI Event Organizer",
  },
  timeout: 60000, // 60 second timeout
  maxRetries: 2, // Retry up to 2 times on failure
});

// Default model from environment or fallback
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || "arcee-ai/trinity-large-preview:free";

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
  const prompt = `You are an expert event planner. Create a comprehensive event plan for the following event:

Event Details:
- Title: ${eventTitle}
- Description: ${eventDescription}
- Date: ${eventDate}
- Location: ${location}
- Category: ${category}
- Expected Attendees: ${expectedAttendees || "Not specified"}

Please provide a detailed event plan in JSON format with the following structure:
{
  "schedule": [
    {
      "time": "09:00 AM",
      "activity": "Registration and Welcome Coffee",
      "duration": 60,
      "location": "Main Lobby",
      "notes": "Have name tags ready"
    }
  ],
  "budget": "Detailed budget breakdown with categories (Venue, Catering, Equipment, Marketing, etc.)",
  "suggestions": "Expert suggestions for making this event successful, including tips on engagement, logistics, and contingency planning",
  "guestIdeas": ["List of guest types or specific suggestions for who to invite"],
  "vendorRecommendations": "Recommended types of vendors or services needed for this event",
  "checklist": [
    {
      "task": "Book venue",
      "completed": false,
      "priority": "high"
    }
  ]
}

Make the plan practical, detailed, and tailored to the event type. Include at least 6-8 schedule items, 5+ budget categories, 5+ guest ideas, and 10+ checklist items.`;

  // Retry logic with exponential backoff
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[AI Plan] Attempt ${attempt}/${maxRetries} for event: ${eventTitle}`);
      
      const completion = await openai.chat.completions.create({
        model: model,
        messages: [
          {
            role: "system",
            content: "You are a professional event planning assistant. Always respond with valid JSON that matches the requested structure.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: "json_object" },
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error("No response from OpenRouter");
      }

      const plan = JSON.parse(response) as AIEventPlan;

      // Validate and provide defaults if needed
      // Handle case where budget might be returned as an object instead of string
      let budgetString = plan.budget || "Budget not specified";
      if (typeof plan.budget === "object" && plan.budget !== null) {
        // Convert budget object to formatted string
        budgetString = Object.entries(plan.budget)
          .map(([category, amount]) => `${category}: $${typeof amount === 'number' ? amount.toLocaleString() : amount}`)
          .join('\n');
      }

      console.log(`[AI Plan] Successfully generated plan on attempt ${attempt}`);
      
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
      
      // If this is the last attempt, re-throw the error
      if (attempt === maxRetries) {
        console.error(`[AI Plan] All ${maxRetries} attempts failed`);
        break;
      }
      
      // Wait before retrying (exponential backoff: 2s, 4s, 8s)
      const waitTime = Math.pow(2, attempt) * 1000;
      console.log(`[AI Plan] Waiting ${waitTime}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  // If we get here, all retries failed
  console.error("[AI Plan] Final error:", lastError);
  
  // Provide specific error messages based on error type
  if (lastError) {
    if (lastError.message.includes("ECONNRESET") || lastError.message.includes("timeout")) {
      throw new Error("AI service connection failed. This can happen due to network issues or high demand. Please try again in a few moments.");
    }
    if (lastError.message.includes("401") || lastError.message.includes("Unauthorized")) {
      throw new Error("Invalid AI API key. Please check your OpenRouter configuration.");
    }
    if (lastError.message.includes("429") || lastError.message.includes("rate limit")) {
      throw new Error("AI service rate limit exceeded. Please wait a moment and try again.");
    }
    if (lastError.message.includes("500") || lastError.message.includes("503")) {
      throw new Error("AI service is temporarily unavailable. Please try again later.");
    }
  }
  
  throw new Error("Failed to generate AI event plan. Please check your internet connection and try again.");
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
