import { AuthGuard } from "@/components/layout/auth-guard";
import { PermissionGate } from "@/components/layout/permission-gate";

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <PermissionGate>{children}</PermissionGate>
    </AuthGuard>
  );
}
