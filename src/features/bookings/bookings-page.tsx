"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { DataTable } from "@/components/data-display/data-table";
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
import {
  BOOKING_STATUS_OPTIONS,
  useBookingsList,
} from "@/hooks/use-bookings";
import { getApiErrorMessage, getRequestId } from "@/services/api-client";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import type { AdminBooking, AdminBookingFilter } from "@/types/bookings.types";

export function BookingsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<AdminBookingFilter | "">("");
  const [selected, setSelected] = useState<AdminBooking | null>(null);

  const { data, isLoading, isError, error, refetch } = useBookingsList({
    page,
    limit: 20,
    status: status || "all",
    search: search.trim() || undefined,
  });

  const columns = useMemo<ColumnDef<AdminBooking>[]>(
    () => [
      {
        accessorKey: "bookingReference",
        header: "Reference",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.bookingReference}</p>
            <p className="text-xs text-muted-foreground">
              {formatRelativeTime(row.original.createdAt)}
            </p>
          </div>
        ),
      },
      {
        id: "event",
        header: "Event",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.event.title}</p>
            <p className="text-xs text-muted-foreground">
              {row.original.event.city ?? "—"} · {row.original.host.displayName ?? "Host"}
            </p>
          </div>
        ),
      },
      {
        id: "guest",
        header: "Guest",
        cell: ({ row }) => {
          const u = row.original.user;
          const name = [u.firstName, u.lastName].filter(Boolean).join(" ");
          return (
            <div>
              <p className="font-medium">{name || "—"}</p>
              <p className="text-xs text-muted-foreground">{u.email}</p>
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "paymentStatus",
        header: "Payment",
        cell: ({ row }) => <StatusBadge status={row.original.paymentStatus} />,
      },
      {
        accessorKey: "ticketPrice",
        header: "Amount",
        cell: ({ row }) =>
          formatCurrency(row.original.ticketPrice, row.original.currency),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" onClick={() => setSelected(row.original)}>
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  if (isError) {
    return (
      <ErrorState
        title="Failed to load bookings"
        message={getApiErrorMessage(error)}
        requestId={getRequestId(error)}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Booking Management"
        description="Platform-wide booking oversight across all hosts and events."
      />

      <TableFilters
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        searchPlaceholder="Search reference, guest, event..."
        status={status}
        onStatusChange={(v) => {
          setStatus(v as AdminBookingFilter | "");
          setPage(1);
        }}
        statusOptions={BOOKING_STATUS_OPTIONS}
      />

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        emptyMessage="No bookings found for the selected filters."
        onRowClick={(row) => setSelected(row)}
      />

      <TablePagination meta={data?.meta} onPageChange={setPage} />

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected?.bookingReference ?? "Booking details"}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={selected.status} />
                <StatusBadge status={selected.paymentStatus} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Event</p>
                  <p className="font-medium">{selected.event.title}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Host</p>
                  <p className="font-medium">{selected.host.displayName ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Guest</p>
                  <p className="font-medium">
                    {[selected.user.firstName, selected.user.lastName].filter(Boolean).join(" ") ||
                      "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">{selected.user.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="font-medium">
                    {formatCurrency(selected.ticketPrice, selected.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Guests</p>
                  <p className="font-medium">{selected.guestsCount}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">City</p>
                  <p className="font-medium">{selected.event.city ?? "—"}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Created {formatRelativeTime(selected.createdAt)}
                {selected.expiresAt
                  ? ` · Expires ${formatRelativeTime(selected.expiresAt)}`
                  : ""}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
