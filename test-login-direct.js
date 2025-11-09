/**
 * Test Login Directly with Supabase
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

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

async function testLoginFlow() {
  const code = 'F3264E3D';
  const normalizedCode = code.trim().toUpperCase();
  
  console.log('🧪 Testing exact login flow...\n');
  console.log('Code:', normalizedCode);
  console.log('');

  // Step 1: Test exact query from login API
  console.log('1. Testing database query (exact login API logic)...');
  const { data: teacher, error } = await supabase
    .from('teachers')
    .select('id, name, email, school_name, access_code, is_active')
    .eq('access_code', normalizedCode)
    .eq('is_active', true)
    .single();

  console.log('   Query result:');
  if (error) {
    console.log('   ❌ Error:', error.message);
    console.log('   Code:', error.code);
    console.log('   Details:', error.details);
    return;
  }

  if (!teacher) {
    console.log('   ❌ No teacher found');
    return;
  }

  console.log('   ✅ Teacher found:', teacher.name);
  console.log('   Access Code:', teacher.access_code);
  console.log('   Is Active:', teacher.is_active);
  console.log('');

  // Step 2: Test API endpoint
  console.log('2. Testing API endpoint via HTTP...');
  const fetch = require('node-fetch');
  
  try {
    const response = await fetch('http://localhost:3000/api/teacher-auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: normalizedCode })
    });
    
    const data = await response.json();
    console.log('   Status:', response.status);
    console.log('   Response:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('\n✅ Login should work!');
    } else {
      console.log('\n❌ Login failed via API');
      console.log('   Database query works, but API fails');
      console.log('   This suggests an issue with the API route logic');
    }
  } catch (error) {
    console.log('   ❌ API request failed:', error.message);
    console.log('   Server might not be running');
  }
}

testLoginFlow()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error.message);
    process.exit(1);
  });





