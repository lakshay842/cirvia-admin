"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Check, Eye, EyeOff, X } from "lucide-react";
import { DataTable } from "@/components/data-display/data-table";
import { StatusBadge } from "@/components/data-display/status-badge";
import { TableFilters } from "@/components/data-display/table-filters";
import { TablePagination } from "@/components/data-display/table-pagination";
import { ErrorState } from "@/components/feedback/error-state";
import { PageHeader } from "@/components/layout/page-header";
import { ReasonDialog } from "@/components/modals/reason-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  REVIEW_STATUS_OPTIONS,
  REVIEW_TYPE_OPTIONS,
  useReviewMutations,
  useReviewsList,
} from "@/hooks/use-reviews";
import { getApiErrorMessage, getRequestId } from "@/services/api-client";
import { formatRelativeTime } from "@/lib/utils";
import type { ReviewItem, ReviewStatusFilter, ReviewTypeFilter } from "@/types/reviews.types";

export function ReviewsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ReviewStatusFilter>("pending");
  const [type, setType] = useState<ReviewTypeFilter>("all");
  const [selected, setSelected] = useState<ReviewItem | null>(null);
  const [rejectTarget, setRejectTarget] = useState<ReviewItem | null>(null);

  const { data, isLoading, isError, error, refetch } = useReviewsList({
    page,
    limit: 20,
    status,
    type,
  });

  const { moderate } = useReviewMutations();

  const filteredItems = useMemo(() => {
    const items = data?.items ?? [];
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter(
      (r) =>
        r.author.displayName.toLowerCase().includes(q) ||
        r.comment?.toLowerCase().includes(q) ||
        r.title?.toLowerCase().includes(q),
    );
  }, [data?.items, search]);

  const columns = useMemo<ColumnDef<ReviewItem>[]>(
    () => [
      {
        accessorKey: "author",
        header: "Author",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.author.displayName}</p>
            <p className="text-xs capitalize text-muted-foreground">{row.original.type} review</p>
          </div>
        ),
      },
      {
        accessorKey: "rating",
        header: "Rating",
        cell: ({ row }) => `${row.original.rating}/5`,
      },
      {
        accessorKey: "comment",
        header: "Comment",
        cell: ({ row }) => (
          <p className="max-w-xs truncate text-sm">{row.original.comment ?? row.original.title ?? "—"}</p>
        ),
      },
      {
        accessorKey: "moderationStatus",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.moderationStatus} />,
      },
      {
        accessorKey: "createdAt",
        header: "Submitted",
        cell: ({ row }) => formatRelativeTime(row.original.createdAt),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" onClick={() => setSelected(row.original)} aria-label="View review">
              <Eye className="h-4 w-4" />
            </Button>
            {row.original.moderationStatus === "pending" && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Approve review"
                  onClick={() =>
                    moderate.mutate({
                      reviewId: row.original.id,
                      type: row.original.type,
                      action: "approve",
                    })
                  }
                  disabled={moderate.isPending}
                >
                  <Check className="h-4 w-4 text-success" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Reject review"
                  onClick={() => setRejectTarget(row.original)}
                >
                  <X className="h-4 w-4 text-destructive" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Hide review"
                  onClick={() =>
                    moderate.mutate({
                      reviewId: row.original.id,
                      type: row.original.type,
                      action: "hide",
                    })
                  }
                  disabled={moderate.isPending}
                >
                  <EyeOff className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        ),
      },
    ],
    [moderate],
  );

  if (isError) {
    return (
      <ErrorState
        title="Failed to load reviews"
        message={getApiErrorMessage(error)}
        requestId={getRequestId(error)}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Review Moderation"
        description="Moderate event, host, and guest reviews via GET/PATCH /admin/reviews."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <TableFilters
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Filter by author or comment…"
          status={status}
          onStatusChange={(v) => {
            setStatus((v || "all") as ReviewStatusFilter);
            setPage(1);
          }}
          statusOptions={REVIEW_STATUS_OPTIONS}
          statusLabel="Status"
        />
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value as ReviewTypeFilter);
            setPage(1);
          }}
          className="h-11 rounded-[18px] border border-input bg-background/50 px-4 text-sm"
          aria-label="Review type"
        >
          {REVIEW_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <DataTable columns={columns} data={filteredItems} isLoading={isLoading} />

      {data?.meta && (
        <TablePagination meta={data.meta} onPageChange={setPage} />
      )}

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review detail</DialogTitle>
          </DialogHeader>
          {selected && (
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Author</dt>
                <dd>{selected.author.displayName}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Type</dt>
                <dd className="capitalize">{selected.type}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Rating</dt>
                <dd>{selected.rating}/5</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Comment</dt>
                <dd>{selected.comment ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Status</dt>
                <dd>
                  <StatusBadge status={selected.moderationStatus} />
                </dd>
              </div>
            </dl>
          )}
        </DialogContent>
      </Dialog>

      <ReasonDialog
        open={!!rejectTarget}
        onOpenChange={(open) => !open && setRejectTarget(null)}
        title="Reject review"
        description="Provide an optional reason for rejecting this review."
        confirmLabel="Reject"
        onConfirm={(reason) => {
          if (!rejectTarget) return;
          moderate.mutate({
            reviewId: rejectTarget.id,
            type: rejectTarget.type,
            action: "reject",
            reason,
          });
          setRejectTarget(null);
        }}
      />
    </div>
  );
}
