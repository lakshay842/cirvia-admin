"use client";

import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { walletApi } from "@/services/wallet.api";
import { extractNestedMeta } from "@/lib/api-utils";
import type { PayoutItem, PayoutStatusFilter } from "@/types/wallet.types";

export function useAdminWalletOverview() {
  return useQuery({
    queryKey: ["admin", "wallet", "overview"],
    queryFn: async () => {
      const { data } = await walletApi.getOverview();
      return data.data.overview;
    },
  });
}

export function usePayoutsList(params: {
  page?: number;
  limit?: number;
  status?: PayoutStatusFilter;
  search?: string;
}) {
  const { search, ...query } = params;

  const result = useQuery({
    queryKey: ["admin", "payouts", query],
    queryFn: async () => {
      const { data } = await walletApi.listPayouts(query);
      return {
        items: data.data.payouts,
        meta: extractNestedMeta(data.data),
      };
    },
  });

  const filteredItems = useMemo(() => {
    if (!search?.trim() || !result.data?.items) return result.data?.items ?? [];
    const q = search.toLowerCase();
    return result.data.items.filter(
      (p) =>
        p.host.displayName.toLowerCase().includes(q) ||
        p.transactionReference?.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q),
    );
  }, [result.data?.items, search]);

  return {
    ...result,
    data: result.data ? { items: filteredItems, meta: result.data.meta } : undefined,
  };
}

export function usePayoutMutations() {
  const queryClient = useQueryClient();

  const approve = useMutation({
    mutationFn: (payoutId: string) => walletApi.approvePayout(payoutId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "payouts"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "wallet", "overview"] });
    },
  });

  const reject = useMutation({
    mutationFn: ({ payoutId, reason }: { payoutId: string; reason?: string }) =>
      walletApi.rejectPayout(payoutId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "payouts"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "wallet", "overview"] });
    },
  });

  return { approve, reject };
}

export const PAYOUT_STATUS_OPTIONS: { label: string; value: PayoutStatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Completed", value: "completed" },
  { label: "Failed", value: "failed" },
  { label: "Cancelled", value: "cancelled" },
];

export type { PayoutItem };
