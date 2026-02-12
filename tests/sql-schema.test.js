import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sqlite3 from 'sqlite3';
import { describe, expect, it } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function openInMemoryDb() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(':memory:', (err) => {
      if (err) reject(err);
      else resolve(db);
    });
  });
}

function execSql(db, sql) {
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function queryOne(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

describe('sql schema', () => {
  it('creates core tables from Bancodedados.sql', async () => {
    const db = await openInMemoryDb();
    const schemaPath = path.resolve(__dirname, '../Bancodedados.sql');
    const schema = await fs.readFile(schemaPath, 'utf8');

    await execSql(db, schema);

    const users = await queryOne(db, "SELECT name FROM sqlite_master WHERE type='table' AND name='users'");
    const channel = await queryOne(db, "SELECT name FROM sqlite_master WHERE type='table' AND name='channel'");
    const video = await queryOne(db, "SELECT name FROM sqlite_master WHERE type='table' AND name='video'");

    expect(users?.name).toBe('users');
    expect(channel?.name).toBe('channel');
    expect(video?.name).toBe('video');

    db.close();
  });
});
