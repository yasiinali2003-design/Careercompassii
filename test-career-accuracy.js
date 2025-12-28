/**
 * Career Accuracy Verification Test
 * Tests if recommended careers actually match user personality profiles
 */

const BASE_URL = 'http://localhost:3000';

// Define what careers SHOULD appear for each profile type
const EXPECTED_CAREER_PATTERNS = {
  creative_artist: {
    goodMatches: ['graafikko', 'graafinen', 'suunnittelija', 'taiteilija', 'muusikko', 'kuvataiteilija', 
                  'käsikirjoittaja', 'sisustus', 'valokuvaaja', 'kamera', 'kirjailija', 'media', 
                  'animaattori', 'taitto', 'tuottaja', 'luova', 'näyttelijä', 'ohjaaja', 'esittävä'],
    badMatches: ['kirjanpitäjä', 'vakuutus', 'pankki', 'logistiikka', 'varasto', 'siivous', 'vartija']
  },
  tech_enthusiast: {
    goodMatches: ['ohjelmoija', 'ohjelmisto', 'kehittäjä', 'data', 'insinööri', 'it', 'kyber', 'tietoturva',
                  'robotiikka', 'peli', 'tekoäly', 'analyytikko', 'järjestelmä', 'verkko', 'pilvi', 'koodaaja'],
    badMatches: ['hoitaja', 'sairaanhoitaja', 'sosiaali', 'terapeutti', 'opettaja', 'puutarhuri']
  },
  healthcare_helper: {
    goodMatches: ['hoitaja', 'sairaanhoitaja', 'lääkäri', 'terveydenhoitaja', 'fysio', 'psykologi', 
                  'terapeutti', 'sosiaali', 'kuntoutus', 'ensihoitaja', 'kätilö', 'bioanalyytikko'],
    badMatches: ['ohjelmoija', 'insinööri', 'graafikko', 'kirjanpitäjä', 'mekaanikko']
  },
  business_leader: {
    goodMatches: ['johtaja', 'päällikkö', 'esimies', 'yrittäjä', 'toimitusjohtaja', 'kehitys', 
                  'henkilöstö', 'markkinointi', 'myynti', 'talous', 'liiketoiminta', 'projekti'],
    badMatches: ['hoitaja', 'puutarhuri', 'siivous', 'varastotyöntekijä', 'putkiasentaja']
  },
  hands_on_builder: {
    goodMatches: ['rakentaja', 'rakennus', 'mestari', 'asentaja', 'maalari', 'sähkö', 'putki', 
                  'mekaanikko', 'puuseppä', 'hitsaaja', 'kirvesmies', 'levyseppä', 'koneistaja'],
    badMatches: ['psykologi', 'terapeutti', 'kirjailija', 'toimittaja', 'lakimies', 'tuomari']
  },
  nature_lover: {
    goodMatches: ['ympäristö', 'biologi', 'luonto', 'eläin', 'metsä', 'maatalous', 'puutarha', 
                  'ilmasto', 'kestävä', 'uusiutuva', 'ekologi', 'luonnonsuojelu', 'energia'],
    badMatches: ['pankkivirkailija', 'vakuutus', 'kirjanpitäjä', 'it-tuki', 'asiakaspalvelu']
  },
  scientific_mind: {
    goodMatches: ['tutkija', 'analyytikko', 'strategi', 'suunnittelija', 'kehittäjä', 'asiantuntija',
                  'konsultti', 'visio', 'innovaatio', 'tulevaisuus', 'journalisti', 'toimittaja'],
    badMatches: ['siivous', 'varasto', 'kassatyöntekijä', 'tarjoilija']
  },
  social_connector: {
    goodMatches: ['sosiaali', 'hoitaja', 'terapeutti', 'opettaja', 'kouluttaja', 'hr', 'henkilöstö',
                  'yhteisö', 'valmentaja', 'koordinaattori', 'ohjaaja', 'asiakaspalvelu', 'neuvoja'],
    badMatches: ['ohjelmoija', 'insinööri', 'kirjanpitäjä', 'mekaanikko', 'hitsaaja']
  },
  security_seeker: {
    goodMatches: ['hallinto', 'virkailija', 'koordinaattori', 'sihteeri', 'notaari', 'kirjanpitäjä',
                  'vakuutus', 'pankki', 'toimisto', 'järjestelmä', 'kouluttaja', 'lakimies', 'asianajaja'],
    badMatches: ['taiteilija', 'muusikko', 'näyttelijä', 'pelisuunnittelija', 'seikkailija']
  }
};

const COHORTS = ['YLA', 'TASO2', 'NUORI'];

// Test profiles with clear personality traits
const TEST_PROFILES = {
  creative_artist: {
    creative: 5, arts_culture: 5, writing: 5, independence: 5,
    innovation: 4, flexibility: 5, technology: 1, analytical: 1,
    organization: 1, structure: 1, precision: 1, stability: 1,
    hands_on: 1, health: 1, leadership: 1, business: 1
  },
  tech_enthusiast: {
    technology: 5, analytical: 5, problem_solving: 5, innovation: 5,
    precision: 2, organization: 1, structure: 1, creative: 3,
    hands_on: 3, health: 1, people: 1, leadership: 2
  },
  healthcare_helper: {
    health: 5, people: 5, social: 5, impact: 5,
    teamwork: 5, growth: 4, stability: 4,
    technology: 1, creative: 1, business: 1, leadership: 2
  },
  business_leader: {
    leadership: 5, business: 5, financial: 5, advancement: 5,
    performance: 5, teamwork: 4, organization: 4,
    creative: 2, health: 1, hands_on: 1, environment: 1
  },
  hands_on_builder: {
    hands_on: 5, outdoor: 5, stability: 4, innovation: 5,
    technology: 1, organization: 1, structure: 2, precision: 2,
    creative: 2, analytical: 1, environment: 1, nature: 1
  },
  nature_lover: {
    environment: 5, nature: 5, outdoor: 5, impact: 5,
    independence: 4, flexibility: 4,
    business: 1, financial: 1, leadership: 1, organization: 1
  },
  scientific_mind: {
    global: 5, planning: 5, innovation: 1, analytical: 1,
    technology: 1, precision: 1, structure: 1, organization: 1,
    environment: 1, nature: 1, hands_on: 1, people: 1
  },
  social_connector: {
    people: 5, health: 5, social: 5, impact: 5, social_impact: 5,
    teamwork: 5, growth: 5, education: 5,
    creative: 1, technology: 1, analytical: 1, business: 1
  },
  security_seeker: {
    stability: 5, structure: 5, organization: 5, precision: 5,
    planning: 4, teamwork: 4,
    creative: 1, innovation: 1, flexibility: 1, outdoor: 1
  }
};

async function getQuestions(cohort) {
  const res = await fetch(BASE_URL + '/api/questions?cohort=' + cohort + '&setIndex=0');
  const data = await res.json();
  return data.questions || [];
}

function generateAnswers(questions, profile) {
  return questions.map(q => {
    const subdims = q.subdimensions || [];
    let score = 3;
    
    subdims.forEach(sub => {
      if (profile[sub] !== undefined) {
        score = Math.max(score, profile[sub]);
      }
    });
    
    // Add some randomness for realism
    const variance = Math.random() * 0.5 - 0.25;
    score = Math.max(1, Math.min(5, Math.round(score + variance)));
    
    return { questionId: q.id, answer: score };
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

function analyzeCareerAccuracy(profileType, careers, cohort) {
  const patterns = EXPECTED_CAREER_PATTERNS[profileType];
  if (!patterns) return { good: 0, bad: 0, total: 0, details: [] };
  
  let goodCount = 0;
  let badCount = 0;
  const details = [];
  
  careers.forEach((career, idx) => {
    const title = career.title.toLowerCase();
    const slug = (career.slug || '').toLowerCase();
    const combined = title + ' ' + slug;
    
    const isGood = patterns.goodMatches.some(p => combined.includes(p.toLowerCase()));
    const isBad = patterns.badMatches.some(p => combined.includes(p.toLowerCase()));
    
    if (isGood) {
      goodCount++;
      details.push({ rank: idx + 1, title: career.title, status: 'GOOD' });
    } else if (isBad) {
      badCount++;
      details.push({ rank: idx + 1, title: career.title, status: 'BAD' });
    } else {
      details.push({ rank: idx + 1, title: career.title, status: 'NEUTRAL' });
    }
  });
  
  return {
    good: goodCount,
    bad: badCount,
    total: careers.length,
    goodPercent: Math.round((goodCount / careers.length) * 100),
    badPercent: Math.round((badCount / careers.length) * 100),
    details
  };
}

async function runTest(profileType, cohort, testNum) {
  const questions = await getQuestions(cohort);
  const answers = generateAnswers(questions, TEST_PROFILES[profileType]);
  const result = await submitTest(cohort, answers);
  
  if (!result.success || !result.topCareers) {
    return { error: 'Failed to get results' };
  }
  
  const top10 = result.topCareers.slice(0, 10);
  const accuracy = analyzeCareerAccuracy(profileType, top10, cohort);
  
  return {
    profileType,
    cohort,
    testNum,
    category: result.topCareers[0]?.category || 'N/A',
    accuracy,
    top3: top10.slice(0, 3).map(c => c.title)
  };
}

function pad(str, len) {
  str = String(str);
  while (str.length < len) str += ' ';
  return str;
}

async function main() {
  console.log('Career Accuracy Verification Test\n');
  console.log('Testing if recommended careers actually match personality profiles...\n');
  console.log('='.repeat(80));
  
  const allResults = [];
  const summaryByProfile = {};
  
  for (const cohort of COHORTS) {
    console.log('\n COHORT: ' + cohort);
    console.log('-'.repeat(60));
    
    for (const profileType of Object.keys(TEST_PROFILES)) {
      // Run 3 tests per profile per cohort (with randomness)
      for (let testNum = 1; testNum <= 3; testNum++) {
        const result = await runTest(profileType, cohort, testNum);
        allResults.push(result);
        
        if (!summaryByProfile[profileType]) {
          summaryByProfile[profileType] = { good: 0, bad: 0, total: 0, tests: 0 };
        }
        
        if (!result.error) {
          summaryByProfile[profileType].good += result.accuracy.good;
          summaryByProfile[profileType].bad += result.accuracy.bad;
          summaryByProfile[profileType].total += result.accuracy.total;
          summaryByProfile[profileType].tests++;
        }
      }
      
      // Show summary for this profile in this cohort
      const lastResult = allResults[allResults.length - 1];
      if (!lastResult.error) {
        const a = lastResult.accuracy;
        const status = a.bad > 0 ? 'WARN' : (a.good >= 3 ? 'OK' : 'MEH');
        console.log('  [' + status + '] ' + pad(profileType, 18) + ' | Good: ' + a.good + '/10 (' + a.goodPercent + '%) | Bad: ' + a.bad + '/10 | Top3: ' + lastResult.top3.join(', '));
      }
    }
  }
  
  // Overall Summary
  console.log('\n' + '='.repeat(80));
  console.log('OVERALL CAREER ACCURACY SUMMARY\n');
  
  let totalGood = 0, totalBad = 0, totalCareers = 0;
  const issues = [];
  
  for (const profile of Object.keys(summaryByProfile)) {
    const stats = summaryByProfile[profile];
    const avgGood = Math.round((stats.good / stats.total) * 100);
    const avgBad = Math.round((stats.bad / stats.total) * 100);
    totalGood += stats.good;
    totalBad += stats.bad;
    totalCareers += stats.total;
    
    const status = avgBad > 5 ? 'BAD' : (avgGood >= 30 ? 'OK ' : 'MEH');
    console.log('  [' + status + '] ' + pad(profile, 20) + ' | Good matches: ' + avgGood + '% | Bad matches: ' + avgBad + '%');
    
    if (avgBad > 5) {
      issues.push(profile + ': ' + avgBad + '% bad career matches');
    }
    if (avgGood < 20) {
      issues.push(profile + ': Only ' + avgGood + '% good career matches (low relevance)');
    }
  }
  
  console.log('\n' + '-'.repeat(60));
  const overallGood = Math.round((totalGood / totalCareers) * 100);
  const overallBad = Math.round((totalBad / totalCareers) * 100);
  console.log('Overall: ' + overallGood + '% good matches | ' + overallBad + '% bad matches');
  
  console.log('\n' + '='.repeat(80));
  if (issues.length > 0) {
    console.log('ISSUES FOUND:\n');
    issues.forEach(i => console.log('   - ' + i));
  } else {
    console.log('No major accuracy issues found');
  }
  
  // Brutally honest assessment
  console.log('\n' + '='.repeat(80));
  console.log('BRUTALLY HONEST ASSESSMENT:\n');
  
  if (overallBad > 10) {
    console.log('PROBLEM: Too many irrelevant careers being recommended.');
    console.log('   Users may see careers that do not match their personality at all.');
  } else if (overallBad > 5) {
    console.log('WARNING: Some irrelevant careers appearing in recommendations.');
    console.log('   Most recommendations are fine, but occasional mismatches occur.');
  } else {
    console.log('GOOD: Very few irrelevant careers in recommendations.');
  }
  
  if (overallGood < 30) {
    console.log('PROBLEM: Low percentage of clearly relevant careers.');
    console.log('   Many recommendations are "neutral" - not clearly wrong, but not ideal matches either.');
  } else if (overallGood < 50) {
    console.log('NOTE: Moderate percentage of clearly relevant careers.');
    console.log('   This is acceptable - many careers are general enough to fit multiple profiles.');
  } else {
    console.log('EXCELLENT: High percentage of clearly relevant careers.');
  }
  
  console.log('\n');
}

main().catch(console.error);
