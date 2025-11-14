#!/usr/bin/env node

/**
 * Interactive menu for career enhancement
 */

const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function displayMenu() {
  console.clear();
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║     CareerCompassi - Career Enhancement Tool                  ║');
  console.log('║     Finland-Wide & Age-Neutral Enhancement                    ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('This tool enhances all 361 careers to be:');
  console.log('  1. Finland-wide (not just Helsinki)');
  console.log('  2. Age-neutral (not targeting only 20-25 year olds)');
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  OPTIONS:');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  1. Dry Run - See what would change (NO modifications)');
  console.log('  2. Test Functions - Test enhancement logic');
  console.log('  3. Run Enhancement - Apply all changes (creates backup)');
  console.log('  4. View Documentation - Open README');
  console.log('  5. Check if backup exists');
  console.log('  6. Restore from backup');
  console.log('  7. Exit');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
}

function runDryRun() {
  console.log('\n🔍 Running dry run analysis...\n');
  try {
    execSync('node enhance-all-careers-finland-dry-run.js', { stdio: 'inherit' });
  } catch (error) {
    console.error('Error running dry run:', error.message);
  }
  waitForUser();
}

function runTests() {
  console.log('\n🧪 Running function tests...\n');
  try {
    execSync('node test-enhancement.js', { stdio: 'inherit' });
  } catch (error) {
    console.error('Error running tests:', error.message);
  }
  waitForUser();
}

function runEnhancement() {
  console.log('\n⚠️  WARNING: This will modify careers-fi.ts');
  console.log('A backup will be created at data/careers-fi.backup.ts');
  console.log('');

  rl.question('Are you sure you want to continue? (yes/no): ', (answer) => {
    if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
      console.log('\n🚀 Running enhancement script...\n');
      try {
        execSync('node enhance-all-careers-finland.js', { stdio: 'inherit' });
        console.log('\n✅ Enhancement complete!');
        console.log('📄 Check enhancement-log.txt for details');
      } catch (error) {
        console.error('❌ Error running enhancement:', error.message);
      }
    } else {
      console.log('\n❌ Enhancement cancelled');
    }
    waitForUser();
  });
}

function viewDocs() {
  console.log('\n📚 Documentation files:');
  console.log('  - QUICK_START.md - Quick start guide');
  console.log('  - ENHANCEMENT_README.md - Full documentation');
  console.log('');
  console.log('Opening QUICK_START.md...');
  try {
    execSync('cat QUICK_START.md', { stdio: 'inherit' });
  } catch (error) {
    console.error('Error viewing docs:', error.message);
  }
  waitForUser();
}

function checkBackup() {
  console.log('\n🔍 Checking for backup...\n');
  const backupPath = '/Users/yasiinali/careercompassi/data/careers-fi.backup.ts';

  if (fs.existsSync(backupPath)) {
    const stats = fs.statSync(backupPath);
    console.log('✅ Backup exists!');
    console.log(`   Location: ${backupPath}`);
    console.log(`   Size: ${Math.round(stats.size / 1024)} KB`);
    console.log(`   Created: ${stats.mtime}`);
  } else {
    console.log('❌ No backup found');
    console.log(`   Expected location: ${backupPath}`);
  }
  waitForUser();
}

function restoreBackup() {
  const backupPath = '/Users/yasiinali/careercompassi/data/careers-fi.backup.ts';
  const targetPath = '/Users/yasiinali/careercompassi/data/careers-fi.ts';

  if (!fs.existsSync(backupPath)) {
    console.log('\n❌ No backup found to restore from');
    waitForUser();
    return;
  }

  console.log('\n⚠️  WARNING: This will restore careers-fi.ts from backup');
  console.log('All current changes will be lost!');
  console.log('');

  rl.question('Are you sure you want to restore? (yes/no): ', (answer) => {
    if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
      try {
        fs.copyFileSync(backupPath, targetPath);
        console.log('\n✅ Backup restored successfully!');
        console.log(`   From: ${backupPath}`);
        console.log(`   To: ${targetPath}`);
      } catch (error) {
        console.error('❌ Error restoring backup:', error.message);
      }
    } else {
      console.log('\n❌ Restore cancelled');
    }
    waitForUser();
  });
}

function waitForUser() {
  console.log('');
  rl.question('Press Enter to continue...', () => {
    showMenu();
  });
}

function showMenu() {
  displayMenu();

  rl.question('Select an option (1-7): ', (answer) => {
    switch (answer.trim()) {
      case '1':
        runDryRun();
        break;
      case '2':
        runTests();
        break;
      case '3':
        runEnhancement();
        break;
      case '4':
        viewDocs();
        break;
      case '5':
        checkBackup();
        break;
      case '6':
        restoreBackup();
        break;
      case '7':
        console.log('\n👋 Goodbye!\n');
        rl.close();
        process.exit(0);
        break;
      default:
        console.log('\n❌ Invalid option. Please select 1-7.');
        setTimeout(showMenu, 1000);
    }
  });
}

// Start the menu
showMenu();
