"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { client } from "@/lib/sanityClient";
import { getEventStatsQuery, getEventsByMonthQuery, analyticsRealTimeSubscriptionQuery } from "@/lib/groqQueries";

export interface AnalyticsStats {
  totalEvents: number;
  upcomingEvents: number;
  completedEvents: number;
  cancelledEvents: number;
  totalAttendees: number;
  totalAIPlans: number;
  eventsByCategory: Array<{
    category: string;
    status: string;
  }>;
  eventsByMonth: Array<{
    month: string;
    title: string;
    status: string;
  }>;
  thisMonthEvents: number;
  averageAttendees: number;
}

export interface MonthlyData {
  name: string;
  events: number;
  upcoming: number;
  completed: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

export interface StatusData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

export interface WeeklyData {
  week: string;
  events: number;
  upcoming: number;
  completed: number;
}

export interface CategoryPerformance {
  category: string;
  total: number;
  completed: number;
  upcoming: number;
  cancelled: number;
  completionRate: number;
}

interface UseAnalyticsOptions {
  clerkId: string;
  enabled?: boolean;
  monthsToFetch?: number;
  enableRealTime?: boolean;
  includeWeekly?: boolean;
  includeCategoryPerformance?: boolean;
}

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

const CATEGORY_COLORS: Record<string, string> = {
  conference: "#8b5cf6",
  workshop: "#f59e0b",
  meetup: "#06b6d4",
  wedding: "#ec4899",
  birthday: "#f97316",
  corporate: "#6366f1",
  other: "#64748b",
};

const STATUS_COLORS: Record<string, string> = {
  upcoming: "#06b6d4",
  completed: "#10b981",
  cancelled: "#ef4444",
};

/**
 * Custom hook for fetching analytics data with real-time capabilities
 * Features:
 * - Comprehensive analytics data (stats, monthly, category, status)
 * - Real-time updates via Sanity listen()
 * - Optional weekly trends and category performance
 * - Loading states and error handling
 * 
 * @param options - Configuration including clerkId and fetch options
 * @returns Analytics data, charts data, loading state, and refetch function
 */
export function useAnalytics({
  clerkId,
  enabled = true,
  monthsToFetch = 12,
  enableRealTime = true,
  includeWeekly = false,
  includeCategoryPerformance = false,
}: UseAnalyticsOptions): UseAnalyticsReturn {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [statusData, setStatusData] = useState<StatusData[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [categoryPerformance, setCategoryPerformance] = useState<CategoryPerformance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasRealTime, setHasRealTime] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const subscriptionRef = useRef<any>(null);

  const processAnalyticsData = useCallback(
    (fetchedStats: any, eventsByMonth: any[]) => {
      if (!fetchedStats) return;

      setStats({
        ...fetchedStats,
        thisMonthEvents: fetchedStats.thisMonthEvents || 0,
        averageAttendees: fetchedStats.averageAttendees || 0,
      });

      // Process monthly data for charts
      const months = getLastNMonths(monthsToFetch);
      const monthlyMap = new Map<string, { events: number; upcoming: number; completed: number }>();

      months.forEach((month) => {
        monthlyMap.set(month, { events: 0, upcoming: 0, completed: 0 });
      });

      eventsByMonth.forEach((event: any) => {
        const eventDate = new Date(event.month);
        const monthName = eventDate.toLocaleString("default", {
          month: "short",
          year: "2-digit",
        });

        if (monthlyMap.has(monthName)) {
          const data = monthlyMap.get(monthName)!;
          data.events += 1;
          if (event.status === "upcoming") data.upcoming += 1;
          if (event.status === "completed") data.completed += 1;
        }
      });

      const processedMonthly = months.map((month) => ({
        name: month,
        events: monthlyMap.get(month)?.events || 0,
        upcoming: monthlyMap.get(month)?.upcoming || 0,
        completed: monthlyMap.get(month)?.completed || 0,
      }));

      setMonthlyData(processedMonthly);

      // Process category data
      const categoryMap = new Map<string, number>();
      fetchedStats.eventsByCategory?.forEach((item: any) => {
        const category = item.category || "other";
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
      });

      const totalEvents = fetchedStats.totalEvents || 0;

      const processedCategories: CategoryData[] = Array.from(categoryMap.entries()).map(
        ([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value,
          color: CATEGORY_COLORS[name] || CATEGORY_COLORS.other,
          percentage: totalEvents > 0 ? Math.round((value / totalEvents) * 100) : 0,
        })
      );

      setCategoryData(processedCategories.sort((a, b) => b.value - a.value));

      // Process status data
      const statusCounts = {
        upcoming: fetchedStats.upcomingEvents || 0,
        completed: fetchedStats.completedEvents || 0,
        cancelled: fetchedStats.cancelledEvents || 0,
      };

      const totalStatus = Object.values(statusCounts).reduce((a, b) => a + b, 0) || 1;

      const processedStatus: StatusData[] = Object.entries(statusCounts)
        .filter(([_, value]) => value > 0)
        .map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value,
          color: STATUS_COLORS[name] || "#64748b",
          percentage: Math.round((value / totalStatus) * 100),
        }));

      setStatusData(processedStatus);
    },
    [monthsToFetch]
  );

  const fetchAnalytics = useCallback(async (isRefresh = false) => {
    if (!clerkId || !enabled) return;

    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const [fetchedStats, eventsByMonth] = await Promise.all([
        client.fetch(getEventStatsQuery, { clerkId }),
        client.fetch(getEventsByMonthQuery, { clerkId }),
      ]);

      processAnalyticsData(fetchedStats, eventsByMonth);

      // Fetch optional data
      if (includeWeekly) {
        const weeklyEvents = await client.fetch(
          `*[_type == "event" && createdBy == $clerkId] {
            "week": dateTime(date).week,
            "year": dateTime(date).year,
            status
          }`,
          { clerkId }
        );
        processWeeklyData(weeklyEvents, setWeeklyData);
      }

      if (includeCategoryPerformance) {
        const categoryEvents = await client.fetch(
          `*[_type == "event" && createdBy == $clerkId && category != null] {
            category,
            status
          }`,
          { clerkId }
        );
        processCategoryPerformance(categoryEvents, setCategoryPerformance);
      }

      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch analytics"));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [clerkId, enabled, processAnalyticsData, includeWeekly, includeCategoryPerformance]);

  // Initial fetch
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Real-time subscription
  useEffect(() => {
    if (!enableRealTime || !clerkId || !enabled) {
      setHasRealTime(false);
      return;
    }

    let subscription: any = null;

    const setupSubscription = () => {
      try {
        const observable = client.listen(
          analyticsRealTimeSubscriptionQuery,
          { clerkId },
          {
            includeResult: true,
            visibility: "query",
          }
        );

        subscription = observable.subscribe(
          ({ result, type }: any) => {
            if (result) {
              setLastUpdated(new Date());
              // Refresh data on any change
              fetchAnalytics(true);
              setHasRealTime(true);
            }
          },
          (err: Error) => {
            console.error("Analytics subscription error:", err);
            setHasRealTime(false);
            // Retry after delay
            setTimeout(setupSubscription, 3000);
          }
        );
      } catch (err) {
        console.error("Failed to set up analytics subscription:", err);
        setHasRealTime(false);
      }
    };

    setupSubscription();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [clerkId, enabled, enableRealTime, fetchAnalytics]);

  return {
    stats,
    monthlyData,
    categoryData,
    statusData,
    weeklyData,
    categoryPerformance,
    isLoading,
    isRefreshing,
    error,
    refetch: () => fetchAnalytics(true),
    hasRealTime,
    lastUpdated,
  };
}

/**
 * Helper function to get last N months
 */
function getLastNMonths(count: number = 12): string[] {
  const months: string[] = [];
  const now = new Date();

  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleString("default", {
      month: "short",
      year: "2-digit",
    });
    months.push(monthName);
  }

  return months;
}

/**
 * Process weekly data from Sanity response
 */
function processWeeklyData(
  events: any[],
  setData: React.Dispatch<React.SetStateAction<WeeklyData[]>>
) {
  const now = new Date();
  const currentWeek = getWeekNumber(now);
  const weeklyMap = new Map<string, { events: number; upcoming: number; completed: number }>();

  // Initialize last 12 weeks
  for (let i = 11; i >= 0; i--) {
    const weekDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (i * 7));
    const weekNum = getWeekNumber(weekDate);
    const year = weekDate.getFullYear();
    const key = `W${weekNum}`;
    weeklyMap.set(key, { events: 0, upcoming: 0, completed: 0 });
  }

  // Populate with actual data
  events.forEach((event) => {
    const key = `W${event.week}`;
    if (weeklyMap.has(key)) {
      const data = weeklyMap.get(key)!;
      data.events += 1;
      if (event.status === "upcoming") data.upcoming += 1;
      if (event.status === "completed") data.completed += 1;
    }
  });

  const result = Array.from(weeklyMap.entries()).map(([week, data]) => ({
    week,
    events: data.events,
    upcoming: data.upcoming,
    completed: data.completed,
  }));

  setData(result);
}

/**
 * Process category performance data
 */
function processCategoryPerformance(
  events: any[],
  setData: React.Dispatch<React.SetStateAction<CategoryPerformance[]>>
) {
  const categoryMap = new Map<string, { total: number; completed: number; upcoming: number; cancelled: number }>();

  events.forEach((event) => {
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

  setData(result.sort((a, b) => b.total - a.total));
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

/**
 * Hook for real-time analytics updates only
 * Subscribes to event changes and triggers callback
 */
export function useAnalyticsRealTime(clerkId: string, onUpdate?: () => void) {
  useEffect(() => {
    if (!clerkId) return;

    let subscription: any;

    try {
      subscription = client.listen(
        `*[_type == "event" && createdBy == $clerkId]`,
        { clerkId },
        { includeResult: true }
      );

      const sub = subscription.subscribe(
        ({ result }: any) => {
          if (result && onUpdate) {
            onUpdate();
          }
        },
        (err: Error) => {
          console.error("Analytics subscription error:", err);
        }
      );

      return () => {
        sub.unsubscribe();
      };
    } catch (err) {
      console.error("Failed to set up analytics subscription:", err);
    }
  }, [clerkId, onUpdate]);
}

/**
 * Hook for fetching only dashboard stats (lightweight)
 */
export function useDashboardStats(clerkId: string, enabled = true) {
  const [stats, setStats] = useState<{
    totalEvents: number;
    upcomingEvents: number;
    completedEvents: number;
    totalAIPlans: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!clerkId || !enabled) {
      setIsLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await client.fetch(
          `
          {
            "totalEvents": count(*[_type == "event" && createdBy == $clerkId]),
            "upcomingEvents": count(*[_type == "event" && createdBy == $clerkId && status == "upcoming"]),
            "completedEvents": count(*[_type == "event" && createdBy == $clerkId && status == "completed"]),
            "totalAIPlans": count(*[_type == "aiPlan" && event->createdBy == $clerkId])
          }
          `,
          { clerkId }
        );
        setStats(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch stats"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [clerkId, enabled]);

  return { stats, isLoading, error };
}
