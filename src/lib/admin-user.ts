import { ADMIN_PERMISSIONS } from "@/constants";
import { ROLE_PERMISSION_MAP } from "@/constants/rbac";
import type { AdminRole, AdminUser } from "@/types";

/** Shape returned by POST /auth/login and GET /users/me */
export interface ApiAuthUser {
  id: string;
  email: string;
  roles?: string[];
  permissions?: string[];
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  profile?: {
    firstName: string;
    lastName: string;
    profileImage: string | null;
  } | null;
}

function resolvePermissionsFromRoles(roles: string[]): string[] {
  const set = new Set<string>();
  for (const role of roles) {
    for (const permission of ROLE_PERMISSION_MAP[role] ?? []) {
      set.add(permission);
    }
  }
  return Array.from(set);
}

export function normalizeAdminUser(raw: ApiAuthUser): AdminUser {
  const roles = (raw.roles ?? []) as AdminRole[];
  const permissions =
    raw.permissions && raw.permissions.length > 0
      ? raw.permissions
      : resolvePermissionsFromRoles(roles);

  return {
    id: raw.id,
    email: raw.email,
    firstName: raw.firstName ?? raw.profile?.firstName ?? "Admin",
    lastName: raw.lastName ?? raw.profile?.lastName ?? "User",
    avatarUrl: raw.avatarUrl ?? raw.profile?.profileImage ?? undefined,
    roles,
    permissions,
  };
}

export function userHasPermission(user: AdminUser, permission: string): boolean {
  if (user.roles.includes("SUPER_ADMIN")) return true;
  return user.permissions.includes(permission);
}

/** Only ADMIN / SUPER_ADMIN (and roles with admin.dashboard) may use the admin panel. */
export function canAccessAdminPanel(user: AdminUser): boolean {
  return userHasPermission(user, ADMIN_PERMISSIONS["admin.dashboard"]);
}
