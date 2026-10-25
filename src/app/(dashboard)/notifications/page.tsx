import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { NotificationsPage } from "@/features/notifications/notifications-page";

export default function NotificationsRoute() {
  return (
    <DashboardLayout>
      <NotificationsPage />
    </DashboardLayout>
  );
}
