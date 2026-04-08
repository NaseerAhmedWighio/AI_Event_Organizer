import { getAuthUser } from "@/lib/server-auth";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { client } from "@/lib/sanityClient";
import { getAllEventsQuery } from "@/lib/groqQueries";
import { EventCard } from "@/components/dashboard/event-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Filter, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; category?: string; search?: string }>;
}) {
  const user = await getAuthUser();
  const userId = user.id;

  const params = await searchParams;

  const allEvents = await client.fetch(getAllEventsQuery, { userId });

  // Calculate event counts for each status
  const upcomingCount = allEvents?.filter((e: any) => e.status === "upcoming").length || 0;
  const completedCount = allEvents?.filter((e: any) => e.status === "completed").length || 0;

  // Filter events based on query params
  let filteredEvents = allEvents || [];

  if (params.status) {
    filteredEvents = filteredEvents.filter(
      (e: any) => e.status === params.status
    );
  }

  if (params.category) {
    filteredEvents = filteredEvents.filter(
      (e: any) => e.category === params.category
    );
  }

  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredEvents = filteredEvents.filter(
      (e: any) =>
        e.title.toLowerCase().includes(searchLower) ||
        e.description?.toLowerCase().includes(searchLower)
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Events</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage all your events in one place
            </p>
          </div>
          <div className="flex items-center gap-2">
            {completedCount > 0 && (
              <Link href="/dashboard/events/completed">
                <Button variant="outline" className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Completed ({completedCount})
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            )}
            <Link href="/dashboard/events/new">
              <Button className="gap-2">
                <Plus className="h-5 w-5" />
                Create Event
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search events..."
              className="pl-10 rounded-xl"
              defaultValue={params.search}
              name="search"
            />
          </div>
          <Select defaultValue={params.status || "all"}>
            <SelectTrigger className="w-full sm:w-[180px] rounded-xl">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue={params.category || "all"}>
            <SelectTrigger className="w-full sm:w-[180px] rounded-xl">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="conference">Conference</SelectItem>
              <SelectItem value="workshop">Workshop</SelectItem>
              <SelectItem value="meetup">Meetup</SelectItem>
              <SelectItem value="wedding">Wedding</SelectItem>
              <SelectItem value="birthday">Birthday</SelectItem>
              <SelectItem value="corporate">Corporate</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="rounded-xl">
            <TabsTrigger value="all">All Events ({allEvents?.length || 0})</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming ({upcomingCount})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedCount})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredEvents.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.map((event: any) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No events found. Create your first event to get started.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {(filteredEvents || [])
                .filter((e: any) => e.status === "upcoming")
                .map((event: any) => (
                  <EventCard key={event._id} event={event} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {filteredEvents.filter((e: any) => e.status === "completed").length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {filteredEvents.filter((e: any) => e.status === "completed").length} completed event(s)
                  </p>
                  <Link href="/dashboard/events/completed">
                    <Button variant="ghost" size="sm" className="gap-2">
                      View All Completed
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredEvents
                    .filter((e: any) => e.status === "completed")
                    .map((event: any) => (
                      <EventCard key={event._id} event={event} />
                    ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No completed events yet
                </p>
                <Link href="/dashboard/events/completed">
                  <Button variant="outline" size="sm" className="gap-2">
                    View Completed Events
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
