import {
  Activity,
  BarChart3,
  Bell,
  CalendarDays,
  CreditCard,
  Download,
  FileSearch,
  Flag,
  KeyRound,
  LayoutDashboard,
  LifeBuoy,
  MessageSquare,
  Monitor,
  RotateCcw,
  Search,
  Settings,
  Shield,
  SlidersHorizontal,
  Star,
  TrendingUp,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { ADMIN_PERMISSIONS, ROUTES } from "@/constants";
import type { AdminPermission } from "@/constants";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  permission?: AdminPermission;
  badge?: string;
  phase?: number;
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: ROUTES.dashboard,
    icon: LayoutDashboard,
    permission: ADMIN_PERMISSIONS["admin.dashboard"],
    phase: 1,
  },
  {
    label: "Revenue",
    href: ROUTES.revenue,
    icon: TrendingUp,
    permission: ADMIN_PERMISSIONS["analytics.read"],
    phase: 4,
  },
  {
    label: "Analytics",
    href: ROUTES.analytics,
    icon: BarChart3,
    permission: ADMIN_PERMISSIONS["analytics.read"],
    phase: 3,
  },
  {
    label: "Search",
    href: ROUTES.search,
    icon: Search,
    phase: 3,
  },
  {
    label: "Users",
    href: ROUTES.users,
    icon: Users,
    permission: ADMIN_PERMISSIONS["users.read"],
    phase: 2,
  },
  {
    label: "Hosts",
    href: ROUTES.hosts,
    icon: Shield,
    permission: ADMIN_PERMISSIONS["hosts.verify"],
    phase: 2,
  },
  {
    label: "Verification",
    href: ROUTES.verification,
    icon: FileSearch,
    permission: ADMIN_PERMISSIONS["verification.review"],
    phase: 2,
  },
  {
    label: "Events",
    href: ROUTES.events,
    icon: CalendarDays,
    permission: ADMIN_PERMISSIONS["events.moderate"],
    phase: 2,
  },
  {
    label: "Reviews",
    href: ROUTES.reviews,
    icon: Star,
    permission: ADMIN_PERMISSIONS["reviews.moderate"],
    phase: 4,
  },
  {
    label: "Bookings",
    href: ROUTES.bookings,
    icon: Activity,
    permission: ADMIN_PERMISSIONS["events.moderate"],
    phase: 3,
  },
  {
    label: "Payments",
    href: ROUTES.payments,
    icon: CreditCard,
    permission: ADMIN_PERMISSIONS["payments.read"],
    phase: 3,
  },
  {
    label: "Refunds",
    href: ROUTES.refunds,
    icon: RotateCcw,
    permission: ADMIN_PERMISSIONS["payments.refund"],
    phase: 4,
  },
  {
    label: "Wallet",
    href: ROUTES.wallet,
    icon: Wallet,
    permission: ADMIN_PERMISSIONS["payments.read"],
    phase: 3,
  },
  {
    label: "Notifications",
    href: ROUTES.notifications,
    icon: Bell,
    permission: ADMIN_PERMISSIONS["admin.dashboard"],
    phase: 3,
  },
  {
    label: "Reports Queue",
    href: ROUTES.reports,
    icon: Flag,
    permission: ADMIN_PERMISSIONS["reports.moderate"],
    phase: 4,
  },
  {
    label: "Monitoring",
    href: ROUTES.monitoring,
    icon: Monitor,
    permission: ADMIN_PERMISSIONS["admin.dashboard"],
    phase: 5,
  },
  {
    label: "Feature Flags",
    href: ROUTES.featureFlags,
    icon: SlidersHorizontal,
    permission: ADMIN_PERMISSIONS["feature_flags.view"],
    phase: 5,
  },
  {
    label: "Exports",
    href: ROUTES.exports,
    icon: Download,
    permission: ADMIN_PERMISSIONS["admin.dashboard"],
    phase: 5,
  },
  {
    label: "Audit Logs",
    href: ROUTES.auditLogs,
    icon: MessageSquare,
    permission: ADMIN_PERMISSIONS["audit.read"],
    phase: 3,
  },
  {
    label: "Roles",
    href: ROUTES.roles,
    icon: KeyRound,
    permission: ADMIN_PERMISSIONS["admin.dashboard"],
    phase: 3,
  },
  {
    label: "Support",
    href: ROUTES.support,
    icon: LifeBuoy,
    permission: ADMIN_PERMISSIONS["admin.dashboard"],
    phase: 4,
  },
  {
    label: "System Health",
    href: ROUTES.systemHealth,
    icon: Activity,
    permission: ADMIN_PERMISSIONS["admin.dashboard"],
    phase: 1,
  },
  {
    label: "Settings",
    href: ROUTES.settings,
    icon: Settings,
    permission: ADMIN_PERMISSIONS["settings.manage"],
    phase: 3,
  },
];

export const PHASE_1_NAV = NAV_ITEMS.filter((item) => item.phase === 1);
export const PHASE_2_NAV = NAV_ITEMS.filter((item) => item.phase === 2);
export const PHASE_3_NAV = NAV_ITEMS.filter((item) => item.phase === 3);
export const PHASE_4_NAV = NAV_ITEMS.filter((item) => item.phase === 4);
export const PHASE_5_NAV = NAV_ITEMS.filter((item) => item.phase === 5);
export const ACTIVE_NAV = NAV_ITEMS.filter((item) => item.phase && item.phase <= 5);
