# Vedarogya

A premium Ayurvedic healthcare app built with React Native and Expo. Vedarogya combines traditional Ayurvedic wisdom with modern health tracking — giving users a personalised daily health companion that feels as thoughtful as it looks.

---

## What it does

- **AI Health Assistant** — conversational Ayurvedic guidance powered by Claude
- **Health Tracking** — heart rate, steps, water intake, sleep, macros, and vitals from Apple Watch / Wear OS
- **Daily Log** — log nutrition, fitness, and wellness entries with an inline bottom sheet
- **Learn** — curated yoga lessons, home remedies, and Ayurvedic tips
- **Care** — appointment booking, medical records, and care team management
- **Profile** — personal health profile, secure settings, and audit-logged data access

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Mobile framework | Expo 54 + React Native 0.81 |
| Navigation | expo-router v6 (file-based) |
| Styling | NativeWind v4 (Tailwind for RN) |
| Language | TypeScript (strict mode) |
| Backend | NestJS 11 + Fastify |
| ORM | TypeORM |
| Database | PostgreSQL |
| Auth | JWT (15 min) + rotating refresh tokens |
| Package manager | pnpm (workspace monorepo) |

---

## Project structure

```
vedarogya/
├── app/                        # expo-router screens
│   ├── (auth)/                 # login, register, forgot-password
│   ├── (tabs)/                 # main tab screens
│   │   ├── index.tsx           # Home
│   │   ├── track.tsx           # Log
│   │   ├── learn.tsx           # Learn
│   │   ├── care.tsx            # Care / Progress
│   │   └── profile.tsx         # Profile
│   └── _layout.tsx
├── components/
│   ├── home/                   # home screen components
│   │   ├── health-tracking/    # vitals cards, metrics grid
│   │   └── vitality/           # semi-gauge meters, health pillars
│   ├── learn/                  # featured lesson, yoga, remedies, tips
│   ├── profile/                # header, settings menu, account info
│   ├── track/                  # week header, statistics card
│   │   ├── statistics/         # day-macros, week-chart, month-chart, period-dropdown
│   │   ├── eating-guide/       # today's food log
│   │   ├── fab/                # floating action button
│   │   └── log-entry/          # bottom sheet, chip grid, input rows
│   ├── custom-tab-bar.tsx
│   └── ui/                     # icon-symbol (SF Symbols + fallback)
├── src/
│   ├── api/                    # apiRequest client + typed endpoints
│   └── types/                  # shared TypeScript types
├── hooks/                      # custom React hooks
├── constants/
│   └── theme.ts                # design tokens
├── assets/
│   └── images/
├── backend/                    # NestJS API (workspace: @vedarogya/backend)
│   └── src/
│       ├── modules/            # auth, users, patients, appointments, records, audit-log
│       ├── common/             # guards, decorators, filters, interceptors
│       └── config/             # app, database, jwt configs
└── pnpm-workspace.yaml
```

---

## Setup

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL 15+
- Expo Go (for quick preview) or a development build

### Mobile app

```bash
pnpm install
cp .env.example .env        # fill in your values
pnpm start
```

### Backend

```bash
cd backend
pnpm install
cp .env.example .env        # fill in your values
pnpm start:dev
```

### Clear Metro cache

```bash
pnpm start --clear
```

---

## Environment variables

See [`.env.example`](.env.example) for all required variables and descriptions.

---

## Security

This app handles personal health information (PHI). See [`SECURITY.md`](SECURITY.md) for:
- Vulnerability reporting process
- Auth and data protection measures
- HIPAA compliance posture

---

## Changelog

See [`CHANGELOG.md`](CHANGELOG.md) for a full version history.

---

*Built with care. Powered by Ayurveda.*
