import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { UsersPage } from "@/features/users/users-page";

export default function UsersRoute() {
  return (
    <DashboardLayout>
      <UsersPage />
    </DashboardLayout>
  );
}
