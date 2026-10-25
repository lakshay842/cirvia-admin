"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { DataTable } from "@/components/data-display/data-table";
import { StatusBadge } from "@/components/data-display/status-badge";
import { TablePagination } from "@/components/data-display/table-pagination";
import { ErrorState } from "@/components/feedback/error-state";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  NOTIFICATION_TYPE_OPTIONS,
  useNotificationMutations,
  useNotificationPreferences,
  useNotificationsList,
} from "@/hooks/use-notifications";
import { getApiErrorMessage, getRequestId } from "@/services/api-client";
import { formatRelativeTime } from "@/lib/utils";
import type { NotificationItem, NotificationTypeFilter } from "@/types/notifications.types";

export function NotificationsPage() {
  const [page, setPage] = useState(1);
  const [type, setType] = useState<NotificationTypeFilter>("all");
  const [unreadOnly, setUnreadOnly] = useState(false);

  const { data, isLoading, isError, error, refetch } = useNotificationsList({
    page,
    limit: 20,
    type,
    unreadOnly: unreadOnly || undefined,
  });

  const { data: preferences } = useNotificationPreferences();
  const { markRead, markAllRead, remove, updatePreferences } = useNotificationMutations();

  const columns = useMemo<ColumnDef<NotificationItem>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Notification",
        cell: ({ row }) => (
          <div className="flex items-start gap-2">
            {!row.original.isRead && (
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
            )}
            <div>
              <p className="font-medium">{row.original.title}</p>
              <p className="text-xs text-muted-foreground">{row.original.message}</p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
          <StatusBadge status={row.original.type.toUpperCase()} />
        ),
      },
      {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => row.original.priority,
      },
      {
        accessorKey: "createdAt",
        header: "Time",
        cell: ({ row }) => formatRelativeTime(row.original.createdAt),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-1">
            {!row.original.isRead && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => markRead.mutate(row.original.id)}
                aria-label="Mark read"
              >
                <CheckCheck className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => remove.mutate(row.original.id)}
              aria-label="Delete"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ),
      },
    ],
    [markRead, remove],
  );

  if (isError) {
    return (
      <ErrorState
        title="Failed to load notifications"
        message={getApiErrorMessage(error)}
        requestId={getRequestId(error)}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notification Center"
        description="Your admin inbox via GET /notifications (authenticated user scope)."
        actions={
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {data?.unreadCount ?? 0} unread
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => markAllRead.mutate()}
              loading={markAllRead.isPending}
            >
              Mark all read
            </Button>
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-4">
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value as NotificationTypeFilter);
            setPage(1);
          }}
          className="h-10 rounded-[18px] border border-input bg-background/50 px-4 text-sm"
        >
          {NOTIFICATION_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <Switch id="unread" checked={unreadOnly} onCheckedChange={setUnreadOnly} />
          <Label htmlFor="unread">Unread only</Label>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        emptyMessage="No notifications yet."
      />

      <TablePagination meta={data?.meta} onPageChange={setPage} />

      {preferences && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Preferences</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(
              [
                ["email", "Email"],
                ["push", "Push"],
                ["booking", "Booking"],
                ["security", "Security"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between rounded-xl border border-border p-3">
                <Label>{label}</Label>
                <Switch
                  checked={preferences[key]}
                  onCheckedChange={(checked) =>
                    updatePreferences.mutate({ [key]: checked })
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
