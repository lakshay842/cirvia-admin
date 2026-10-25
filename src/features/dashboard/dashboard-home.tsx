"use client";

import { getRequestId } from "@/services/api-client";
import { useDashboardSummary } from "@/hooks/use-dashboard";
import { ChartPlaceholder } from "@/components/dashboard/chart-placeholder";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { StatCard } from "@/components/dashboard/stat-card";
import { SystemHealthCards } from "@/components/dashboard/system-health-cards";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { DashboardSkeleton } from "@/components/feedback/skeleton";

export function DashboardHome() {
  const { data, isLoading, isError, error, refetch } = useDashboardSummary();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <ErrorState
        title="Failed to load dashboard"
        message="We couldn't fetch the latest platform metrics."
        requestId={getRequestId(error)}
        onRetry={() => refetch()}
      />
    );
  }

  const stats = data.stats ?? [];

  if (stats.length === 0) {
    return (
      <EmptyState
        title="No dashboard data"
        description="Platform metrics will appear here once activity begins."
        actionLabel="Refresh"
        onAction={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform overview, metrics, and system health at a glance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={stat.id} stat={stat} index={index} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartPlaceholder
          title="Revenue"
          description="Last 7 days — placeholder until analytics API is connected"
          data={data.revenueChart ?? []}
          type="area"
          valuePrefix="₹"
        />
        <ChartPlaceholder
          title="Bookings"
          description="Last 7 days — placeholder until analytics API is connected"
          data={data.bookingChart ?? []}
          type="bar"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity items={data.recentActivity ?? []} />
        </div>
        <SystemHealthCards items={data.systemHealth ?? []} />
      </div>
    </div>
  );
}
