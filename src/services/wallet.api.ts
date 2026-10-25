import { apiClient } from "@/services/api-client";
import type { ApiSuccessResponse } from "@/types";
import type {
  AdminBankAccountItem,
  AdminWalletOverview,
  BankAccountListQuery,
  BankAccountListResponse,
  PayoutItem,
  PayoutListQuery,
  PayoutListResponse,
  WithdrawalItem,
} from "@/types/wallet.types";

export const walletApi = {
  getOverview: () =>
    apiClient.get<ApiSuccessResponse<{ overview: AdminWalletOverview }>>("/admin/payouts/overview"),

  listPayouts: (query: PayoutListQuery = {}) =>
    apiClient.get<ApiSuccessResponse<PayoutListResponse>>("/admin/payouts", { params: query }),

  approvePayout: (payoutId: string) =>
    apiClient.patch<ApiSuccessResponse<{ payout: WithdrawalItem }>>(
      `/admin/payouts/${payoutId}/approve`,
    ),

  rejectPayout: (payoutId: string, reason?: string) =>
    apiClient.patch<ApiSuccessResponse<{ payout: WithdrawalItem }>>(
      `/admin/payouts/${payoutId}/reject`,
      { reason },
    ),

  listBankAccounts: (query: BankAccountListQuery = {}) =>
    apiClient.get<ApiSuccessResponse<BankAccountListResponse>>("/admin/payouts/bank-accounts", {
      params: query,
    }),

  getBankAccount: (bankAccountId: string) =>
    apiClient.get<ApiSuccessResponse<{ account: AdminBankAccountItem }>>(
      `/admin/payouts/bank-accounts/${bankAccountId}`,
    ),

  verifyBankAccount: (bankAccountId: string) =>
    apiClient.patch<ApiSuccessResponse<{ account: AdminBankAccountItem }>>(
      `/admin/payouts/bank-accounts/${bankAccountId}/verify`,
    ),

  rejectBankAccount: (bankAccountId: string, reason?: string) =>
    apiClient.patch<ApiSuccessResponse<{ account: AdminBankAccountItem }>>(
      `/admin/payouts/bank-accounts/${bankAccountId}/reject`,
      { reason },
    ),
};

export type { PayoutItem, AdminBankAccountItem, AdminWalletOverview };
