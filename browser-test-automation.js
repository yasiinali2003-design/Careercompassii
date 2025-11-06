// This script will be injected into browser to test
window.testQuestionPool = {
  checkLocalStorage: function() {
    const data = localStorage.getItem('careercompass-questionpool-YLA');
    if (!data) {
      console.log('✓ No question pool data (expected for first test)');
      return null;
    }
    const parsed = JSON.parse(data);
    console.log('✓ Question Pool State:');
    console.log('  Used sets:', parsed.usedSets);
    console.log('  Last used:', new Date(parsed.lastUsed).toLocaleString());
    return parsed;
  },
  
  resetPool: function() {
    localStorage.removeItem('careercompass-questionpool-YLA');
    console.log('✓ Question pool reset');
  },
  
  getCurrentSet: function() {
    // This would need to be called after test starts
    // We'll check it from the network requests
    return 'Check network tab for /api/score requests';
  }
};

console.log('Test helpers loaded. Use:');
console.log('  testQuestionPool.checkLocalStorage()');
console.log('  testQuestionPool.resetPool()');
