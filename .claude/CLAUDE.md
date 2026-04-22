# Security Awareness (OWASP Top 10)

This project follows security best practices based on OWASP Top 10:

## A01: Broken Access Control
- API routes should validate user identity (future auth integration)

## A02: Cryptographic Failures
- Secrets stored only in environment variables
- Never committed to repository

## A03: Injection
- No direct string interpolation in DB queries
- Prisma ORM used to prevent SQL injection

## A04: Insecure Design
- LLM outputs are never trusted directly
- All outputs validated with Zod

## A05: Security Misconfiguration
- Environment variables required for API keys
- No hardcoded credentials

## A06: Vulnerable Components
- npm audit enforced in CI

## A07: Identification and Authentication Failures
- Planned integration with NextAuth

## A08: Software and Data Integrity Failures
- CI pipeline enforces checks before deployment

## A09: Security Logging and Monitoring
- Errors logged server-side

## A10: SSRF
- External API calls limited to GitHub API only