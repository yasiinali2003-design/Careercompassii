import { NextResponse } from 'next/server';
import { rankCareers } from '@/lib/scoring/scoringEngine';
import { TestAnswer, Cohort } from '@/lib/scoring/types';

// Create realistic test answers that map to specific categories
function createTestAnswers(pattern: 'people' | 'creative' | 'leadership' | 'technology' | 'hands_on'): TestAnswer[] {
  const answers: TestAnswer[] = [];
  
  // Fill all 30 questions with base scores
  for (let i = 0; i < 30; i++) {
    answers.push({ questionIndex: i, score: 3 }); // Neutral default
  }
  
  // Map specific questions to categories based on question mappings
  if (pattern === 'people') {
    // Questions that map to people interest, impact values, teaching workstyle
    answers[0] = { questionIndex: 0, score: 5 }; // Ryhmätyöskentely
    answers[4] = { questionIndex: 4, score: 5 }; // Auttaa muita ihmisiä
    answers[23] = { questionIndex: 23, score: 5 }; // Terveys ja hyvinvointi
    answers[25] = { questionIndex: 25, score: 5 }; // Vaikuttaa yhteiskuntaan
    answers[17] = { questionIndex: 17, score: 5 }; // Opettaminen ja ohjaus
  } else if (pattern === 'creative') {
    // Questions that map to creative interest, arts_culture
    answers[2] = { questionIndex: 2, score: 5 }; // Luova työ
    answers[3] = { questionIndex: 3, score: 5 }; // Taide ja kulttuuri
    answers[15] = { questionIndex: 15, score: 5 }; // Kirjoittaminen
    answers[20] = { questionIndex: 20, score: 5 }; // Mediatyö
  } else if (pattern === 'leadership') {
    // Questions that map to leadership workstyle, organization
    answers[0] = { questionIndex: 0, score: 5 }; // Ryhmätyöskentely
    answers[16] = { questionIndex: 16, score: 5 }; // Organisointi
    answers[18] = { questionIndex: 18, score: 5 }; // Suunnittelu
    answers[26] = { questionIndex: 26, score: 5 }; // Johtaminen
  } else if (pattern === 'technology') {
    // Questions that map to technology interest, innovation
    answers[1] = { questionIndex: 1, score: 5 }; // Teknologia
    answers[9] = { questionIndex: 9, score: 5 }; // Matematiikka ja tieteet
    answers[21] = { questionIndex: 21, score: 5 }; // Kehittää innovaatioita
    answers[27] = { questionIndex: 27, score: 5 }; // Ongelmien ratkaiseminen
  } else if (pattern === 'hands_on') {
    // Questions that map to hands_on interest, precision
    answers[5] = { questionIndex: 5, score: 5 }; // Käytännön työ
    answers[11] = { questionIndex: 11, score: 5 }; // Tekninen työ
    answers[19] = { questionIndex: 19, score: 5 }; // Tarkkuus
  }
  
  return answers;
}

const testProfiles = [
  { name: 'Helper Profile (auttaja)', pattern: 'people' as const, cohort: 'YLA' as Cohort },
  { name: 'Creative Profile (luova)', pattern: 'creative' as const, cohort: 'YLA' as Cohort },
  { name: 'Leader Profile (johtaja)', pattern: 'leadership' as const, cohort: 'TASO2' as Cohort },
  { name: 'Innovator Profile (innovoija)', pattern: 'technology' as const, cohort: 'NUORI' as Cohort },
  { name: 'Builder Profile (rakentaja)', pattern: 'hands_on' as const, cohort: 'YLA' as Cohort },
];

function runSingleTest(profile: typeof testProfiles[0], runNumber: number) {
  const results: any = {
    runNumber,
    profileName: profile.name,
    success: false,
    careers: [],
    categories: [],
    allSameCategory: false,
    error: null,
  };
  
  try {
    const answers = createTestAnswers(profile.pattern);
    const careers = rankCareers(answers, profile.cohort, 5);
    
    if (careers.length === 0) {
      results.error = 'No careers returned';
      return results;
    }
    
    // Check if all careers are from the same category
    const categories = new Set(careers.map(c => c.category));
    const uniqueCategories = Array.from(categories);
    
    results.careers = careers.map(c => ({
      title: c.title,
      category: c.category,
      score: c.overallScore,
    }));
    results.categories = uniqueCategories;
    results.allSameCategory = uniqueCategories.length === 1;
    results.success = uniqueCategories.length === 1;
    
  } catch (error) {
    results.error = error instanceof Error ? error.message : String(error);
  }
  
  return results;
}

export async function GET() {
  const iterations = 3;
  const allResults: any[] = [];
  const summary: Record<string, { passed: number; failed: number; total: number }> = {};
  
  // Initialize summary
  testProfiles.forEach(profile => {
    summary[profile.name] = { passed: 0, failed: 0, total: 0 };
  });
  
  // Run tests for each profile multiple times
  for (let iteration = 1; iteration <= iterations; iteration++) {
    for (const profile of testProfiles) {
      const testResult = runSingleTest(profile, iteration);
      allResults.push(testResult);
      
      summary[profile.name].total++;
      if (testResult.success) {
        summary[profile.name].passed++;
      } else {
        summary[profile.name].failed++;
      }
    }
  }
  
  const allPassed = Object.values(summary).every(s => s.passed === s.total);
  
  return NextResponse.json({
    success: allPassed,
    iterations,
    summary,
    detailedResults: allResults,
    message: allPassed 
      ? '✅ ALL TESTS PASSED! Career recommendations are focused on single category.' 
      : '⚠️ SOME TESTS FAILED. Check detailed results.',
  });
}

