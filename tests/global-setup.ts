import { Client } from 'pg';

async function globalSetup() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://test:test@localhost:5433/testdb',
  });

  await client.connect();
  console.log('\n[global-setup] Resetting test database...');

  await client.query(`
    CREATE TABLE IF NOT EXISTS pets (
      id         BIGINT PRIMARY KEY,
      name       TEXT NOT NULL,
      status     TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      deleted_at TIMESTAMPTZ
    )
  `);

  await client.query('TRUNCATE TABLE pets RESTART IDENTITY');

  await client.query(`
    INSERT INTO pets (id, name, status) VALUES
      (1001, 'Rex',    'available'),
      (1002, 'Buddy',  'available'),
      (1003, 'Shadow', 'pending'),
      (1004, 'Max',    'sold')
  `);

  console.log('[global-setup] Done: 4 test pets seeded (IDs 1001-1004)\n');
  await client.end();
}

export default globalSetup;
