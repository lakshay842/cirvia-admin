import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { RefundsPage } from "@/features/refunds/refunds-page";

export default function RefundsRoute() {
  return (
    <DashboardLayout>
      <RefundsPage />
    </DashboardLayout>
  );
}
