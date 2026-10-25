"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ACTIVE_NAV } from "@/constants/navigation";
import { APP_NAME } from "@/constants";
import { userHasPermission } from "@/lib/admin-user";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { useSidebarStore } from "@/store/sidebar-store";

function canAccessNavItem(
  user: ReturnType<typeof useAuthStore.getState>["user"],
  permission?: (typeof ACTIVE_NAV)[number]["permission"],
): boolean {
  if (!permission) return true;
  if (!user) return false;
  return userHasPermission(user, permission);
}

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, mobileOpen, toggleCollapsed, setMobileOpen } = useSidebarStore();
  const user = useAuthStore((s) => s.user);
  const visibleNav = ACTIVE_NAV.filter((item) => canAccessNavItem(user, item.permission));

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{APP_NAME}</p>
              <p className="truncate text-xs text-muted-foreground">Control Center</p>
            </div>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:inline-flex"
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          <TooltipProvider delayDuration={0}>
            {visibleNav.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const link = (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-2xl border border-primary/20 bg-primary/10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <item.icon className="relative h-4 w-4 shrink-0" />
                  {!collapsed && <span className="relative truncate">{item.label}</span>}
                </Link>
              );

              if (collapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>{link}</TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                );
              }

              return link;
            })}
          </TooltipProvider>
        </nav>
      </ScrollArea>

      {!collapsed && (
        <div className="border-t border-border p-4">
          <div className="rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/10 p-4">
            <p className="text-xs font-semibold">Final Phase Active</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Notifications, refunds, revenue, reports, and moderation.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          "glass-strong fixed inset-y-0 left-0 z-40 hidden border-r border-border transition-all duration-300 lg:block",
          collapsed ? "w-[72px]" : "w-64",
        )}
      >
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar overlay"
          />
          <aside className="glass-strong absolute inset-y-0 left-0 w-72 border-r border-border shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
