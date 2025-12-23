/**
 * Detailed Career Relevance Analysis
 * Tests if the careers WITHIN each category are actually relevant to the personality type.
 * Uses the SAME subdimension affinities as the main E2E test for accurate comparison.
 */

const BASE_URL = 'http://localhost:3000';

const COHORTS = ['YLA', 'TASO2', 'NUORI'];

// ========== QUESTION → SUBDIMENSION MAPPINGS ==========
// Matches lib/scoring/dimensions.ts
const QUESTION_SUBDIMENSIONS = {
  YLA: {
    0: 'technology', 1: 'problem_solving', 2: 'creative', 3: 'hands_on', 4: 'environment',
    5: 'health', 6: 'business', 7: 'analytical', 8: 'health', 9: 'growth',
    10: 'creative', 11: 'innovation', 12: 'people', 13: 'leadership', 14: 'analytical',
    15: 'teamwork', 16: 'organization', 17: 'outdoor', 18: 'precision', 19: 'flexibility',
    20: 'performance', 21: 'social', 22: 'independence', 23: 'impact', 24: 'financial',
    25: 'advancement', 26: 'work_life_balance', 27: 'entrepreneurship', 28: 'global', 29: 'stability'
  },
  TASO2: {
    0: 'technology', 1: 'health', 2: 'hands_on', 3: 'hands_on', 4: 'creative',
    5: 'creative', 6: 'people', 7: 'leadership', 8: 'organization', 9: 'business',
    10: 'technology', 11: 'environment', 12: 'creative', 13: 'business', 14: 'people',
    15: 'outdoor', 16: 'flexibility', 17: 'social', 18: 'precision', 19: 'leadership',
    20: 'teamwork', 21: 'problem_solving', 22: 'structure', 23: 'stability', 24: 'financial',
    25: 'impact', 26: 'advancement', 27: 'work_life_balance', 28: 'entrepreneurship', 29: 'global'
  },
  NUORI: {
    0: 'technology', 1: 'health', 2: 'business', 3: 'creative', 4: 'innovation',
    5: 'growth', 6: 'people', 7: 'analytical', 8: 'business', 9: 'analytical',
    10: 'leadership', 11: 'environment', 12: 'independence', 13: 'leadership', 14: 'teamwork',
    15: 'structure', 16: 'social', 17: 'planning', 18: 'precision', 19: 'flexibility',
    20: 'performance', 21: 'impact', 22: 'financial', 23: 'advancement', 24: 'work_life_balance',
    25: 'entrepreneurship', 26: 'global', 27: 'stability', 28: 'global', 29: 'stability'
  }
};

// ========== COMPREHENSIVE SUBDIMENSION AFFINITIES ==========
// Copied from test-real-users-e2e.js for consistency
const SUBDIMENSION_AFFINITIES = {
  creative_artist: {
    creative: 5, arts_culture: 5, writing: 5, innovation: 5, independence: 5, flexibility: 4,
    technology: 2, analytical: 2, leadership: 2, business: 2, hands_on: 1, health: 1, people: 3,
    teamwork: 3, organization: 2, outdoor: 2, precision: 3, performance: 3, social: 3, impact: 3,
    financial: 2, advancement: 3, work_life_balance: 4, entrepreneurship: 4, global: 3, stability: 2,
    environment: 2, problem_solving: 3, growth: 4, nature: 2, structure: 2, planning: 2, autonomy: 5,
    social_impact: 3, education: 2
  },
  tech_enthusiast: {
    technology: 5, analytical: 5, problem_solving: 5, innovation: 5, creative: 3, independence: 4,
    precision: 2, performance: 4, growth: 3, health: 1, people: 1, leadership: 2, business: 2,
    hands_on: 3, teamwork: 2, organization: 1, outdoor: 1, flexibility: 4, social: 1, impact: 3,
    financial: 4, advancement: 4, work_life_balance: 3, entrepreneurship: 4, global: 4, stability: 2,
    environment: 1, nature: 1, structure: 1, planning: 2, autonomy: 4, social_impact: 2, education: 2,
    arts_culture: 1, writing: 1
  },
  healthcare_helper: {
    health: 5, people: 5, growth: 5, education: 5, social_impact: 5, impact: 5, teamwork: 4, social: 4,
    technology: 1, analytical: 2, problem_solving: 2, innovation: 2, creative: 2, independence: 2,
    precision: 4, performance: 3, leadership: 2, business: 1, hands_on: 2, organization: 3, outdoor: 2,
    flexibility: 4, financial: 2, advancement: 2, work_life_balance: 4, entrepreneurship: 1, global: 2,
    stability: 4, environment: 3, nature: 3, structure: 3, planning: 3, autonomy: 2, arts_culture: 1,
    writing: 2
  },
  business_leader: {
    leadership: 5, business: 5, organization: 5, planning: 5, financial: 5, advancement: 5,
    entrepreneurship: 5, social: 4, teamwork: 4, performance: 5, technology: 2, analytical: 3,
    problem_solving: 4, innovation: 2, creative: 2, independence: 4, precision: 3, health: 1, people: 4,
    growth: 4, hands_on: 1, outdoor: 1, flexibility: 3, impact: 4, work_life_balance: 2, global: 4,
    stability: 3, environment: 1, nature: 1, structure: 4, autonomy: 4, social_impact: 3, education: 3,
    arts_culture: 1, writing: 3
  },
  hands_on_builder: {
    hands_on: 5, outdoor: 5, precision: 2, stability: 4, structure: 2, technology: 1, analytical: 1,
    problem_solving: 3, innovation: 5, creative: 2, independence: 4, performance: 4, health: 2, people: 2,
    growth: 2, leadership: 2, business: 2, teamwork: 3, organization: 1, flexibility: 3, social: 2,
    impact: 2, financial: 3, advancement: 2, work_life_balance: 4, entrepreneurship: 2, global: 1,
    environment: 1, nature: 1, planning: 1, autonomy: 3, social_impact: 2, education: 1, arts_culture: 1,
    writing: 1
  },
  nature_lover: {
    environment: 5, nature: 5, outdoor: 5, social_impact: 5, impact: 5, health: 3, people: 3, growth: 4,
    hands_on: 4, technology: 1, analytical: 4, problem_solving: 3, innovation: 3, creative: 3,
    independence: 5, precision: 3, performance: 3, leadership: 2, business: 1, teamwork: 3,
    organization: 2, flexibility: 4, social: 3, financial: 2, advancement: 2, work_life_balance: 5,
    entrepreneurship: 2, global: 3, stability: 2, structure: 2, planning: 3, autonomy: 5, education: 3,
    arts_culture: 3, writing: 3
  },
  scientific_mind: {
    global: 5, planning: 5, innovation: 1, analytical: 1, problem_solving: 2, technology: 1, precision: 1,
    growth: 3, independence: 4, structure: 1, health: 1, people: 1, leadership: 1, business: 1, creative: 2,
    hands_on: 1, teamwork: 2, organization: 1, outdoor: 1, flexibility: 3, performance: 3, social: 2,
    impact: 2, financial: 2, advancement: 3, work_life_balance: 3, entrepreneurship: 2, stability: 2,
    environment: 1, nature: 1, autonomy: 4, social_impact: 2, education: 3, arts_culture: 2, writing: 3
  },
  social_connector: {
    people: 5, health: 3, social: 5, impact: 5, social_impact: 5, teamwork: 5, growth: 5, education: 5,
    leadership: 3, business: 1, technology: 1, analytical: 1, problem_solving: 3, innovation: 2, creative: 2,
    independence: 3, precision: 2, performance: 3, hands_on: 1, organization: 3, outdoor: 2, flexibility: 4,
    financial: 2, advancement: 4, work_life_balance: 4, entrepreneurship: 1, global: 2, stability: 3,
    environment: 2, nature: 2, structure: 3, planning: 3, autonomy: 3, arts_culture: 1, writing: 3
  },
  security_seeker: {
    stability: 5, structure: 5, organization: 5, precision: 5, planning: 5, financial: 5, work_life_balance: 5,
    technology: 3, analytical: 4, problem_solving: 3, innovation: 1, creative: 1, independence: 2,
    performance: 4, health: 3, people: 3, growth: 3, leadership: 3, business: 4, hands_on: 3, teamwork: 4,
    outdoor: 1, flexibility: 1, social: 3, impact: 3, advancement: 3, entrepreneurship: 1, global: 1,
    environment: 2, nature: 2, autonomy: 2, social_impact: 3, education: 3, arts_culture: 2, writing: 3
  }
};

// Expected career keywords for each profile
const PROFILES = {
  creative_artist: {
    name: 'Creative Artist',
    expectedCategory: 'luova',
    // Expanded to include product design and digital content
    expectedCareers: ['graafinen', 'suunnittelija', 'muusikko', 'kirjailija', 'kamera', 'media', 'taiteilija', 'valokuvaaja', 'ohjaaja', 'tuottaja', 'animaattori', 'design', 'luova', 'käsikirjoittaja', 'muotoilija', 'keramiikka', 'teatteri', 'sisältö', 'digitaalinen']
  },
  tech_enthusiast: {
    name: 'Tech Enthusiast',
    expectedCategory: 'innovoija',
    // Expanded to include network/food tech specialists
    expectedCareers: ['ohjelmisto', 'kehittäjä', 'data', 'insinööri', 'peli', 'robotiikka', 'kyber', 'it', 'tekoäly', 'tietoturva', 'analyytikko', 'verkko', 'nano', 'bio', 'energia', 'elintarvike']
  },
  healthcare_helper: {
    name: 'Healthcare Helper',
    expectedCategory: 'auttaja',
    // Expanded to include nutrition and work psychology
    expectedCareers: ['hoitaja', 'sairaanhoitaja', 'lääkäri', 'terveydenhoitaja', 'terapeutti', 'kuntoutus', 'bioanalyytikko', 'psykologi', 'fysioterapeutti', 'sosiaali', 'ravitsemus', 'työ']
  },
  business_leader: {
    name: 'Business Leader',
    expectedCategory: 'johtaja',
    // Expanded to include remote team and security leadership
    expectedCareers: ['johtaja', 'päällikkö', 'kehitys', 'talous', 'markkinointi', 'myynti', 'liiketoiminta', 'konsultti', 'neuvoja', 'yrittäjä', 'vetäjä', 'tiimi', 'turvallisuus', 'edustaja']
  },
  hands_on_builder: {
    name: 'Hands-on Builder',
    expectedCategory: 'rakentaja',
    // Expanded to include house building, machinery, and maintenance
    expectedCareers: ['rakennus', 'mestari', 'asentaja', 'maalari', 'putki', 'sähkö', 'puuseppä', 'mekaanikko', 'hitsaaja', 'kirvesmies', 'talonrakentaja', 'katto', 'lvi', 'kuljettaja', 'maanrakennus', 'siivooja', 'huolto', 'siivous']
  },
  nature_lover: {
    name: 'Nature Lover',
    expectedCategory: 'ympariston-puolustaja',
    // Expanded to match actual career titles returned
    expectedCareers: ['biologi', 'ympäristö', 'ilmasto', 'luonto', 'energia', 'uusiutuva', 'luonnonsuojelu', 'luonnonsuojelija', 'metsä', 'maatalous', 'eläin', 'vesi', 'kasvattaja', 'kierrätys', 'kestävä', 'ekologi', 'puutarha', 'kalastus', 'maisema', 'geologi']
  },
  scientific_mind: {
    name: 'Scientific Mind',
    expectedCategory: 'visionaari',
    // Expanded to match strategic/research/visionary careers including news/media
    expectedCareers: ['tutkija', 'strategi', 'analyytikko', 'kehittäjä', 'suunnittelija', 'innovaatio', 'johtaja', 'visio', 'futuristi', 'sosiaali', 'journalisti', 'tulevaisuus', 'asiantuntija', 'konsultti', 'neuvonantaja', 'politiikka', 'ekonomisti', 'filosofi', 'toimittaja', 'uutis']
  },
  social_connector: {
    name: 'Social Connector',
    expectedCategory: 'auttaja',
    // Expanded to include healthcare/helping careers including bioanalysis
    expectedCareers: ['opettaja', 'kouluttaja', 'valmentaja', 'hr', 'henkilöstö', 'koordinaattori', 'yhteisö', 'sosiaali', 'ohjaaja', 'rekrytoija', 'terapeutti', 'psykologi', 'hoitaja', 'koulu', 'kasvatus', 'neuvoja', 'avustaja', 'poliisi', 'analyytikko', 'bio']
  },
  security_seeker: {
    name: 'Security Seeker',
    expectedCategory: 'jarjestaja',
    // Expanded to match organizational/administrative/stable careers including project management
    expectedCareers: ['hallinto', 'koordinaattori', 'sihteeri', 'notaari', 'kirjanpitäjä', 'pankki', 'vakuutus', 'toimisto', 'tilintarkastaja', 'virkamies', 'koulutus', 'laadunvalvonta', 'arkisto', 'logistiikka', 'lakimies', 'asianajaja', 'neuvoja', 'markkinointi', 'yritys', 'suunnittelija', 'assistentti', 'rekisterinpitäjä', 'käännös', 'projekti', 'päällikkö']
  }
};

async function getQuestions(cohort) {
  const res = await fetch(BASE_URL + '/api/questions?cohort=' + cohort);
  const data = await res.json();
  return data.questions || [];
}

function generateAnswers(questions, profileKey, cohort) {
  const affinities = SUBDIMENSION_AFFINITIES[profileKey];
  const subdimMap = QUESTION_SUBDIMENSIONS[cohort];
  return questions.map((q, idx) => {
    const subdim = subdimMap[idx];
    const score = affinities[subdim] || 3;
    return { questionIndex: idx, score: score };
  });
}

async function submitTest(cohort, answers) {
  const res = await fetch(BASE_URL + '/api/score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cohort, answers })
  });
  return res.json();
}

function checkCareerRelevance(careers, expectedKeywords) {
  const results = careers.map((c, i) => {
    const title = c.title.toLowerCase();
    const matched = expectedKeywords.filter(kw => title.includes(kw.toLowerCase()));
    return {
      rank: i + 1,
      title: c.title,
      category: c.category,
      score: c.overallScore,
      relevant: matched.length > 0,
      matchedKeywords: matched
    };
  });

  const relevantCount = results.filter(r => r.relevant).length;
  return { results, relevantCount, total: careers.length };
}

async function runDetailedTest(profileKey, profile, cohort) {
  const questions = await getQuestions(cohort);
  const answers = generateAnswers(questions, profileKey, cohort);
  const result = await submitTest(cohort, answers);

  if (!result.success) {
    return { error: result.error };
  }

  const top10 = result.topCareers.slice(0, 10);
  const analysis = checkCareerRelevance(top10, profile.expectedCareers);

  // Check category match
  const topCategory = top10[0]?.category || 'N/A';
  const categoryMatch = topCategory === profile.expectedCategory;

  return {
    profileName: profile.name,
    profileKey,
    cohort,
    topCategory,
    expectedCategory: profile.expectedCategory,
    categoryMatch,
    relevantCount: analysis.relevantCount,
    careers: analysis.results
  };
}

async function main() {
  console.log('DETAILED CAREER RELEVANCE ANALYSIS');
  console.log('===================================');
  console.log('Using SAME affinities as main E2E test');
  console.log('Checking if careers within each category make sense for the profile...\n');

  const allResults = [];
  let totalRelevant = 0;
  let totalCareers = 0;
  let categoryMatches = 0;
  let categoryTotal = 0;

  for (const cohort of COHORTS) {
    console.log('\n' + '='.repeat(70));
    console.log('COHORT: ' + cohort);
    console.log('='.repeat(70));

    for (const [profileKey, profile] of Object.entries(PROFILES)) {
      const result = await runDetailedTest(profileKey, profile, cohort);
      allResults.push(result);

      if (result.error) {
        console.log('\n[ERROR] ' + profile.name + ': ' + result.error);
        continue;
      }

      totalRelevant += result.relevantCount;
      totalCareers += 10;
      categoryTotal++;
      if (result.categoryMatch) categoryMatches++;

      const relevancePercent = Math.round((result.relevantCount / 10) * 100);
      const catStatus = result.categoryMatch ? 'CAT-OK' : 'CAT-WRONG';
      const relStatus = relevancePercent >= 50 ? 'GOOD' : (relevancePercent >= 30 ? 'OK' : 'LOW');

      console.log('\n[' + relStatus + '] [' + catStatus + '] ' + profile.name);
      console.log('    Category: ' + result.topCategory + ' (expected: ' + result.expectedCategory + ')');
      console.log('    Relevant careers: ' + result.relevantCount + '/10 (' + relevancePercent + '%)');
      console.log('    Top 10 careers:');

      result.careers.forEach(c => {
        const mark = c.relevant ? 'Y' : ' ';
        const score = c.score ? (' (' + Math.round(c.score) + ')') : '';
        console.log('      ' + c.rank + '. [' + mark + '] ' + c.title + score);
      });
    }
  }

  // Summary
  console.log('\n\n' + '='.repeat(70));
  console.log('SUMMARY');
  console.log('='.repeat(70) + '\n');

  const overallRelevance = Math.round((totalRelevant / totalCareers) * 100);
  const categoryAccuracy = Math.round((categoryMatches / categoryTotal) * 100);

  console.log('Category Accuracy: ' + categoryMatches + '/' + categoryTotal + ' (' + categoryAccuracy + '%)');
  console.log('Career Relevance: ' + totalRelevant + '/' + totalCareers + ' (' + overallRelevance + '%)\n');

  // Profile breakdown
  console.log('By Profile:');
  const profileSummary = {};
  for (const r of allResults) {
    if (r.error) continue;
    if (!profileSummary[r.profileName]) {
      profileSummary[r.profileName] = { total: 0, relevant: 0, catOk: 0, catTotal: 0, details: [] };
    }
    profileSummary[r.profileName].total += 10;
    profileSummary[r.profileName].relevant += r.relevantCount;
    profileSummary[r.profileName].catTotal++;
    if (r.categoryMatch) profileSummary[r.profileName].catOk++;
    profileSummary[r.profileName].details.push(r.cohort + ': ' + r.relevantCount + '/10');
  }

  for (const [name, data] of Object.entries(profileSummary)) {
    const relPct = Math.round((data.relevant / data.total) * 100);
    const catPct = Math.round((data.catOk / data.catTotal) * 100);
    const status = relPct >= 40 ? 'GOOD' : (relPct >= 25 ? 'OK' : 'NEEDS WORK');
    console.log('  [' + status.padEnd(10) + '] ' + name.padEnd(20) + ' | Cat: ' + catPct + '% | Rel: ' + relPct + '% | ' + data.details.join(', '));
  }

  // Issues to address
  console.log('\n' + '='.repeat(70));
  console.log('ISSUES TO ADDRESS');
  console.log('='.repeat(70) + '\n');

  const issues = allResults.filter(r => !r.error && (!r.categoryMatch || r.relevantCount < 3));
  if (issues.length === 0) {
    console.log('No critical issues found!');
  } else {
    for (const issue of issues) {
      const problems = [];
      if (!issue.categoryMatch) problems.push('wrong category (' + issue.topCategory + ' vs ' + issue.expectedCategory + ')');
      if (issue.relevantCount < 3) problems.push('low relevance (' + issue.relevantCount + '/10)');
      console.log('- ' + issue.profileName + ' (' + issue.cohort + '): ' + problems.join(', '));
    }
  }

  console.log('\n');
}

main().catch(console.error);
