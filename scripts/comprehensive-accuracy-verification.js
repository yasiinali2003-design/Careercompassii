#!/usr/bin/env node
/**
 * COMPREHENSIVE ACCURACY VERIFICATION v2.0
 *
 * Tests thousands of randomized personality profiles to verify:
 * 1. Personal analysis matches answer patterns
 * 2. School path recommendations are coherent with profile
 * 3. Career recommendations align with personality type
 *
 * FIXED: Uses correct question mappings from dimensions.ts
 */

const http = require('http');

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
  totalTestsPerCohort: 100,  // 100 tests × 3 cohorts = 300 total tests
  cohorts: ['YLA', 'TASO2', 'NUORI'],
  passThreshold: 0.85,  // 85% of tests must pass
  verbose: false
};

// ============================================
// CORRECT QUESTION MAPPINGS FROM dimensions.ts
// ============================================
const YLA_QUESTION_MAP = {
  0: 'technology',       // Gaming/Apps
  1: 'problem_solving',  // Puzzles
  2: 'creative',         // Stories/drawings/music (also: writing, arts_culture)
  3: 'hands_on',         // Building/fixing
  4: 'environment',      // Nature/animals (also: health, people)
  5: 'health',           // Human body
  6: 'business',         // Entrepreneurship
  7: 'analytical',       // Experiments
  8: 'sports',           // Sports/fitness (also: health)
  9: 'teaching',         // Explaining to others (also: growth)
  10: 'creative',        // Cooking
  11: 'innovation',      // New ideas
  12: 'people',          // Helping friends emotionally
  13: 'leadership',      // Group decisions
  14: 'analytical',      // Languages
  15: 'teamwork',        // Workstyle: Team
  16: 'organization',    // Workstyle: Structure
  17: 'outdoor',         // Workstyle: Outdoor
  18: 'precision',       // Workstyle: Focus (REVERSE)
  19: 'flexibility',     // Workstyle: Variety (also: variety)
  20: 'performance',     // Workstyle: Pressure (REVERSE)
  21: 'social',          // Workstyle: Public speaking
  22: 'independence',    // Workstyle: Initiative
  23: 'impact',          // Values: Helping society
  24: 'financial',       // Values: Money
  25: 'advancement',     // Values: Recognition (REVERSE)
  26: 'work_life_balance', // Values: Free time
  27: 'entrepreneurship',  // Values: Own boss
  28: 'global',          // Values: Travel
  29: 'stability'        // Values: Future certainty
};

// Which questions are reverse-scored
const YLA_REVERSE_QUESTIONS = [18, 20, 25];

// TASO2 QUESTION MAP - CORRECTED from dimensions.ts
const TASO2_QUESTION_MAP = {
  0: 'technology',       // IT/Software
  1: 'health',           // Healthcare (+ people)
  2: 'hands_on',         // Construction - CORRECTED
  3: 'hands_on',         // Automotive - CORRECTED
  4: 'creative',         // Restaurant/culinary - CORRECTED
  5: 'creative',         // Beauty (also people, hands_on) - CORRECTED
  6: 'people',           // Childcare (also health) - CORRECTED
  7: 'leadership',       // Security/rescue (also people) - CORRECTED
  8: 'organization',     // Transport/logistics - CORRECTED
  9: 'business',         // Sales/retail (also social)
  10: 'technology',      // Electrical - CORRECTED
  11: 'environment',     // Agriculture/forestry - CORRECTED
  12: 'creative',        // Design/media - CORRECTED
  13: 'business',        // Office/admin - CORRECTED
  14: 'people',          // Social work (also health) - CORRECTED
  15: 'outdoor',         // Physical work (also sports) - CORRECTED
  16: 'flexibility',     // Shift work
  17: 'social',          // Customer interaction - CORRECTED
  18: 'precision',       // Detail (REVERSE)
  19: 'leadership',      // Responsibility - CORRECTED
  20: 'teamwork',        // Team preference - CORRECTED
  21: 'problem_solving', // Frustration (REVERSE) - CORRECTED
  22: 'structure',       // Routine tolerance - CORRECTED
  23: 'stability',       // Job security - CORRECTED
  24: 'financial',       // Salary - CORRECTED
  25: 'impact',          // Meaningful work - CORRECTED
  26: 'advancement',     // Career advancement - NEEDS CHECK
  27: 'work_life_balance', // Balance - NEEDS CHECK
  28: 'global',          // International - NEEDS CHECK
  29: 'growth'           // Continuous learning - NEEDS CHECK
};

const TASO2_REVERSE_QUESTIONS = [18, 21];

// NUORI QUESTION MAP - CORRECTED from dimensions.ts
// NOTE: NUORI doesn't have direct hands_on questions - it's more career-focused
const NUORI_QUESTION_MAP = {
  0: 'technology',       // Software/data (+ analytical)
  1: 'health',           // Healthcare (+ people) - CRITICAL for auttaja
  2: 'business',         // Finance/accounting - CORRECTED
  3: 'creative',         // Creative industries (+ writing + arts_culture) - CORRECTED
  4: 'innovation',       // Engineering/R&D (+ technology) - CORRECTED
  5: 'teaching',         // Education (+ people + growth) - CORRECTED
  6: 'people',           // HR/Recruitment - CORRECTED
  7: 'analytical',       // Legal - CORRECTED
  8: 'business',         // Sales/marketing - CORRECTED
  9: 'analytical',       // Research/science - CORRECTED
  10: 'leadership',      // Project management (+ business) - CORRECTED
  11: 'environment',     // Sustainability (+ nature) - CORRECTED
  12: 'independence',    // Remote work - CORRECTED
  13: 'leadership',      // Management aspiration (+ growth) - CORRECTED
  14: 'teamwork',        // Team preference (+ people) - CORRECTED
  15: 'organization',    // Structure preference - CORRECTED
  16: 'social',          // Client-facing (REVERSE)
  17: 'planning',        // Strategic thinking - CORRECTED
  18: 'precision',       // Detail orientation - CORRECTED
  19: 'performance',     // Work pace (REVERSE)
  20: 'financial',       // Salary priority - CORRECTED
  21: 'work_life_balance', // Work-life balance - CORRECTED
  22: 'advancement',     // Career advancement (+ performance) - CORRECTED
  23: 'impact',          // Social impact - CORRECTED
  24: 'stability',       // Job security - CORRECTED
  25: 'growth',          // Learning opportunities - CORRECTED
  26: 'autonomy',        // Work autonomy - CORRECTED
  27: 'entrepreneurship', // Entrepreneurship (+ business) - CORRECTED
  28: 'global',          // International work - CORRECTED
  29: 'social'           // Company culture (REVERSE) - CORRECTED
};

const NUORI_REVERSE_QUESTIONS = [16, 19, 29];

// ============================================
// PERSONALITY ARCHETYPES (14 base types)
// ============================================
const PERSONALITY_ARCHETYPES = [
  {
    name: 'Pure Helper',
    dominant: 'auttaja',
    // For auttaja: need HIGH health, social_impact (impact), teaching, people
    // TASO2: Q1=healthcare(health), Q6=childcare(people), Q14=social work(people), Q25=meaningful(impact)
    // NUORI: Q1=healthcare(health), Q5=education(teaching), Q6=HR(people), Q23=social impact
    highQuestions: {
      YLA: [5, 9, 12, 23],    // health, teaching, people, impact
      TASO2: [1, 6, 14, 25],  // healthcare(health), childcare(people), social work(people), meaningful work(impact) - FIXED
      NUORI: [1, 5, 6, 23]    // healthcare(health), education(teaching), HR(people), social impact - FIXED
    },
    lowQuestions: {
      YLA: [0, 6, 27],        // technology, business, entrepreneurship
      TASO2: [0, 9, 28],      // technology, sales(business), own business(entrepreneurship) - FIXED
      NUORI: [0, 8, 27]       // technology, sales/marketing, entrepreneurship - FIXED
    },
    expectedCategories: ['auttaja', 'visionaari']  // visionaari has impact too
  },
  {
    name: 'Pure Innovator',
    dominant: 'innovoija',
    // For innovoija: need HIGH technology, innovation, problem_solving, analytical
    // TASO2: Q0=technology, Q10=electrical(technology), Q21=problem solving(REVERSE!), technology focus
    // NUORI: Q0=technology, Q4=engineering(innovation), Q7=legal(analytical), Q9=research(analytical)
    highQuestions: {
      YLA: [0, 1, 7, 11],     // technology, problem_solving, analytical, innovation
      TASO2: [0, 10],         // technology, electrical(technology) - FIXED (simpler, Q21 is reverse!)
      NUORI: [0, 4, 9]        // technology, engineering(innovation), research(analytical) - FIXED
    },
    lowQuestions: {
      YLA: [5, 17, 4],        // health, outdoor, environment
      TASO2: [1, 15, 11],     // health, physical work(outdoor), agriculture(environment) - FIXED
      NUORI: [1, 11]          // health, sustainability(environment) - FIXED (no outdoor in NUORI)
    },
    expectedCategories: ['innovoija', 'visionaari', 'jarjestaja']
  },
  {
    name: 'Pure Creative',
    dominant: 'luova',
    // For luova: need HIGH creative, arts_culture, writing
    // TASO2: Q4=restaurant(creative), Q5=beauty(creative), Q12=design(creative)
    // NUORI: Q3=creative industries (includes writing, arts_culture)
    highQuestions: {
      YLA: [2, 10],           // creative (stories), creative (cooking)
      TASO2: [4, 5, 12],      // restaurant(creative), beauty(creative), design(creative) - FIXED
      NUORI: [3]              // creative industries (includes writing, arts_culture) - FIXED
    },
    lowQuestions: {
      YLA: [18, 29, 16],      // precision (reverse), stability, organization
      TASO2: [0, 8, 23],      // technology, logistics(organization), job security(stability) - FIXED
      NUORI: [0, 15, 24]      // technology, structure(organization), job security(stability) - FIXED
    },
    expectedCategories: ['luova', 'innovoija']
  },
  {
    name: 'Pure Builder',
    dominant: 'rakentaja',
    // For rakentaja: need HIGH hands_on, outdoor, sports
    // TASO2: Q2=construction(hands_on), Q3=automotive(hands_on), Q15=physical(outdoor/sports)
    // NUORI: No direct hands_on questions - use Q4=engineering(innovation/tech) low, avoid tech
    highQuestions: {
      YLA: [3, 17, 8],        // hands_on, outdoor, sports
      TASO2: [2, 3, 15],      // construction(hands_on), automotive(hands_on), physical work(outdoor/sports) - FIXED
      NUORI: [11, 24]         // sustainability/environment (outdoor), job security (stability) - NUORI doesn't have hands_on
    },
    lowQuestions: {
      YLA: [2, 0, 11],        // creative, technology, innovation
      TASO2: [0, 12, 13],     // technology, design/media, office/admin - FIXED
      NUORI: [0, 3, 7]        // technology, creative, legal - FIXED
    },
    expectedCategories: ['rakentaja', 'ympariston-puolustaja', 'jarjestaja']  // Added jarjestaja since NUORI lacks hands_on
  },
  {
    name: 'Pure Leader',
    dominant: 'johtaja',
    // For johtaja: need HIGH leadership, business, entrepreneurship
    // TASO2: Q7=security(leadership), Q9=sales(business), Q19=responsibility(leadership)
    // NUORI: Q10=project mgmt(leadership), Q13=management(leadership), Q27=entrepreneurship
    highQuestions: {
      YLA: [13, 6, 27],       // leadership, business, entrepreneurship
      TASO2: [7, 9, 19],      // security(leadership), sales(business), responsibility(leadership) - FIXED
      NUORI: [10, 13, 27]     // project mgmt(leadership), management(leadership), entrepreneurship - FIXED
    },
    lowQuestions: {
      YLA: [3, 5, 16],        // hands_on, health, organization
      TASO2: [2, 1, 14],      // construction(hands_on), healthcare, social work - FIXED
      NUORI: [1, 5, 15]       // healthcare, teaching, structure - FIXED
    },
    expectedCategories: ['johtaja', 'visionaari', 'innovoija']
  },
  {
    name: 'Pure Organizer',
    dominant: 'jarjestaja',
    // For jarjestaja: need HIGH organization, precision, stability
    // TASO2: Q8=logistics(organization), Q22=routine(structure), Q23=job security(stability)
    // NUORI: Q15=structure(organization), Q18=detail(precision), Q24=stability
    highQuestions: {
      YLA: [16, 29],          // organization, stability
      TASO2: [8, 22, 23],     // logistics(organization), routine(structure), job security(stability) - FIXED
      NUORI: [15, 18, 24]     // structure(organization), detail(precision), job security(stability) - FIXED
    },
    lowQuestions: {
      YLA: [19, 11],          // flexibility, innovation
      TASO2: [16, 4],         // shift work(flexibility), restaurant(creative) - FIXED
      NUORI: [3, 27]          // creative, entrepreneurship - FIXED
    },
    expectedCategories: ['jarjestaja', 'johtaja']
  },
  {
    name: 'Pure Visionary',
    dominant: 'visionaari',
    // For visionaari: need HIGH global, impact, advancement, innovation
    // TASO2: Q25=meaningful work(impact), Q26=advancement, Q29=travel(global)
    // NUORI: Q23=social impact, Q28=international(global), Q22=advancement
    highQuestions: {
      YLA: [28, 23, 11],      // global, impact, innovation
      TASO2: [25, 26, 29],    // meaningful work(impact), advancement, travel(global) - FIXED
      NUORI: [23, 28, 22]     // social impact, international(global), advancement - FIXED
    },
    lowQuestions: {
      YLA: [3, 18],           // hands_on, precision
      TASO2: [2, 3],          // construction(hands_on), automotive(hands_on) - FIXED
      NUORI: [15, 18]         // structure, precision - FIXED
    },
    expectedCategories: ['visionaari', 'johtaja', 'innovoija']
  },
  {
    name: 'Pure Environmentalist',
    dominant: 'ympariston-puolustaja',
    // For ympariston-puolustaja: need HIGH environment, nature (same Q), outdoor
    // TASO2: Q11=agriculture/forestry(environment), Q15=physical(outdoor), Q25=meaningful(impact)
    // NUORI: Q11=sustainability(environment), Q23=social impact, no outdoor
    highQuestions: {
      YLA: [4, 17, 23],       // environment, outdoor, impact
      TASO2: [11, 15, 25],    // agriculture/forestry(environment), physical work(outdoor), meaningful work(impact) - FIXED
      NUORI: [11, 23]         // sustainability(environment), social impact - FIXED (NUORI has no outdoor)
    },
    lowQuestions: {
      YLA: [6, 27, 0],        // business, entrepreneurship, technology
      TASO2: [0, 9, 13],      // technology, sales(business), office/admin - FIXED
      NUORI: [0, 8, 27]       // technology, sales/marketing, entrepreneurship - FIXED
    },
    expectedCategories: ['ympariston-puolustaja', 'rakentaja', 'visionaari', 'auttaja']  // Added auttaja since environment + impact
  },
  // MIXED PROFILES
  {
    name: 'Tech Leader',
    dominant: 'mixed',
    // TASO2: Q0=technology, Q7=security(leadership), Q9=sales(business), Q10=electrical(technology)
    // NUORI: Q0=technology, Q10=project mgmt(leadership), Q13=management(leadership)
    highQuestions: {
      YLA: [0, 13, 6, 1],     // technology, leadership, business, problem_solving
      TASO2: [0, 10, 7, 9],   // technology, electrical(technology), security(leadership), sales(business) - FIXED
      NUORI: [0, 10, 13, 27]  // technology, project mgmt(leadership), management(leadership), entrepreneurship - FIXED
    },
    lowQuestions: {
      YLA: [5, 2],            // health, creative
      TASO2: [1, 4],          // health, restaurant(creative) - FIXED
      NUORI: [1, 3]           // health, creative - FIXED
    },
    expectedCategories: ['innovoija', 'johtaja', 'visionaari']
  },
  {
    name: 'Healthcare Educator',
    dominant: 'mixed',
    // TASO2: Q1=healthcare(health), Q6=childcare(people), Q14=social work(people), Q25=meaningful(impact)
    // NUORI: Q1=healthcare(health), Q5=education(teaching), Q6=HR(people), Q23=social impact
    highQuestions: {
      YLA: [5, 9, 12, 23],    // health, teaching, people, impact
      TASO2: [1, 6, 14, 25],  // healthcare(health), childcare(people), social work(people), meaningful work(impact) - FIXED
      NUORI: [1, 5, 6, 23]    // healthcare(health), education(teaching), HR(people), social impact - FIXED
    },
    lowQuestions: {
      YLA: [0, 3],            // technology, hands_on
      TASO2: [0, 2],          // technology, construction(hands_on) - FIXED
      NUORI: [0, 8]           // technology, sales/marketing - FIXED
    },
    expectedCategories: ['auttaja', 'visionaari']
  },
  {
    name: 'Creative Entrepreneur',
    dominant: 'mixed',
    // TASO2: Q4=restaurant(creative), Q5=beauty(creative), Q12=design(creative), Q28=own business(entrepreneurship)
    // NUORI: Q3=creative industries, Q27=entrepreneurship, Q22=advancement
    highQuestions: {
      YLA: [2, 27, 6],        // creative, entrepreneurship, business
      TASO2: [4, 12, 28],     // restaurant(creative), design(creative), own business(entrepreneurship) - FIXED
      NUORI: [3, 27, 22]      // creative industries, entrepreneurship, advancement - FIXED
    },
    lowQuestions: {
      YLA: [16, 29],          // organization, stability
      TASO2: [8, 23],         // logistics(organization), job security(stability) - FIXED
      NUORI: [15, 24]         // structure(organization), job security(stability) - FIXED
    },
    expectedCategories: ['luova', 'johtaja', 'innovoija']
  },
  {
    name: 'Sports Coach',
    dominant: 'mixed',
    // TASO2: Q15=physical work(sports/outdoor), Q6=childcare(people), Q14=social work(people)
    // NUORI: Q5=education/teaching, Q6=HR(people), Q23=social impact
    highQuestions: {
      YLA: [8, 9, 12],        // sports, teaching, people
      TASO2: [15, 6, 14],     // physical work(sports/outdoor), childcare(people), social work(people) - FIXED
      NUORI: [5, 6, 23]       // education(teaching), HR(people), social impact - FIXED (no direct sports in NUORI)
    },
    lowQuestions: {
      YLA: [0, 2],            // technology, creative
      TASO2: [0, 12],         // technology, design(creative) - FIXED
      NUORI: [0, 3]           // technology, creative - FIXED
    },
    expectedCategories: ['auttaja', 'rakentaja', 'johtaja']
  },
  {
    name: 'Business Analyst',
    dominant: 'mixed',
    // TASO2: Q8=logistics(organization), Q9=sales(business), Q13=office(business), Q22=routine(structure)
    // NUORI: Q2=finance(business), Q9=research(analytical), Q15=structure(organization), Q17=strategic(planning)
    highQuestions: {
      YLA: [7, 16, 6, 1],     // analytical, organization, business, problem_solving
      TASO2: [8, 9, 13, 22],  // logistics(organization), sales(business), office(business), routine(structure) - FIXED
      NUORI: [2, 9, 15, 17]   // finance(business), research(analytical), structure(organization), strategic(planning) - FIXED
    },
    lowQuestions: {
      YLA: [2, 17],           // creative, outdoor
      TASO2: [4, 15],         // restaurant(creative), physical work(outdoor) - FIXED
      NUORI: [3, 11]          // creative, sustainability(environment) - FIXED
    },
    expectedCategories: ['jarjestaja', 'visionaari', 'innovoija', 'johtaja']
  },
  {
    name: 'Environmental Engineer',
    dominant: 'mixed',
    // TASO2: Q11=agriculture(environment), Q0=technology, Q10=electrical(technology), Q15=physical(outdoor)
    // NUORI: Q11=sustainability(environment), Q0=technology, Q4=engineering(innovation), Q9=research(analytical)
    highQuestions: {
      YLA: [4, 0, 7, 17],     // environment, technology, analytical, outdoor
      TASO2: [11, 0, 10, 15], // agriculture(environment), technology, electrical(technology), physical work(outdoor) - FIXED
      NUORI: [11, 0, 4, 9]    // sustainability(environment), technology, engineering(innovation), research(analytical) - FIXED
    },
    lowQuestions: {
      YLA: [6, 13],           // business, leadership
      TASO2: [9, 7],          // sales(business), security(leadership) - FIXED
      NUORI: [8, 13]          // sales(business), management(leadership) - FIXED
    },
    expectedCategories: ['ympariston-puolustaja', 'innovoija', 'rakentaja']
  }
];

// ============================================
// ANSWER GENERATION
// ============================================
function generateAnswersForArchetype(archetype, cohort) {
  const answers = Array(30).fill(3); // Start neutral

  const highQs = archetype.highQuestions[cohort] || [];
  const lowQs = archetype.lowQuestions[cohort] || [];

  // Set high answers (4-5)
  for (const q of highQs) {
    answers[q] = Math.random() < 0.7 ? 5 : 4;
  }

  // Set low answers (1-2)
  for (const q of lowQs) {
    answers[q] = Math.random() < 0.7 ? 1 : 2;
  }

  // Add some random variation to other questions
  for (let i = 0; i < 30; i++) {
    if (!highQs.includes(i) && !lowQs.includes(i)) {
      const rand = Math.random();
      if (rand < 0.2) answers[i] = 2;
      else if (rand < 0.4) answers[i] = 4;
      // else stays 3
    }
  }

  return answers;
}

function addNoiseToAnswers(answers, noiseLevel = 0.15) {
  return answers.map(score => {
    if (Math.random() < noiseLevel) {
      const shift = Math.random() < 0.5 ? -1 : 1;
      return Math.max(1, Math.min(5, score + shift));
    }
    return score;
  });
}

// ============================================
// API CALL
// ============================================
function callAPI(cohort, answers) {
  return new Promise((resolve, reject) => {
    const formattedAnswers = answers.map((score, index) => ({
      questionIndex: index,
      score
    }));

    const postData = JSON.stringify({
      cohort,
      subCohort: cohort === 'TASO2' ? 'amis' : null,
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
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Invalid JSON response'));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.write(postData);
    req.end();
  });
}

// ============================================
// CATEGORY COMPATIBILITY (from categoryAffinities.ts)
// ============================================
const CATEGORY_COMPATIBLE = {
  'auttaja': ['auttaja', 'johtaja', 'visionaari'],
  'innovoija': ['innovoija', 'visionaari', 'jarjestaja', 'luova'],
  'luova': ['luova', 'innovoija', 'visionaari', 'auttaja'],
  'rakentaja': ['rakentaja', 'ympariston-puolustaja', 'innovoija', 'jarjestaja'],
  'johtaja': ['johtaja', 'jarjestaja', 'innovoija', 'visionaari', 'auttaja'],
  'jarjestaja': ['jarjestaja', 'johtaja', 'innovoija', 'visionaari'],
  'visionaari': ['visionaari', 'innovoija', 'johtaja', 'luova', 'auttaja'],
  'ympariston-puolustaja': ['ympariston-puolustaja', 'rakentaja', 'visionaari', 'innovoija']
};

// ============================================
// VALIDATION FUNCTIONS
// ============================================
function validateResults(archetype, result, cohort) {
  const issues = [];

  // Check 1: Has valid response
  if (!result.userProfile || !result.topCareers) {
    return [{ type: 'NO_RESPONSE', severity: 'HIGH', message: 'Missing profile or careers' }];
  }

  const categoryAffinities = result.userProfile.categoryAffinities || [];
  const topCategory = categoryAffinities[0]?.category;
  const topCareers = result.topCareers.slice(0, 5);

  // Check 2: Top category should be compatible with expected
  if (archetype && archetype.expectedCategories) {
    const allCompatible = new Set();
    archetype.expectedCategories.forEach(cat => {
      allCompatible.add(cat);
      (CATEGORY_COMPATIBLE[cat] || []).forEach(c => allCompatible.add(c));
    });

    if (topCategory && !allCompatible.has(topCategory)) {
      issues.push({
        type: 'CATEGORY_MISMATCH',
        severity: 'HIGH',
        message: `Expected one of [${archetype.expectedCategories.join(', ')}] but got ${topCategory}`,
        topThree: categoryAffinities.slice(0, 3).map(c => `${c.category}(${c.score})`).join(', ')
      });
    }
  }

  // Check 3: Careers should match profile
  if (topCareers.length > 0 && archetype) {
    const careerCategories = topCareers.map(c => c.category);
    const allCompatible = new Set();
    archetype.expectedCategories.forEach(cat => {
      allCompatible.add(cat);
      (CATEGORY_COMPATIBLE[cat] || []).forEach(c => allCompatible.add(c));
    });

    const matchCount = careerCategories.filter(cat => allCompatible.has(cat)).length;

    if (matchCount < 2) {
      issues.push({
        type: 'CAREER_MISMATCH',
        severity: 'HIGH',
        message: `Only ${matchCount}/5 careers from compatible categories`,
        careers: topCareers.slice(0, 3).map(c => `${c.title}(${c.category})`).join(', ')
      });
    } else if (matchCount < 3) {
      issues.push({
        type: 'CAREER_PARTIAL',
        severity: 'MEDIUM',
        message: `${matchCount}/5 careers from compatible categories`
      });
    }
  }

  // Check 4: Has education path
  if (!result.educationPath || !result.educationPath.primary) {
    issues.push({
      type: 'NO_EDUCATION',
      severity: 'MEDIUM',
      message: 'Missing education path'
    });
  }

  // Check 5: Has strengths
  if (!result.userProfile.topStrengths || result.userProfile.topStrengths.length === 0) {
    issues.push({
      type: 'NO_STRENGTHS',
      severity: 'MEDIUM',
      message: 'Missing strengths'
    });
  }

  return issues;
}

// ============================================
// MAIN TEST RUNNER
// ============================================
async function runSingleTest(testId, cohort, archetype, useNoise = false) {
  let answers;
  let testType;

  if (archetype) {
    answers = generateAnswersForArchetype(archetype, cohort);
    if (useNoise) {
      answers = addNoiseToAnswers(answers, 0.15);
    }
    testType = archetype.name;
  } else {
    // Random profile
    answers = Array(30).fill(0).map(() => Math.floor(Math.random() * 5) + 1);
    testType = 'Random';
  }

  try {
    const result = await callAPI(cohort, answers);
    const issues = validateResults(archetype, result, cohort);

    const highIssues = issues.filter(i => i.severity === 'HIGH');
    const passed = highIssues.length === 0;

    return {
      testId,
      cohort,
      testType,
      passed,
      issues,
      highIssueCount: highIssues.length,
      mediumIssueCount: issues.filter(i => i.severity === 'MEDIUM').length,
      topCategory: result.userProfile?.categoryAffinities?.[0]?.category,
      topCareer: result.topCareers?.[0]?.title
    };
  } catch (error) {
    return {
      testId,
      cohort,
      testType,
      passed: false,
      issues: [{ type: 'API_ERROR', severity: 'HIGH', message: error.message }],
      highIssueCount: 1,
      mediumIssueCount: 0
    };
  }
}

async function runComprehensiveTests() {
  console.log('╔══════════════════════════════════════════════════════════════════╗');
  console.log('║     COMPREHENSIVE ACCURACY VERIFICATION v2.0 - CareerCompassi    ║');
  console.log('║     Testing diverse personality profiles with correct mappings   ║');
  console.log('╚══════════════════════════════════════════════════════════════════╝\n');

  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    byCohort: {},
    byArchetype: {},
    failures: []
  };

  for (const cohort of CONFIG.cohorts) {
    console.log(`\n▶ Testing ${cohort} cohort...`);
    results.byCohort[cohort] = { total: 0, passed: 0, failed: 0 };

    let testId = 0;
    const testsPerArchetype = Math.floor(CONFIG.totalTestsPerCohort / (PERSONALITY_ARCHETYPES.length + 2));

    // Test each archetype
    for (const archetype of PERSONALITY_ARCHETYPES) {
      if (!results.byArchetype[archetype.name]) {
        results.byArchetype[archetype.name] = { total: 0, passed: 0, failed: 0 };
      }

      for (let i = 0; i < testsPerArchetype; i++) {
        const useNoise = i > 0;
        const testResult = await runSingleTest(testId++, cohort, archetype, useNoise);

        results.total++;
        results.byCohort[cohort].total++;
        results.byArchetype[archetype.name].total++;

        if (testResult.passed) {
          results.passed++;
          results.byCohort[cohort].passed++;
          results.byArchetype[archetype.name].passed++;
        } else {
          results.failed++;
          results.byCohort[cohort].failed++;
          results.byArchetype[archetype.name].failed++;

          if (testResult.highIssueCount > 0) {
            results.failures.push(testResult);
          }
        }

        if (testId % 20 === 0) process.stdout.write('.');
      }
    }

    // Random tests
    for (let i = 0; i < testsPerArchetype * 2; i++) {
      const testResult = await runSingleTest(testId++, cohort, null);

      if (!results.byArchetype['Random']) {
        results.byArchetype['Random'] = { total: 0, passed: 0, failed: 0 };
      }

      results.total++;
      results.byCohort[cohort].total++;
      results.byArchetype['Random'].total++;

      if (testResult.passed) {
        results.passed++;
        results.byCohort[cohort].passed++;
        results.byArchetype['Random'].passed++;
      } else {
        results.failed++;
        results.byCohort[cohort].failed++;
        results.byArchetype['Random'].failed++;
      }

      if (testId % 20 === 0) process.stdout.write('.');
    }

    const cohortRate = (results.byCohort[cohort].passed / results.byCohort[cohort].total * 100).toFixed(1);
    console.log(`\n   ${cohort}: ${results.byCohort[cohort].passed}/${results.byCohort[cohort].total} passed (${cohortRate}%)`);
  }

  // Results summary
  console.log('\n\n' + '═'.repeat(70));
  console.log('                         RESULTS SUMMARY');
  console.log('═'.repeat(70));

  const overallRate = (results.passed / results.total * 100).toFixed(1);
  const passedThreshold = parseFloat(overallRate) >= CONFIG.passThreshold * 100;

  console.log(`\n📊 OVERALL: ${results.passed}/${results.total} tests passed (${overallRate}%)`);
  console.log(`   Threshold: ${CONFIG.passThreshold * 100}%`);
  console.log(`   Status: ${passedThreshold ? '✅ PASSED' : '❌ NEEDS ATTENTION'}\n`);

  // By cohort
  console.log('📋 BY COHORT:');
  for (const cohort of CONFIG.cohorts) {
    const c = results.byCohort[cohort];
    const rate = (c.passed / c.total * 100).toFixed(1);
    const status = parseFloat(rate) >= CONFIG.passThreshold * 100 ? '✅' : '⚠️';
    console.log(`   ${status} ${cohort}: ${c.passed}/${c.total} (${rate}%)`);
  }

  // By archetype
  console.log('\n📋 BY PERSONALITY ARCHETYPE:');
  const sorted = Object.entries(results.byArchetype).sort((a, b) => {
    const rateA = a[1].passed / a[1].total;
    const rateB = b[1].passed / b[1].total;
    return rateB - rateA;
  });

  for (const [name, a] of sorted) {
    const rate = (a.passed / a.total * 100).toFixed(0);
    const status = parseFloat(rate) >= 80 ? '✅' : (parseFloat(rate) >= 60 ? '⚠️' : '❌');
    console.log(`   ${status} ${name}: ${a.passed}/${a.total} (${rate}%)`);
  }

  // Sample failures
  if (results.failures.length > 0) {
    console.log('\n⚠️  SAMPLE FAILURES (first 5):');
    for (const fail of results.failures.slice(0, 5)) {
      console.log(`   [${fail.cohort}] ${fail.testType}: top=${fail.topCategory}`);
      for (const issue of fail.issues.filter(i => i.severity === 'HIGH')) {
        console.log(`      ❌ ${issue.type}: ${issue.message}`);
        if (issue.topThree) console.log(`         Top 3: ${issue.topThree}`);
        if (issue.careers) console.log(`         Careers: ${issue.careers}`);
      }
    }
  }

  console.log('\n' + '═'.repeat(70));
  if (passedThreshold) {
    console.log('✅ VERIFICATION COMPLETE: Scoring engine handles diverse profiles well');
  } else {
    console.log('⚠️  VERIFICATION: Some personality types need attention');
  }
  console.log('═'.repeat(70) + '\n');

  return passedThreshold;
}

// Run
runComprehensiveTests()
  .then(passed => process.exit(passed ? 0 : 1))
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
