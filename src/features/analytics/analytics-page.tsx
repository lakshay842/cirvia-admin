"use client";

import { useState } from "react";
import Link from "next/link";
import { LazyChart } from "@/components/dashboard/lazy-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { DashboardSkeleton } from "@/components/feedback/skeleton";
import { ErrorState } from "@/components/feedback/error-state";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnalytics } from "@/hooks/use-analytics";
import { useLivePlatformStats } from "@/hooks/use-live-platform-stats";
import { getApiErrorMessage, getRequestId } from "@/services/api-client";

const PERIODS = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
] as const;

export function AnalyticsPage() {
  const [period, setPeriod] = useState<(typeof PERIODS)[number]["value"]>("monthly");
  const { data, isLoading, isError, error, refetch } = useAnalytics(period);
  const liveStats = useLivePlatformStats();

  if (isLoading) return <DashboardSkeleton />;

  if (isError || !data) {
    return (
      <ErrorState
        title="Failed to load analytics"
        message={getApiErrorMessage(error)}
        requestId={getRequestId(error)}
        onRetry={() => refetch()}
      />
    );
  }

  const summary = data.data;
  const stats = summary?.stats ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description={
          data.source === "mock"
            ? "Charts use mock fallback. Live counts below from implemented admin APIs."
            : "Platform statistics from /admin/statistics"
        }
        actions={
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as typeof period)}
            className="h-10 rounded-[18px] border border-input bg-background/50 px-4 text-sm"
            aria-label="Analytics period"
          >
            {PERIODS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        }
      />

      {data.source === "mock" && (
        <p className="rounded-xl bg-warning/10 px-4 py-2 text-sm text-warning" role="status">
          GET /admin/analytics/* and /admin/statistics are not implemented. Charts use mock
          fallback until backend ships.
        </p>
      )}

      {liveStats.data?.source === "api" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Live platform counts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {liveStats.data.stats.map((stat) => (
                <Link
                  key={stat.id}
                  href={stat.href ?? "#"}
                  className="rounded-xl border border-border/60 p-4 transition-colors hover:bg-muted/50"
                >
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.slice(0, 8).map((stat, index) => (
          <StatCard key={stat.id} stat={stat} index={index} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <LazyChart
          title="Revenue"
          description={`${period} revenue trend`}
          data={summary?.revenueChart ?? []}
          type="area"
          valuePrefix="₹"
        />
        <LazyChart
          title="Bookings"
          description={`${period} booking volume`}
          data={summary?.bookingChart ?? []}
          type="bar"
        />
      </div>
    </div>
  );
}
