import { PageHeader } from "@/components/layout/page-header";
import { ExportButton } from "@/components/data-display/export-button";
import { BackendPending } from "@/components/feedback/backend-pending";

export function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports Queue"
        description="Moderation queue for user, event, host, and review reports."
        actions={<ExportButton module="reports" />}
      />
      <BackendPending
        title="Reports queue API not implemented"
        description="Admin report endpoints are defined in API_CONTRACT5 but have no routes. Prisma Report model exists. User reports can be filed via POST /reports/review."
        endpoints={[
          "GET /admin/reports",
          "PATCH /admin/reports/:reportId/resolve",
          "PATCH /admin/reports/:reportId/dismiss",
        ]}
        note="Requires reports.moderate permission — seeded but unused."
      />
    </div>
  );
}
