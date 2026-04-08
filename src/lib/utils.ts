import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(dateString: string | Date): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function formatTime(dateString: string | Date): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function getRelativeTime(dateString: string | Date): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);

  if (diffInSeconds < 0) {
    return "Past";
  }

  if (diffInSeconds < 60) {
    return "Just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m from now`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h from now`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d from now`;
  }

  return formatDate(date);
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "upcoming":
      return "bg-success-muted text-success";
    case "completed":
      return "bg-info-muted text-info";
    case "cancelled":
      return "bg-danger-muted text-danger";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function getCategoryColor(category: string): string {
  switch (category) {
    case "conference":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
    case "workshop":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
    case "meetup":
      return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400";
    case "wedding":
      return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400";
    case "birthday":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
    case "corporate":
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function parseBudget(budget: string): { min: number; max: number } | null {
  if (!budget) return null;

  // Handle range like "$1000-2000" or "$1,000 - $2,000"
  const rangeMatch = budget.match(/\$?([\d,]+)\s*[-–]\s*\$?([\d,]+)/);
  if (rangeMatch) {
    return {
      min: parseInt(rangeMatch[1].replace(/,/g, ""), 10),
      max: parseInt(rangeMatch[2].replace(/,/g, ""), 10),
    };
  }

  // Handle single value like "$500" or "$1,000"
  const singleMatch = budget.match(/\$?([\d,]+)/);
  if (singleMatch) {
    const value = parseInt(singleMatch[1].replace(/,/g, ""), 10);
    return { min: value, max: value };
  }

  return null;
}

export function formatBudget(budget: string): string {
  const parsed = parseBudget(budget);
  if (!parsed) return budget;

  if (parsed.min === parsed.max) {
    return `$${parsed.min.toLocaleString()}`;
  }

  return `$${parsed.min.toLocaleString()} - $${parsed.max.toLocaleString()}`;
}

// Generate calendar months for analytics
export function getLast12Months(): string[] {
  const months: string[] = [];
  const now = new Date();

  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(
      new Intl.DateTimeFormat("en-US", { month: "short" }).format(date)
    );
  }

  return months;
}

// Type definition for event object
interface Event {
  date: string | Date;
  title?: string;
  status?: string;
}

// Group events by month
export function groupEventsByMonth(events: Event[]): Record<string, number> {
  const monthCounts: Record<string, number> = {};
  const months = getLast12Months();

  months.forEach((month) => {
    monthCounts[month] = 0;
  });

  events.forEach((event) => {
    const eventDate = new Date(event.date);
    const monthKey = new Intl.DateTimeFormat("en-US", { month: "short" }).format(eventDate);
    if (monthCounts[monthKey] !== undefined) {
      monthCounts[monthKey]++;
    }
  });

  return monthCounts;
}

// Check if event date has passed
export function hasEventDatePassed(dateString: string | Date): boolean {
  const eventDate = new Date(dateString);
  const now = new Date();
  return eventDate < now;
}

// Get event date status with more granular information
export function getEventDateStatus(dateString: string | Date): "upcoming" | "ongoing" | "passed" {
  const eventDate = new Date(dateString);
  const now = new Date();
  
  // Consider event as "ongoing" if it's within 24 hours of the event date
  const oneDayInMs = 24 * 60 * 60 * 1000;
  const timeDiff = eventDate.getTime() - now.getTime();
  
  if (timeDiff < 0 && Math.abs(timeDiff) < oneDayInMs) {
    return "ongoing";
  }
  
  if (timeDiff < 0) {
    return "passed";
  }
  
  return "upcoming";
}
