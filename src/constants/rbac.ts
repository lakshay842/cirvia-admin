/** Mirrors backend prisma/seed.ts — read-only reference until admin APIs ship */

export const PLATFORM_ROLES = [
  { name: "USER", description: "Registered platform user" },
  { name: "HOST", description: "Verified event host" },
  { name: "MODERATOR", description: "Content and report moderator" },
  { name: "ADMIN", description: "Platform administrator" },
  { name: "SUPER_ADMIN", description: "Full platform control" },
] as const;

export const PLATFORM_PERMISSIONS = [
  "users.read",
  "users.update",
  "users.delete",
  "events.create",
  "events.publish",
  "events.delete",
  "events.moderate",
  "payments.read",
  "payments.refund",
  "admin.dashboard",
  "cms.update",
  "hosts.verify",
  "reports.moderate",
  "verification.review",
  "settings.manage",
  "analytics.read",
] as const;

export const ROLE_PERMISSION_MAP: Record<string, readonly string[]> = {
  USER: ["events.create"],
  HOST: ["events.create", "events.publish"],
  MODERATOR: [
    "users.read",
    "reports.moderate",
    "verification.review",
    "events.delete",
    "events.moderate",
  ],
  ADMIN: [
    "users.read",
    "users.update",
    "users.delete",
    "events.create",
    "events.publish",
    "events.delete",
    "events.moderate",
    "payments.read",
    "payments.refund",
    "admin.dashboard",
    "cms.update",
    "hosts.verify",
    "reports.moderate",
    "verification.review",
    "analytics.read",
  ],
  SUPER_ADMIN: PLATFORM_PERMISSIONS,
};

export const ADMIN_ROLE_TYPES = [
  { name: "SUPER_ADMIN", description: "Full admin access", priority: 100 },
  { name: "ADMIN", description: "Standard admin access", priority: 80 },
  { name: "MODERATOR", description: "Moderation access", priority: 60 },
  { name: "FINANCE_ADMIN", description: "Payments and refunds", priority: 50 },
  { name: "SUPPORT_ADMIN", description: "Support ticket management", priority: 40 },
] as const;

export const SEEDED_SYSTEM_SETTINGS = [
  { key: "platform_fee_percent", value: "10", type: "NUMBER" },
  { key: "maintenance_mode", value: "false", type: "BOOLEAN" },
  { key: "otp_expiry_minutes", value: "5", type: "NUMBER" },
  { key: "booking_timeout_minutes", value: "15", type: "NUMBER" },
  { key: "account_lock_attempts", value: "5", type: "NUMBER" },
  { key: "account_lock_duration_minutes", value: "30", type: "NUMBER" },
  { key: "jwt_access_expiry", value: "30d", type: "STRING" },
  { key: "jwt_refresh_expiry", value: "30d", type: "STRING" },
  { key: "trust_score_initial", value: "50", type: "NUMBER" },
  { key: "default_currency", value: "INR", type: "STRING" },
] as const;

/** Reference until GET/PATCH /admin/features ships */
export const SEEDED_FEATURE_FLAGS = [
  {
    key: "reviews_enabled",
    label: "Reviews",
    description: "Allow users to submit event, host, and guest reviews",
    enabled: true,
  },
  {
    key: "wallet_payouts",
    label: "Wallet payouts",
    description: "Host withdrawal requests and bank verification",
    enabled: true,
  },
  {
    key: "event_discovery",
    label: "Event discovery",
    description: "Public event search and category filters",
    enabled: true,
  },
  {
    key: "maintenance_mode",
    label: "Maintenance mode",
    description: "Block non-admin traffic when enabled",
    enabled: false,
  },
  {
    key: "beta_analytics",
    label: "Beta analytics",
    description: "Experimental admin analytics dashboards",
    enabled: false,
  },
] as const;
