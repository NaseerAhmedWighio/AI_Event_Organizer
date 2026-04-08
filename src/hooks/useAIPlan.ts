"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { client } from "@/lib/sanityClient";

export interface AIPlan {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  eventRef: string;
  schedule: Array<{
    time: string;
    activity: string;
    duration?: number;
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

interface UseAIPlanReturn {
  plan: AIPlan | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching a single AI plan with real-time updates
 */
export function useAIPlan(planId: string | null): UseAIPlanReturn {
  const [plan, setPlan] = useState<AIPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const subscriptionRef = useRef<any>(null);

  const fetchPlan = useCallback(async () => {
    if (!planId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await client.fetch(
        `*[_type == "aiPlan" && _id == $planId][0] {
          _id,
          _createdAt,
          _updatedAt,
          "eventRef": event._ref,
          schedule,
          budget,
          suggestions,
          guestIdeas,
          vendorRecommendations,
          checklist
        }`,
        { planId }
      );
      setPlan(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch AI plan"));
    } finally {
      setIsLoading(false);
    }
  }, [planId]);

  // Initial fetch
  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  // Real-time subscription
  useEffect(() => {
    if (!planId) return;

    try {
      subscriptionRef.current = client.listen(
        `*[_type == "aiPlan" && _id == $planId][0]`,
        { planId },
        { includeResult: true }
      );

      const sub = subscriptionRef.current.subscribe(
        ({ result }: any) => {
          if (result) {
            setPlan(result);
          }
        },
        (err: Error) => {
          console.error("AI plan subscription error:", err);
        }
      );

      return () => {
        sub.unsubscribe();
      };
    } catch (err) {
      console.error("Failed to set up AI plan subscription:", err);
    }
  }, [planId]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, []);

  return { plan, isLoading, error, refetch: fetchPlan };
}

/**
 * Hook for fetching all AI plans for a user with real-time updates
 */
export function useAIPlans(userId: string | null, enabled = true) {
  const [plans, setPlans] = useState<AIPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const subscriptionRef = useRef<any>(null);

  const fetchPlans = useCallback(async () => {
    if (!userId || !enabled) return;

    try {
      setIsLoading(true);
      const data = await client.fetch(
        `*[_type == "aiPlan" && event->createdBy == $userId] {
          _id,
          _createdAt,
          _updatedAt,
          "eventRef": event->{
            _id,
            title,
            date,
            status,
            category,
            attendees
          },
          schedule,
          budget,
          suggestions,
          guestIdeas,
          checklist
        } | order(_createdAt desc)`,
        { userId }
      );
      setPlans(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch AI plans"));
    } finally {
      setIsLoading(false);
    }
  }, [userId, enabled]);

  // Initial fetch
  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  // Real-time subscription
  useEffect(() => {
    if (!userId || !enabled) return;

    try {
      subscriptionRef.current = client.listen(
        `*[_type == "aiPlan" && event->createdBy == $userId]`,
        { userId },
        { includeResult: true, includePrevious: true }
      );

      const sub = subscriptionRef.current.subscribe(
        ({ result, previous, type }: any) => {
          if (type === "create" && result) {
            setPlans((prev) => [result, ...prev]);
          } else if (type === "delete" && previous) {
            setPlans((prev) => prev.filter((p) => p._id !== previous._id));
          } else if (type === "update" && result) {
            setPlans((prev) =>
              prev.map((p) => (p._id === result._id ? result : p))
            );
          }
        },
        (err: Error) => {
          console.error("AI plans subscription error:", err);
        }
      );

      return () => {
        sub.unsubscribe();
      };
    } catch (err) {
      console.error("Failed to set up AI plans subscription:", err);
    }
  }, [userId, enabled]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, []);

  return { plans, isLoading, error, refetch: fetchPlans };
}
