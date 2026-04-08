"use server";

import { client } from "@/lib/sanityClient";
import {
  getEventStatsQuery,
  getEventsByStatusQuery,
  getEventsByCategoryQuery,
  getMonthlyEventTrendsQuery,
  getRecentActivityQuery,
  getTopCategoriesQuery,
  getWeeklyEventTrendsQuery,
  getAttendeeGrowthQuery,
  getCategoryPerformanceQuery,
} from "@/lib/groqQueries";

export interface AnalyticsData {
  stats: {
    totalEvents: number;
    upcomingEvents: number;
    completedEvents: number;
    cancelledEvents: number;
    totalAttendees: number;
    totalAIPlans: number;
    thisMonthEvents: number;
    averageAttendees: number;
  };
  eventsByStatus: {
    upcoming: number;
    completed: number;
    cancelled: number;
  };
  eventsByCategory: Record<string, any[]>;
  monthlyTrends: Array<{
    month: number;
    year: number;
    status: string;
    category: string;
  }>;
  recentActivity: Array<{
    _id: string;
    title: string;
    date: string;
    status: string;
    location: string;
  }>;
  topCategories: Array<{
    category: string;
    _count: number;
  }>;
}

export interface WeeklyTrendData {
  week: number;
  year: number;
  events: number;
  upcoming: number;
  completed: number;
}

export interface CategoryPerformanceData {
  category: string;
  total: number;
  completed: number;
  upcoming: number;
  cancelled: number;
  completionRate: number;
}

export interface AttendeeGrowthData {
  date: string;
  attendeeCount: number;
  title: string;
  cumulative: number;
}

/**
 * Fetch comprehensive analytics data for a user
 * @param userId - The Clerk user ID
 * @returns Analytics data or error
 */
export async function getAnalyticsData(userId: string): Promise<{
  success: boolean;
  data?: AnalyticsData;
  error?: string;
}> {
  try {
    if (!userId) {
      return {
        success: false,
        error: "User ID is required",
      };
    }

    const [
      stats,
      eventsByStatus,
      eventsByCategory,
      monthlyTrends,
      recentActivity,
      topCategories,
    ] = await Promise.all([
      client.fetch(getEventStatsQuery, { userId }),
      client.fetch(getEventsByStatusQuery, { userId }),
      client.fetch(getEventsByCategoryQuery, { userId }),
      client.fetch(getMonthlyEventTrendsQuery, { userId }),
      client.fetch(getRecentActivityQuery, { userId }),
      client.fetch(getTopCategoriesQuery, { userId }),
    ]);

    return {
      success: true,
      data: {
        stats: {
          totalEvents: stats?.totalEvents || 0,
          upcomingEvents: stats?.upcomingEvents || 0,
          completedEvents: stats?.completedEvents || 0,
          cancelledEvents: stats?.cancelledEvents || 0,
          totalAttendees: stats?.totalAttendees || 0,
          totalAIPlans: stats?.totalAIPlans || 0,
          thisMonthEvents: stats?.thisMonthEvents || 0,
          averageAttendees: stats?.averageAttendees || 0,
        },
        eventsByStatus: {
          upcoming: eventsByStatus?.upcoming || 0,
          completed: eventsByStatus?.completed || 0,
          cancelled: eventsByStatus?.cancelled || 0,
        },
        eventsByCategory: eventsByCategory || {},
        monthlyTrends: monthlyTrends || [],
        recentActivity: recentActivity || [],
        topCategories: topCategories || [],
      },
    };
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch analytics data",
    };
  }
}

/**
 * Fetch dashboard stats only (lightweight query)
 * @param userId - The Clerk user ID
 * @returns Dashboard stats or error
 */
export async function getDashboardStats(userId: string): Promise<{
  success: boolean;
  data?: {
    totalEvents: number;
    upcomingEvents: number;
    completedEvents: number;
    totalAIPlans: number;
  };
  error?: string;
}> {
  try {
    if (!userId) {
      return {
        success: false,
        error: "User ID is required",
      };
    }

    const stats = await client.fetch(
      `
      {
        "totalEvents": count(*[_type == "event" && createdBy == $userId]),
        "upcomingEvents": count(*[_type == "event" && createdBy == $userId && status == "upcoming"]),
        "completedEvents": count(*[_type == "event" && createdBy == $userId && status == "completed"]),
        "totalAIPlans": count(*[_type == "aiPlan" && event->createdBy == $userId])
      }
      `,
      { userId }
    );

    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch dashboard stats",
    };
  }
}

/**
 * Fetch events by category for pie chart
 * @param userId - The Clerk user ID
 * @returns Category distribution or error
 */
export async function getCategoryDistribution(userId: string): Promise<{
  success: boolean;
  data?: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  error?: string;
}> {
  try {
    if (!userId) {
      return {
        success: false,
        error: "User ID is required",
      };
    }

    const events = await client.fetch(
      `*[_type == "event" && createdBy == $userId && category != null] {
        category,
        status
      }`,
      { userId }
    );

    const categoryMap = new Map<string, number>();
    const total = events.length;

    events.forEach((event: any) => {
      const category = event.category || "other";
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });

    const distribution = Array.from(categoryMap.entries()).map(
      ([category, count]) => ({
        category,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      })
    );

    return {
      success: true,
      data: distribution.sort((a, b) => b.count - a.count),
    };
  } catch (error) {
    console.error("Error fetching category distribution:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch category distribution",
    };
  }
}

/**
 * Fetch status distribution for pie chart
 * @param userId - The Clerk user ID
 * @returns Status distribution or error
 */
export async function getStatusDistribution(userId: string): Promise<{
  success: boolean;
  data?: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  error?: string;
}> {
  try {
    if (!userId) {
      return {
        success: false,
        error: "User ID is required",
      };
    }

    const stats = await client.fetch(getEventsByStatusQuery, { userId });

    const total =
      (stats?.upcoming || 0) + (stats?.completed || 0) + (stats?.cancelled || 0);

    const distribution = [
      {
        status: "upcoming",
        count: stats?.upcoming || 0,
        percentage: total > 0 ? Math.round(((stats?.upcoming || 0) / total) * 100) : 0,
      },
      {
        status: "completed",
        count: stats?.completed || 0,
        percentage: total > 0 ? Math.round(((stats?.completed || 0) / total) * 100) : 0,
      },
      {
        status: "cancelled",
        count: stats?.cancelled || 0,
        percentage: total > 0 ? Math.round(((stats?.cancelled || 0) / total) * 100) : 0,
      },
    ].filter((item) => item.count > 0);

    return {
      success: true,
      data: distribution,
    };
  } catch (error) {
    console.error("Error fetching status distribution:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch status distribution",
    };
  }
}

/**
 * Fetch monthly event trends
 * @param userId - The Clerk user ID
 * @param months - Number of months to fetch (default: 12)
 * @returns Monthly trends or error
 */
export async function getMonthlyTrends(
  userId: string,
  months: number = 12
): Promise<{
  success: boolean;
  data?: Array<{
    month: string;
    events: number;
    upcoming: number;
    completed: number;
  }>;
  error?: string;
}> {
  try {
    if (!userId) {
      return {
        success: false,
        error: "User ID is required",
      };
    }

    const events = await client.fetch(
      `*[_type == "event" && createdBy == $userId] {
        "month": dateTime(date).month,
        "year": dateTime(date).year,
        status
      }`,
      { userId }
    );

    // Get last N months
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const now = new Date();
    const monthlyData = new Map<
      string,
      { events: number; upcoming: number; completed: number }
    >();

    // Initialize last N months
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${monthNames[date.getMonth()]} ${String(date.getFullYear()).slice(2)}`;
      monthlyData.set(key, { events: 0, upcoming: 0, completed: 0 });
    }

    // Populate with actual data
    events.forEach((event: any) => {
      const date = new Date(event.year, event.month);
      const key = `${monthNames[date.getMonth()]} ${String(date.getFullYear()).slice(2)}`;

      if (monthlyData.has(key)) {
        const data = monthlyData.get(key)!;
        data.events += 1;
        if (event.status === "upcoming") data.upcoming += 1;
        if (event.status === "completed") data.completed += 1;
      }
    });

    const result = Array.from(monthlyData.entries()).map(([month, data]) => ({
      month,
      events: data.events,
      upcoming: data.upcoming,
      completed: data.completed,
    }));

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error fetching monthly trends:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch monthly trends",
    };
  }
}

/**
 * Fetch weekly event trends
 * @param userId - The Clerk user ID
 * @param weeks - Number of weeks to fetch (default: 12)
 * @returns Weekly trends or error
 */
export async function getWeeklyTrends(
  userId: string,
  weeks: number = 12
): Promise<{
  success: boolean;
  data?: WeeklyTrendData[];
  error?: string;
}> {
  try {
    if (!userId) {
      return {
        success: false,
        error: "User ID is required",
      };
    }

    const events = await client.fetch(getWeeklyEventTrendsQuery, { userId });

    const now = new Date();
    const currentWeek = getWeekNumber(now);
    const weeklyData = new Map<string, { events: number; upcoming: number; completed: number }>();

    // Initialize last N weeks
    for (let i = weeks - 1; i >= 0; i--) {
      const weekDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (i * 7));
      const weekNum = getWeekNumber(weekDate);
      const year = weekDate.getFullYear();
      const key = `W${weekNum}-${String(year).slice(2)}`;
      weeklyData.set(key, { events: 0, upcoming: 0, completed: 0 });
    }

    // Populate with actual data
    events.forEach((event: any) => {
      const key = `W${event.week}-${String(event.year).slice(2)}`;
      if (weeklyData.has(key)) {
        const data = weeklyData.get(key)!;
        data.events += 1;
        if (event.status === "upcoming") data.upcoming += 1;
        if (event.status === "completed") data.completed += 1;
      }
    });

    const result = Array.from(weeklyData.entries()).map(([week, data]) => ({
      week: parseInt(week.split("-")[0].replace("W", "")),
      year: parseInt("20" + week.split("-")[1]),
      events: data.events,
      upcoming: data.upcoming,
      completed: data.completed,
    }));

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error fetching weekly trends:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch weekly trends",
    };
  }
}

/**
 * Fetch category performance (completion rate by category)
 * @param userId - The Clerk user ID
 * @returns Category performance data or error
 */
export async function getCategoryPerformance(userId: string): Promise<{
  success: boolean;
  data?: CategoryPerformanceData[];
  error?: string;
}> {
  try {
    if (!userId) {
      return {
        success: false,
        error: "User ID is required",
      };
    }

    const events = await client.fetch(getCategoryPerformanceQuery, { userId });

    const categoryMap = new Map<string, { total: number; completed: number; upcoming: number; cancelled: number }>();

    events.forEach((event: any) => {
      const category = event.category || "other";
      const data = categoryMap.get(category) || { total: 0, completed: 0, upcoming: 0, cancelled: 0 };
      
      data.total += 1;
      if (event.status === "completed") data.completed += 1;
      if (event.status === "upcoming") data.upcoming += 1;
      if (event.status === "cancelled") data.cancelled += 1;
      
      categoryMap.set(category, data);
    });

    const result = Array.from(categoryMap.entries()).map(([category, data]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      total: data.total,
      completed: data.completed,
      upcoming: data.upcoming,
      cancelled: data.cancelled,
      completionRate: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
    }));

    return {
      success: true,
      data: result.sort((a, b) => b.total - a.total),
    };
  } catch (error) {
    console.error("Error fetching category performance:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch category performance",
    };
  }
}

/**
 * Fetch attendee growth over time
 * @param userId - The Clerk user ID
 * @returns Attendee growth data or error
 */
export async function getAttendeeGrowth(userId: string): Promise<{
  success: boolean;
  data?: AttendeeGrowthData[];
  error?: string;
}> {
  try {
    if (!userId) {
      return {
        success: false,
        error: "User ID is required",
      };
    }

    const events = await client.fetch(getAttendeeGrowthQuery, { userId });

    let cumulative = 0;
    const result = events.map((event: any) => {
      cumulative += event.attendeeCount || 0;
      return {
        date: event.date,
        attendeeCount: event.attendeeCount || 0,
        title: event.title,
        cumulative,
      };
    });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error fetching attendee growth:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch attendee growth",
    };
  }
}

/**
 * Helper function to get week number from date
 */
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
