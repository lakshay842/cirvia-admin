"use client";

import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { hostsApi, extractMeta } from "@/services/hosts.api";
import type { HostAccountStatus, HostListQuery } from "@/types/hosts.types";
import type { PaginationMeta } from "@/types/api.types";

export function useHostsList(params: HostListQuery & { search?: string }) {
  const { search, ...query } = params;

  const result = useQuery({
    queryKey: ["admin", "hosts", query],
    queryFn: async () => {
      const { data } = await hostsApi.list(query);
      return {
        items: data.data.items,
        meta: extractMeta(data),
      };
    },
  });

  const filteredItems = useMemo(() => {
    if (!search?.trim() || !result.data?.items) return result.data?.items ?? [];
    const q = search.toLowerCase();
    return result.data.items.filter(
      (h) =>
        h.displayName.toLowerCase().includes(q) ||
        h.slug.toLowerCase().includes(q) ||
        h.userId.toLowerCase().includes(q) ||
        h.address?.city?.toLowerCase().includes(q),
    );
  }, [result.data?.items, search]);

  return {
    ...result,
    data: result.data
      ? { items: filteredItems, meta: result.data.meta as PaginationMeta | undefined }
      : undefined,
  };
}

export function useHostDetail(hostId: string | null) {
  return useQuery({
    queryKey: ["admin", "hosts", hostId],
    queryFn: async () => {
      const { data } = await hostsApi.getById(hostId!);
      return data.data.host;
    },
    enabled: !!hostId,
  });
}

export function useHostMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "hosts"] });
  };

  const approve = useMutation({
    mutationFn: (hostId: string) => hostsApi.approve(hostId),
    onSuccess: invalidate,
  });

  const reject = useMutation({
    mutationFn: ({ hostId, reason }: { hostId: string; reason: string }) =>
      hostsApi.reject(hostId, reason),
    onSuccess: invalidate,
  });

  const suspend = useMutation({
    mutationFn: (hostId: string) => hostsApi.suspend(hostId),
    onSuccess: invalidate,
  });

  return { approve, reject, suspend };
}

export const HOST_STATUS_OPTIONS: { label: string; value: HostAccountStatus }[] = [
  { label: "Pending", value: "PENDING" },
  { label: "Verified", value: "VERIFIED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Suspended", value: "SUSPENDED" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Deleted", value: "DELETED" },
];
