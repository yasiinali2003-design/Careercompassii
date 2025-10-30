/**
 * Test Student Test Submission and Teacher Results Viewing
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

async function setupTest() {
  console.log('🔧 Setting up test environment...\n');
  
  // 1. Get or create a test teacher
  const { data: teachers } = await supabase
    .from('teachers')
    .select('id, access_code')
    .eq('access_code', 'F3264E3D')
    .limit(1);
  
  if (!teachers || teachers.length === 0) {
    throw new Error('Test teacher not found');
  }
  
  const teacherId = teachers[0].id;
  console.log('✅ Teacher found:', teacherId);
  
  // 2. Create a class
  const classToken = 'TEST' + Date.now();
  const { data: classData, error: classError } = await supabase
    .from('classes')
    .insert({
      teacher_id: teacherId,
      class_token: classToken
    })
    .select('id, class_token')
    .single();
  
  if (classError) throw new Error('Class creation failed: ' + classError.message);
  
  console.log('✅ Class created:', classData.id);
  console.log('   Class Token:', classData.class_token);
  
  // 3. Generate a PIN (4-6 characters as per API validation)
  const randomPart = Math.random().toString(36).substring(2, 4).toUpperCase();
  const testPIN = 'TT' + randomPart; // Makes it 4 characters total
  const { data: pinData, error: pinError } = await supabase
    .from('pins')
    .insert({
      class_id: classData.id,
      pin: testPIN
    })
    .select('pin')
    .single();
  
  if (pinError) throw new Error('PIN creation failed: ' + pinError.message);
  
  console.log('✅ PIN created:', testPIN);
  
  return {
    classId: classData.id,
    classToken: classData.class_token,
    pin: testPIN,
    teacherId: teacherId
  };
}

async function submitTestResult(classToken, pin) {
  console.log('\n📝 Submitting test result...');
  console.log('   Class Token:', classToken);
  console.log('   PIN:', pin);
  
  const testResult = {
    pin: pin,
    classToken: classToken,
    resultPayload: {
      cohort: 'YLA',
      topCareers: [
        { slug: 'opettaja', title: 'Opettaja', score: 0.95 },
        { slug: 'psykologi', title: 'Psykologi', score: 0.88 },
        { slug: 'sosiaalityontekija', title: 'Sosiaalityöntekijä', score: 0.82 }
      ],
      dimensionScores: {
        interests: 75,
        values: 80,
        workstyle: 70,
        context: 85
      },
      personalizedAnalysis: 'Test analysis text',
      timeSpentSeconds: 450
    }
  };
  
  const response = await httpRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/api/results',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, testResult);
  
  if (response.status === 200 && response.data.success) {
    console.log('   ✅ Test result submitted successfully!');
    return true;
  } else {
    console.log('   ❌ Submission failed');
    console.log('   Status:', response.status);
    console.log('   Response:', JSON.stringify(response.data, null, 2));
    return false;
  }
}

async function viewResults(classId, teacherId) {
  console.log('\n📊 Viewing results as teacher...');
  
  // Login first to get cookies
  const loginResponse = await httpRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/api/teacher-auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { password: 'F3264E3D' });
  
  const cookies = loginResponse.headers['set-cookie'] || [];
  const cookieString = cookies.join('; ');
  
  const response = await httpRequest({
    hostname: 'localhost',
    port: 3000,
    path: `/api/classes/${classId}/results`,
    method: 'GET',
    headers: { 'Cookie': cookieString }
  });
  
  if (response.status === 200 && response.data.success) {
    const results = response.data.results || [];
    console.log('   ✅ Results retrieved!');
    console.log('   Number of results:', results.length);
    
    if (results.length > 0) {
      console.log('\n   📋 Results:');
      results.forEach((result, index) => {
        console.log(`   ${index + 1}. PIN: ${result.pin}`);
        if (result.result_payload) {
          const payload = typeof result.result_payload === 'string' 
            ? JSON.parse(result.result_payload) 
            : result.result_payload;
          console.log(`      Top Career: ${payload.topCareers?.[0]?.title || 'N/A'}`);
          console.log(`      Cohort: ${payload.cohort || 'N/A'}`);
          console.log(`      Completed: ${payload.timeSpentSeconds ? 'Yes' : 'No'}`);
        }
        console.log(`      Submitted: ${result.created_at}`);
      });
      return true;
    } else {
      console.log('   ⚠️  No results found yet');
      return false;
    }
  } else {
    console.log('   ❌ Failed to retrieve results');
    console.log('   Status:', response.status);
    console.log('   Response:', JSON.stringify(response.data, null, 2));
    return false;
  }
}

async function runTest() {
  console.log('🧪 Testing Complete Flow: Submit Test → View Results\n');
  console.log('='.repeat(60));
  
  try {
    // Setup
    const { classId, classToken, pin, teacherId } = await setupTest();
    
    // Submit test
    const submitted = await submitTestResult(classToken, pin);
    
    if (!submitted) {
      console.log('\n⚠️  Test submission failed - cannot test results viewing');
      return;
    }
    
    // Wait a moment for database
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // View results
    const hasResults = await viewResults(classId, teacherId);
    
    console.log('\n' + '='.repeat(60));
    console.log('\n✅ Test Complete!\n');
    
    if (hasResults) {
      console.log('🎉 SUCCESS! Teacher dashboard results are working!');
      console.log('\n📋 Summary:');
      console.log('   ✅ Test result submitted');
      console.log('   ✅ Results visible in teacher dashboard');
      console.log('   ✅ Full flow working end-to-end');
    } else {
      console.log('⚠️  Test submission worked, but results not visible');
      console.log('   This might be a timing issue or API issue');
    }
    
    console.log('\n🔗 URLs for manual testing:');
    console.log(`   Class Management: http://localhost:3000/teacher/classes/${classId}`);
    console.log(`   Take Test: http://localhost:3000/test`);
    console.log(`   Test PIN: ${pin}`);
    
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

