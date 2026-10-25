"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { walletApi } from "@/services/wallet.api";
import { extractNestedMeta } from "@/lib/api-utils";
import type { AdminBankAccountItem } from "@/types/wallet.types";

export function useBankAccountsList(params: {
  page?: number;
  limit?: number;
  status?: "pending" | "approved" | "rejected" | "all";
}) {
  return useQuery({
    queryKey: ["admin", "bank-accounts", params],
    queryFn: async () => {
      const { data } = await walletApi.listBankAccounts(params);
      return {
        items: data.data.accounts,
        meta: extractNestedMeta(data.data),
      };
    },
  });
}

export function useBankAccountDetail(bankAccountId: string | null) {
  return useQuery({
    queryKey: ["admin", "bank-accounts", bankAccountId],
    queryFn: async () => {
      const { data } = await walletApi.getBankAccount(bankAccountId!);
      return data.data.account;
    },
    enabled: !!bankAccountId,
  });
}

export function useBankAccountMutations() {
  const queryClient = useQueryClient();

  const verify = useMutation({
    mutationFn: (bankAccountId: string) => walletApi.verifyBankAccount(bankAccountId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "bank-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "wallet", "overview"] });
    },
  });

  const reject = useMutation({
    mutationFn: ({ bankAccountId, reason }: { bankAccountId: string; reason?: string }) =>
      walletApi.rejectBankAccount(bankAccountId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "bank-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "wallet", "overview"] });
    },
  });

  return { verify, reject };
}

export const BANK_ACCOUNT_STATUS_OPTIONS: {
  label: string;
  value: "pending" | "approved" | "rejected" | "all";
}[] = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "All", value: "all" },
];

export type { AdminBankAccountItem };
