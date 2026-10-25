"use client";

import { useQuery } from "@tanstack/react-query";
import { extractMeta, extractNestedMeta } from "@/lib/api-utils";
import { eventsApi } from "@/services/events.api";
import { hostsApi } from "@/services/hosts.api";
import { paymentsApi } from "@/services/payments.api";
import { reviewsApi } from "@/services/reviews.api";
import { walletApi } from "@/services/wallet.api";

export interface LivePlatformStat {
  id: string;
  label: string;
  value: number;
  href?: string;
}

export function useLivePlatformStats() {
  return useQuery({
    queryKey: ["admin", "live-platform-stats"],
    queryFn: async () => {
      const results = await Promise.allSettled([
        paymentsApi.list({ page: 1, limit: 1 }),
        hostsApi.list({ page: 1, limit: 1 }),
        eventsApi.listPending({ page: 1, limit: 1 }),
        reviewsApi.list({ page: 1, limit: 1, status: "pending" }),
        walletApi.listPayouts({ page: 1, limit: 1, status: "pending" }),
        paymentsApi.list({ page: 1, limit: 1, status: "captured" }),
      ]);

      const getTotal = (index: number) => {
        const result = results[index];
        if (result.status !== "fulfilled") return null;
        const response = result.value.data;
        return (
          extractNestedMeta(response.data as { meta?: import("@/types/api.types").PaginationMeta })?.total ??
          extractMeta(response)?.total ??
          null
        );
      };

      const stats: LivePlatformStat[] = [
        { id: "payments", label: "Total payments", value: getTotal(0) ?? 0, href: "/payments" },
        { id: "hosts", label: "Hosts", value: getTotal(1) ?? 0, href: "/hosts" },
        { id: "pending-events", label: "Pending events", value: getTotal(2) ?? 0, href: "/events" },
        { id: "pending-reviews", label: "Pending reviews", value: getTotal(3) ?? 0, href: "/reviews" },
        { id: "pending-payouts", label: "Pending payouts", value: getTotal(4) ?? 0, href: "/wallet" },
        { id: "captured", label: "Captured payments", value: getTotal(5) ?? 0, href: "/payments" },
      ];

      const available = results.filter((r) => r.status === "fulfilled").length;

      return { stats, source: available > 0 ? ("api" as const) : ("unavailable" as const), available };
    },
    staleTime: 60_000,
  });
}
