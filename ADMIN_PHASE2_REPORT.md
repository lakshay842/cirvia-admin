# Admin Dashboard — Phase 2 Report

**Date:** 2025-06-25  
**Scope:** Users, Hosts, KYC Queue, Events — tables, filters, search, pagination, CRUD actions  
**Status:** ✅ Complete — awaiting approval

---

## Summary

Phase 2 adds moderation modules to the admin dashboard with a reusable **DataTable** foundation (TanStack Table), server-side pagination, status filters, client-side search on fetched pages, detail dialogs, and mutation actions wired to **completed backend APIs only**.

---

## Quality Gate

| Check | Result |
|-------|--------|
| `npm run lint` | ✅ Pass |
| `npm run typecheck` | ✅ Pass |
| `npm run build` | ✅ Pass |

---

## Module Status

| Module | UI | Backend API | Notes |
|--------|-----|-------------|-------|
| **Users** | Placeholder page | ❌ Not implemented | `GET /admin/users` etc. exist only in API_CONTRACT5 |
| **Hosts** | ✅ Full | ✅ 5 endpoints | List, detail, approve, reject, suspend |
| **KYC Queue** | ✅ Full | ✅ 7 endpoints | List, detail, approve, reject, re-upload, notes |
| **Events** | ✅ Full | ✅ 8 endpoints | Pending queue, detail, approve, reject, feature, suspend, restore |

---

## Reusable Components (Phase 2)

| Component | Path | Features |
|-----------|------|----------|
| `DataTable` | `components/data-display/data-table.tsx` | TanStack Table, sorting, row click, loading skeleton |
| `TableFilters` | `components/data-display/table-filters.tsx` | Search input, status select, clear filters |
| `TablePagination` | `components/data-display/table-pagination.tsx` | Server pagination from API `meta` |
| `StatusBadge` | `components/data-display/status-badge.tsx` | Themed status pills |
| `ReasonDialog` | `components/modals/reason-dialog.tsx` | Reject/re-upload reason capture (3–500 chars) |
| `PageHeader` | `components/layout/page-header.tsx` | Title, description, actions slot |

---

## API Integration

### Hosts (`hosts.verify` permission)

| Action | Method | Endpoint |
|--------|--------|----------|
| List | GET | `/api/v1/admin/hosts?page&limit&status` |
| Detail | GET | `/api/v1/admin/hosts/:hostId` |
| Approve | PATCH | `/api/v1/admin/hosts/:hostId/approve` |
| Reject | PATCH | `/api/v1/admin/hosts/:hostId/reject` |
| Suspend | PATCH | `/api/v1/admin/hosts/:hostId/suspend` |

### KYC / Verification (`verification.review` permission)

| Action | Method | Endpoint |
|--------|--------|----------|
| List | GET | `/api/v1/admin/verifications?page&limit&status` |
| Detail | GET | `/api/v1/admin/verifications/:id` |
| Timeline | GET | `/api/v1/admin/verifications/:id/timeline` |
| Approve | PATCH | `/api/v1/admin/verifications/:id/approve` |
| Reject | PATCH | `/api/v1/admin/verifications/:id/reject` |
| Request re-upload | PATCH | `/api/v1/admin/verifications/:id/request-reupload` |
| Add note | POST | `/api/v1/admin/verifications/:id/notes` |

### Events (`events.moderate` permission)

| Action | Method | Endpoint |
|--------|--------|----------|
| Pending list | GET | `/api/v1/admin/events/pending?page&limit` |
| Detail | GET | `/api/v1/admin/events/:eventId` |
| Approve | PATCH | `/api/v1/admin/events/:eventId/approve` |
| Reject | PATCH | `/api/v1/admin/events/:eventId/reject` |
| Feature | PATCH | `/api/v1/admin/events/:eventId/feature` |
| Unfeature | PATCH | `/api/v1/admin/events/:eventId/unfeature` |
| Suspend | PATCH | `/api/v1/admin/events/:eventId/suspend` |
| Restore | PATCH | `/api/v1/admin/events/:eventId/restore` |

### Users — **not connected**

Backend has no `/admin/users` routes. UI shows an explanatory placeholder; DataTable infrastructure is ready for Phase 2b when backend ships.

---

## Routes Added

| Route | Page |
|-------|------|
| `/users` | Users placeholder (API pending) |
| `/hosts` | Host moderation table + detail dialog |
| `/verification` | KYC queue + document review dialog |
| `/events` | Pending events moderation queue |

Sidebar updated to show Phase 1 + Phase 2 navigation items.

---

## Features Per Module

### Hosts
- Server pagination (`page`, `limit`)
- Status filter (`PENDING`, `VERIFIED`, `REJECTED`, `SUSPENDED`, `INACTIVE`, `DELETED`)
- Client-side search (name, slug, city, userId) on current page
- Row actions: view, approve, reject, suspend
- Detail dialog with profile stats and action buttons

### KYC Queue
- Server pagination + status filter (8 statuses)
- Client-side search (email, username, document type)
- Document image preview (signed URLs from API)
- Internal notes (read + add via POST)
- Approve, reject, request re-upload with reason dialog

### Events
- Server pagination on pending queue
- Client-side search (title, host, city)
- Approve/reject pending events
- Feature/unfeature, suspend/restore on detail view

### Users
- Placeholder explaining backend gap
- No mock data — honest empty state per "connect only completed APIs"

---

## Architecture

```
API Service (hosts.api.ts, verification.api.ts, events.api.ts)
       ↓
TanStack Query Hooks (use-hosts.ts, use-verifications.ts, use-events.ts)
       ↓
Feature Pages (hosts-page.tsx, verification-page.tsx, events-page.tsx)
       ↓
Reusable DataTable + Filters + Pagination
```

Permissions aligned with backend seed:
- `hosts.verify`, `verification.review`, `events.moderate`, `users.read`

---

## Deferred to Phase 3+

- Users module (awaiting backend `/admin/users` implementation)
- Bookings, Payments, Wallet, Reports, Settings pages
- Server-side search (backend does not expose search params yet)
- RBAC menu hiding via `usePermission` (hook ready, not enforced on nav)
- Bulk actions, CSV export
- Right drawer pattern for detail views
- Real-time queue updates (WebSocket/SSE)

---

## How to Test

1. Start backend: `cd backend-api && npm run dev`
2. Start admin: `cd admin-dashboard && npm run dev`
3. Login with a user that has ADMIN/SUPER_ADMIN role
4. Navigate to Hosts, Verification, or Events
5. Ensure `NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1` in `.env.local`

---

**Awaiting approval to proceed with Admin Dashboard Phase 3.**
