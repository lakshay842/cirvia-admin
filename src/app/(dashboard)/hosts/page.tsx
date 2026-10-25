import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { HostsPage } from "@/features/hosts/hosts-page";

export default function HostsRoute() {
  return (
    <DashboardLayout>
      <HostsPage />
    </DashboardLayout>
  );
}
