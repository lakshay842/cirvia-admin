import { useQuery } from "@tanstack/react-query";
import { normalizeDashboardSummary } from "@/lib/dashboard-summary";
import { dashboardApi } from "@/services/dashboard.api";
import {
  MOCK_ACTIVITY,
  MOCK_BOOKING_CHART,
  MOCK_REVENUE_CHART,
  MOCK_STATS,
  MOCK_SYSTEM_HEALTH,
} from "@/lib/mock-data";
import type { DashboardSummary } from "@/services/dashboard.api";

function buildFallbackSummary(): DashboardSummary {
  return {
    stats: MOCK_STATS,
    revenueChart: MOCK_REVENUE_CHART,
    bookingChart: MOCK_BOOKING_CHART,
    recentActivity: MOCK_ACTIVITY,
    systemHealth: MOCK_SYSTEM_HEALTH,
  };
}

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: async () => {
      try {
        const { data } = await dashboardApi.summary();
        return normalizeDashboardSummary(data.data) ?? buildFallbackSummary();
      } catch {
        return buildFallbackSummary();
      }
    },
    staleTime: 60_000,
    refetchInterval: 120_000,
  });
}
