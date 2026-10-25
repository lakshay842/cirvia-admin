"use client";

import { useQuery } from "@tanstack/react-query";
import {
  mergeAnalyticsSummary,
  normalizeDashboardSummary,
} from "@/lib/dashboard-summary";
import { analyticsApi, type AnalyticsPeriod } from "@/services/analytics.api";
import { dashboardApi } from "@/services/dashboard.api";
import {
  MOCK_BOOKING_CHART,
  MOCK_REVENUE_CHART,
  MOCK_STATS,
} from "@/lib/mock-data";
import type { DashboardSummary } from "@/services/dashboard.api";

function buildFallback(): DashboardSummary {
  return {
    stats: MOCK_STATS,
    revenueChart: MOCK_REVENUE_CHART,
    bookingChart: MOCK_BOOKING_CHART,
    recentActivity: [],
    systemHealth: [],
  };
}

async function fetchAnalytics(period: AnalyticsPeriod) {
  let summary: DashboardSummary | null = null;

  try {
    const { data } = await dashboardApi.summary();
    summary = normalizeDashboardSummary(data.data);
  } catch {
    // fall through to mock or analytics-only data
  }

  try {
    const [revenueRes, bookingsRes] = await Promise.all([
      analyticsApi.revenue(period),
      analyticsApi.bookings(period),
    ]);

    const base = summary ?? buildFallback();
    return {
      data: mergeAnalyticsSummary(base, revenueRes.data.data, bookingsRes.data.data),
      source: "api" as const,
    };
  } catch {
    if (summary) {
      return { data: summary, source: "api" as const };
    }
    return { data: buildFallback(), source: "mock" as const };
  }
}

export function useAnalytics(period: AnalyticsPeriod = "monthly") {
  return useQuery({
    queryKey: ["admin", "analytics", period],
    queryFn: () => fetchAnalytics(period),
    staleTime: 60_000,
  });
}
