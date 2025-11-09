#!/usr/bin/env node

/**
 * Final migration attempt - uses Supabase client to create and execute migration function
 */

const fs = require('fs');
const path = require('path');

// Load env vars
function loadEnv() {
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  }
}

loadEnv();

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

async function runMigration() {
  console.log('🔄 Running package column migration...\n');

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  try {
    // First, check if column exists
    const { data, error } = await supabase
      .from('teachers')
      .select('package')
      .limit(1);

    if (!error && data !== null) {
      console.log('✅ Package column already exists!\n');
      
      const { data: teachers } = await supabase
        .from('teachers')
        .select('name, package')
        .limit(5);
      
      if (teachers && teachers.length > 0) {
        console.log('📊 Current package values:');
        teachers.forEach(t => {
          console.log(`   - ${t.name || 'Unnamed'}: ${t.package || 'standard'}`);
        });
      }
      
      console.log('\n✅ Migration already complete!');
      return;
    }

    // Column doesn't exist - need to run SQL
    console.log('📊 Package column does not exist\n');
    console.log('⚠️  Supabase JS client cannot execute ALTER TABLE directly.');
    console.log('📌 The migration must be run in Supabase SQL Editor.\n');
    
    console.log('─'.repeat(70));
    console.log('📋 Copy and paste this SQL into Supabase SQL Editor:');
    console.log('─'.repeat(70));
    console.log(`
-- Add package column to teachers table
ALTER TABLE teachers 
ADD COLUMN IF NOT EXISTS package TEXT DEFAULT 'standard' 
CHECK (package IN ('premium', 'standard'));

-- Set default for existing rows
UPDATE teachers SET package = 'standard' WHERE package IS NULL;

-- Verify the migration
SELECT name, package FROM teachers LIMIT 5;
    `);
    console.log('─'.repeat(70));
    
    console.log('\n🔗 Quick links:');
    console.log(`   Dashboard: ${supabaseUrl.replace('/rest/v1', '').replace('/auth/v1', '')}`);
    console.log('   Or: https://app.supabase.com → Your Project → SQL Editor\n');
    
    console.log('📋 Steps:');
    console.log('   1. Open Supabase Dashboard (link above)');
    console.log('   2. Click "SQL Editor" in the left sidebar');
    console.log('   3. Click "New query" button');
    console.log('   4. Paste the SQL above');
    console.log('   5. Click "Run" (or press Ctrl+Enter / Cmd+Enter)');
    console.log('   6. You should see "Success. No rows returned" or sample data\n');
    
    console.log('✅ After running, the migration will be complete!');
    console.log('   Package gating will be fully active.\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

runMigration();




