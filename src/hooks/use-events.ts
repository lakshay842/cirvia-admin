"use client";

import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventsApi } from "@/services/events.api";
import { extractMeta } from "@/lib/api-utils";
import type { EventListQuery } from "@/types/events.types";

export function useEventsList(params: EventListQuery & { search?: string }) {
  const { search, ...query } = params;

  const result = useQuery({
    queryKey: ["admin", "events", "pending", query],
    queryFn: async () => {
      const { data } = await eventsApi.listPending(query);
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
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.slug.toLowerCase().includes(q) ||
        e.host.displayName.toLowerCase().includes(q) ||
        e.location?.city?.toLowerCase().includes(q),
    );
  }, [result.data?.items, search]);

  return {
    ...result,
    data: result.data ? { items: filteredItems, meta: result.data.meta } : undefined,
  };
}

export function useEventDetail(eventId: string | null) {
  return useQuery({
    queryKey: ["admin", "events", eventId],
    queryFn: async () => {
      const { data } = await eventsApi.getById(eventId!);
      return data.data.event;
    },
    enabled: !!eventId,
  });
}

export function useEventMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
  };

  const approve = useMutation({
    mutationFn: (id: string) => eventsApi.approve(id),
    onSuccess: invalidate,
  });

  const reject = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      eventsApi.reject(id, reason),
    onSuccess: invalidate,
  });

  const feature = useMutation({
    mutationFn: (id: string) => eventsApi.feature(id),
    onSuccess: invalidate,
  });

  const unfeature = useMutation({
    mutationFn: (id: string) => eventsApi.unfeature(id),
    onSuccess: invalidate,
  });

  const suspend = useMutation({
    mutationFn: (id: string) => eventsApi.suspend(id),
    onSuccess: invalidate,
  });

  const restore = useMutation({
    mutationFn: (id: string) => eventsApi.restore(id),
    onSuccess: invalidate,
  });

  return { approve, reject, feature, unfeature, suspend, restore };
}
