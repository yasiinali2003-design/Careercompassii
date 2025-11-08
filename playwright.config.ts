import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.PLAYWRIGHT_PORT ?? 3100);

const SITE_PASSWORD = process.env.PLAYWRIGHT_SITE_PASSWORD ?? 'playwright';
const TEACHER_ACCESS_CODE = process.env.PLAYWRIGHT_TEACHER_CODE ?? 'PLAYWRIGHT';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: process.env.CI ? 2 : 1,
  timeout: 120 * 1000,
  expect: {
    timeout: 5 * 1000,
  },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: `npm run dev -- --hostname 127.0.0.1 --port ${PORT}`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      SITE_PASSWORD,
      TEACHER_ACCESS_CODE,
      SUPABASE_SERVICE_ROLE_KEY: '',
      NEXT_PUBLIC_SUPABASE_URL: '',
      SUPABASE_URL: '',
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
