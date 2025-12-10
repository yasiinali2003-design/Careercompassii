/**
 * Database Connectivity Test Script
 * 
 * This script can be run with: npx tsx test-database-connectivity.ts
 * Or copy the code into an API route for testing
 */

import { supabaseAdmin } from './lib/supabase';

async function testDatabaseConnectivity() {
  console.log('🔍 Testing Database Connectivity\n');

  // Test 1: Check Supabase client exists
  if (!supabaseAdmin) {
    console.log('❌ Supabase admin client not initialized');
    console.log('   Check environment variables: SUPABASE_SERVICE_ROLE_KEY');
    return;
  }
  console.log('✅ Supabase admin client initialized\n');

  // Test 2: Check if tables exist
  const tables = ['teachers', 'classes', 'pins', 'results', 'rate_limits'];
  
  for (const table of tables) {
    try {
      // Try to query the table (just count, no data)
      const { count, error } = await supabaseAdmin
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        if (error.message?.includes('does not exist')) {
          console.log(`❌ Table '${table}' does NOT exist`);
          console.log(`   → Run SQL script to create it`);
        } else {
          console.log(`⚠️  Table '${table}' error: ${error.message}`);
        }
      } else {
        console.log(`✅ Table '${table}' exists (${count || 0} records)`);
      }
    } catch (err: any) {
      console.log(`❌ Error checking table '${table}': ${err.message}`);
    }
  }

  console.log('\n');

  // Test 3: Test RPC functions
  console.log('Testing RPC Functions:\n');
  
  try {
    // Test generate_teacher_code (if teachers table exists)
    const { data: codeData, error: codeError } = await supabaseAdmin
      .rpc('generate_teacher_code');
    
    if (codeError) {
      console.log(`⚠️  RPC 'generate_teacher_code': ${codeError.message}`);
    } else {
      console.log(`✅ RPC 'generate_teacher_code' works`);
    }
  } catch (err: any) {
    console.log(`❌ RPC 'generate_teacher_code' error: ${err.message}`);
  }

  // Test 4: Check if we can insert/query (test with mock data that will be cleaned)
  console.log('\nTesting Write Access:\n');
  
  try {
    // Try to create a test class (will be deleted)
    const testTeacherId = '00000000-0000-0000-0000-000000000000'; // Dummy UUID
    const { data: insertData, error: insertError } = await (supabaseAdmin as any)
      .from('classes')
      .insert({
        teacher_id: testTeacherId,
        class_token: 'TEST-' + Date.now()
      })
      .select()
      .single();

    if (insertError) {
      console.log(`⚠️  Cannot insert into 'classes': ${insertError.message}`);
    } else {
      console.log('✅ Can insert into classes table');
      
      // Clean up test data
      await supabaseAdmin
        .from('classes')
        .delete()
        .eq('id', insertData.id);
      console.log('   → Test record cleaned up');
    }
  } catch (err: any) {
    console.log(`❌ Insert test error: ${err.message}`);
  }

  console.log('\n✅ Database connectivity test completed!');
}

// Run if called directly
if (require.main === module) {
  testDatabaseConnectivity()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Fatal error:', err);
      process.exit(1);
    });
}

export { testDatabaseConnectivity };






