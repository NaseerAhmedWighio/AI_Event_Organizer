"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard Error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
          <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Dashboard Error</h2>
          <p className="text-gray-600 dark:text-gray-400">
            We couldn&apos;t load your dashboard. Please try again.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Button
            onClick={reset}
            className="gap-2 rounded-xl"
          >
            <RefreshCcw className="h-5 w-5" />
            Retry
          </Button>
        </div>
      </div>
    </div>
  );
}
