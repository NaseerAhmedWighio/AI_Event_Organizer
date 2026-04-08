"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card } from "@/components/ui/card";

interface CategoryBreakdownProps {
  events?: Array<{ category?: string; status?: string }>;
}

const categoryColors: Record<string, string> = {
  conference: "#8b5cf6",
  workshop: "#f59e0b",
  meetup: "#06b6d4",
  wedding: "#ec4899",
  birthday: "#f97316",
  corporate: "#6366f1",
  other: "#64748b",
};

export function CategoryBreakdown({ events }: CategoryBreakdownProps) {
  // Count events by category
  const categoryCount: Record<string, number> = {};

  events?.forEach((event) => {
    const category = event.category || "other";
    categoryCount[category] = (categoryCount[category] || 0) + 1;
  });

  const data = Object.entries(categoryCount).map(([category, count]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: count,
    color: categoryColors[category] || categoryColors.other,
  }));

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
        <p>No events to display</p>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload as any;
                return (
                  <Card className="p-3 shadow-lg border-0 bg-card">
                    <p className="text-sm font-medium">{data.name}</p>
                    <p className="text-lg font-bold" style={{ color: data.color }}>
                      {data.value} events
                    </p>
                  </Card>
                );
              }
              return null;
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => (
              <span className="text-sm text-muted-foreground">
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
