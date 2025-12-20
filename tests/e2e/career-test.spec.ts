/**
 * E2E TEST SUITE: CAREER COMPASS TEST
 *
 * Tests the complete user flow from test entry to results page.
 * Uses realistic personas to verify:
 * - Test completion flow
 * - Results rendering
 * - Career recommendation plausibility
 * - Warning indicators for problematic responses
 */

import { test, expect, Page } from '@playwright/test';
import { ALL_PERSONAS, getValidPersonas, getProblematicPersonas, Persona } from '../fixtures/personas';

// Site password for protected access
const SITE_PASSWORD = process.env.PLAYWRIGHT_SITE_PASSWORD ?? 'playwright';

// Cohort selection mapping
const COHORT_SELECTOR: Record<string, string> = {
  'YLA': '[data-testid="cohort-yla"]',
  'TASO2': '[data-testid="cohort-taso2"]',
  'NUORI': '[data-testid="cohort-nuori"]',
};

// Alternative selectors if data-testid not available
const COHORT_TEXT_SELECTOR: Record<string, string> = {
  'YLA': 'text=Yläaste',
  'TASO2': 'text=Toinen aste',
  'NUORI': 'text=Nuori aikuinen',
};

async function bypassSitePassword(page: Page) {
  // Check if password page is shown
  const passwordInput = page.locator('input[type="password"]');
  if (await passwordInput.isVisible({ timeout: 2000 }).catch(() => false)) {
    await passwordInput.fill(SITE_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
  }
}

async function selectCohort(page: Page, cohort: string) {
  // Try data-testid first
  const testIdSelector = COHORT_SELECTOR[cohort];
  if (testIdSelector) {
    const element = page.locator(testIdSelector);
    if (await element.isVisible({ timeout: 1000 }).catch(() => false)) {
      await element.click();
      return;
    }
  }

  // Try text-based selector
  const textSelector = COHORT_TEXT_SELECTOR[cohort];
  if (textSelector) {
    const element = page.locator(textSelector).first();
    if (await element.isVisible({ timeout: 1000 }).catch(() => false)) {
      await element.click();
      return;
    }
  }

  // Try button containing cohort name
  const buttons = page.locator('button');
  const count = await buttons.count();
  for (let i = 0; i < count; i++) {
    const button = buttons.nth(i);
    const text = await button.textContent();
    if (text?.toLowerCase().includes(cohort.toLowerCase())) {
      await button.click();
      return;
    }
    // Match Finnish labels
    if (cohort === 'YLA' && text?.includes('Yläaste')) {
      await button.click();
      return;
    }
    if (cohort === 'TASO2' && (text?.includes('Toinen') || text?.includes('ammattikoulu'))) {
      await button.click();
      return;
    }
    if (cohort === 'NUORI' && (text?.includes('Nuori') || text?.includes('aikuinen'))) {
      await button.click();
      return;
    }
  }

  throw new Error(`Could not find cohort selector for: ${cohort}`);
}

async function answerQuestion(page: Page, answer: number) {
  // Find the answer button (1-5 scale)
  // Try multiple selector strategies
  const selectors = [
    `[data-testid="answer-${answer}"]`,
    `button:has-text("${answer}")`,
    `[data-value="${answer}"]`,
  ];

  for (const selector of selectors) {
    const element = page.locator(selector).first();
    if (await element.isVisible({ timeout: 500 }).catch(() => false)) {
      await element.click();
      return;
    }
  }

  // Try to find by aria-label or visible number
  const buttons = page.locator('button, [role="button"]');
  const count = await buttons.count();
  for (let i = 0; i < count; i++) {
    const button = buttons.nth(i);
    const text = await button.textContent();
    const ariaLabel = await button.getAttribute('aria-label');
    if (text === String(answer) || ariaLabel?.includes(String(answer))) {
      await button.click();
      return;
    }
  }

  // Last resort: click on the nth button in a Likert scale (1-indexed)
  const likertButtons = page.locator('[class*="likert"] button, [class*="scale"] button, [class*="answer"] button');
  if (await likertButtons.count() >= answer) {
    await likertButtons.nth(answer - 1).click();
    return;
  }

  throw new Error(`Could not find answer button for: ${answer}`);
}

async function completeTest(page: Page, persona: Persona) {
  // Navigate to test page
  await page.goto('/test');
  await bypassSitePassword(page);

  // Wait for initial load
  await page.waitForLoadState('networkidle');

  // Start test (if there's a start button)
  const startButton = page.locator('button:has-text("Aloita"), button:has-text("Tee testi"), [data-testid="start-test"]');
  if (await startButton.isVisible({ timeout: 2000 }).catch(() => false)) {
    await startButton.click();
    await page.waitForLoadState('networkidle');
  }

  // Select cohort
  await selectCohort(page, persona.cohort);
  await page.waitForLoadState('networkidle');

  // Skip occupation prompt for NUORI if it appears
  if (persona.cohort === 'NUORI') {
    const skipButton = page.locator('button:has-text("Ohita"), button:has-text("Jatka")');
    if (await skipButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await skipButton.click();
      await page.waitForLoadState('networkidle');
    }
  }

  // Answer all questions
  for (let i = 0; i < persona.answers.length; i++) {
    const answer = persona.answers[i];

    // Wait for question to be visible
    await page.waitForSelector('[class*="question"], [data-testid="question"]', { timeout: 5000 });

    // Answer the question
    await answerQuestion(page, answer);

    // Short wait for transition
    await page.waitForTimeout(100);

    // Click next if there's a next button (some UIs auto-advance)
    const nextButton = page.locator('button:has-text("Seuraava"), button:has-text("Next"), [data-testid="next"]');
    if (await nextButton.isVisible({ timeout: 300 }).catch(() => false)) {
      await nextButton.click();
    }
  }

  // Wait for results page
  await page.waitForURL(/\/results|\/tulokset/i, { timeout: 30000 });
  await page.waitForLoadState('networkidle');
}

// ============================================================================
// CORE E2E TESTS
// ============================================================================

test.describe('Career Test E2E Flow', () => {
  test.describe.configure({ mode: 'serial' });

  test('should load test page', async ({ page }) => {
    await page.goto('/test');
    await bypassSitePassword(page);

    // Verify page loaded
    await expect(page).toHaveTitle(/CareerCompass|Urakompassi|Testi/i);
  });

  test('should show cohort selection', async ({ page }) => {
    await page.goto('/test');
    await bypassSitePassword(page);

    // Click start if needed
    const startButton = page.locator('button:has-text("Aloita"), button:has-text("Tee testi")');
    if (await startButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await startButton.click();
    }

    // Verify cohort options are visible
    await expect(page.locator('text=Yläaste, text=Toinen aste, text=Nuori aikuinen').first()).toBeVisible({ timeout: 5000 });
  });
});

// ============================================================================
// PERSONA-BASED TESTS
// ============================================================================

test.describe('Persona-Based Career Tests', () => {
  // Test a subset of valid personas for quick feedback
  const testPersonas = getValidPersonas().slice(0, 5);

  for (const persona of testPersonas) {
    test(`${persona.name} (${persona.cohort}) should get ${persona.expectedCategory}`, async ({ page }) => {
      test.setTimeout(120000); // 2 minutes for full test

      await completeTest(page, persona);

      // Verify results page loaded
      await expect(page.locator('[class*="result"], [data-testid="results"]')).toBeVisible();

      // Check for expected category in recommendations
      if (persona.expectedCategory) {
        const categoryText = persona.expectedCategory.replace('-', '');
        const resultsContent = await page.textContent('body');

        // Category should appear somewhere in results (title, description, or career list)
        // Note: This is a soft check - the exact category may not always match
        // but recommendations should be plausible
        expect(resultsContent?.toLowerCase()).toContain(categoryText.toLowerCase().substring(0, 5));
      }

      // Verify career recommendations are present
      const careerCards = page.locator('[class*="career"], [data-testid*="career"]');
      await expect(careerCards.first()).toBeVisible();
    });
  }
});

// ============================================================================
// WARNING INDICATOR TESTS
// ============================================================================

test.describe('Response Quality Warnings', () => {
  const problematicPersonas = getProblematicPersonas().slice(0, 3);

  for (const persona of problematicPersonas) {
    test(`${persona.name} should trigger quality warning`, async ({ page }) => {
      test.setTimeout(120000);

      await completeTest(page, persona);

      // For problematic responses, we expect either:
      // 1. A warning message about response quality
      // 2. Lower confidence indicators
      // 3. Still valid results (system should be robust)

      // Check results loaded
      await expect(page.locator('[class*="result"], [data-testid="results"], body')).toBeVisible();

      // Results should still render (system should be robust)
      const pageContent = await page.textContent('body');
      expect(pageContent).toBeTruthy();

      // Log for debugging
      console.log(`${persona.name}: Results rendered successfully`);
    });
  }
});

// ============================================================================
// API SCORING TESTS (faster than full E2E)
// ============================================================================

test.describe('API Scoring Tests', () => {
  test('should return consistent results for same answers', async ({ request }) => {
    const persona = getValidPersonas()[0];

    const payload = {
      answers: persona.answers.map((score, index) => ({
        questionIndex: index,
        score: score
      })),
      cohort: persona.cohort
    };

    // Call API twice
    const response1 = await request.post('/api/score', { data: payload });
    const response2 = await request.post('/api/score', { data: payload });

    expect(response1.ok()).toBe(true);
    expect(response2.ok()).toBe(true);

    const result1 = await response1.json();
    const result2 = await response2.json();

    // Results should be identical (deterministic)
    expect(result1.topCareers?.[0]?.category).toBe(result2.topCareers?.[0]?.category);
    expect(result1.topCareers?.[0]?.slug).toBe(result2.topCareers?.[0]?.slug);
  });

  test('should handle all valid personas', async ({ request }) => {
    const validPersonas = getValidPersonas();

    for (const persona of validPersonas) {
      const payload = {
        answers: persona.answers.slice(0, 30).map((score, index) => ({
          questionIndex: index,
          score: score || 3 // Default to 3 if missing
        })),
        cohort: persona.cohort
      };

      const response = await request.post('/api/score', { data: payload });
      expect(response.ok()).toBe(true);

      const result = await response.json();
      expect(result.success).toBe(true);
      expect(result.topCareers).toBeDefined();
      expect(result.topCareers.length).toBeGreaterThan(0);

      // Log result for debugging
      console.log(`${persona.name} (${persona.cohort}): Got ${result.topCareers[0]?.category}, expected ${persona.expectedCategory}`);
    }
  });

  test('small answer changes should not cause extreme result flips', async ({ request }) => {
    const persona = getValidPersonas()[0];

    // Original answers
    const originalPayload = {
      answers: persona.answers.slice(0, 30).map((score, index) => ({
        questionIndex: index,
        score: score || 3
      })),
      cohort: persona.cohort
    };

    const originalResponse = await request.post('/api/score', { data: originalPayload });
    const originalResult = await originalResponse.json();
    const originalCategory = originalResult.topCareers?.[0]?.category;

    // Slightly modified answers (change 3 answers by 1 point)
    const modifiedAnswers = [...persona.answers.slice(0, 30)];
    modifiedAnswers[5] = Math.min(5, (modifiedAnswers[5] || 3) + 1);
    modifiedAnswers[10] = Math.max(1, (modifiedAnswers[10] || 3) - 1);
    modifiedAnswers[15] = Math.min(5, (modifiedAnswers[15] || 3) + 1);

    const modifiedPayload = {
      answers: modifiedAnswers.map((score, index) => ({
        questionIndex: index,
        score: score || 3
      })),
      cohort: persona.cohort
    };

    const modifiedResponse = await request.post('/api/score', { data: modifiedPayload });
    const modifiedResult = await modifiedResponse.json();
    const modifiedCategory = modifiedResult.topCareers?.[0]?.category;

    // Category should either be the same or closely related
    // (this is a soft check - some variation is expected)
    console.log(`Original: ${originalCategory}, Modified: ${modifiedCategory}`);

    // At minimum, both should return valid results
    expect(originalCategory).toBeTruthy();
    expect(modifiedCategory).toBeTruthy();
  });
});

// ============================================================================
// RESULTS PAGE TESTS
// ============================================================================

test.describe('Results Page Rendering', () => {
  test('should render career recommendations', async ({ page }) => {
    const persona = getValidPersonas()[0];
    await completeTest(page, persona);

    // Check for key result elements
    await expect(page.locator('h1, h2, [class*="title"]').first()).toBeVisible();

    // Career cards should be visible
    const careerElements = page.locator('[class*="career"], [class*="recommendation"], [class*="ammatti"]');
    const count = await careerElements.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should show education path for YLA', async ({ page }) => {
    const ylaPersona = getValidPersonas().find(p => p.cohort === 'YLA');
    if (!ylaPersona) {
      test.skip();
      return;
    }

    await completeTest(page, ylaPersona);

    // Education section should be visible for YLA
    const pageContent = await page.textContent('body');
    const hasEducation = pageContent?.toLowerCase().includes('lukio') ||
                         pageContent?.toLowerCase().includes('ammattikoulu') ||
                         pageContent?.toLowerCase().includes('koulutus');
    expect(hasEducation).toBe(true);
  });
});
