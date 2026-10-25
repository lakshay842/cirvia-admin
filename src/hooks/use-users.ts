"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi, extractMeta } from "@/services/users.api";
import type { AccountStatus, AdminUserListQuery } from "@/types/users.types";
import type { PaginationMeta } from "@/types/api.types";

export function useUsersList(params: AdminUserListQuery) {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: async () => {
      const { data } = await usersApi.list(params);
      return {
        items: data.data.items,
        meta: extractMeta(data) as PaginationMeta | undefined,
      };
    },
  });
}

export function useUserDetail(userId: string | null) {
  return useQuery({
    queryKey: ["admin", "users", userId],
    queryFn: async () => {
      const { data } = await usersApi.getById(userId!);
      return data.data.user;
    },
    enabled: !!userId,
  });
}

export function useUserMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
  };

  const suspend = useMutation({
    mutationFn: (userId: string) => usersApi.suspend(userId),
    onSuccess: invalidate,
  });

  const ban = useMutation({
    mutationFn: (userId: string) => usersApi.ban(userId),
    onSuccess: invalidate,
  });

  const restore = useMutation({
    mutationFn: (userId: string) => usersApi.restore(userId),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (userId: string) => usersApi.remove(userId),
    onSuccess: invalidate,
  });

  return { suspend, ban, restore, remove };
}

export const USER_STATUS_OPTIONS: { label: string; value: AccountStatus }[] = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Suspended", value: "SUSPENDED" },
  { label: "Deleted / Banned", value: "DELETED" },
];
