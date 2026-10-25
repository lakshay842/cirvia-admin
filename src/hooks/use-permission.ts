import { type AdminPermission } from "@/constants";
import { userHasPermission } from "@/lib/admin-user";
import { useAuthStore } from "@/store/auth-store";

export function usePermission(permission: AdminPermission): boolean {
  const user = useAuthStore((s) => s.user);
  if (!user) return false;
  return userHasPermission(user, permission);
}

export function useHasAnyPermission(permissions: AdminPermission[]): boolean {
  const user = useAuthStore((s) => s.user);
  if (permissions.length === 0) return true;
  if (!user) return false;
  return permissions.some((p) => userHasPermission(user, p));
}
