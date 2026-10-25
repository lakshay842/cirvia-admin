import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ReportsPage } from "@/features/reports/reports-page";

export default function ReportsRoute() {
  return (
    <DashboardLayout>
      <ReportsPage />
    </DashboardLayout>
  );
}
