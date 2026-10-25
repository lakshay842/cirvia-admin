# Admin Dashboard — Phase 4 Report

**Date:** 2025-06-25  
**Scope:** Review Moderation, Notification Center, Booking Management, Refund Management, Wallet Management, Revenue Dashboard, Reports Dashboard, User Moderation, Search Improvements, Audit Logs  
**Status:** ✅ Complete — awaiting approval

---

## Summary

Phase 4 delivers moderation, operations, and analytics surfaces for platform admins. **Fully wired to backend:** Notification Center (inbox + navbar), Refund Management (via payments API), Wallet/Withdrawals (Phase 3 payouts), Search Improvements (keyword + discovery). **Partially wired:** Revenue Dashboard (mock analytics + live captured payments). **Placeholder pages** (backend not implemented): Review Moderation, Reports Dashboard, User Moderation, Booking Management, Audit Logs.

Per requirement **"Connect ONLY implemented backend APIs"**, unimplemented modules use `BackendPending` with exact missing endpoint paths.

---

## Quality Gate

| Check | Result |
|-------|--------|
| `npm run lint` | ✅ Pass |
| `npm run typecheck` | ✅ Pass |
| `npm run build` | ✅ Pass (24 routes) |

---

## Module Status

| Module | UI | Backend API | Implementation |
|--------|-----|-------------|----------------|
| **Review Moderation** | Placeholder | ❌ | `BackendPending` — no `/admin/reviews` |
| **Notification Center** | ✅ Full | ✅ | Inbox + navbar dropdown → `/notifications` |
| **Booking Management** | Placeholder | ❌ admin | `BackendPending` — no `/admin/bookings` |
| **Refund Management** | ✅ Full | ✅ | Refund history via `/admin/payments` (status filter) |
| **Wallet Management** | ✅ Payouts | ✅ | Withdrawal queue → `/admin/payouts` (Phase 3) |
| **Revenue Dashboard** | Partial | ❌ analytics | Mock charts + recent captured payments |
| **Reports Dashboard** | Placeholder | ❌ | `BackendPending` — no `/admin/reports` |
| **User Moderation** | Placeholder | ❌ | `BackendPending` — no `/admin/users` |
| **Search Improvements** | ✅ Full | ✅ | Keyword search + event discovery filters |
| **Audit Logs** | Placeholder | ❌ read | `BackendPending` — no `GET /admin/audit-logs` |

---

## API Integration (Connected)

### Notifications — authenticated user scope

| Action | Method | Endpoint |
|--------|--------|----------|
| List | GET | `/api/v1/notifications?page&limit&type&unreadOnly` |
| Detail | GET | `/api/v1/notifications/:notificationId` |
| Mark read | PATCH | `/api/v1/notifications/:notificationId/read` |
| Mark all read | PATCH | `/api/v1/notifications/read-all` |
| Delete | DELETE | `/api/v1/notifications/:notificationId` |
| Get preferences | GET | `/api/v1/notifications/preferences` |
| Update preferences | PATCH | `/api/v1/notifications/preferences` |

Features: full inbox page (`/notifications`) with type/unread filters, mark read, delete, preference toggles; navbar `NotificationCenter` dropdown with unread badge (`useUnreadNotificationCount`); mock notification store removed from `app-providers`.

### Refund Management — `payments.read`

| Action | Method | Endpoint |
|--------|--------|----------|
| List refunds | GET | `/api/v1/admin/payments?status=refunded\|partially_refunded` |
| Detail | GET | `/api/v1/admin/payments/:paymentId` |

Features: dedicated `/refunds` page filtering payments by refund status, detail dialog with refund metadata, client search, pagination.

> New refunds are initiated from `/payments` (Phase 3 `POST .../refund`). This page is read-only oversight of processed refunds.

### Wallet / Withdrawals — `payments.read`, `payments.refund` (Phase 3)

| Action | Method | Endpoint |
|--------|--------|----------|
| List payouts | GET | `/api/v1/admin/payouts?page&limit&status` |
| Approve | PATCH | `/api/v1/admin/payouts/:payoutId/approve` |
| Reject | PATCH | `/api/v1/admin/payouts/:payoutId/reject` |

Features: unchanged from Phase 3 at `/wallet` — payout queue, approve/reject with reason dialog. Platform wallet overview remains placeholder.

### Search Improvements — public API

| Action | Method | Endpoint |
|--------|--------|----------|
| Keyword search | GET | `/api/v1/events/search?keyword&city&category&page&limit` |
| Event discovery | GET | `/api/v1/events?search&city&category&sort&priceType&verifiedHost&page&limit` |

Features: dual mode on `/search` — **Search** (keyword API) and **Discover** (filtered listing); sort, price type, verified-host filters; recent searches persisted in `localStorage`; recent-search chips for quick re-run.

### Revenue Dashboard — partial

| Endpoint | Status |
|----------|--------|
| `GET /admin/statistics` | Not implemented — mock fallback via `useAnalytics` |
| `GET /admin/analytics/revenue` | Not implemented |
| `GET /admin/payments?status=captured` | ✅ Recent captured payments table |

Features: period selector (daily/weekly/monthly/yearly), revenue stat cards and charts from mock data, warning banner when analytics APIs unavailable, live payment table from admin payments API.

---

## New Routes (Phase 4)

| Route | Page |
|-------|------|
| `/refunds` | Refund history and detail |
| `/revenue` | Revenue dashboard (mock + live payments) |
| `/reviews` | Review moderation placeholder |
| `/reports` | Reports moderation placeholder |

Existing routes updated:

| Route | Change |
|-------|--------|
| `/notifications` | Full inbox wired (was placeholder) |
| `/users` | Renamed to "User Moderation" |
| `/bookings` | Renamed to "Booking Management" |
| `/search` | Discovery mode + recent searches |
| `/wallet` | Unchanged — payouts wired (Phase 3) |
| `/audit-logs` | Updated pending description |

---

## New / Updated Files

### New

| File | Purpose |
|------|---------|
| `src/types/notifications.types.ts` | Notification item, list query, preferences types |
| `src/services/notifications.api.ts` | Notifications REST client |
| `src/hooks/use-notifications.ts` | List, mutations, preferences hooks |
| `src/features/notifications/notifications-page.tsx` | Full notification inbox |
| `src/features/refunds/refunds-page.tsx` | Refund oversight table |
| `src/features/revenue/revenue-dashboard-page.tsx` | Revenue stats + payments |
| `src/features/reviews/reviews-page.tsx` | Review moderation placeholder |
| `src/features/reports/reports-page.tsx` | Reports moderation placeholder |
| `src/app/(dashboard)/refunds/page.tsx` | Route |
| `src/app/(dashboard)/revenue/page.tsx` | Route |
| `src/app/(dashboard)/reviews/page.tsx` | Route |
| `src/app/(dashboard)/reports/page.tsx` | Route |

### Updated

| File | Change |
|------|--------|
| `src/components/navigation/notification-center.tsx` | Wired to real API |
| `src/components/layout/top-navbar.tsx` | Unread count from API |
| `src/providers/app-providers.tsx` | Removed mock notification bootstrap |
| `src/services/search.api.ts` | Added `discover()` → `GET /events` |
| `src/hooks/use-search.ts` | `useEventDiscovery`, recent search helpers |
| `src/features/search/search-page.tsx` | Dual mode, filters, recent searches |
| `src/constants/navigation.ts` | Phase 4 nav items, `ACTIVE_NAV` = phases 1–4 |
| `src/constants/index.ts` | `ROUTES.refunds`, `ROUTES.revenue`, `reports.moderate` |
| `src/components/navigation/command-palette.tsx` | Refunds, Revenue, Reviews, Reports |
| `src/components/layout/sidebar.tsx` | "Phase 4 Active" footer |

---

## Placeholder Rationale

| Module | Missing Backend |
|--------|-----------------|
| Review Moderation | `GET /admin/reviews`, `PATCH /admin/reviews/:id/hide` |
| Reports Dashboard | `GET /admin/reports`, resolve/dismiss actions |
| User Moderation | `GET /admin/users`, suspend/ban/delete |
| Booking Management | `GET /admin/bookings` (host `/hosts/bookings` exists) |
| Audit Logs | `GET /admin/audit-logs` (writes exist, no read API) |
| Revenue (charts) | `GET /admin/statistics`, `GET /admin/analytics/*` |
| Wallet overview | Platform wallet admin endpoint |

Each placeholder documents seeded permissions, related host/user-scoped alternatives, and notes that DataTable infrastructure is ready for future wiring.

---

## Navigation (Phase 4 Active)

Sidebar and command palette include all phases 1–4 routes:

- **Phase 4 new:** Revenue, Reviews, Refunds, Reports, Support (placeholder nav entry)
- **Phase 4 wired:** Notifications (upgraded), Search (improved), Wallet (existing)

---

## Deferred to Phase 5+

- [ ] Review moderation (`/admin/reviews`)
- [ ] Reports moderation (`/admin/reports`)
- [ ] User moderation (`/admin/users`)
- [ ] Admin booking monitoring (`/admin/bookings`)
- [ ] Audit log read API + export (`GET /admin/audit-logs`, `GET /admin/export`)
- [ ] Admin analytics (`/admin/statistics`, `/admin/analytics/*`)
- [ ] Platform wallet admin overview
- [ ] RBAC nav filtering via `usePermission`
- [ ] Admin notification broadcast (no admin-scoped inbox API)

---

## How to Test

```bash
# Terminal 1 — backend
cd backend-api && npm run dev

# Terminal 2 — admin dashboard
cd admin-dashboard && npm run dev
```

Login as ADMIN/SUPER_ADMIN. Set `NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1` in `.env.local`.

| Page | What to verify |
|------|----------------|
| `/notifications` | List, mark read, delete, preferences |
| Navbar bell | Dropdown preview, unread badge |
| `/refunds` | Refunded/partially_refunded payments |
| `/revenue` | Mock charts + captured payments table |
| `/wallet` | Payout approve/reject |
| `/search` | Keyword + Discover modes, recent searches |
| `/reviews`, `/reports`, `/users`, `/bookings`, `/audit-logs` | `BackendPending` placeholders |

---

**Awaiting approval to proceed with Admin Dashboard Phase 5.**
