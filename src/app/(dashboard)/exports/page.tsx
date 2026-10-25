import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ExportsPage } from "@/features/exports/exports-page";

export default function ExportsRoute() {
  return (
    <DashboardLayout>
      <ExportsPage />
    </DashboardLayout>
  );
}
