"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { extractNestedMeta } from "@/lib/api-utils";
import { reviewsApi } from "@/services/reviews.api";
import type {
  ModerateReviewInput,
  ReviewListQuery,
  ReviewStatusFilter,
  ReviewTypeFilter,
} from "@/types/reviews.types";

export function useReviewsList(params: ReviewListQuery) {
  return useQuery({
    queryKey: ["admin", "reviews", params],
    queryFn: async () => {
      const { data } = await reviewsApi.list(params);
      return {
        items: data.data.reviews,
        meta: extractNestedMeta(data.data),
      };
    },
  });
}

export function useReviewMutations() {
  const queryClient = useQueryClient();

  const moderate = useMutation({
    mutationFn: ({ reviewId, ...body }: ModerateReviewInput & { reviewId: string }) =>
      reviewsApi.moderate(reviewId, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] }),
  });

  return { moderate };
}

export const REVIEW_STATUS_OPTIONS: { label: string; value: ReviewStatusFilter }[] = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Hidden", value: "hidden" },
  { label: "All", value: "all" },
];

export const REVIEW_TYPE_OPTIONS: { label: string; value: ReviewTypeFilter }[] = [
  { label: "All types", value: "all" },
  { label: "Event", value: "event" },
  { label: "Host", value: "host" },
  { label: "Guest", value: "guest" },
];
