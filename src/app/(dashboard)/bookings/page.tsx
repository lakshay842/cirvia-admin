import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { BookingsPage } from "@/features/bookings/bookings-page";

export default function BookingsRoute() {
  return (
    <DashboardLayout>
      <BookingsPage />
    </DashboardLayout>
  );
}
