"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Check, Eye, Star, X, Ban, RotateCcw } from "lucide-react";
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
import { useEventDetail, useEventMutations, useEventsList } from "@/hooks/use-events";
import { getApiErrorMessage, getRequestId } from "@/services/api-client";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import type { EventPrivate } from "@/types/events.types";

export function EventsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);

  const { data, isLoading, isError, error, refetch } = useEventsList({
    page,
    limit: 20,
    search,
  });

  const { data: selected } = useEventDetail(selectedId);
  const { approve, reject, feature, unfeature, suspend, restore } = useEventMutations();

  const columns = useMemo<ColumnDef<EventPrivate>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Event",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.title}</p>
            <p className="text-xs text-muted-foreground">{row.original.host.displayName}</p>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "location.city",
        header: "City",
        cell: ({ row }) => row.original.location?.city ?? "—",
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => formatCurrency(row.original.price, row.original.currency),
      },
      {
        accessorKey: "capacity",
        header: "Capacity",
        cell: ({ row }) => `${row.original.remainingCapacity}/${row.original.capacity}`,
      },
      {
        accessorKey: "eventStart",
        header: "Starts",
        cell: ({ row }) => formatRelativeTime(row.original.eventStart),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" onClick={() => setSelectedId(row.original.id)}>
              <Eye className="h-4 w-4" />
            </Button>
            {row.original.status === "PENDING_REVIEW" && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => approve.mutate(row.original.id)}
                  disabled={approve.isPending}
                >
                  <Check className="h-4 w-4 text-success" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setRejectId(row.original.id)}
                >
                  <X className="h-4 w-4 text-destructive" />
                </Button>
              </>
            )}
          </div>
        ),
      },
    ],
    [approve],
  );

  if (isError) {
    return (
      <ErrorState
        title="Failed to load events"
        message={getApiErrorMessage(error)}
        requestId={getRequestId(error)}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events"
        description="Moderate pending events. API: GET /admin/events/pending, PATCH /admin/events/:id/*"
      />

      <TableFilters
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by title, host, city..."
      />

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        emptyMessage="No pending events in the moderation queue."
        onRowClick={(row) => setSelectedId(row.id)}
      />

      <TablePagination meta={data?.meta} onPageChange={setPage} />

      <Dialog open={!!selectedId} onOpenChange={(open) => !open && setSelectedId(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected?.title ?? "Event details"}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={selected.status} />
                {selected.isFeatured && (
                  <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs text-accent-foreground">
                    Featured
                  </span>
                )}
                {selected.isSuspended && (
                  <span className="rounded-full bg-destructive/15 px-2.5 py-0.5 text-xs text-destructive">
                    Suspended
                  </span>
                )}
              </div>
              <p className="text-muted-foreground">{selected.shortDescription ?? selected.description.slice(0, 200)}</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Host</p>
                  <p className="font-medium">{selected.host.displayName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="font-medium">{selected.category.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Price</p>
                  <p className="font-medium">{formatCurrency(selected.price, selected.currency)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-medium">{selected.location?.city ?? "—"}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {selected.status === "PENDING_REVIEW" && (
                  <>
                    <Button size="sm" onClick={() => approve.mutate(selected.id)} loading={approve.isPending}>
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => setRejectId(selected.id)}>
                      Reject
                    </Button>
                  </>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    selected.isFeatured
                      ? unfeature.mutate(selected.id)
                      : feature.mutate(selected.id)
                  }
                >
                  <Star className="h-4 w-4" />
                  {selected.isFeatured ? "Unfeature" : "Feature"}
                </Button>
                {selected.isSuspended ? (
                  <Button size="sm" variant="outline" onClick={() => restore.mutate(selected.id)}>
                    <RotateCcw className="h-4 w-4" />
                    Restore
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => suspend.mutate(selected.id)}>
                    <Ban className="h-4 w-4" />
                    Suspend
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ReasonDialog
        open={!!rejectId}
        onOpenChange={(open) => !open && setRejectId(null)}
        title="Reject event"
        confirmLabel="Reject event"
        loading={reject.isPending}
        onConfirm={async (reason) => {
          if (rejectId) await reject.mutateAsync({ id: rejectId, reason });
          setRejectId(null);
          setSelectedId(null);
        }}
      />
    </div>
  );
}
