/**
 * Test to see what careers actually get recommended for healthcare answers
 */

import { rankCareers, generateUserProfile } from './lib/scoring/scoringEngine';
import type { TestAnswer, Cohort } from './lib/scoring/types';

function buildHealthcareAnswers(cohort: Cohort): TestAnswer[] {
  const answers: TestAnswer[] = [];
  
  if (cohort === 'TASO2') {
    // TASO2: Strong healthcare signals
    // Q7=health (healthcare/wellbeing), Q8=people (psychology), Q9=people (education), Q10=people (social work)
    for (let i = 0; i < 30; i++) {
      if (i === 7) { // Health (healthcare/wellbeing) - weight 1.4 - NOW MAPS TO HEALTH!
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 8 || i === 9 || i === 10) { // People (psychology, education, social work)
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 11) { // Social impact
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 12) { // Elder care
        answers.push({ questionIndex: i, score: 4 });
      } else if (i === 13) { // Health research
        answers.push({ questionIndex: i, score: 4 });
      } else if (i === 0 || i === 4 || i === 6 || i === 14) { // Technology (low)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 2 || i === 15) { // Creative (low)
        answers.push({ questionIndex: i, score: 2 });
      } else {
        answers.push({ questionIndex: i, score: 3 });
      }
    }
  } else if (cohort === 'NUORI') {
    // NUORI: Similar to TASO2
    for (let i = 0; i < 30; i++) {
      if (i === 1) { // Health
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 7 || i === 8 || i === 9 || i === 10) { // People
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 11) { // Social impact
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 12) { // Elder care
        answers.push({ questionIndex: i, score: 4 });
      } else if (i === 13) { // Health research
        answers.push({ questionIndex: i, score: 4 });
      } else if (i === 4 || i === 14) { // Technology (low)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 2 || i === 15) { // Creative (low)
        answers.push({ questionIndex: i, score: 2 });
      } else {
        answers.push({ questionIndex: i, score: 3 });
      }
    }
  } else { // YLA
    // YLA: Q16=people (care/helping), Q21=education (teaching), Q28=social
    for (let i = 0; i < 30; i++) {
      if (i === 16) { // Care/helping professions
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 21) { // Teaching/education
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 28) { // Social interaction
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 15 || i === 24) { // Technology (low)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 17) { // Creative (low)
        answers.push({ questionIndex: i, score: 2 });
      } else {
        answers.push({ questionIndex: i, score: 3 });
      }
    }
  }
  
  return answers;
}

async function testHealthcareRecommendations() {
  console.log('🏥 Testing Healthcare Career Recommendations\n');
  console.log('=' .repeat(60));
  
  const cohorts: Cohort[] = ['YLA', 'TASO2', 'NUORI'];
  const expectedHealthcareCareers = ['sairaanhoitaja', 'terveydenhoitaja', 'sosiaalityöntekijä', 'psykologi', 'fysioterapeutti'];
  
  for (const cohort of cohorts) {
    console.log(`\n📋 Cohort: ${cohort}`);
    console.log('-'.repeat(60));
    
    const answers = buildHealthcareAnswers(cohort);
    const userProfile = generateUserProfile(answers, cohort);
    const careers = rankCareers(answers, cohort, 10);
    
    // Show user profile scores
    if (userProfile.detailedScores) {
      const healthScore = userProfile.detailedScores.interests.health || 0;
      const peopleScore = userProfile.detailedScores.interests.people || 0;
      const educationScore = userProfile.detailedScores.interests.education || 0;
      
      console.log(`\n👤 User Profile Scores:`);
      console.log(`   Health interest: ${(healthScore * 100).toFixed(1)}%`);
      console.log(`   People interest: ${(peopleScore * 100).toFixed(1)}%`);
      console.log(`   Education interest: ${(educationScore * 100).toFixed(1)}%`);
    }
    
    console.log(`\n🎯 Top ${careers.length} Career Recommendations:`);
    console.log('');
    
    careers.forEach((career, index) => {
      const isHealthcare = expectedHealthcareCareers.includes(career.slug);
      const marker = isHealthcare ? '✅' : '  ';
      const healthScore = career.dimensionScores?.interests || 0;
      
      console.log(`${marker} ${index + 1}. ${career.title}`);
      console.log(`      Score: ${career.overallScore}% | Category: ${career.category} | Outlook: ${career.outlook || 'N/A'}`);
      console.log(`      Interests: ${healthScore}% | Values: ${career.dimensionScores?.values || 0}% | Workstyle: ${career.dimensionScores?.workstyle || 0}%`);
      console.log('');
    });
    
    // Check which expected careers were found
    const foundCareers = expectedHealthcareCareers.filter(slug =>
      careers.some(c => c.slug === slug)
    );
    
    console.log(`\n📊 Summary:`);
    console.log(`   Total recommendations: ${careers.length}`);
    console.log(`   Expected healthcare careers found: ${foundCareers.length}/${expectedHealthcareCareers.length}`);
    console.log(`   Found: ${foundCareers.join(', ') || 'None'}`);
    
    if (foundCareers.length === 0) {
      console.log(`\n   ⚠️  WARNING: No expected healthcare careers in top ${careers.length} recommendations!`);
      console.log(`   Top career: ${careers[0]?.title} (${careers[0]?.overallScore}%)`);
    }
    
    console.log('\n' + '='.repeat(60));
  }
}

testHealthcareRecommendations().catch(error => {
  console.error('❌ Test error:', error);
  process.exitCode = 1;
});

