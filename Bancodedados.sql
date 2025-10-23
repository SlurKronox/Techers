-- Movira SQLite - Banco completo com povoamento seguro
-- Criado: 2025-10-16
-- Versão melhorada: INSERT OR IGNORE para evitar UNIQUE constraint failed

PRAGMA foreign_keys = ON;

-- =========================
-- CRIAÇÃO DE TABELAS
-- =========================
BEGIN TRANSACTION;

-- Usuários
CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY AUTOINCREMENT,  
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT (datetime('now')),
  avatar_url TEXT,
  country TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1 CHECK(is_active IN (0,1)),
  deleted_at DATETIME
);

-- Canais
CREATE TABLE IF NOT EXISTS channel (
  channel_id INTEGER PRIMARY KEY AUTOINCREMENT,
  owner_id INTEGER NOT NULL,
  channel_name TEXT NOT NULL,
  description TEXT DEFAULT '',
  created_at DATETIME DEFAULT (datetime('now')),
  subscriber_count INTEGER NOT NULL DEFAULT 0 CHECK(subscriber_count >= 0),
  verified INTEGER NOT NULL DEFAULT 0 CHECK(verified IN (0,1)),
  UNIQUE (owner_id, channel_name),
  FOREIGN KEY (owner_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Vídeos
CREATE TABLE IF NOT EXISTS video (
  video_id INTEGER PRIMARY KEY AUTOINCREMENT,
  channel_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  uploaded_at DATETIME DEFAULT (datetime('now')),
  views_count INTEGER NOT NULL DEFAULT 0 CHECK(views_count >= 0),
  likes_count INTEGER NOT NULL DEFAULT 0 CHECK(likes_count >= 0),
  dislikes_count INTEGER NOT NULL DEFAULT 0 CHECK(dislikes_count >= 0),
  duration_seconds INTEGER NOT NULL CHECK(duration_seconds >= 0),
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT DEFAULT '',
  is_public INTEGER NOT NULL DEFAULT 1 CHECK(is_public IN (0,1)),
  deleted_at DATETIME,
  FOREIGN KEY (channel_id) REFERENCES channel(channel_id) ON DELETE CASCADE
);

-- Comentários
CREATE TABLE IF NOT EXISTS comment (
  comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
  video_id INTEGER NOT NULL,
  user_id INTEGER,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT (datetime('now')),
  likes_count INTEGER NOT NULL DEFAULT 0 CHECK(likes_count >= 0),
  parent_comment_id INTEGER,
  is_removed INTEGER NOT NULL DEFAULT 0 CHECK(is_removed IN (0,1)),
  FOREIGN KEY (video_id) REFERENCES video(video_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
  FOREIGN KEY (parent_comment_id) REFERENCES comment(comment_id) ON DELETE CASCADE
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscription (
  user_id INTEGER NOT NULL,
  channel_id INTEGER NOT NULL,
  subscribed_at DATETIME DEFAULT (datetime('now')),
  notifications_enabled INTEGER NOT NULL DEFAULT 1 CHECK(notifications_enabled IN (0,1)),
  PRIMARY KEY (user_id, channel_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (channel_id) REFERENCES channel(channel_id) ON DELETE CASCADE
);

-- Views
CREATE TABLE IF NOT EXISTS views (
  view_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  video_id INTEGER NOT NULL,
  viewed_at DATETIME DEFAULT (datetime('now')),
  watch_seconds INTEGER NOT NULL CHECK(watch_seconds >= 0),
  completed INTEGER NOT NULL DEFAULT 0 CHECK(completed IN (0,1)),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (video_id) REFERENCES video(video_id) ON DELETE CASCADE
);

-- Canais favoritos
CREATE TABLE IF NOT EXISTS channel_favorite (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  channel_id INTEGER NOT NULL,
  favorited_at DATETIME DEFAULT (datetime('now')),
  UNIQUE (user_id, channel_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (channel_id) REFERENCES channel(channel_id) ON DELETE CASCADE
);

-- Reações em vídeo
CREATE TABLE IF NOT EXISTS video_reaction (
  user_id INTEGER NOT NULL,
  video_id INTEGER NOT NULL,
  reaction INTEGER NOT NULL CHECK(reaction IN (1,-1)),
  reacted_at DATETIME DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, video_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (video_id) REFERENCES video(video_id) ON DELETE CASCADE
);

-- Curtidas em comentários
CREATE TABLE IF NOT EXISTS comment_like (
  user_id INTEGER NOT NULL,
  comment_id INTEGER NOT NULL,
  liked_at DATETIME DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, comment_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (comment_id) REFERENCES comment(comment_id) ON DELETE CASCADE
);

-- Busca full-text em vídeos (FTS5)
CREATE VIRTUAL TABLE IF NOT EXISTS video_fts USING fts5(
  title,
  description,
  content='video',
  content_rowid='video_id'
);

-- Triggers FTS
CREATE TRIGGER IF NOT EXISTS video_ai AFTER INSERT ON video BEGIN
  INSERT INTO video_fts(rowid, title, description) VALUES (new.video_id, new.title, new.description);
END;
CREATE TRIGGER IF NOT EXISTS video_ad AFTER DELETE ON video BEGIN
  DELETE FROM video_fts WHERE rowid = old.video_id;
END;
CREATE TRIGGER IF NOT EXISTS video_au AFTER UPDATE ON video BEGIN
  DELETE FROM video_fts WHERE rowid = old.video_id;
  INSERT INTO video_fts(rowid, title, description) VALUES (new.video_id, new.title, new.description);
END;

-- Índices
CREATE INDEX IF NOT EXISTS idx_video_channel ON video(channel_id);
CREATE INDEX IF NOT EXISTS idx_video_uploaded_at ON video(uploaded_at);
CREATE INDEX IF NOT EXISTS idx_video_category ON video(category);
CREATE INDEX IF NOT EXISTS idx_comment_video ON comment(video_id);
CREATE INDEX IF NOT EXISTS idx_views_video ON views(video_id);
CREATE INDEX IF NOT EXISTS idx_subscription_channel ON subscription(channel_id);

-- View vídeos populares
CREATE VIEW IF NOT EXISTS mv_popular_videos AS
SELECT v.video_id, v.title, v.channel_id, v.views_count, v.likes_count, v.uploaded_at
FROM video v
ORDER BY v.views_count DESC
LIMIT 100;

COMMIT;

-- =========================
-- INSERÇÃO DE DADOS DE TESTE (INSERT OR IGNORE)
-- =========================
BEGIN TRANSACTION;

-- Usuários
INSERT OR IGNORE INTO users (email, name, password_hash, country, is_active) VALUES
('alice@example.com', 'Alice', 'hash123', 'Brasil', 1),
('bob@example.com', 'Bob', 'hash123', 'Brasil', 1),
('carol@example.com', 'Carol', 'hash123', 'Brasil', 1),
('dave@example.com', 'Dave', 'hash123', 'Brasil', 1),
('eve@example.com', 'Eve', 'hash123', 'Brasil', 1);

-- Canais
INSERT OR IGNORE INTO channel (owner_id, channel_name, description, verified) VALUES
(1, 'AliceTV', 'Canal da Alice sobre tutoriais', 1),
(2, 'BobGames', 'Jogos e gameplays com Bob', 0),
(3, 'CarolVlogs', 'Vlogs e lifestyle da Carol', 0),
(4, 'DaveTech', 'Dicas de tecnologia com Dave', 1),
(5, 'EveMusic', 'Música e covers da Eve', 0);

-- Vídeos
INSERT OR IGNORE INTO video (channel_id, title, description, duration_seconds, video_url, category) VALUES
(1, 'Tutorial de Python', 'Aprenda Python do zero!', 600, 'http://movira.com/videos/1', 'Educação'),
(1, 'Dicas de Organização', 'Como organizar sua rotina', 300, 'http://movira.com/videos/2', 'Educação'),
(2, 'Gameplay Minecraft', 'Explorando mundos no Minecraft', 1200, 'http://movira.com/videos/3', 'Jogos'),
(3, 'Vlog de Viagem', 'Minha viagem para a Bahia', 900, 'http://movira.com/videos/4', 'Vlog'),
(4, 'Review Smartphone', 'Review completo do novo smartphone', 500, 'http://movira.com/videos/5', 'Tecnologia'),
(5, 'Cover de Pop', 'Cantando música pop famosa', 240, 'http://movira.com/videos/6', 'Música');

-- Comentários
INSERT OR IGNORE INTO comment (video_id, user_id, content) VALUES
(1, 2, 'Muito útil, obrigado!'),
(1, 3, 'Adorei o tutorial'),
(3, 1, 'Boa gameplay!'),
(4, 5, 'Que vlog incrível!'),
(6, 4, 'Sua voz é maravilhosa!');

-- Subscriptions
INSERT OR IGNORE INTO subscription (user_id, channel_id) VALUES
(2, 1),
(3, 1),
(1, 2),
(4, 3),
(5, 4);

-- Views
INSERT OR IGNORE INTO views (user_id, video_id, watch_seconds, completed) VALUES
(1, 1, 600, 1),
(2, 1, 590, 1),
(3, 1, 300, 0),
(4, 3, 1200, 1),
(5, 6, 240, 1);

-- Canais favoritos
INSERT OR IGNORE INTO channel_favorite (user_id, channel_id) VALUES
(1, 2),
(2, 1),
(3, 3),
(4, 4),
(5, 5);

-- Reações em vídeo
INSERT OR IGNORE INTO video_reaction (user_id, video_id, reaction) VALUES
(1, 3, 1),
(2, 1, 1),
(3, 1, -1),
(4, 5, 1),
(5, 6, 1);

-- Curtidas em comentários
INSERT OR IGNORE INTO comment_like (user_id, comment_id) VALUES
(1, 2),
(2, 1),
(3, 3),
(4, 5),
(5, 4);

COMMIT;
