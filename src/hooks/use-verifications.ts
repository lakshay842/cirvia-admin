"use client";

import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { verificationApi } from "@/services/verification.api";
import { extractMeta } from "@/lib/api-utils";
import type { VerificationListQuery, VerificationStatus } from "@/types/verification.types";

export function useVerificationsList(params: VerificationListQuery & { search?: string }) {
  const { search, ...query } = params;

  const result = useQuery({
    queryKey: ["admin", "verifications", query],
    queryFn: async () => {
      const { data } = await verificationApi.list(query);
      return {
        items: data.data.verifications,
        meta: extractMeta(data),
      };
    },
  });

  const filteredItems = useMemo(() => {
    if (!search?.trim() || !result.data?.items) return result.data?.items ?? [];
    const q = search.toLowerCase();
    return result.data.items.filter(
      (v) =>
        v.userEmail.toLowerCase().includes(q) ||
        v.username?.toLowerCase().includes(q) ||
        v.verificationType.toLowerCase().includes(q),
    );
  }, [result.data?.items, search]);

  return {
    ...result,
    data: result.data ? { items: filteredItems, meta: result.data.meta } : undefined,
  };
}

export function useVerificationDetail(verificationId: string | null) {
  return useQuery({
    queryKey: ["admin", "verifications", verificationId],
    queryFn: async () => {
      const { data } = await verificationApi.getById(verificationId!);
      return data.data.verification;
    },
    enabled: !!verificationId,
  });
}

export function useVerificationMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "verifications"] });
  };

  const approve = useMutation({
    mutationFn: (id: string) => verificationApi.approve(id),
    onSuccess: invalidate,
  });

  const reject = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      verificationApi.reject(id, reason),
    onSuccess: invalidate,
  });

  const requestReupload = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      verificationApi.requestReupload(id, reason),
    onSuccess: invalidate,
  });

  const addNote = useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) =>
      verificationApi.addNote(id, note),
    onSuccess: invalidate,
  });

  return { approve, reject, requestReupload, addNote };
}

export const VERIFICATION_STATUS_OPTIONS: { label: string; value: VerificationStatus }[] = [
  { label: "Pending", value: "PENDING" },
  { label: "Under Review", value: "UNDER_REVIEW" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Resubmitted", value: "RESUBMITTED" },
  { label: "Blocked", value: "BLOCKED" },
  { label: "Expired", value: "EXPIRED" },
  { label: "Cancelled", value: "CANCELLED" },
];
