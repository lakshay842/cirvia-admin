import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { MonitoringPage } from "@/features/monitoring/monitoring-page";

export default function MonitoringRoute() {
  return (
    <DashboardLayout>
      <MonitoringPage />
    </DashboardLayout>
  );
}
