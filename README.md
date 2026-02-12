# Techers

![CI](https://github.com/SlurKronox/Techers/actions/workflows/ci.yml/badge.svg)
![Security](https://github.com/SlurKronox/Techers/actions/workflows/security.yml/badge.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

Projeto academico para modelagem de uma plataforma de videos (estilo YouTube) com Sequelize + SQLite.

## Objetivo
Organizar a base de dados e os modelos relacionais de uma plataforma de conteudo em video.
Este repositorio foi padronizado com ESM, testes automatizados, CI e governanca de seguranca.

## Stack
- Node.js 20
- Sequelize 6
- SQLite3
- Vitest
- ESLint
- GitHub Actions

## Arquitetura
- `Bancodedados.sql`: schema SQLite e dados de exemplo
- `src/models`: modelos Sequelize e relacoes
- `src/database/database.js`: conexao SQLite
- `tests/`: smoke tests do schema e modelos
- `docs/`: documentacao tecnica

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

## Documentacao
- `docs/README.md`
- `docs/ARCHITECTURE.md`
- `docs/TESTING.md`
- `docs/CI.md`
- `docs/SECURITY.md`

## Governanca
- Politica de seguranca: `SECURITY.md`
- Guia de contribuicao: `CONTRIBUTING.md`

## English Summary
Techers provides a relational data model prototype for a video platform.
It includes engineering governance and repository-level security practices.
