export type PaymentStatus =
  | "PENDING"
  | "AUTHORIZED"
  | "CAPTURED"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED"
  | "CANCELLED";

export type PaymentStatusFilter =
  | "pending"
  | "authorized"
  | "captured"
  | "failed"
  | "refunded"
  | "partially_refunded"
  | "cancelled"
  | "all";

export interface RefundSummary {
  id: string;
  status: string;
  refundAmount: number;
  reason: string;
  requestedAt: string;
  processedAt: string | null;
}

export interface PaymentDetails {
  id: string;
  paymentReference: string;
  bookingId: string;
  amount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  gateway: string;
  paidAt: string | null;
  createdAt: string;
  platformFee: number;
  taxAmount: number;
  discountAmount: number;
  netAmount: number;
  paymentMethod: string | null;
  failureReason: string | null;
  gatewayTransactionId: string | null;
  bookingReference: string;
  eventTitle: string;
  refund: RefundSummary | null;
}

export interface PaymentListQuery {
  page?: number;
  limit?: number;
  status?: PaymentStatusFilter;
  userId?: string;
  hostId?: string;
}

export interface PaymentListResponse {
  payments: PaymentDetails[];
  meta: import("@/types/api.types").PaginationMeta;
}
