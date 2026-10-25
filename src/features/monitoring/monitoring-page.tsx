"use client";

import { Activity, RefreshCw } from "lucide-react";
import { SystemHealthCards } from "@/components/dashboard/system-health-cards";
import { ErrorState } from "@/components/feedback/error-state";
import { DashboardSkeleton } from "@/components/feedback/skeleton";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSystemHealth } from "@/hooks/use-system-health";
import { getApiErrorMessage } from "@/services/api-client";
import { formatRelativeTime } from "@/lib/utils";

export function MonitoringPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useSystemHealth(15_000);

  if (isLoading) return <DashboardSkeleton />;

  if (isError || !data) {
    return (
      <ErrorState
        title="Monitoring unavailable"
        message={getApiErrorMessage(error)}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Monitoring"
        description="Real-time service probes. Admin monitoring APIs are not implemented — using public health endpoints."
        actions={
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            Refresh now
          </Button>
        }
      />

      <div className="flex items-center gap-2 rounded-xl border border-border bg-card/50 px-4 py-3 text-sm">
        <Activity className="h-4 w-4 text-primary" aria-hidden />
        <span role="status">
          Platform status:{" "}
          <strong>{data.allHealthy ? "Operational" : "Degraded"}</strong> · Updated{" "}
          {formatRelativeTime(data.checkedAt)}
        </span>
      </div>

      <SystemHealthCards items={data.items} />

      <div className="grid gap-4 lg:grid-cols-3">
        {(["health", "ready", "live"] as const).map((probe) => (
          <Card key={probe}>
            <CardHeader>
              <CardTitle className="text-base capitalize">/{probe}</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="max-h-48 overflow-auto rounded-lg bg-muted/50 p-3 text-xs">
                {JSON.stringify(data.raw[probe], null, 2) ?? "No response"}
              </pre>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
