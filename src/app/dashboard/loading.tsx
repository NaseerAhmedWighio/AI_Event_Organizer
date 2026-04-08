import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-indigo-600" />
        <p className="text-base font-medium text-gray-600 dark:text-gray-400">
          Loading your dashboard...
        </p>
      </div>
    </div>
  );
}
