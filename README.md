# Techers

![CI](https://github.com/SlurKronox/Techers/actions/workflows/ci.yml/badge.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

Projeto acadêmico para modelagem de uma plataforma de vídeos (estilo YouTube) com Sequelize + SQLite.

## Objetivo
Organizar a base de dados e os modelos relacionais de uma plataforma de conteúdo em vídeo.
Este repositório foi padronizado com ESM, testes automatizados e CI para garantir consistência técnica.

## Stack
- Node.js 20
- Sequelize 6
- SQLite3
- Vitest
- ESLint
- GitHub Actions

## Arquitetura
- `Bancodedados.sql`: schema SQLite completo e dados de exemplo
- `src/models`: modelos Sequelize e relações
- `src/database/database.js`: conexão SQLite
- `tests/`: smoke tests do schema e modelos
- `docs/`: documentação técnica

## Setup Local
```bash
git clone https://github.com/SlurKronox/Techers.git
cd Techers
npm ci
```

## Comandos
```bash
npm run lint
npm run test
npm run build
```

## Documentação
- `docs/ARCHITECTURE.md`
- `docs/TESTING.md`
- `docs/CI.md`

## English Summary
Techers provides a relational data model prototype for a video platform.
It now includes ESM modules, automated tests, and CI quality checks.
