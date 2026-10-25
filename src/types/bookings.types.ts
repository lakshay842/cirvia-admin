export type AdminBookingStatus =
  | "PENDING"
  | "PENDING_PAYMENT"
  | "CONFIRMED"
  | "REJECTED"
  | "CANCELLED"
  | "EXPIRED"
  | "COMPLETED"
  | "NO_SHOW"
  | "REFUNDED"
  | "REQUESTED";

export type AdminBookingFilter =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "rejected"
  | "completed"
  | "refunded"
  | "all";

export interface AdminBooking {
  bookingId: string;
  bookingReference: string;
  status: AdminBookingStatus;
  paymentStatus: string;
  guestsCount: number;
  ticketPrice: number;
  currency: string;
  ticketType: string | null;
  event: {
    eventId: string;
    title: string;
    slug: string;
    eventStart: string;
    eventEnd: string;
    city: string | null;
    venueName: string | null;
  };
  host: {
    hostId: string;
    displayName: string | null;
  };
  user: {
    userId: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    profileImage: string | null;
  };
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
}

export interface AdminBookingListQuery {
  page?: number;
  limit?: number;
  status?: AdminBookingFilter;
  search?: string;
  eventId?: string;
}
