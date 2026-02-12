# Testing

## Estratégia
- `sql-schema.test.js`: valida criação de tabelas principais a partir do SQL
- `models-smoke.test.js`: valida sincronização e criação de registros pelos modelos

## Execução
```bash
npm run test
npm run test:ci
```

## English Summary
Tests verify both raw SQL schema setup and ORM model behavior.
