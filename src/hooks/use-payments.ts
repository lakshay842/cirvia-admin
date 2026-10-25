"use client";

import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentsApi } from "@/services/payments.api";
import { extractNestedMeta } from "@/lib/api-utils";
import type { PaymentDetails, PaymentStatusFilter } from "@/types/payments.types";

export function usePaymentsList(params: {
  page?: number;
  limit?: number;
  status?: PaymentStatusFilter;
  search?: string;
}) {
  const { search, ...query } = params;

  const result = useQuery({
    queryKey: ["admin", "payments", query],
    queryFn: async () => {
      const { data } = await paymentsApi.list(query);
      return {
        items: data.data.payments,
        meta: extractNestedMeta(data.data),
      };
    },
  });

  const filteredItems = useMemo(() => {
    if (!search?.trim() || !result.data?.items) return result.data?.items ?? [];
    const q = search.toLowerCase();
    return result.data.items.filter(
      (p) =>
        p.paymentReference.toLowerCase().includes(q) ||
        p.eventTitle.toLowerCase().includes(q) ||
        p.bookingReference.toLowerCase().includes(q) ||
        p.gatewayTransactionId?.toLowerCase().includes(q),
    );
  }, [result.data?.items, search]);

  return {
    ...result,
    data: result.data ? { items: filteredItems, meta: result.data.meta } : undefined,
  };
}

export function usePaymentDetail(paymentId: string | null) {
  return useQuery({
    queryKey: ["admin", "payments", paymentId],
    queryFn: async () => {
      const { data } = await paymentsApi.getById(paymentId!);
      return data.data.payment;
    },
    enabled: !!paymentId,
  });
}

export function usePaymentMutations() {
  const queryClient = useQueryClient();

  const refund = useMutation({
    mutationFn: ({ paymentId, reason }: { paymentId: string; reason?: string }) =>
      paymentsApi.refund(paymentId, { reason, approve: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "payments"] }),
  });

  return { refund };
}

export const PAYMENT_STATUS_OPTIONS: { label: string; value: PaymentStatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Captured", value: "captured" },
  { label: "Failed", value: "failed" },
  { label: "Refunded", value: "refunded" },
  { label: "Cancelled", value: "cancelled" },
];

export type { PaymentDetails };
