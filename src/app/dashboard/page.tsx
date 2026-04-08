import { getAuthUser } from "@/lib/server-auth";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { client } from "@/lib/sanityClient";
import { getDashboardStatsQuery, getUpcomingEventsQuery } from "@/lib/groqQueries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle, Clock, Sparkles, ArrowRight, Plus, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDate, formatDateTime, getStatusColor } from "@/lib/utils";
import { EventCard } from "@/components/dashboard/event-card";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";

export default async function DashboardPage() {
  const user = await getAuthUser();
  const userId = user.id;

  // Fetch dashboard data safely
  let stats = { totalEvents: 0, upcomingEvents: 0, completedEvents: 0, totalAIPlans: 0 };
  let upcomingEvents: any[] = [];

  try {
    [stats, upcomingEvents] = await Promise.all([
      client.fetch(getDashboardStatsQuery, { userId }),
      client.fetch(getUpcomingEventsQuery, { userId }),
    ]);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">Welcome back! 👋</h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              Here&apos;s what&apos;s happening with your events
            </p>
          </div>
          <Link href="/dashboard/events/new">
            <Button size="lg" className="gap-2 text-sm sm:text-base w-full sm:w-auto">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              Create Event
            </Button>
          </Link>
        </div>

        {/* Hero Section - Stats */}
        <section className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-semibold">Overview</h2>
          </div>
          <DashboardStats stats={stats} />
        </section>

        {/* Lower Section - Content Split */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Upcoming Events */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-semibold">Upcoming Events</h2>
              <Link href="/dashboard/events">
                <Button variant="ghost" size="lg" className="gap-2 text-sm sm:text-base">
                  View All
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
            </div>

            {upcomingEvents && upcomingEvents.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {upcomingEvents.slice(0, 4).map((event: any) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12 px-4">
                  <Calendar className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 dark:text-gray-700 mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-center">No upcoming events</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-center mb-3 sm:mb-4 text-sm sm:text-base">
                    Create your first event and let AI help you plan it perfectly
                  </p>
                  <Link href="/dashboard/events/new">
                    <Button size="lg" className="text-sm sm:text-base">Create Your First Event</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-semibold">Quick Actions</h2>
            </div>

            <div className="grid gap-3 sm:gap-4">
              {[
                {
                  icon: Sparkles,
                  title: "AI Assistant",
                  description: "Get AI-powered event suggestions",
                  href: "/dashboard/ai-assistant",
                  gradient: "from-indigo-600 to-cyan-500",
                },
                {
                  icon: Calendar,
                  title: "All Events",
                  description: "View and manage all events",
                  href: "/dashboard/events",
                  gradient: "from-purple-600 to-pink-500",
                },
                {
                  icon: BarChart3,
                  title: "Analytics",
                  description: "Track event performance",
                  href: "/dashboard/analytics",
                  gradient: "from-emerald-600 to-teal-500",
                },
                {
                  icon: CheckCircle,
                  title: "Checklists",
                  description: "Track planning progress",
                  href: "/dashboard/events",
                  gradient: "from-orange-600 to-amber-500",
                },
              ].map((action) => (
                <Link key={action.title} href={action.href}>
                  <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <CardHeader className="flex flex-row items-center gap-3 sm:gap-4 p-3 sm:p-4">
                      <div
                        className={`h-10 w-10 sm:h-14 sm:w-14 rounded-lg sm:rounded-xl bg-linear-to-br ${action.gradient} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
                      >
                        <action.icon className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base sm:text-lg">{action.title}</CardTitle>
                        <CardDescription className="text-xs sm:text-sm truncate">{action.description}</CardDescription>
                      </div>
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:translate-x-1 transition-transform shrink-0" />
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
