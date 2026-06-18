import { Client } from 'pg';
import { env } from '../config/env';

export class DbHelper {
  private client: Client;

  constructor() {
    this.client = new Client({ connectionString: env.databaseUrl });
  }

  async connect() {
    await this.client.connect();
  }

  async disconnect() {
    await this.client.end();
  }


  async getPetById(id: number) {
    const result = await this.client.query(
      'SELECT * FROM pets WHERE id = $1',
      [id]
    );
    return result.rows[0] ?? null;
  }

  async getPetsByStatus(status: string) {
    const result = await this.client.query(
      'SELECT * FROM pets WHERE status = $1',
      [status]
    );
    return result.rows;
  }

  async isPetDeleted(id: number): Promise<boolean> {
    const result = await this.client.query(
      'SELECT deleted_at FROM pets WHERE id = $1',
      [id]
    );
    return result.rows[0]?.deleted_at !== null;
  }


  async savePet(id: number, name: string, status: string) {
    await this.client.query(
      `INSERT INTO pets (id, name, status)
       VALUES ($1, $2, $3)
       ON CONFLICT (id) DO UPDATE SET name = $2, status = $3, updated_at = NOW()`,
      [id, name, status]
    );
  }

  async updatePet(id: number, name: string, status: string) {
    await this.client.query(
      'UPDATE pets SET name = $2, status = $3, updated_at = NOW() WHERE id = $1',
      [id, name, status]
    );
  }

  async markDeleted(id: number) {
    await this.client.query(
      'UPDATE pets SET deleted_at = NOW() WHERE id = $1',
      [id]
    );
  }
}
