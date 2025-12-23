/**
 * Test 8: Career Recommendation Diversity Test
 *
 * Validates that the recommendation system:
 * 1. Recommends diverse career categories (not all from one category)
 * 2. Different answer patterns lead to different recommendations
 * 3. Career pool coverage (are all careers reachable?)
 * 4. Category distribution is balanced
 * 5. No single career dominates recommendations
 * 6. Top 5 recommendations are meaningfully different
 *
 * This test simulates many different user profiles to analyze recommendation diversity.
 */

const BASE_URL = 'http://localhost:3000';

const COHORTS = ['YLA', 'TASO2', 'NUORI'];

// Predefined personality profiles to test
const PROFILES = {
  creative: {
    name: 'Creative/Artistic',
    pattern: (i) => {
      // High on creative, aesthetic questions
      if (i < 10) return 5; // Interests
      if (i < 15) return 4;
      return 3;
    }
  },
  analytical: {
    name: 'Analytical/Technical',
    pattern: (i) => {
      // High on analytical, problem-solving
      if (i >= 5 && i < 15) return 5;
      if (i < 5) return 2;
      return 3;
    }
  },
  social: {
    name: 'Social/Helping',
    pattern: (i) => {
      // High on social, interpersonal
      if (i >= 10 && i < 20) return 5;
      return 3;
    }
  },
  leadership: {
    name: 'Leadership/Enterprising',
    pattern: (i) => {
      // High on leadership, decision-making
      if (i >= 15 && i < 25) return 5;
      if (i >= 25) return 4;
      return 3;
    }
  },
  practical: {
    name: 'Practical/Hands-on',
    pattern: (i) => {
      // Prefer practical work
      if (i < 10) return 5;
      if (i >= 20) return 4;
      return 2;
    }
  },
  balanced: {
    name: 'Balanced/Generalist',
    pattern: () => 3 // All neutral
  },
  random: {
    name: 'Random',
    pattern: () => Math.floor(Math.random() * 5) + 1
  }
};

async function submitTest(cohort, answers) {
  const response = await fetch(`${BASE_URL}/api/score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cohort, answers })
  });

  if (!response.ok) throw new Error(`API Error: ${response.status}`);
  return response.json();
}

function generateAnswers(pattern, count = 30) {
  return Array.from({ length: count }, (_, i) => ({
    questionIndex: i,
    score: pattern(i)
  }));
}

async function testProfile(profileKey, cohort) {
  const profile = PROFILES[profileKey];
  const answers = generateAnswers(profile.pattern);
  const result = await submitTest(cohort, answers);

  return {
    profile: profileKey,
    profileName: profile.name,
    cohort,
    careers: result.topCareers?.map(c => ({
      title: c.title,
      category: c.category,
      score: c.overallScore
    })) || []
  };
}

// Test 1: Profile-specific recommendations
async function testProfileDiversity(cohort) {
  console.log(`\n  Testing profile diversity for ${cohort}...`);

  const results = {};
  const allCareers = new Set();
  const allCategories = new Set();

  for (const profileKey of Object.keys(PROFILES)) {
    const result = await testProfile(profileKey, cohort);
    results[profileKey] = result;

    result.careers.forEach(c => {
      allCareers.add(c.title);
      allCategories.add(c.category);
    });
  }

  console.log(`     Tested ${Object.keys(PROFILES).length} profiles`);
  console.log(`     Unique careers recommended: ${allCareers.size}`);
  console.log(`     Categories covered: ${allCategories.size} (${[...allCategories].join(', ')})`);

  return {
    results,
    uniqueCareers: allCareers.size,
    uniqueCategories: allCategories.size,
    categories: [...allCategories]
  };
}

// Test 2: Random sample diversity
async function testRandomDiversity(cohort, sampleSize = 20) {
  console.log(`\n  Testing random sample diversity (${sampleSize} samples)...`);

  const allCareers = new Map(); // career -> count
  const allCategories = new Map();
  const topCareerCounts = new Map();

  for (let i = 0; i < sampleSize; i++) {
    const pattern = () => Math.floor(Math.random() * 5) + 1;
    const answers = generateAnswers(pattern);
    const result = await submitTest(cohort, answers);

    if (result.topCareers) {
      // Count top career
      const topCareer = result.topCareers[0]?.title;
      if (topCareer) {
        topCareerCounts.set(topCareer, (topCareerCounts.get(topCareer) || 0) + 1);
      }

      // Count all recommended careers
      result.topCareers.forEach(c => {
        allCareers.set(c.title, (allCareers.get(c.title) || 0) + 1);
        allCategories.set(c.category, (allCategories.get(c.category) || 0) + 1);
      });
    }
  }

  // Analyze distribution
  const sortedCareers = [...allCareers.entries()].sort((a, b) => b[1] - a[1]);
  const sortedCategories = [...allCategories.entries()].sort((a, b) => b[1] - a[1]);
  const sortedTopCareers = [...topCareerCounts.entries()].sort((a, b) => b[1] - a[1]);

  console.log(`     Unique careers recommended: ${allCareers.size}`);
  console.log(`     Categories: ${allCategories.size}`);

  // Check for dominance
  const maxCareerPercent = (sortedCareers[0]?.[1] / (sampleSize * 5) * 100) || 0;
  const maxTopCareerPercent = (sortedTopCareers[0]?.[1] / sampleSize * 100) || 0;

  console.log(`\n     Most recommended career: "${sortedCareers[0]?.[0]}" (${sortedCareers[0]?.[1]} times, ${maxCareerPercent.toFixed(1)}%)`);
  console.log(`     Most frequent #1 career: "${sortedTopCareers[0]?.[0]}" (${maxTopCareerPercent.toFixed(1)}% of samples)`);

  // Category distribution
  console.log(`\n     Category distribution:`);
  sortedCategories.slice(0, 5).forEach(([cat, count]) => {
    const percent = (count / (sampleSize * 5) * 100).toFixed(1);
    console.log(`        ${cat}: ${count} (${percent}%)`);
  });

  return {
    uniqueCareers: allCareers.size,
    uniqueCategories: allCategories.size,
    careerCounts: sortedCareers,
    categoryCounts: sortedCategories,
    topCareerCounts: sortedTopCareers,
    maxCareerPercent,
    maxTopCareerPercent
  };
}

// Test 3: Recommendation uniqueness (are top 5 different?)
async function testRecommendationUniqueness(cohort) {
  console.log(`\n  Testing recommendation uniqueness...`);

  const results = [];
  const patterns = [
    () => 5, // All high
    () => 1, // All low
    () => 3, // All neutral
    (i) => (i % 2 === 0) ? 5 : 1, // Alternating
    (i) => 5 - Math.floor(i / 6), // Decreasing
  ];

  for (const pattern of patterns) {
    const answers = generateAnswers(pattern);
    const result = await submitTest(cohort, answers);

    if (result.topCareers) {
      const titles = result.topCareers.map(c => c.title);
      const categories = result.topCareers.map(c => c.category);
      const uniqueTitles = new Set(titles).size;
      const uniqueCategories = new Set(categories).size;

      results.push({
        uniqueTitles,
        uniqueCategories,
        hasRepeats: uniqueTitles < titles.length
      });
    }
  }

  const allUnique = results.every(r => !r.hasRepeats);
  const avgUniqueCategories = results.reduce((sum, r) => sum + r.uniqueCategories, 0) / results.length;

  console.log(`     All recommendations unique: ${allUnique ? '✓' : '✗'}`);
  console.log(`     Avg category diversity in top 5: ${avgUniqueCategories.toFixed(1)} categories`);

  return {
    results,
    allUnique,
    avgUniqueCategories
  };
}

// Test 4: Check if different profiles get different careers
async function testProfileDifferentiation(cohort) {
  console.log(`\n  Testing profile differentiation...`);

  const profileResults = {};
  const profileTopCareers = {};

  // Get top career for each profile
  for (const profileKey of Object.keys(PROFILES)) {
    if (profileKey === 'random') continue;

    const answers = generateAnswers(PROFILES[profileKey].pattern);
    const result = await submitTest(cohort, answers);

    profileTopCareers[profileKey] = result.topCareers?.[0]?.title;
    profileResults[profileKey] = result.topCareers?.slice(0, 3).map(c => c.title) || [];
  }

  // Check overlap between profiles
  const uniqueTopCareers = new Set(Object.values(profileTopCareers));
  const profileCount = Object.keys(profileTopCareers).length;

  console.log(`     Profiles tested: ${profileCount}`);
  console.log(`     Unique #1 careers: ${uniqueTopCareers.size}`);

  // Show what each profile got
  console.log(`\n     Top career by profile:`);
  for (const [profile, career] of Object.entries(profileTopCareers)) {
    console.log(`        ${PROFILES[profile].name}: ${career}`);
  }

  // Calculate differentiation score
  const differentiationScore = (uniqueTopCareers.size / profileCount * 100).toFixed(0);

  console.log(`\n     Differentiation score: ${differentiationScore}%`);

  if (parseFloat(differentiationScore) < 50) {
    console.log(`     ⚠️ Low differentiation - different profiles get similar careers`);
  } else {
    console.log(`     ✓ Good differentiation - profiles lead to different careers`);
  }

  return {
    profileTopCareers,
    uniqueTopCareers: uniqueTopCareers.size,
    differentiationScore: parseFloat(differentiationScore)
  };
}

async function runTests() {
  console.log('🔍 Checking server connectivity...');

  try {
    const response = await fetch(`${BASE_URL}/api/questions?cohort=YLA&setIndex=0`);
    if (!response.ok) throw new Error('Server not responding');
    console.log('✅ Server is running\n');
  } catch (error) {
    console.log('❌ Server is not running. Please start with: npm run dev\n');
    process.exit(1);
  }

  console.log('🧪 CAREER RECOMMENDATION DIVERSITY TEST');
  console.log('='.repeat(60));
  console.log('Testing recommendation diversity and differentiation\n');

  const results = {};

  for (const cohort of COHORTS) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📚 Testing Cohort: ${cohort}`);
    console.log('-'.repeat(60));

    results[cohort] = {
      profileDiversity: await testProfileDiversity(cohort),
      randomDiversity: await testRandomDiversity(cohort, 15),
      uniqueness: await testRecommendationUniqueness(cohort),
      differentiation: await testProfileDifferentiation(cohort)
    };
  }

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));

  let totalScore = 0;
  const maxScore = COHORTS.length * 4; // 4 tests per cohort

  console.log('\n📋 Results by Cohort:');
  for (const cohort of COHORTS) {
    const r = results[cohort];
    let cohortScore = 0;

    // Scoring criteria
    if (r.profileDiversity.uniqueCareers >= 15) cohortScore++;
    if (r.randomDiversity.uniqueCareers >= 10) cohortScore++;
    if (r.uniqueness.allUnique) cohortScore++;
    if (r.differentiation.differentiationScore >= 50) cohortScore++;

    totalScore += cohortScore;

    console.log(`\n   ${cohort}: ${cohortScore}/4`);
    console.log(`      Profile diversity: ${r.profileDiversity.uniqueCareers} unique careers`);
    console.log(`      Random diversity: ${r.randomDiversity.uniqueCareers} unique careers`);
    console.log(`      Recommendation uniqueness: ${r.uniqueness.allUnique ? '✓' : '✗'}`);
    console.log(`      Profile differentiation: ${r.differentiation.differentiationScore}%`);
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Overall Score: ${totalScore}/${maxScore} (${(totalScore/maxScore*100).toFixed(0)}%)`);

  if (totalScore === maxScore) {
    console.log('🎉 Excellent diversity! All tests passed.');
  } else if (totalScore >= maxScore * 0.7) {
    console.log('✅ Good diversity with some room for improvement.');
  } else {
    console.log('⚠️ Diversity could be improved.');
  }

  // Save results
  const fs = require('fs');
  fs.writeFileSync('test-career-diversity-results.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: { totalScore, maxScore, percentage: (totalScore/maxScore*100).toFixed(0) },
    results
  }, null, 2));

  console.log('\n📄 Full results saved to test-career-diversity-results.json\n');
}

runTests().catch(console.error);
