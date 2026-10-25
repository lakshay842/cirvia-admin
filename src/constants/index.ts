export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Cirvia Admin";
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

export const ROUTES = {
  login: "/login",
  dashboard: "/dashboard",
  users: "/users",
  hosts: "/hosts",
  verification: "/verification",
  events: "/events",
  bookings: "/bookings",
  payments: "/payments",
  wallet: "/wallet",
  reviews: "/reviews",
  reports: "/reports",
  notifications: "/notifications",
  cms: "/cms",
  analytics: "/analytics",
  featureFlags: "/feature-flags",
  settings: "/settings",
  auditLogs: "/audit-logs",
  support: "/support",
  systemHealth: "/system-health",
  roles: "/roles",
  search: "/search",
  refunds: "/refunds",
  revenue: "/revenue",
  monitoring: "/monitoring",
  exports: "/exports",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

export const ADMIN_PERMISSIONS = {
  "admin.dashboard": "admin.dashboard",
  "users.read": "users.read",
  "users.update": "users.update",
  "users.delete": "users.delete",
  "hosts.verify": "hosts.verify",
  "verification.review": "verification.review",
  "events.moderate": "events.moderate",
  "events.create": "events.create",
  "events.publish": "events.publish",
  "events.delete": "events.delete",
  "payments.read": "payments.read",
  "payments.refund": "payments.refund",
  "reports.moderate": "reports.moderate",
  "reviews.read": "reviews.read",
  "reviews.moderate": "reviews.moderate",
  "settings.manage": "settings.manage",
  "analytics.read": "analytics.read",
  "cms.update": "cms.update",
  "feature_flags.view": "feature_flags.view",
  "feature_flags.update": "feature_flags.update",
  "audit.read": "audit.read",
} as const;

export type AdminPermission =
  (typeof ADMIN_PERMISSIONS)[keyof typeof ADMIN_PERMISSIONS];
