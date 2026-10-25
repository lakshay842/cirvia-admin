import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AuditLogsPage } from "@/features/audit-logs/audit-logs-page";

export default function AuditLogsRoute() {
  return (
    <DashboardLayout>
      <AuditLogsPage />
    </DashboardLayout>
  );
}
