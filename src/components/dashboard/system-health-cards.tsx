"use client";

import { Activity, AlertTriangle, CheckCircle2, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { HealthStatus, SystemHealthItem } from "@/types";

const STATUS_CONFIG: Record<
  HealthStatus,
  { label: string; icon: typeof CheckCircle2; className: string }
> = {
  healthy: {
    label: "Healthy",
    icon: CheckCircle2,
    className: "text-success bg-success/10 border-success/20",
  },
  warning: {
    label: "Warning",
    icon: AlertTriangle,
    className: "text-warning bg-warning/10 border-warning/20",
  },
  critical: {
    label: "Critical",
    icon: AlertTriangle,
    className: "text-destructive bg-destructive/10 border-destructive/20",
  },
  unknown: {
    label: "Unknown",
    icon: HelpCircle,
    className: "text-muted-foreground bg-muted border-border",
  },
};

interface SystemHealthCardsProps {
  items: SystemHealthItem[];
}

export function SystemHealthCards({ items }: SystemHealthCardsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>System Health</CardTitle>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => {
            const config = STATUS_CONFIG[item.status];
            const Icon = config.icon;
            return (
              <div
                key={item.id}
                className={cn(
                  "rounded-2xl border p-4 transition-transform hover:scale-[1.01]",
                  config.className,
                )}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{item.label}</p>
                  <Icon className="h-4 w-4" />
                </div>
                <p className="mt-2 text-xs opacity-80">{config.label}</p>
                {item.latencyMs !== undefined && (
                  <p className="mt-1 text-xs opacity-70">{item.latencyMs}ms</p>
                )}
                {item.message && (
                  <p className="mt-1 text-xs opacity-70">{item.message}</p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
