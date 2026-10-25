"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, RotateCcw } from "lucide-react";
import { DataTable } from "@/components/data-display/data-table";
import { ExportButton } from "@/components/data-display/export-button";
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
  PAYMENT_STATUS_OPTIONS,
  usePaymentDetail,
  usePaymentMutations,
  usePaymentsList,
  type PaymentDetails,
} from "@/hooks/use-payments";
import { getApiErrorMessage, getRequestId } from "@/services/api-client";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import type { PaymentStatusFilter } from "@/types/payments.types";

export function PaymentsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<PaymentStatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [refundId, setRefundId] = useState<string | null>(null);

  const { data, isLoading, isError, error, refetch } = usePaymentsList({
    page,
    limit: 20,
    status,
    search,
  });

  const { data: selected } = usePaymentDetail(selectedId);
  const { refund } = usePaymentMutations();

  const columns = useMemo<ColumnDef<PaymentDetails>[]>(
    () => [
      {
        accessorKey: "paymentReference",
        header: "Reference",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.paymentReference}</p>
            <p className="text-xs text-muted-foreground">{row.original.eventTitle}</p>
          </div>
        ),
      },
      {
        accessorKey: "amount",
        header: "Guest paid",
        cell: ({ row }) => formatCurrency(row.original.amount, row.original.currency),
      },
      {
        accessorKey: "platformFee",
        header: "Platform fee",
        cell: ({ row }) => formatCurrency(row.original.platformFee, row.original.currency),
      },
      {
        accessorKey: "netAmount",
        header: "Host received",
        cell: ({ row }) => formatCurrency(row.original.netAmount, row.original.currency),
      },
      {
        accessorKey: "paymentStatus",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.paymentStatus} />,
      },
      {
        accessorKey: "gateway",
        header: "Gateway",
      },
      {
        accessorKey: "paidAt",
        header: "Paid",
        cell: ({ row }) =>
          row.original.paidAt ? formatRelativeTime(row.original.paidAt) : "—",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" onClick={() => setSelectedId(row.original.id)}>
              <Eye className="h-4 w-4" />
            </Button>
            {row.original.paymentStatus === "CAPTURED" && !row.original.refund && (
              <Button variant="ghost" size="icon" onClick={() => setRefundId(row.original.id)}>
                <RotateCcw className="h-4 w-4 text-warning" />
              </Button>
            )}
          </div>
        ),
      },
    ],
    [],
  );

  if (isError) {
    return (
      <ErrorState
        title="Failed to load payments"
        message={getApiErrorMessage(error)}
        requestId={getRequestId(error)}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments"
        description="Platform payment transactions. API: GET/POST /admin/payments"
        actions={<ExportButton module="payments" />}
      />

      <TableFilters
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search reference, event, booking..."
        status={status}
        onStatusChange={(v) => {
          setStatus((v || "all") as PaymentStatusFilter);
          setPage(1);
        }}
        statusOptions={PAYMENT_STATUS_OPTIONS}
        statusLabel="Payment status"
      />

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        emptyMessage="No payments found."
        onRowClick={(row) => setSelectedId(row.id)}
      />

      <TablePagination meta={data?.meta} onPageChange={setPage} />

      <Dialog open={!!selectedId} onOpenChange={(open) => !open && setSelectedId(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Payment details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <StatusBadge status={selected.paymentStatus} />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="font-medium">{formatCurrency(selected.amount, selected.currency)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Net</p>
                  <p className="font-medium">{formatCurrency(selected.netAmount, selected.currency)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Platform fee</p>
                  <p className="font-medium">{formatCurrency(selected.platformFee, selected.currency)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Gateway</p>
                  <p className="font-medium">{selected.gateway}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Event</p>
                  <p className="font-medium">{selected.eventTitle}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Booking</p>
                  <p className="font-medium">{selected.bookingReference}</p>
                </div>
              </div>
              {selected.refund && (
                <div className="rounded-xl bg-muted/50 p-3">
                  <p className="font-medium">Refund: {selected.refund.status}</p>
                  <p className="text-xs text-muted-foreground">{selected.refund.reason}</p>
                </div>
              )}
              {selected.paymentStatus === "CAPTURED" && !selected.refund && (
                <Button size="sm" variant="outline" onClick={() => setRefundId(selected.id)}>
                  Process refund
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ReasonDialog
        open={!!refundId}
        onOpenChange={(open) => !open && setRefundId(null)}
        title="Process refund"
        description="Refund will be processed via the payment gateway."
        confirmLabel="Refund payment"
        loading={refund.isPending}
        onConfirm={async (reason) => {
          if (refundId) await refund.mutateAsync({ paymentId: refundId, reason });
          setRefundId(null);
          setSelectedId(null);
        }}
      />
    </div>
  );
}
