"use client";

import { useState } from "react";
import { markEventAsCompleted, autoMarkEventAsCompleted } from "@/actions/eventActions";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface MarkCompletedButtonProps {
  eventId: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
  autoMark?: boolean;
}

export function MarkCompletedButton({
  eventId,
  variant = "default",
  size = "default",
  showIcon = true,
  autoMark = false,
}: MarkCompletedButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      let result;
      
      if (autoMark) {
        result = await autoMarkEventAsCompleted(eventId);
      } else {
        result = await markEventAsCompleted(eventId);
      }

      if (result.success) {
        toast.success("Event Marked as Completed! 🎉", {
          description: "The event status has been updated successfully.",
          duration: 4000,
          icon: <CheckCircle className="h-5 w-5 text-emerald-500" />,
        });
        router.refresh();
      } else {
        toast.error("Failed to Update Event", {
          description: result.error || "Please try again.",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error marking event as completed:", error);
      toast.error("Error", {
        description: "An unexpected error occurred. Please try again.",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isLoading}
      className="gap-2"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {showIcon && "Processing..."}
        </>
      ) : (
        <>
          {showIcon && <CheckCircle className="h-4 w-4" />}
          Mark as Completed
        </>
      )}
    </Button>
  );
}
