import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AnalyticsPage } from "@/features/analytics/analytics-page";

export default function AnalyticsRoute() {
  return (
    <DashboardLayout>
      <AnalyticsPage />
    </DashboardLayout>
  );
}
