"use client";

import { memo, useId } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChartDataPoint } from "@/types";

interface ChartPlaceholderProps {
  title: string;
  description?: string;
  data: ChartDataPoint[];
  type?: "area" | "bar";
  valuePrefix?: string;
}

export const ChartPlaceholder = memo(function ChartPlaceholder({
  title,
  description,
  data,
  type = "area",
  valuePrefix = "",
}: ChartPlaceholderProps) {
  const gradientId = useId().replace(/:/g, "");
  const summary = data.reduce((sum, point) => sum + point.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div
          className="h-[260px] w-full"
          role="img"
          aria-label={`${title} chart. Total ${valuePrefix}${summary.toLocaleString()} across ${data.length} data points.`}
        >
          <ResponsiveContainer width="100%" height="100%">
            {type === "area" ? (
              <AreaChart data={data}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="label"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                  }}
                  formatter={(value: number) => [`${valuePrefix}${value}`, "Value"]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--primary)"
                  fill={`url(#${gradientId})`}
                  strokeWidth={2}
                  isAnimationActive={data.length < 24}
                />
              </AreaChart>
            ) : (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="label"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="var(--secondary)"
                  radius={[8, 8, 0, 0]}
                  isAnimationActive={data.length < 24}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
});
