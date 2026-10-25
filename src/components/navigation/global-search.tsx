"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MOCK_SEARCH_RESULTS } from "@/lib/mock-data";
import { useSearchStore } from "@/store/search-store";

export function GlobalSearch() {
  const router = useRouter();
  const { open, setOpen, query, setQuery } = useSearchStore();
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setDebouncedQuery("");
    }
  }, [open, setQuery]);

  const results = useMemo(() => {
    if (!debouncedQuery) return MOCK_SEARCH_RESULTS.slice(0, 6);
    const q = debouncedQuery.toLowerCase();
    return MOCK_SEARCH_RESULTS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q) ||
        item.subtitle?.toLowerCase().includes(q),
    );
  }, [debouncedQuery]);

  const handleSelect = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-xl">
        <DialogTitle className="sr-only">Global search</DialogTitle>
        <div className="border-b border-border p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users, hosts, events, bookings..."
              className="pl-9"
            />
          </div>
        </div>
        <ScrollArea className="max-h-80">
          <div className="p-2">
            {results.length === 0 ? (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                No results for &quot;{debouncedQuery}&quot;
              </p>
            ) : (
              results.map((result) => (
                <button
                  key={result.id}
                  type="button"
                  onClick={() => handleSelect(result.href)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-muted"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Search className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{result.title}</p>
                    <p className="truncate text-xs capitalize text-muted-foreground">
                      {result.type}
                      {result.subtitle ? ` · ${result.subtitle}` : ""}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
