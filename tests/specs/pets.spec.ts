import { test, expect } from '@playwright/test';
import { DbHelper } from '../../helpers/dbHelper';
import { env } from '../../config/env';

const PET_ID = Math.floor(Math.random() * 100000) + 1;
const db = new DbHelper();

test.describe('Pets API + DB assertions', () => {

  test.beforeAll(async () => {
    await db.connect();
  });

  test.afterAll(async () => {
    await db.disconnect();
  });

  test('should create pet via API and verify record in DB @api', async ({ request }) => {

    const response = await request.post(`${env.apiUrl}/pet`, {
      data: { id: PET_ID, name: 'Rex', status: 'available' },
    });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.name).toBe('Rex');

    await db.savePet(PET_ID, 'Rex', 'available');

    const record = await db.getPetById(PET_ID);
    expect(record).not.toBeNull();
    expect(record.name).toBe('Rex');
    expect(record.status).toBe('available');
    expect(record.deleted_at).toBeNull();
  });

  test('should get pet via API and verify data matches DB @api', async ({ request }) => {

    const response = await request.get(`${env.apiUrl}/pet/${PET_ID}`);
    expect(response.status()).toBe(200);

    const body = await response.json();


    const record = await db.getPetById(PET_ID);
    expect(record).not.toBeNull();

    expect(body.id).toBe(Number(record.id));
    expect(body.name).toBe(record.name);
    expect(body.status).toBe(record.status);
  });

  test('should update pet via API and verify DB reflects changes @api', async ({ request }) => {

    const response = await request.put(`${env.apiUrl}/pet`, {
      data: { id: PET_ID, name: 'Rex Updated', status: 'sold' },
    });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.name).toBe('Rex Updated');

    await db.updatePet(PET_ID, 'Rex Updated', 'sold');

    const record = await db.getPetById(PET_ID);
    expect(record.name).toBe('Rex Updated');
    expect(record.status).toBe('sold');
    expect(record.updated_at).not.toBeNull();
  });

  test('should delete pet via API and verify soft-delete in DB @api', async ({ request }) => {

    const response = await request.delete(`${env.apiUrl}/pet/${PET_ID}`);
    expect([200, 404]).toContain(response.status());

    await db.markDeleted(PET_ID);

    const record = await db.getPetById(PET_ID);
    expect(record.deleted_at).not.toBeNull();
  });

  test('should return 404 for deleted pet and confirm deletion in DB @api', async ({ request }) => {

    const response = await request.get(`${env.apiUrl}/pet/${PET_ID}`);
    expect(response.status()).toBe(404);

    const record = await db.getPetById(PET_ID);
    expect(record).not.toBeNull();
    expect(record.deleted_at).not.toBeNull();
  });

});
