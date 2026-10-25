"use client";

import { useState } from "react";
import { LazyChart } from "@/components/dashboard/lazy-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { DataTable } from "@/components/data-display/data-table";
import { StatusBadge } from "@/components/data-display/status-badge";
import { DashboardSkeleton } from "@/components/feedback/skeleton";
import { PageHeader } from "@/components/layout/page-header";
import { useAnalytics } from "@/hooks/use-analytics";
import { usePaymentsList } from "@/hooks/use-payments";
import { formatCurrency } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import type { PaymentDetails } from "@/types/payments.types";

const paymentColumns: ColumnDef<PaymentDetails>[] = [
  {
    accessorKey: "eventTitle",
    header: "Event",
  },
  {
    accessorKey: "amount",
    header: "Guest paid",
    cell: ({ row }) => formatCurrency(row.original.amount, row.original.currency),
  },
  {
    accessorKey: "platformFee",
    header: "Platform fee",
    cell: ({ row }) => (
      <span className="text-warning">
        {formatCurrency(row.original.platformFee, row.original.currency)}
      </span>
    ),
  },
  {
    accessorKey: "netAmount",
    header: "Host received",
    cell: ({ row }) => (
      <span className="font-medium text-success">
        {formatCurrency(row.original.netAmount, row.original.currency)}
      </span>
    ),
  },
  {
    accessorKey: "paymentStatus",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.paymentStatus} />,
  },
];

export function RevenueDashboardPage() {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");
  const analytics = useAnalytics(period);
  const payments = usePaymentsList({ page: 1, limit: 10, status: "captured" });

  if (analytics.isLoading) return <DashboardSkeleton />;

  const summary = analytics.data?.data;
  const revenueStats = summary?.stats?.filter((s) => s.format === "currency") ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Revenue Dashboard"
        description={
          analytics.data?.source === "mock"
            ? "Analytics APIs unavailable — charts use mock data. Recent payments from /admin/payments."
            : "Guest payments, platform fee cut, and host earnings"
        }
        actions={
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as typeof period)}
            className="h-10 rounded-[18px] border border-input bg-background/50 px-4 text-sm"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        }
      />

      {analytics.data?.source === "mock" && (
        <p className="rounded-xl bg-warning/10 px-4 py-2 text-sm text-warning">
          Analytics APIs unavailable — showing mock fallback data.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {revenueStats.slice(0, 4).map((stat, index) => (
          <StatCard key={stat.id} stat={stat} index={index} />
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        Guest paid = full booking amount · Platform fee = Cirvia commission · Host received = guest paid − fee
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <LazyChart
          title="Revenue trend (guest paid)"
          data={summary?.revenueChart ?? []}
          type="area"
          valuePrefix="₹"
        />
        <LazyChart
          title="Booking volume"
          data={summary?.bookingChart ?? []}
          type="bar"
        />
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Recent captured payments</h2>
        <DataTable
          columns={paymentColumns}
          data={payments.data?.items ?? []}
          isLoading={payments.isLoading}
          emptyMessage="No captured payments."
        />
      </div>
    </div>
  );
}
