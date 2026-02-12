import sequelize from './src/database/database.js';

async function runTest() {
  try {
    await sequelize.authenticate();
    console.log('Conexao com o banco OK.');

    await sequelize.query('PRAGMA foreign_keys = ON;');

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS ping_test (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        info TEXT NOT NULL,
        created_at DATETIME DEFAULT (datetime('now'))
      );
    `);

    await sequelize.query(`INSERT INTO ping_test (info) VALUES ('teste-conexao-movira');`);

    const [rows] = await sequelize.query('SELECT * FROM ping_test;');
    console.log('Registros encontrados:', rows.length);

    process.exit(0);
  } catch (err) {
    console.error('Erro no teste:', err);
    process.exit(1);
  }
}

runTest();
