import { PageHeader } from "@/components/layout/page-header";
import { ExportButton } from "@/components/data-display/export-button";
import { BackendPending } from "@/components/feedback/backend-pending";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EXPORT_MODULES = [
  { module: "payments", label: "Payments", description: "Transaction history and refunds" },
  { module: "refunds", label: "Refunds", description: "Processed refund records" },
  { module: "audit-logs", label: "Audit logs", description: "Admin action audit trail" },
  { module: "reports", label: "Reports", description: "Moderation report queue" },
  { module: "hosts", label: "Hosts", description: "Host accounts and verification" },
  { module: "events", label: "Events", description: "Event moderation records" },
] as const;

export function ExportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Exports"
        description="Download platform data. Export job API not implemented."
      />

      <BackendPending
        title="Export API not implemented"
        description="GET /admin/export is defined in API_CONTRACT5 but has no backend route. Buttons below are disabled until the export service ships."
        endpoints={["GET /admin/export?module=&format=csv|xlsx"]}
        note="DataTable pages already include per-module Export buttons with the same pending state."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {EXPORT_MODULES.map((item) => (
          <Card key={item.module}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base">{item.label}</CardTitle>
              <ExportButton module={item.module} />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
