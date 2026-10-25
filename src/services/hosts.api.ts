import { apiClient } from "@/services/api-client";
import type { ApiSuccessResponse } from "@/types";
import type { HostListQuery, HostPrivateProfile } from "@/types/hosts.types";

export const hostsApi = {
  list: (query: HostListQuery = {}) =>
    apiClient.get<ApiSuccessResponse<{ items: HostPrivateProfile[] }>>("/admin/hosts", {
      params: query,
    }),

  getById: (hostId: string) =>
    apiClient.get<ApiSuccessResponse<{ host: HostPrivateProfile }>>(`/admin/hosts/${hostId}`),

  approve: (hostId: string) =>
    apiClient.patch<ApiSuccessResponse<{ host: HostPrivateProfile }>>(
      `/admin/hosts/${hostId}/approve`,
    ),

  reject: (hostId: string, reason: string) =>
    apiClient.patch<ApiSuccessResponse<{ host: HostPrivateProfile }>>(
      `/admin/hosts/${hostId}/reject`,
      { reason },
    ),

  suspend: (hostId: string) =>
    apiClient.patch<ApiSuccessResponse<{ host: HostPrivateProfile }>>(
      `/admin/hosts/${hostId}/suspend`,
    ),
};

export { extractMeta } from "@/lib/api-utils";
