# ADMIN_DASHBOARD_MASTER_PROMPT.md

# Part 3

## API Integration

## State Management

## Real-Time Updates

## Advanced Tables

## Charts

## File Management

## Performance

Version

1.0

---

# API LAYER

Use Axios.

Create a centralized API client.

Features

JWT Authentication

Refresh Token

Retry Logic

Timeout

Request Interceptors

Response Interceptors

Automatic Logout

Automatic Token Refresh

Request ID

Error Mapping

---

# API STRUCTURE

Create

api/

auth.api.ts

users.api.ts

hosts.api.ts

events.api.ts

bookings.api.ts

payments.api.ts

wallet.api.ts

reviews.api.ts

reports.api.ts

support.api.ts

analytics.api.ts

settings.api.ts

cms.api.ts

notifications.api.ts

verification.api.ts

featureFlags.api.ts

---

# API RULES

Never call Axios directly inside components.

Always use service functions.

Separate

API

↓

Hooks

↓

Components

---

# STATE MANAGEMENT

Use Zustand.

Stores

Auth Store

User Store

Theme Store

Notification Store

Dashboard Store

Analytics Store

Settings Store

Feature Flag Store

Command Palette Store

Search Store

Sidebar Store

Modal Store

---

# DATA FETCHING

Use

TanStack Query

Support

Caching

Retry

Background Refetch

Optimistic Updates

Pagination

Infinite Scroll

Mutation

Invalidate Queries

Prefetch

---

# REAL-TIME SYSTEM

Support

WebSocket

or

Server Sent Events (SSE)

Live Updates

Bookings

Payments

Reports

Support Tickets

Verification Queue

Notifications

Dashboard Metrics

---

# LIVE DASHBOARD

Update Automatically

Revenue

Bookings

Users

Hosts

Pending Reports

Queue Status

Server Health

No manual refresh required.

---

# TABLE COMPONENT

Create one reusable DataTable component.

Features

Server Pagination

Column Sorting

Column Filtering

Column Visibility

Column Resize

Sticky Header

Row Selection

Bulk Actions

Expandable Rows

Pinned Columns

CSV Export

Excel Export

PDF Export

Print

---

# FILTER COMPONENTS

Support

Date Range

City

Category

Status

Role

Host

Payment Status

Verification Status

Price

Rating

Custom Filters

---

# SEARCH

Debounced Search

300ms

Global Search

Entity Search

Instant Results

Keyboard Navigation

Recent Searches

Saved Filters

---

# CHARTS

Use Recharts.

Components

Line Chart

Bar Chart

Area Chart

Pie Chart

Donut Chart

Radar Chart

Heatmap (Future)

Timeline

Sparkline

KPI Cards

---

# ANALYTICS

Revenue

Bookings

Users

Hosts

Cities

Categories

Trust Score

Growth

Conversion Rate

Retention

Cancellation Rate

No Show Rate

---

# EXPORT

Support

CSV

Excel

PDF

Large exports should run in background.

Notify admin when export is ready.

---

# FILE MANAGER

Upload

Images

PDF

CSV

Excel

Drag & Drop

Preview

Rename

Delete

Download

Progress Bar

Validation

---

# IMAGE VIEWER

Zoom

Rotate

Fullscreen

Compare Images

Download

Private Signed URL

Used for

KYC

Event Media

CMS

---

# NOTIFICATIONS

Toast

Persistent Panel

Unread Count

Filters

Mark Read

Mark All Read

Delete

Real-Time Sync

---

# COMMAND PALETTE

Support

Search Pages

Search Users

Search Events

Search Hosts

Quick Navigation

Create Event

Create Banner

Open Analytics

Open Settings

Keyboard Shortcuts

---

# SHORTCUTS

CTRL + K

Search

CTRL + /

Keyboard Help

CTRL + S

Save

ESC

Close Modal

CTRL + SHIFT + F

Global Filters

---

# PERFORMANCE

Code Splitting

Lazy Loading

Dynamic Imports

Image Optimization

Memoization

Virtual Lists

React.memo

Suspense

Streaming

Prefetch Routes

---

# LOADING EXPERIENCE

Skeleton Cards

Skeleton Tables

Skeleton Charts

Progress Indicators

Optimistic UI

Shimmer Effects

---

# ERROR HANDLING

Global Error Boundary

API Error Handler

Retry

Offline Detection

Reconnect

Fallback UI

Request ID Display

---

# CACHE STRATEGY

TanStack Query

Redis-backed APIs

Optimistic Updates

Background Refresh

Stale While Revalidate

---

# ACCESSIBILITY

ARIA Labels

Keyboard Navigation

Screen Reader Support

Visible Focus

Reduced Motion

High Contrast

---

# INTERNATIONALIZATION

Future Ready

English

Hindi

Multiple Currencies

Multiple Timezones

Multiple Date Formats

RTL Ready

---

# SECURITY

Never expose secrets.

Never store tokens in localStorage.

Prefer secure HttpOnly cookies if backend supports them.

Sanitize HTML.

Escape dynamic content.

Validate uploads.

Respect RBAC on UI and API.

---

# OBSERVABILITY

Track

API Latency

Slow Queries

Failed Requests

User Actions

Page Views

Dashboard Usage

Feature Usage

Export Jobs

---

# TESTING

Unit Tests

Component Tests

Integration Tests

E2E Tests

Accessibility Tests

Visual Regression Tests

---

# FINAL RULES

Every dashboard feature must:

Be reusable.

Be type-safe.

Be responsive.

Be accessible.

Be API-driven.

Support loading, empty, error and success states.

Never duplicate business logic.

Always follow the Cirvia Design System.

Generate enterprise-grade components only.
