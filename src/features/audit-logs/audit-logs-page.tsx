import { PageHeader } from "@/components/layout/page-header";
import { ExportButton } from "@/components/data-display/export-button";
import { BackendPending } from "@/components/feedback/backend-pending";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AUDIT_ACTIONS_WRITTEN = [
  "Host approve / reject / suspend",
  "Event approve / reject / feature / suspend",
  "Verification approve / reject / reupload",
  "Payment refund",
  "Payout approve / reject",
  "Review moderate",
  "Auth login / logout",
] as const;

export function AuditLogsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        description="Immutable record of admin actions. Read API not yet available."
        actions={<ExportButton module="audit-logs" />}
      />
      <BackendPending
        title="Audit log read API not implemented"
        description="Audit entries are written on admin mutations but there is no GET /admin/audit-logs endpoint to query them."
        endpoints={[
          "GET /admin/audit-logs — not implemented",
          "GET /admin/activity — not implemented",
        ]}
        note="Permission audit.read is seeded. Export via GET /admin/export is also not implemented."
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Actions currently audited (write-only)</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 sm:grid-cols-2">
            {AUDIT_ACTIONS_WRITTEN.map((action) => (
              <li key={action} className="rounded-lg border border-border/60 px-3 py-2 text-sm">
                {action}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
