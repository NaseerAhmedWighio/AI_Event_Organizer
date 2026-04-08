"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
          <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Oops! Something went wrong</h1>
          <p className="text-gray-600 dark:text-gray-400">
            We&apos;re sorry, but an unexpected error occurred. Please try again.
          </p>
        </div>

        {error.message && (
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl text-left">
            <code className="text-sm text-gray-700 dark:text-gray-300 break-all">
              {error.message}
            </code>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={reset}
            className="gap-2 rounded-xl"
          >
            <RefreshCcw className="h-5 w-5" />
            Try Again
          </Button>
          <Link href="/">
            <Button variant="outline" className="gap-2 rounded-xl">
              <Home className="h-5 w-5" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
