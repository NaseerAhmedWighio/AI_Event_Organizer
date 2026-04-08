"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, Sector } from "recharts";
import { Card } from "@/components/ui/card";
import { CategoryData, StatusData } from "@/hooks/useAnalytics";

interface StatusPieChartProps {
  data: StatusData[];
  height?: number;
  showLegend?: boolean;
}

export function StatusPieChart({
  data,
  height = 300,
  showLegend = true,
}: StatusPieChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const entry = payload[0].payload as StatusData;
      return (
        <Card className="p-4 shadow-xl border-0 bg-card">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <p className="text-sm font-semibold text-foreground">
              {entry.name}
            </p>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {entry.value}
          </p>
          <p className="text-sm text-muted-foreground">
            {entry.percentage}% of total
          </p>
        </Card>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ height: `${height}px` }}>
        <p className="text-muted-foreground">No status data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[200px] min-w-[200px]" style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%" minHeight={200} minWidth={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {showLegend && (
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-sm text-muted-foreground">
                  {value}
                </span>
              )}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

interface CategoryPieChartProps {
  data: CategoryData[];
  height?: number;
  showLegend?: boolean;
}

export function CategoryPieChart({
  data,
  height = 300,
  showLegend = true,
}: CategoryPieChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const entry = payload[0].payload as CategoryData;
      return (
        <Card className="p-4 shadow-xl border-0 bg-card">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <p className="text-sm font-semibold text-foreground">
              {entry.name}
            </p>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {entry.value} events
          </p>
          <p className="text-sm text-muted-foreground">
            {entry.percentage}% of total
          </p>
        </Card>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ height: `${height}px` }}>
        <p className="text-muted-foreground">No category data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[200px] min-w-[200px]" style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%" minHeight={200} minWidth={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {showLegend && (
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-sm text-muted-foreground">
                  {value}
                </span>
              )}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

interface DonutChartWithCenterProps {
  data: { name: string; value: number; color: string }[];
  centerLabel?: string;
  centerValue?: string | number;
  height?: number;
}

export function DonutChartWithCenter({
  data,
  centerLabel,
  centerValue,
  height = 300,
}: DonutChartWithCenterProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <div className="w-full relative h-full min-h-[200px] min-w-[200px]" style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%" minHeight={200} minWidth={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            nameKey="name"
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          {centerValue !== undefined && (
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-2xl font-bold fill-foreground dark:fill-muted-foreground"
            >
              {centerValue}
            </text>
          )}
          {centerLabel && (
            <text
              x="50%"
              y="55%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs fill-muted-foreground"
            >
              {centerLabel}
            </text>
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
