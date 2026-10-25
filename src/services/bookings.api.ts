import { apiClient } from "@/services/api-client";
import type { ApiSuccessResponse } from "@/types";
import type { AdminBooking, AdminBookingListQuery } from "@/types/bookings.types";

export const bookingsApi = {
  list: (query: AdminBookingListQuery = {}) =>
    apiClient.get<ApiSuccessResponse<{ items: AdminBooking[] }>>("/admin/bookings", {
      params: query,
    }),
};

export { extractMeta } from "@/lib/api-utils";
