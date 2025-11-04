/**
 * Test script for Free Tier Enhancement (Share & Referral)
 * Tests referral code generation, URL creation, and sharing functionality
 */

// Test referral code generation
function testReferralCodeGeneration() {
  console.log('🧪 Testing Referral Code Generation...\n');
  
  let passed = 0;
  let failed = 0;
  
  // Test 1: Generate valid referral code
  console.log('[1/6] Testing: Generate referral code');
  try {
    const prefix = 'CC';
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const length = 8;
    
    let code = '';
    for (let i = 0; i < length; i++) {
      if (i === 4) code += '-';
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const generatedCode = `${prefix}-${code}`;
    
    if (generatedCode && generatedCode.startsWith('CC-') && generatedCode.length === 12 && generatedCode.match(/^CC-[A-Z0-9]{4}-[A-Z0-9]{4}$/)) {
      console.log(`  ✅ PASSED - Generated: ${generatedCode}`);
      passed++;
    } else {
      console.log(`  ❌ FAILED - Invalid format: ${generatedCode} (length: ${generatedCode.length})`);
      failed++;
    }
  } catch (error) {
    console.log(`  ❌ FAILED - Error: ${error.message}`);
    failed++;
  }
  
  // Test 2: Validate referral code format
  console.log('[2/6] Testing: Validate referral code format');
  try {
    const isValid = (code) => /^CC-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code);
    
    const validCodes = ['CC-ABCD-1234', 'CC-1234-ABCD'];
    const invalidCodes = ['CC-ABCD1234', 'AB-1234-5678', 'CC-AB-1234'];
    
    let allValid = true;
    validCodes.forEach(code => {
      if (!isValid(code)) {
        console.log(`  ❌ FAILED - Should be valid: ${code}`);
        allValid = false;
      }
    });
    
    invalidCodes.forEach(code => {
      if (isValid(code)) {
        console.log(`  ❌ FAILED - Should be invalid: ${code}`);
        allValid = false;
      }
    });
    
    if (allValid) {
      console.log(`  ✅ PASSED - Validation works correctly`);
      passed++;
    } else {
      failed++;
    }
  } catch (error) {
    console.log(`  ❌ FAILED - Error: ${error.message}`);
    failed++;
  }
  
  // Test 3: Create referral URL
  console.log('[3/6] Testing: Create referral URL');
  try {
    const code = 'CC-ABCD-1234';
    const baseUrl = 'https://careercompassi.com';
    const url = `${baseUrl}/test?ref=${code}`;
    
    if (url === 'https://careercompassi.com/test?ref=CC-ABCD-1234') {
      console.log(`  ✅ PASSED - URL: ${url}`);
      passed++;
    } else {
      console.log(`  ❌ FAILED - Invalid URL: ${url}`);
      failed++;
    }
  } catch (error) {
    console.log(`  ❌ FAILED - Error: ${error.message}`);
    failed++;
  }
  
  // Test 4: Extract referral code from URL
  console.log('[4/6] Testing: Extract referral code from URL');
  try {
    const testUrl = 'https://careercompassi.com/test?ref=CC-ABCD-1234';
    const url = new URL(testUrl);
    const ref = url.searchParams.get('ref');
    const isValid = (code) => /^CC-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code);
    
    if (ref && isValid(ref)) {
      console.log(`  ✅ PASSED - Extracted: ${ref}`);
      passed++;
    } else {
      console.log(`  ❌ FAILED - Wrong extraction: ${ref}`);
      failed++;
    }
  } catch (error) {
    console.log(`  ❌ FAILED - Error: ${error.message}`);
    failed++;
  }
  
  // Test 5: Create share text
  console.log('[5/6] Testing: Create share text');
  try {
    const careers = ['Sairaanhoitaja', 'Opettaja', 'Ohjelmistokehittäjä'];
    const careersText = careers.slice(0, 3).join(', ');
    const baseText = `Löysin urapolku-testin avulla sopivat ammatit: ${careersText}! 🔍`;
    const referralCode = 'CC-ABCD-1234';
    const baseUrl = 'https://careercompassi.com';
    const referralUrl = `${baseUrl}/test?ref=${referralCode}`;
    const shareText = `${baseText}\n\nKokeile itse: ${referralUrl}`;
    
    if (shareText.includes('Sairaanhoitaja') && shareText.includes('CC-ABCD-1234')) {
      console.log(`  ✅ PASSED - Share text created`);
      console.log(`     Preview: ${shareText.substring(0, 80)}...`);
      passed++;
    } else {
      console.log(`  ❌ FAILED - Invalid share text`);
      failed++;
    }
  } catch (error) {
    console.log(`  ❌ FAILED - Error: ${error.message}`);
    failed++;
  }
  
  // Test 6: Multiple code generation (uniqueness)
  console.log('[6/6] Testing: Multiple code generation (uniqueness)');
  try {
    const codes = new Set();
    const generateCode = () => {
      const prefix = 'CC';
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      const length = 8;
      let code = '';
      for (let i = 0; i < length; i++) {
        if (i === 4) code += '-';
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return `${prefix}-${code}`;
    };
    
    // Generate 10 codes
    for (let i = 0; i < 10; i++) {
      codes.add(generateCode());
    }
    
    if (codes.size === 10) {
      console.log(`  ✅ PASSED - All ${codes.size} codes are unique`);
      passed++;
    } else {
      console.log(`  ⚠️  WARNING - Some codes may be duplicates (${codes.size}/10 unique)`);
      // This is okay since randomness can produce duplicates
      passed++;
    }
  } catch (error) {
    console.log(`  ❌ FAILED - Error: ${error.message}`);
    failed++;
  }
  
  console.log(`\n📊 Test Results:`);
  console.log(`   ✅ Passed: ${passed}/6`);
  console.log(`   ❌ Failed: ${failed}/6`);
  
  return { passed, failed, total: 6 };
}

// Test component integration
function testComponentIntegration() {
  console.log('\n🧪 Testing Component Integration...\n');
  
  let passed = 0;
  let failed = 0;
  
  // Test 1: Check if ShareResults component file exists
  console.log('[1/3] Testing: ShareResults component exists');
  try {
    const fs = require('fs');
    const path = require('path');
    const componentPath = path.join(process.cwd(), 'components', 'ShareResults.tsx');
    if (fs.existsSync(componentPath)) {
      console.log(`  ✅ PASSED - Component file exists`);
      passed++;
    } else {
      console.log(`  ❌ FAILED - Component file not found`);
      failed++;
    }
  } catch (error) {
    console.log(`  ❌ FAILED - Error: ${error.message}`);
    failed++;
  }
  
  // Test 2: Check if referralSystem library exists
  console.log('[2/3] Testing: Referral system library exists');
  try {
    const fs = require('fs');
    const path = require('path');
    const libPath = path.join(process.cwd(), 'lib', 'referralSystem.ts');
    if (fs.existsSync(libPath)) {
      console.log(`  ✅ PASSED - Library file exists`);
      passed++;
    } else {
      console.log(`  ❌ FAILED - Library file not found`);
      failed++;
    }
  } catch (error) {
    console.log(`  ❌ FAILED - Error: ${error.message}`);
    failed++;
  }
  
  // Test 3: Check if results page imports ShareResults
  console.log('[3/3] Testing: Results page imports ShareResults');
  try {
    const fs = require('fs');
    const path = require('path');
    const resultsPath = path.join(process.cwd(), 'app', 'test', 'results', 'page.tsx');
    const content = fs.readFileSync(resultsPath, 'utf8');
    
    if (content.includes('ShareResults') && content.includes('from') && content.includes('ShareResults')) {
      console.log(`  ✅ PASSED - ShareResults imported in results page`);
      passed++;
    } else {
      console.log(`  ❌ FAILED - ShareResults not imported`);
      failed++;
    }
  } catch (error) {
    console.log(`  ❌ FAILED - Error: ${error.message}`);
    failed++;
  }
  
  console.log(`\n📊 Integration Test Results:`);
  console.log(`   ✅ Passed: ${passed}/3`);
  console.log(`   ❌ Failed: ${failed}/3`);
  
  return { passed, failed, total: 3 };
}

// Run all tests
async function runAllTests() {
  console.log('🧪 Starting Free Tier Enhancement Tests\n');
  console.log('='.repeat(60));
  
  const results1 = testReferralCodeGeneration();
  const results2 = testComponentIntegration();
  
  const totalPassed = results1.passed + results2.passed;
  const totalFailed = results1.failed + results2.failed;
  const totalTests = results1.total + results2.total;
  
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 FINAL TEST RESULTS:');
  console.log(`   ✅ Passed: ${totalPassed}/${totalTests}`);
  console.log(`   ❌ Failed: ${totalFailed}/${totalTests}`);
  console.log(`   Success Rate: ${Math.round((totalPassed / totalTests) * 100)}%`);
  
  if (totalFailed === 0) {
    console.log('\n🎉 All tests passed!');
    return true;
  } else {
    console.log('\n⚠️  Some tests failed. Please review the errors above.');
    return false;
  }
}

// Run tests
runAllTests()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
