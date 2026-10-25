"use client";

import { useQuery } from "@tanstack/react-query";
import { bookingsApi, extractMeta } from "@/services/bookings.api";
import type { AdminBookingFilter, AdminBookingListQuery } from "@/types/bookings.types";
import type { PaginationMeta } from "@/types/api.types";

export function useBookingsList(params: AdminBookingListQuery) {
  return useQuery({
    queryKey: ["admin", "bookings", params],
    queryFn: async () => {
      const { data } = await bookingsApi.list(params);
      return {
        items: data.data.items,
        meta: extractMeta(data) as PaginationMeta | undefined,
      };
    },
  });
}

export const BOOKING_STATUS_OPTIONS: { label: string; value: AdminBookingFilter }[] = [
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Rejected", value: "rejected" },
  { label: "Completed", value: "completed" },
  { label: "Refunded", value: "refunded" },
];
