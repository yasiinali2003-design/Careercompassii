#!/usr/bin/env node

/**
 * Full User Journey Test
 * Simulates taking the NUORI test and validates Finland-wide enhancements
 */

const http = require('http');
const https = require('https');

const BASE_URL = 'http://localhost:3000';

// Simulate a realistic NUORI user profile
const testProfile = {
  name: "Tech-Savvy Creative Professional",
  cohort: "NUORI",
  answers: [
    // Q0-9: Technology, Creative, Business interests
    { questionIndex: 0, score: 5 },  // Tech interest
    { questionIndex: 1, score: 4 },  // People interest
    { questionIndex: 2, score: 5 },  // Creative interest
    { questionIndex: 3, score: 4 },  // Business interest
    { questionIndex: 4, score: 3 },  // Analytical
    { questionIndex: 5, score: 2 },  // Physical work
    { questionIndex: 6, score: 4 },  // Problem solving
    { questionIndex: 7, score: 3 },  // Teaching
    { questionIndex: 8, score: 4 },  // Innovation
    { questionIndex: 9, score: 3 },  // Environment
    // Q10-19: Work style preferences
    { questionIndex: 10, score: 4 }, // Teamwork
    { questionIndex: 11, score: 4 }, // Leadership
    { questionIndex: 12, score: 5 }, // Independence
    { questionIndex: 13, score: 4 }, // Structure
    { questionIndex: 14, score: 5 }, // Creativity in work
    { questionIndex: 15, score: 4 }, // Fast-paced
    { questionIndex: 16, score: 3 }, // Stability
    { questionIndex: 17, score: 5 }, // Variety
    { questionIndex: 18, score: 4 }, // Remote work
    { questionIndex: 19, score: 4 }, // Entrepreneurship
    // Q20-29: Values and context
    { questionIndex: 20, score: 4 }, // Financial success
    { questionIndex: 21, score: 5 }, // Work-life balance
    { questionIndex: 22, score: 5 }, // Impact
    { questionIndex: 23, score: 4 }, // Growth opportunities
    { questionIndex: 24, score: 4 }, // Social values
    { questionIndex: 25, score: 4 }, // Global work
    { questionIndex: 26, score: 3 }, // Company size preference
    { questionIndex: 27, score: 4 }, // Flexibility
    { questionIndex: 28, score: 5 }, // Modern workplace
    { questionIndex: 29, score: 4 }  // Innovation focus
  ]
};

// Make HTTP POST request
function makeRequest(url, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const urlObj = new URL(url);

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 80,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ statusCode: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Fetch career details
function fetchCareer(slug) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}/api/careers/${slug}`;
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse career: ${e.message}`));
        }
      });
    }).on('error', reject);
  });
}

async function runFullTest() {
  console.log('🚀 CareerCompassi - Full User Journey Test\n');
  console.log('='  .repeat(80));
  console.log('Testing Profile: ' + testProfile.name);
  console.log('Cohort: ' + testProfile.cohort);
  console.log('='  .repeat(80) + '\n');

  try {
    // Step 1: Submit test
    console.log('📝 Step 1: Taking NUORI Test (30 questions)...\n');
    const response = await makeRequest(`${BASE_URL}/api/score`, {
      cohort: testProfile.cohort,
      answers: testProfile.answers
    });

    if (response.statusCode !== 200 || !response.data.success) {
      console.log('❌ Test submission failed!');
      console.log('Status:', response.statusCode);
      console.log('Response:', response.data);
      process.exit(1);
    }

    const result = response.data;
    console.log('✅ Test submitted successfully!\n');

    // Step 2: Review results
    console.log('📊 Step 2: Reviewing Test Results\n');
    console.log('-'.repeat(80));

    const careers = result.topCareers || [];
    if (careers.length === 0) {
      console.log('❌ No career matches returned!');
      process.exit(1);
    }

    console.log(`✅ Received ${careers.length} career matches\n`);
    console.log('Top 5 Career Matches:\n');

    careers.slice(0, 5).forEach((career, idx) => {
      const percentage = career.matchPercentage || career.overallScore || 0;
      console.log(`${idx + 1}. ${career.title_fi || career.title}`);
      console.log(`   Match: ${percentage}%`);
      console.log(`   Category: ${career.category || 'N/A'}`);
      console.log('');
    });

    // Step 3: Check careers for Finland-wide content
    console.log('\n' + '='.repeat(80));
    console.log('🔍 Step 3: Validating Finland-Wide Enhancements\n');
    console.log('Checking 10+ careers for:');
    console.log('  - Finland-wide context (not just Helsinki)');
    console.log('  - Multi-city employers');
    console.log('  - Age-neutral language');
    console.log('  - Remote work emphasis\n');
    console.log('-'.repeat(80) + '\n');

    // Read careers-fi.ts to check enhancements
    const fs = require('fs');
    const careersContent = fs.readFileSync('./data/careers-fi.ts', 'utf8');

    // Sample careers to check
    const careersToCheck = [
      'sisällöntuottaja',
      'product-manager',
      'ux-researcher',
      'diversity-and-inclusion-specialist',
      'sustainable-fashion-designer',
      'data-analyst',
      'content-creator',
      'social-media-manager',
      'growth-hacker',
      'devops-engineer'
    ];

    let checksPass = 0;
    let checksFail = 0;

    careersToCheck.forEach((slug, idx) => {
      // Find career in content
      const pattern = new RegExp(`"id":\\s*"${slug}"[^}]*?typical_employers[^\\]]*?\\]`, 's');
      const match = careersContent.match(pattern);

      if (!match) {
        console.log(`${idx + 1}. ⚠️  ${slug}: Not found in database`);
        checksFail++;
        return;
      }

      const careerBlock = match[0];

      // Check for Finland-wide indicators
      const hasFinlandWide =
        careerBlock.includes('Suomessa') ||
        careerBlock.includes('ympäri Suomen') ||
        careerBlock.includes('Etätyö mahdollistaa');

      const hasMultiCity =
        (careerBlock.includes('Helsinki') && careerBlock.includes('Tampere')) ||
        (careerBlock.includes('Turku') || careerBlock.includes('Oulu'));

      const hasAgeSpecific =
        careerBlock.includes('20-25-vuotiaille') ||
        careerBlock.includes('nuorille ammattilaisille');

      const isGood = hasFinlandWide || hasMultiCity;
      const isClean = !hasAgeSpecific;

      if (isGood && isClean) {
        console.log(`${idx + 1}. ✅ ${slug}`);
        if (hasFinlandWide) console.log(`     ✓ Finland-wide context found`);
        if (hasMultiCity) console.log(`     ✓ Multi-city employers found`);
        checksPass++;
      } else {
        console.log(`${idx + 1}. ⚠️  ${slug}`);
        if (!hasFinlandWide && !hasMultiCity) console.log(`     ⚠ Missing Finland-wide context`);
        if (hasAgeSpecific) console.log(`     ⚠ Contains age-specific language`);
        checksFail++;
      }
      console.log('');
    });

    // Summary
    console.log('\n' + '='.repeat(80));
    console.log('📈 TEST SUMMARY\n');
    console.log('Test Submission:');
    console.log(`  ✅ Test completed successfully`);
    console.log(`  ✅ Received ${careers.length} career matches`);
    console.log(`  ✅ Top match: ${careers[0].title_fi} (${careers[0].matchPercentage || careers[0].overallScore}%)`);
    console.log('');
    console.log('Finland-Wide Enhancement Validation:');
    console.log(`  ✅ Passed: ${checksPass}/${careersToCheck.length} careers`);
    console.log(`  ⚠️  Failed: ${checksFail}/${careersToCheck.length} careers`);
    console.log('');

    const successRate = (checksPass / careersToCheck.length) * 100;

    if (successRate >= 80) {
      console.log('🎉 EXCELLENT! Platform is ready for piloting');
      console.log('   - Test flow works smoothly');
      console.log('   - Career matching is functioning');
      console.log('   - Finland-wide enhancements are in place');
    } else if (successRate >= 60) {
      console.log('⚠️  GOOD - Minor improvements recommended');
      console.log('   - Test flow works');
      console.log('   - Some careers need enhancement review');
    } else {
      console.log('❌ NEEDS WORK - Significant improvements needed');
      console.log('   - Review career enhancements');
    }

    console.log('');
    console.log('='  .repeat(80));
    console.log('\n✅ Full user journey test complete!\n');

  } catch (error) {
    console.log('\n❌ Test failed with error:');
    console.log(error.message);
    console.log('');
    process.exit(1);
  }
}

// Run the test
runFullTest();
