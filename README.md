# api-db-tests

Playwright API tests with PostgreSQL database assertions.

Pattern: call the API → verify the response → check the database record.

## Stack

- **Playwright Test** - test runner + API requests
- **PostgreSQL** (`pg`) - database assertions
- **Allure** - test reporting
- **GitHub Actions** - CI with `services: postgres`
- **TypeScript**

## Project structure

```
api-db-tests/
├── config/env.ts
├── db/
│   ├── schema.sql
│   ├── seed.js
│   └── reset.js
├── helpers/dbHelper.ts
├── tests/
│   ├── global-setup.ts
│   └── specs/pets.spec.ts
├── .github/workflows/tests.yml
└── playwright.config.ts
```

## Test data strategy

Fixed test records with known IDs are seeded before every run via `globalSetup`. This guarantees a predictable baseline — tests reference specific IDs rather than relying on dynamic state.

Two scripts manage test data:

- `db:seed` — creates schema + inserts fixed records (safe to re-run, uses `ON CONFLICT DO UPDATE`)
- `db:reset` — `TRUNCATE` + re-insert; used in CI before regression runs to ensure a clean slate

`globalSetup` runs `reset` automatically before the test suite starts. No manual intervention needed.

## Local setup

**Prerequisites:** Node.js 20+, Docker

```bash
# 1. Install dependencies
npm ci

# 2. Start PostgreSQL via Docker Compose
docker compose up -d

# 3. Create .env and fill in values (see .env.example)
cp .env.example .env

# 4. Run tests (global-setup resets DB automatically)
npm test
npm run test:api   # @api tag only

# Manual DB control
npm run db:seed    # seed without truncate
npm run db:reset   # truncate + re-seed

# 5. Stop PostgreSQL when done
docker compose down
```

## Reports

```bash
npm run report           # generate + open in browser
npm run report:generate  # generate only
```

## CI

Triggers: push/PR to `main`, `workflow_dispatch`.
PostgreSQL is provided by GitHub Actions `services: postgres` - no extra setup needed.
Required secrets: none.

## Test scenarios

| Test | Flow |
|------|------|
| CREATE | POST /pet → 200 + record in DB |
| READ | GET /pet/{id} → response matches DB |
| UPDATE | PUT /pet → updated data in DB |
| DELETE | DELETE /pet/{id} → `deleted_at` set in DB |
| Negative | GET deleted pet → 404, `deleted_at` confirmed |

## Notes

`DbHelper` on a real project contains only read methods (`SELECT`). The application writes to the database - AQA only verifies. The write methods here (`savePet`, `updatePet`, `markDeleted`) exist because Petstore is a shared public API without DB access.
