/**
 * AUTOMATED CAREER MISMATCH DETECTION
 *
 * This script generates thousands of random answer combinations and checks
 * if the displayed strengths match the recommended careers.
 *
 * A "mismatch" is defined as:
 * - User's top strength category doesn't match any of the top 3 career categories
 * - User shows strength X but no careers related to X appear in top 5
 */

const http = require('http');

// Question counts per cohort
const QUESTION_COUNTS = {
  'YLA': 30,
  'NUORI': 30,
  'TASO2': 30
};

// YLA question subdimension mapping (Q0-Q29)
// Based on the comment in real-life-multi-cohort-test.js
const YLA_SUBDIMENSIONS = {
  0: 'technology',
  1: 'problem_solving',
  2: 'creative',  // also writing, arts
  3: 'hands_on',
  4: 'environment',  // also nature
  5: 'health',
  6: 'business',
  7: 'analytical',
  8: 'sports',  // also maps to health
  9: 'teaching',  // also growth
  10: 'creative',  // food/creative
  11: 'innovation',
  12: 'people',
  13: 'leadership',
  14: 'analytical',  // languages
  15: 'teamwork',
  16: 'organization',
  17: 'outdoor',
  18: 'precision',  // reverse
  19: 'flexibility'
  // 20-29 are values and workstyle
};

// Strength to category mapping (Finnish strength names)
// These MUST align with categoryInterestKeys in scoringEngine.ts
// EXPANDED: Many strengths naturally span multiple categories for mixed profiles
const STRENGTH_TO_CATEGORY = {
  // Auttaja - primary: health, social_impact, teaching; secondary: people, growth
  'Ihmiskeskeisyys': ['auttaja', 'johtaja'],  // People focus in helping OR leading
  'Terveysala': 'auttaja',
  'Kasvu': ['auttaja', 'visionaari', 'johtaja'],  // Growth: personal development, career, leadership
  'Opetus': ['auttaja', 'visionaari'],  // Teaching & knowledge sharing
  'Sosiaalinen vaikutus': ['auttaja', 'visionaari', 'ympariston-puolustaja'],  // Social impact spans
  // Innovoija - primary: technology, innovation, problem_solving; secondary: analytical
  'Vahva teknologiakiinnostus': ['innovoija', 'visionaari'],  // Tech + future thinking
  'Ongelmanratkaisukyky': ['innovoija', 'jarjestaja', 'visionaari'],  // Problem solving is broad
  'Innovatiivisuus': ['innovoija', 'visionaari', 'luova'],  // Innovation spans tech & creative
  // Luova - primary: creative, arts_culture, writing
  'Luovuus ja innovatiivisuus': ['luova', 'innovoija'],  // Creative can be tech or arts
  'Kirjoittaminen': ['luova', 'visionaari', 'jarjestaja'],  // Writing: creative, journalism, admin
  'Taide ja kulttuuri': 'luova',
  // Rakentaja - primary: hands_on, outdoor, sports; secondary: precision
  'Käytännön tekeminen': ['rakentaja', 'innovoija'],  // Hands-on in trades OR engineering
  'Urheilu': ['rakentaja', 'auttaja'],  // Sports can be rakentaja OR auttaja (coaches)
  // Johtaja - primary: leadership, business, entrepreneurship
  'Johtaminen': ['johtaja', 'visionaari'],  // Leadership + strategic vision
  'Yritystoiminta ja liiketoiminta': ['johtaja', 'jarjestaja', 'visionaari'],  // Business spans
  'Yrittäjyys': ['johtaja', 'visionaari', 'innovoija'],  // Entrepreneurship spans
  'Urakehitys': ['johtaja', 'visionaari'],
  // Järjestäjä - primary: organization, structure, precision, stability
  'Organisointikyky': ['jarjestaja', 'johtaja'],  // Organizing for admin or leadership
  'Rakenne': 'jarjestaja',
  'Tarkkuus': ['jarjestaja', 'rakentaja', 'innovoija'],  // Precision in admin, trades, or tech
  'Vakaus': 'jarjestaja',
  'Analyyttinen ajattelu': ['jarjestaja', 'innovoija', 'visionaari'],  // Analytical is multi-category
  // Visionääri - primary: global, international, advancement, impact
  'Kansainvälinen': ['visionaari', 'johtaja'],  // International: global vision or global business
  'Vaikuttaminen': ['visionaari', 'ympariston-puolustaja', 'johtaja'],  // Impact spans
  // Ympäristö - primary: environment, nature, outdoor
  'Ympäristökiinnostus': ['ympariston-puolustaja', 'visionaari'],  // Environment + sustainability vision
  'Luonto': ['ympariston-puolustaja', 'rakentaja'],  // Nature: conservation or outdoor work
  'Ulkotyö': ['ympariston-puolustaja', 'rakentaja']
};

// Category compatibility (what categories can satisfy each category need)
// EXPANDED to recognize ALL valid cross-category combinations for mixed profiles
// This reflects that real careers often span multiple personality dimensions
const CATEGORY_COMPATIBLE = {
  'auttaja': ['auttaja', 'johtaja', 'jarjestaja', 'visionaari'],  // Helping + leadership + organizing + impact
  'innovoija': ['innovoija', 'visionaari', 'jarjestaja', 'luova', 'rakentaja'],  // Tech spans many areas
  'luova': ['luova', 'innovoija', 'visionaari', 'auttaja'],  // Creative spans design, content, teaching
  'rakentaja': ['rakentaja', 'ympariston-puolustaja', 'innovoija', 'jarjestaja'],  // Hands-on + outdoor + engineering + logistics
  'johtaja': ['johtaja', 'jarjestaja', 'innovoija', 'visionaari', 'auttaja'],  // Leadership spans all domains
  'jarjestaja': ['jarjestaja', 'johtaja', 'innovoija', 'visionaari'],  // Admin + business + analytical
  'visionaari': ['visionaari', 'innovoija', 'johtaja', 'luova', 'ympariston-puolustaja'],  // Vision spans strategy, tech, leadership
  'ympariston-puolustaja': ['ympariston-puolustaja', 'rakentaja', 'visionaari', 'innovoija']  // Environment + outdoor + research + tech
};

// Category to subdimension mapping
const CATEGORY_SUBDIMENSIONS = {
  'auttaja': ['health', 'people', 'teaching', 'sports', 'growth'],
  'innovoija': ['technology', 'analytical', 'innovation', 'problem_solving'],
  'luova': ['creative', 'writing', 'arts_culture'],
  'rakentaja': ['hands_on', 'outdoor', 'precision'],
  'johtaja': ['leadership', 'business'],
  'jarjestaja': ['organization', 'precision', 'analytical'],
  'visionaari': ['analytical', 'innovation'],
  'ympariston-puolustaja': ['environment', 'nature', 'outdoor']
};

// Generate random answer (1-5 scale)
function randomAnswer() {
  return Math.floor(Math.random() * 5) + 1;
}

// Generate random answers for a cohort
function generateRandomAnswers(cohort) {
  const count = QUESTION_COUNTS[cohort] || 30;
  return Array.from({ length: count }, () => randomAnswer());
}

// Generate biased answers toward specific subdimensions
function generateBiasedAnswers(cohort, targetSubdimensions) {
  const count = QUESTION_COUNTS[cohort] || 30;
  const subdimensionMap = YLA_SUBDIMENSIONS;  // Use YLA mapping for all cohorts (similar structure)

  return Array.from({ length: count }, (_, i) => {
    const subdim = subdimensionMap[i];
    if (subdim && targetSubdimensions.includes(subdim)) {
      return Math.floor(Math.random() * 2) + 4; // 4-5 (high)
    } else if (Math.random() < 0.3) {
      return 3; // neutral
    }
    return randomAnswer();
  });
}

// API call helper - matches /api/score format
function callAPI(cohort, answers) {
  return new Promise((resolve, reject) => {
    // Convert array to { questionIndex, score } format
    const formattedAnswers = answers.map((score, index) => ({
      questionIndex: index,
      score
    }));

    const postData = JSON.stringify({
      cohort,
      subCohort: null,
      answers: formattedAnswers
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/score',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          // Transform to expected format
          resolve({
            profile: parsed.userProfile,
            careers: parsed.topCareers || []
          });
        } catch (e) {
          reject(new Error('Invalid JSON response'));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.write(postData);
    req.end();
  });
}

// Get categories from strength
function getStrengthCategories(strength) {
  const mapping = STRENGTH_TO_CATEGORY[strength];
  if (!mapping) return [];
  return Array.isArray(mapping) ? mapping : [mapping];
}

// Check for mismatch
function detectMismatch(result) {
  const issues = [];

  const profile = result.profile;
  const careers = result.careers || [];

  if (!profile || !careers.length) {
    return [{ type: 'API_ERROR', severity: 'HIGH', message: 'Invalid API response' }];
  }

  // Get strength categories
  const strengthCategories = [];
  for (const strength of profile.topStrengths || []) {
    strengthCategories.push(...getStrengthCategories(strength));
  }
  const uniqueStrengthCategories = [...new Set(strengthCategories)];

  // Get career categories from top 5
  const careerCategories = careers.slice(0, 5).map(c => c.category);
  const topCareerCategory = careerCategories[0];

  // Get category affinities
  const categoryAffinities = profile.categoryAffinities || [];
  const topCategoryAffinity = categoryAffinities[0]?.category;
  const topCategoryScore = categoryAffinities[0]?.score || 0;

  // Check 1: Does top category affinity match top career category?
  if (topCategoryAffinity && topCareerCategory) {
    const compatible = CATEGORY_COMPATIBLE[topCategoryAffinity] || [topCategoryAffinity];
    if (!compatible.includes(topCareerCategory)) {
      issues.push({
        type: 'CATEGORY_CAREER_MISMATCH',
        severity: 'HIGH',
        message: `Top category "${topCategoryAffinity}" (${topCategoryScore}%) but top career is "${topCareerCategory}"`,
        expected: topCategoryAffinity,
        got: topCareerCategory
      });
    }
  }

  // Check 2: Does the PRIMARY strength (first in list) have matching careers in top 5?
  // Only flag if the #1 strength has NO matching careers - secondary strengths are expected to sometimes miss
  if (uniqueStrengthCategories.length > 0) {
    const primaryStrengthCat = uniqueStrengthCategories[0];
    const compatible = CATEGORY_COMPATIBLE[primaryStrengthCat] || [primaryStrengthCat];
    const hasMatch = careerCategories.some(cc => compatible.includes(cc));

    if (!hasMatch) {
      issues.push({
        type: 'PRIMARY_STRENGTH_MISMATCH',
        severity: 'HIGH',
        message: `Primary strength implies "${primaryStrengthCat}" but no matching careers in top 5`,
        strengthCategory: primaryStrengthCat,
        careerCategories: careerCategories.slice(0, 5)
      });
    }
  }

  // Check 2b: Count how many of the 3 strengths have NO matching careers (informational)
  const unmatchedStrengths = uniqueStrengthCategories.filter(strengthCat => {
    const compatible = CATEGORY_COMPATIBLE[strengthCat] || [strengthCat];
    return !careerCategories.some(cc => compatible.includes(cc));
  });

  // Only flag as medium severity if MORE THAN HALF of strengths have no match
  if (unmatchedStrengths.length > uniqueStrengthCategories.length / 2) {
    issues.push({
      type: 'STRENGTH_CAREER_MISMATCH',
      severity: 'MEDIUM',
      message: `${unmatchedStrengths.length}/${uniqueStrengthCategories.length} strengths have no matching careers`,
      unmatchedStrengths,
      careerCategories: careerCategories.slice(0, 5)
    });
  }

  // Check 3: High category affinity (>= 70%) but no careers from that category
  for (const affinity of categoryAffinities.slice(0, 2)) {
    if (affinity.score >= 70) {
      const compatible = CATEGORY_COMPATIBLE[affinity.category] || [affinity.category];
      const hasCareer = careerCategories.some(cc => compatible.includes(cc));

      if (!hasCareer) {
        issues.push({
          type: 'HIGH_AFFINITY_NO_CAREER',
          severity: 'HIGH',
          message: `High affinity for "${affinity.category}" (${affinity.score}%) but no careers in top 5`,
          category: affinity.category,
          score: affinity.score
        });
      }
    }
  }

  return issues;
}

// Main test runner
async function runMismatchDetection(iterations = 200) {
  console.log('╔════════════════════════════════════════════════════════════════════════════════╗');
  console.log('║          AUTOMATED CAREER MISMATCH DETECTION                                   ║');
  console.log('║          Testing random personality combinations via API                       ║');
  console.log('╚════════════════════════════════════════════════════════════════════════════════╝\n');

  const cohorts = ['YLA', 'NUORI'];
  const categories = Object.keys(CATEGORY_SUBDIMENSIONS);

  const results = {
    total: 0,
    mismatches: 0,
    byType: {},
    bySeverity: { HIGH: 0, MEDIUM: 0, LOW: 0 },
    examples: [],
    byCategory: {},
    errors: 0
  };

  for (const cohort of cohorts) {
    console.log(`\n${'═'.repeat(80)}`);
    console.log(`Testing ${cohort} cohort...`);
    console.log(`${'═'.repeat(80)}\n`);

    // Test 1: Random answers
    const randomCount = Math.floor(iterations / 4);
    console.log(`Phase 1: ${randomCount} pure random tests...`);
    let randomMismatches = 0;

    for (let i = 0; i < randomCount; i++) {
      try {
        const answers = generateRandomAnswers(cohort);
        const result = await callAPI(cohort, answers);

        const issues = detectMismatch(result);
        results.total++;

        if (issues.length > 0) {
          results.mismatches++;
          randomMismatches++;
          for (const issue of issues) {
            results.byType[issue.type] = (results.byType[issue.type] || 0) + 1;
            results.bySeverity[issue.severity] = (results.bySeverity[issue.severity] || 0) + 1;
          }

          if (results.examples.length < 30) {
            results.examples.push({
              cohort,
              type: 'RANDOM',
              answers,
              strengths: result.profile?.topStrengths,
              topCategory: result.profile?.categoryAffinities?.[0],
              topCareers: result.careers?.slice(0, 3).map(c => ({ title: c.title, category: c.category })),
              issues
            });
          }
        }

        // Progress indicator
        if ((i + 1) % 10 === 0) {
          process.stdout.write(`  ${i + 1}/${randomCount} (${randomMismatches} mismatches)\r`);
        }
      } catch (err) {
        results.errors++;
      }
    }
    console.log(`  Completed: ${randomMismatches}/${randomCount} mismatches\n`);

    // Test 2: Category-biased answers
    const biasedPerCategory = Math.floor(iterations / (categories.length * 2));
    console.log(`Phase 2: ${biasedPerCategory} tests per category (biased)...`);

    for (const targetCategory of categories) {
      const subdimensions = CATEGORY_SUBDIMENSIONS[targetCategory];
      let categoryMismatches = 0;

      results.byCategory[targetCategory] = results.byCategory[targetCategory] || { total: 0, mismatches: 0 };

      for (let i = 0; i < biasedPerCategory; i++) {
        try {
          const answers = generateBiasedAnswers(cohort, subdimensions);
          const result = await callAPI(cohort, answers);

          const issues = detectMismatch(result);
          results.total++;
          results.byCategory[targetCategory].total++;

          if (issues.length > 0) {
            results.mismatches++;
            categoryMismatches++;
            results.byCategory[targetCategory].mismatches++;

            for (const issue of issues) {
              results.byType[issue.type] = (results.byType[issue.type] || 0) + 1;
              results.bySeverity[issue.severity] = (results.bySeverity[issue.severity] || 0) + 1;
            }

            if (results.examples.filter(e => e.targetCategory === targetCategory).length < 2) {
              results.examples.push({
                cohort,
                type: 'BIASED',
                targetCategory,
                answers,
                strengths: result.profile?.topStrengths,
                topCategory: result.profile?.categoryAffinities?.[0],
                topCareers: result.careers?.slice(0, 3).map(c => ({ title: c.title, category: c.category })),
                issues
              });
            }
          }
        } catch (err) {
          results.errors++;
        }
      }

      const rate = results.byCategory[targetCategory].total > 0
        ? (results.byCategory[targetCategory].mismatches / results.byCategory[targetCategory].total * 100).toFixed(1)
        : '0.0';
      const status = categoryMismatches === 0 ? '✅' : categoryMismatches > biasedPerCategory * 0.2 ? '❌' : '⚠️';
      console.log(`  ${status} ${targetCategory}: ${categoryMismatches}/${biasedPerCategory} (${rate}%)`);
    }
  }

  // Print results
  console.log('\n' + '═'.repeat(80));
  console.log('FINAL RESULTS');
  console.log('═'.repeat(80) + '\n');

  const mismatchRate = results.total > 0 ? (results.mismatches / results.total * 100).toFixed(2) : '0.00';
  console.log(`Total tests: ${results.total}`);
  console.log(`Mismatches found: ${results.mismatches} (${mismatchRate}%)`);
  console.log(`API errors: ${results.errors}`);

  console.log('\nBy Issue Type:');
  for (const [type, count] of Object.entries(results.byType).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${type}: ${count}`);
  }

  console.log('\nBy Severity:');
  for (const [severity, count] of Object.entries(results.bySeverity)) {
    if (count > 0) console.log(`  ${severity}: ${count}`);
  }

  console.log('\nBy Target Category (biased tests):');
  for (const [category, stats] of Object.entries(results.byCategory).sort((a, b) => b[1].mismatches - a[1].mismatches)) {
    const rate = stats.total > 0 ? (stats.mismatches / stats.total * 100).toFixed(1) : '0.0';
    const status = stats.mismatches === 0 ? '✅' : stats.mismatches > stats.total * 0.2 ? '❌' : '⚠️';
    console.log(`  ${status} ${category}: ${stats.mismatches}/${stats.total} (${rate}%)`);
  }

  if (results.examples.length > 0) {
    console.log('\n' + '─'.repeat(80));
    console.log('EXAMPLE MISMATCHES (showing up to 10):');
    console.log('─'.repeat(80));

    for (const example of results.examples.slice(0, 10)) {
      console.log(`\n[${example.cohort}] ${example.type}${example.targetCategory ? ` → ${example.targetCategory}` : ''}`);
      console.log(`  Strengths: ${(example.strengths || []).join(', ')}`);
      console.log(`  Top Category: ${example.topCategory?.category} (${example.topCategory?.score}%)`);
      console.log(`  Top Careers: ${(example.topCareers || []).map(c => `${c.title} [${c.category}]`).join(', ')}`);
      for (const issue of example.issues) {
        console.log(`  ⚠️ ${issue.type}: ${issue.message}`);
      }
    }
  }

  console.log('\n' + '═'.repeat(80));
  if (results.mismatches === 0) {
    console.log('✅ NO MISMATCHES DETECTED - Career recommendations are consistent!');
  } else if (parseFloat(mismatchRate) < 5) {
    console.log(`✅ LOW MISMATCH RATE (${mismatchRate}%) - System working well`);
  } else if (parseFloat(mismatchRate) < 15) {
    console.log(`⚠️ MODERATE MISMATCH RATE (${mismatchRate}%) - Some issues to address`);
  } else {
    console.log(`❌ HIGH MISMATCH RATE (${mismatchRate}%) - Significant problems!`);
  }
  console.log('═'.repeat(80) + '\n');

  // Save results for analysis
  const fs = require('fs');
  fs.writeFileSync(
    'mismatch-detection-results.json',
    JSON.stringify(results, null, 2)
  );
  console.log('Results saved to mismatch-detection-results.json');

  return results;
}

// Check if server is running
function checkServer() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000/api/career-results', () => {
      resolve(true);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(2000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

// Main
async function main() {
  const iterations = parseInt(process.argv[2]) || 200;

  console.log('Checking if dev server is running...');
  const serverRunning = await checkServer();

  if (!serverRunning) {
    console.log('❌ Dev server not running. Please start it with: npm run dev');
    console.log('   Then run this script again.');
    process.exit(1);
  }

  console.log('✅ Server is running\n');
  await runMismatchDetection(iterations);
}

main().catch(console.error);
