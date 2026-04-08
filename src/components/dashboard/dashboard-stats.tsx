"use client";

import { motion } from "framer-motion";
import { Calendar, CheckCircle, Clock, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardStatsProps {
  stats?: {
    totalEvents?: number;
    upcomingEvents?: number;
    completedEvents?: number;
    totalAIPlans?: number;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      title: "Total Events",
      value: stats?.totalEvents || 0,
      icon: Calendar,
      gradient: "from-primary to-chart-3",
      bgColor: "bg-primary/10",
    },
    {
      title: "Upcoming",
      value: stats?.upcomingEvents || 0,
      icon: Clock,
      gradient: "from-secondary to-blue-600",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Completed",
      value: stats?.completedEvents || 0,
      icon: CheckCircle,
      gradient: "from-success to-emerald-500",
      bgColor: "bg-success/10",
    },
    {
      title: "AI Plans",
      value: stats?.totalAIPlans || 0,
      icon: Sparkles,
      gradient: "from-chart-3 to-pink-500",
      bgColor: "bg-chart-3/10",
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="relative overflow-hidden border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-medium text-muted-foreground mb-2">
                    {stat.title}
                  </p>
                  <p className="text-4xl font-bold">{stat.value}</p>
                </div>
                <div
                  className={`h-16 w-16 rounded-2xl ${stat.bgColor} flex items-center justify-center`}
                >
                  <div
                    className={`h-8 w-8 rounded-lg bg-linear-to-br ${stat.gradient} flex items-center justify-center`}
                  >
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
