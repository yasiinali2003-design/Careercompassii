/**
 * Create Test Teacher Programmatically
 * Runs directly using your Supabase credentials
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Read environment variables from .env.local
function getEnvVar(key) {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const match = envContent.match(new RegExp(`${key}=(.+)`));
    return match ? match[1].trim() : null;
  } catch (error) {
    console.error(`Error reading .env.local: ${error.message}`);
    return null;
  }
}

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseServiceKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!');
  console.error('   Make sure .env.local has:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTestTeacher() {
  console.log('🔧 Creating test teacher...\n');

  // Generate a simple test code
  const testCode = 'QUICK123';
  
  // First, delete any existing teacher with this code
  try {
    await supabase
      .from('teachers')
      .delete()
      .eq('access_code', testCode);
    console.log('✅ Cleaned up any existing test teacher');
  } catch (error) {
    // Ignore if delete fails
  }

  // Try to create teacher with RPC function first
  let codeData = null;
  try {
    const result = await supabase.rpc('generate_teacher_code');
    if (result.data && !result.error) {
      codeData = result.data;
      console.log('✅ RPC function works!');
    }
  } catch (error) {
    console.log('⚠️  RPC function not available, using fallback');
  }

  const accessCode = codeData || testCode;

  // Insert teacher
  const { data, error } = await supabase
    .from('teachers')
    .insert({
      name: 'Quick Test Teacher',
      email: 'quick@test.com',
      school_name: 'Quick Test School',
      access_code: accessCode,
      is_active: true,
      created_by: 'automated-script'
    })
    .select('id, name, access_code, is_active')
    .single();

  if (error) {
    console.error('❌ Error creating teacher:', error.message);
    console.error('   Code:', error.code);
    console.error('   Details:', error.details);
    console.error('   Hint:', error.hint);
    console.error('\n💡 This might be an RLS policy issue.');
    console.error('   Try running QUICK_FIX_LOGIN.sql in Supabase SQL Editor instead.');
    process.exit(1);
  }

  console.log('✅ Test teacher created successfully!\n');
  console.log('📋 Login Details:');
  console.log('   Access Code:', data.access_code);
  console.log('   Name:', data.name);
  console.log('   Active:', data.is_active);
  console.log('\n🚀 Next Steps:');
  console.log('   1. Go to: http://localhost:3000/teacher/login');
  console.log(`   2. Enter code: ${data.access_code}`);
  console.log('   3. Click "Kirjaudu sisään"');
  console.log('\n✅ Should work now!');
}

createTestTeacher()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  });


