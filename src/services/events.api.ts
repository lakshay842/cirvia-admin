import { apiClient } from "@/services/api-client";
import type { ApiSuccessResponse } from "@/types";
import type { EventListQuery, EventPrivate } from "@/types/events.types";

export const eventsApi = {
  listPending: (query: EventListQuery = {}) =>
    apiClient.get<ApiSuccessResponse<{ items: EventPrivate[] }>>("/admin/events/pending", {
      params: query,
    }),

  getById: (eventId: string) =>
    apiClient.get<ApiSuccessResponse<{ event: EventPrivate }>>(`/admin/events/${eventId}`),

  approve: (eventId: string) =>
    apiClient.patch<ApiSuccessResponse<{ event: EventPrivate }>>(
      `/admin/events/${eventId}/approve`,
    ),

  reject: (eventId: string, reason: string) =>
    apiClient.patch<ApiSuccessResponse<{ event: EventPrivate }>>(
      `/admin/events/${eventId}/reject`,
      { reason },
    ),

  feature: (eventId: string) =>
    apiClient.patch<ApiSuccessResponse<{ event: EventPrivate }>>(
      `/admin/events/${eventId}/feature`,
    ),

  unfeature: (eventId: string) =>
    apiClient.patch<ApiSuccessResponse<{ event: EventPrivate }>>(
      `/admin/events/${eventId}/unfeature`,
    ),

  suspend: (eventId: string) =>
    apiClient.patch<ApiSuccessResponse<{ event: EventPrivate }>>(
      `/admin/events/${eventId}/suspend`,
    ),

  restore: (eventId: string) =>
    apiClient.patch<ApiSuccessResponse<{ event: EventPrivate }>>(
      `/admin/events/${eventId}/restore`,
    ),
};
