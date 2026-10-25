import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ADMIN_ROLE_TYPES,
  PLATFORM_PERMISSIONS,
  PLATFORM_ROLES,
  ROLE_PERMISSION_MAP,
} from "@/constants/rbac";
import { BackendPending } from "@/components/feedback/backend-pending";

export function RolesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions"
        description="Read-only view of seeded RBAC from backend database. No admin CRUD API."
      />

      <BackendPending
        title="Roles API not implemented"
        description="Role and permission assignment requires backend admin endpoints. Below is the current seeded configuration from prisma/seed.ts."
        endpoints={["No GET /admin/roles", "No GET /admin/permissions"]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Platform roles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {PLATFORM_ROLES.map((role) => (
              <div key={role.name} className="rounded-xl border border-border p-3">
                <p className="font-medium">{role.name}</p>
                <p className="text-xs text-muted-foreground">{role.description}</p>
                <p className="mt-2 text-xs">
                  {(ROLE_PERMISSION_MAP[role.name] ?? []).length} permissions
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admin role types (seeded)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ADMIN_ROLE_TYPES.map((role) => (
              <div key={role.name} className="rounded-xl border border-border p-3">
                <p className="font-medium">{role.name}</p>
                <p className="text-xs text-muted-foreground">{role.description}</p>
                <p className="text-xs text-muted-foreground">Priority: {role.priority}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All permissions ({PLATFORM_PERMISSIONS.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {PLATFORM_PERMISSIONS.map((perm) => (
              <span
                key={perm}
                className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium"
              >
                {perm}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
