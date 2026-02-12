# CI

## Workflows
- `.github/workflows/ci.yml`
- `.github/workflows/security.yml`

## CI Jobs
- `lint`
- `test`
- `build`

## Security Jobs
- `dependency-review` (PR)
- `codeql` (push, PR, schedule)

## Ambiente
- Node 20
- Instalacao com `npm ci`

## Criterio de aprovacao
Mudancas so devem ser mescladas com CI e Security aprovados.

## English Summary
CI ensures lint, test, and build checks; Security workflow adds dependency review and CodeQL.
