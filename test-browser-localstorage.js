// Browser test script - run in browser console
console.log('=== YLA QUESTION POOL BROWSER TEST ===');

// Test 1: Check initial state
console.log('\n1. Checking initial localStorage state...');
const initialData = localStorage.getItem('careercompass-questionpool-YLA');
console.log('Initial data:', initialData);

// Test 2: Simulate taking a test
console.log('\n2. Simulating test completion...');
// After taking test, check localStorage
setTimeout(() => {
  const afterTest = localStorage.getItem('careercompass-questionpool-YLA');
  console.log('After test data:', afterTest);
  if (afterTest) {
    const parsed = JSON.parse(afterTest);
    console.log('Used sets:', parsed.usedSets);
    console.log('Last used:', new Date(parsed.lastUsed).toLocaleString());
  }
}, 5000);

// Test 3: Check all localStorage keys
console.log('\n3. All localStorage keys:');
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key.includes('questionpool')) {
    console.log(key, ':', localStorage.getItem(key));
  }
}

console.log('\n=== Test script ready - complete a test to see results ===');
