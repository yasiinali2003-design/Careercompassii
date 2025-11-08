import { test, expect } from '@playwright/test';
import { ensureSiteAccess, resetMockDatabase, loginAsTeacher } from './utils';

test.beforeAll(async () => {
  await resetMockDatabase();
});

test.beforeEach(async () => {
  await resetMockDatabase();
});

test('teacher can create a class, generate PINs, and student can start the test', async ({ page, context }) => {
  await page.goto('/teacher/login');
  await ensureSiteAccess(page);
  await expect(page.getByRole('heading', { name: 'Kirjaudu sisään' })).toBeVisible();

  await loginAsTeacher(page);
  await page.goto('/teacher/classes');
  await ensureSiteAccess(page);
  await expect(page.locator('h1:has-text("Omat luokat")')).toBeVisible();

  await page.click('text=Luo uusi luokka');
  await ensureSiteAccess(page);

  await page.fill('#teacherId', 'playwright-opettaja');
  await page.click('button:has-text("Luo luokka")');

  await expect(page.locator('text=Luokka luotu!')).toBeVisible();

  await page.click('text=Siirry luokkahallintaan');
  await ensureSiteAccess(page);
  await expect(page.locator('h1:has-text("Luokkahallinta")')).toBeVisible();

  await page.fill('#pinCount', '2');
  await page.click('button:has-text("Luo PIN-koodit")');

  const pinItems = page.locator('[data-testid="pin-item"]');
  await expect(pinItems).toHaveCount(2);
  const firstPin = (await pinItems.first().innerText()).trim();

  const studentLink = (await page.locator('[data-testid="student-test-link"]').innerText()).trim();
  expect(studentLink).toMatch(/\/test$/);

  const studentPage = await context.newPage();
  await studentPage.goto(studentLink);
  await ensureSiteAccess(studentPage);

  await studentPage.fill('#pin', firstPin);
  await studentPage.click('button:has-text("Aloita testi")');

  await studentPage.waitForURL(/\/test\?pin=/);
  await expect(studentPage.url()).toContain(`pin=${firstPin}`);

  await studentPage.close();
});
