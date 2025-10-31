/**
 * Check if rate_limits table exists in Supabase
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

async function checkRateLimitsTable() {
  console.log('🔍 Checking if rate_limits table exists...\n');
  
  try {
    // Try to query the table
    const { data, error } = await supabase
      .from('rate_limits')
      .select('id')
      .limit(1);
    
    if (error) {
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        console.log('❌ Table does NOT exist');
        console.log('\n📋 Next Steps:');
        console.log('   1. Go to your Supabase dashboard');
        console.log('   2. Navigate to SQL Editor');
        console.log('   3. Copy the rate_limits table creation SQL from SETUP_DATABASE.sql (lines 210-237)');
        console.log('   4. Run the SQL to create the table');
        console.log('\n   Or run the entire SETUP_DATABASE.sql file if you haven\'t already.');
        return false;
      } else {
        throw error;
      }
    } else {
      console.log('✅ rate_limits table EXISTS!');
      console.log('   Table is ready for rate limiting functionality');
      return true;
    }
  } catch (error) {
    console.error('❌ Error checking table:', error.message);
    return false;
  }
}

checkRateLimitsTable()
  .then((exists) => {
    if (exists) {
      console.log('\n✅ Ready to test rate limiting!');
      process.exit(0);
    } else {
      console.log('\n⚠️  Need to create table first');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('Fatal error:', error.message);
    process.exit(1);
  });


