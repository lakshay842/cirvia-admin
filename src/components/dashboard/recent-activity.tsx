"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CalendarCheck,
  CreditCard,
  FileSearch,
  Flag,
  Server,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRelativeTime } from "@/lib/utils";
import type { ActivityItem } from "@/types";

const TYPE_ICONS = {
  booking: CalendarCheck,
  payment: CreditCard,
  verification: FileSearch,
  report: Flag,
  system: Server,
  user: User,
};

interface RecentActivityProps {
  items: ActivityItem[];
}

export function RecentActivity({ items }: RecentActivityProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {items.map((item, index) => {
          const Icon = TYPE_ICONS[item.type] ?? AlertTriangle;
          const content = (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="truncate text-sm text-muted-foreground">{item.description}</p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatRelativeTime(item.timestamp)}
              </span>
            </motion.div>
          );

          return item.href ? (
            <Link key={item.id} href={item.href}>
              {content}
            </Link>
          ) : (
            <div key={item.id}>{content}</div>
          );
        })}
      </CardContent>
    </Card>
  );
}
