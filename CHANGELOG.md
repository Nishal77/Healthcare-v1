# Changelog

All notable changes to Vedarogya are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Added
- Premium floating action button (FAB) on the Log screen
- Health log entry bottom sheet with Nutrition / Fitness / Wellness chip selector
- Inline input rows (number, text, mood picker) per selected activity
- Month-view line chart with smooth bezier curves for macro trends
- Day-view macro cards (2×2 grid: Calories, Protein, Fats, Carbohydrates)
- Water intake banner on day view
- `StatisticsCard` period switcher — Day / Week / Month dropdown
- `WeekHeader` calendar component with ISO week number and navigation
- `EatingGuide` section — today's food log with meal entries and timestamps
- `MonthChart` — 28-day bezier line chart (Fats / Carbs / Protein crossing lines)

### Changed
- `TrackHeader` + `DateStrip` replaced by premium `WeekHeader` component
- Statistics card refactored into clean subfolder (`statistics/`)
- All vitals card backgrounds switched to `expo-linear-gradient` (top-light, bottom-rich)
- Heart Rate card header now uses a pink/rose icon tile
- Tab bar: "Care" renamed to "Progress", "Track" renamed to "Log"
- Account circle icon changed to 3-dot vertical menu (`ellipsis`)
- App background reverted to pure white `#FFFFFF`

### Fixed
- `Su` bar overflowing outside statistics card on small screens
- Day labels clipped inside SVG — moved outside to native `View` row
- "Progress" label wrapping to two lines in tab bar
- `NativeEventEmitter` crash in `useWatchBluetooth.ts`

---

## [0.2.0] — 2024-03 (Health Tracking & Learn)

### Added
- Vitals dashboard: heart rate card, 2×2 metrics grid, watch metrics row
- VitalitySection with semi-gauge meters and health pillars
- Learn screen: FeaturedLessonCard, YogaSection, RemediesSection, TipsSection
- AI chat screen with suggested topics, quick chips, and message bubbles
- Chat input bar with waveform icon, attach menu (camera / library / scan / vitals)
- Health reminders banner with time-of-day variants

### Changed
- Home search bar is now a tap-target that opens the AI chat screen
- CustomTabBar pill redesigned with floating account circle

---

## [0.1.0] — 2024-02 (Foundation)

### Added
- Expo 54 + React Native 0.81 project scaffold
- expo-router v6 file-based routing
- NativeWind v4 + Tailwind CSS setup
- NestJS 11 backend with TypeORM + PostgreSQL
- Authentication module (JWT, refresh tokens, bcrypt)
- Patient, appointments, medical records, and audit log modules
- CustomTabBar with haptic feedback
- Profile screen with settings menu
