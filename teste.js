// teste.js
const sequelize = require('./database/database.js');

async function runTest() {
  try {
    // Testa conexão
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco OK.');

    // Habilita foreign keys
    await sequelize.query('PRAGMA foreign_keys = ON;');

    // Cria tabela de teste (se não existir)
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS ping_test (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        info TEXT NOT NULL,
        created_at DATETIME DEFAULT (datetime('now'))
      );
    `);
    console.log('🛠️  Tabela de teste criada/verificada.');

    // Insere registro
    await sequelize.query(`
      INSERT INTO ping_test (info) VALUES ('teste-conexao-movira');
    `);

    // Lê registros
    const [rows] = await sequelize.query('SELECT * FROM ping_test;');
    console.log('📄 Registros encontrados:', rows);

    console.log('🎉 Teste concluído com sucesso.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro no teste:', err);
    process.exit(1);
  }
}

runTest();
