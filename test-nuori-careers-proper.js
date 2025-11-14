#!/usr/bin/env node

/**
 * PROPER Test for NUORI Career Matching
 * Uses correct NUORI question mappings (Q0-Q29)
 *
 * NUORI Question Breakdown:
 * Q0-9: Career Fields (technology, health, creative, business, etc.)
 * Q10-17: Work Values (financial, social_impact, stability, advancement, growth, etc.)
 * Q18-24: Work Environment (remote, office, travel, company_size, etc.)
 * Q25-29: Work Style (autonomy, leadership, teamwork, structure, variety)
 */

const http = require('http');

const testCases = [
  {
    name: "Tech Startup Enthusiast",
    cohort: "NUORI",
    description: "Should match: Product Manager, Growth Hacker, DevOps Engineer",
    expectedCareers: ["Product Manager", "Growth Hacker", "DevOps", "Data Analyst", "UX Researcher"],
    answers: [
      // Q0-9: Career Fields
      5, // Q0: IT-ala ja digitaaliset ratkaisut (technology) - HIGH
      1, // Q1: Terveydenhuolto (health) - LOW
      3, // Q2: Luovat alat (creative) - MEDIUM
      5, // Q3: Liike-elämä ja johtaminen (business) - HIGH ✓
      4, // Q4: Tekniikka ja insinöörityö (technology) - HIGH
      1, // Q5: Opetusala (education) - LOW
      3, // Q6: Tutkimustyö (analytical) - MEDIUM
      2, // Q7: Oikeusala (analytical) - LOW
      3, // Q8: Media ja journalismi (creative) - MEDIUM
      2, // Q9: Matkailu ja ravintola (hands_on) - LOW

      // Q10-17: Work Values
      4, // Q10: Hyvä palkka (financial) - HIGH
      4, // Q11: Yhteiskunnallinen vaikutus (social_impact) - HIGH
      2, // Q12: Varma työpaikka (stability) - LOW (startup mentality)
      5, // Q13: Nopea eteneminen (advancement) - HIGH ✓
      5, // Q14: Työ-vapaa-aika tasapaino (work_life_balance) - HIGH
      4, // Q15: Kansainvälinen ympäristö (global) - HIGH
      5, // Q16: Jatkuva oppiminen (growth) - HIGH ✓
      5, // Q17: Luovuus ja uudet ideat (creative) - HIGH

      // Q18-24: Work Environment
      4, // Q18: Etätyö (work_environment) - HIGH
      2, // Q19: Perinteinen toimisto (structure) - LOW
      3, // Q20: Liikkuminen työssä (work_environment) - MEDIUM
      2, // Q21: Iso yritys (company_size) - LOW
      5, // Q22: Startup-yritys (company_size reverse) - HIGH ✓
      3, // Q23: Vuorotyö (flexibility) - MEDIUM
      3, // Q24: Matkustaminen ulkomailla (global) - MEDIUM

      // Q25-29: Work Style
      5, // Q25: Itsenäinen työskentely (autonomy) - HIGH
      4, // Q26: Johtaminen (leadership) - HIGH ✓
      5, // Q27: Tiimityö (teamwork) - HIGH
      2, // Q28: Selkeät rutiinit (structure) - LOW
      5  // Q29: Vaihteleva työ (variety) - HIGH
    ].map((score, i) => ({ questionIndex: i, score }))
  },
  {
    name: "Social Impact Activist",
    cohort: "NUORI",
    description: "Should match: Diversity & Inclusion, Social Justice, Community Organizer",
    expectedCareers: ["Diversity", "Social Justice", "Community Organizer", "Gender Equality"],
    answers: [
      // Q0-9: Career Fields
      2, // Q0: IT-ala (technology) - LOW
      4, // Q1: Terveydenhuolto (health) - HIGH (caring)
      3, // Q2: Luovat alat (creative) - MEDIUM
      3, // Q3: Liike-elämä (business) - MEDIUM
      1, // Q4: Tekniikka (technology) - LOW
      5, // Q5: Opetusala (education) - HIGH ✓
      4, // Q6: Tutkimustyö (analytical) - HIGH
      3, // Q7: Oikeusala (analytical) - MEDIUM (rights work)
      4, // Q8: Media ja journalismi (creative) - HIGH (advocacy)
      2, // Q9: Matkailu ja ravintola (hands_on) - LOW

      // Q10-17: Work Values
      2, // Q10: Hyvä palkka (financial) - LOW (mission over money)
      5, // Q11: Yhteiskunnallinen vaikutus (social_impact) - HIGH ✓✓✓
      3, // Q12: Varma työpaikka (stability) - MEDIUM
      3, // Q13: Nopea eteneminen (advancement) - MEDIUM
      4, // Q14: Työ-vapaa-aika tasapaino (work_life_balance) - HIGH
      4, // Q15: Kansainvälinen ympäristö (global) - HIGH
      5, // Q16: Jatkuva oppiminen (growth) - HIGH
      4, // Q17: Luovuus ja uudet ideat (creative) - HIGH

      // Q18-24: Work Environment
      3, // Q18: Etätyö (work_environment) - MEDIUM
      2, // Q19: Perinteinen toimisto (structure) - LOW
      5, // Q20: Liikkuminen työssä (work_environment) - HIGH (community work)
      2, // Q21: Iso yritys (company_size) - LOW (NGO work)
      3, // Q22: Startup-yritys (company_size reverse) - MEDIUM
      4, // Q23: Vuorotyö (flexibility) - HIGH (flexible hours)
      3, // Q24: Matkustaminen ulkomailla (global) - MEDIUM

      // Q25-29: Work Style
      3, // Q25: Itsenäinen työskentely (autonomy) - MEDIUM
      4, // Q26: Johtaminen (leadership) - HIGH ✓
      5, // Q27: Tiimityö (teamwork) - HIGH ✓
      2, // Q28: Selkeät rutiinit (structure) - LOW
      5  // Q29: Vaihteleva työ (variety) - HIGH
    ].map((score, i) => ({ questionIndex: i, score }))
  },
  {
    name: "Sustainability Champion",
    cohort: "NUORI",
    description: "Should match: Sustainable Fashion, Circular Economy, Zero Waste",
    expectedCareers: ["Sustainable", "Circular Economy", "Zero Waste", "Ethical Brand"],
    answers: [
      // Q0-9: Career Fields
      3, // Q0: IT-ala (technology) - MEDIUM (green tech)
      2, // Q1: Terveydenhuolto (health) - LOW
      5, // Q2: Luovat alat (creative) - HIGH ✓ (sustainable design)
      4, // Q3: Liike-elämä (business) - HIGH (ethical business)
      3, // Q4: Tekniikka (technology) - MEDIUM (green tech)
      3, // Q5: Opetusala (education) - MEDIUM
      4, // Q6: Tutkimustyö (analytical) - HIGH (environmental research)
      2, // Q7: Oikeusala (analytical) - LOW
      3, // Q8: Media ja journalismi (creative) - MEDIUM
      2, // Q9: Matkailu ja ravintola (hands_on) - LOW

      // Q10-17: Work Values
      3, // Q10: Hyvä palkka (financial) - MEDIUM
      5, // Q11: Yhteiskunnallinen vaikutus (social_impact) - HIGH ✓✓✓
      3, // Q12: Varma työpaikka (stability) - MEDIUM
      3, // Q13: Nopea eteneminen (advancement) - MEDIUM
      4, // Q14: Työ-vapaa-aika tasapaino (work_life_balance) - HIGH
      4, // Q15: Kansainvälinen ympäristö (global) - HIGH
      5, // Q16: Jatkuva oppiminen (growth) - HIGH
      5, // Q17: Luovuus ja uudet ideat (creative) - HIGH ✓

      // Q18-24: Work Environment
      3, // Q18: Etätyö (work_environment) - MEDIUM
      2, // Q19: Perinteinen toimisto (structure) - LOW
      4, // Q20: Liikkuminen työssä (work_environment) - HIGH
      2, // Q21: Iso yritys (company_size) - LOW
      4, // Q22: Startup-yritys (company_size reverse) - HIGH
      3, // Q23: Vuorotyö (flexibility) - MEDIUM
      4, // Q24: Matkustaminen ulkomailla (global) - HIGH

      // Q25-29: Work Style
      4, // Q25: Itsenäinen työskentely (autonomy) - HIGH
      3, // Q26: Johtaminen (leadership) - MEDIUM
      4, // Q27: Tiimityö (teamwork) - HIGH
      2, // Q28: Selkeät rutiinit (structure) - LOW
      5  // Q29: Vaihteleva työ (variety) - HIGH
    ].map((score, i) => ({ questionIndex: i, score }))
  },
  {
    name: "Business Consultant",
    cohort: "NUORI",
    description: "Should match: Management Consultant, Strategy Consultant, Business Analyst",
    expectedCareers: ["Management Consultant", "Strategy Consultant", "Business Analyst", "Digital Transformation"],
    answers: [
      // Q0-9: Career Fields
      4, // Q0: IT-ala (technology) - HIGH (digital transformation)
      1, // Q1: Terveydenhuolto (health) - LOW
      2, // Q2: Luovat alat (creative) - LOW
      5, // Q3: Liike-elämä ja johtaminen (business) - HIGH ✓✓✓
      3, // Q4: Tekniikka (technology) - MEDIUM
      2, // Q5: Opetusala (education) - LOW
      5, // Q6: Tutkimustyö (analytical) - HIGH ✓✓✓
      3, // Q7: Oikeusala (analytical) - MEDIUM
      2, // Q8: Media ja journalismi (creative) - LOW
      1, // Q9: Matkailu ja ravintola (hands_on) - LOW

      // Q10-17: Work Values
      5, // Q10: Hyvä palkka (financial) - HIGH ✓
      4, // Q11: Yhteiskunnallinen vaikutus (social_impact) - HIGH
      3, // Q12: Varma työpaikka (stability) - MEDIUM
      5, // Q13: Nopea eteneminen (advancement) - HIGH ✓
      3, // Q14: Työ-vapaa-aika tasapaino (work_life_balance) - MEDIUM
      5, // Q15: Kansainvälinen ympäristö (global) - HIGH
      5, // Q16: Jatkuva oppiminen (growth) - HIGH ✓
      4, // Q17: Luovuus ja uudet ideat (creative) - HIGH

      // Q18-24: Work Environment
      3, // Q18: Etätyö (work_environment) - MEDIUM
      4, // Q19: Perinteinen toimisto (structure) - HIGH
      5, // Q20: Liikkuminen työssä (work_environment) - HIGH (client visits)
      4, // Q21: Iso yritys (company_size) - HIGH (consulting firms)
      2, // Q22: Startup-yritys (company_size reverse) - LOW
      3, // Q23: Vuorotyö (flexibility) - MEDIUM
      5, // Q24: Matkustaminen ulkomailla (global) - HIGH

      // Q25-29: Work Style
      4, // Q25: Itsenäinen työskentely (autonomy) - HIGH
      5, // Q26: Johtaminen (leadership) - HIGH ✓✓✓
      5, // Q27: Tiimityö (teamwork) - HIGH
      3, // Q28: Selkeät rutiinit (structure) - MEDIUM
      5  // Q29: Vaihteleva työ (variety) - HIGH (different projects)
    ].map((score, i) => ({ questionIndex: i, score }))
  },
  {
    name: "Creative Content Creator",
    cohort: "NUORI",
    description: "Should match: Content Creator, Social Media Manager, Video Editor",
    expectedCareers: ["Content Creator", "Social Media", "Video Editor", "Content Strategist", "Digital Content"],
    answers: [
      // Q0-9: Career Fields
      5, // Q0: IT-ala (technology) - HIGH (digital platforms)
      1, // Q1: Terveydenhuolto (health) - LOW
      5, // Q2: Luovat alat (creative) - HIGH ✓✓✓
      3, // Q3: Liike-elämä (business) - MEDIUM (content strategy)
      3, // Q4: Tekniikka (technology) - MEDIUM (editing tools)
      2, // Q5: Opetusala (education) - LOW
      2, // Q6: Tutkimustyö (analytical) - LOW
      1, // Q7: Oikeusala (analytical) - LOW
      5, // Q8: Media ja journalismi (creative) - HIGH ✓✓✓
      2, // Q9: Matkailu ja ravintola (hands_on) - LOW

      // Q10-17: Work Values
      4, // Q10: Hyvä palkka (financial) - HIGH
      3, // Q11: Yhteiskunnallinen vaikutus (social_impact) - MEDIUM
      2, // Q12: Varma työpaikka (stability) - LOW (freelance ok)
      4, // Q13: Nopea eteneminen (advancement) - HIGH
      5, // Q14: Työ-vapaa-aika tasapaino (work_life_balance) - HIGH
      3, // Q15: Kansainvälinen ympäristö (global) - MEDIUM
      5, // Q16: Jatkuva oppiminen (growth) - HIGH
      5, // Q17: Luovuus ja uudet ideat (creative) - HIGH ✓✓✓

      // Q18-24: Work Environment
      5, // Q18: Etätyö (work_environment) - HIGH ✓
      1, // Q19: Perinteinen toimisto (structure) - LOW
      3, // Q20: Liikkuminen työssä (work_environment) - MEDIUM
      2, // Q21: Iso yritys (company_size) - LOW
      4, // Q22: Startup-yritys (company_size reverse) - HIGH
      4, // Q23: Vuorotyö (flexibility) - HIGH (flexible hours)
      2, // Q24: Matkustaminen ulkomailla (global) - LOW

      // Q25-29: Work Style
      5, // Q25: Itsenäinen työskentely (autonomy) - HIGH ✓
      2, // Q26: Johtaminen (leadership) - LOW
      4, // Q27: Tiimityö (teamwork) - HIGH
      2, // Q28: Selkeät rutiinit (structure) - LOW
      5  // Q29: Vaihteleva työ (variety) - HIGH
    ].map((score, i) => ({ questionIndex: i, score }))
  }
];

// Make HTTP POST request
function makeRequest(cohort, answers) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      cohort: cohort,
      answers: answers
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

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Failed to parse response: ' + e.message));
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

// Main test function
async function runTests() {
  console.log('⏳ Starting tests in 2 seconds...\n');
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('🧪 Testing 75 New Helsinki Careers for NUORI Cohort (PROPER TEST)');
  console.log('\nTesting against: http://localhost:3000');
  console.log('='.repeat(80));
  console.log('\n');

  const results = [];
  let totalMatches = 0;

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`${i + 1}/${testCases.length}: ${testCase.name}`);
    console.log(`Description: ${testCase.description}`);
    console.log('-'.repeat(80));

    try {
      const response = await makeRequest(testCase.cohort, testCase.answers);

      const careers = response.topCareers || response.careers || [];
      if (careers.length > 0) {
        console.log(`    ✅ Got ${careers.length} career matches`);

        // Get top 10 careers
        const top10 = careers.slice(0, 10);
        console.log(`    📊 Top 10 careers:`);
        top10.forEach((career, idx) => {
          const matchedExpected = testCase.expectedCareers.some(exp =>
            (career.title_fi && career.title_fi.includes(exp)) || (career.title_en && career.title_en.includes(exp)) || (career.title && career.title.includes(exp))
          );
          const marker = matchedExpected ? '🎯' : '   ';
          const title = career.title_fi || career.title || 'Unknown';
          const percentage = career.matchPercentage || career.overallScore || 0;
          console.log(`       ${marker} ${idx + 1}. ${title} (${percentage}%)`);
        });

        // Check how many expected careers appeared
        const foundCareers = testCase.expectedCareers.filter(expected =>
          top10.some(career => {
            const title = career.title_fi || career.title || '';
            const titleEn = career.title_en || '';
            return title.includes(expected) || titleEn.includes(expected);
          })
        );

        console.log(`\n    🎯 Expected careers found: ${foundCareers.length}/${testCase.expectedCareers.length}`);
        if (foundCareers.length > 0) {
          foundCareers.forEach(c => console.log(`       ✓ ${c}`));
          totalMatches++;
        } else {
          console.log(`       ⚠️  None of the expected new careers appeared in top 10`);
        }

        results.push({
          name: testCase.name,
          passed: foundCareers.length > 0,
          foundCount: foundCareers.length,
          expectedCount: testCase.expectedCareers.length,
          foundCareers: foundCareers,
          top5: top10.slice(0, 5).map(c => c.title_fi || c.title || 'Unknown')
        });
      } else {
        console.log(`    ❌ No careers returned`);
        results.push({
          name: testCase.name,
          passed: false,
          foundCount: 0,
          expectedCount: testCase.expectedCareers.length,
          foundCareers: [],
          top5: []
        });
      }
    } catch (error) {
      console.log(`    ❌ Test failed: ${error.message}`);
      results.push({
        name: testCase.name,
        passed: false,
        error: error.message
      });
    }

    console.log('');
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 NEW CAREERS TEST SUMMARY (PROPER NUORI QUESTIONS):');
  console.log('='.repeat(80));
  const successRate = (totalMatches / testCases.length) * 100;
  console.log(`   Total test profiles: ${testCases.length}`);
  console.log(`   ✅ Successful matches: ${totalMatches} (${successRate.toFixed(1)}%)`);
  console.log(`   ❌ Failed matches: ${testCases.length - totalMatches} (${(100 - successRate).toFixed(1)}%)`);

  console.log('\n📋 DETAILED RESULTS:\n');
  results.forEach(result => {
    const icon = result.passed ? '✅' : '❌';
    console.log(`${icon} ${result.name}`);
    if (!result.error) {
      console.log(`   Matched: ${result.foundCount}/${result.expectedCount} expected careers`);
      console.log(`   Top 5: ${result.top5.join(', ')}`);
    } else {
      console.log(`   Error: ${result.error}`);
    }
    console.log('');
  });

  console.log('='.repeat(80));
  if (successRate >= 80) {
    console.log('🎉 EXCELLENT! New careers are matching well (≥80% success rate)');
  } else if (successRate >= 50) {
    console.log('👍 GOOD! New careers are appearing but need fine-tuning (50-79% success)');
  } else {
    console.log('❌ NEW CAREERS NEED SIGNIFICANT IMPROVEMENTS (<50% success rate)');
  }
  console.log('='.repeat(80) + '\n');
}

runTests();
