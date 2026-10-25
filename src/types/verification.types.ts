export type VerificationStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "BLOCKED"
  | "EXPIRED"
  | "RESUBMITTED"
  | "CANCELLED";

export type VerificationType =
  | "AADHAAR"
  | "PASSPORT"
  | "DRIVING_LICENSE"
  | "VOTER_ID"
  | "PAN_CARD"
  | "INTERNATIONAL_ID";

export interface AdminVerificationListItem {
  id: string;
  userId: string;
  userEmail: string;
  username: string | null;
  verificationType: VerificationType;
  status: VerificationStatus;
  submittedAt: string | null;
  createdAt: string;
}

export interface VerificationDocument {
  id: string;
  documentType: string;
  hasFrontImage: boolean;
  hasBackImage: boolean;
  hasSelfieImage: boolean;
  frontImageUrl?: string;
  backImageUrl?: string;
  selfieImageUrl?: string;
  expiryDate: string | null;
  createdAt: string;
}

export interface VerificationTimelineItem {
  id: string;
  oldStatus: VerificationStatus;
  newStatus: VerificationStatus;
  reason: string | null;
  changedBy: string | null;
  createdAt: string;
}

export interface VerificationReviewNote {
  id: string;
  reviewerId: string;
  note: string;
  isInternal: boolean;
  createdAt: string;
}

export interface VerificationDetails {
  id: string;
  verificationType: VerificationType;
  status: VerificationStatus;
  submittedAt: string | null;
  reviewedAt: string | null;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
  documents: VerificationDocument[];
  timeline: VerificationTimelineItem[];
  internalNotes: VerificationReviewNote[];
}

export interface VerificationListQuery {
  page?: number;
  limit?: number;
  status?: VerificationStatus;
}
