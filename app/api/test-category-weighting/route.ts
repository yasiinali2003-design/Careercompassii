import { NextResponse, NextRequest } from 'next/server';
import { rankCareers } from '@/lib/scoring/scoringEngine';
import { TestAnswer } from '@/lib/scoring/types';

// Helper: localhost check
function isLocalhost(request: NextRequest): boolean {
  const host = request.headers.get('host') || '';
  return host.includes('localhost') || host.includes('127.0.0.1');
}

// Helper function to create test answers
function createTestAnswers(pattern: {
  interests?: Record<string, number>;
  workstyle?: Record<string, number>;
  values?: Record<string, number>;
}): TestAnswer[] {
  const answers: TestAnswer[] = [];
  for (let i = 0; i < 30; i++) {
    answers.push({ questionIndex: i, score: 3 });
  }
  
  // Map patterns to question indices
  if (pattern.interests?.health) {
    answers[23] = { questionIndex: 23, score: 5 };
  }
  if (pattern.interests?.education) {
    answers[17] = { questionIndex: 17, score: 5 };
  }
  if (pattern.interests?.people) {
    answers[0] = { questionIndex: 0, score: 5 };
    answers[4] = { questionIndex: 4, score: 5 };
  }
  if (pattern.interests?.creative) {
    answers[2] = { questionIndex: 2, score: 5 };
    answers[3] = { questionIndex: 3, score: 5 };
  }
  if (pattern.interests?.writing) {
    answers[15] = { questionIndex: 15, score: 5 };
  }
  if (pattern.interests?.technology) {
    answers[1] = { questionIndex: 1, score: 5 };
    answers[9] = { questionIndex: 9, score: 5 };
  }
  if (pattern.interests?.innovation) {
    answers[21] = { questionIndex: 21, score: 5 };
  }
  if (pattern.workstyle?.teaching) {
    answers[17] = { questionIndex: 17, score: 5 };
  }
  if (pattern.workstyle?.teamwork) {
    answers[0] = { questionIndex: 0, score: 5 };
  }
  if (pattern.values?.impact) {
    answers[25] = { questionIndex: 25, score: 5 };
  }
  if (pattern.values?.social_impact) {
    answers[25] = { questionIndex: 25, score: 5 };
  }
  
  return answers;
}

export async function GET(request: NextRequest) {
  // Security: Only allow on localhost
  if (!isLocalhost(request)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const results: any = {
    test1: { name: 'Health-focused Auttaja', passed: false, details: {} },
    test2: { name: 'Education-focused Auttaja', passed: false, details: {} },
    test3: { name: 'Creative-focused Luova', passed: false, details: {} },
    test4: { name: 'Technology-focused Innovoija', passed: false, details: {} },
  };
  
  // Test 1: Health-focused auttaja
  try {
    const answers1 = createTestAnswers({
      interests: { health: 0.9, people: 0.8, education: 0.3 },
      workstyle: { teamwork: 0.9, teaching: 0.4 },
      values: { impact: 0.9, social_impact: 0.8 }
    });
    const careers1 = rankCareers(answers1, 'YLA', 10);
    const sairaanhoitaja = careers1.find(c => c.slug === 'sairaanhoitaja');
    const luokanopettaja = careers1.find(c => c.slug === 'luokanopettaja');
    if (sairaanhoitaja && luokanopettaja) {
      results.test1.passed = sairaanhoitaja.overallScore >= luokanopettaja.overallScore;
      results.test1.details = {
        sairaanhoitaja: { rank: careers1.indexOf(sairaanhoitaja) + 1, score: sairaanhoitaja.overallScore },
        luokanopettaja: { rank: careers1.indexOf(luokanopettaja) + 1, score: luokanopettaja.overallScore }
      };
    }
  } catch (error) {
    results.test1.error = error instanceof Error ? error.message : String(error);
  }
  
  // Test 2: Education-focused auttaja
  try {
    const answers2 = createTestAnswers({
      interests: { health: 0.3, people: 0.8, education: 0.9, creative: 0.8 },
      workstyle: { teamwork: 0.9, teaching: 0.9, organization: 0.8 },
      values: { impact: 0.9, social_impact: 0.7 }
    });
    const careers2 = rankCareers(answers2, 'YLA', 10);
    const sairaanhoitaja = careers2.find(c => c.slug === 'sairaanhoitaja');
    const luokanopettaja = careers2.find(c => c.slug === 'luokanopettaja');
    if (sairaanhoitaja && luokanopettaja) {
      results.test2.passed = luokanopettaja.overallScore >= sairaanhoitaja.overallScore;
      results.test2.details = {
        sairaanhoitaja: { rank: careers2.indexOf(sairaanhoitaja) + 1, score: sairaanhoitaja.overallScore },
        luokanopettaja: { rank: careers2.indexOf(luokanopettaja) + 1, score: luokanopettaja.overallScore }
      };
    }
  } catch (error) {
    results.test2.error = error instanceof Error ? error.message : String(error);
  }
  
  // Test 3: Creative-focused luova
  try {
    const answers3 = createTestAnswers({
      interests: { creative: 0.9, arts_culture: 0.9, writing: 0.9, technology: 0.3 },
      workstyle: { independence: 0.8 },
      values: { entrepreneurship: 0.6 }
    });
    const careers3 = rankCareers(answers3, 'YLA', 10);
    const top3 = careers3.slice(0, 3).map(c => ({ title: c.title, score: c.overallScore }));
    const hasCreative = top3.some(c => 
      c.title.toLowerCase().includes('kirjailija') || 
      c.title.toLowerCase().includes('animaattori') ||
      c.title.toLowerCase().includes('taide')
    );
    results.test3.passed = hasCreative;
    results.test3.details = { top3 };
  } catch (error) {
    results.test3.error = error instanceof Error ? error.message : String(error);
  }
  
  // Test 4: Technology-focused innovoija
  try {
    const answers4 = createTestAnswers({
      interests: { technology: 0.9, innovation: 0.9, analytical: 0.8, business: 0.3 },
      workstyle: { problem_solving: 0.9 },
      values: { entrepreneurship: 0.7 }
    });
    const careers4 = rankCareers(answers4, 'YLA', 10);
    const top3 = careers4.slice(0, 3).map(c => ({ title: c.title, score: c.overallScore }));
    const hasTech = top3.some(c => 
      c.title.toLowerCase().includes('tekoäly') || 
      c.title.toLowerCase().includes('data') ||
      c.title.toLowerCase().includes('insinööri')
    );
    results.test4.passed = hasTech;
    results.test4.details = { top3 };
  } catch (error) {
    results.test4.error = error instanceof Error ? error.message : String(error);
  }
  
  const passed = Object.values(results).filter((r: any) => r.passed).length;
  const total = Object.keys(results).length;
  
  return NextResponse.json({
    success: passed === total,
    passed,
    total,
    results,
    message: passed === total 
      ? '✅ All category weighting tests passed!' 
      : `⚠️ ${passed}/${total} tests passed. Check details for failures.`
  });
}

