"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "@/services/notifications.api";
import { extractNestedMeta } from "@/lib/api-utils";
import type { NotificationListQuery, NotificationTypeFilter } from "@/types/notifications.types";

export function useNotificationsList(params: NotificationListQuery = {}) {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: async () => {
      const { data } = await notificationsApi.list(params);
      return {
        items: data.data.notifications,
        unreadCount: data.data.unreadCount,
        meta: extractNestedMeta(data.data),
      };
    },
  });
}

export function useNotificationPreferences() {
  return useQuery({
    queryKey: ["notifications", "preferences"],
    queryFn: async () => {
      const { data } = await notificationsApi.getPreferences();
      return data.data;
    },
  });
}

export function useNotificationMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["notifications"] });

  const markRead = useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onSuccess: invalidate,
  });

  const markAllRead = useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => notificationsApi.delete(id),
    onSuccess: invalidate,
  });

  const updatePreferences = useMutation({
    mutationFn: (prefs: Parameters<typeof notificationsApi.updatePreferences>[0]) =>
      notificationsApi.updatePreferences(prefs),
    onSuccess: invalidate,
  });

  return { markRead, markAllRead, remove, updatePreferences };
}

export const NOTIFICATION_TYPE_OPTIONS: { label: string; value: NotificationTypeFilter }[] = [
  { label: "All", value: "all" },
  { label: "Booking", value: "booking" },
  { label: "Payment", value: "payment" },
  { label: "Refund", value: "refund" },
  { label: "Verification", value: "verification" },
  { label: "Security", value: "security" },
  { label: "Support", value: "support" },
  { label: "Review", value: "review" },
];
