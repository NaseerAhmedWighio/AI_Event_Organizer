"use client";

import { useState } from "react";
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
} from "lucide-react";
import { GenerateAIPlanButton } from "@/components/dashboard/generate-ai-plan-button";
import { ChecklistManager } from "@/components/planner/checklist-manager";
import { AttendeeManager } from "@/components/planner/attendee-manager";
import { GuestIdeasImporter } from "@/components/planner/guest-ideas-importer";

interface AIPlanSectionProps {
  eventId: string;
  event: {
    title: string;
    description: string;
    date: string;
    location: string;
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
  const [attendees, setAttendees] = useState(event.attendees || []);

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
            <GenerateAIPlanButton eventId={eventId} event={event} />
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
