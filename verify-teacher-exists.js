/**
 * Verify Teacher Exists in Database
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

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyTeacher() {
  const testCode = 'F3264E3D';
  const normalizedCode = testCode.trim().toUpperCase();
  
  console.log('🔍 Verifying teacher in database...\n');
  console.log('Looking for code:', normalizedCode);
  console.log('');

  // Check if teacher exists
  const { data: teacher, error } = await supabase
    .from('teachers')
    .select('id, name, email, school_name, access_code, is_active, created_at')
    .eq('access_code', normalizedCode)
    .single();

  if (error) {
    console.error('❌ Error querying database:', error.message);
    console.error('   Code:', error.code);
    console.error('   Details:', error.details);
    
    // Try without .single() to see if there are multiple or none
    const { data: allTeachers, error: allError } = await supabase
      .from('teachers')
      .select('id, name, access_code, is_active')
      .eq('access_code', normalizedCode);
    
    if (allError) {
      console.error('\n❌ Cannot query teachers table at all:', allError.message);
      console.error('   This might be an RLS policy issue or table doesn\'t exist');
    } else {
      console.log('\n📊 Query without .single() found:', allTeachers?.length || 0, 'teachers');
      if (allTeachers && allTeachers.length > 0) {
        console.log('   Teachers found:', allTeachers);
      } else {
        console.log('   ⚠️  No teacher found with this code!');
      }
    }
    
    process.exit(1);
  }

  if (!teacher) {
    console.error('❌ Teacher not found in database!');
    console.log('\n📋 Let me check all teachers...\n');
    
    const { data: allTeachers } = await supabase
      .from('teachers')
      .select('id, name, access_code, is_active')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (allTeachers && allTeachers.length > 0) {
      console.log('Found', allTeachers.length, 'teachers in database:');
      allTeachers.forEach(t => {
        console.log(`   - ${t.access_code}: ${t.name} (active: ${t.is_active})`);
      });
    } else {
      console.log('   ⚠️  No teachers in database at all!');
    }
    
    process.exit(1);
  }

  console.log('✅ Teacher found in database!');
  console.log('');
  console.log('📋 Details:');
  console.log('   ID:', teacher.id);
  console.log('   Name:', teacher.name);
  console.log('   Access Code:', teacher.access_code);
  console.log('   Is Active:', teacher.is_active);
  console.log('   Created:', teacher.created_at);
  console.log('');

  if (!teacher.is_active) {
    console.error('❌ Teacher is INACTIVE!');
    console.log('\n   Updating to active...\n');
    
    const { error: updateError } = await supabase
      .from('teachers')
      .update({ is_active: true })
      .eq('id', teacher.id);
    
    if (updateError) {
      console.error('❌ Failed to activate:', updateError.message);
    } else {
      console.log('✅ Teacher activated! Try logging in again.');
    }
  } else {
    console.log('✅ Teacher is active');
    console.log('');
    console.log('🧪 Testing login query...\n');
    
    // Simulate the exact query from login API
    const { data: loginTeacher, error: loginError } = await supabase
      .from('teachers')
      .select('id, name, email, school_name, access_code, is_active')
      .eq('access_code', normalizedCode)
      .eq('is_active', true)
      .single();
    
    if (loginError) {
      console.error('❌ Login query failed:', loginError.message);
      console.error('   This is the exact error from login API');
    } else if (loginTeacher) {
      console.log('✅ Login query works! Teacher should be able to login.');
      console.log('');
      console.log('🔍 Possible issues:');
      console.log('   1. Code in browser might have extra spaces');
      console.log('   2. Browser cache - try hard refresh (Cmd+Shift+R)');
      console.log('   3. Case sensitivity - try: F3264E3D (all uppercase)');
      console.log('   4. Check browser console for errors');
    }
  }
}

verifyTeacher()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  });

