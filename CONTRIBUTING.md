# Contributing Guide

## Workflow
- Base branch: `main`
- Use pull requests for all changes
- Keep commits clear and scoped

## Local Validation
```bash
npm ci
npm run lint
npm run test:ci
npm run build
```

## Pull Request Requirements
- CI and Security workflows green
- No sensitive data in code or commits
- Docs updated when interfaces or schema changes

## Security Hygiene
- Keep `node_modules` out of version control
- Avoid hardcoded credentials
- Validate model/schema assumptions with tests
