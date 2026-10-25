"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Check, Eye, X, Ban } from "lucide-react";
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
  HOST_STATUS_OPTIONS,
  useHostDetail,
  useHostMutations,
  useHostsList,
} from "@/hooks/use-hosts";
import { getApiErrorMessage, getRequestId } from "@/services/api-client";
import { formatRelativeTime } from "@/lib/utils";
import type { HostAccountStatus, HostPrivateProfile } from "@/types/hosts.types";

export function HostsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<HostAccountStatus | "">("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);

  const { data, isLoading, isError, error, refetch } = useHostsList({
    page,
    limit: 20,
    status: status || undefined,
    search,
  });

  const { data: selectedHost } = useHostDetail(selectedId);
  const { approve, reject, suspend } = useHostMutations();

  const columns = useMemo<ColumnDef<HostPrivateProfile>[]>(
    () => [
      {
        accessorKey: "displayName",
        header: "Host",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.displayName}</p>
            <p className="text-xs text-muted-foreground">@{row.original.slug}</p>
          </div>
        ),
      },
      {
        accessorKey: "accountStatus",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.accountStatus} />,
      },
      {
        accessorKey: "verificationStatus",
        header: "KYC",
        cell: ({ row }) => <StatusBadge status={row.original.verificationStatus} />,
      },
      {
        accessorKey: "hostRating",
        header: "Rating",
        cell: ({ row }) => row.original.hostRating.toFixed(1),
      },
      {
        accessorKey: "address.city",
        header: "City",
        cell: ({ row }) => row.original.address?.city ?? "—",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" onClick={() => setSelectedId(row.original.id)}>
              <Eye className="h-4 w-4" />
            </Button>
            {row.original.accountStatus === "PENDING" && (
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
            {row.original.accountStatus === "VERIFIED" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => suspend.mutate(row.original.id)}
                disabled={suspend.isPending}
              >
                <Ban className="h-4 w-4 text-warning" />
              </Button>
            )}
          </div>
        ),
      },
    ],
    [approve, suspend],
  );

  if (isError) {
    return (
      <ErrorState
        title="Failed to load hosts"
        message={getApiErrorMessage(error)}
        requestId={getRequestId(error)}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hosts"
        description="Review and moderate host applications. API: GET/PATCH /admin/hosts"
      />

      <TableFilters
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name, slug, city..."
        status={status}
        onStatusChange={(v) => {
          setStatus(v as HostAccountStatus | "");
          setPage(1);
        }}
        statusOptions={HOST_STATUS_OPTIONS}
      />

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        emptyMessage="No hosts found for the selected filters."
        onRowClick={(row) => setSelectedId(row.id)}
      />

      <TablePagination meta={data?.meta} onPageChange={setPage} />

      <Dialog open={!!selectedId} onOpenChange={(open) => !open && setSelectedId(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedHost?.displayName ?? "Host details"}</DialogTitle>
          </DialogHeader>
          {selectedHost && (
            <div className="space-y-4 text-sm">
              <div className="flex gap-2">
                <StatusBadge status={selectedHost.accountStatus} />
                <StatusBadge status={selectedHost.verificationStatus} />
              </div>
              <p className="text-muted-foreground">{selectedHost.bio ?? "No bio"}</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Rating</p>
                  <p className="font-medium">{selectedHost.hostRating}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Events</p>
                  <p className="font-medium">{selectedHost.completedEvents}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Profile</p>
                  <p className="font-medium">{selectedHost.profileCompletion}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Trust Score</p>
                  <p className="font-medium">{selectedHost.trustScore ?? "—"}</p>
                </div>
              </div>
              {selectedHost.hostSince && (
                <p className="text-xs text-muted-foreground">
                  Host since {formatRelativeTime(selectedHost.hostSince)}
                </p>
              )}
              <div className="flex flex-wrap gap-2 pt-2">
                {selectedHost.accountStatus === "PENDING" && (
                  <>
                    <Button size="sm" onClick={() => approve.mutate(selectedHost.id)} loading={approve.isPending}>
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => setRejectId(selectedHost.id)}>
                      Reject
                    </Button>
                  </>
                )}
                {selectedHost.accountStatus === "VERIFIED" && (
                  <Button size="sm" variant="outline" onClick={() => suspend.mutate(selectedHost.id)} loading={suspend.isPending}>
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
        title="Reject host"
        description="Provide a reason for rejecting this host application."
        confirmLabel="Reject host"
        loading={reject.isPending}
        onConfirm={async (reason) => {
          if (rejectId) await reject.mutateAsync({ hostId: rejectId, reason });
          setRejectId(null);
          setSelectedId(null);
        }}
      />
    </div>
  );
}
