# Browser Test Results - YLA Question Pool

## Test Execution Date
$(date)

## Test 1: Initial State Check

### localStorage Check
```javascript
// Run in browser console
localStorage.getItem('careercompass-questionpool-YLA')
```
**Expected**: `null` (no data initially)

## Test 2: First Test (Set 0)

### Steps:
1. Navigate to `/test`
2. Click "Aloita testi"
3. Select "Yläaste (13–15 v)"
4. Complete the test (answer all 30 questions)
5. Submit results

### Verification:
```javascript
// After completing test, check localStorage
const data = JSON.parse(localStorage.getItem('careercompass-questionpool-YLA'));
console.log('Used sets:', data.usedSets);
console.log('Set index:', data.usedSets[0]); // Should be 0
```
**Expected**: `{ usedSets: [0], cohort: 'YLA', ... }`

## Test 3: Second Test (Set 1 or 2)

### Steps:
1. Navigate to `/test` again
2. Select "Yläaste" again
3. Complete the test again

### Verification:
```javascript
const data = JSON.parse(localStorage.getItem('careercompass-questionpool-YLA'));
console.log('Used sets:', data.usedSets);
```
**Expected**: `[0, 1]` or `[0, 2]` (different from first test)

### Question Comparison:
- Compare first question from Test 1 vs Test 2
- Should be different questions (different set)

## Test 4: Answer Mapping Verification

### Steps:
1. Note down answers from Test 1 (Set 0)
2. Complete Test 2 with equivalent answers
3. Compare results

### Verification:
```javascript
// Check Network tab → /api/score request
// Look at answers array
// Each answer should have questionIndex: 0-29
```
**Expected**: Results should be identical or very similar

## Test 5: All Sets Used

### Steps:
1. Complete Test 3 (should use remaining set)
2. Check localStorage

### Verification:
```javascript
const data = JSON.parse(localStorage.getItem('careercompass-questionpool-YLA'));
console.log('Used sets:', data.usedSets);
```
**Expected**: `[0, 1, 2]` (all sets used)

## Test 6: Reset After All Sets

### Steps:
1. Complete Test 4 (should reset to Set 0)
2. Check localStorage

### Verification:
```javascript
const data = JSON.parse(localStorage.getItem('careercompass-questionpool-YLA'));
console.log('Used sets:', data.usedSets);
```
**Expected**: `[0]` (reset after all sets used)

## Test 7: Persistence

### Steps:
1. Complete a test
2. Refresh page (F5)
3. Check localStorage persists

### Verification:
```javascript
// Before refresh
const before = localStorage.getItem('careercompass-questionpool-YLA');

// After refresh (re-run in console)
const after = localStorage.getItem('careercompass-questionpool-YLA');
console.log('Same:', before === after); // Should be true
```

## Test 8: Error Handling

### Test Corrupted Data:
```javascript
// Set corrupted data
localStorage.setItem('careercompass-questionpool-YLA', 'invalid json');

// Reload page and try to take test
// Should handle gracefully
```

### Test Missing Data:
```javascript
// Clear data
localStorage.removeItem('careercompass-questionpool-YLA');

// Reload page and take test
// Should start fresh with Set 0
```

## Automated Test Script

Run this in browser console after each test:

```javascript
function checkQuestionPool() {
  const data = localStorage.getItem('careercompass-questionpool-YLA');
  if (!data) {
    console.log('❌ No question pool data found');
    return;
  }
  
  try {
    const parsed = JSON.parse(data);
    console.log('✅ Question Pool Data:');
    console.log('  Cohort:', parsed.cohort);
    console.log('  Used sets:', parsed.usedSets);
    console.log('  Last used:', new Date(parsed.lastUsed).toLocaleString());
    console.log('  Version:', parsed.version);
    
    const available = [0, 1, 2].filter(s => !parsed.usedSets.includes(s));
    console.log('  Available sets:', available.length > 0 ? available : 'None (will reset)');
    
    return parsed;
  } catch (e) {
    console.error('❌ Error parsing data:', e);
    console.log('Raw data:', data);
  }
}

checkQuestionPool();
```

## Quick Test Commands

### Check current state:
```javascript
checkQuestionPool();
```

### Clear question pool:
```javascript
localStorage.removeItem('careercompass-questionpool-YLA');
checkQuestionPool();
```

### Check all question pool data:
```javascript
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key.includes('questionpool')) {
    console.log(key, ':', JSON.parse(localStorage.getItem(key)));
  }
}
```

## Expected Results Summary

✅ First test: Set 0 used
✅ Second test: Set 1 or 2 used (different questions)
✅ Third test: Remaining set used
✅ Fourth test: Resets to Set 0
✅ localStorage persists across page reloads
✅ Error handling works correctly
✅ Same answers produce same results across sets

