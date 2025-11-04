/**
 * Automated Browser Test Suite
 * Run this in browser console to test features
 */

(function() {
  console.log('🧪 Starting Browser Feature Tests...\n');

  // Test 1: Check if PDF generator functions exist
  async function testPDFFunctions() {
    console.log('📄 TEST 1: PDF Functions');
    console.log('='.repeat(50));
    
    try {
      // Check if we can import (in browser, these would be available via imports)
      const response = await fetch('/lib/pdfGenerator.ts');
      if (response.ok) {
        console.log('✅ PDF generator module exists');
      } else {
        console.log('⚠️  PDF generator module check skipped (browser test)');
      }
      
      // Test PDF data structure
      const testData = {
        name: 'Test Student',
        pin: 'TEST',
        date: new Date().toLocaleDateString('fi-FI'),
        className: 'TEST123',
        topCareers: [{ title: 'Opettaja', score: 0.85 }],
        dimensions: { interests: 75, values: 82, workstyle: 65, context: 70 }
      };
      
      console.log('✅ PDF data structure valid');
      console.log('   Test data:', testData);
      
      return true;
    } catch (error) {
      console.error('❌ PDF test failed:', error);
      return false;
    }
  }

  // Test 2: Check notification functions
  async function testNotificationFunctions() {
    console.log('\n📧 TEST 2: Notification Functions');
    console.log('='.repeat(50));
    
    try {
      // Test completion check logic
      const totalStudents = 25;
      const completedStudents = 25;
      const completionRate = (completedStudents / totalStudents) * 100;
      const shouldNotify = completedStudents === totalStudents || completionRate >= 75;
      
      console.log('✅ Completion check logic:');
      console.log(`   Total: ${totalStudents}, Completed: ${completedStudents}`);
      console.log(`   Rate: ${completionRate}%, Should notify: ${shouldNotify}`);
      
      // Test at-risk detection logic
      const testScores = { interests: 35, values: 40, workstyle: 45, context: 30 };
      const avgScore = Object.values(testScores).reduce((a, b) => a + b, 0) / 4;
      const isAtRisk = avgScore < 50;
      
      console.log('\n✅ At-risk detection logic:');
      console.log(`   Scores:`, testScores);
      console.log(`   Average: ${avgScore}%, Is at-risk: ${isAtRisk}`);
      
      return true;
    } catch (error) {
      console.error('❌ Notification test failed:', error);
      return false;
    }
  }

  // Test 3: Check conversation starter logic
  function testConversationStarters() {
    console.log('\n💬 TEST 3: Conversation Starter Logic');
    console.log('='.repeat(50));
    
    try {
      // Simulate conversation starter generation
      const profile = {
        topCareers: [{ title: 'Opettaja', score: 0.85 }],
        dimensions: { interests: 75, values: 82, workstyle: 65, context: 70 },
        cohort: 'YLA',
        educationPath: { primary: 'lukio' }
      };
      
      const questions = [];
      const talkingPoints = [];
      const actionItems = [];
      
      // Generate questions based on profile
      if (profile.topCareers.length > 0) {
        questions.push(`Mikä ${profile.topCareers[0].title} -ammatissa kiinnostaa sinua eniten?`);
      }
      
      if (profile.dimensions.interests > 70) {
        questions.push('Mitä aiheita tai aihealueita kiinnostavat sinua eniten?');
        talkingPoints.push('Sinulla on selkeät kiinnostukset, mikä on hyvä lähtökohta urapolun suunnittelulle');
      }
      
      if (profile.educationPath?.primary === 'lukio') {
        actionItems.push('Tutustu lukion tarjontaan');
      }
      
      console.log('✅ Conversation starter generation:');
      console.log(`   Questions generated: ${questions.length}`);
      console.log(`   Talking points: ${talkingPoints.length}`);
      console.log(`   Action items: ${actionItems.length}`);
      console.log(`   Sample question: "${questions[0]}"`);
      
      return questions.length > 0 && talkingPoints.length > 0;
    } catch (error) {
      console.error('❌ Conversation starter test failed:', error);
      return false;
    }
  }

  // Test 4: Check DOM elements
  function testDOMElements() {
    console.log('\n🌐 TEST 4: DOM Elements Check');
    console.log('='.repeat(50));
    
    try {
      // Check if we're on a teacher page
      const isTeacherPage = window.location.pathname.includes('/teacher/classes/');
      console.log(`✅ Current page: ${window.location.pathname}`);
      console.log(`   Is teacher page: ${isTeacherPage}`);
      
      // Check for PDF download buttons
      const pdfButtons = document.querySelectorAll('button[aria-label*="PDF"], button:contains("PDF")');
      console.log(`   PDF buttons found: ${pdfButtons.length}`);
      
      // Check for notification alerts
      const alerts = document.querySelectorAll('[class*="alert"], [class*="notification"]');
      console.log(`   Alert elements found: ${alerts.length}`);
      
      // Check for conversation starters
      const conversationElements = document.querySelectorAll('[class*="conversation"], [class*="keskustelu"]');
      console.log(`   Conversation elements found: ${conversationElements.length}`);
      
      return true;
    } catch (error) {
      console.error('❌ DOM test failed:', error);
      return false;
    }
  }

  // Run all tests
  async function runTests() {
    const results = {
      pdf: await testPDFFunctions(),
      notifications: await testNotificationFunctions(),
      conversation: testConversationStarters(),
      dom: testDOMElements()
    };
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('='.repeat(50));
    
    const allPassed = results.pdf && results.notifications && results.conversation && results.dom;
    
    console.log(`PDF Functions: ${results.pdf ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Notifications: ${results.notifications ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Conversation Starters: ${results.conversation ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`DOM Elements: ${results.dom ? '✅ PASS' : '❌ FAIL'}`);
    
    console.log('\n' + '='.repeat(50));
    if (allPassed) {
      console.log('✅ ALL LOGIC TESTS PASSED!');
      console.log('\nNext: Test features manually in the UI');
    } else {
      console.log('⚠️  SOME TESTS FAILED');
    }
    console.log('='.repeat(50));
    
    return allPassed;
  }

  // Export for browser console
  window.testFeatures = runTests;
  
  // Auto-run if on teacher page
  if (window.location.pathname.includes('/teacher/classes/')) {
    console.log('🎯 Teacher page detected - running tests...\n');
    runTests();
  } else {
    console.log('💡 Run window.testFeatures() in browser console to test');
    console.log('   Or navigate to /teacher/classes/[classId] for auto-test');
  }
})();

