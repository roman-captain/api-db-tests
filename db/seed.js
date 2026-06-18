const { Client } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@localhost:5433/testdb';

async function seed() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  console.log('Connected to PostgreSQL');

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

  await client.query(`
    INSERT INTO pets (id, name, status) VALUES
      (1001, 'Rex',    'available'),
      (1002, 'Buddy',  'available'),
      (1003, 'Shadow', 'pending'),
      (1004, 'Max',    'sold')
    ON CONFLICT (id) DO UPDATE
      SET name = EXCLUDED.name,
          status = EXCLUDED.status,
          updated_at = NOW(),
          deleted_at = NULL
  `);

  console.log('Seeded 4 test pets: IDs 1001-1004');
  await client.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
