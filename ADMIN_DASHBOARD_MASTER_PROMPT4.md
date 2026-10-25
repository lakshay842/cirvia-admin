# ADMIN_DASHBOARD_MASTER_PROMPT.md

# Part 4

## Authentication

## RBAC

## Monitoring

## Security

## Testing

## DevOps

## Production Deployment

Version

1.0

---

# AUTHENTICATION

Build enterprise authentication.

Support

JWT Access Token

Refresh Token

Session Validation

Token Rotation

Automatic Logout

Remember Me

Multiple Devices

Trusted Devices

---

# AUTH FLOW

Admin Login

↓

Validate Credentials

↓

Check Role

↓

Check Permissions

↓

Generate JWT

↓

Generate Refresh Token

↓

Load Dashboard

---

# SESSION MANAGEMENT

Track

Current Session

Previous Sessions

IP Address

Country

Browser

Operating System

Last Active

Support

Logout Current Device

Logout All Devices

Force Logout

---

# ROLE BASED ACCESS CONTROL

Roles

SUPER_ADMIN

ADMIN

FINANCE_ADMIN

SUPPORT_ADMIN

MODERATOR

READ_ONLY_ADMIN

Never hardcode permissions.

Menu visibility must depend on permissions.

Route protection must depend on permissions.

API requests must include JWT.

---

# PERMISSIONS

Examples

users.view

users.update

users.delete

events.publish

events.feature

payments.refund

wallet.approve

reports.resolve

analytics.export

cms.update

settings.update

feature_flags.update

audit_logs.view

---

# ROUTE GUARDS

Protect

Dashboard

Users

Hosts

Events

Bookings

Payments

Wallet

Analytics

Settings

CMS

Audit Logs

Support

Redirect unauthorized users.

Show friendly access denied page.

---

# MENU PERMISSIONS

Sidebar items appear only if the admin has permission.

Hide unauthorized modules completely.

Support nested permissions.

---

# SECURITY

HTTPS Only

CSP Headers

Secure Cookies (if cookie auth)

JWT Validation

Input Sanitization

Escape HTML

CSRF Ready

XSS Protection

Clickjacking Protection

File Upload Validation

Rate Limiting

Audit Logging

Session Expiry

---

# FILE SECURITY

Private uploads

Signed URLs

Virus Scan Hook

Image Validation

PDF Validation

Maximum Size Enforcement

Reject executable files.

---

# MONITORING

Dashboard should display

API Status

Database Status

Redis Status

Queue Status

Email Service

Payment Gateway

AWS S3

Storage Usage

CPU

RAM

Disk

Uptime

Version

Build Number

---

# HEALTH DASHBOARD

Cards

Healthy

Warning

Critical

Auto Refresh

Manual Refresh

Historical Status

Incident Timeline

---

# SYSTEM LOGS

View

Application Logs

API Logs

Error Logs

Queue Logs

Payment Logs

Search

Filter

Export

---

# AUDIT LOGS

Track

Login

Logout

Permission Changes

Refunds

KYC Approvals

Event Approvals

CMS Updates

Feature Flag Changes

Settings Changes

Never allow editing or deletion.

---

# FEATURE FLAGS

Enable

Disable

Environment

Percentage Rollout

Country Rollout (Future)

Beta Users

Emergency Kill Switch

---

# SETTINGS

Platform Fee

Refund Rules

Booking Rules

Trust Score Rules

Email

Storage

Payments

Security

Branding

Maintenance Mode

---

# MAINTENANCE MODE

Enable

Disable

Whitelist Admins

Custom Maintenance Message

Countdown (Optional)

---

# BACKUPS

Display

Last Backup

Backup Status

Backup Size

Restore History

Future Integration

---

# TESTING

Use

Vitest

Playwright

React Testing Library

Coverage Target

90%+

Test

Pages

Components

Stores

Hooks

Tables

Charts

Forms

Permissions

API Integration

Error States

Loading States

Accessibility

---

# ACCESSIBILITY

WCAG AA

Keyboard Navigation

Screen Readers

Focus Management

Color Contrast

Reduced Motion

---

# PERFORMANCE

Code Splitting

Lazy Loading

Dynamic Imports

Image Optimization

Virtual Tables

Memoization

Bundle Optimization

Prefetch Routes

Streaming (Future)

---

# ERROR HANDLING

Global Error Boundary

API Retry

Offline Detection

Reconnect

Fallback Pages

Support Link

Request ID

---

# DEVOPS

Dockerfile

Docker Compose

NGINX

Environment Variables

GitHub Actions

Build Optimization

Static Analysis

ESLint

Prettier

Husky

---

# DEPLOYMENT

Support

Vercel

Docker

AWS

DigitalOcean

Render

Railway

Environment

Development

Staging

Production

---

# CI/CD PIPELINE

Install Dependencies

↓

Lint

↓

Type Check

↓

Unit Tests

↓

Build

↓

E2E Tests

↓

Deploy

↓

Health Check

↓

Notify Team

---

# OBSERVABILITY

Integrate

Sentry

OpenTelemetry

Prometheus (Future)

Grafana (Future)

Track

Errors

Performance

User Actions

API Latency

Memory

CPU

Network

---

# NOTIFICATIONS

System Alerts

Deployment Success

Deployment Failure

Payment Gateway Issues

Redis Down

Database Down

High CPU

Storage Full

Security Alerts

All should appear in dashboard.

---

# DOCUMENTATION

Generate

Component Docs

API Integration Guide

Environment Guide

Deployment Guide

Permission Matrix

Testing Guide

---

# FINAL ENGINEERING RULES

Never duplicate components.

Never duplicate API logic.

Never hardcode permissions.

Never hardcode routes.

Always use TypeScript.

Always use reusable components.

Always use design tokens.

Always optimize bundle size.

Always follow accessibility standards.

Always support loading, empty, error and success states.

Always keep business logic outside UI components.

---

# SUCCESS CRITERIA

The Admin Dashboard must be able to manage the complete Cirvia platform:

* Users
* Hosts
* KYC
* Events
* Bookings
* Payments
* Wallets
* Reviews
* Reports
* Support
* CMS
* Analytics
* Feature Flags
* System Settings
* Monitoring

It should feel like a premium SaaS product, remain maintainable as the platform grows, and support millions of users without requiring a redesign.
