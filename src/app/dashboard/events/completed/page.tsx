import { getAuthUser } from "@/lib/server-auth";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { client } from "@/lib/sanityClient";
import { getCompletedEventsQuery } from "@/lib/groqQueries";
import { EventCard } from "@/components/dashboard/event-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, TrendingUp, Calendar, Users, Award } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default async function CompletedEventsPage() {
  const user = await getAuthUser();
  const userId = user.id;

  const completedEvents = await client.fetch(getCompletedEventsQuery, { userId });

  // Calculate completion stats
  const totalCompleted = completedEvents?.length || 0;
  const totalAttendees = completedEvents?.reduce((sum: number, e: any) => 
    sum + (e.attendees?.length || 0), 0) || 0;
  
  // Get unique categories from completed events
  const categories = [...new Set(completedEvents?.map((e: any) => e.category).filter(Boolean))];

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/events">
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Completed Events</h1>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                Review your successfully completed events
              </p>
            </div>
          </div>
        </div>

        {/* Completion Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-emerald-600 to-green-500" />
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardDescription className="text-sm">Total Completed</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {totalCompleted}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Events finished</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-600 to-cyan-500" />
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <CardDescription className="text-sm">Total Attendees</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {totalAttendees}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">People reached</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-purple-600 to-pink-500" />
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <CardDescription className="text-sm">Categories Used</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {categories.length}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Event types</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-amber-600 to-orange-500" />
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                  <Award className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <CardDescription className="text-sm">Latest Event</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {completedEvents && completedEvents.length > 0 ? (
                <>
                  <div className="text-sm font-semibold truncate">
                    {completedEvents[0].title}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatDate(completedEvents[0].date)}
                  </p>
                </>
              ) : (
                <>
                  <div className="text-sm text-gray-500">No events yet</div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Complete your first event
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Completed Events List */}
        {completedEvents && completedEvents.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              <h2 className="text-xl font-semibold">All Completed Events</h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({completedEvents.length})
              </span>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {completedEvents.map((event: any) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          </div>
        ) : (
          <Card className="border-0 shadow-xl">
            <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-6">
                <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-center">
                No Completed Events Yet
              </h3>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 text-center mb-6 max-w-md">
                Complete your upcoming events to see them here. Keep up the great work!
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/dashboard/events">
                  <Button variant="outline" className="gap-2 rounded-xl w-full sm:w-auto">
                    View Upcoming Events
                  </Button>
                </Link>
                <Link href="/dashboard/events/new">
                  <Button className="gap-2 rounded-xl w-full sm:w-auto">
                    Create New Event
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
