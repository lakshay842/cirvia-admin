"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Ban, Eye, RotateCcw, Trash2, UserX } from "lucide-react";
import { DataTable } from "@/components/data-display/data-table";
import { StatusBadge } from "@/components/data-display/status-badge";
import { TableFilters } from "@/components/data-display/table-filters";
import { TablePagination } from "@/components/data-display/table-pagination";
import { ErrorState } from "@/components/feedback/error-state";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  USER_STATUS_OPTIONS,
  useUserDetail,
  useUserMutations,
  useUsersList,
} from "@/hooks/use-users";
import { getApiErrorMessage, getRequestId } from "@/services/api-client";
import { formatRelativeTime } from "@/lib/utils";
import type { AccountStatus, AdminUser } from "@/types/users.types";

export function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<AccountStatus | "">("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading, isError, error, refetch } = useUsersList({
    page,
    limit: 20,
    status: status || undefined,
    search: search.trim() || undefined,
  });

  const { data: selectedUser } = useUserDetail(selectedId);
  const { suspend, ban, restore, remove } = useUserMutations();

  const columns = useMemo<ColumnDef<AdminUser>[]>(
    () => [
      {
        id: "user",
        header: "User",
        cell: ({ row }) => {
          const profile = row.original.profile;
          const name = profile
            ? `${profile.firstName} ${profile.lastName}`.trim()
            : row.original.email;
          return (
            <div>
              <p className="font-medium">{name || "—"}</p>
              <p className="text-xs text-muted-foreground">
                {profile?.username ? `@${profile.username}` : row.original.email}
              </p>
            </div>
          );
        },
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <div>
            <p className="text-sm">{row.original.email}</p>
            <p className="text-xs text-muted-foreground">
              {row.original.emailVerified ? "Verified" : "Unverified"}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "accountStatus",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.accountStatus} />,
      },
      {
        accessorKey: "roles",
        header: "Roles",
        cell: ({ row }) => row.original.roles.join(", ") || "—",
      },
      {
        id: "city",
        header: "City",
        cell: ({ row }) => row.original.profile?.city ?? "—",
      },
      {
        accessorKey: "createdAt",
        header: "Joined",
        cell: ({ row }) => formatRelativeTime(row.original.createdAt),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const user = row.original;
          const isGone = user.accountStatus === "DELETED" || user.isDeleted;
          const isSuspended = user.accountStatus === "SUSPENDED";
          return (
            <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" onClick={() => setSelectedId(user.id)}>
                <Eye className="h-4 w-4" />
              </Button>
              {!isGone && !isSuspended && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => suspend.mutate(user.id)}
                  disabled={suspend.isPending}
                  title="Suspend"
                >
                  <UserX className="h-4 w-4 text-warning" />
                </Button>
              )}
              {!isGone && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => ban.mutate(user.id)}
                  disabled={ban.isPending}
                  title="Ban"
                >
                  <Ban className="h-4 w-4 text-destructive" />
                </Button>
              )}
              {(isGone || isSuspended) && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => restore.mutate(user.id)}
                  disabled={restore.isPending}
                  title="Restore"
                >
                  <RotateCcw className="h-4 w-4 text-success" />
                </Button>
              )}
              {!isGone && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => remove.mutate(user.id)}
                  disabled={remove.isPending}
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    [suspend, ban, restore, remove],
  );

  if (isError) {
    return (
      <ErrorState
        title="Failed to load users"
        message={getApiErrorMessage(error)}
        requestId={getRequestId(error)}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Moderation"
        description="Suspend, ban, and manage platform users."
      />

      <TableFilters
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        searchPlaceholder="Search by name, email, username..."
        status={status}
        onStatusChange={(v) => {
          setStatus(v as AccountStatus | "");
          setPage(1);
        }}
        statusOptions={USER_STATUS_OPTIONS}
      />

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        emptyMessage="No users found for the selected filters."
        onRowClick={(row) => setSelectedId(row.id)}
      />

      <TablePagination meta={data?.meta} onPageChange={setPage} />

      <Dialog open={!!selectedId} onOpenChange={(open) => !open && setSelectedId(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.profile
                ? `${selectedUser.profile.firstName} ${selectedUser.profile.lastName}`
                : "User details"}
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 text-sm">
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={selectedUser.accountStatus} />
                <StatusBadge
                  status={selectedUser.emailVerified ? "VERIFIED" : "PENDING"}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedUser.phone ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Username</p>
                  <p className="font-medium">
                    {selectedUser.profile?.username
                      ? `@${selectedUser.profile.username}`
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">City</p>
                  <p className="font-medium">{selectedUser.profile?.city ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Roles</p>
                  <p className="font-medium">{selectedUser.roles.join(", ") || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Trust score</p>
                  <p className="font-medium">{selectedUser.profile?.trustScore ?? "—"}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Joined {formatRelativeTime(selectedUser.createdAt)}
                {selectedUser.lastLogin
                  ? ` · Last login ${formatRelativeTime(selectedUser.lastLogin)}`
                  : ""}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {selectedUser.accountStatus === "ACTIVE" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => suspend.mutate(selectedUser.id)}
                    loading={suspend.isPending}
                  >
                    Suspend
                  </Button>
                )}
                {selectedUser.accountStatus !== "DELETED" && !selectedUser.isDeleted && (
                  <>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => ban.mutate(selectedUser.id)}
                      loading={ban.isPending}
                    >
                      Ban
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => remove.mutate(selectedUser.id)}
                      loading={remove.isPending}
                    >
                      Delete
                    </Button>
                  </>
                )}
                {(selectedUser.accountStatus === "SUSPENDED" ||
                  selectedUser.accountStatus === "DELETED" ||
                  selectedUser.isDeleted) && (
                  <Button
                    size="sm"
                    onClick={() => restore.mutate(selectedUser.id)}
                    loading={restore.isPending}
                  >
                    Restore
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
