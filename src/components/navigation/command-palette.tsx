"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  BarChart3,
  CalendarDays,
  CreditCard,
  Download,
  FileSearch,
  LayoutDashboard,
  Monitor,
  Search,
  Settings,
  Shield,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ROUTES } from "@/constants";
import { MOCK_SEARCH_RESULTS } from "@/lib/mock-data";
import { useCommandPaletteStore } from "@/store/command-palette-store";

const PAGE_COMMANDS = [
  { label: "Dashboard", href: ROUTES.dashboard, icon: LayoutDashboard, group: "Pages" },
  { label: "Users", href: ROUTES.users, icon: Users, group: "Pages" },
  { label: "Hosts", href: ROUTES.hosts, icon: Shield, group: "Pages" },
  { label: "Verification", href: ROUTES.verification, icon: FileSearch, group: "Pages" },
  { label: "Events", href: ROUTES.events, icon: CalendarDays, group: "Pages" },
  { label: "Payments", href: ROUTES.payments, icon: CreditCard, group: "Pages" },
  { label: "Refunds", href: ROUTES.refunds, icon: CreditCard, group: "Pages" },
  { label: "Revenue", href: ROUTES.revenue, icon: BarChart3, group: "Pages" },
  { label: "Reviews", href: ROUTES.reviews, icon: FileSearch, group: "Pages" },
  { label: "Reports Queue", href: ROUTES.reports, icon: FileSearch, group: "Pages" },
  { label: "Monitoring", href: ROUTES.monitoring, icon: Monitor, group: "Pages" },
  { label: "Feature Flags", href: ROUTES.featureFlags, icon: SlidersHorizontal, group: "Pages" },
  { label: "Exports", href: ROUTES.exports, icon: Download, group: "Pages" },
  { label: "Analytics", href: ROUTES.analytics, icon: BarChart3, group: "Pages" },
  { label: "Search", href: ROUTES.search, icon: Search, group: "Pages" },
  { label: "Audit Logs", href: ROUTES.auditLogs, icon: FileSearch, group: "Pages" },
  { label: "Settings", href: ROUTES.settings, icon: Settings, group: "Pages" },
];

const QUICK_ACTIONS = [
  { label: "Open Dashboard", href: ROUTES.dashboard, group: "Quick Actions" },
  { label: "Open Analytics", href: ROUTES.analytics, group: "Quick Actions" },
  { label: "Open System Health", href: ROUTES.systemHealth, group: "Quick Actions" },
];

export function CommandPalette() {
  const router = useRouter();
  const { open, setOpen } = useCommandPaletteStore();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const filteredPages = useMemo(() => {
    if (!query) return PAGE_COMMANDS;
    const q = query.toLowerCase();
    return PAGE_COMMANDS.filter((item) => item.label.toLowerCase().includes(q));
  }, [query]);

  const filteredSearch = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return MOCK_SEARCH_RESULTS.filter((item) => item.title.toLowerCase().includes(q));
  }, [query]);

  const navigate = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-xl">
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <Command className="rounded-[28px]">
          <div className="flex items-center border-b border-border px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder="Search pages, users, events..."
              className="flex h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>

            <Command.Group heading="Pages">
              {filteredPages.map((item) => (
                <Command.Item
                  key={item.href}
                  value={item.label}
                  onSelect={() => navigate(item.href)}
                  className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm aria-selected:bg-muted"
                >
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  {item.label}
                </Command.Item>
              ))}
            </Command.Group>

            {query && filteredSearch.length > 0 && (
              <Command.Group heading="Search Results">
                {filteredSearch.map((item) => (
                  <Command.Item
                    key={item.id}
                    value={item.title}
                    onSelect={() => navigate(item.href)}
                    className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm aria-selected:bg-muted"
                  >
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p>{item.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{item.type}</p>
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            <Command.Group heading="Quick Actions">
              {QUICK_ACTIONS.map((item) => (
                <Command.Item
                  key={item.href}
                  value={item.label}
                  onSelect={() => navigate(item.href)}
                  className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm aria-selected:bg-muted"
                >
                  {item.label}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
