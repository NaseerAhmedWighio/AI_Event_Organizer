"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import { Card } from "@/components/ui/card";
import { groupEventsByMonth, getLast12Months } from "@/lib/utils";

interface AnalyticsChartProps {
  eventsByMonth?: any[];
  height?: number;
  variant?: "bar" | "line" | "area";
}

export function AnalyticsChart({
  eventsByMonth,
  height = 300,
  variant = "bar",
}: AnalyticsChartProps) {
  const months = getLast12Months();
  const data = groupEventsByMonth(eventsByMonth || []);

  const chartData = months.map((month) => ({
    name: month,
    events: data[month] || 0,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card className="p-3 shadow-lg border-0 bg-card">
          <p className="text-sm font-medium">
            {payload[0].payload.name}
          </p>
          <p className="text-lg font-bold text-indigo-600">
            {payload[0].value} events
          </p>
        </Card>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (variant) {
      case "line":
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="events"
              stroke="url(#colorEvents)"
              strokeWidth={3}
              dot={{ fill: "#6366f1", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <defs>
              <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={1} />
              </linearGradient>
            </defs>
          </LineChart>
        );
      case "area":
        return (
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="events"
              stroke="url(#colorArea)"
              strokeWidth={3}
              fill="url(#colorArea)"
            />
          </AreaChart>
        );
      default:
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="events"
              fill="url(#colorEvents)"
              radius={[8, 8, 0, 0]}
              className="transition-all duration-300 hover:opacity-80"
            />
            <defs>
              <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={1} />
              </linearGradient>
            </defs>
          </BarChart>
        );
    }
  };

  return (
    <div className="w-full h-full min-h-[200px] min-w-[200px]" style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%" minHeight={200} minWidth={200}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}
