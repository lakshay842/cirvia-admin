import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { RevenueDashboardPage } from "@/features/revenue/revenue-dashboard-page";

export default function RevenueRoute() {
  return (
    <DashboardLayout>
      <RevenueDashboardPage />
    </DashboardLayout>
  );
}
