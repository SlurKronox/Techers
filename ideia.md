# Movira — Notas Melhoradas

**Data:** 2025-10-16

**Projeto:** Movira — plataforma de vídeos (inspirada no YouTube)

---

## Objetivo

Criar uma plataforma de compartilhamento de vídeos com funcionalidades e estilo similares ao YouTube, priorizando: upload/streaming, canais, inscrições, comentários, recomendações e métricas básicas.

---

## Escopo (rápido)

## Must‑have (MVP)**

* Upload e streaming de vídeo
* Canais (criadores) e perfil de usuário
* Inscrições (subscribe)
* Comentários e respostas
* Visualizações e contagem de watch time
* Thumbnails e metadados (título, descrição, categoria)
* Autenticação e segurança básica (hash de senha, verificação de e‑mail)

## Nice‑to‑have

* Playlists
* Favoritar canais
* Transcodificação e múltiplas qualidades
* Recomendação básica (por categoria / vídeos relacionados)
* Analytics (retenção, CTR de thumbnails)
* Monetização (ads / memberships)

---

## Status atual

* Diagrama ER (rascunho) — existente
* Tarefas em aberto: banco de dados, armazenamento, transcodificação, CDN, API, frontend

---

## Diagrama ER (recomendado — versão melhorada)

```mermaid
erDiagram
    USER ||--o{ CHANNEL : owns
    USER ||--o{ VIDEO : uploads
    USER ||--o{ COMMENT : writes
    USER ||--o{ SUBSCRIPTION : subscribes
    USER ||--o{ VIEW : watches
    CHANNEL ||--o{ VIDEO : contains
    CHANNEL ||--|| USER : owner
    VIDEO ||--o{ COMMENT : receives
    VIDEO ||--o{ VIEW : has
    CHANNEL ||--o{ CHANNEL_FAVORITE : receives

    USER {
        int user_id PK
        string email UNIQUE
        string name
        string password_hash
        timestamp created_at
        string avatar_url
        string country
        boolean is_active
    }

    CHANNEL {
        int channel_id PK
        int owner_id FK
        string channel_name
        text description
        timestamp created_at
        int subscriber_count
        boolean verified
    }

    VIDEO {
        int video_id PK
        int channel_id FK
        string title
        text description
        timestamp uploaded_at
        int views_count
        int likes_count
        int dislikes_count
        int duration_seconds
        string video_url
        string thumbnail_url
        string category
        boolean is_public
    }

    COMMENT {
        int comment_id PK
        int video_id FK
        int user_id FK
        text content
        timestamp created_at
        int likes_count
        int parent_comment_id FK
        boolean is_removed
    }

    SUBSCRIPTION {
        int user_id FK
        int channel_id FK
        timestamp subscribed_at
        boolean notifications_enabled
        PK (user_id, channel_id)
    }

    VIEW {
        int view_id PK
        int user_id FK NULL
        int video_id FK
        timestamp viewed_at
        int watch_seconds
        boolean completed
    }

    CHANNEL_FAVORITE {
        int id PK
        int user_id FK
        int channel_id FK
        timestamp favorited_at
    }
```

> Observação: usei `user_id` / `channel_id` / `video_id` como chaves primárias inteiras (mais performáticas e flexíveis). Ainda guarda `email` como campo único em `USER`.

---

## Esquema SQL recomendado (Postgres — trechos chave)

```sql
-- Usuários
CREATE TABLE "user" (
  user_id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(200),
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  avatar_url TEXT,
  country VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE
);

-- Canais
CREATE TABLE channel (
  channel_id SERIAL PRIMARY KEY,
  owner_id INT NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE,
  channel_name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  subscriber_count INT DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE
);

-- Vídeos
CREATE TABLE video (
  video_id SERIAL PRIMARY KEY,
  channel_id INT NOT NULL REFERENCES channel(channel_id) ON DELETE CASCADE,
  title VARCHAR(300) NOT NULL,
  description TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  views_count BIGINT DEFAULT 0,
  likes_count INT DEFAULT 0,
  dislikes_count INT DEFAULT 0,
  duration_seconds INT,
  video_url TEXT,
  thumbnail_url TEXT,
  category VARCHAR(100),
  is_public BOOLEAN DEFAULT TRUE
);

-- Comentários
CREATE TABLE comment (
  comment_id SERIAL PRIMARY KEY,
  video_id INT NOT NULL REFERENCES video(video_id) ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES "user"(user_id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  likes_count INT DEFAULT 0,
  parent_comment_id INT REFERENCES comment(comment_id) ON DELETE CASCADE,
  is_removed BOOLEAN DEFAULT FALSE
);

-- Inscrições
CREATE TABLE subscription (
  user_id INT NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE,
  channel_id INT NOT NULL REFERENCES channel(channel_id) ON DELETE CASCADE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notifications_enabled BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (user_id, channel_id)
);

-- Visualizações (registro detalhado)
CREATE TABLE view (
  view_id BIGSERIAL PRIMARY KEY,
  user_id INT REFERENCES "user"(user_id),
  video_id INT NOT NULL REFERENCES video(video_id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  watch_seconds INT,
  completed BOOLEAN DEFAULT FALSE
);

-- Favoritos de canal
CREATE TABLE channel_favorite (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE,
  channel_id INT NOT NULL REFERENCES channel(channel_id) ON DELETE CASCADE,
  favorited_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Índices recomendados

* `CREATE INDEX idx_video_channel ON video(channel_id);`
* `CREATE INDEX idx_video_uploaded_at ON video(uploaded_at);`
* `CREATE INDEX idx_video_category ON video(category);`
* Full‑text index em `video(title, description)` para busca (pg_trgm ou tsvector).
* Índices em `view(viewed_at)`, `comment(video_id)` para consultas rápidas.

---

## Regras e escolhas importantes

* **IDs inteiros**: prefira `serial/bigserial` para PKs (mais eficientes que usar `email` diretamente como PK).
* **Soft delete**: considere `is_removed` ou `deleted_at` em tabelas críticas (usuário, vídeo, comentário) para evitar perda acidental de dados.
* **FK ON DELETE behavior**: usar `ON DELETE CASCADE` para entidades agregadas (comentários e vídeos quando o canal é removido) e `ON DELETE SET NULL` quando preferir manter histórico.
* **Auditoria/Logs**: manter tabela de eventos ou pipeline de eventos (Kafka / PubSub) para análises e reconstruções.

---

## Infra / Arquitetura (alto nível)

* **Armazenamento de vídeo**: S3‑compatible (ou GCS/Azure Blob) com objetos versionados
* **Transcodificação**: fila (Redis / RabbitMQ / SQS) + workers (FFmpeg) para gerar múltiplas resoluções
* **CDN**: CloudFront / Cloudflare para distribuição de conteúdos estáticos
* **Banco de dados**: Postgres primário, replicas para leitura; usar Timescale ou ClickHouse para análises em larga escala
* **Backend**: APIs REST/GraphQL; autenticação JWT + refresh tokens
* **Frontend**: SPA (React/Next.js) com SSR para SEO das páginas públicas
* **Observability**: logs, métricas, tracing (Prometheus + Grafana + Jaeger)

---

## Endpoints sugeridos (exemplo REST)

* `POST /auth/register`, `POST /auth/login`
* `GET /videos`, `GET /videos/:id`, `POST /videos` (upload inicia job de transcodificação)
* `GET /channels/:id`, `POST /channels`
* `POST /videos/:id/comments`, `GET /videos/:id/comments`
* `POST /channels/:id/subscribe`, `DELETE /channels/:id/subscribe`
* `POST /videos/:id/like`, `POST /videos/:id/dislike`
* `POST /videos/:id/view` (pinga watch event)

---

## Segurança e privacidade

* Hash de senhas com Argon2 ou bcrypt, nunca armazenar em texto
* Rate limiting para uploads, comentários e endpoints sensíveis
* Validação de input e proteção contra XSS/CSRF
* Criptografia em trânsito (TLS) e em repouso para dados sensíveis
* Conformidade com LGPD (opções para requisição e exclusão de dados)

---

## Backlog / Tarefas imediatas

1. Definir esquema final do banco (normalização e campos obrigatórios). ✅
2. Criar migrations (SQL ou ferramenta — e.g. Flyway / Liquibase / Prisma).
3. Implementar armazenamento de objetos (S3) + upload direto do cliente (pre‑signed URLs).
4. Configurar fila + worker de transcodificação (FFmpeg).
5. API básica de CRUD para usuários, canais e vídeos.
6. Integração com CDN e testes de streaming.
7. Implementar autenticação e autorização.
8. Testes automatizados (unit + integraçã o)

---

## Observações finais / recomendações

* Comece o MVP com foco em upload, transcodificação básica, playback e inscrições — feature‑parity com o YouTube pode vir depois.
* Monitore custos de armazenamento e saída de CDN desde o início.
* Defina limites claros para uploads (tamanho/duração) no MVP.

---

> Se quiser, eu gero: migrações SQL completas (arquivos), um diagrama ER em PNG/SVG, ou um conjunto de endpoints OpenAPI/Swagger baseado neste esquema — me diga qual você prefere como próximo passo.
