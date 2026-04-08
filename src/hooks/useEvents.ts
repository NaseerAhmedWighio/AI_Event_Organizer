"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { client } from "@/lib/sanityClient";
import { getAllEventsQuery, eventsSubscriptionQuery } from "@/lib/groqQueries";

export interface Event {
  _id: string;
  _createdAt: string;
  _updatedAt?: string;
  title: string;
  description: string;
  date: string;
  location: string;
  status: "upcoming" | "completed" | "cancelled";
  attendees: string[];
  createdBy: string;
  budget?: string;
  category: string;
  aiPlan?: any;
}

interface UseEventsOptions {
  userId: string;
  enabled?: boolean;
  enableRealTime?: boolean;
  refreshInterval?: number;
}

interface UseEventsReturn {
  events: Event[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  hasRealTime: boolean;
  isReconnecting: boolean;
  lastUpdated: Date | null;
}

/**
 * Custom hook for fetching and subscribing to events with real-time updates
 * Features:
 * - Real-time updates via Sanity listen()
 * - Automatic reconnection on connection loss
 * - Loading states and error handling
 * - Manual refetch capability
 * 
 * @param options - Configuration options including userId and real-time settings
 * @returns Events array, loading state, error, refetch function, and real-time status
 */
export function useEvents({
  userId,
  enabled = true,
  enableRealTime = true,
  refreshInterval,
}: UseEventsOptions): UseEventsReturn {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasRealTime, setHasRealTime] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const subscriptionRef = useRef<any>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch initial events
  const fetchEvents = useCallback(async () => {
    if (!userId || !enabled) return;

    try {
      setIsLoading(true);
      const data = await client.fetch(getAllEventsQuery, { userId });
      setEvents(data || []);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch events"));
    } finally {
      setIsLoading(false);
    }
  }, [userId, enabled]);

  // Initial fetch
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Polling interval (optional fallback)
  useEffect(() => {
    if (!refreshInterval || !enabled) return;

    const interval = setInterval(fetchEvents, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchEvents, refreshInterval, enabled]);

  // Real-time subscription
  useEffect(() => {
    if (!enableRealTime || !userId || !enabled) {
      setHasRealTime(false);
      return;
    }

    const setupSubscription = () => {
      setIsReconnecting(true);

      try {
        subscriptionRef.current = client.listen(
          eventsSubscriptionQuery,
          { userId },
          {
            includeResult: true,
            includePrevious: true,
            visibility: "query",
            hotswapping: true,
          }
        );

        const sub = subscriptionRef.current.subscribe(
          ({ result, previous, eventId, type }: any) => {
            if (!result && type !== "detach") return;

            setLastUpdated(new Date());

            // Handle create
            if (result && !previous && type === "create") {
              setEvents((prev) => [result, ...prev]);
              setHasRealTime(true);
            }
            // Handle delete
            else if (type === "delete" && previous) {
              setEvents((prev) => prev.filter((e) => e._id !== previous._id));
              setHasRealTime(true);
            }
            // Handle update
            else if (result && previous && type === "update") {
              setEvents((prev) =>
                prev.map((e) => (e._id === result._id ? result : e))
              );
              setHasRealTime(true);
            }
            // Fallback: just update if we have a result
            else if (result) {
              setEvents((prev) => {
                const exists = prev.find((e) => e._id === result._id);
                if (exists) {
                  return prev.map((e) => (e._id === result._id ? result : e));
                }
                return [result, ...prev];
              });
              setHasRealTime(true);
            }
          },
          (err: Error) => {
            console.error("Real-time subscription error:", err);
            setHasRealTime(false);
            
            // Attempt reconnection after delay
            reconnectTimeoutRef.current = setTimeout(() => {
              setupSubscription();
            }, 3000);
          },
          () => {
            // On complete
            setIsReconnecting(false);
            setHasRealTime(false);
          }
        );

        setIsReconnecting(false);
        setHasRealTime(true);

        return () => {
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          sub.unsubscribe();
        };
      } catch (err) {
        console.error("Failed to set up real-time subscription:", err);
        setHasRealTime(false);
        setIsReconnecting(false);
        
        // Retry after delay
        reconnectTimeoutRef.current = setTimeout(() => {
          setupSubscription();
        }, 5000);
      }
    };

    setupSubscription();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [userId, enabled, enableRealTime]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, []);

  return {
    events,
    isLoading,
    error,
    refetch: fetchEvents,
    hasRealTime,
    isReconnecting,
    lastUpdated,
  };
}

/**
 * Custom hook for fetching a single event with real-time updates
 * @param eventId - The ID of the event to fetch (null to disable)
 * @returns Event data, loading state, and error
 */
export function useEvent(eventId: string | null) {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!eventId) {
      setIsLoading(false);
      return;
    }

    let subscription: any;

    // Fetch initial data
    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        const data = await client.fetch(
          `*[_type == "event" && _id == $eventId][0] {
            _id,
            _createdAt,
            title,
            description,
            date,
            location,
            status,
            attendees,
            createdBy,
            budget,
            category,
            "aiPlan": *[_type == "aiPlan" && event._ref == ^._id][0] {
              _id,
              schedule,
              budget,
              suggestions,
              guestIdeas,
              checklist
            }
          }`,
          { eventId }
        );
        setEvent(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch event"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();

    // Subscribe to real-time updates
    try {
      subscription = client.listen(
        `*[_type == "event" && _id == $eventId][0]`,
        { eventId },
        { includeResult: true }
      );

      const sub = subscription.subscribe(
        ({ result }: any) => {
          if (result) {
            setEvent(result);
          }
        },
        (err: Error) => {
          console.error("Event subscription error:", err);
        }
      );

      return () => {
        sub.unsubscribe();
      };
    } catch (err) {
      console.error("Failed to set up event subscription:", err);
    }
  }, [eventId]);

  return {
    event,
    isLoading,
    error,
  };
}

/**
 * Hook for creating events with optimistic updates
 */
export function useCreateEvent(onSuccess?: (eventId: string) => void) {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createEvent = useCallback(async (eventData: Partial<Event> & { userId: string }) => {
    setIsCreating(true);
    setError(null);

    try {
      const created = await client.create({
        _type: "event",
        ...eventData,
      });

      onSuccess?.(created._id);
      return { success: true, data: created };
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to create event");
      setError(error);
      return { success: false, error };
    } finally {
      setIsCreating(false);
    }
  }, [onSuccess]);

  return { createEvent, isCreating, error };
}

/**
 * Hook for updating events with optimistic updates
 */
export function useUpdateEvent(onSuccess?: () => void) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateEvent = useCallback(async (
    eventId: string,
    updates: Partial<Event>
  ) => {
    setIsUpdating(true);
    setError(null);

    try {
      const updated = await client.patch(eventId).set(updates).commit();
      onSuccess?.();
      return { success: true, data: updated };
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to update event");
      setError(error);
      return { success: false, error };
    } finally {
      setIsUpdating(false);
    }
  }, [onSuccess]);

  return { updateEvent, isUpdating, error };
}

/**
 * Hook for deleting events
 */
export function useDeleteEvent(onSuccess?: () => void) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteEvent = useCallback(async (eventId: string) => {
    setIsDeleting(true);
    setError(null);

    try {
      await client.delete(eventId);
      onSuccess?.();
      return { success: true };
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to delete event");
      setError(error);
      return { success: false, error };
    } finally {
      setIsDeleting(false);
    }
  }, [onSuccess]);

  return { deleteEvent, isDeleting, error };
}
