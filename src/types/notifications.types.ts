export type NotificationTypeFilter =
  | "all"
  | "booking"
  | "payment"
  | "refund"
  | "verification"
  | "reminder"
  | "promotion"
  | "security"
  | "support"
  | "review"
  | "trust_score";

export interface NotificationItem {
  id: string;
  type: string;
  category: string;
  title: string;
  message: string;
  data: Record<string, unknown> | null;
  priority: string;
  isRead: boolean;
  readAt: string | null;
  sentAt: string | null;
  createdAt: string;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  marketing: boolean;
  security: boolean;
  booking: boolean;
  review: boolean;
}

export interface NotificationListQuery {
  page?: number;
  limit?: number;
  type?: NotificationTypeFilter;
  unreadOnly?: boolean;
}

export interface NotificationListResponse {
  notifications: NotificationItem[];
  unreadCount: number;
  meta: import("@/types/api.types").PaginationMeta;
}
