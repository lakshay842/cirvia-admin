"use client";

import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/sidebar-store";
import { Sidebar } from "@/components/layout/sidebar";
import { SkipLink } from "@/components/layout/skip-link";
import { TopNavbar } from "@/components/layout/top-navbar";
import { CommandPalette } from "@/components/navigation/command-palette";
import { GlobalSearch } from "@/components/navigation/global-search";
import { KeyboardShortcutsDialog } from "@/components/navigation/keyboard-shortcuts-dialog";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const collapsed = useSidebarStore((s) => s.collapsed);
  useKeyboardShortcuts();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <SkipLink />
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-secondary/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <Sidebar />
      <div
        className={cn(
          "flex min-h-screen flex-col transition-all duration-300",
          collapsed ? "lg:pl-[72px]" : "lg:pl-64",
        )}
      >
        <TopNavbar />
        <main id="main-content" className="flex-1 p-4 md:p-6" tabIndex={-1}>
          {children}
        </main>
      </div>

      <CommandPalette />
      <GlobalSearch />
      <KeyboardShortcutsDialog />
    </div>
  );
}
