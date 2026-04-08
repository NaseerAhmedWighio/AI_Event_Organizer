"use client";

import { Calendar, CheckCircle, Clock, XCircle, Users, Sparkles, TrendingUp, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStatsProps {
  stats?: {
    totalEvents: number;
    upcomingEvents: number;
    completedEvents: number;
    totalAIPlans: number;
  };
  isLoading?: boolean;
}

export function DashboardStats({ stats, isLoading = false }: DashboardStatsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-0 shadow-lg overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-primary to-secondary" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Events",
      value: stats?.totalEvents || 0,
      description: "All time events",
      icon: Calendar,
      gradient: "from-primary to-secondary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Upcoming",
      value: stats?.upcomingEvents || 0,
      description: "Scheduled events",
      icon: Clock,
      gradient: "from-warning to-amber-500",
      bgColor: "bg-warning/10",
    },
    {
      title: "Completed",
      value: stats?.completedEvents || 0,
      description: "Successfully done",
      icon: CheckCircle,
      gradient: "from-success to-emerald-500",
      bgColor: "bg-success/10",
    },
    {
      title: "AI Plans",
      value: stats?.totalAIPlans || 0,
      description: "AI generated",
      icon: Sparkles,
      gradient: "from-chart-3 to-pink-500",
      bgColor: "bg-chart-3/10",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <Card
          key={stat.title}
          className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
          <div className={`h-1 bg-gradient-to-r ${stat.gradient}`} />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`h-8 w-8 rounded-lg ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <stat.icon className={`h-4 w-4 text-${stat.gradient.split("-")[1]}-600 dark:text-${stat.gradient.split("-")[1]}-400`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 dark:from-foreground dark:to-foreground/50 bg-clip-text text-transparent">
              {stat.value.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

interface AnalyticsStatsCardProps {
  stats?: {
    totalEvents: number;
    upcomingEvents: number;
    completedEvents: number;
    cancelledEvents: number;
    totalAttendees: number;
    totalAIPlans: number;
    thisMonthEvents: number;
    averageAttendees: number;
  };
  isLoading?: boolean;
}

export function AnalyticsStatsCards({ stats, isLoading = false }: AnalyticsStatsCardProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Events",
      value: stats?.totalEvents || 0,
      description: "All time events created",
      icon: Calendar,
      gradient: "from-primary to-secondary",
    },
    {
      title: "This Month",
      value: stats?.thisMonthEvents || 0,
      description: "Events this month",
      icon: Clock,
      gradient: "from-warning to-amber-500",
    },
    {
      title: "Total Attendees",
      value: stats?.totalAttendees || 0,
      description: "Across all events",
      icon: Users,
      gradient: "from-success to-emerald-500",
    },
    {
      title: "Avg. Attendees",
      value: stats?.averageAttendees || 0,
      description: "Per event",
      icon: TrendingUp,
      gradient: "from-chart-3 to-pink-500",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <Card
          key={stat.title}
          className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
          <div className={`h-1 bg-gradient-to-r ${stat.gradient}`} />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 dark:from-foreground dark:to-foreground/50 bg-clip-text text-transparent">
              {stat.value.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

interface MiniStatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ElementType;
  gradient?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function MiniStatCard({
  title,
  value,
  description,
  icon: Icon,
  gradient = "from-primary to-secondary",
  trend,
}: MiniStatCardProps) {
  return (
    <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className={`h-1 bg-gradient-to-r ${gradient}`} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 dark:from-foreground dark:to-foreground/50 bg-clip-text text-transparent">
            {typeof value === "number" ? value.toLocaleString() : value}
          </div>
          {trend && (
            <div
              className={`flex items-center text-sm font-medium ${trend.isPositive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400"
                }`}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
