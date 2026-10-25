import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-warning/15 text-warning border-warning/20",
  PENDING_PAYMENT: "bg-warning/15 text-warning border-warning/20",
  UNDER_REVIEW: "bg-primary/15 text-primary border-primary/20",
  VERIFIED: "bg-success/15 text-success border-success/20",
  APPROVED: "bg-success/15 text-success border-success/20",
  ACTIVE: "bg-success/15 text-success border-success/20",
  CONFIRMED: "bg-success/15 text-success border-success/20",
  CAPTURED: "bg-success/15 text-success border-success/20",
  COMPLETED: "bg-success/15 text-success border-success/20",
  PUBLISHED: "bg-success/15 text-success border-success/20",
  BOOKING_OPEN: "bg-success/15 text-success border-success/20",
  REJECTED: "bg-destructive/15 text-destructive border-destructive/20",
  SUSPENDED: "bg-destructive/15 text-destructive border-destructive/20",
  DELETED: "bg-destructive/15 text-destructive border-destructive/20",
  BLOCKED: "bg-destructive/15 text-destructive border-destructive/20",
  FAILED: "bg-destructive/15 text-destructive border-destructive/20",
  REFUNDED: "bg-accent/15 text-accent-foreground border-accent/20",
  RESUBMITTED: "bg-accent/15 text-accent-foreground border-accent/20",
  PENDING_REVIEW: "bg-warning/15 text-warning border-warning/20",
  DRAFT: "bg-muted text-muted-foreground border-border",
  INACTIVE: "bg-muted text-muted-foreground border-border",
  CANCELLED: "bg-muted text-muted-foreground border-border",
  EXPIRED: "bg-muted text-muted-foreground border-border",
  NO_SHOW: "bg-muted text-muted-foreground border-border",
  REQUESTED: "bg-warning/15 text-warning border-warning/20",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const style = STATUS_STYLES[status] ?? "bg-muted text-muted-foreground border-border";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        style,
        className,
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
