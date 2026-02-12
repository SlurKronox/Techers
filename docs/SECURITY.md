# Security Baseline

## Objectives
- Protect schema and model integrity
- Prevent credential leakage
- Keep dependency and code scanning active

## Controls
- CI workflow enforces lint, test, and build
- Security workflow runs dependency review and CodeQL
- Pull request review required for sensitive changes

## Data Layer Practices
- Prefer explicit constraints and relation mappings
- Run schema and model smoke tests in CI
- Keep migration-impacting changes documented

## Secret Management
- No credentials in source files
- Use environment variables for local/CI runtime
- Rotate tokens when exposure is detected

## Incident Response
1. Revoke compromised credentials.
2. Patch affected component.
3. Re-run CI and security checks.
4. Document mitigation and follow-up.

## English Summary
This document defines security controls for the Techers data model repository.
