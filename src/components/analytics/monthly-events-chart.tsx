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
import { MonthlyData } from "@/hooks/useAnalytics";

interface MonthlyEventsChartProps {
  data: MonthlyData[];
  showUpcoming?: boolean;
  showCompleted?: boolean;
  height?: number;
}

export function MonthlyEventsChart({
  data,
  showUpcoming = true,
  showCompleted = true,
  height = 300,
}: MonthlyEventsChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card className="p-4 shadow-xl border-0 bg-card">
          <p className="text-sm font-semibold mb-2 text-foreground">
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">
                {entry.name}:
              </span>
              <span className="font-semibold text-foreground">
                {entry.value}
              </span>
            </div>
          ))}
        </Card>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full min-h-[200px] min-w-[200px]" style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%" minHeight={200} minWidth={200}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            className="stroke-border"
            vertical={false}
          />
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
          <Legend
            verticalAlign="top"
            height={36}
            formatter={(value) => (
              <span className="text-sm text-muted-foreground ml-4">
                {value}
              </span>
            )}
          />
          {showUpcoming && (
            <Bar
              dataKey="upcoming"
              name="Upcoming"
              fill="#06b6d4"
              radius={[8, 8, 0, 0]}
              stackId="stack"
            />
          )}
          {showCompleted && (
            <Bar
              dataKey="completed"
              name="Completed"
              fill="#10b981"
              radius={[8, 8, 0, 0]}
              stackId="stack"
            />
          )}
          <Bar
            dataKey="events"
            name="Total"
            fill="url(#colorTotal)"
            radius={[8, 8, 0, 0]}
            opacity={0.3}
          />
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity={1} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface TrendChartProps {
  data: MonthlyData[];
  height?: number;
}

export function EventsTrendChart({ data, height = 300 }: TrendChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card className="p-4 shadow-xl border-0 bg-card">
          <p className="text-sm font-semibold mb-2 text-foreground">
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.stroke }}
              />
              <span className="text-muted-foreground">
                {entry.name}:
              </span>
              <span className="font-semibold text-foreground">
                {entry.value}
              </span>
            </div>
          ))}
        </Card>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full min-h-[200px] min-w-[200px]" style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%" minHeight={200} minWidth={200}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorUpcoming" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            className="stroke-border"
            vertical={false}
          />
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
          <Legend
            verticalAlign="top"
            height={36}
            formatter={(value) => (
              <span className="text-sm text-muted-foreground ml-4">
                {value}
              </span>
            )}
          />
          <Line
            type="monotone"
            dataKey="events"
            name="Total Events"
            stroke="#6366f1"
            strokeWidth={3}
            dot={{ fill: "#6366f1", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="upcoming"
            name="Upcoming"
            stroke="#06b6d4"
            strokeWidth={2}
            dot={{ fill: "#06b6d4", strokeWidth: 2, r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="completed"
            name="Completed"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
