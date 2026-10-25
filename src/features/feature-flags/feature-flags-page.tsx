import { PageHeader } from "@/components/layout/page-header";
import { BackendPending } from "@/components/feedback/backend-pending";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SEEDED_FEATURE_FLAGS } from "@/constants/rbac";

export function FeatureFlagsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Feature Flags"
        description="Toggle platform features. Admin feature API not implemented — showing seeded reference."
      />

      <BackendPending
        title="Feature flags API not implemented"
        description="GET/PATCH /admin/features are defined in API_CONTRACT5. Prisma feature_flags table exists in schema docs but no routes are registered."
        endpoints={[
          "GET /admin/features — not implemented",
          "PATCH /admin/features/:featureId/enable — not implemented",
          "PATCH /admin/features/:featureId/disable — not implemented",
        ]}
        note="Toggles below are read-only mirrors of expected seed values."
      />

      <Card>
        <CardHeader>
          <CardTitle>Feature flags (seeded reference)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {SEEDED_FEATURE_FLAGS.map((flag) => (
            <div
              key={flag.key}
              className="flex items-center justify-between gap-4 rounded-xl border border-border/60 p-4"
            >
              <div>
                <Label htmlFor={flag.key} className="font-medium">
                  {flag.label}
                </Label>
                <p className="text-xs text-muted-foreground">{flag.description}</p>
              </div>
              <Switch id={flag.key} checked={flag.enabled} disabled aria-readonly />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
