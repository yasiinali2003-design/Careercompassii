/**
 * Test Enhanced Teacher Dashboard Features
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

async function testEnhancedFeatures() {
  console.log('🧪 Testing Enhanced Teacher Dashboard Features\n');
  console.log('='.repeat(60));
  
  try {
    // 1. Login
    console.log('\n1. Logging in as teacher...');
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
    console.log('   ✅ Logged in');
    
    // 2. Get or create a class
    console.log('\n2. Finding or creating a class...');
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
      // Create class
      const cookieString = cookies.join('; ');
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
    
    // 3. Check results
    console.log('\n3. Checking results for enhanced features...');
    const cookieString = cookies.join('; ');
    const resultsRes = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: `/api/classes/${classId}/results`,
      method: 'GET',
      headers: { 'Cookie': cookieString }
    });
    
    if (resultsRes.data.success) {
      const results = resultsRes.data.results || [];
      console.log(`   ✅ Found ${results.length} results`);
      
      if (results.length > 0) {
        console.log('\n   📊 Sample result structure:');
        const sample = results[0];
        const payload = sample.result_payload || {};
        
        console.log('      - Has cohort:', !!payload.cohort);
        console.log('      - Has dimension_scores:', !!(payload.dimension_scores || payload.dimensionScores));
        console.log('      - Has top_careers:', !!(payload.top_careers || payload.topCareers));
        console.log('      - Has educationPath:', !!(payload.educationPath || payload.education_path));
        
        if (payload.dimension_scores || payload.dimensionScores) {
          const dims = payload.dimension_scores || payload.dimensionScores || {};
          console.log('\n      📈 Dimension scores found:');
          console.log('         Interests:', dims.interests || 'N/A');
          console.log('         Values:', dims.values || 'N/A');
          console.log('         Workstyle:', dims.workstyle || 'N/A');
          console.log('         Context:', dims.context || 'N/A');
        }
        
        if (payload.top_careers || payload.topCareers) {
          const careers = payload.top_careers || payload.topCareers;
          console.log('\n      💼 Top careers found:', careers.length);
          careers.slice(0, 3).forEach((c, i) => {
            console.log(`         ${i + 1}. ${c.title} (${Math.round((c.score || 0) * 100)}%)`);
          });
        }
        
        if (payload.cohort === 'YLA' && (payload.educationPath || payload.education_path)) {
          const edPath = payload.educationPath || payload.education_path;
          console.log('\n      🎓 Education path found:');
          console.log('         Primary:', edPath.primary || edPath.education_path_primary || 'N/A');
        }
      } else {
        console.log('   ⚠️  No results yet - create test results to see enhanced features');
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('\n✅ Enhanced Dashboard Test Complete!\n');
    
    console.log('📋 What to Test in Browser:');
    console.log('   1. Go to: http://localhost:3000/teacher/classes');
    console.log(`   2. Click on class: ${classId.substring(0, 8)}`);
    console.log('   3. Check "Tulokset" tab:');
    console.log('      - Should show filtering options');
    console.log('      - Should show class averages');
    console.log('      - Should show top 3 careers');
    console.log('      - Should show student profiles');
    console.log('   4. Check "Analyysi" tab:');
    console.log('      - Should show visual analytics');
    console.log('      - Should show class overview cards');
    console.log('      - Should show top careers chart');
    console.log('      - Should show dimension averages');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

testEnhancedFeatures()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error.message);
    process.exit(1);
  });

