"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { DataTable } from "@/components/data-display/data-table";
import { ExportButton } from "@/components/data-display/export-button";
import { StatusBadge } from "@/components/data-display/status-badge";
import { TableFilters } from "@/components/data-display/table-filters";
import { TablePagination } from "@/components/data-display/table-pagination";
import { ErrorState } from "@/components/feedback/error-state";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePaymentDetail, usePaymentsList, type PaymentDetails } from "@/hooks/use-payments";
import { getApiErrorMessage, getRequestId } from "@/services/api-client";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";

export function RefundsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"refunded" | "partially_refunded" | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading, isError, error, refetch } = usePaymentsList({
    page,
    limit: 20,
    status,
    search,
  });

  const { data: selected } = usePaymentDetail(selectedId);

  const columns = useMemo<ColumnDef<PaymentDetails>[]>(
    () => [
      {
        accessorKey: "paymentReference",
        header: "Payment",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.paymentReference}</p>
            <p className="text-xs text-muted-foreground">{row.original.eventTitle}</p>
          </div>
        ),
      },
      {
        id: "refundAmount",
        header: "Refund amount",
        cell: ({ row }) =>
          row.original.refund
            ? formatCurrency(row.original.refund.refundAmount, row.original.currency)
            : "—",
      },
      {
        id: "refundStatus",
        header: "Refund status",
        cell: ({ row }) =>
          row.original.refund ? (
            <StatusBadge status={row.original.refund.status} />
          ) : (
            "—"
          ),
      },
      {
        accessorKey: "paymentStatus",
        header: "Payment status",
        cell: ({ row }) => <StatusBadge status={row.original.paymentStatus} />,
      },
      {
        id: "refundDate",
        header: "Processed",
        cell: ({ row }) =>
          row.original.refund?.processedAt
            ? formatRelativeTime(row.original.refund.processedAt)
            : row.original.refund?.requestedAt
              ? formatRelativeTime(row.original.refund.requestedAt)
              : "—",
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <Button variant="ghost" size="icon" onClick={() => setSelectedId(row.original.id)}>
            <Eye className="h-4 w-4" />
          </Button>
        ),
      },
    ],
    [],
  );

  if (isError) {
    return (
      <ErrorState
        title="Failed to load refunds"
        message={getApiErrorMessage(error)}
        requestId={getRequestId(error)}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Refund Management"
        description="Refunds via GET /admin/payments filtered by refund status."
        actions={<ExportButton module="refunds" />}
      />

      <TableFilters
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search reference, event..."
        status={status}
        onStatusChange={(v) => {
          setStatus((v || "all") as typeof status);
          setPage(1);
        }}
        statusOptions={[
          { label: "All refunds", value: "all" },
          { label: "Refunded", value: "refunded" },
          { label: "Partially refunded", value: "partially_refunded" },
        ]}
        statusLabel="Refund status"
      />

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        emptyMessage="No refunds found."
        onRowClick={(row) => setSelectedId(row.id)}
      />

      <TablePagination meta={data?.meta} onPageChange={setPage} />

      <Dialog open={!!selectedId} onOpenChange={(open) => !open && setSelectedId(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Refund details</DialogTitle>
          </DialogHeader>
          {selected?.refund && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="font-medium">
                    {formatCurrency(selected.refund.refundAmount, selected.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <StatusBadge status={selected.refund.status} />
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Reason</p>
                <p>{selected.refund.reason}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Event</p>
                <p>{selected.eventTitle}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
