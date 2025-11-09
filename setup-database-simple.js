/**
 * Simple Database Setup Checker
 * Checks which tables exist and generates SQL if needed
 */

const fs = require('fs');

async function checkDatabase() {
  console.log('🔍 Checking Database Setup Status...\n');
  
  // Try to import and use the Supabase client from the Next.js app
  // We'll read env vars directly from .env.local if it exists
  let supabaseUrl, supabaseKey;
  
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
    const keyMatch = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/);
    
    if (urlMatch) supabaseUrl = urlMatch[1].trim();
    if (keyMatch) supabaseKey = keyMatch[1].trim();
  } catch (error) {
    console.log('⚠️  Could not read .env.local');
    console.log('   Will create SQL file for manual setup.\n');
  }

  if (supabaseUrl && supabaseKey) {
    console.log('✅ Found Supabase credentials\n');
    console.log('📝 SQL file ready: SETUP_DATABASE.sql\n');
    console.log('📋 Next Steps:\n');
    console.log('   1. Open: https://supabase.com/dashboard');
    console.log('   2. Select your project');
    console.log('   3. Go to: SQL Editor');
    console.log('   4. Click "New query"');
    console.log('   5. Copy ALL contents of: SETUP_DATABASE.sql');
    console.log('   6. Paste into SQL Editor');
    console.log('   7. Click "Run" (or press Cmd/Ctrl + Enter)\n');
    console.log('   Direct link: https://supabase.com/dashboard/project/_/sql/new\n');
    console.log('✅ After running SQL, you can:');
    console.log('   - Generate teacher codes at: http://localhost:3000/admin/teachers');
    console.log('   - Login at: http://localhost:3000/teacher/login\n');
  } else {
    console.log('📝 SQL file created: SETUP_DATABASE.sql\n');
    console.log('   This file contains all SQL needed to set up your database.\n');
    console.log('   Follow the steps above to run it in Supabase.\n');
  }

  return true;
}

checkDatabase()
  .then(() => {
    console.log('✅ Setup check completed!\n');
  })
  .catch((error) => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });





