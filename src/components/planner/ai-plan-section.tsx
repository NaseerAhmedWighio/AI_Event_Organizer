"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Clock,
  Sparkles,
  Lightbulb,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { GenerateAIPlanButton } from "@/components/dashboard/generate-ai-plan-button";
import { ChecklistManager } from "@/components/planner/checklist-manager";
import { AttendeeManager } from "@/components/planner/attendee-manager";
import { GuestIdeasImporter } from "@/components/planner/guest-ideas-importer";
import { markEventAsCompleted } from "@/actions/eventActions";
import { toast } from "sonner";

interface AIPlanSectionProps {
  eventId: string;
  event: {
    title: string;
    description: string;
    date: string;
    location: string;
    status?: string;
    category?: string;
    attendees: string[];
    aiPlan?: {
      _id: string;
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
      checklist: Array<{
        task: string;
        completed: boolean;
        priority: "high" | "medium" | "low";
      }>;
    };
  };
}

export function AIPlanSection({ eventId, event }: AIPlanSectionProps) {
  const router = useRouter();
  const [attendees, setAttendees] = useState(event.attendees || []);
  const [isCompleting, setIsCompleting] = useState(false);

  if (!event.aiPlan) {
    return (
      <Card className="border-0 shadow-xl">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Generate AI Plan</h3>
          <p className="text-muted-foreground text-center mb-6 max-w-md">
            Let AI create a comprehensive plan for your event including schedule,
            budget, suggestions, and checklists.
          </p>
          <GenerateAIPlanButton eventId={eventId} event={event} />
        </CardContent>
      </Card>
    );
  }

  const plan = event.aiPlan;
  const totalTasks = plan.checklist?.length || 0;
  const completedTasks = plan.checklist?.filter((i) => i.completed).length || 0;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleCompletePlan = async () => {
    setIsCompleting(true);
    try {
      const result = await markEventAsCompleted(eventId);
      
      if (result.success) {
        toast.success("Event Marked as Completed! 🎉", {
          description: "The event has been moved to completed status.",
          duration: 4000,
          icon: <CheckCircle className="h-5 w-5 text-emerald-500" />,
        });
        // Redirect to completed events page
        router.push("/dashboard/events/completed");
        router.refresh();
      } else {
        toast.error("Failed to Complete Event", {
          description: result.error || "Please try again.",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error completing event:", error);
      toast.error("Error", {
        description: "An unexpected error occurred. Please try again.",
        duration: 5000,
      });
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="space-y-6" id="ai-plan">
      {/* AI Plan Card */}
      <Card className="border-0 shadow-xl overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-chart-3 to-secondary" />
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle>AI Event Plan</CardTitle>
                <CardDescription>AI-generated plan for your event</CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              {event.status === "upcoming" && (
                <Button
                  onClick={handleCompletePlan}
                  disabled={isCompleting}
                  size="sm"
                  className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl"
                >
                  {isCompleting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Completing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete Plan
                    </>
                  )}
                </Button>
              )}
              <GenerateAIPlanButton eventId={eventId} event={event} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Overall Progress */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-primary/5 to-chart-3/5 dark:from-primary/10 dark:to-chart-3/10 border border-primary/20 dark:border-primary/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-primary/80 dark:text-primary/60">
                Overall Completion
              </span>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-chart-3 bg-clip-text text-transparent">
                {progressPercent}%
              </span>
            </div>
            <div className="w-full h-3 bg-primary/30 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${progressPercent === 100
                    ? "bg-gradient-to-r from-success to-emerald-600"
                    : "bg-gradient-to-r from-primary to-chart-3"
                  }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {completedTasks}/{totalTasks} tasks completed
            </p>
          </div>

          {/* Schedule */}
          {plan.schedule && plan.schedule.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-600" />
                Schedule
              </h3>
              <div className="space-y-3">
                {plan.schedule.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-xl bg-muted"
                  >
                    <div className="text-sm font-medium text-indigo-600 min-w-[100px]">
                      {item.time}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.activity}</p>
                      {item.duration && (
                        <p className="text-sm text-muted-foreground">{item.duration} minutes</p>
                      )}
                      {item.location && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {item.location}
                        </p>
                      )}
                      {item.notes && (
                        <p className="text-sm text-muted-foreground mt-1">{item.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Budget Breakdown */}
          {plan.budget && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                Budget Breakdown
              </h3>
              <div className="p-4 rounded-xl bg-success/10">
                {typeof plan.budget === "string" ? (
                  <p className="whitespace-pre-line">{plan.budget}</p>
                ) : typeof plan.budget === "object" && plan.budget !== null ? (
                  <div className="space-y-2">
                    {Object.entries(plan.budget).map(([category, amount]) => (
                      <div key={category} className="flex justify-between items-center">
                        <span className="font-medium">{category}</span>
                        <span className="text-success font-semibold">
                          ${typeof amount === "number" ? amount.toLocaleString() : amount}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {plan.suggestions && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-600" />
                AI Suggestions
              </h3>
              <div className="p-4 rounded-xl bg-warning/10">
                <p className="whitespace-pre-line">{plan.suggestions}</p>
              </div>
            </div>
          )}

          {/* Guest Ideas */}
          {plan.guestIdeas && plan.guestIdeas.length > 0 && (
            <GuestIdeasImporter
              eventId={eventId}
              guestIdeas={plan.guestIdeas}
              existingAttendees={attendees}
              onAttendeesChange={setAttendees}
            />
          )}

          {/* Interactive Checklist */}
          {plan.checklist && plan.checklist.length > 0 && (
            <ChecklistManager
              planId={plan._id}
              eventId={eventId}
              checklist={plan.checklist}
            />
          )}
        </CardContent>
      </Card>

      {/* Attendee Management */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <AttendeeManager
            eventId={eventId}
            attendees={attendees}
            onAttendeesChange={setAttendees}
          />
        </CardContent>
      </Card>
    </div>
  );
}
