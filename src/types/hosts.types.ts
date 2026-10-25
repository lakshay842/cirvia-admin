export type HostAccountStatus =
  | "PENDING"
  | "VERIFIED"
  | "REJECTED"
  | "SUSPENDED"
  | "INACTIVE"
  | "DELETED";

export type VerificationStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "EXPIRED"
  | "RESUBMITTED"
  | "CANCELLED"
  | "BLOCKED";

export interface HostPrivateProfile {
  id: string;
  userId: string;
  slug: string;
  displayName: string;
  bio: string | null;
  about: string | null;
  occupation: string | null;
  languages: string[];
  interests: string[];
  profileImageUrl: string | null;
  coverImageUrl: string | null;
  hostRating: number;
  totalReviews: number;
  completedEvents: number;
  responseTime: number | null;
  isVerified: boolean;
  trustScore: number | null;
  accountStatus: HostAccountStatus;
  verificationStatus: VerificationStatus;
  hostingExperience: string | null;
  profileCompletion: number;
  hostSince: string | null;
  organizationId: string | null;
  address?: {
    city: string;
    state: string;
    country: string;
  } | null;
}

export interface HostListQuery {
  page?: number;
  limit?: number;
  status?: HostAccountStatus;
}
