import { Sequelize } from 'sequelize';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isTestEnv = process.env.NODE_ENV === 'test' || process.env.VITEST === 'true';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: isTestEnv ? ':memory:' : path.join(__dirname, 'bancoteste.sqlite'),
  logging: false,
});

export default sequelize;
