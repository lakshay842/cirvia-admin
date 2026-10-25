import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { FeatureFlagsPage } from "@/features/feature-flags/feature-flags-page";

export default function FeatureFlagsRoute() {
  return (
    <DashboardLayout>
      <FeatureFlagsPage />
    </DashboardLayout>
  );
}
