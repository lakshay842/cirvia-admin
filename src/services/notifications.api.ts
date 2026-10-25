import { apiClient } from "@/services/api-client";
import type { ApiSuccessResponse } from "@/types";
import type {
  NotificationItem,
  NotificationListQuery,
  NotificationListResponse,
  NotificationPreferences,
} from "@/types/notifications.types";

export const notificationsApi = {
  list: (query: NotificationListQuery = {}) =>
    apiClient.get<ApiSuccessResponse<NotificationListResponse>>("/notifications", {
      params: {
        ...query,
        unreadOnly: query.unreadOnly === true ? "true" : query.unreadOnly === false ? "false" : undefined,
      },
    }),

  getById: (notificationId: string) =>
    apiClient.get<ApiSuccessResponse<NotificationItem>>(`/notifications/${notificationId}`),

  markRead: (notificationId: string) =>
    apiClient.patch<ApiSuccessResponse<NotificationItem>>(
      `/notifications/${notificationId}/read`,
    ),

  markAllRead: () => apiClient.patch<ApiSuccessResponse<{ updated: number }>>("/notifications/read-all"),

  delete: (notificationId: string) =>
    apiClient.delete<ApiSuccessResponse<Record<string, never>>>(`/notifications/${notificationId}`),

  getPreferences: () =>
    apiClient.get<ApiSuccessResponse<NotificationPreferences>>("/notifications/preferences"),

  updatePreferences: (prefs: Partial<NotificationPreferences>) =>
    apiClient.patch<ApiSuccessResponse<NotificationPreferences>>("/notifications/preferences", prefs),
};
