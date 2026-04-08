# Contributing to Vedarogya

Thank you for your interest in contributing. This document explains the process for contributing code, reporting bugs, and suggesting features.

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold it.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/vedarogya.git`
3. Install dependencies: `pnpm install`
4. Create a feature branch: `git checkout -b feat/your-feature-name`
5. Make your changes
6. Push and open a pull request

## Branch Naming

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feat/short-description` | `feat/sleep-tracking-card` |
| Bug fix | `fix/short-description` | `fix/chart-overflow-android` |
| Refactor | `refactor/short-description` | `refactor/vitals-components` |
| Docs | `docs/short-description` | `docs/setup-guide` |

## Commit Messages

Write short, humanised commit messages in the present tense:

```
good → added premium stats card to the log screen
good → fixed Su bar overflowing on small devices
bad  → fix(StatsCard): resolved bar overflow issue in WeekChart component
```

## Pull Request Checklist

Before opening a PR:

- [ ] Code runs without errors on both iOS and Android
- [ ] No `console.log` statements left in production code
- [ ] No hardcoded secrets or API keys
- [ ] TypeScript compiles without errors (`pnpm tsc --noEmit`)
- [ ] UI tested on at least one iPhone and one Android device/emulator
- [ ] PR description explains *what* changed and *why*

## Healthcare-specific Rules

Because this app handles personal health data:

- Never log PHI (personal health information) to the console in any environment
- Any new API endpoint that reads health data **must** call `AuditLogService.log()`
- Do not store sensitive data in AsyncStorage — use the secure keychain
- New endpoints must include appropriate RBAC guards

## Code Style

- TypeScript strict mode — no `any` types
- Use `pnpm` (not npm or yarn)
- NativeWind `className` for layout/spacing, inline `style` for dynamic values
- Component files: `kebab-case.tsx`
- No default exports from component files (named exports only)
- Keep components small — if a file exceeds ~200 lines, split it

## Reporting Bugs

Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md).

For **security vulnerabilities**, do not open a public issue. See [SECURITY.md](SECURITY.md).

## Suggesting Features

Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md).
