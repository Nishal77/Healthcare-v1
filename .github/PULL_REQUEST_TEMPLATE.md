## What changed

<!-- Short description of what this PR does -->

## Why

<!-- Motivation — link to issue if applicable. Closes #xxx -->

## Type of change

- [ ] Bug fix
- [ ] New feature
- [ ] Refactor / cleanup
- [ ] Docs / config

## Checklist

- [ ] Runs without errors on iOS and Android
- [ ] No `console.log` left in production code
- [ ] No hardcoded secrets or API keys
- [ ] TypeScript compiles: `pnpm tsc --noEmit`
- [ ] UI tested on at least one iPhone and one Android device/emulator

## Healthcare checklist

- [ ] No PHI logged to console in any environment
- [ ] New health-data endpoints call `AuditLogService.log()`
- [ ] Sensitive data uses secure keychain, not AsyncStorage
- [ ] New endpoints have RBAC guards

## Screenshots / recordings

<!-- Attach before/after screenshots or a screen recording if UI changed -->
