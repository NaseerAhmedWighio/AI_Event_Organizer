import { getAuthUser } from "@/lib/server-auth";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { client } from "@/lib/sanityClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  CheckCircle,
  Circle,
  Users,
  Calendar,
  TrendingUp,
  Clock,
  ArrowRight,
  ListTodo,
  MapPin,
} from "lucide-react";
import Link from "next/link";

interface PlanSummary {
  _id: string;
  eventRef: {
    _id: string;
    title: string;
    date: string;
    location: string;
    status: string;
    category: string;
    attendees: string[];
  };
  checklist: Array<{ task: string; completed: boolean; priority: string }>;
  schedule: Array<any>;
  guestIdeas: string[];
  _createdAt: string;
}

export default async function PlannerPage() {
  const user = await getAuthUser();
  const userId = user.id;

  const plans: PlanSummary[] = await client.fetch(
    `*[_type == "aiPlan" && event->createdBy == $userId] {
      _id,
      _createdAt,
      "eventRef": event->{
        _id,
        title,
        date,
        location,
        status,
        category,
        attendees
      },
      checklist,
      schedule,
      guestIdeas
    } | order(_createdAt desc)`,
    { userId }
  );

  const totalPlans = plans.length;
  const totalChecklistItems = plans.reduce((sum, p) => sum + (p.checklist?.length || 0), 0);
  const completedChecklistItems = plans.reduce(
    (sum, p) => sum + (p.checklist?.filter((i) => i.completed).length || 0),
    0
  );
  const totalAttendees = plans.reduce(
    (sum, p) => sum + (p.eventRef?.attendees?.length || 0),
    0
  );
  const upcomingEvents = plans.filter((p) => p.eventRef?.status === "upcoming").length;

  const overallProgress =
    totalChecklistItems > 0
      ? Math.round((completedChecklistItems / totalChecklistItems) * 100)
      : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Event Planner</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track progress across all your AI-powered event plans
            </p>
          </div>
          <Link href="/dashboard/events">
            <Button variant="outline" className="gap-2 rounded-xl">
              <Calendar className="h-4 w-4" />
              Manage Events
            </Button>
          </Link>
        </div>

        {/* Overall Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Sparkles className="h-5 w-5" />
                <CardDescription>AI Plans</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalPlans}</p>
              <p className="text-sm text-gray-500 mt-1">
                {upcomingEvents} upcoming
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <ListTodo className="h-5 w-5" />
                <CardDescription>Task Completion</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {completedChecklistItems}/{totalChecklistItems}
              </p>
              <p className="text-sm text-gray-500 mt-1">{overallProgress}% complete</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Users className="h-5 w-5" />
                <CardDescription>Total Attendees</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalAttendees}</p>
              <p className="text-sm text-gray-500 mt-1">Across all events</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <TrendingUp className="h-5 w-5" />
                <CardDescription>Overall Progress</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-indigo-600 to-cyan-500 rounded-full transition-all duration-700"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
                <span className="text-xl font-bold">{overallProgress}%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Plans List */}
        {plans.length > 0 ? (
          <div className="grid gap-4">
            {plans.map((plan) => {
              const total = plan.checklist?.length || 0;
              const completed = plan.checklist?.filter((i) => i.completed).length || 0;
              const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
              const attendeeCount = plan.eventRef?.attendees?.length || 0;

              return (
                <Card key={plan._id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">{plan.eventRef?.title}</CardTitle>
                          <Badge
                            variant={
                              plan.eventRef?.status === "upcoming"
                                ? "default"
                                : plan.eventRef?.status === "completed"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {plan.eventRef?.status}
                          </Badge>
                          {plan.eventRef?.category && (
                            <Badge variant="outline">{plan.eventRef.category}</Badge>
                          )}
                        </div>
                        <CardDescription className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(plan.eventRef?.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {plan.eventRef?.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {attendeeCount} attendees
                          </span>
                        </CardDescription>
                      </div>
                      <Link href={`/dashboard/events/${plan.eventRef?._id}#ai-plan`}>
                        <Button variant="ghost" size="sm" className="gap-2 rounded-xl">
                          View Plan
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-3 gap-4">
                      {/* Progress */}
                      <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Tasks
                          </span>
                          <span className="text-sm font-bold">{progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${progress === 100
                                ? "bg-emerald-600"
                                : "bg-linear-to-r from-indigo-600 to-cyan-500"
                              }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {completed}/{total} completed
                        </p>
                      </div>

                      {/* Schedule Summary */}
                      <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-indigo-600" />
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Schedule
                          </span>
                        </div>
                        <p className="text-2xl font-bold">
                          {plan.schedule?.length || 0}
                        </p>
                        <p className="text-xs text-gray-500">activities planned</p>
                      </div>

                      {/* Guest Ideas */}
                      <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-cyan-600" />
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Guest Ideas
                          </span>
                        </div>
                        <p className="text-2xl font-bold">
                          {plan.guestIdeas?.length || 0}
                        </p>
                        <p className="text-xs text-gray-500">suggestions</p>
                      </div>
                    </div>

                    {/* Checklist Preview */}
                    {plan.checklist && plan.checklist.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">
                          Checklist Preview
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {plan.checklist.slice(0, 6).map((item, index) => (
                            <span
                              key={index}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${item.completed
                                  ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 line-through"
                                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                                }`}
                            >
                              {item.completed ? (
                                <CheckCircle className="h-3 w-3" />
                              ) : (
                                <Circle className="h-3 w-3" />
                              )}
                              {item.task}
                            </span>
                          ))}
                          {plan.checklist.length > 6 && (
                            <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-500">
                              +{plan.checklist.length - 6} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-0 shadow-lg">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="h-20 w-20 rounded-2xl bg-linear-to-br from-indigo-600 to-cyan-500 flex items-center justify-center mb-6">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">No AI Plans Yet</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center mb-6 max-w-md">
                Generate AI plans for your events to track progress, checklists, and attendee management all in one place.
              </p>
              <Link href="/dashboard/events">
                <Button className="gap-2 rounded-xl">
                  <Calendar className="h-4 w-4" />
                  Go to Events
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
