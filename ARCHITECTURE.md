# Architecture

This document describes the key architectural decisions in Vedarogya and the reasoning behind them.

---

## Overview

Vedarogya is a monorepo containing a **React Native mobile app** (Expo) and a **NestJS REST API** (backend). They are separate workspace packages managed by pnpm.

```
Client (React Native / Expo)
        │
        │  HTTPS + JWT
        ▼
   NestJS API (Fastify)
        │
        │  TypeORM
        ▼
   PostgreSQL
```

---

## Mobile App

### Routing — expo-router v6

File-based routing via expo-router. Route groups (`(auth)`, `(tabs)`, `(patient)`) keep screen files organised by access level without affecting the URL structure.

**Decision:** expo-router over React Navigation directly — gives us URL-based deep linking and layouts out of the box, which is essential for navigating into patient record screens from push notifications.

### Styling — NativeWind v4

NativeWind maps Tailwind utility classes onto React Native `StyleSheet` values at build time. Layout and spacing use `className`; dynamic values (colours computed at runtime, animations) use inline `style`.

**Decision:** NativeWind over StyleSheet-only — consistent design tokens, rapid iteration, and no style name collisions across a large component tree.

### Component philosophy

Components are **small and single-responsibility**. If a file exceeds ~200 lines, it is split.

```
components/
  track/
    statistics/           ← each view is its own file
      day-macros.tsx
      week-chart.tsx
      month-chart.tsx
      period-dropdown.tsx
    eating-guide.tsx
    fab/
      log-fab.tsx
    log-entry/
      log-entry-sheet.tsx
```

Named exports only (no default exports) — makes refactoring and tree-shaking predictable.

### Charts — react-native-svg

All charts are drawn with `react-native-svg` primitives:

- **Week chart**: stacked `Rect` elements with gradient fills. Chart width measured at runtime via `onLayout` so bars never overflow the card on any screen size.
- **Month chart**: smooth bezier curves using Catmull-Rom → cubic bezier conversion (`smoothPath()`), with gradient area fills and end-point glow dots.
- **Day view**: native `View` layout (no SVG) for the macro 2×2 grid and water banner.

**Decision:** No third-party chart library — they carry heavy dependencies, poor customisation, and inconsistent RN compatibility. Hand-rolled SVG gives full pixel control with a tiny bundle footprint.

### Dynamic Island / notch handling

Every full-screen `ScrollView` has an absolute `View` (height = `insets.top`, `zIndex: 100`, `backgroundColor: #FFFFFF`) pinned at the top. This prevents content from bleeding behind the Dynamic Island during scroll without wrapping the entire screen in a `SafeAreaView` (which would clip the scroll content).

### State management

No global state library. Each screen owns its state via `useState`/`useReducer`. Data fetching is co-located with the screen that needs it. This is intentional — the app is not yet complex enough to justify Redux or Zustand, and premature abstraction creates maintenance overhead.

---

## Backend

### NestJS + Fastify

NestJS provides the module/guard/decorator structure needed for a healthcare API (RBAC, audit logging, exception filters). Fastify replaces the default Express adapter for better throughput.

### Module boundaries

| Module | Responsibility |
|--------|---------------|
| `auth` | Login, register, JWT issue, refresh token rotation |
| `users` | User CRUD, password policy, soft-delete |
| `patients` | Patient profiles linked to users |
| `appointments` | Booking, status transitions |
| `medical-records` | PHI storage, access-controlled reads |
| `audit-log` | Immutable log of every PHI access (global module) |

Every module that reads health data calls `AuditLogService.log()` — enforced by code review checklist, not by the framework. Future improvement: a custom NestJS interceptor that auto-logs all `GET` requests to `/patients/*` and `/records/*`.

### Database

PostgreSQL with TypeORM. `synchronize: false` in all environments — schema changes go through migrations only. Soft-delete (`DeleteDateColumn`) on `User` and `MedicalRecord` so PHI is never hard-deleted.

### Authentication flow

```
POST /auth/login
  → returns { accessToken (15 min), refreshToken (7d) }

POST /auth/refresh
  → validates refreshToken, rotates it, returns new pair

All other endpoints
  → JwtAuthGuard validates Bearer token on every request
  → RolesGuard checks RBAC on protected routes
```

Refresh tokens are stored hashed in the database. On each use, the old token is invalidated and a new one is issued (rotation). This limits the blast radius of a leaked refresh token.

---

## Key decisions log

| Decision | Chosen | Rejected | Reason |
|----------|--------|----------|--------|
| Navigation | expo-router | React Navigation | File-based routing, deep link support |
| Styling | NativeWind | StyleSheet only | Design tokens, rapid iteration |
| Charts | react-native-svg (custom) | Victory Native, Recharts | Bundle size, full customisation |
| State | useState/useReducer | Redux, Zustand | App complexity doesn't justify it yet |
| API framework | NestJS + Fastify | Express, Hono | Module structure needed for RBAC + audit logging |
| ORM | TypeORM | Prisma | NestJS ecosystem fit, migration control |
| Package manager | pnpm | npm, yarn | Workspace support, disk efficiency, strict resolution |
