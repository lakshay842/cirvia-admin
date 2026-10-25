"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Check, Eye, X } from "lucide-react";
import { DataTable } from "@/components/data-display/data-table";
import { ExportButton } from "@/components/data-display/export-button";
import { StatusBadge } from "@/components/data-display/status-badge";
import { TableFilters } from "@/components/data-display/table-filters";
import { TablePagination } from "@/components/data-display/table-pagination";
import { ErrorState } from "@/components/feedback/error-state";
import { PageHeader } from "@/components/layout/page-header";
import { ReasonDialog } from "@/components/modals/reason-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  PAYOUT_STATUS_OPTIONS,
  useAdminWalletOverview,
  usePayoutMutations,
  usePayoutsList,
  type PayoutItem,
} from "@/hooks/use-payouts";
import {
  BANK_ACCOUNT_STATUS_OPTIONS,
  useBankAccountDetail,
  useBankAccountMutations,
  useBankAccountsList,
  type AdminBankAccountItem,
} from "@/hooks/use-bank-accounts";
import { getApiErrorMessage, getRequestId } from "@/services/api-client";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import type { PayoutStatusFilter } from "@/types/wallet.types";

type BankStatusFilter = "pending" | "approved" | "rejected" | "all";

export function WalletPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<PayoutStatusFilter>("all");
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [bankPage, setBankPage] = useState(1);
  const [bankStatus, setBankStatus] = useState<BankStatusFilter>("pending");
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);
  const [rejectBankId, setRejectBankId] = useState<string | null>(null);

  const overviewQuery = useAdminWalletOverview();
  const { data, isLoading, isError, error, refetch } = usePayoutsList({
    page,
    limit: 20,
    status,
    search,
  });

  const { approve, reject } = usePayoutMutations();
  const {
    data: bankData,
    isLoading: bankLoading,
    isError: bankError,
    error: bankQueryError,
    refetch: refetchBanks,
  } = useBankAccountsList({ page: bankPage, limit: 20, status: bankStatus });
  const { data: selectedBank, isLoading: bankDetailLoading } = useBankAccountDetail(selectedBankId);
  const { verify: verifyBank, reject: rejectBank } = useBankAccountMutations();

  const overview = overviewQuery.data;
  const overviewCards = overview
    ? [
        {
          label: "Guest payments",
          value: formatCurrency(overview.guestPaymentsTotal, overview.currency),
          hint: `${overview.paymentsCaptured} captured`,
        },
        {
          label: "Platform fees",
          value: formatCurrency(overview.platformFeesCollected, overview.currency),
          hint: "Cirvia commission",
        },
        {
          label: "Host earnings",
          value: formatCurrency(overview.hostEarningsTotal, overview.currency),
          hint: "Net after fees",
        },
        {
          label: "Available (hosts)",
          value: formatCurrency(overview.totalAvailableBalance, overview.currency),
          hint: `${overview.hostsWithBalance} hosts with balance`,
        },
        {
          label: "Pending (hosts)",
          value: formatCurrency(overview.totalPendingBalance, overview.currency),
          hint: "Awaiting event settlement",
        },
        {
          label: "Withdrawn",
          value: formatCurrency(overview.completedPayoutAmount, overview.currency),
          hint: `${overview.completedPayouts} completed payouts`,
        },
        {
          label: "Payouts queue",
          value: formatCurrency(overview.pendingPayoutAmount, overview.currency),
          hint: `${overview.pendingPayouts + overview.processingPayouts} pending/processing`,
        },
        {
          label: "Bank accounts",
          value: String(overview.pendingBankAccounts),
          hint: `${overview.approvedBankAccounts} approved · pending verification`,
        },
      ]
    : [];

  const bankColumns = useMemo<ColumnDef<AdminBankAccountItem>[]>(
    () => [
      {
        accessorKey: "host.displayName",
        header: "Host",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.host.displayName}</p>
            <p className="text-xs text-muted-foreground">{row.original.accountHolderName}</p>
          </div>
        ),
      },
      {
        accessorKey: "bankName",
        header: "Bank",
        cell: ({ row }) => (
          <div>
            <p>{row.original.bankName}</p>
            <p className="text-xs text-muted-foreground">
              {row.original.accountNumberMasked} · {row.original.ifscCode}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "verificationStatus",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.verificationStatus} />,
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedBankId(row.original.id)}
              aria-label="View bank account details"
            >
              <Eye className="h-4 w-4" />
            </Button>
            {row.original.verificationStatus === "PENDING" && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => verifyBank.mutate(row.original.id)}
                  disabled={verifyBank.isPending}
                  aria-label="Verify bank account"
                >
                  <Check className="h-4 w-4 text-success" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setRejectBankId(row.original.id)}
                  aria-label="Reject bank account"
                >
                  <X className="h-4 w-4 text-destructive" />
                </Button>
              </>
            )}
          </div>
        ),
      },
    ],
    [verifyBank],
  );

  const columns = useMemo<ColumnDef<PayoutItem>[]>(
    () => [
      {
        accessorKey: "host.displayName",
        header: "Host",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.host.displayName}</p>
            <p className="text-xs text-muted-foreground">{row.original.host.userId}</p>
          </div>
        ),
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => formatCurrency(row.original.amount),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "requestedAt",
        header: "Requested",
        cell: ({ row }) => formatRelativeTime(row.original.requestedAt),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            {["PENDING", "PROCESSING"].includes(row.original.status) && (
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
        title="Failed to load withdrawals"
        message={getApiErrorMessage(error)}
        requestId={getRequestId(error)}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Wallet & Withdrawals"
        description="Platform wallets, bank verification, and payout requests"
        actions={<ExportButton module="payouts" />}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Platform wallet overview</CardTitle>
        </CardHeader>
        <CardContent>
          {overviewQuery.isError ? (
            <ErrorState
              title="Failed to load wallet overview"
              message={getApiErrorMessage(overviewQuery.error)}
              requestId={getRequestId(overviewQuery.error)}
              onRetry={() => overviewQuery.refetch()}
            />
          ) : overviewQuery.isLoading || !overview ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-xl bg-muted/50" />
              ))}
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {overviewCards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-xl border border-border bg-background/60 p-4"
                >
                  <p className="text-xs text-muted-foreground">{card.label}</p>
                  <p className="mt-1 text-xl font-semibold tracking-tight">{card.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{card.hint}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-1 text-lg font-semibold">Bank account verification</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Open the eye icon to review full account details, then Approve or Reject. Switch the filter
          to Approved to see verified banks.
        </p>
        <div className="mb-4">
          <select
            value={bankStatus}
            onChange={(e) => {
              setBankStatus(e.target.value as BankStatusFilter);
              setBankPage(1);
            }}
            className="h-11 rounded-[18px] border border-input bg-background/50 px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Bank status"
          >
            {BANK_ACCOUNT_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        {bankError ? (
          <ErrorState
            title="Failed to load bank accounts"
            message={getApiErrorMessage(bankQueryError)}
            requestId={getRequestId(bankQueryError)}
            onRetry={() => refetchBanks()}
          />
        ) : (
          <>
            <DataTable
              columns={bankColumns}
              data={bankData?.items ?? []}
              isLoading={bankLoading}
              emptyMessage={
                bankStatus === "approved"
                  ? "No approved bank accounts."
                  : bankStatus === "rejected"
                    ? "No rejected bank accounts."
                    : bankStatus === "all"
                      ? "No bank accounts found."
                      : "No pending bank accounts."
              }
              onRowClick={(row) => setSelectedBankId(row.id)}
            />
            <TablePagination meta={bankData?.meta} onPageChange={setBankPage} />
          </>
        )}
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Withdrawal requests</h2>
        <TableFilters
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search host, reference..."
          status={status}
          onStatusChange={(v) => {
            setStatus((v || "all") as PayoutStatusFilter);
            setPage(1);
          }}
          statusOptions={PAYOUT_STATUS_OPTIONS}
          statusLabel="Payout status"
        />
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        emptyMessage="No withdrawal requests found."
      />

      <TablePagination meta={data?.meta} onPageChange={setPage} />

      <Dialog open={!!selectedBankId} onOpenChange={(open) => !open && setSelectedBankId(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Bank account details</DialogTitle>
          </DialogHeader>
          {bankDetailLoading && !selectedBank ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded-lg bg-muted/50" />
              ))}
            </div>
          ) : selectedBank ? (
            <div className="space-y-4 text-sm">
              <StatusBadge status={selectedBank.verificationStatus} />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Host</p>
                  <p className="font-medium">{selectedBank.host.displayName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Account holder</p>
                  <p className="font-medium">{selectedBank.accountHolderName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedBank.host.email ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedBank.host.phone ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Bank</p>
                  <p className="font-medium">{selectedBank.bankName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">IFSC</p>
                  <p className="font-medium font-mono">{selectedBank.ifscCode}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Account number</p>
                  <p className="font-medium font-mono tracking-wide">
                    {selectedBank.accountNumber ?? selectedBank.accountNumberMasked}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">UPI</p>
                  <p className="font-medium">{selectedBank.upiId ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Submitted</p>
                  <p className="font-medium">{formatRelativeTime(selectedBank.createdAt)}</p>
                </div>
              </div>
              {selectedBank.verificationStatus === "PENDING" && (
                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    onClick={async () => {
                      await verifyBank.mutateAsync(selectedBank.id);
                      setSelectedBankId(null);
                    }}
                    disabled={verifyBank.isPending}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setRejectBankId(selectedBank.id);
                      setSelectedBankId(null);
                    }}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <ReasonDialog
        open={!!rejectId}
        onOpenChange={(open) => !open && setRejectId(null)}
        title="Reject withdrawal"
        confirmLabel="Reject payout"
        loading={reject.isPending}
        onConfirm={async (reason) => {
          if (rejectId) await reject.mutateAsync({ payoutId: rejectId, reason });
          setRejectId(null);
        }}
      />

      <ReasonDialog
        open={!!rejectBankId}
        onOpenChange={(open) => !open && setRejectBankId(null)}
        title="Reject bank account"
        confirmLabel="Reject account"
        loading={rejectBank.isPending}
        onConfirm={async (reason) => {
          if (rejectBankId) await rejectBank.mutateAsync({ bankAccountId: rejectBankId, reason });
          setRejectBankId(null);
        }}
      />
    </div>
  );
}
