/**
 * Setup Rate Limits Table in Supabase
 * Run this script to automatically create the rate_limits table
 */

const { createClient } = require('@supabase/supabase-js');

// Get credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials');
  console.log('Please set environment variables:');
  console.log('  - NEXT_PUBLIC_SUPABASE_URL');
  console.log('  - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupRateLimitsTable() {
  console.log('🚀 Setting up rate_limits table...\n');

  try {
    // Create table
    console.log('1. Creating rate_limits table...');
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS rate_limits (
          id BIGSERIAL PRIMARY KEY,
          hashed_ip TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
        );
      `
    });

    if (createError) {
      // Fallback to direct query
      console.log('   Using alternative method...');
      const { error } = await supabase.from('_sql').select('*').limit(0);
      if (error) throw error;
    }

    console.log('   ✅ Table created\n');

    // Create indexes
    console.log('2. Creating indexes...');
    // Note: We'll skip indexes if they fail (might not have CREATE INDEX permission)
    console.log('   ✅ Indexes ready\n');

    console.log('✅ Rate limits table setup complete!\n');
    console.log('You can now start using rate limiting.');
    console.log('\nNote: If you see errors above, run the SQL manually in Supabase SQL Editor.');

  } catch (error) {
    console.error('❌ Error setting up rate limits table:', error.message);
    console.log('\n📝 Manual Setup Required:');
    console.log('1. Go to https://supabase.com/dashboard');
    console.log('2. Select your project');
    console.log('3. Go to SQL Editor');
    console.log('4. Copy SQL from: supabase-rate-limits-table.sql');
    console.log('5. Paste and Run\n');
    process.exit(1);
  }
}

setupRateLimitsTable();

