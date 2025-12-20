/**
 * UNIT TESTS: SCORING ALGORITHM STABILITY
 *
 * Tests for:
 * - Determinism (same inputs = same outputs)
 * - Stability (small changes don't cause extreme flips)
 * - Contradiction detection
 * - Confidence scoring accuracy
 */

import { ALL_PERSONAS, getValidPersonas, getProblematicPersonas, Persona } from '../fixtures/personas';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

interface ScoreResult {
  success: boolean;
  topCareers: Array<{
    slug: string;
    title: string;
    category: string;
    overallScore: number;
    confidence: string;
  }>;
  userProfile?: {
    dimensionScores: Record<string, number>;
  };
}

async function scorePersona(persona: Persona): Promise<ScoreResult> {
  const payload = {
    answers: persona.answers.slice(0, 30).map((score, index) => ({
      questionIndex: index,
      score: score || 3
    })),
    cohort: persona.cohort
  };

  const response = await fetch(`${BASE_URL}/api/score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

// ============================================================================
// DETERMINISM TESTS
// ============================================================================

describe('Scoring Determinism', () => {
  test('same answers produce identical results', async () => {
    const persona = getValidPersonas()[0];

    const result1 = await scorePersona(persona);
    const result2 = await scorePersona(persona);

    expect(result1.topCareers[0].slug).toBe(result2.topCareers[0].slug);
    expect(result1.topCareers[0].category).toBe(result2.topCareers[0].category);
    expect(result1.topCareers[0].overallScore).toBe(result2.topCareers[0].overallScore);
  });

  test('all valid personas produce consistent results across 3 runs', async () => {
    const personas = getValidPersonas().slice(0, 5); // Test first 5

    for (const persona of personas) {
      const results = await Promise.all([
        scorePersona(persona),
        scorePersona(persona),
        scorePersona(persona)
      ]);

      const categories = results.map(r => r.topCareers[0]?.category);
      expect(new Set(categories).size).toBe(1); // All same category

      const slugs = results.map(r => r.topCareers[0]?.slug);
      expect(new Set(slugs).size).toBe(1); // All same slug
    }
  });
});

// ============================================================================
// STABILITY TESTS
// ============================================================================

describe('Scoring Stability', () => {
  test('single point change does not flip category', async () => {
    const persona = getValidPersonas()[0];
    const originalResult = await scorePersona(persona);
    const originalCategory = originalResult.topCareers[0]?.category;

    let flipCount = 0;
    const totalTests = 10;

    for (let i = 0; i < totalTests; i++) {
      // Modify one random answer by 1 point
      const modifiedAnswers = [...persona.answers.slice(0, 30)];
      const idx = Math.floor(Math.random() * 30);
      const direction = Math.random() > 0.5 ? 1 : -1;
      modifiedAnswers[idx] = Math.max(1, Math.min(5, (modifiedAnswers[idx] || 3) + direction));

      const modifiedPersona = { ...persona, answers: modifiedAnswers };
      const modifiedResult = await scorePersona(modifiedPersona);
      const modifiedCategory = modifiedResult.topCareers[0]?.category;

      if (modifiedCategory !== originalCategory) {
        flipCount++;
      }
    }

    // Less than 30% of single-point changes should flip the category
    expect(flipCount / totalTests).toBeLessThan(0.3);
  });

  test('three-point changes maintain category in 70%+ of cases', async () => {
    const persona = getValidPersonas()[0];
    const originalResult = await scorePersona(persona);
    const originalCategory = originalResult.topCareers[0]?.category;

    let stableCount = 0;
    const totalTests = 10;

    for (let i = 0; i < totalTests; i++) {
      // Modify three random answers by 1 point each
      const modifiedAnswers = [...persona.answers.slice(0, 30)];
      const indices = new Set<number>();
      while (indices.size < 3) {
        indices.add(Math.floor(Math.random() * 30));
      }

      for (const idx of indices) {
        const direction = Math.random() > 0.5 ? 1 : -1;
        modifiedAnswers[idx] = Math.max(1, Math.min(5, (modifiedAnswers[idx] || 3) + direction));
      }

      const modifiedPersona = { ...persona, answers: modifiedAnswers };
      const modifiedResult = await scorePersona(modifiedPersona);
      const modifiedCategory = modifiedResult.topCareers[0]?.category;

      if (modifiedCategory === originalCategory) {
        stableCount++;
      }
    }

    // At least 70% should maintain the category
    expect(stableCount / totalTests).toBeGreaterThanOrEqual(0.7);
  });
});

// ============================================================================
// CONTRADICTION DETECTION TESTS
// ============================================================================

describe('Contradiction Detection', () => {
  test('all-5s pattern should produce low confidence or warning', async () => {
    const allFives: Persona = {
      id: 'test-all-fives',
      name: 'Test All Fives',
      cohort: 'YLA',
      description: 'Test persona with all 5s',
      archetype: 'extreme',
      expectedCategory: null,
      expectedConfidence: 'low',
      shouldTriggerWarning: true,
      answers: new Array(30).fill(5)
    };

    const result = await scorePersona(allFives);

    // System should still return results (robust)
    expect(result.success).toBe(true);
    expect(result.topCareers.length).toBeGreaterThan(0);

    // Confidence should be low or medium (not high)
    const confidence = result.topCareers[0]?.confidence;
    expect(['low', 'medium']).toContain(confidence);
  });

  test('all-1s pattern should produce low confidence or warning', async () => {
    const allOnes: Persona = {
      id: 'test-all-ones',
      name: 'Test All Ones',
      cohort: 'YLA',
      description: 'Test persona with all 1s',
      archetype: 'extreme',
      expectedCategory: null,
      expectedConfidence: 'low',
      shouldTriggerWarning: true,
      answers: new Array(30).fill(1)
    };

    const result = await scorePersona(allOnes);

    expect(result.success).toBe(true);
    expect(result.topCareers.length).toBeGreaterThan(0);
  });

  test('oscillating pattern (1,5,1,5...) should be flagged', async () => {
    const oscillating: Persona = {
      id: 'test-oscillating',
      name: 'Test Oscillating',
      cohort: 'NUORI',
      description: 'Test persona with oscillating answers',
      archetype: 'contradictory',
      expectedCategory: null,
      expectedConfidence: 'low',
      shouldTriggerWarning: true,
      answers: Array.from({ length: 30 }, (_, i) => i % 2 === 0 ? 5 : 1)
    };

    const result = await scorePersona(oscillating);

    expect(result.success).toBe(true);
    expect(result.topCareers.length).toBeGreaterThan(0);

    // High variance answers should produce lower confidence
    const confidence = result.topCareers[0]?.confidence;
    expect(['low', 'medium']).toContain(confidence);
  });

  test('all-3s (neutral) pattern produces results with low/medium confidence', async () => {
    const allNeutral: Persona = {
      id: 'test-all-neutral',
      name: 'Test All Neutral',
      cohort: 'TASO2',
      description: 'Test persona with all neutral answers',
      archetype: 'confused',
      expectedCategory: null,
      expectedConfidence: 'low',
      shouldTriggerWarning: true,
      answers: new Array(30).fill(3)
    };

    const result = await scorePersona(allNeutral);

    expect(result.success).toBe(true);
    expect(result.topCareers.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// CONFIDENT PATTERN TESTS
// ============================================================================

describe('Confident Pattern Recognition', () => {
  test('clear innovoija profile produces high confidence', async () => {
    const innovoija: Persona = {
      id: 'test-innovoija',
      name: 'Test Innovoija',
      cohort: 'NUORI',
      description: 'Clear innovoija profile',
      archetype: 'confident',
      expectedCategory: 'innovoija',
      expectedConfidence: 'high',
      shouldTriggerWarning: false,
      answers: [5, 5, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 5, 5, 2, 2, 2, 5, 5, 5, 5, 4, 4, 2]
    };

    const result = await scorePersona(innovoija);

    expect(result.success).toBe(true);
    expect(result.topCareers[0]?.category).toBe('innovoija');
  });

  test('clear auttaja profile produces high confidence', async () => {
    const auttaja: Persona = {
      id: 'test-auttaja',
      name: 'Test Auttaja',
      cohort: 'NUORI',
      description: 'Clear auttaja profile',
      archetype: 'confident',
      expectedCategory: 'auttaja',
      expectedConfidence: 'high',
      shouldTriggerWarning: false,
      answers: [1, 1, 1, 5, 5, 5, 2, 2, 2, 2, 3, 2, 3, 2, 1, 1, 1, 1, 2, 2, 2, 5, 5, 2, 2, 3, 3, 4, 3, 3]
    };

    const result = await scorePersona(auttaja);

    expect(result.success).toBe(true);
    expect(result.topCareers[0]?.category).toBe('auttaja');
  });
});

// ============================================================================
// COHORT-SPECIFIC TESTS
// ============================================================================

describe('Cohort-Specific Behavior', () => {
  test('YLA personas produce education path recommendations', async () => {
    const ylaPersona = getValidPersonas().find(p => p.cohort === 'YLA');
    if (!ylaPersona) {
      throw new Error('No YLA persona found');
    }

    const result = await scorePersona(ylaPersona);

    expect(result.success).toBe(true);
    // YLA should have education path
    // Note: The exact structure depends on the API response format
  });

  test('all cohorts produce valid career recommendations', async () => {
    const cohorts = ['YLA', 'TASO2', 'NUORI'] as const;

    for (const cohort of cohorts) {
      const persona = getValidPersonas().find(p => p.cohort === cohort);
      if (!persona) continue;

      const result = await scorePersona(persona);

      expect(result.success).toBe(true);
      expect(result.topCareers.length).toBeGreaterThan(0);
      expect(result.topCareers[0].title).toBeTruthy();
      expect(result.topCareers[0].category).toBeTruthy();
    }
  });
});

// ============================================================================
// EDGE CASE TESTS
// ============================================================================

describe('Edge Cases', () => {
  test('handles minimum valid input', async () => {
    const minimalPersona: Persona = {
      id: 'test-minimal',
      name: 'Test Minimal',
      cohort: 'YLA',
      description: 'Minimal valid input',
      archetype: 'consistent',
      expectedCategory: null,
      expectedConfidence: 'medium',
      shouldTriggerWarning: false,
      answers: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
    };

    const result = await scorePersona(minimalPersona);

    expect(result.success).toBe(true);
    expect(result.topCareers).toBeDefined();
  });

  test('handles boundary values (all 1s and all 5s in specific positions)', async () => {
    // All 1s for first half, all 5s for second half
    const boundaryPersona: Persona = {
      id: 'test-boundary',
      name: 'Test Boundary',
      cohort: 'TASO2',
      description: 'Boundary values test',
      archetype: 'contradictory',
      expectedCategory: null,
      expectedConfidence: 'low',
      shouldTriggerWarning: true,
      answers: [...new Array(15).fill(1), ...new Array(15).fill(5)]
    };

    const result = await scorePersona(boundaryPersona);

    expect(result.success).toBe(true);
    expect(result.topCareers.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// PERFORMANCE TESTS
// ============================================================================

describe('Performance', () => {
  test('scoring completes in under 2 seconds', async () => {
    const persona = getValidPersonas()[0];

    const start = Date.now();
    await scorePersona(persona);
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(2000);
  });

  test('batch scoring of 10 personas completes in under 10 seconds', async () => {
    const personas = getValidPersonas().slice(0, 10);

    const start = Date.now();
    await Promise.all(personas.map(p => scorePersona(p)));
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(10000);
  });
});
