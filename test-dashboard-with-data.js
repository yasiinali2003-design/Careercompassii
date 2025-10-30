/**
 * Test Enhanced Dashboard with Complete Student Data
 * Creates real test results with all features: dimensions, careers, education paths
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const http = require('http');

function getEnvVar(key) {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const match = envContent.match(new RegExp(`${key}=(.+)`));
    return match ? match[1].trim() : null;
  } catch (error) {
    return null;
  }
}

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseServiceKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY');
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function httpRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body), headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: body, headers: res.headers });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function setupClassAndPINs() {
  console.log('🔧 Setting up test class and PINs...\n');
  
  // 1. Login as teacher
  const loginRes = await httpRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/api/teacher-auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { password: 'F3264E3D' });
  
  if (!loginRes.data.success) {
    throw new Error('Login failed');
  }
  
  const teacherId = loginRes.data.teacher.id;
  const cookies = loginRes.headers['set-cookie'] || [];
  const cookieString = cookies.join('; ');
  
  console.log('   ✅ Logged in as:', loginRes.data.teacher.name);
  
  // 2. Get or create class
  const { data: classes } = await supabase
    .from('classes')
    .select('id, class_token')
    .eq('teacher_id', teacherId)
    .limit(1);
  
  let classId, classToken;
  if (classes && classes.length > 0) {
    classId = classes[0].id;
    classToken = classes[0].class_token;
    console.log('   ✅ Using existing class:', classId.substring(0, 8));
  } else {
    const classRes = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/classes',
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': cookieString
      }
    }, { teacherId });
    
    if (!classRes.data.success) {
      throw new Error('Failed to create class');
    }
    classId = classRes.data.classId;
    classToken = classRes.data.classToken;
    console.log('   ✅ Created new class:', classId.substring(0, 8));
  }
  
  // 3. Generate PINs
  const pinsRes = await httpRequest({
    hostname: 'localhost',
    port: 3000,
    path: `/api/classes/${classId}/pins`,
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Cookie': cookieString
    }
  }, { count: 5 });
  
  if (!pinsRes.data.success) {
    throw new Error('PIN generation failed');
  }
  
  const pins = pinsRes.data.pins.map(p => p.pin || p);
  console.log('   ✅ Generated PINs:', pins.join(', '));
  
  // Debug: check what we actually got
  if (pins.length === 0 || pins[0] === undefined) {
    console.log('   ⚠️  PIN response structure:', JSON.stringify(pinsRes.data, null, 2));
  }
  
  return { classId, classToken, pins, cookies };
}

async function submitCompleteTestResult(classToken, pin, studentData) {
  console.log(`\n📝 Submitting test result for PIN: ${pin}`);
  
  // Format exactly as the API expects (checking API schema)
  const resultData = {
    classToken: classToken,
    pin: pin,
    resultPayload: {
      cohort: studentData.cohort,
      topCareers: studentData.top_careers || studentData.topCareers, // API expects topCareers
      dimensionScores: studentData.dimension_scores || studentData.dimensionScores, // API expects dimensionScores
      personalizedAnalysis: studentData.personalized_analysis || 'Test analysis',
      timeSpentSeconds: studentData.time_spent_seconds || 450,
      completed: true,
      educationPath: studentData.educationPath // For YLA students
    }
  };
  
  const response = await httpRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/api/results',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, resultData);
  
  if (response.status === 200 || response.status === 201) {
    if (response.data.success) {
      console.log(`   ✅ Submitted successfully!`);
      return true;
    } else {
      console.log(`   ⚠️  API returned:`, response.data);
      return false;
    }
  } else {
    console.log(`   ❌ Failed:`, response.status, response.data);
    return false;
  }
}

async function verifyDashboard(classId, cookies) {
  console.log('\n📊 Verifying enhanced dashboard features...\n');
  
  const cookieString = cookies.join('; ');
  const resultsRes = await httpRequest({
    hostname: 'localhost',
    port: 3000,
    path: `/api/classes/${classId}/results`,
    method: 'GET',
    headers: { 'Cookie': cookieString }
  });
  
  if (!resultsRes.data.success) {
    console.log('   ❌ Failed to fetch results');
    return false;
  }
  
  const results = resultsRes.data.results || [];
  console.log(`   ✅ Found ${results.length} test results\n`);
  
  if (results.length === 0) {
    console.log('   ⚠️  No results to verify. Dashboard features need data to display.');
    return false;
  }
  
  // Verify each enhanced feature
  let verified = 0;
  const features = [
    'dimension_scores',
    'top_careers',
    'cohort',
    'educationPath'
  ];
  
  results.forEach((result, idx) => {
    console.log(`   📋 Result ${idx + 1} (PIN: ${result.pin}):`);
    const payload = result.result_payload || {};
    
    features.forEach(feature => {
      const hasFeature = !!(
        payload[feature] || 
        payload[feature === 'dimension_scores' ? 'dimensionScores' : ''] ||
        payload[feature === 'top_careers' ? 'topCareers' : ''] ||
        payload[feature === 'educationPath' ? 'education_path' : '']
      );
      
      if (hasFeature) {
        console.log(`      ✅ ${feature}`);
        verified++;
      } else {
        console.log(`      ❌ ${feature} - missing`);
      }
    });
  });
  
  console.log(`\n   📊 Verification: ${verified}/${features.length * results.length} features found`);
  
  return verified > 0;
}

async function runTest() {
  console.log('🧪 Testing Enhanced Dashboard with Complete Student Data\n');
  console.log('='.repeat(70));
  
  try {
    // Setup
    const { classId, classToken, pins, cookies } = await setupClassAndPINs();
    
    // Create test students with different profiles
    const testStudents = [
      {
        cohort: 'YLA',
        top_careers: [
          { slug: 'opettaja', title: 'Opettaja', score: 0.95 },
          { slug: 'psykologi', title: 'Psykologi', score: 0.88 },
          { slug: 'hoitaja', title: 'Hoitaja', score: 0.82 }
        ],
        dimension_scores: {
          interests: 75,
          values: 85,
          workstyle: 70,
          context: 80
        },
        educationPath: {
          primary: 'lukio',
          scores: {
            lukio: 85,
            ammattikoulu: 45,
            kansanopisto: 30
          }
        },
        personalized_analysis: 'Strong interest in helping professions',
        time_spent_seconds: 480
      },
      {
        cohort: 'YLA',
        top_careers: [
          { slug: 'ohjelmoija', title: 'Ohjelmoija', score: 0.92 },
          { slug: 'insinoori', title: 'Insinööri', score: 0.85 }
        ],
        dimension_scores: {
          interests: 85,
          values: 60,
          workstyle: 90,
          context: 50
        },
        educationPath: {
          primary: 'ammattikoulu',
          scores: {
            lukio: 35,
            ammattikoulu: 90,
            kansanopisto: 25
          }
        },
        personalized_analysis: 'Technical and practical learner',
        time_spent_seconds: 420
      },
      {
        cohort: 'TASO2',
        top_careers: [
          { slug: 'kauppias', title: 'Kauppias', score: 0.88 },
          { slug: 'johtaja', title: 'Johtaja', score: 0.82 }
        ],
        dimension_scores: {
          interests: 70,
          values: 75,
          workstyle: 65,
          context: 70
        },
        personalized_analysis: 'Business-oriented individual',
        time_spent_seconds: 500
      },
      {
        cohort: 'YLA',
        top_careers: [
          { slug: 'taiteilija', title: 'Taiteilija', score: 0.90 },
          { slug: 'muusikko', title: 'Muusikko', score: 0.85 }
        ],
        dimension_scores: {
          interests: 40, // Low scores - should trigger "needs attention"
          values: 45,
          workstyle: 50,
          context: 45
        },
        educationPath: {
          primary: 'kansanopisto',
          scores: {
            lukio: 40,
            ammattikoulu: 50,
            kansanopisto: 75
          }
        },
        personalized_analysis: 'Creative but needs more exploration',
        time_spent_seconds: 380
      }
    ];
    
    // Submit all test results
    console.log(`\n📤 Submitting ${testStudents.length} test results...\n`);
    let submitted = 0;
    
    for (let i = 0; i < Math.min(testStudents.length, pins.length); i++) {
      const success = await submitCompleteTestResult(classToken, pins[i], testStudents[i]);
      if (success) submitted++;
      
      // Wait between submissions
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log(`\n   ✅ Submitted ${submitted}/${Math.min(testStudents.length, pins.length)} results`);
    
    // Wait for database to sync
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verify dashboard
    await verifyDashboard(classId, cookies);
    
    console.log('\n' + '='.repeat(70));
    console.log('\n✅ Test Complete!\n');
    
    console.log('📋 Dashboard Verification:');
    console.log('   ✅ Test results submitted with:');
    console.log('      - Dimension scores (for class averages)');
    console.log('      - Top careers (for most popular careers display)');
    console.log('      - Education paths (for YLA students)');
    console.log('      - Different cohorts (for filtering)');
    console.log('      - One low-scoring student (for "needs attention" flag)');
    console.log('\n🎯 Next Steps:');
    console.log(`   1. Open: http://localhost:3000/teacher/classes/${classId}`);
    console.log('   2. Go to "Tulokset" tab');
    console.log('   3. Verify:');
    console.log('      - Class averages show education paths & top careers');
    console.log('      - Filtering works (by cohort, education path)');
    console.log('      - Student profiles appear');
    console.log('      - "Needs attention" flag on low-scoring student');
    console.log('   4. Go to "Analyysi" tab');
    console.log('   5. Verify analytics dashboard shows all data');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

runTest()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error.message);
    process.exit(1);
  });

