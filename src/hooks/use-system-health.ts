"use client";

import { useQuery } from "@tanstack/react-query";
import { healthApi } from "@/services/dashboard.api";
import type { HealthStatus, SystemHealthItem } from "@/types";

interface HealthCheckResponse {
  success: boolean;
  data: {
    status?: string;
    version?: string;
    environment?: string;
    uptime?: number;
    timestamp?: string;
    ready?: boolean;
    alive?: boolean;
    database?: string;
    redis?: string;
    uptimeSeconds?: number;
    services?: {
      database: { status: string; latencyMs?: number };
      redis: { status: string; latencyMs?: number };
    };
  };
}

function mapServiceStatus(status: string | undefined): HealthStatus {
  if (status === "up" || status === "healthy") return "healthy";
  if (status === "degraded" || status === "warning") return "warning";
  if (status === "down" || status === "critical") return "critical";
  return "unknown";
}

function buildHealthItems(
  health: HealthCheckResponse | undefined,
  ready: HealthCheckResponse | undefined,
  live: HealthCheckResponse | undefined,
): SystemHealthItem[] {
  const services = health?.data?.services;
  return [
    {
      id: "api",
      label: "API",
      status: mapServiceStatus(health?.data?.status),
      message: health?.data?.version ? `v${health.data.version}` : undefined,
    },
    {
      id: "database",
      label: "Database",
      status: mapServiceStatus(services?.database?.status ?? ready?.data?.database),
      latencyMs: services?.database?.latencyMs,
    },
    {
      id: "redis",
      label: "Redis",
      status: mapServiceStatus(services?.redis?.status ?? ready?.data?.redis),
      latencyMs: services?.redis?.latencyMs,
    },
    {
      id: "readiness",
      label: "Readiness",
      status: ready?.data?.ready ? "healthy" : "critical",
      message: ready?.data?.ready ? "Ready" : "Not ready",
    },
    {
      id: "liveness",
      label: "Liveness",
      status: live?.data?.alive ? "healthy" : "critical",
      message: live?.data?.uptimeSeconds
        ? `Uptime ${live.data.uptimeSeconds}s`
        : undefined,
    },
    {
      id: "environment",
      label: "Environment",
      status: "unknown",
      message: health?.data?.environment ?? live?.data?.environment,
    },
  ];
}

export function useSystemHealth(refetchInterval = 30_000) {
  return useQuery({
    queryKey: ["system", "health"],
    queryFn: async () => {
      const [healthRes, readyRes, liveRes] = await Promise.allSettled([
        healthApi.check(),
        healthApi.ready(),
        healthApi.live(),
      ]);

      const health =
        healthRes.status === "fulfilled"
          ? (healthRes.value.data as HealthCheckResponse)
          : undefined;
      const ready =
        readyRes.status === "fulfilled"
          ? (readyRes.value.data as HealthCheckResponse)
          : undefined;
      const live =
        liveRes.status === "fulfilled" ? (liveRes.value.data as HealthCheckResponse) : undefined;

      const items = buildHealthItems(health, ready, live);
      const allHealthy = items
        .filter((i) => ["api", "database", "redis", "readiness", "liveness"].includes(i.id))
        .every((i) => i.status === "healthy");

      return {
        items,
        source: health || ready || live ? ("api" as const) : ("unavailable" as const),
        allHealthy,
        checkedAt: new Date().toISOString(),
        raw: { health: health?.data, ready: ready?.data, live: live?.data },
      };
    },
    refetchInterval,
    staleTime: 15_000,
  });
}
