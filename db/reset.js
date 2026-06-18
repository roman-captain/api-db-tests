const { Client } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@localhost:5433/testdb';

// reset = TRUNCATE + seed
async function reset() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  console.log('Connected to PostgreSQL');

  await client.query('TRUNCATE TABLE pets RESTART IDENTITY');
  console.log('Table truncated');

  await client.query(`
    INSERT INTO pets (id, name, status) VALUES
      (1001, 'Rex',    'available'),
      (1002, 'Buddy',  'available'),
      (1003, 'Shadow', 'pending'),
      (1004, 'Max',    'sold')
  `);

  console.log('Reset complete: 4 test pets restored');
  await client.end();
}

reset().catch((err) => {
  console.error('Reset failed:', err);
  process.exit(1);
});
