import { getAuthUser } from "@/lib/server-auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { client } from "@/lib/sanityClient";
import { getEventByIdQuery } from "@/lib/groqQueries";
import { formatDateTime, getStatusColor, getCategoryColor, hasEventDatePassed } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Edit,
  ArrowLeft,
  CheckCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { DeleteEventButton } from "@/components/dashboard/delete-event-button";
import { MarkCompletedButton } from "@/components/dashboard/mark-completed-button";
import { AIPlanSection } from "@/components/planner/ai-plan-section";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const user = await getAuthUser();
  const { eventId } = await params;

  const event = await client.fetch(getEventByIdQuery, { eventId });

  if (!event) {
    redirect("/dashboard/events");
  }

  const isDatePassed = hasEventDatePassed(event.date);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/events">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h1 className="text-3xl font-bold">{event.title}</h1>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    event.status
                  )}`}
                >
                  {event.status}
                </span>
                {event.category && (
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(
                      event.category
                    )}`}
                  >
                    {event.category}
                  </span>
                )}
                {event.status === "upcoming" && isDatePassed && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                    <Clock className="h-3 w-3" />
                    Date Passed
                  </span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {event.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Link href={`/dashboard/events/${event._id}/edit`}>
              <Button variant="outline" className="gap-2 rounded-xl">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </Link>
            {event.status === "upcoming" && isDatePassed && (
              <MarkCompletedButton eventId={event._id} variant="default" />
            )}
            <DeleteEventButton eventId={event._id} />
          </div>
        </div>

        {/* Date Passed Warning Card */}
        {event.status === "upcoming" && isDatePassed && (
          <Card className="border-2 border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-500/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-300 mb-2">
                    Event Date Has Passed
                  </h3>
                  <p className="text-sm text-amber-700 dark:text-amber-400 mb-4">
                    This event was scheduled for {formatDateTime(event.date)}, but that date has already passed. 
                    {event.aiPlan?.checklist && event.aiPlan.checklist.length > 0 ? (
                      <> Complete all checklist items and click "Mark as Completed" to move this event to completed status.
                      </>
                    ) : (
                      " You can mark this event as completed if it has already taken place."
                    )}
                  </p>
                  <div className="flex gap-2">
                    <MarkCompletedButton eventId={event._id} variant="outline" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Event Info Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Calendar className="h-5 w-5" />
                <CardDescription>Date & Time</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">{formatDateTime(event.date)}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MapPin className="h-5 w-5" />
                <CardDescription>Location</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">{event.location}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Users className="h-5 w-5" />
                <CardDescription>Attendees</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">
                {event.attendees?.length || 0} people
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <DollarSign className="h-5 w-5" />
                <CardDescription>Budget</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">{event.budget || "Not set"}</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Plan + Attendee Management (Interactive) */}
        <AIPlanSection eventId={event._id} event={event} />
      </div>
    </DashboardLayout>
  );
}
