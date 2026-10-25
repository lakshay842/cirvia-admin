export type PayoutStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export type PayoutStatusFilter =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled"
  | "all";

export interface WithdrawalItem {
  id: string;
  amount: number;
  status: PayoutStatus;
  requestedAt: string;
  processedAt: string | null;
  transactionReference: string | null;
}

export interface PayoutItem extends WithdrawalItem {
  host: {
    id: string;
    displayName: string;
    userId: string;
  };
}

export interface PayoutListQuery {
  page?: number;
  limit?: number;
  status?: PayoutStatusFilter;
}

export interface PayoutListResponse {
  payouts: PayoutItem[];
  meta: import("@/types/api.types").PaginationMeta;
}

export type BankAccountVerificationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface AdminBankAccountItem {
  id: string;
  accountHolderName: string;
  bankName: string;
  accountNumberMasked: string;
  accountNumber?: string;
  ifscCode: string;
  upiId: string | null;
  isPrimary: boolean;
  verificationStatus: BankAccountVerificationStatus;
  createdAt: string;
  updatedAt?: string;
  host: {
    id: string;
    displayName: string;
    userId: string;
    email?: string | null;
    phone?: string | null;
  };
}

export interface BankAccountListQuery {
  page?: number;
  limit?: number;
  status?: "pending" | "approved" | "rejected" | "all";
}

export interface BankAccountListResponse {
  accounts: AdminBankAccountItem[];
  meta: import("@/types/api.types").PaginationMeta;
}

export interface AdminWalletOverview {
  currency: string;
  hostsWithWallets: number;
  hostsWithBalance: number;
  totalAvailableBalance: number;
  totalPendingBalance: number;
  totalLifetimeEarnings: number;
  totalLifetimeWithdrawals: number;
  paymentsCaptured: number;
  guestPaymentsTotal: number;
  platformFeesCollected: number;
  hostEarningsTotal: number;
  pendingBankAccounts: number;
  approvedBankAccounts: number;
  pendingPayouts: number;
  processingPayouts: number;
  completedPayouts: number;
  pendingPayoutAmount: number;
  completedPayoutAmount: number;
}

