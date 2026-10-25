import { apiClient } from "@/services/api-client";
import type { ApiSuccessResponse } from "@/types";
import type { ApiBookingAnalytics, ApiRevenueAnalytics } from "@/lib/dashboard-summary";

export type AnalyticsPeriod = "daily" | "weekly" | "monthly" | "yearly";

export const analyticsApi = {
  revenue: (period: AnalyticsPeriod) =>
    apiClient.get<ApiSuccessResponse<ApiRevenueAnalytics>>("/admin/analytics/revenue", {
      params: { period },
    }),

  bookings: (period: AnalyticsPeriod) =>
    apiClient.get<ApiSuccessResponse<ApiBookingAnalytics>>("/admin/analytics/bookings", {
      params: { period },
    }),
};
