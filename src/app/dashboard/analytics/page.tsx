"use client";

import { useState } from "react";
import { useUser } from "@/context/AuthContext";
import { useAnalytics } from "@/hooks/useAnalytics";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  PieChart as PieChartIcon,
  BarChart3,
  RefreshCw,
  XCircle,
  Activity,
  Download,
  FileSpreadsheet,
  Printer,
  FileText,
} from "lucide-react";
import { AnalyticsStatsCards } from "@/components/analytics/dashboard-stats";
import { MonthlyEventsChart, EventsTrendChart } from "@/components/analytics/monthly-events-chart";
import { StatusPieChart, CategoryPieChart } from "@/components/analytics/status-pie-chart";
import { CategoryPerformanceList } from "@/components/analytics/category-performance";
import { Skeleton } from "@/components/ui/skeleton";
import {
  exportAllAnalyticsToCSV,
  exportCategoryPerformanceToCSV,
  exportMonthlyDataToCSV,
  generateTextReport,
} from "@/lib/analytics-export";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

export default function AnalyticsPage() {
  const { user } = useUser();
  const [chartView, setChartView] = useState<"monthly" | "trend">("monthly");

  const {
    stats,
    monthlyData,
    categoryData,
    statusData,
    categoryPerformance,
    isLoading,
    isRefreshing,
    refetch,
    hasRealTime,
    lastUpdated,
  } = useAnalytics({
    userId: user?.id || "",
    enabled: !!user,
    monthsToFetch: 12,
    enableRealTime: true,
    includeCategoryPerformance: true,
  });

  const completionRate =
    stats && stats.totalEvents > 0
      ? Math.round((stats.completedEvents / stats.totalEvents) * 100)
      : 0;

  const handleExport = (format: "csv" | "text") => {
    if (!stats) return;

    if (format === "csv") {
      exportAllAnalyticsToCSV(stats, monthlyData, categoryData, statusData, categoryPerformance);
    } else if (format === "text") {
      const report = generateTextReport(stats, monthlyData, categoryPerformance);
      const blob = new Blob([report], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `analytics-report-${new Date().toISOString().split("T")[0]}.txt`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Track your event performance and insights
            </p>
          </div>
          <div className="flex items-center gap-3">
            {hasRealTime && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm">
                <Activity className="h-4 w-4" />
                <span>Live</span>
              </div>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="lg" className="gap-2 rounded-xl">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExport("csv")}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("text")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export as Text
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.print()}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              size="lg"
              onClick={() => refetch()}
              disabled={isRefreshing}
              className="gap-2 rounded-xl"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>

        {/* Last Updated */}
        {lastUpdated && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {lastUpdated.toLocaleString()}
          </p>
        )}

        {/* Stats Overview */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-linear-to-br from-indigo-600 to-cyan-500 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Overview</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Key metrics at a glance</p>
            </div>
          </div>
          <AnalyticsStatsCards stats={stats || undefined} isLoading={isLoading} />
        </section>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg overflow-hidden group hover:shadow-xl transition-all">
            <div className="h-1 bg-linear-to-r from-emerald-600 to-green-500" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Completion Rate
              </CardTitle>
              <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{completionRate}%</div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="bg-linear-to-r from-emerald-600 to-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg overflow-hidden group hover:shadow-xl transition-all">
            <div className="h-1 bg-linear-to-r from-cyan-600 to-blue-500" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Upcoming Events
              </CardTitle>
              <div className="h-8 w-8 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.upcomingEvents || 0}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Scheduled events</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg overflow-hidden group hover:shadow-xl transition-all">
            <div className="h-1 bg-linear-to-r from-red-600 to-rose-500" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Cancelled
              </CardTitle>
              <div className="h-8 w-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.cancelledEvents || 0}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Cancelled events</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg overflow-hidden group hover:shadow-xl transition-all">
            <div className="h-1 bg-linear-to-r from-purple-600 to-pink-500" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Avg. Attendees
              </CardTitle>
              <div className="h-8 w-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.averageAttendees || 0}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Per event</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Events by Month */}
          <Card className="border-0 shadow-xl overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-linear-to-br from-indigo-600 to-cyan-500 flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Events Trend</CardTitle>
                    <CardDescription>
                      Event creation over the past year
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={chartView === "monthly" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setChartView("monthly")}
                    className="rounded-lg"
                  >
                    Monthly
                  </Button>
                  <Button
                    variant={chartView === "trend" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setChartView("trend")}
                    className="rounded-lg"
                  >
                    Trend
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="w-full h-[300px]" />
              ) : chartView === "monthly" ? (
                <MonthlyEventsChart data={monthlyData} height={300} />
              ) : (
                <EventsTrendChart data={monthlyData} height={300} />
              )}
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card className="border-0 shadow-xl overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-linear-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                  <PieChartIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle>Status Distribution</CardTitle>
                  <CardDescription>
                    Breakdown by event status
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="w-full h-[300px]" />
              ) : (
                <StatusPieChart data={statusData} height={300} />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        <Card className="border-0 shadow-xl overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-linear-to-br from-amber-600 to-orange-500 flex items-center justify-center">
                <PieChartIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription>
                  Distribution of events by category
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="w-full h-[300px]" />
            ) : (
              <CategoryPieChart data={categoryData} height={300} />
            )}
          </CardContent>
        </Card>

        {/* Category Performance */}
        {categoryPerformance && categoryPerformance.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-linear-to-br from-emerald-600 to-green-500 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Category Performance</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Completion rates by category</p>
              </div>
            </div>
            <CategoryPerformanceList data={categoryPerformance} />
          </section>
        )}
      </div>
    </DashboardLayout>
  );
}
