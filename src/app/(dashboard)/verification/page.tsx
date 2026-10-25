import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { VerificationPage } from "@/features/verification/verification-page";

export default function VerificationRoute() {
  return (
    <DashboardLayout>
      <VerificationPage />
    </DashboardLayout>
  );
}
