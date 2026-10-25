"use client";

import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { SystemHealthCards } from "@/components/dashboard/system-health-cards";
import { ErrorState } from "@/components/feedback/error-state";
import { DashboardSkeleton } from "@/components/feedback/skeleton";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSystemHealth } from "@/hooks/use-system-health";
import { getApiErrorMessage } from "@/services/api-client";
import { formatRelativeTime } from "@/lib/utils";

export function SystemHealthPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useSystemHealth(30_000);

  if (isLoading) return <DashboardSkeleton />;

  if (isError || !data) {
    return (
      <ErrorState
        title="Failed to load system health"
        message={getApiErrorMessage(error)}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Health"
        description="Live infrastructure status from /health, /ready, and /live probes."
        actions={
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        }
      />

      {!data.allHealthy && (
        <p className="rounded-xl bg-warning/10 px-4 py-2 text-sm text-warning" role="status">
          One or more services are degraded. Check monitoring for details.
        </p>
      )}

      <SystemHealthCards items={data.items} />

      <p className="text-xs text-muted-foreground">
        Last checked {formatRelativeTime(data.checkedAt)} · Auto-refreshes every 30s ·{" "}
        <Link href="/monitoring" className="underline underline-offset-2">
          Open monitoring
        </Link>
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Probe summary</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-xl bg-muted/50 p-4 text-xs">
            {JSON.stringify(data.raw, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
