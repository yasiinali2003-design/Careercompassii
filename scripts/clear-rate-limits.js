#!/usr/bin/env node
/**
 * Clear rate limits from Supabase to allow testing
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase configuration');
  console.log('Make sure .env.local has NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function clearRateLimits() {
  console.log('Clearing all rate limits...');

  try {
    // Delete all rate limit records
    const { error } = await supabase
      .from('rate_limits')
      .delete()
      .gte('id', 0); // Delete all records

    if (error) {
      console.error('Error clearing rate limits:', error);
      process.exit(1);
    }

    console.log('Rate limits cleared successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

clearRateLimits();
