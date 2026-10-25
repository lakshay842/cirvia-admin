"use client";

import { useQuery } from "@tanstack/react-query";
import { searchApi } from "@/services/search.api";
import { extractMeta } from "@/lib/api-utils";
import type { EventPrivate } from "@/types/events.types";
import type { EventDiscoveryQuery, EventSearchQuery } from "@/services/search.api";

function parseEventResponse(data: ApiSuccessResponse<{ items: EventPrivate[] }>) {
  return {
    items: data.data.items,
    meta: extractMeta(data),
  };
}

type ApiSuccessResponse<T> = import("@/types").ApiSuccessResponse<T>;

export function useEventSearch(params: EventSearchQuery & { enabled?: boolean }) {
  const { enabled = true, ...query } = params;
  return useQuery({
    queryKey: ["search", "events", query],
    queryFn: async () => {
      const { data } = await searchApi.events(query);
      return parseEventResponse(data);
    },
    enabled: enabled && Boolean(query.keyword || query.city || query.category),
  });
}

export function useEventDiscovery(params: EventDiscoveryQuery & { enabled?: boolean }) {
  const { enabled = true, ...query } = params;
  return useQuery({
    queryKey: ["search", "discover", query],
    queryFn: async () => {
      const { data } = await searchApi.discover(query);
      return parseEventResponse(data);
    },
    enabled:
      enabled &&
      Boolean(query.search || query.city || query.category || query.priceType || query.verifiedHost),
  });
}

const RECENT_KEY = "cirvia-admin-recent-searches";

export function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function saveRecentSearch(term: string) {
  if (!term.trim() || typeof window === "undefined") return;
  const recent = getRecentSearches().filter((s) => s !== term);
  recent.unshift(term);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, 8)));
}
