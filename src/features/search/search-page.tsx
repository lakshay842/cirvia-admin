"use client";

import { useEffect, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Clock, Search } from "lucide-react";
import { DataTable } from "@/components/data-display/data-table";
import { StatusBadge } from "@/components/data-display/status-badge";
import { TablePagination } from "@/components/data-display/table-pagination";
import { ErrorState } from "@/components/feedback/error-state";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  getRecentSearches,
  saveRecentSearch,
  useEventDiscovery,
  useEventSearch,
} from "@/hooks/use-search";
import { getApiErrorMessage, getRequestId } from "@/services/api-client";
import { formatCurrency } from "@/lib/utils";
import type { EventPrivate } from "@/types/events.types";

type SearchMode = "search" | "discover";

export function SearchPage() {
  const [mode, setMode] = useState<SearchMode>("search");
  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<string>("newest");
  const [priceType, setPriceType] = useState<string>("");
  const [verifiedHost, setVerifiedHost] = useState(false);
  const [page, setPage] = useState(1);
  const [recent, setRecent] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState({
    keyword: "",
    city: "",
    category: "",
    sort: "newest",
    priceType: "",
    verifiedHost: false,
  });

  useEffect(() => {
    setRecent(getRecentSearches());
  }, []);

  const searchQuery = useEventSearch({
    keyword: submitted.keyword,
    city: submitted.city,
    category: submitted.category,
    page,
    limit: 20,
    enabled: mode === "search",
  });

  const discoverQuery = useEventDiscovery({
    search: submitted.keyword,
    city: submitted.city,
    category: submitted.category,
    sort: submitted.sort as "newest",
    priceType: submitted.priceType ? (submitted.priceType as "free" | "paid") : undefined,
    verifiedHost: submitted.verifiedHost || undefined,
    page,
    limit: 20,
    enabled: mode === "discover",
  });

  const active = mode === "search" ? searchQuery : discoverQuery;

  const columns: ColumnDef<EventPrivate>[] = [
    {
      accessorKey: "title",
      header: "Event",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.title}</p>
          <p className="text-xs text-muted-foreground">{row.original.host.displayName}</p>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "location.city",
      header: "City",
      cell: ({ row }) => row.original.location?.city ?? "—",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => formatCurrency(row.original.price, row.original.currency),
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = keyword || city || category;
    if (term) saveRecentSearch(term);
    setRecent(getRecentSearches());
    setSubmitted({
      keyword,
      city,
      category,
      sort,
      priceType,
      verifiedHost,
    });
    setPage(1);
  };

  const hasQuery =
    submitted.keyword || submitted.city || submitted.category || submitted.priceType || submitted.verifiedHost;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Global Search"
        description="GET /events/search and GET /events discovery APIs. Admin cross-entity search not implemented."
      />

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("search")}
          className={`rounded-xl px-4 py-2 text-sm ${mode === "search" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
        >
          Keyword search
        </button>
        <button
          type="button"
          onClick={() => setMode("discover")}
          className={`rounded-xl px-4 py-2 text-sm ${mode === "discover" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
        >
          Discovery filters
        </button>
      </div>

      {recent.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          {recent.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => {
                setKeyword(term);
                setSubmitted({ ...submitted, keyword: term });
                setPage(1);
              }}
              className="rounded-full bg-muted px-3 py-1 text-xs hover:bg-muted/80"
            >
              {term}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSearch} className="glass grid gap-4 rounded-3xl p-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="keyword">Keyword</Label>
          <Input
            id="keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search events..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>
        {mode === "discover" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="sort">Sort</Label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-11 w-full rounded-[18px] border border-input bg-background/50 px-4 text-sm"
              >
                <option value="newest">Newest</option>
                <option value="trending">Trending</option>
                <option value="rating">Rating</option>
                <option value="price_asc">Price ↑</option>
                <option value="price_desc">Price ↓</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priceType">Price</Label>
              <select
                id="priceType"
                value={priceType}
                onChange={(e) => setPriceType(e.target.value)}
                className="h-11 w-full rounded-[18px] border border-input bg-background/50 px-4 text-sm"
              >
                <option value="">Any</option>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            <div className="flex items-center gap-2 pt-6">
              <Switch id="verified" checked={verifiedHost} onCheckedChange={setVerifiedHost} />
              <Label htmlFor="verified">Verified hosts only</Label>
            </div>
          </>
        )}
        <div className="flex items-end sm:col-span-2 lg:col-span-1">
          <button
            type="submit"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-[18px] bg-primary text-sm font-medium text-primary-foreground"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>
      </form>

      {active.isError ? (
        <ErrorState
          title="Search failed"
          message={getApiErrorMessage(active.error)}
          requestId={getRequestId(active.error)}
          onRetry={() => active.refetch()}
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={active.data?.items ?? []}
            isLoading={active.isLoading}
            emptyMessage={
              hasQuery ? "No events found." : "Enter search criteria to find events."
            }
          />
          <TablePagination meta={active.data?.meta} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
