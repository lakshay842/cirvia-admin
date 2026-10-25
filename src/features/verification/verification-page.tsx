"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Check, Eye, RefreshCw, X } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import {
  VERIFICATION_STATUS_OPTIONS,
  useVerificationDetail,
  useVerificationMutations,
  useVerificationsList,
} from "@/hooks/use-verifications";
import { getApiErrorMessage, getRequestId } from "@/services/api-client";
import { formatRelativeTime } from "@/lib/utils";
import type {
  AdminVerificationListItem,
  VerificationStatus,
} from "@/types/verification.types";

type DialogAction = "reject" | "reupload" | null;

export function VerificationPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<VerificationStatus | "">("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dialogAction, setDialogAction] = useState<DialogAction>(null);
  const [note, setNote] = useState("");

  const { data, isLoading, isError, error, refetch } = useVerificationsList({
    page,
    limit: 20,
    status: status || undefined,
    search,
  });

  const { data: selected } = useVerificationDetail(selectedId);
  const { approve, reject, requestReupload, addNote } = useVerificationMutations();

  const columns = useMemo<ColumnDef<AdminVerificationListItem>[]>(
    () => [
      {
        accessorKey: "userEmail",
        header: "User",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.userEmail}</p>
            <p className="text-xs text-muted-foreground">{row.original.username ?? "—"}</p>
          </div>
        ),
      },
      {
        accessorKey: "verificationType",
        header: "Document",
        cell: ({ row }) => row.original.verificationType.replace(/_/g, " "),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "submittedAt",
        header: "Submitted",
        cell: ({ row }) =>
          row.original.submittedAt ? formatRelativeTime(row.original.submittedAt) : "—",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" onClick={() => setSelectedId(row.original.id)}>
              <Eye className="h-4 w-4" />
            </Button>
            {["PENDING", "UNDER_REVIEW", "RESUBMITTED"].includes(row.original.status) && (
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
                  onClick={() => {
                    setSelectedId(row.original.id);
                    setDialogAction("reject");
                  }}
                >
                  <X className="h-4 w-4 text-destructive" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedId(row.original.id);
                    setDialogAction("reupload");
                  }}
                >
                  <RefreshCw className="h-4 w-4 text-warning" />
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
        title="Failed to load verification queue"
        message={getApiErrorMessage(error)}
        requestId={getRequestId(error)}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="KYC Queue"
        description="Review identity verification requests. API: GET/PATCH /admin/verifications"
      />

      <TableFilters
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by email, username, document type..."
        status={status}
        onStatusChange={(v) => {
          setStatus(v as VerificationStatus | "");
          setPage(1);
        }}
        statusOptions={VERIFICATION_STATUS_OPTIONS}
      />

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        emptyMessage="No verification requests in this queue."
        onRowClick={(row) => setSelectedId(row.id)}
      />

      <TablePagination meta={data?.meta} onPageChange={setPage} />

      <Dialog open={!!selectedId} onOpenChange={(open) => !open && setSelectedId(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Verification review</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={selected.status} />
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs">
                  {selected.verificationType.replace(/_/g, " ")}
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {selected.documents.map((doc) => (
                  <div key={doc.id} className="space-y-2 rounded-2xl border border-border p-3">
                    <p className="text-xs font-medium capitalize">{doc.documentType}</p>
                    {doc.frontImageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={doc.frontImageUrl}
                        alt="Document front"
                        className="aspect-video w-full rounded-xl object-cover"
                      />
                    )}
                    {doc.selfieImageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={doc.selfieImageUrl}
                        alt="Selfie"
                        className="aspect-square w-full rounded-xl object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>

              {selected.internalNotes.length > 0 && (
                <div className="space-y-2">
                  <p className="font-medium">Internal notes</p>
                  {selected.internalNotes.map((n) => (
                    <div key={n.id} className="rounded-xl bg-muted/50 p-3 text-xs">
                      {n.note}
                      <p className="mt-1 text-muted-foreground">
                        {formatRelativeTime(n.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="note">Add internal note</Label>
                <textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="flex w-full rounded-[18px] border border-input bg-background/50 px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <Button
                  size="sm"
                  variant="outline"
                  disabled={note.trim().length < 1}
                  loading={addNote.isPending}
                  onClick={async () => {
                    await addNote.mutateAsync({ id: selected.id, note: note.trim() });
                    setNote("");
                  }}
                >
                  Save note
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {["PENDING", "UNDER_REVIEW", "RESUBMITTED"].includes(selected.status) && (
                  <>
                    <Button size="sm" onClick={() => approve.mutate(selected.id)} loading={approve.isPending}>
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => setDialogAction("reject")}>
                      Reject
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setDialogAction("reupload")}>
                      Request re-upload
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ReasonDialog
        open={dialogAction === "reject"}
        onOpenChange={(open) => !open && setDialogAction(null)}
        title="Reject verification"
        confirmLabel="Reject"
        loading={reject.isPending}
        onConfirm={async (reason) => {
          if (selectedId) await reject.mutateAsync({ id: selectedId, reason });
          setDialogAction(null);
          setSelectedId(null);
        }}
      />

      <ReasonDialog
        open={dialogAction === "reupload"}
        onOpenChange={(open) => !open && setDialogAction(null)}
        title="Request re-upload"
        confirmLabel="Request re-upload"
        loading={requestReupload.isPending}
        onConfirm={async (reason) => {
          if (selectedId) await requestReupload.mutateAsync({ id: selectedId, reason });
          setDialogAction(null);
        }}
      />
    </div>
  );
}
