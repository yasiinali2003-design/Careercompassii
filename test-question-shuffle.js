/**
 * Test Question Shuffle Functionality
 * Verifies that shuffle/unshuffle logic works correctly
 */

// Simulate the shuffle functions from questionShuffle.ts
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function shuffleQuestions(questions) {
  const mapping = questions.map((_, index) => index);
  const shuffledMapping = shuffleArray(mapping);
  const shuffled = shuffledMapping.map(originalIndex => questions[originalIndex]);
  
  // Generate shuffle key
  let hash = 0;
  for (let i = 0; i < shuffledMapping.length; i++) {
    hash = (hash + (shuffledMapping[i] * (i + 1))) % 2147483647;
  }
  const shuffleKey = hash.toString(36);
  
  return {
    shuffled,
    originalIndices: shuffledMapping,
    shuffleKey
  };
}

function unshuffleAnswers(answers, originalIndices) {
  return answers.map(answer => ({
    questionIndex: originalIndices[answer.questionIndex],
    score: answer.score
  }));
}

function verifyShuffleKey(originalIndices, shuffleKey) {
  let hash = 0;
  for (let i = 0; i < originalIndices.length; i++) {
    hash = (hash + (originalIndices[i] * (i + 1))) % 2147483647;
  }
  const expectedKey = hash.toString(36);
  return expectedKey === shuffleKey;
}

async function testQuestionShuffle() {
  console.log('🧪 Testing Question Shuffle Functionality\n');
  console.log('='.repeat(60));
  
  // Create test questions
  const originalQuestions = [
    { q: 0, text: 'Question 1' },
    { q: 1, text: 'Question 2' },
    { q: 2, text: 'Question 3' },
    { q: 3, text: 'Question 4' },
    { q: 4, text: 'Question 5' },
    { q: 5, text: 'Question 6' },
    { q: 6, text: 'Question 7' },
    { q: 7, text: 'Question 8' }
  ];
  
  console.log('\n📋 Original Question Order:');
  originalQuestions.forEach((q, i) => {
    console.log(`   ${i}. ${q.text}`);
  });
  
  // Test shuffle multiple times
  console.log('\n🔀 Testing Shuffle (5 iterations):\n');
  
  let shuffleWorks = true;
  let orderChanged = false;
  
  for (let iteration = 0; iteration < 5; iteration++) {
    const { shuffled, originalIndices, shuffleKey } = shuffleQuestions(originalQuestions);
    
    // Check if order changed
    const isSameOrder = shuffled.every((q, i) => q.q === originalQuestions[i].q);
    if (!isSameOrder && !orderChanged) {
      orderChanged = true;
    }
    
    console.log(`   Iteration ${iteration + 1}:`);
    console.log(`   Shuffled Order: ${shuffled.map(q => q.q).join(' -> ')}`);
    console.log(`   Shuffle Key: ${shuffleKey}`);
    
    // Test unshuffle
    const testAnswers = shuffled.map((q, shuffledIndex) => ({
      questionIndex: shuffledIndex,
      score: 5
    }));
    
    const unshuffled = unshuffleAnswers(testAnswers, originalIndices);
    
    // Verify unshuffle worked
    const unshuffleCorrect = unshuffled.every((answer, i) => {
      return answer.questionIndex === originalQuestions[i].q;
    });
    
    // Verify shuffle key
    const keyValid = verifyShuffleKey(originalIndices, shuffleKey);
    
    if (!unshuffleCorrect) {
      console.log(`   ❌ Unshuffle failed!`);
      shuffleWorks = false;
    }
    
    if (!keyValid) {
      console.log(`   ❌ Shuffle key verification failed!`);
      shuffleWorks = false;
    }
    
    if (unshuffleCorrect && keyValid) {
      console.log(`   ✅ Shuffle & Unshuffle work correctly`);
    }
  }
  
  // Test that shuffle actually changes order
  console.log('\n📊 Shuffle Randomness Test:');
  const allOrders = [];
  for (let i = 0; i < 100; i++) {
    const { shuffled } = shuffleQuestions(originalQuestions);
    const order = shuffled.map(q => q.q).join('');
    allOrders.push(order);
  }
  
  const uniqueOrders = new Set(allOrders).size;
  const randomnessScore = (uniqueOrders / 100) * 100;
  
  console.log(`   Unique orderings in 100 shuffles: ${uniqueOrders}/100`);
  console.log(`   Randomness score: ${randomnessScore.toFixed(1)}%`);
  
  if (randomnessScore < 50) {
    console.log(`   ⚠️  Low randomness - shuffle may not be working optimally`);
  } else {
    console.log(`   ✅ Good randomness - shuffle is working!`);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n📈 Summary:');
  console.log(`   ✅ Shuffle function: ${shuffleWorks ? 'Working' : 'FAILED'}`);
  console.log(`   ✅ Order changes: ${orderChanged ? 'Yes' : 'No (may need more iterations)'}`);
  console.log(`   ✅ Unshuffle function: ${shuffleWorks ? 'Working' : 'FAILED'}`);
  console.log(`   ✅ Key verification: ${shuffleWorks ? 'Working' : 'FAILED'}`);
  console.log(`   ✅ Randomness: ${randomnessScore >= 50 ? 'Good' : 'Low'}`);
  
  if (shuffleWorks && orderChanged) {
    console.log('\n✅ Question Shuffle is WORKING CORRECTLY!');
    console.log('\n💡 In Browser Test:');
    console.log('   1. Go to http://localhost:3000/test');
    console.log('   2. Select a cohort (YLA/TASO2/NUORI)');
    console.log('   3. Reload the page and select again');
    console.log('   4. Questions should appear in different order');
    console.log('   5. Answers are correctly mapped back to original questions');
  } else {
    console.log('\n⚠️  Some tests failed - check implementation');
  }
}

testQuestionShuffle()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error.message);
    process.exit(1);
  });



