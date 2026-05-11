import { defineConfig } from '@playwright/test';
import { env } from './config/env';

export default defineConfig({
  testDir: './tests/specs',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,

  reporter: [
    ['list'],
    ['allure-playwright', {
      outputFolder: 'allure-results',
      suiteTitle: true,
    }],
  ],

  use: {
    baseURL: env.apiUrl,
    headless: env.headless,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
});
