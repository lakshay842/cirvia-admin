import { apiClient } from "@/services/api-client";
import type { ApiSuccessResponse } from "@/types";
import type {
  PaymentDetails,
  PaymentListQuery,
  PaymentListResponse,
} from "@/types/payments.types";

export const paymentsApi = {
  list: (query: PaymentListQuery = {}) =>
    apiClient.get<ApiSuccessResponse<PaymentListResponse>>("/admin/payments", { params: query }),

  getById: (paymentId: string) =>
    apiClient.get<ApiSuccessResponse<{ payment: PaymentDetails }>>(
      `/admin/payments/${paymentId}`,
    ),

  refund: (paymentId: string, body: { reason?: string; approve?: boolean }) =>
    apiClient.post<ApiSuccessResponse<{ refund: unknown }>>(
      `/admin/payments/${paymentId}/refund`,
      body,
    ),
};
