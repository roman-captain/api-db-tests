const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function seed() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/testdb',
  });

  await client.connect();
  console.log('Connected to PostgreSQL');

  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await client.query(schema);
  console.log('Schema applied');

  await client.end();
  console.log('Done');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
