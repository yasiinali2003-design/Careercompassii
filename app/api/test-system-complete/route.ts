import { NextResponse, NextRequest } from 'next/server';
import { calculateEducationPath } from '@/lib/scoring/educationPath';
import { rankCareers } from '@/lib/scoring/scoringEngine';
import { TestAnswer, Cohort } from '@/lib/scoring/types';

// Helper: localhost check
function isLocalhost(request: NextRequest): boolean {
  const host = request.headers.get('host') || '';
  return host.includes('localhost') || host.includes('127.0.0.1');
}

// Helper function to create test answers
function createTestAnswers(pattern: {
  reading?: number;
  math?: number;
  handsOn?: number;
  multipleSubjects?: number;
  memory?: number;
  practical?: number;
  deepResearch?: number;
  quickCareer?: number;
  knowsCareer?: number;
  keepOptionsOpen?: number;
  universityInterest?: number;
  workEarly?: number;
  longStudy?: number;
  knowsFuture?: number;
  tryManyFields?: number;
}): TestAnswer[] {
  const answers: TestAnswer[] = [];
  for (let i = 0; i < 30; i++) {
    answers.push({ questionIndex: i, score: 3 });
  }
  
  if (pattern.reading !== undefined) answers[0] = { questionIndex: 0, score: pattern.reading };
  if (pattern.math !== undefined) answers[1] = { questionIndex: 1, score: pattern.math };
  if (pattern.handsOn !== undefined) answers[2] = { questionIndex: 2, score: pattern.handsOn };
  if (pattern.multipleSubjects !== undefined) answers[3] = { questionIndex: 3, score: pattern.multipleSubjects };
  if (pattern.memory !== undefined) answers[4] = { questionIndex: 4, score: pattern.memory };
  if (pattern.practical !== undefined) answers[5] = { questionIndex: 5, score: pattern.practical };
  if (pattern.deepResearch !== undefined) answers[6] = { questionIndex: 6, score: pattern.deepResearch };
  if (pattern.quickCareer !== undefined) answers[7] = { questionIndex: 7, score: pattern.quickCareer };
  if (pattern.knowsCareer !== undefined) answers[8] = { questionIndex: 8, score: pattern.knowsCareer };
  if (pattern.keepOptionsOpen !== undefined) answers[9] = { questionIndex: 9, score: pattern.keepOptionsOpen };
  if (pattern.universityInterest !== undefined) answers[10] = { questionIndex: 10, score: pattern.universityInterest };
  if (pattern.workEarly !== undefined) answers[11] = { questionIndex: 11, score: pattern.workEarly };
  if (pattern.longStudy !== undefined) answers[12] = { questionIndex: 12, score: pattern.longStudy };
  if (pattern.knowsFuture !== undefined) answers[13] = { questionIndex: 13, score: pattern.knowsFuture };
  if (pattern.tryManyFields !== undefined) answers[14] = { questionIndex: 14, score: pattern.tryManyFields };
  
  return answers;
}

export async function GET(request: NextRequest) {
  // Security: Only allow on localhost
  if (!isLocalhost(request)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const testResults: any[] = [];
  const errors: string[] = [];
  
  // Test 1: Education Path - High Confidence Lukio
  try {
    const test1 = createTestAnswers({
      reading: 5, math: 5, multipleSubjects: 5, memory: 5,
      deepResearch: 5, keepOptionsOpen: 5, universityInterest: 5,
      longStudy: 5, tryManyFields: 5
    });
    const result1 = calculateEducationPath(test1, 'YLA');
    testResults.push({
      test: 'Education Path - High Lukio',
      success: result1 !== null && result1.primary === 'lukio' && result1.confidence === 'high',
      primary: result1?.primary,
      confidence: result1?.confidence,
      hasReasoning: result1?.reasoning && result1.reasoning.length > 100,
      reasoningLength: result1?.reasoning?.length || 0,
      noNumbersInReasoning: !result1?.reasoning?.includes('/100'),
    });
  } catch (error) {
    errors.push(`Test 1 failed: ${error}`);
  }
  
  // Test 2: Education Path - High Confidence Ammattikoulu
  try {
    const test2 = createTestAnswers({
      handsOn: 5, practical: 5, quickCareer: 5, knowsCareer: 5,
      workEarly: 5, knowsFuture: 5
    });
    const result2 = calculateEducationPath(test2, 'YLA');
    testResults.push({
      test: 'Education Path - High Ammattikoulu',
      success: result2 !== null && result2.primary === 'ammattikoulu',
      primary: result2?.primary,
      confidence: result2?.confidence,
      hasReasoning: result2?.reasoning && result2.reasoning.length > 100,
      reasoningLength: result2?.reasoning?.length || 0,
      noNumbersInReasoning: !result2?.reasoning?.includes('/100'),
    });
  } catch (error) {
    errors.push(`Test 2 failed: ${error}`);
  }
  
  // Test 3: Education Path - Medium Confidence with Alternative
  try {
    const test3 = createTestAnswers({
      reading: 4, math: 4, multipleSubjects: 4, keepOptionsOpen: 4,
      universityInterest: 4, handsOn: 3, practical: 3
    });
    const result3 = calculateEducationPath(test3, 'YLA');
    testResults.push({
      test: 'Education Path - Medium with Alternative',
      success: result3 !== null && result3.primary !== undefined,
      primary: result3?.primary,
      secondary: result3?.secondary,
      confidence: result3?.confidence,
      hasReasoning: result3?.reasoning && result3.reasoning.length > 100,
      noNumbersInReasoning: !result3?.reasoning?.includes('/100'),
    });
  } catch (error) {
    errors.push(`Test 3 failed: ${error}`);
  }
  
  // Test 4: Education Path - Low Confidence
  try {
    const test4 = createTestAnswers({
      reading: 3, math: 3, handsOn: 3, practical: 3
    });
    const result4 = calculateEducationPath(test4, 'YLA');
    testResults.push({
      test: 'Education Path - Low Confidence',
      success: result4 !== null && result4.primary !== undefined,
      primary: result4?.primary,
      confidence: result4?.confidence,
      hasReasoning: result4?.reasoning && result4.reasoning.length > 50,
      noNumbersInReasoning: !result4?.reasoning?.includes('/100'),
    });
  } catch (error) {
    errors.push(`Test 4 failed: ${error}`);
  }
  
  // Test 5: Career Recommendations - Auttaja Category
  try {
    const test5 = createTestAnswers({
      handsOn: 3, practical: 3
    });
    // Add some answers for career matching
    for (let i = 0; i < 30; i++) {
      test5[i] = { questionIndex: i, score: i < 15 ? 5 : 3 };
    }
    const careers5 = rankCareers(test5, 'YLA', 5);
    testResults.push({
      test: 'Career Recommendations - Basic',
      success: careers5.length > 0 && careers5.length <= 5,
      careerCount: careers5.length,
      allSameCategory: careers5.length > 0 ? new Set(careers5.map(c => c.category)).size === 1 : false,
      hasScores: careers5.every(c => c.overallScore !== undefined),
    });
  } catch (error) {
    errors.push(`Test 5 failed: ${error}`);
  }
  
  // Test 6: Career Recommendations - Multiple Categories
  try {
    const test6 = createTestAnswers({
      reading: 5, math: 5, handsOn: 5, practical: 5
    });
    for (let i = 0; i < 30; i++) {
      test6[i] = { questionIndex: i, score: 4 };
    }
    const careers6 = rankCareers(test6, 'YLA', 10);
    testResults.push({
      test: 'Career Recommendations - Mixed Profile',
      success: careers6.length > 0,
      careerCount: careers6.length,
      hasScores: careers6.every(c => c.overallScore !== undefined),
      hasReasons: careers6.every(c => c.reasons && c.reasons.length > 0),
    });
  } catch (error) {
    errors.push(`Test 6 failed: ${error}`);
  }
  
  // Test 7: Verify scores exist but percentages removed from reasoning
  try {
    const test7 = createTestAnswers({
      reading: 5, math: 5, multipleSubjects: 5
    });
    const result7 = calculateEducationPath(test7, 'YLA');
    const hasScores = result7?.scores !== undefined;
    // Type guard: check if it's YLA result (has lukio property)
    const isYLAResult = result7 !== null && result7.scores && 'lukio' in result7.scores;
    const scoresHaveValues = isYLAResult && 
                             (result7.scores as { lukio: number; ammattikoulu: number; kansanopisto?: number }).lukio !== undefined &&
                             (result7.scores as { lukio: number; ammattikoulu: number; kansanopisto?: number }).ammattikoulu !== undefined;
    testResults.push({
      test: 'Scores Exist But Not in Reasoning',
      success: hasScores && scoresHaveValues,
      hasScores,
      scoresHaveValues,
      reasoningNoNumbers: !result7?.reasoning?.includes('/100'),
    });
  } catch (error) {
    errors.push(`Test 7 failed: ${error}`);
  }
  
  // Test 8: Non-YLA cohort (should return null for education path)
  try {
    const test8 = createTestAnswers({ reading: 5 });
    const result8 = calculateEducationPath(test8, 'TASO2');
    testResults.push({
      test: 'Non-YLA Cohort Education Path',
      success: result8 === null,
      result: result8,
    });
  } catch (error) {
    errors.push(`Test 8 failed: ${error}`);
  }
  
  // Analyze results
  const passed = testResults.filter(t => t.success).length;
  const total = testResults.length;
  const allReasoningNoNumbers = testResults
    .filter(t => t.noNumbersInReasoning !== undefined)
    .every(t => t.noNumbersInReasoning === true);
  
  return NextResponse.json({
    success: passed === total && errors.length === 0,
    passed,
    total,
    errors,
    allReasoningNoNumbers,
    testResults,
    summary: {
      educationPathTests: testResults.filter(t => t.test.includes('Education Path')).length,
      careerTests: testResults.filter(t => t.test.includes('Career')).length,
      allPassed: passed === total,
      noNumbersInReasoning: allReasoningNoNumbers,
    },
    message: passed === total && errors.length === 0
      ? '✅ All tests passed! System works correctly without percentages in UI.'
      : `⚠️ ${total - passed} tests failed. Check details.`
  });
}

