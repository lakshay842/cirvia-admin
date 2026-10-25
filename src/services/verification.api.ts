import { apiClient } from "@/services/api-client";
import type { ApiSuccessResponse } from "@/types";
import type {
  AdminVerificationListItem,
  VerificationDetails,
  VerificationListQuery,
  VerificationReviewNote,
  VerificationStatus,
  VerificationTimelineItem,
} from "@/types/verification.types";

export const verificationApi = {
  list: (query: VerificationListQuery = {}) =>
    apiClient.get<ApiSuccessResponse<{ verifications: AdminVerificationListItem[] }>>(
      "/admin/verifications",
      { params: query },
    ),

  getById: (verificationId: string) =>
    apiClient.get<ApiSuccessResponse<{ verification: VerificationDetails }>>(
      `/admin/verifications/${verificationId}`,
    ),

  getTimeline: (verificationId: string) =>
    apiClient.get<
      ApiSuccessResponse<{
        timeline: VerificationTimelineItem[];
        internalNotes: VerificationReviewNote[];
      }>
    >(`/admin/verifications/${verificationId}/timeline`),

  approve: (verificationId: string) =>
    apiClient.patch<ApiSuccessResponse<{ verification: { id: string; status: VerificationStatus } }>>(
      `/admin/verifications/${verificationId}/approve`,
    ),

  reject: (verificationId: string, reason: string) =>
    apiClient.patch<ApiSuccessResponse<{ verification: { id: string; status: VerificationStatus } }>>(
      `/admin/verifications/${verificationId}/reject`,
      { reason },
    ),

  requestReupload: (
    verificationId: string,
    reason: string,
    requiredDocuments?: ("front" | "back" | "selfie")[],
  ) =>
    apiClient.patch<ApiSuccessResponse<{ verification: { id: string; status: VerificationStatus } }>>(
      `/admin/verifications/${verificationId}/request-reupload`,
      { reason, requiredDocuments },
    ),

  addNote: (verificationId: string, note: string) =>
    apiClient.post<ApiSuccessResponse<{ note: VerificationReviewNote }>>(
      `/admin/verifications/${verificationId}/notes`,
      { note },
    ),
};
