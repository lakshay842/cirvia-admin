import type { PaginationMeta } from "@/types/api.types";

export type AdminRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "FINANCE_ADMIN"
  | "SUPPORT_ADMIN"
  | "MODERATOR"
  | "READ_ONLY_ADMIN";

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  roles: AdminRole[];
  permissions: string[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Array<{ field: string; message: string }>;
  requestId?: string;
}

export type HealthStatus = "healthy" | "warning" | "critical" | "unknown";

export interface SystemHealthItem {
  id: string;
  label: string;
  status: HealthStatus;
  latencyMs?: number;
  message?: string;
}

export interface DashboardStat {
  id: string;
  label: string;
  value: number;
  change: number;
  changeLabel: string;
  format: "currency" | "number";
  icon: string;
}

export interface ActivityItem {
  id: string;
  type: "booking" | "payment" | "verification" | "report" | "system" | "user";
  title: string;
  description: string;
  timestamp: string;
  href?: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  secondary?: number;
}

export interface NotificationItem {
  id: string;
  type: "payment" | "booking" | "report" | "verification" | "system" | "support";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  href?: string;
}

export interface SearchResult {
  id: string;
  type: "page" | "user" | "host" | "event" | "booking" | "payment" | "report";
  title: string;
  subtitle?: string;
  href: string;
}

export interface CommandAction {
  id: string;
  label: string;
  group: string;
  href?: string;
  shortcut?: string;
  onSelect?: () => void;
}

export type { PaginationMeta, PaginatedResponse } from "@/types/api.types";
