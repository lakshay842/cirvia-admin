import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { EventsPage } from "@/features/events/events-page";

export default function EventsRoute() {
  return (
    <DashboardLayout>
      <EventsPage />
    </DashboardLayout>
  );
}
