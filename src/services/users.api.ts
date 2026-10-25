import { apiClient } from "@/services/api-client";
import type { ApiSuccessResponse } from "@/types";
import type { AdminUser, AdminUserListQuery } from "@/types/users.types";

export const usersApi = {
  list: (query: AdminUserListQuery = {}) =>
    apiClient.get<ApiSuccessResponse<{ items: AdminUser[] }>>("/admin/users", {
      params: query,
    }),

  getById: (userId: string) =>
    apiClient.get<ApiSuccessResponse<{ user: AdminUser }>>(`/admin/users/${userId}`),

  suspend: (userId: string) =>
    apiClient.patch<ApiSuccessResponse<{ user: AdminUser }>>(
      `/admin/users/${userId}/suspend`,
    ),

  ban: (userId: string) =>
    apiClient.patch<ApiSuccessResponse<{ user: AdminUser }>>(`/admin/users/${userId}/ban`),

  restore: (userId: string) =>
    apiClient.patch<ApiSuccessResponse<{ user: AdminUser }>>(
      `/admin/users/${userId}/restore`,
    ),

  remove: (userId: string) =>
    apiClient.delete<ApiSuccessResponse<{ user: AdminUser }>>(`/admin/users/${userId}`),
};

export { extractMeta } from "@/lib/api-utils";
