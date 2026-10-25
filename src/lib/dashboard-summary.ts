import type { ChartDataPoint } from "@/types";
import type { DashboardSummary } from "@/services/dashboard.api";
import type { DashboardStat } from "@/types";

/** Response from GET /admin/dashboard */
export interface ApiDashboardSummary {
  users: { total: number; growth: number };
  hosts: { total: number; growth: number };
  events: { total: number; live: number };
  bookings: { total: number; conversionRate: number };
  payments: { total: number; succeeded: number };
  revenue: { total: number; platformFees: number };
  reports: { pending: number; underReview: number; resolved: number };
}

function isDashboardSummary(data: unknown): data is DashboardSummary {
  return (
    typeof data === "object" &&
    data !== null &&
    "stats" in data &&
    Array.isArray((data as DashboardSummary).stats)
  );
}

function isApiDashboardSummary(data: unknown): data is ApiDashboardSummary {
  return typeof data === "object" && data !== null && "users" in data && "revenue" in data;
}

export function mapApiDashboardSummary(api: ApiDashboardSummary): DashboardSummary {
  const stats: DashboardStat[] = [
    {
      id: "revenue-total",
      label: "Total Revenue",
      value: api.revenue.total,
      change: 0,
      changeLabel: `₹${api.revenue.platformFees.toLocaleString()} platform fees`,
      format: "currency",
      icon: "indian-rupee",
    },
    {
      id: "bookings-total",
      label: "Total Bookings",
      value: api.bookings.total,
      change: api.bookings.conversionRate,
      changeLabel: "conversion rate %",
      format: "number",
      icon: "calendar-check",
    },
    {
      id: "users-total",
      label: "Total Users",
      value: api.users.total,
      change: api.users.growth,
      changeLabel: "growth %",
      format: "number",
      icon: "users",
    },
    {
      id: "hosts-total",
      label: "Total Hosts",
      value: api.hosts.total,
      change: api.hosts.growth,
      changeLabel: "growth %",
      format: "number",
      icon: "shield-check",
    },
    {
      id: "live-events",
      label: "Live Events",
      value: api.events.live,
      change: 0,
      changeLabel: `${api.events.total} total events`,
      format: "number",
      icon: "trending-up",
    },
    {
      id: "pending-reports",
      label: "Pending Reports",
      value: api.reports.pending,
      change: 0,
      changeLabel: `${api.reports.underReview} under review`,
      format: "number",
      icon: "flag",
    },
  ];

  return {
    stats,
    revenueChart: [],
    bookingChart: [],
    recentActivity: [],
    systemHealth: [],
  };
}

export function normalizeDashboardSummary(data: unknown): DashboardSummary | null {
  if (isDashboardSummary(data)) {
    return {
      stats: data.stats ?? [],
      revenueChart: data.revenueChart ?? [],
      bookingChart: data.bookingChart ?? [],
      recentActivity: data.recentActivity ?? [],
      systemHealth: data.systemHealth ?? [],
    };
  }

  if (isApiDashboardSummary(data)) {
    return mapApiDashboardSummary(data);
  }

  return null;
}

export interface ApiTimeSeriesPoint {
  date: string;
  value: number;
}

export interface ApiRevenueAnalytics {
  totalAmount: number;
  platformFees: number;
  netAmount: number;
  count: number;
  succeeded: number;
  failed: number;
  series: ApiTimeSeriesPoint[];
}

export interface ApiBookingAnalytics {
  total: number;
  confirmed: number;
  cancelled: number;
  series: ApiTimeSeriesPoint[];
}

export function mapTimeSeriesToChart(series: ApiTimeSeriesPoint[] | undefined): ChartDataPoint[] {
  return (series ?? []).map((point) => ({
    label: point.date,
    value: point.value,
  }));
}

export function buildRevenueStatsFromAnalytics(revenue: ApiRevenueAnalytics): DashboardStat[] {
  return [
    {
      id: "revenue-total",
      label: "Guest payments",
      value: revenue.totalAmount,
      change: 0,
      changeLabel: `${revenue.count} payments (gross)`,
      format: "currency",
      icon: "indian-rupee",
    },
    {
      id: "platform-fees",
      label: "Platform fee cut",
      value: revenue.platformFees,
      change: 0,
      changeLabel: "Cirvia commission",
      format: "currency",
      icon: "trending-up",
    },
    {
      id: "hosts-received",
      label: "Hosts received",
      value: revenue.netAmount,
      change: 0,
      changeLabel: `${revenue.succeeded} succeeded`,
      format: "currency",
      icon: "trending-up",
    },
  ];
}

export function mergeAnalyticsSummary(
  summary: DashboardSummary,
  revenue?: ApiRevenueAnalytics,
  bookings?: ApiBookingAnalytics,
): DashboardSummary {
  const revenueStats = revenue ? buildRevenueStatsFromAnalytics(revenue) : summary.stats;
  const currencyStats = revenueStats.filter((stat) => stat.format === "currency");
  const otherStats = summary.stats.filter((stat) => stat.format !== "currency");

  return {
    ...summary,
    stats: currencyStats.length > 0 ? [...currencyStats, ...otherStats] : summary.stats,
    revenueChart:
      revenue?.series && revenue.series.length > 0
        ? mapTimeSeriesToChart(revenue.series)
        : summary.revenueChart,
    bookingChart:
      bookings?.series && bookings.series.length > 0
        ? mapTimeSeriesToChart(bookings.series)
        : summary.bookingChart,
  };
}
