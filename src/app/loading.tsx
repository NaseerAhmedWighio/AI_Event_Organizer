import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
      <div className="text-center space-y-4">
        <Loader2 className="h-16 w-16 animate-spin mx-auto text-indigo-600" />
        <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
          Loading...
        </p>
      </div>
    </div>
  );
}
