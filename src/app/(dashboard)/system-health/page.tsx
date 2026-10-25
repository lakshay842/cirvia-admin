import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SystemHealthPage } from "@/features/monitoring/system-health-page";

export default function SystemHealthRoute() {
  return (
    <DashboardLayout>
      <SystemHealthPage />
    </DashboardLayout>
  );
}
