import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PaymentsPage } from "@/features/payments/payments-page";

export default function PaymentsRoute() {
  return (
    <DashboardLayout>
      <PaymentsPage />
    </DashboardLayout>
  );
}
