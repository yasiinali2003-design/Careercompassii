/**
 * Comprehensive Persona Testing Script
 * Tests all 4 cohorts with distinct personality profiles
 * Validates: career recommendations, personality analysis, education paths
 *
 * Run with: node scripts/test-personas.js
 */

// Import the API endpoint simulator
const http = require('http');

// ============================================================================
// TEST PERSONAS - Real-world personality profiles
// ============================================================================

// YLA PERSONAS (Ages 13-16) - 30 questions
const YLA_PERSONAS = [
  {
    name: "Aino - The Creative Writer",
    description: "Loves stories, drawing, music. Artistic, independent, wants meaningful work.",
    expectedCategory: "luova",
    expectedCareers: ["Kirjailija", "Graafinen suunnittelija", "Muusikko", "Animaattori", "Kameramies"],
    answers: [
      2, // Q0: Tech/games - low
      3, // Q1: Puzzles - medium
      5, // Q2: Stories/drawing/music - HIGH (creative+writing+arts_culture)
      2, // Q3: Building/fixing - low
      3, // Q4: Nature/animals - medium
      2, // Q5: Human body - low
      3, // Q6: Entrepreneurship - medium
      3, // Q7: Experiments - medium
      2, // Q8: Sports - low
      4, // Q9: Teaching/explaining - medium-high
      4, // Q10: Cooking - medium-high (creative)
      5, // Q11: New ideas - HIGH (innovation)
      4, // Q12: Helping friends - medium-high
      2, // Q13: Group decisions - low
      4, // Q14: Languages - medium-high
      3, // Q15: Teamwork - medium
      2, // Q16: Clear instructions - low (prefers freedom)
      2, // Q17: Outdoor work - low
      2, // Q18: Focus difficulty (REVERSE) - low = good focus
      5, // Q19: Variety - HIGH
      2, // Q20: Stress (REVERSE) - low = handles well
      4, // Q21: Public speaking - medium-high
      5, // Q22: Initiative - HIGH
      5, // Q23: Help society - HIGH
      3, // Q24: Money - medium
      1, // Q25: Recognition indifferent (REVERSE) - low = wants recognition
      4, // Q26: Work-life balance - medium-high
      4, // Q27: Be own boss - medium-high
      4, // Q28: Travel - medium-high
      3, // Q29: Know future - medium
    ]
  },
  {
    name: "Ville - The Tech Innovator",
    description: "Loves coding, puzzles, experiments. Analytical, problem-solver, future-focused.",
    expectedCategory: "innovoija",
    expectedCareers: ["Ohjelmistokehittaja", "DevOps-insinööri", "Insinööri", "Tutkija", "Cloud-arkkitehti"],
    answers: [
      5, // Q0: Tech/games - HIGH
      5, // Q1: Puzzles - HIGH
      2, // Q2: Stories/drawing - low
      4, // Q3: Building/fixing - medium-high
      2, // Q4: Nature/animals - low
      4, // Q5: Human body - medium (science interest)
      4, // Q6: Entrepreneurship - medium-high
      5, // Q7: Experiments - HIGH
      2, // Q8: Sports - low
      3, // Q9: Teaching - medium
      2, // Q10: Cooking - low
      5, // Q11: New ideas - HIGH
      3, // Q12: Helping friends - medium
      3, // Q13: Group decisions - medium
      3, // Q14: Languages - medium
      3, // Q15: Teamwork - medium
      4, // Q16: Clear instructions - medium-high
      2, // Q17: Outdoor work - low
      2, // Q18: Focus difficulty (REVERSE) - low = good focus
      4, // Q19: Variety - medium-high
      3, // Q20: Stress (REVERSE) - medium
      3, // Q21: Public speaking - medium
      5, // Q22: Initiative - HIGH
      3, // Q23: Help society - medium
      4, // Q24: Money - medium-high
      3, // Q25: Recognition indifferent (REVERSE)
      3, // Q26: Work-life balance - medium
      5, // Q27: Be own boss - HIGH
      3, // Q28: Travel - medium
      4, // Q29: Know future - medium-high
    ]
  },
  {
    name: "Liisa - The Helper",
    description: "Loves helping others, teaching, healthcare. Empathetic, social, caring.",
    expectedCategory: "auttaja",
    expectedCareers: ["Opettaja", "Sairaanhoitaja", "Psykologi", "Sosiaalityöntekijä", "Terapeutti"],
    answers: [
      2, // Q0: Tech/games - low
      3, // Q1: Puzzles - medium
      3, // Q2: Stories/drawing - medium
      2, // Q3: Building/fixing - low
      4, // Q4: Nature/animals - medium-high
      5, // Q5: Human body - HIGH
      2, // Q6: Entrepreneurship - low
      3, // Q7: Experiments - medium
      3, // Q8: Sports - medium
      5, // Q9: Teaching/explaining - HIGH
      3, // Q10: Cooking - medium
      3, // Q11: New ideas - medium
      5, // Q12: Helping friends - HIGH
      3, // Q13: Group decisions - medium
      3, // Q14: Languages - medium
      5, // Q15: Teamwork - HIGH
      3, // Q16: Clear instructions - medium
      2, // Q17: Outdoor work - low
      2, // Q18: Focus difficulty (REVERSE) - low = good focus
      3, // Q19: Variety - medium
      3, // Q20: Stress (REVERSE) - medium
      4, // Q21: Public speaking - medium-high
      4, // Q22: Initiative - medium-high
      5, // Q23: Help society - HIGH
      2, // Q24: Money - low (not motivated by money)
      2, // Q25: Recognition indifferent (REVERSE)
      5, // Q26: Work-life balance - HIGH
      2, // Q27: Be own boss - low
      3, // Q28: Travel - medium
      4, // Q29: Know future - medium-high
    ]
  },
  {
    name: "Mikko - The Builder",
    description: "Loves building, fixing, outdoor work. Practical, hands-on, concrete results.",
    expectedCategory: "rakentaja",
    expectedCareers: ["Sähköasentaja", "Automekaanikko", "LVI-asentaja", "Rakennusinsinööri", "Insinööri"],
    answers: [
      3, // Q0: Tech/games - medium
      3, // Q1: Puzzles - medium
      2, // Q2: Stories/drawing - low
      5, // Q3: Building/fixing - HIGH
      3, // Q4: Nature/animals - medium
      2, // Q5: Human body - low
      3, // Q6: Entrepreneurship - medium
      4, // Q7: Experiments - medium-high
      4, // Q8: Sports - medium-high
      2, // Q9: Teaching - low
      3, // Q10: Cooking - medium
      3, // Q11: New ideas - medium
      3, // Q12: Helping friends - medium
      3, // Q13: Group decisions - medium
      2, // Q14: Languages - low
      4, // Q15: Teamwork - medium-high
      4, // Q16: Clear instructions - medium-high
      5, // Q17: Outdoor work - HIGH
      2, // Q18: Focus difficulty (REVERSE) - low = good focus
      4, // Q19: Variety - medium-high
      2, // Q20: Stress (REVERSE) - low = handles well
      2, // Q21: Public speaking - low
      4, // Q22: Initiative - medium-high
      3, // Q23: Help society - medium
      4, // Q24: Money - medium-high
      3, // Q25: Recognition indifferent (REVERSE)
      4, // Q26: Work-life balance - medium-high
      4, // Q27: Be own boss - medium-high
      2, // Q28: Travel - low
      4, // Q29: Know future - medium-high (stability)
    ]
  },
  {
    name: "Emma - The Leader",
    description: "Loves leading, business, organizing. Ambitious, decisive, goal-oriented.",
    expectedCategory: "johtaja",
    expectedCareers: ["Yrittäjä", "Yritysjohtaja", "Projektipäällikkö", "Myyntipäällikkö", "Konsultti"],
    answers: [
      3, // Q0: Tech/games - medium
      4, // Q1: Puzzles - medium-high
      2, // Q2: Stories/drawing - low
      3, // Q3: Building/fixing - medium
      2, // Q4: Nature/animals - low
      2, // Q5: Human body - low
      5, // Q6: Entrepreneurship - HIGH
      3, // Q7: Experiments - medium
      4, // Q8: Sports - medium-high
      4, // Q9: Teaching - medium-high
      2, // Q10: Cooking - low
      5, // Q11: New ideas - HIGH
      4, // Q12: Helping friends - medium-high
      5, // Q13: Group decisions - HIGH
      4, // Q14: Languages - medium-high
      4, // Q15: Teamwork - medium-high
      4, // Q16: Clear instructions - medium-high
      2, // Q17: Outdoor work - low
      1, // Q18: Focus difficulty (REVERSE) - very low = excellent focus
      4, // Q19: Variety - medium-high
      2, // Q20: Stress (REVERSE) - low = handles well
      5, // Q21: Public speaking - HIGH
      5, // Q22: Initiative - HIGH
      4, // Q23: Help society - medium-high
      5, // Q24: Money - HIGH
      1, // Q25: Recognition indifferent (REVERSE) - low = wants recognition
      3, // Q26: Work-life balance - medium
      5, // Q27: Be own boss - HIGH
      4, // Q28: Travel - medium-high
      4, // Q29: Know future - medium-high
    ]
  }
];

// NUORI PERSONAS (Ages 20-25) - 30 questions
const NUORI_PERSONAS = [
  {
    name: "Sanna - Healthcare Professional",
    description: "Passionate about healthcare, helping patients, medical field.",
    expectedCategory: "auttaja",
    expectedCareers: ["Sairaanhoitaja", "Lääkäri", "Fysioterapeutti", "Terveydenhoitaja", "Psykologi"],
    answers: [
      2, // Q0: Software/data - low
      5, // Q1: Healthcare - HIGH
      2, // Q2: Finance - low
      2, // Q3: Creative/advertising - low
      2, // Q4: Engineering - low
      4, // Q5: Teaching/training - medium-high
      4, // Q6: HR - medium-high
      2, // Q7: Legal - low
      2, // Q8: Sales/marketing - low
      3, // Q9: Research - medium
      3, // Q10: Project management - medium
      3, // Q11: Sustainability - medium
      2, // Q12: Remote work - low (prefers in-person)
      3, // Q13: Lead people - medium
      5, // Q14: Teamwork - HIGH
      4, // Q15: Structured day - medium-high
      2, // Q16: Client fatigue (REVERSE) - low = enjoys clients
      3, // Q17: Strategic planning - medium
      4, // Q18: Detail-oriented - medium-high
      2, // Q19: Pace stress (REVERSE) - low = handles pace
      3, // Q20: High salary - medium
      5, // Q21: Work-life balance - HIGH
      3, // Q22: Quick advancement - medium
      5, // Q23: Socially meaningful - HIGH
      4, // Q24: Job security - medium-high
      5, // Q25: Continuous learning - HIGH
      3, // Q26: Autonomy - medium
      2, // Q27: Entrepreneur/freelancer - low
      2, // Q28: International - low
      2, // Q29: Culture indifferent (REVERSE) - low = cares about culture
    ]
  },
  {
    name: "Jari - Software Developer",
    description: "Loves coding, technology, problem-solving. Analytical, independent.",
    expectedCategory: "innovoija",
    expectedCareers: ["Ohjelmistokehittaja", "DevOps-insinööri", "Cloud-arkkitehti", "Tietoturvaanalyytikko", "Insinööri"],
    answers: [
      5, // Q0: Software/data - HIGH
      2, // Q1: Healthcare - low
      3, // Q2: Finance - medium
      2, // Q3: Creative/advertising - low
      4, // Q4: Engineering - medium-high
      2, // Q5: Teaching - low
      2, // Q6: HR - low
      2, // Q7: Legal - low
      2, // Q8: Sales/marketing - low
      4, // Q9: Research - medium-high
      4, // Q10: Project management - medium-high
      3, // Q11: Sustainability - medium
      5, // Q12: Remote work - HIGH
      3, // Q13: Lead people - medium
      4, // Q14: Teamwork - medium-high
      3, // Q15: Structured day - medium
      3, // Q16: Client fatigue (REVERSE) - medium
      4, // Q17: Strategic planning - medium-high
      4, // Q18: Detail-oriented - medium-high
      3, // Q19: Pace stress (REVERSE) - medium
      5, // Q20: High salary - HIGH
      4, // Q21: Work-life balance - medium-high
      4, // Q22: Quick advancement - medium-high
      3, // Q23: Socially meaningful - medium
      4, // Q24: Job security - medium-high
      5, // Q25: Continuous learning - HIGH
      5, // Q26: Autonomy - HIGH
      4, // Q27: Entrepreneur/freelancer - medium-high
      4, // Q28: International - medium-high
      3, // Q29: Culture indifferent (REVERSE) - medium
    ]
  },
  {
    name: "Noora - Marketing Creative",
    description: "Loves advertising, design, content creation. Creative, social.",
    expectedCategory: "luova",
    expectedCareers: ["Markkinointipäällikkö", "Graafinen suunnittelija", "Brändistrategi", "Toimittaja", "Journalisti"],
    answers: [
      3, // Q0: Software/data - medium
      2, // Q1: Healthcare - low
      4, // Q2: Finance - medium-high
      5, // Q3: Creative/advertising - HIGH
      2, // Q4: Engineering - low
      3, // Q5: Teaching - medium
      3, // Q6: HR - medium
      2, // Q7: Legal - low
      5, // Q8: Sales/marketing - HIGH
      3, // Q9: Research - medium
      4, // Q10: Project management - medium-high
      4, // Q11: Sustainability - medium-high
      4, // Q12: Remote work - medium-high
      3, // Q13: Lead people - medium
      5, // Q14: Teamwork - HIGH
      3, // Q15: Structured day - medium
      2, // Q16: Client fatigue (REVERSE) - low = enjoys clients
      4, // Q17: Strategic planning - medium-high
      3, // Q18: Detail-oriented - medium
      3, // Q19: Pace stress (REVERSE) - medium
      4, // Q20: High salary - medium-high
      4, // Q21: Work-life balance - medium-high
      4, // Q22: Quick advancement - medium-high
      4, // Q23: Socially meaningful - medium-high
      3, // Q24: Job security - medium
      5, // Q25: Continuous learning - HIGH
      4, // Q26: Autonomy - medium-high
      4, // Q27: Entrepreneur/freelancer - medium-high
      4, // Q28: International - medium-high
      2, // Q29: Culture indifferent (REVERSE) - low = cares about culture
    ]
  }
];

// TASO2 SHARED + LUKIO PERSONAS (20 shared + 10 lukio-specific)
const TASO2_LUKIO_PERSONAS = [
  {
    name: "Antti - Future Doctor",
    description: "Interested in medicine, science, long education. Analytical, caring.",
    expectedCategory: "auttaja",
    expectedCareers: ["Lääkäri", "Hammaslääkäri", "Tutkija", "Psykologi", "Apteekkari"],
    answers: [
      3, // Q0: Technology - medium
      5, // Q1: Healthcare - HIGH
      2, // Q2: Creative - low
      4, // Q3: Working with people - medium-high
      2, // Q4: Business - low
      3, // Q5: Environment - medium
      3, // Q6: Hands-on - medium
      5, // Q7: Analytical/problem-solving - HIGH
      4, // Q8: Teaching - medium-high
      4, // Q9: Innovation - medium-high
      4, // Q10: Teamwork - medium-high
      3, // Q11: Clear instructions - medium
      4, // Q12: Independence - medium-high
      3, // Q13: Physical/outdoor - medium
      4, // Q14: Customer service - medium-high
      4, // Q15: Work-life balance - medium-high
      3, // Q16: Good salary - medium
      5, // Q17: Help society - HIGH
      2, // Q18: Detail frustration (REVERSE) - low = likes details
      4, // Q19: Job stability - medium-high
      // LUKIO-specific Q20-Q29
      5, // Q20: Natural sciences - HIGH
      2, // Q21: Slow learning frustration (REVERSE) - low = patient
      5, // Q22: Abstract thinking - HIGH
      5, // Q23: Ready for 4-7 years study - HIGH
      5, // Q24: Intellectual challenge - HIGH
      5, // Q25: Become specialist - HIGH
      5, // Q26: Read/learn new - HIGH
      4, // Q27: International work - medium-high
      3, // Q28: Status/prestige - medium
      5, // Q29: Long-term projects - HIGH
    ]
  },
  {
    name: "Maria - Future Researcher",
    description: "Loves science, research, theoretical concepts. Analytical, academic.",
    expectedCategory: "innovoija",
    expectedCareers: ["Tutkija", "Ympäristöinsinööri", "Ympäristöasiantuntija", "Opettaja", "Strategiakonsultti"],
    answers: [
      4, // Q0: Technology - medium-high
      3, // Q1: Healthcare - medium
      3, // Q2: Creative - medium
      3, // Q3: Working with people - medium
      3, // Q4: Business - medium
      4, // Q5: Environment - medium-high
      3, // Q6: Hands-on - medium
      5, // Q7: Analytical/problem-solving - HIGH
      4, // Q8: Teaching - medium-high
      5, // Q9: Innovation - HIGH
      3, // Q10: Teamwork - medium
      3, // Q11: Clear instructions - medium
      5, // Q12: Independence - HIGH
      2, // Q13: Physical/outdoor - low
      3, // Q14: Customer service - medium
      4, // Q15: Work-life balance - medium-high
      3, // Q16: Good salary - medium
      4, // Q17: Help society - medium-high
      1, // Q18: Detail frustration (REVERSE) - very low = loves details
      3, // Q19: Job stability - medium
      // LUKIO-specific Q20-Q29
      5, // Q20: Natural sciences - HIGH
      2, // Q21: Slow learning frustration (REVERSE) - low = patient
      5, // Q22: Abstract thinking - HIGH
      5, // Q23: Ready for 4-7 years study - HIGH
      5, // Q24: Intellectual challenge - HIGH
      5, // Q25: Become specialist - HIGH
      5, // Q26: Read/learn new - HIGH
      5, // Q27: International work - HIGH
      2, // Q28: Status/prestige - low
      5, // Q29: Long-term projects - HIGH
    ]
  }
];

// TASO2 SHARED + AMIS PERSONAS (20 shared + 10 amis-specific)
const TASO2_AMIS_PERSONAS = [
  {
    name: "Teemu - Future Electrician",
    description: "Loves hands-on work, practical skills. Wants to work soon.",
    expectedCategory: "rakentaja",
    expectedCareers: ["Sähköasentaja", "LVI-asentaja", "Automekaanikko", "Rakennusinsinööri", "Insinööri"],
    answers: [
      3, // Q0: Technology - medium
      2, // Q1: Healthcare - low
      2, // Q2: Creative - low
      3, // Q3: Working with people - medium
      3, // Q4: Business - medium
      3, // Q5: Environment - medium
      5, // Q6: Hands-on - HIGH
      4, // Q7: Analytical/problem-solving - medium-high
      3, // Q8: Teaching - medium
      3, // Q9: Innovation - medium
      4, // Q10: Teamwork - medium-high
      4, // Q11: Clear instructions - medium-high
      4, // Q12: Independence - medium-high
      5, // Q13: Physical/outdoor - HIGH
      3, // Q14: Customer service - medium
      4, // Q15: Work-life balance - medium-high
      4, // Q16: Good salary - medium-high
      3, // Q17: Help society - medium
      3, // Q18: Detail frustration (REVERSE) - medium
      4, // Q19: Job stability - medium-high
      // AMIS-specific Q20-Q29
      5, // Q20: Concrete results - HIGH
      2, // Q21: Frustration when things don't work (REVERSE) - low = patient
      5, // Q22: Learn by doing - HIGH
      5, // Q23: Practical over theoretical - HIGH
      4, // Q24: Shift work OK - medium-high
      4, // Q25: Start own business - medium-high
      5, // Q26: Good employment situation - HIGH
      5, // Q27: Follow instructions/safety - HIGH
      4, // Q28: Work locally - medium-high
      5, // Q29: Learn from experienced - HIGH
    ]
  },
  {
    name: "Laura - Future Chef",
    description: "Loves cooking, creativity in food. Practical but creative.",
    expectedCategory: "luova",
    expectedCareers: ["Kokki", "Ravintolapäällikkö", "Ravintolapalvelija", "Baarimestari", "Yrittäjä"],
    answers: [
      2, // Q0: Technology - low
      2, // Q1: Healthcare - low
      5, // Q2: Creative - HIGH
      4, // Q3: Working with people - medium-high
      3, // Q4: Business - medium
      3, // Q5: Environment - medium
      5, // Q6: Hands-on - HIGH
      3, // Q7: Analytical/problem-solving - medium
      3, // Q8: Teaching - medium
      4, // Q9: Innovation - medium-high
      5, // Q10: Teamwork - HIGH
      3, // Q11: Clear instructions - medium
      4, // Q12: Independence - medium-high
      3, // Q13: Physical/outdoor - medium
      5, // Q14: Customer service - HIGH
      3, // Q15: Work-life balance - medium
      4, // Q16: Good salary - medium-high
      3, // Q17: Help society - medium
      3, // Q18: Detail frustration (REVERSE) - medium
      3, // Q19: Job stability - medium
      // AMIS-specific Q20-Q29
      5, // Q20: Concrete results - HIGH
      3, // Q21: Frustration when things don't work (REVERSE) - medium
      5, // Q22: Learn by doing - HIGH
      4, // Q23: Practical over theoretical - medium-high
      5, // Q24: Shift work OK - HIGH
      5, // Q25: Start own business - HIGH
      4, // Q26: Good employment situation - medium-high
      4, // Q27: Follow instructions/safety - medium-high
      3, // Q28: Work locally - medium
      5, // Q29: Learn from experienced - HIGH
    ]
  }
];

// ============================================================================
// TEST RUNNER USING HTTP CALLS TO LOCAL API
// ============================================================================

const API_BASE = 'http://localhost:3000';

async function makeApiCall(endpoint, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, API_BASE);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runPersonaTest(persona, cohort, subCohort = null) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`TESTING: ${persona.name}`);
  console.log(`Description: ${persona.description}`);
  console.log(`Expected Category: ${persona.expectedCategory}`);
  console.log(`Expected Careers: ${persona.expectedCareers.join(', ')}`);
  console.log(`${'='.repeat(70)}`);

  // Build request body for POST /api/score
  const requestBody = {
    cohort: cohort,
    answers: persona.answers.map((score, index) => ({
      questionIndex: index,
      score: score
    })),
    subCohort: subCohort
  };

  try {
    const result = await makeApiCall('/api/score', 'POST', requestBody);

    if (!result || !result.topCareers) {
      console.log('ERROR: Invalid API response');
      console.log('Response:', JSON.stringify(result, null, 2).substring(0, 500));
      return {
        persona: persona.name,
        categoryMatch: false,
        careerMatches: 0,
        topCategory: 'ERROR',
        expectedCategory: persona.expectedCategory
      };
    }

    const careers = result.topCareers.slice(0, 5);

    console.log(`\n🏆 TOP 5 CAREER RECOMMENDATIONS:`);
    careers.forEach((career, i) => {
      const careerTitle = career.title || career.slug || 'Unknown';
      const matchesExpected = persona.expectedCareers.some(exp => {
        const expLower = exp.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const titleLower = careerTitle.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return titleLower.includes(expLower) || expLower.includes(titleLower) ||
               titleLower === expLower;
      });
      const marker = matchesExpected ? '✅' : '⚠️';
      console.log(`  ${i+1}. ${marker} ${careerTitle} (${career.category}) - Score: ${career.overallScore || career.score || 'N/A'}%`);
    });

    // Get education path if available
    if (result.educationPath) {
      console.log(`\n📚 EDUCATION PATH:`);
      console.log(`  Primary: ${result.educationPath.primary || result.educationPath.path}`);
      console.log(`  Confidence: ${result.educationPath.confidence}`);
    }

    // Accuracy assessment
    const topCategory = careers[0]?.category;
    const categoryMatch = topCategory === persona.expectedCategory;
    const careerMatches = careers.filter(c => {
      const careerTitle = c.title || c.slug || '';
      return persona.expectedCareers.some(exp => {
        const expLower = exp.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const titleLower = careerTitle.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return titleLower.includes(expLower) || expLower.includes(titleLower) ||
               titleLower === expLower;
      });
    }).length;

    console.log(`\n📈 ACCURACY ASSESSMENT:`);
    console.log(`  Category Match: ${categoryMatch ? '✅ CORRECT' : `❌ WRONG (got ${topCategory}, expected ${persona.expectedCategory})`}`);
    console.log(`  Career Matches: ${careerMatches}/5 expected careers in top 5`);

    return {
      persona: persona.name,
      categoryMatch,
      careerMatches,
      topCategory,
      expectedCategory: persona.expectedCategory
    };
  } catch (error) {
    console.log(`ERROR testing ${persona.name}:`, error.message);
    return {
      persona: persona.name,
      categoryMatch: false,
      careerMatches: 0,
      topCategory: 'ERROR',
      expectedCategory: persona.expectedCategory
    };
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  console.log(`\n${'#'.repeat(70)}`);
  console.log(`# COMPREHENSIVE PERSONA TESTING - ALL COHORTS`);
  console.log(`# Testing accuracy of career recommendations, personality analysis,`);
  console.log(`# and education path recommendations`);
  console.log(`${'#'.repeat(70)}`);

  const results = [];

  // Test YLA Cohort
  console.log(`\n\n${'*'.repeat(70)}`);
  console.log(`* YLA COHORT (Ages 13-16) - ${YLA_PERSONAS.length} personas`);
  console.log(`${'*'.repeat(70)}`);

  for (const persona of YLA_PERSONAS) {
    results.push(await runPersonaTest(persona, 'YLA'));
  }

  // Test NUORI Cohort
  console.log(`\n\n${'*'.repeat(70)}`);
  console.log(`* NUORI COHORT (Ages 20-25) - ${NUORI_PERSONAS.length} personas`);
  console.log(`${'*'.repeat(70)}`);

  for (const persona of NUORI_PERSONAS) {
    results.push(await runPersonaTest(persona, 'NUORI'));
  }

  // Test TASO2 LUKIO
  console.log(`\n\n${'*'.repeat(70)}`);
  console.log(`* TASO2 LUKIO COHORT (Ages 16-19) - ${TASO2_LUKIO_PERSONAS.length} personas`);
  console.log(`${'*'.repeat(70)}`);

  for (const persona of TASO2_LUKIO_PERSONAS) {
    results.push(await runPersonaTest(persona, 'TASO2', 'LUKIO'));
  }

  // Test TASO2 AMIS
  console.log(`\n\n${'*'.repeat(70)}`);
  console.log(`* TASO2 AMIS COHORT (Ages 16-19) - ${TASO2_AMIS_PERSONAS.length} personas`);
  console.log(`${'*'.repeat(70)}`);

  for (const persona of TASO2_AMIS_PERSONAS) {
    results.push(await runPersonaTest(persona, 'TASO2', 'AMIS'));
  }

  // Final Summary
  console.log(`\n\n${'#'.repeat(70)}`);
  console.log(`# FINAL SUMMARY`);
  console.log(`${'#'.repeat(70)}`);

  const categoryAccuracy = results.filter(r => r.categoryMatch).length / results.length * 100;
  const avgCareerMatches = results.reduce((sum, r) => sum + r.careerMatches, 0) / results.length;

  console.log(`\n📊 OVERALL ACCURACY:`);
  console.log(`  Category Accuracy: ${categoryAccuracy.toFixed(0)}% (${results.filter(r => r.categoryMatch).length}/${results.length})`);
  console.log(`  Avg Career Matches: ${avgCareerMatches.toFixed(1)}/5 expected careers in top 5`);

  console.log(`\n📋 DETAILED RESULTS:`);
  results.forEach(r => {
    const status = r.categoryMatch ? '✅' : '❌';
    console.log(`  ${status} ${r.persona}: ${r.topCategory} (expected: ${r.expectedCategory}), ${r.careerMatches}/5 matches`);
  });

  // Identify failures
  const failures = results.filter(r => !r.categoryMatch);
  if (failures.length > 0) {
    console.log(`\n⚠️ CATEGORY MISMATCHES:`);
    failures.forEach(f => {
      console.log(`  - ${f.persona}: Got ${f.topCategory}, Expected ${f.expectedCategory}`);
    });
  }

  // Return exit code based on results
  const passed = categoryAccuracy === 100;
  console.log(`\n${passed ? '✅ ALL TESTS PASSED!' : '❌ SOME TESTS FAILED'}`);
  process.exit(passed ? 0 : 1);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
