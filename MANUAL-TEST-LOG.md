# Browser Manual Test Results - Multiple Runs

## Test Execution Plan

### Test Run 1: Initial State → Set 0
- [ ] Navigate to /test
- [ ] Click "Aloita testi"
- [ ] Select "Yläaste (13–15 v)"
- [ ] Answer all 30 questions
- [ ] Submit results
- [ ] Check localStorage: Should show `usedSets: [0]`
- [ ] Save first question text for comparison

### Test Run 2: Set 0 Used → Set 1 or 2
- [ ] Navigate to /test again
- [ ] Select "Yläaste" again
- [ ] Answer all 30 questions (same pattern)
- [ ] Submit results
- [ ] Check localStorage: Should show `usedSets: [0, 1]` or `[0, 2]`
- [ ] Verify first question is different from Run 1
- [ ] Compare results: Should be identical (same answers)

### Test Run 3: Remaining Set Used
- [ ] Navigate to /test again
- [ ] Select "Yläaste" again
- [ ] Answer all 30 questions (same pattern)
- [ ] Submit results
- [ ] Check localStorage: Should show `usedSets: [0, 1, 2]`
- [ ] Verify first question is different from Run 1 and Run 2

### Test Run 4: Reset After All Sets Used
- [ ] Navigate to /test again
- [ ] Select "Yläaste" again
- [ ] Answer all 30 questions (same pattern)
- [ ] Submit results
- [ ] Check localStorage: Should reset to `usedSets: [0]`
- [ ] Verify first question matches Run 1 (same question)

## Automated Test Script

Run this in browser console before each test:

```javascript
// Check localStorage state
function checkState() {
  const data = localStorage.getItem('careercompass-questionpool-YLA');
  if (!data) {
    console.log('Run 1: No data yet (expected)');
    return { run: 1, expected: 'Set 0 will be used' };
  }
  const parsed = JSON.parse(data);
  const usedCount = parsed.usedSets.length;
  const expected = usedCount === 1 ? 'Set 1 or 2' : 
                   usedCount === 2 ? 'Remaining set' : 
                   'Reset to Set 0';
  console.log(`Run ${usedCount + 1}: Used sets: ${parsed.usedSets.join(', ')}`);
  console.log(`Expected next: ${expected}`);
  return { run: usedCount + 1, usedSets: parsed.usedSets, expected };
}

checkState();
```

## Results Log

### Run 1 Results:
- Date: ___________
- Used Sets: ___________
- First Question: ___________
- Results: ___________

### Run 2 Results:
- Date: ___________
- Used Sets: ___________
- First Question: ___________
- Results Match Run 1: Yes/No

### Run 3 Results:
- Date: ___________
- Used Sets: ___________
- First Question: ___________
- Results Match Run 1: Yes/No

### Run 4 Results:
- Date: ___________
- Used Sets: ___________
- First Question: ___________
- Matches Run 1: Yes/No

## Quick Verification Commands

```javascript
// After each test completion, run:
const data = JSON.parse(localStorage.getItem('careercompass-questionpool-YLA'));
console.log('Used sets:', data.usedSets);
console.log('Next will use:', [0,1,2].filter(s => !data.usedSets.includes(s)));
```

