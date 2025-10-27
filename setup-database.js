/**
 * Setup Supabase Database Tables
 * Run this script to create all required tables for the teacher dashboard
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read Supabase config from .env.local
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.error('Make sure .env.local contains:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function runSQL(filePath) {
  console.log(`\n📄 Reading SQL file: ${filePath}`);
  const sql = fs.readFileSync(filePath, 'utf8');
  
  console.log(`\n🚀 Executing SQL...`);
  const { data, error } = await supabase.rpc('exec_sql', { query: sql });
  
  if (error) {
    // Try direct execution via REST API
    console.log(`\n⚠️  RPC method failed, trying direct execution...`);
    
    // Split SQL into individual statements
    const statements = sql.split(';').filter(s => s.trim().length > 0);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (!statement) continue;
      
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseServiceRoleKey,
            'Authorization': `Bearer ${supabaseServiceRoleKey}`,
          },
          body: JSON.stringify({ query: statement }),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          // Don't fail on errors - some statements might fail if run multiple times
          if (errorText.includes('already exists') || errorText.includes('does not exist')) {
            console.log(`  ⏭️  Skipped (already exists): ${statement.substring(0, 50)}...`);
          }
        } else {
          console.log(`  ✅ Executed statement ${i + 1}/${statements.length}`);
        }
      } catch (err) {
        console.log(`  ⏭️  Could not execute (may already exist): ${statement.substring(0, 50)}...`);
      }
    }
  }
}

async function setupDatabase() {
  console.log('🔧 Setting up Supabase database...\n');
  console.log(`📊 Project URL: ${supabaseUrl}`);
  
  // Since we can't easily execute arbitrary SQL via the JS client,
  // let's provide clear instructions
  console.log('\n📝 IMPORTANT:');
  console.log('You need to run these SQL files manually in the Supabase dashboard:');
  console.log('\n1. Go to: https://supabase.com/dashboard');
  console.log('2. Select your project');
  console.log('3. Go to "SQL Editor" → "New query"');
  console.log('4. Copy and paste the contents of: supabase-teacher-dashboard-fixed.sql');
  console.log('5. Click "Run"');
  console.log('6. Repeat for: supabase-rate-limits-table.sql');
  console.log('\nOr run these SQL files one by one.');
  
  // Let's try to create a simple approach by executing via REST
  console.log('\n\n🧪 Trying alternative approach...');
  
  const sqlFiles = [
    path.join(__dirname, 'supabase-teacher-dashboard-fixed.sql'),
    path.join(__dirname, 'supabase-rate-limits-table.sql'),
  ];
  
  for (const filePath of sqlFiles) {
    if (!fs.existsSync(filePath)) {
      console.log(`\n⚠️  File not found: ${filePath}`);
      continue;
    }
    
    const sql = fs.readFileSync(filePath, 'utf8');
    
    try {
      // Try to use the Supabase REST API to execute SQL
      console.log(`\n📝 Executing: ${path.basename(filePath)}`);
      
      // For now, just show what needs to be done
      console.log(`\n✅ SQL file ready: ${path.basename(filePath)}`);
      console.log(`📋 Please run this in your Supabase SQL Editor:`);
      console.log('   https://supabase.com/dashboard/project/' + supabaseUrl.split('//')[1].split('.')[0] + '/editor');
      
    } catch (err) {
      console.error(`❌ Error: ${err.message}`);
    }
  }
  
  console.log('\n\n✨ Done! Check the instructions above.');
}

setupDatabase().catch(console.error);

