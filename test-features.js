/**
 * Comprehensive Test Suite for New Features
 * Tests PDF Reports, Notifications, and Conversation Starters
 */

import { generateStudentPDF, generateClassSummaryPDF } from './lib/pdfGenerator';
import { generateClassCompletionEmail, generateAtRiskStudentEmail, generateWeeklySummaryEmail } from './lib/emailNotifications';
import { checkClassCompletion, checkAtRiskStudent } from './lib/notificationTriggers';
import { generateConversationStarters, generateParentMeetingTalkingPoints } from './lib/conversationStarters';

// Test data
const mockStudentResult = {
  result_payload: {
    cohort: 'YLA',
    top_careers: [
      { title: 'Opettaja', score: 0.85 },
      { title: 'Psykologi', score: 0.78 },
      { title: 'Sosiaalityöntekijä', score: 0.72 }
    ],
    dimension_scores: {
      interests: 75,
      values: 82,
      workstyle: 65,
      context: 70
    },
    educationPath: {
      primary: 'lukio',
      scores: { lukio: 0.85, ammattikoulu: 0.60, kansanopisto: 0.45 }
    }
  },
  pin: 'ABCD',
  created_at: new Date().toISOString()
};

const mockAtRiskStudent = {
  result_payload: {
    cohort: 'YLA',
    top_careers: [],
    dimension_scores: {
      interests: 35,
      values: 40,
      workstyle: 45,
      context: 30
    }
  },
  pin: 'RISK',
  created_at: new Date().toISOString()
};

console.log('🧪 Starting Comprehensive Feature Tests...\n');

// Test 1: PDF Generation
console.log('📄 TEST 1: PDF Generation');
console.log('='.repeat(50));

async function testPDFGeneration() {
  try {
    console.log('Testing student PDF generation...');
    const studentPDFData = {
      name: 'Testi Oppilas',
      pin: 'TEST',
      date: new Date().toLocaleDateString('fi-FI'),
      className: 'TEST123',
      cohort: 'YLA',
      topCareers: [
        { title: 'Opettaja', score: 0.85 },
        { title: 'Psykologi', score: 0.78 }
      ],
      dimensions: {
        interests: 75,
        values: 82,
        workstyle: 65,
        context: 70
      },
      educationPath: {
        primary: 'lukio',
        score: 0.85
      },
      profile: 'Vahvat kiinnostuksen kohteet • Kiinnostunut: Opettaja, Psykologi'
    };

    const studentBlob = await generateStudentPDF(studentPDFData);
    console.log('✅ Student PDF generated successfully!');
    console.log(`   Size: ${studentBlob.size} bytes`);

    console.log('\nTesting class summary PDF generation...');
    const classSummaryData = {
      className: 'TEST123',
      date: new Date().toLocaleDateString('fi-FI'),
      totalTests: 25,
      topCareers: [
        { name: 'Opettaja', count: 8 },
        { name: 'Lääkäri', count: 5 }
      ],
      educationPathDistribution: {
        lukio: 15,
        ammattikoulu: 8,
        kansanopisto: 2
      },
      dimensionAverages: {
        interests: 68,
        values: 72,
        workstyle: 65,
        context: 70
      },
      cohortDistribution: {
        YLA: 25
      }
    };

    const summaryBlob = await generateClassSummaryPDF(classSummaryData);
    console.log('✅ Class summary PDF generated successfully!');
    console.log(`   Size: ${summaryBlob.size} bytes`);

    return { studentPDF: true, summaryPDF: true };
  } catch (error) {
    console.error('❌ PDF generation failed:', error);
    return { studentPDF: false, summaryPDF: false };
  }
}

// Test 2: Email Notifications
console.log('\n📧 TEST 2: Email Notifications');
console.log('='.repeat(50));

function testEmailNotifications() {
  try {
    console.log('Testing class completion email...');
    const completionEmail = generateClassCompletionEmail({
      teacherEmail: 'test@example.com',
      className: 'TEST123',
      totalStudents: 25,
      completedStudents: 25,
      completionRate: 100,
      classId: 'test-class-id'
    });
    console.log('✅ Class completion email generated!');
    console.log(`   Subject: ${completionEmail.subject}`);
    console.log(`   HTML length: ${completionEmail.html.length} chars`);

    console.log('\nTesting at-risk student email...');
    const atRiskEmail = generateAtRiskStudentEmail({
      teacherEmail: 'test@example.com',
      className: 'TEST123',
      studentName: 'Testi Oppilas',
      studentPIN: 'RISK',
      reasons: ['Keskiarvo alle 50%', 'Kiinnostukset erittäin alhaiset'],
      classId: 'test-class-id'
    });
    console.log('✅ At-risk student email generated!');
    console.log(`   Subject: ${atRiskEmail.subject}`);
    console.log(`   HTML length: ${atRiskEmail.html.length} chars`);

    console.log('\nTesting weekly summary email...');
    const weeklyEmail = generateWeeklySummaryEmail({
      teacherEmail: 'test@example.com',
      className: 'TEST123',
      weekStart: '2024-01-01',
      weekEnd: '2024-01-07',
      totalTests: 25,
      completedThisWeek: 5,
      atRiskStudents: 3,
      topCareers: [
        { name: 'Opettaja', count: 8 },
        { name: 'Lääkäri', count: 5 }
      ],
      classId: 'test-class-id'
    });
    console.log('✅ Weekly summary email generated!');
    console.log(`   Subject: ${weeklyEmail.subject}`);
    console.log(`   HTML length: ${weeklyEmail.html.length} chars`);

    return { completion: true, atRisk: true, weekly: true };
  } catch (error) {
    console.error('❌ Email notification generation failed:', error);
    return { completion: false, atRisk: false, weekly: false };
  }
}

// Test 3: Notification Triggers
console.log('\n🔔 TEST 3: Notification Triggers');
console.log('='.repeat(50));

function testNotificationTriggers() {
  try {
    console.log('Testing class completion check...');
    
    // Test 100% completion
    const completeCheck = checkClassCompletion(25, 25);
    console.log('✅ 100% completion check:');
    console.log(`   Should notify: ${completeCheck.shouldNotify}`);
    console.log(`   Completion rate: ${completeCheck.data?.completionRate}%`);

    // Test 75% completion
    const partialCheck = checkClassCompletion(25, 19);
    console.log('\n✅ 75% completion check:');
    console.log(`   Should notify: ${partialCheck.shouldNotify}`);
    console.log(`   Completion rate: ${partialCheck.data?.completionRate}%`);

    // Test 50% completion
    const lowCheck = checkClassCompletion(25, 12);
    console.log('\n✅ 50% completion check:');
    console.log(`   Should notify: ${lowCheck.shouldNotify}`);
    console.log(`   Completion rate: ${lowCheck.data?.completionRate}%`);

    console.log('\nTesting at-risk student detection...');
    const atRiskCheck = checkAtRiskStudent(mockAtRiskStudent);
    console.log('✅ At-risk student check:');
    console.log(`   Should notify: ${atRiskCheck.shouldNotify}`);
    console.log(`   Reasons: ${atRiskCheck.data?.reasons.length || 0}`);

    const normalCheck = checkAtRiskStudent(mockStudentResult);
    console.log('\n✅ Normal student check:');
    console.log(`   Should notify: ${normalCheck.shouldNotify}`);

    return { completion: true, atRisk: true };
  } catch (error) {
    console.error('❌ Notification trigger test failed:', error);
    return { completion: false, atRisk: false };
  }
}

// Test 4: Conversation Starters
console.log('\n💬 TEST 4: Conversation Starters');
console.log('='.repeat(50));

function testConversationStarters() {
  try {
    console.log('Testing conversation starters for normal student...');
    const starters = generateConversationStarters({
      name: 'Testi Oppilas',
      topCareers: [
        { title: 'Opettaja', score: 0.85 },
        { title: 'Psykologi', score: 0.78 }
      ],
      dimensions: {
        interests: 75,
        values: 82,
        workstyle: 65,
        context: 70
      },
      educationPath: {
        primary: 'lukio',
        score: 0.85
      },
      cohort: 'YLA',
      profile: 'Vahvat kiinnostuksen kohteet'
    });

    console.log('✅ Conversation starters generated!');
    console.log(`   Category: ${starters.category}`);
    console.log(`   Questions: ${starters.questions.length}`);
    console.log(`   Talking points: ${starters.talkingPoints.length}`);
    console.log(`   Action items: ${starters.actionItems.length}`);
    console.log(`   Sample question: "${starters.questions[0]}"`);

    console.log('\nTesting conversation starters for at-risk student...');
    const atRiskStarters = generateConversationStarters({
      name: 'At-Risk Oppilas',
      topCareers: [],
      dimensions: {
        interests: 35,
        values: 40,
        workstyle: 45,
        context: 30
      },
      cohort: 'YLA'
    });

    console.log('✅ At-risk conversation starters generated!');
    console.log(`   Questions: ${atRiskStarters.questions.length}`);
    console.log(`   Talking points: ${atRiskStarters.talkingPoints.length}`);
    console.log(`   Action items: ${atRiskStarters.actionItems.length}`);

    console.log('\nTesting parent meeting talking points...');
    const parentPoints = generateParentMeetingTalkingPoints({
      name: 'Testi Oppilas',
      topCareers: [
        { title: 'Opettaja', score: 0.85 }
      ],
      dimensions: {
        interests: 75,
        values: 82,
        workstyle: 65,
        context: 70
      },
      educationPath: {
        primary: 'lukio',
        score: 0.85
      },
      cohort: 'YLA'
    });

    console.log('✅ Parent meeting talking points generated!');
    console.log(`   Points: ${parentPoints.length}`);
    console.log(`   Sample point: "${parentPoints[0]}"`);

    return { starters: true, atRisk: true, parent: true };
  } catch (error) {
    console.error('❌ Conversation starters test failed:', error);
    return { starters: false, atRisk: false, parent: false };
  }
}

// Run all tests
async function runAllTests() {
  const results = {
    pdf: await testPDFGeneration(),
    email: testEmailNotifications(),
    triggers: testNotificationTriggers(),
    conversation: testConversationStarters()
  };

  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(50));

  const allPassed = 
    results.pdf.studentPDF && results.pdf.summaryPDF &&
    results.email.completion && results.email.atRisk && results.email.weekly &&
    results.triggers.completion && results.triggers.atRisk &&
    results.conversation.starters && results.conversation.atRisk && results.conversation.parent;

  console.log(`PDF Generation: ${results.pdf.studentPDF && results.pdf.summaryPDF ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Email Notifications: ${results.email.completion && results.email.atRisk && results.email.weekly ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Notification Triggers: ${results.triggers.completion && results.triggers.atRisk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Conversation Starters: ${results.conversation.starters && results.conversation.atRisk && results.conversation.parent ? '✅ PASS' : '❌ FAIL'}`);

  console.log('\n' + '='.repeat(50));
  if (allPassed) {
    console.log('✅ ALL TESTS PASSED!');
  } else {
    console.log('⚠️  SOME TESTS FAILED - Check output above');
  }
  console.log('='.repeat(50));

  return allPassed;
}

// Run tests multiple times
async function runMultipleTests(iterations = 3) {
  console.log(`\n🔄 Running tests ${iterations} times...\n`);
  
  for (let i = 1; i <= iterations; i++) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`RUN ${i} OF ${iterations}`);
    console.log('='.repeat(60));
    
    const passed = await runAllTests();
    
    if (!passed) {
      console.error(`\n❌ Run ${i} failed!`);
      process.exit(1);
    }
    
    // Small delay between runs
    if (i < iterations) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log(`\n✅ All ${iterations} test runs passed successfully!`);
}

// Execute
runMultipleTests(3).catch(console.error);

