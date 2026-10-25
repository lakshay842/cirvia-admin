"use client";

import { motion } from "framer-motion";
import {
  CalendarCheck,
  FileSearch,
  Flag,
  IndianRupee,
  LifeBuoy,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { DashboardStat } from "@/types";

const ICON_MAP: Record<string, LucideIcon> = {
  "indian-rupee": IndianRupee,
  "trending-up": TrendingUp,
  "calendar-check": CalendarCheck,
  users: Users,
  "shield-check": ShieldCheck,
  "file-search": FileSearch,
  flag: Flag,
  "life-buoy": LifeBuoy,
};

interface StatCardProps {
  stat: DashboardStat;
  index?: number;
}

export function StatCard({ stat, index = 0 }: StatCardProps) {
  const Icon = ICON_MAP[stat.icon] ?? TrendingUp;
  const isPositive = stat.change >= 0;
  const formatted =
    stat.format === "currency" ? formatCurrency(stat.value) : formatNumber(stat.value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
    >
      <Card className="group hover:-translate-y-0.5 hover:border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold tracking-tight">{formatted}</p>
              <div className="flex items-center gap-1.5 text-xs">
                {isPositive ? (
                  <TrendingUp className="h-3.5 w-3.5 text-success" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                )}
                <span className={isPositive ? "text-success" : "text-destructive"}>
                  {isPositive ? "+" : ""}
                  {stat.change}%
                </span>
                <span className="text-muted-foreground">{stat.changeLabel}</span>
              </div>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
