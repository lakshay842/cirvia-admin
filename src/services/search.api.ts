import { apiClient } from "@/services/api-client";
import type { ApiSuccessResponse } from "@/types";
import type { EventPrivate } from "@/types/events.types";
import type { PaginationMeta } from "@/types/api.types";

export interface EventSearchQuery {
  page?: number;
  limit?: number;
  keyword?: string;
  city?: string;
  category?: string;
  date?: string;
}

export interface EventDiscoveryQuery {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
  category?: string;
  sort?: "newest" | "nearest" | "trending" | "rating" | "price_asc" | "price_desc";
  priceType?: "free" | "paid";
  verifiedHost?: boolean;
}

export interface EventSearchResponse {
  items: EventPrivate[];
  meta?: PaginationMeta;
}

export const searchApi = {
  events: (query: EventSearchQuery = {}) =>
    apiClient.get<ApiSuccessResponse<{ items: EventPrivate[] }>>("/events/search", {
      params: query,
    }),

  discover: (query: EventDiscoveryQuery = {}) =>
    apiClient.get<ApiSuccessResponse<{ items: EventPrivate[] }>>("/events", {
      params: query,
    }),
};
