import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { RolesPage } from "@/features/settings/roles-page";

export default function RolesRoute() {
  return (
    <DashboardLayout>
      <RolesPage />
    </DashboardLayout>
  );
}
