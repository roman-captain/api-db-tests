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
│   └── seed.js
├── helpers/dbHelper.ts
├── tests/specs/pets.spec.ts
├── .github/workflows/tests.yml
└── playwright.config.ts
```

## Local setup

**Prerequisites:** Node.js 20+, Docker

```bash
# 1. Install dependencies
npm ci

# 2. Start PostgreSQL via Docker Compose
docker compose up -d

# 3. Create .env and fill in values (see .env.example)
cp .env.example .env

# 4. Apply DB schema
npm run db:seed

# 5. Run tests
npm test
npm run test:api   # @api tag only

# 6. Stop PostgreSQL when done
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
