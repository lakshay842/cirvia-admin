"use client";

import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  ChevronRight,
  LogOut,
  Menu,
  Moon,
  Search,
  Sun,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { APP_NAME, ROUTES } from "@/constants";
import { ACTIVE_NAV } from "@/constants/navigation";
import { cn } from "@/lib/utils";
import { authApi } from "@/services/dashboard.api";
import { useAuthStore } from "@/store/auth-store";
import { useCommandPaletteStore } from "@/store/command-palette-store";
import { useSearchStore } from "@/store/search-store";
import { useSidebarStore } from "@/store/sidebar-store";
import { NotificationCenter, useUnreadNotificationCount } from "@/components/navigation/notification-center";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}

export function TopNavbar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const unreadCount = useUnreadNotificationCount();
  const setCommandOpen = useCommandPaletteStore((s) => s.setOpen);
  const setSearchOpen = useSearchStore((s) => s.setOpen);
  const setMobileOpen = useSidebarStore((s) => s.setMobileOpen);
  const collapsed = useSidebarStore((s) => s.collapsed);

  const currentNav = ACTIVE_NAV.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );

  const initials = user
    ? `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase()
    : "CA";

  return (
    <header
      className={cn(
        "glass-strong sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border px-4 lg:px-6",
        collapsed ? "lg:pl-[88px]" : "lg:pl-[280px]",
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="hidden min-w-0 items-center gap-2 text-sm md:flex">
        <span className="text-muted-foreground">{APP_NAME}</span>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="truncate font-medium">{currentNav?.label ?? "Dashboard"}</span>
      </div>

      <div className="ml-auto flex flex-1 items-center justify-end gap-2 md:max-w-md lg:max-w-lg">
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="relative hidden w-full md:block"
          aria-label="Open global search"
        >
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            readOnly
            placeholder="Search users, events, pages..."
            className="cursor-pointer pl-9"
          />
        </button>

        <Button
          variant="outline"
          size="sm"
          className="hidden gap-2 md:inline-flex"
          onClick={() => setCommandOpen(true)}
        >
          <span>Command</span>
          <kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px]">
            Ctrl K
          </kbd>
        </Button>

        <ThemeToggle />

        <NotificationCenter>
          <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </Button>
        </NotificationCenter>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 rounded-2xl px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium lg:inline">
                {user ? `${user.firstName} ${user.lastName}` : "Admin"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user?.email ?? "admin@cirvia.com"}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {user?.roles[0] ?? "SUPER_ADMIN"}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard">
                <User className="h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={async (e) => {
                e.preventDefault();
                try {
                  await authApi.logout(refreshToken ?? undefined).catch(() => undefined);
                } finally {
                  await clearAuth();
                  window.location.assign(ROUTES.login);
                }
              }}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
