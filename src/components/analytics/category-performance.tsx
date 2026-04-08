"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryPerformance } from "@/hooks/useAnalytics";
import { CheckCircle, Clock, XCircle } from "lucide-react";

interface CategoryPerformanceChartProps {
  data: CategoryPerformance[];
  height?: number;
}

export function CategoryPerformanceChart({
  data,
  height = 400,
}: CategoryPerformanceChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const entry = payload[0].payload as CategoryPerformance;
      return (
        <Card className="p-4 shadow-xl border-0 bg-card">
          <p className="text-sm font-semibold mb-3 text-foreground">
            {entry.category}
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-semibold text-foreground">
                {entry.total}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-muted-foreground">Completed:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {entry.completed}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-muted-foreground">Upcoming:</span>
              <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                {entry.upcoming}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-muted-foreground">Cancelled:</span>
              <span className="font-semibold text-red-600 dark:text-red-400">
                {entry.cancelled}
              </span>
            </div>
            <div className="pt-2 border-t border-border">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Completion Rate:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {entry.completionRate}%
                </span>
              </div>
            </div>
          </div>
        </Card>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ height: `${height}px` }}>
        <p className="text-muted-foreground">No category performance data available</p>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.category.length > 12 ? item.category.slice(0, 12) + "..." : item.category,
    completed: item.completed,
    upcoming: item.upcoming,
    cancelled: item.cancelled,
    completionRate: item.completionRate,
    fullName: item.category,
  }));

  return (
    <div className="w-full" style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          layout="vertical"
        >
          <CartesianGrid
            strokeDasharray="3 3"
            className="stroke-border"
            horizontal={true}
            vertical={false}
          />
          <XAxis
            type="number"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            allowDecimals={false}
          />
          <YAxis
            dataKey="name"
            type="category"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 500 }}
            width={100}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="completed"
            name="Completed"
            stackId="stack"
            fill="#10b981"
            radius={[0, 4, 4, 0]}
          />
          <Bar
            dataKey="upcoming"
            name="Upcoming"
            stackId="stack"
            fill="#06b6d4"
            radius={[0, 4, 4, 0]}
          />
          <Bar
            dataKey="cancelled"
            name="Cancelled"
            stackId="stack"
            fill="#ef4444"
            radius={[4, 0, 0, 4]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface CategoryPerformanceListProps {
  data: CategoryPerformance[];
}

export function CategoryPerformanceList({ data }: CategoryPerformanceListProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No category performance data available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((category) => (
        <Card key={category.category} className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg text-foreground">
                {category.category}
              </h3>
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {category.completionRate}%
              </div>
            </div>

            <div className="w-full bg-muted rounded-full h-3 mb-4 overflow-hidden">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                style={{ width: `${category.completionRate}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Completed</p>
                  <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {category.completed}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-cyan-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Upcoming</p>
                  <p className="font-semibold text-cyan-600 dark:text-cyan-400">
                    {category.upcoming}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Cancelled</p>
                  <p className="font-semibold text-red-600 dark:text-red-400">
                    {category.cancelled}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">{category.total}</span> total events
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
