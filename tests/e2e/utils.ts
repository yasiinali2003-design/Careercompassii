import { Page, expect } from '@playwright/test';
import path from 'path';
import { promises as fs } from 'fs';

export const SITE_PASSWORD = process.env.PLAYWRIGHT_SITE_PASSWORD ?? 'playwright';
export const TEACHER_CODE = process.env.PLAYWRIGHT_TEACHER_CODE ?? 'PLAYWRIGHT';

export const mockDbPath = path.join(process.cwd(), 'mock-db.json');

export async function resetMockDatabase() {
  try {
    await fs.unlink(mockDbPath);
  } catch (error: any) {
    if (error?.code !== 'ENOENT') {
      throw error;
    }
  }
}

export async function ensureSiteAccess(page: Page) {
  const gate = page.locator('text=Salasana vaaditaan');
  if ((await gate.count()) > 0) {
    await page.fill('input[type="password"]', SITE_PASSWORD);
    await page.click('button:has-text("Kirjaudu sisään")');
    await page.waitForSelector('text=Salasana vaaditaan', { state: 'detached' });
  }
}

export async function loginAsTeacher(page: Page) {
  const result = await page.evaluate(async (code) => {
    const response = await fetch('/api/teacher-auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ password: code })
    });

    const data = await response.json();
    return {
      ok: response.ok,
      success: data?.success ?? false,
      error: data?.error ?? null
    };
  }, TEACHER_CODE);

  expect(result.ok, `Teacher login request failed: ${result.error ?? 'unknown error'}`).toBeTruthy();
  expect(result.success, `Teacher login did not succeed: ${result.error ?? 'unknown error'}`).toBeTruthy();

  const { hostname } = new URL(page.url());
  const expires = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;

  await page.context().addCookies([
    {
      name: 'teacher_auth_token',
      value: 'authenticated',
      domain: hostname,
      path: '/',
      httpOnly: true,
      sameSite: 'Strict',
      expires
    },
    {
      name: 'teacher_id',
      value: 'mock-teacher',
      domain: hostname,
      path: '/',
      httpOnly: true,
      sameSite: 'Strict',
      expires
    }
  ]);
}
