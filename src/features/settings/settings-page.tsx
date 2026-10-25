import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SEEDED_SYSTEM_SETTINGS } from "@/constants/rbac";
import { BackendPending } from "@/components/feedback/backend-pending";

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Platform configuration. Admin settings API not implemented — showing seeded values."
      />

      <BackendPending
        title="Admin settings API not implemented"
        description="GET/PATCH /admin/settings are defined in API_CONTRACT5. Values below mirror database seed data (read-only)."
        endpoints={["GET /admin/settings — not implemented", "PATCH /admin/settings — not implemented"]}
      />

      <Card>
        <CardHeader>
          <CardTitle>System settings (seeded)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="px-4 py-3">Key</th>
                  <th className="px-4 py-3">Value</th>
                  <th className="px-4 py-3">Type</th>
                </tr>
              </thead>
              <tbody>
                {SEEDED_SYSTEM_SETTINGS.map((setting) => (
                  <tr key={setting.key} className="border-b border-border/50">
                    <td className="px-4 py-3 font-mono text-xs">{setting.key}</td>
                    <td className="px-4 py-3">{setting.value}</td>
                    <td className="px-4 py-3 text-muted-foreground">{setting.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
