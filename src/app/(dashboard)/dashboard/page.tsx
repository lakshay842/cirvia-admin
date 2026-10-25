import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DashboardHome } from "@/features/dashboard/dashboard-home";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardHome />
    </DashboardLayout>
  );
}
