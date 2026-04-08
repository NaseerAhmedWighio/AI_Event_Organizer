"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAIPlan, regenerateAIPlan } from "@/actions/aiPlanActions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface GenerateAIPlanButtonProps {
  eventId: string;
  event: {
    title: string;
    description: string;
    date: string;
    location: string;
    category?: string;
    attendees?: string[];
    aiPlan?: any;
  };
}

export function GenerateAIPlanButton({
  eventId,
  event,
}: GenerateAIPlanButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  async function handleGenerate(regenerate = false) {
    setIsGenerating(true);
    try {
      const input = {
        eventId,
        eventTitle: event.title,
        eventDescription: event.description,
        eventDate: event.date,
        location: event.location,
        category: event.category || "other",
        expectedAttendees: event.attendees?.length || 0,
      };

      const action = regenerate ? regenerateAIPlan : createAIPlan;
      const result = await action(input);

      if (result.success) {
        toast({
          title: regenerate ? "Plan regenerated!" : "AI plan created!",
          description: "Your AI-powered event plan is ready.",
        });
        setOpen(false);
        router.refresh();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to generate AI plan",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="gap-2 rounded-xl"
        variant="outline"
      >
        <Sparkles className="h-4 w-4" />
        {event.aiPlan ? "Regenerate Plan" : "Generate AI Plan"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <DialogTitle>
                {event.aiPlan ? "Regenerate AI Plan" : "Generate AI Plan"}
              </DialogTitle>
            </div>
            <DialogDescription>
              {event.aiPlan
                ? "This will create a new AI plan, replacing the existing one. Your event details will be reanalyzed."
                : "Our AI will analyze your event and create a comprehensive plan including schedule, budget, suggestions, and checklists."}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-3">
              <h4 className="font-medium">Your event details:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Title: {event.title}</li>
                <li>• Date: {new Date(event.date).toLocaleDateString()}</li>
                <li>• Location: {event.location}</li>
                <li>• Category: {event.category || "Other"}</li>
                {event.attendees && (
                  <li>• Attendees: {event.attendees.length} people</li>
                )}
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isGenerating}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleGenerate(event.aiPlan)}
              disabled={isGenerating}
              className="gap-2 rounded-xl"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  {event.aiPlan ? "Regenerate" : "Generate Plan"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
