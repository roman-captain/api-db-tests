import dotenv from 'dotenv';
dotenv.config();

export const env = {
  apiUrl:      process.env.API_URL      || 'https://petstore.swagger.io/v2',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/testdb',
  headless:    process.env.HEADLESS === 'true',
};
