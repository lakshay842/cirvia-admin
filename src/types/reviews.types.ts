import type { PaginationMeta } from "@/types/api.types";

export type ReviewType = "event" | "host" | "guest";
export type ReviewModerationStatus = "pending" | "approved" | "rejected" | "hidden";
export type ReviewStatusFilter = ReviewModerationStatus | "all";
export type ReviewTypeFilter = ReviewType | "all";
export type ModerateAction = "approve" | "reject" | "hide";

export interface ReviewAuthor {
  id: string;
  displayName: string;
  profileImageUrl: string | null;
}

export interface ReviewItem {
  id: string;
  type: ReviewType;
  bookingId: string;
  rating: number;
  title: string | null;
  comment: string | null;
  wouldRecommend: boolean | null;
  helpfulCount: number;
  verifiedBooking: boolean;
  moderationStatus: ReviewModerationStatus;
  author: ReviewAuthor;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewListQuery {
  page?: number;
  limit?: number;
  status?: ReviewStatusFilter;
  type?: ReviewTypeFilter;
}

export interface ReviewListResponse {
  reviews: ReviewItem[];
  meta?: PaginationMeta;
}

export interface ModerateReviewInput {
  type: ReviewType;
  action: ModerateAction;
  reason?: string;
}
