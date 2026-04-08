# Security Policy

Vedarogya processes personal health information (PHI). We take security seriously and appreciate responsible disclosure.

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x     | ✅ Active  |

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Please report security issues by emailing **security@vedarogya.app** with:

1. A clear description of the vulnerability
2. Steps to reproduce
3. Potential impact (data exposure, authentication bypass, etc.)
4. Any suggested remediation

We will acknowledge your report within **48 hours** and aim to release a fix within **7 days** for critical issues.

## Security Measures

### Authentication
- JWT access tokens expire in 15 minutes
- Refresh tokens expire in 7 days and are rotated on each use
- Passwords are hashed with bcrypt (minimum 12 rounds)
- Strong password policy enforced: uppercase, lowercase, number, special character

### Data Protection
- All PHI access is logged in an immutable audit trail
- Soft-delete on User and MedicalRecord entities (data is never hard-deleted)
- Database migrations only (`synchronize: false` in production)
- SSL/TLS required for all production database connections

### API Security
- All endpoints require authentication except `/auth/login` and `/auth/register`
- Role-based access control (RBAC) on all protected routes
- Global exception filter — internal errors are never leaked to the client
- Request rate limiting on authentication endpoints

### Mobile App
- No sensitive data stored in AsyncStorage or plain-text files
- Biometric authentication support (planned)
- Certificate pinning (planned for production release)

### Compliance
This application is designed with HIPAA principles in mind. If you are deploying
Vedarogya in a clinical setting, please conduct your own compliance assessment.

## Security Changelog

| Date | Severity | Description |
|------|----------|-------------|
| —    | —        | No public disclosures yet |
