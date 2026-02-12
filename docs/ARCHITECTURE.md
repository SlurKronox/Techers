# Arquitetura

## Visão geral
O repositório modela entidades de usuário, canal, vídeo, comentários e interações.
A persistência é feita com SQLite e ORM Sequelize.

## Componentes
- Schema SQL: `Bancodedados.sql`
- Conexão: `src/database/database.js`
- Modelos e relações: `src/models/*`

## English Summary
SQLite schema + Sequelize models represent the core entities of a video sharing platform.
