import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SearchPage } from "@/features/search/search-page";

export default function SearchRoute() {
  return (
    <DashboardLayout>
      <SearchPage />
    </DashboardLayout>
  );
}
