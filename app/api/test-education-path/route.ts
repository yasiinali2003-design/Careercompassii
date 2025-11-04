import { NextResponse } from 'next/server';
import { calculateEducationPath } from '@/lib/scoring/educationPath';
import { TestAnswer, Cohort } from '@/lib/scoring/types';

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
  
  // Fill all 30 questions with neutral scores (3)
  for (let i = 0; i < 30; i++) {
    answers.push({ questionIndex: i, score: 3 });
  }
  
  // Map patterns to question indices (Q0-14 for education path)
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

export async function GET() {
  const testResults: any[] = [];
  
  // Test 1: High confidence Lukio with significant Ammattikoulu score
  const test1 = createTestAnswers({
    reading: 5,
    math: 5,
    multipleSubjects: 5,
    memory: 5,
    deepResearch: 5,
    keepOptionsOpen: 5,
    universityInterest: 5,
    longStudy: 5,
    tryManyFields: 5,
    handsOn: 3, // Some interest in practical
    practical: 3,
  });
  
  const result1 = calculateEducationPath(test1, 'YLA');
  testResults.push({
    test: 'High Lukio with Ammattikoulu alternative',
    primary: result1?.primary,
    scores: result1?.scores,
    confidence: result1?.confidence,
    reasoningLength: result1?.reasoning?.length || 0,
    hasAlternative: result1?.reasoning?.includes('Vaihtoehtoisesti') || false,
    reasoning: result1?.reasoning,
  });
  
  // Test 2: High confidence Ammattikoulu with significant Lukio score
  const test2 = createTestAnswers({
    handsOn: 5,
    practical: 5,
    quickCareer: 5,
    knowsCareer: 5,
    workEarly: 5,
    knowsFuture: 5,
    reading: 3, // Some interest in reading
    math: 3,
  });
  
  const result2 = calculateEducationPath(test2, 'YLA');
  testResults.push({
    test: 'High Ammattikoulu with Lukio alternative',
    primary: result2?.primary,
    scores: result2?.scores,
    confidence: result2?.confidence,
    reasoningLength: result2?.reasoning?.length || 0,
    hasAlternative: result2?.reasoning?.includes('Vaihtoehtoisesti') || false,
    reasoning: result2?.reasoning,
  });
  
  // Test 3: Medium confidence Lukio
  const test3 = createTestAnswers({
    reading: 4,
    math: 4,
    multipleSubjects: 4,
    keepOptionsOpen: 4,
    universityInterest: 4,
    handsOn: 3,
    practical: 3,
  });
  
  const result3 = calculateEducationPath(test3, 'YLA');
  testResults.push({
    test: 'Medium Lukio',
    primary: result3?.primary,
    scores: result3?.scores,
    confidence: result3?.confidence,
    reasoningLength: result3?.reasoning?.length || 0,
    hasAlternative: result3?.reasoning?.includes('Vaihtoehtoisesti') || false,
    reasoning: result3?.reasoning,
  });
  
  // Test 4: Low confidence Lukio
  const test4 = createTestAnswers({
    reading: 3,
    math: 3,
    multipleSubjects: 3,
    keepOptionsOpen: 3,
    handsOn: 3,
    practical: 3,
  });
  
  const result4 = calculateEducationPath(test4, 'YLA');
  testResults.push({
    test: 'Low Lukio',
    primary: result4?.primary,
    scores: result4?.scores,
    confidence: result4?.confidence,
    reasoningLength: result4?.reasoning?.length || 0,
    hasAlternative: result4?.reasoning?.includes('Vaihtoehtoisesti') || false,
    reasoning: result4?.reasoning,
  });
  
  // Test 5: High confidence Ammattikoulu
  const test5 = createTestAnswers({
    handsOn: 5,
    practical: 5,
    quickCareer: 5,
    knowsCareer: 5,
    workEarly: 5,
    knowsFuture: 5,
    reading: 2,
    universityInterest: 2,
  });
  
  const result5 = calculateEducationPath(test5, 'YLA');
  testResults.push({
    test: 'High Ammattikoulu',
    primary: result5?.primary,
    scores: result5?.scores,
    confidence: result5?.confidence,
    reasoningLength: result5?.reasoning?.length || 0,
    hasAlternative: result5?.reasoning?.includes('Vaihtoehtoisesti') || false,
    reasoning: result5?.reasoning,
  });
  
  // Test 6: Kansanopisto (unclear path)
  const test6 = createTestAnswers({
    reading: 2,
    math: 2,
    handsOn: 2,
    practical: 2,
    knowsCareer: 2,
    knowsFuture: 2,
    keepOptionsOpen: 2,
  });
  
  const result6 = calculateEducationPath(test6, 'YLA');
  testResults.push({
    test: 'Kansanopisto (unclear)',
    primary: result6?.primary,
    scores: result6?.scores,
    confidence: result6?.confidence,
    reasoningLength: result6?.reasoning?.length || 0,
    hasAlternative: result6?.reasoning?.includes('Vaihtoehtoisesti') || false,
    reasoning: result6?.reasoning,
  });
  
  // Analyze results
  const analysis = {
    totalTests: testResults.length,
    averageReasoningLength: Math.round(testResults.reduce((sum, t) => sum + t.reasoningLength, 0) / testResults.length),
    testsWithAlternative: testResults.filter(t => t.hasAlternative).length,
    confidenceDistribution: {
      high: testResults.filter(t => t.confidence === 'high').length,
      medium: testResults.filter(t => t.confidence === 'medium').length,
      low: testResults.filter(t => t.confidence === 'low').length,
    },
    allHaveReasoning: testResults.every(t => t.reasoning && t.reasoningLength > 100),
  };
  
  return NextResponse.json({
    success: analysis.allHaveReasoning,
    analysis,
    testResults,
    message: analysis.allHaveReasoning 
      ? '✅ All tests passed! Reasoning texts are detailed and comprehensive.' 
      : '⚠️ Some tests may have issues with reasoning generation.'
  });
}

