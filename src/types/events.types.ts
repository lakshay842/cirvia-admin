export type EventStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "PUBLISHED"
  | "BOOKING_OPEN"
  | "BOOKING_CLOSED"
  | "EVENT_STARTED"
  | "CHECK_IN"
  | "COMPLETED"
  | "ARCHIVED"
  | "CANCELLED";

export interface EventHost {
  slug: string;
  displayName: string;
  profileImageUrl: string | null;
  isVerified: boolean;
  hostRating: number;
}

export interface EventCategory {
  id: string;
  name: string;
  slug: string;
}

export interface EventLocation {
  venueName: string;
  city: string;
  state: string;
  country: string;
}

export interface EventPrivate {
  id: string;
  hostId: string;
  categoryId: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string | null;
  status: EventStatus;
  capacity: number;
  remainingCapacity: number;
  price: number;
  currency: string;
  bookingStart: string;
  bookingEnd: string;
  eventStart: string;
  eventEnd: string;
  isFeatured: boolean;
  isTrending: boolean;
  isSuspended: boolean;
  cancelReason: string | null;
  rejectionReason: string | null;
  category: EventCategory;
  host: EventHost;
  location: EventLocation | null;
  createdAt: string;
  updatedAt: string;
}

export interface EventListQuery {
  page?: number;
  limit?: number;
}
