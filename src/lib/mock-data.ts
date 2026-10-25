import { ADMIN_PERMISSIONS, ROUTES } from "@/constants";
import type {
  ActivityItem,
  ChartDataPoint,
  DashboardStat,
  NotificationItem,
  SearchResult,
  SystemHealthItem,
} from "@/types";

export const MOCK_STATS: DashboardStat[] = [
  {
    id: "revenue-today",
    label: "Revenue Today",
    value: 248500,
    change: 12.4,
    changeLabel: "vs yesterday",
    format: "currency",
    icon: "indian-rupee",
  },
  {
    id: "revenue-month",
    label: "Revenue This Month",
    value: 4820000,
    change: 8.2,
    changeLabel: "vs last month",
    format: "currency",
    icon: "trending-up",
  },
  {
    id: "bookings-today",
    label: "Bookings Today",
    value: 186,
    change: 5.1,
    changeLabel: "vs yesterday",
    format: "number",
    icon: "calendar-check",
  },
  {
    id: "active-users",
    label: "Active Users",
    value: 12480,
    change: 3.7,
    changeLabel: "vs last week",
    format: "number",
    icon: "users",
  },
  {
    id: "verified-hosts",
    label: "Verified Hosts",
    value: 842,
    change: 2.1,
    changeLabel: "vs last month",
    format: "number",
    icon: "shield-check",
  },
  {
    id: "pending-kyc",
    label: "Pending Verification",
    value: 47,
    change: -4.3,
    changeLabel: "vs yesterday",
    format: "number",
    icon: "file-search",
  },
  {
    id: "pending-reports",
    label: "Pending Reports",
    value: 12,
    change: -8.0,
    changeLabel: "vs yesterday",
    format: "number",
    icon: "flag",
  },
  {
    id: "support-tickets",
    label: "Support Tickets",
    value: 23,
    change: 1.2,
    changeLabel: "open now",
    format: "number",
    icon: "life-buoy",
  },
];

export const MOCK_REVENUE_CHART: ChartDataPoint[] = [
  { label: "Mon", value: 42000 },
  { label: "Tue", value: 38000 },
  { label: "Wed", value: 51000 },
  { label: "Thu", value: 47000 },
  { label: "Fri", value: 62000 },
  { label: "Sat", value: 78000 },
  { label: "Sun", value: 69000 },
];

export const MOCK_BOOKING_CHART: ChartDataPoint[] = [
  { label: "Mon", value: 24 },
  { label: "Tue", value: 18 },
  { label: "Wed", value: 31 },
  { label: "Thu", value: 28 },
  { label: "Fri", value: 42 },
  { label: "Sat", value: 56 },
  { label: "Sun", value: 48 },
];

export const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: "1",
    type: "booking",
    title: "New booking confirmed",
    description: "Priya Sharma booked Sunset Rooftop Mixer",
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    href: ROUTES.bookings,
  },
  {
    id: "2",
    type: "verification",
    title: "KYC submitted",
    description: "Arjun Mehta submitted verification documents",
    timestamp: new Date(Date.now() - 18 * 60000).toISOString(),
    href: ROUTES.verification,
  },
  {
    id: "3",
    type: "payment",
    title: "Payment received",
    description: "₹4,500 payment for Jazz & Wine Evening",
    timestamp: new Date(Date.now() - 42 * 60000).toISOString(),
    href: ROUTES.payments,
  },
  {
    id: "4",
    type: "report",
    title: "Report flagged",
    description: "User report on event content moderation queue",
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    href: ROUTES.reports,
  },
  {
    id: "5",
    type: "system",
    title: "Deployment completed",
    description: "Backend v1.1 deployed to staging",
    timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
  },
];

export const MOCK_SYSTEM_HEALTH: SystemHealthItem[] = [
  { id: "api", label: "API", status: "healthy", latencyMs: 42 },
  { id: "database", label: "Database", status: "healthy", latencyMs: 8 },
  { id: "redis", label: "Redis", status: "healthy", latencyMs: 2 },
  { id: "queue", label: "Queue", status: "warning", latencyMs: 120, message: "Elevated backlog" },
  { id: "email", label: "Email", status: "healthy", latencyMs: 180 },
  { id: "storage", label: "Storage", status: "healthy", latencyMs: 95 },
  { id: "payments", label: "Payment Gateway", status: "healthy", latencyMs: 210 },
  { id: "server", label: "Server", status: "healthy", latencyMs: 15 },
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    type: "verification",
    title: "KYC queue update",
    message: "12 new verification requests pending review",
    timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
    read: false,
    href: ROUTES.verification,
  },
  {
    id: "n2",
    type: "booking",
    title: "Booking spike",
    message: "Bookings up 24% in the last hour",
    timestamp: new Date(Date.now() - 35 * 60000).toISOString(),
    read: false,
    href: ROUTES.bookings,
  },
  {
    id: "n3",
    type: "system",
    title: "Queue backlog",
    message: "BullMQ verification queue has elevated latency",
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    read: true,
    href: ROUTES.systemHealth,
  },
  {
    id: "n4",
    type: "report",
    title: "Moderation alert",
    message: "3 high-priority reports need attention",
    timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
    read: true,
    href: ROUTES.reports,
  },
];

export const MOCK_SEARCH_RESULTS: SearchResult[] = [
  { id: "p1", type: "page", title: "Dashboard", href: ROUTES.dashboard },
  { id: "p2", type: "page", title: "Users", href: ROUTES.users },
  { id: "p3", type: "page", title: "Hosts", href: ROUTES.hosts },
  { id: "p4", type: "page", title: "Events", href: ROUTES.events },
  { id: "p5", type: "page", title: "Analytics", href: ROUTES.analytics },
  { id: "p6", type: "page", title: "System Health", href: ROUTES.systemHealth },
];

export const MOCK_ADMIN_USER = {
  id: "admin-1",
  email: "admin@cirvia.com",
  firstName: "Cirvia",
  lastName: "Admin",
  roles: ["SUPER_ADMIN" as const],
  permissions: Object.values(ADMIN_PERMISSIONS),
};
