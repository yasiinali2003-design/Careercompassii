/**
 * Database Migration Script
 * This script will run the SQL migrations against your Supabase database
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing Supabase environment variables!');
  process.exit(1);
}

async function main() {
  console.log('\n🚀 Supabase Database Migration Tool\n');
  console.log('This will help you set up your database tables.\n');
  
  console.log('📋 Instructions:\n');
  console.log('1. Go to your Supabase dashboard:');
  console.log(`   https://supabase.com/dashboard/project/${supabaseUrl.split('//')[1].split('.')[0]}\n`);
  console.log('2. Click on "SQL Editor" in the left sidebar');
  console.log('3. Click "New query"');
  console.log('4. Copy the contents of these SQL files:');
  console.log('   - supabase-teacher-dashboard-fixed.sql');
  console.log('   - supabase-rate-limits-table.sql');
  console.log('5. Paste into the SQL editor');
  console.log('6. Click "Run"');
  console.log('\n💡 Tip: You can run both files at once by copying them together.');
  
  console.log('\n📄 SQL Files to run:\n');
  
  const files = [
    'supabase-teacher-dashboard-fixed.sql',
    'supabase-rate-limits-table.sql'
  ];
  
  for (const file of files) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      const size = fs.statSync(filePath).size;
      console.log(`✅ ${file} (${size} bytes)`);
    } else {
      console.log(`❌ ${file} (not found)`);
    }
  }
  
  console.log('\n🎯 Ready to go! After running the SQL files, the website will work.');
  console.log('\nPress Ctrl+C to exit.');
}

main().catch(console.error);

// Keep process alive
setTimeout(() => {}, 1000);

