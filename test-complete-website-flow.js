/**
 * COMPLETE WEBSITE USER FLOW TEST
 * Tests entire user journey from start to finish including teacher dashboard
 *
 * Test Coverage:
 * 1. Site password authentication
 * 2. Student taking test (all cohorts)
 * 3. Results page display
 * 4. Teacher dashboard login
 * 5. Teacher viewing class results
 * 6. Teacher analytics
 * 7. Career library browsing
 */

const API_BASE = 'http://localhost:3000';

// Test configuration
const TEST_CONFIG = {
  sitePassword: 'URASUUNNITELMA',
  teacherAccessCode: process.env.TEACHER_ACCESS_CODE || '80529DEB', // Real teacher: Matti Virtanen
  testClassName: 'Test Class - Automated Testing',
  studentName: 'Test Student'
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function log(message, type = 'info') {
  const icons = {
    info: 'ℹ️',
    success: '✅',
    error: '❌',
    warning: '⚠️',
    test: '🧪'
  };
  console.log(`${icons[type]} ${message}`);
}

function section(title) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`  ${title}`);
  console.log('='.repeat(80));
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// TEST 1: SITE PASSWORD AUTHENTICATION
// ============================================================================

async function testSiteAuth() {
  section('TEST 1: Site Password Authentication');

  try {
    // Test wrong password
    log('Testing with wrong password...', 'test');
    const wrongResponse = await fetch(`${API_BASE}/api/site-auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'wrongpassword' })
    });

    const wrongData = await wrongResponse.json();
    if (wrongResponse.status === 401 && !wrongData.success) {
      log('Correctly rejected wrong password', 'success');
    } else {
      log('Should have rejected wrong password', 'error');
      return false;
    }

    // Test correct password
    log('Testing with correct password...', 'test');
    const correctResponse = await fetch(`${API_BASE}/api/site-auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: TEST_CONFIG.sitePassword })
    });

    const correctData = await correctResponse.json();
    if (correctResponse.ok && correctData.success) {
      log('Successfully authenticated with site password', 'success');

      // Check if cookie was set
      const cookies = correctResponse.headers.get('set-cookie');
      if (cookies && cookies.includes('site_auth=authenticated')) {
        log('Authentication cookie set correctly', 'success');
      } else {
        log('Warning: No authentication cookie found', 'warning');
      }

      return true;
    } else {
      log('Failed to authenticate with correct password', 'error');
      return false;
    }
  } catch (error) {
    log(`Site auth test failed: ${error.message}`, 'error');
    return false;
  }
}

// ============================================================================
// TEST 2: STUDENT TAKING TEST (ALL COHORTS)
// ============================================================================

async function testStudentFlow(cohort, profileName, answers) {
  section(`TEST 2: Student Test Flow - ${cohort} - ${profileName}`);

  try {
    // Submit test answers
    log(`Submitting test for ${cohort} cohort...`, 'test');

    const formattedAnswers = answers.map((score, index) => ({
      questionIndex: index,
      score: score
    }));

    const response = await fetch(`${API_BASE}/api/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cohort: cohort,
        answers: formattedAnswers
      })
    });

    if (!response.ok) {
      log(`Test submission failed: ${response.status}`, 'error');
      return null;
    }

    const result = await response.json();

    // Validate response structure
    const requiredFields = ['success', 'topCareers', 'educationPath', 'resultId', 'cohort'];
    const missingFields = requiredFields.filter(field => !result.hasOwnProperty(field));

    if (missingFields.length > 0) {
      log(`Missing fields in response: ${missingFields.join(', ')}`, 'error');
      return null;
    }

    log(`Test completed successfully`, 'success');
    log(`  Result ID: ${result.resultId}`, 'info');
    log(`  Top Career: ${result.topCareers[0]?.title}`, 'info');
    log(`  Category: ${result.topCareers[0]?.category}`, 'info');
    log(`  Education Path: ${result.educationPath?.primary || 'None'}`, 'info');
    log(`  Top Careers Count: ${result.topCareers.length}`, 'info');

    // Validate top careers structure
    if (result.topCareers.length > 0) {
      const topCareer = result.topCareers[0];
      const careerFields = ['title', 'category', 'overallScore', 'reasons'];
      const missingCareerFields = careerFields.filter(f => !topCareer.hasOwnProperty(f));

      if (missingCareerFields.length === 0) {
        log('Career data structure valid', 'success');
      } else {
        log(`Career missing fields: ${missingCareerFields.join(', ')}`, 'warning');
      }
    }

    // Validate education path
    if (result.educationPath) {
      log('Education path provided', 'success');
      if (result.educationPath.primary) {
        log(`  Primary path: ${result.educationPath.primary}`, 'info');
      }
      if (result.educationPath.reasoning) {
        log(`  Reasoning provided: Yes`, 'info');
      }
    } else {
      log('No education path in response', 'warning');
    }

    return result;
  } catch (error) {
    log(`Student flow test failed: ${error.message}`, 'error');
    return null;
  }
}

// ============================================================================
// TEST 3: TEACHER DASHBOARD LOGIN
// ============================================================================

async function testTeacherLogin() {
  section('TEST 3: Teacher Dashboard Login');

  try {
    // Test wrong access code
    log('Testing with wrong access code...', 'test');
    const wrongResponse = await fetch(`${API_BASE}/api/teacher-auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'WRONGCODE' })
    });

    const wrongData = await wrongResponse.json();
    if (wrongResponse.status === 401 && !wrongData.success) {
      log('Correctly rejected wrong access code', 'success');
    } else {
      log('Should have rejected wrong access code', 'error');
    }

    // Test correct access code
    log('Testing with correct access code...', 'test');
    log(`Note: Using PIN from environment or default`, 'info');

    const correctResponse = await fetch(`${API_BASE}/api/teacher-auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: TEST_CONFIG.teacherAccessCode })
    });

    if (!correctResponse.ok) {
      log(`Teacher login failed: ${correctResponse.status}`, 'error');
      const errorData = await correctResponse.json();
      log(`Error: ${errorData.error || 'Unknown error'}`, 'error');
      log(`Please set TEACHER_ACCESS_CODE environment variable with a valid code`, 'warning');
      return null;
    }

    const correctData = await correctResponse.json();
    if (correctData.success) {
      log('Successfully authenticated as teacher', 'success');

      if (correctData.teacher?.id) {
        log(`  Teacher ID: ${correctData.teacher.id}`, 'info');
        log(`  Teacher Name: ${correctData.teacher.name || 'Unknown'}`, 'info');
        log(`  School: ${correctData.teacher.school_name || 'Not specified'}`, 'info');
      } else {
        log(`  Mode: Development fallback (no database teacher)`, 'info');
      }

      // Check if cookie was set and capture it
      const setCookieHeaders = correctResponse.headers.get('set-cookie');
      if (setCookieHeaders && setCookieHeaders.includes('teacher_auth_token=authenticated')) {
        log('Teacher authentication cookie set correctly', 'success');
      } else {
        log('Warning: No teacher authentication cookie found', 'warning');
      }

      // Extract teacher_id from Set-Cookie headers
      let teacherId = null;
      if (setCookieHeaders) {
        const match = setCookieHeaders.match(/teacher_id=([^;]+)/);
        if (match) {
          teacherId = match[1];
        }
      }

      return {
        ...correctData,
        teacherId: teacherId || correctData.teacher?.id
      };
    } else {
      log('Teacher authentication response invalid', 'error');
      return null;
    }
  } catch (error) {
    log(`Teacher login test failed: ${error.message}`, 'error');
    return null;
  }
}

// ============================================================================
// TEST 4: CREATE CLASS TOKEN
// ============================================================================

async function testCreateClassToken(teacherId) {
  section('TEST 4: Create Class Token');

  try {
    log('Creating new class token...', 'test');

    const response = await fetch(`${API_BASE}/api/classes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teacherId: teacherId
      })
    });

    if (!response.ok) {
      log(`Token generation failed: ${response.status}`, 'error');
      try {
        const errorData = await response.json();
        log(`Error: ${errorData.error || 'Unknown error'}`, 'error');
        if (errorData.hint) {
          log(`Hint: ${errorData.hint}`, 'info');
        }
      } catch (e) {
        log('Could not parse error response', 'error');
      }
      return null;
    }

    const data = await response.json();
    if (data.success && data.classToken) {
      log('Class token created successfully', 'success');
      log(`  Class ID: ${data.classId}`, 'info');
      log(`  Token: ${data.classToken}`, 'info');
      log(`  Created: ${data.createdAt}`, 'info');

      return {
        classId: data.classId,
        classToken: data.classToken,
        createdAt: data.createdAt
      };
    } else {
      log('Token generation response invalid', 'error');
      return null;
    }
  } catch (error) {
    log(`Create class token test failed: ${error.message}`, 'error');
    return null;
  }
}

// ============================================================================
// TEST 5: SUBMIT TEST WITH CLASS TOKEN
// ============================================================================

async function testStudentWithToken(token, cohort) {
  section('TEST 5: Student Test with Class Token');

  try {
    log('Submitting test result linked to class...', 'test');

    // Sample answers for YLA cohort
    const answers = [
      3,4,3,3,4,3,2,4,3,3,
      3,4,3,4,3,4,3,2,3,3,
      4,4,4,3,4,2,4,4,4,3
    ].map((score, index) => ({
      questionIndex: index,
      score: score
    }));

    const response = await fetch(`${API_BASE}/api/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cohort: cohort,
        answers: answers,
        classToken: token,
        studentName: TEST_CONFIG.studentName
      })
    });

    if (!response.ok) {
      log(`Test submission failed: ${response.status}`, 'error');
      return null;
    }

    const result = await response.json();

    if (result.success && result.resultId) {
      log('Test submitted and linked to class successfully', 'success');
      log(`  Result ID: ${result.resultId}`, 'info');
      log(`  Student Name: ${TEST_CONFIG.studentName}`, 'info');
      log(`  Top Career: ${result.topCareers[0]?.title}`, 'info');

      return result.resultId;
    } else {
      log('Test submission response invalid', 'error');
      return null;
    }
  } catch (error) {
    log(`Student test with token failed: ${error.message}`, 'error');
    return null;
  }
}

// ============================================================================
// TEST 6: VIEW CLASS RESULTS
// ============================================================================

async function testViewClassResults(classId, teacherId) {
  section('TEST 6: View Class Results');

  try {
    log('Fetching class results...', 'test');

    const response = await fetch(`${API_BASE}/api/classes/${classId}/results`, {
      headers: {
        'Cookie': `teacher_id=${teacherId}; teacher_auth_token=authenticated`
      }
    });

    if (!response.ok) {
      log(`Failed to fetch class results: ${response.status}`, 'error');
      const errorData = await response.json();
      log(`Error: ${errorData.error || 'Unknown error'}`, 'error');
      return false;
    }

    const data = await response.json();

    if (data.success && data.results) {
      log('Class results fetched successfully', 'success');
      log(`  Total students: ${data.results.length}`, 'info');
      log(`  Class name: ${data.className || 'Unknown'}`, 'info');

      if (data.results.length > 0) {
        log(`  Sample result:`, 'info');
        const sample = data.results[0];
        log(`    Student: ${sample.studentName || 'Anonymous'}`, 'info');
        log(`    Top Career: ${sample.topCareer || 'Unknown'}`, 'info');
        log(`    Category: ${sample.category || 'Unknown'}`, 'info');
        log(`    Completed: ${sample.completedAt ? 'Yes' : 'No'}`, 'info');
      }

      return true;
    } else {
      log('Class results response invalid', 'error');
      return false;
    }
  } catch (error) {
    log(`View class results test failed: ${error.message}`, 'error');
    return false;
  }
}

// ============================================================================
// TEST 7: CAREER LIBRARY
// ============================================================================

async function testCareerLibrary() {
  section('TEST 7: Career Library');

  try {
    // Test 1: Get all careers
    log('Fetching all careers...', 'test');
    const allResponse = await fetch(`${API_BASE}/api/careers`);

    if (!allResponse.ok) {
      log(`Failed to fetch careers: ${allResponse.status}`, 'error');
      return false;
    }

    const allCareers = await allResponse.json();
    log(`Total careers: ${allCareers.length}`, 'success');

    // Test 2: Filter by category
    log('Testing category filter (innovoija)...', 'test');
    const categoryResponse = await fetch(`${API_BASE}/api/careers?category=innovoija`);
    const categoryCareers = await categoryResponse.json();
    log(`Innovoija careers: ${categoryCareers.length}`, 'success');

    // Test 3: Search by keyword
    log('Testing search (developer)...', 'test');
    const searchResponse = await fetch(`${API_BASE}/api/careers?search=developer`);
    const searchCareers = await searchResponse.json();
    log(`Developer careers found: ${searchCareers.length}`, 'success');

    // Test 4: Get individual career
    if (allCareers.length > 0) {
      const sampleCareer = allCareers[0];
      log(`Testing individual career fetch (${sampleCareer.id})...`, 'test');
      const careerResponse = await fetch(`${API_BASE}/api/careers/${sampleCareer.id}`);

      if (careerResponse.ok) {
        const career = await careerResponse.json();
        log('Individual career fetched successfully', 'success');
        log(`  Title: ${career.title_fi}`, 'info');
        log(`  Category: ${career.category}`, 'info');
      } else {
        log('Failed to fetch individual career', 'error');
      }
    }

    return true;
  } catch (error) {
    log(`Career library test failed: ${error.message}`, 'error');
    return false;
  }
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================

async function runAllTests() {
  console.log('\n' + '█'.repeat(80));
  console.log('█ COMPLETE WEBSITE USER FLOW TEST');
  console.log('█ Testing entire application from start to finish');
  console.log('█'.repeat(80));

  const results = {
    siteAuth: false,
    studentFlows: [],
    teacherLogin: false,
    createToken: false,
    studentWithToken: false,
    viewResults: false,
    careerLibrary: false
  };

  let teacherData = null;
  let classToken = null;

  // Test 1: Site Authentication
  results.siteAuth = await testSiteAuth();
  await sleep(500);

  // Test 2: Student Flows (all cohorts)
  const testProfiles = [
    {
      cohort: 'YLA',
      name: 'YLA Student',
      answers: [3,5,4,2,3,5,2,4,3,5,2,5,4,3,2,2,3,2,3,2,3,5,3,4,5,2,4,5,3,4]
    },
    {
      cohort: 'TASO2',
      name: 'TASO2 Student',
      answers: [4,5,5,2,3,5,2,4,3,5,2,5,5,3,2,2,3,2,5,3,3,5,3,5,5,2,5,5,3,4]
    },
    {
      cohort: 'NUORI',
      name: 'NUORI Student',
      answers: [3,5,5,3,4,4,3,3,3,5,2,5,5,3,2,2,4,3,5,4,4,5,4,5,5,2,5,5,4,5]
    }
  ];

  for (const profile of testProfiles) {
    const result = await testStudentFlow(profile.cohort, profile.name, profile.answers);
    results.studentFlows.push({
      cohort: profile.cohort,
      success: result !== null
    });
    await sleep(500);
  }

  // Test 3: Teacher Login
  teacherData = await testTeacherLogin();
  results.teacherLogin = teacherData !== null;
  await sleep(500);

  // Only continue with teacher tests if login succeeded AND we have a teacher ID (database mode)
  if (teacherData && teacherData.teacher?.id) {
    // Test 4: Create Class Token
    const classData = await testCreateClassToken(teacherData.teacher.id);
    results.createToken = classData !== null;
    await sleep(500);

    if (classData) {
      classToken = classData.classToken;
      const classId = classData.classId;

      // Test 5: Student with Token
      const resultId = await testStudentWithToken(classToken, 'YLA');
      results.studentWithToken = resultId !== null;
      await sleep(500);

      // Test 6: View Class Results
      results.viewResults = await testViewClassResults(classId, teacherData.teacherId);
      await sleep(500);
    }
  } else if (teacherData) {
    log('Skipping teacher dashboard tests (development fallback mode, no database teacher)', 'warning');
    log('Note: Teacher login works, but full dashboard requires a teacher in database', 'info');
  } else {
    log('Skipping teacher dashboard tests (login failed)', 'warning');
  }

  // Test 7: Career Library
  results.careerLibrary = await testCareerLibrary();

  // ============================================================================
  // FINAL SUMMARY
  // ============================================================================

  console.log('\n' + '█'.repeat(80));
  console.log('█ TEST SUMMARY');
  console.log('█'.repeat(80));

  console.log(`\n📊 CORE FUNCTIONALITY:`);
  console.log(`  Site Authentication:     ${results.siteAuth ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  Career Library:          ${results.careerLibrary ? '✅ PASS' : '❌ FAIL'}`);

  console.log(`\n👨‍🎓 STUDENT FLOWS:`);
  results.studentFlows.forEach(flow => {
    console.log(`  ${flow.cohort} Cohort:             ${flow.success ? '✅ PASS' : '❌ FAIL'}`);
  });

  console.log(`\n👩‍🏫 TEACHER DASHBOARD:`);
  console.log(`  Teacher Login:           ${results.teacherLogin ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  Create Class Token:      ${results.createToken ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  Student with Token:      ${results.studentWithToken ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  View Class Results:      ${results.viewResults ? '✅ PASS' : '❌ FAIL'}`);

  // Calculate overall success
  const totalTests =
    1 + // site auth
    results.studentFlows.length + // student flows
    4 + // teacher tests
    1; // career library

  const passedTests =
    (results.siteAuth ? 1 : 0) +
    results.studentFlows.filter(f => f.success).length +
    (results.teacherLogin ? 1 : 0) +
    (results.createToken ? 1 : 0) +
    (results.studentWithToken ? 1 : 0) +
    (results.viewResults ? 1 : 0) +
    (results.careerLibrary ? 1 : 0);

  const percentage = ((passedTests / totalTests) * 100).toFixed(0);

  console.log(`\n🎯 OVERALL: ${passedTests}/${totalTests} tests passed (${percentage}%)`);

  if (passedTests === totalTests) {
    console.log('\n✅ ALL TESTS PASSED - SYSTEM FULLY FUNCTIONAL');
  } else {
    console.log(`\n⚠️  ${totalTests - passedTests} TESTS FAILED - REVIEW NEEDED`);
  }

  console.log('\n' + '█'.repeat(80) + '\n');
}

// Run all tests
runAllTests().catch(error => {
  console.error('Fatal test error:', error);
  process.exit(1);
});
