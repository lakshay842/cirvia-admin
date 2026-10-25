"use client";

import Link from "next/link";
import { formatRelativeTime } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotificationMutations, useNotificationsList } from "@/hooks/use-notifications";
import { ROUTES } from "@/constants";

interface NotificationCenterProps {
  children: React.ReactNode;
}

export function NotificationCenter({ children }: NotificationCenterProps) {
  const { data, isLoading } = useNotificationsList({ page: 1, limit: 10 });
  const { markRead, markAllRead } = useNotificationMutations();

  const notifications = data?.items ?? [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <DropdownMenuLabel className="p-0">
            Notifications {data?.unreadCount ? `(${data.unreadCount})` : ""}
          </DropdownMenuLabel>
          <Button variant="ghost" size="sm" onClick={() => markAllRead.mutate()}>
            Mark all read
          </Button>
        </div>
        <ScrollArea className="h-[360px]">
          {isLoading ? (
            <div className="p-6 text-center text-sm text-muted-foreground">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex cursor-pointer flex-col items-start gap-1 rounded-none border-b border-border/50 px-4 py-3"
                onClick={() => {
                  if (!notification.isRead) markRead.mutate(notification.id);
                }}
              >
                <div className="flex w-full items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                  </div>
                  {!notification.isRead && (
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(notification.createdAt)}
                </span>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
        <DropdownMenuSeparator className="m-0" />
        <div className="p-2">
          <Button variant="ghost" className="w-full" asChild>
            <Link href={ROUTES.notifications}>View all notifications</Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function useUnreadNotificationCount() {
  const { data } = useNotificationsList({ page: 1, limit: 1 });
  return data?.unreadCount ?? 0;
}
