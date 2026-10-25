import { apiClient } from "@/services/api-client";
import type { ApiSuccessResponse } from "@/types";
import type {
  ModerateReviewInput,
  ReviewListQuery,
  ReviewListResponse,
} from "@/types/reviews.types";

export const reviewsApi = {
  list: (query: ReviewListQuery = {}) =>
    apiClient.get<ApiSuccessResponse<ReviewListResponse>>("/admin/reviews", { params: query }),

  moderate: (reviewId: string, body: ModerateReviewInput) =>
    apiClient.patch<ApiSuccessResponse<Record<string, never>>>(
      `/admin/reviews/${reviewId}/moderate`,
      body,
    ),
};
