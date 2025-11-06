// Browser test script for question pool
// This will be executed in browser console

console.log('=== QUESTION POOL BROWSER TEST ===\n');

// Check localStorage state for all cohorts
const cohorts = ['YLA', 'TASO2', 'NUORI'];

cohorts.forEach(cohort => {
  const key = `careercompass-questionpool-${cohort}`;
  const stored = localStorage.getItem(key);
  
  if (stored) {
    try {
      const data = JSON.parse(stored);
      console.log(`✅ ${cohort}: Used sets: [${data.usedSets?.join(', ') || 'none'}], Last used: ${new Date(data.lastUsed).toLocaleString()}`);
    } catch (e) {
      console.log(`⚠️ ${cohort}: Corrupted data found`);
    }
  } else {
    console.log(`📊 ${cohort}: No data (first test will use Set 0)`);
  }
});

// Test function to simulate question set selection
function testSetSelection(cohort) {
  const key = `careercompass-questionpool-${cohort}`;
  const stored = localStorage.getItem(key);
  const usedSets = stored ? JSON.parse(stored).usedSets || [] : [];
  const availableSets = [0, 1, 2].filter(s => !usedSets.includes(s));
  
  console.log(`\n${cohort} Test:`);
  console.log(`  Used sets: [${usedSets.join(', ')}]`);
  console.log(`  Available sets: [${availableSets.join(', ')}]`);
  
  if (availableSets.length === 0) {
    console.log(`  ✅ Will reset and use Set 0`);
  } else {
    const nextSet = availableSets.includes(0) && usedSets.length === 0 ? 0 : availableSets[Math.floor(Math.random() * availableSets.length)];
    console.log(`  ✅ Next set will be: Set ${nextSet}`);
  }
}

console.log('\n=== SET SELECTION TEST ===');
cohorts.forEach(testSetSelection);

console.log('\n=== TEST COMPLETE ===');
console.log('To reset a cohort pool, run: localStorage.removeItem(\'careercompass-questionpool-YLA\')');

