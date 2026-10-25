import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ReviewsPage } from "@/features/reviews/reviews-page";

export default function ReviewsRoute() {
  return (
    <DashboardLayout>
      <ReviewsPage />
    </DashboardLayout>
  );
}
