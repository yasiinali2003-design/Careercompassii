# Browser Testing Guide - YLA Question Pool

## Prerequisites
- Local development server running (`npm run dev`)
- Browser with Developer Tools open (F12)
- localStorage cleared or ready to test

## Test 1: localStorage Functionality

### Step 1: Check Initial State
1. Open browser console (F12)
2. Go to Application/Storage tab → Local Storage
3. Navigate to your domain
4. Verify no `careercompass-questionpool-YLA` entry exists

### Step 2: Take First Test
1. Go to `/test`
2. Select "Yläaste (13–15 v)"
3. Complete the test
4. Check localStorage:
   ```javascript
   JSON.parse(localStorage.getItem('careercompass-questionpool-YLA'))
   ```
   Expected: `{ cohort: 'YLA', usedSets: [0], ... }`

### Step 3: Verify Set Used
- Open console and check:
  ```javascript
  const data = JSON.parse(localStorage.getItem('careercompass-questionpool-YLA'));
  console.log('Used sets:', data.usedSets);
  ```
- Should show: `[0]`

### Step 4: Take Second Test
1. Navigate to `/test` again
2. Select "Yläaste" again
3. Complete the test
4. Check localStorage again - should show `[0, 1]` or `[0, 2]`

### Step 5: Verify Different Questions
- Compare question texts between first and second test
- They should be different (different set)

## Test 2: Scoring Accuracy

### Step 1: Prepare Answer Pattern
1. Take first test (Set 0)
2. Note your answers (or use same pattern)
3. Save the results

### Step 2: Clear Set Tracking (but keep answers)
1. Open console
2. Run:
   ```javascript
   // Clear only the question pool tracking
   localStorage.removeItem('careercompass-questionpool-YLA');
   ```

### Step 3: Take Test Again
1. Navigate to `/test` again
2. Select "Yläaste"
3. Answer **exactly the same way**:
   - For each question, match the same Likert score (1-5)
   - Even though questions are different, answer equivalently

### Step 4: Compare Results
- Check dimension scores
- Check education path recommendation
- Check top careers
- They should be **identical** or very similar

### Step 5: Verify Answer Mapping
- Open Network tab
- Check `/api/score` request
- Look at `answers` array
- Verify `questionIndex` values are 0-29 (originalQ indices)

## Test 3: Set Cycling

### Manual Test Procedure:
1. **Test 1**: Take YLA test → Should use Set 0
2. **Test 2**: Take YLA test → Should use Set 1 or Set 2
3. **Test 3**: Take YLA test → Should use remaining set
4. **Test 4**: Take YLA test → Should reset to Set 0

### Verify with Console:
```javascript
// After each test, check:
const data = JSON.parse(localStorage.getItem('careercompass-questionpool-YLA'));
console.log('Used sets:', data.usedSets);
console.log('Available sets:', [0, 1, 2].filter(s => !data.usedSets.includes(s)));
```

## Test 4: Error Handling

### Test Corrupted Data:
```javascript
// Set corrupted data
localStorage.setItem('careercompass-questionpool-YLA', 'invalid json');

// Reload page and try to take test
// Should handle gracefully and start fresh
```

### Test Missing Data:
```javascript
// Clear data
localStorage.removeItem('careercompass-questionpool-YLA');

// Reload page and take test
// Should start with Set 0
```

## Test 5: Questions Validation

### Visual Check:
1. Go through all 3 sets manually
2. Verify:
   - ✓ All questions are clear and understandable
   - ✓ Grammar is correct
   - ✓ Age-appropriate language
   - ✓ No duplicate questions within same set
   - ✓ Questions are different between sets

### Programmatic Check:
Open console and run:
```javascript
// This would need to be done in browser with actual imports
// But you can visually verify questions are different
```

## Expected Results

### localStorage Behavior:
- ✅ First test: Set 0 used
- ✅ Second test: Set 1 or Set 2 used
- ✅ Third test: Remaining set used
- ✅ Fourth test: Resets to Set 0
- ✅ Data persists across page reloads
- ✅ Handles corrupted data gracefully

### Scoring Accuracy:
- ✅ Same answer pattern → Same dimension scores
- ✅ Same answer pattern → Same education path
- ✅ Same answer pattern → Same top careers
- ✅ Answers map correctly to originalQ (0-29)

### Question Quality:
- ✅ All 90 questions created
- ✅ Grammar correct
- ✅ Age-appropriate
- ✅ Answerable by 13-15 year olds

## Debugging Tips

### Check Set Selection:
```javascript
// In browser console
const data = JSON.parse(localStorage.getItem('careercompass-questionpool-YLA'));
console.log('Current state:', data);
```

### Check Answer Mapping:
```javascript
// In Network tab, check /api/score request
// Look at the answers array
// Each answer should have questionIndex: 0-29
```

### Reset Everything:
```javascript
// Clear all question pool data
['careercompass-questionpool-YLA', 'careercompass-questionpool-TASO2', 'careercompass-questionpool-NUORI'].forEach(key => {
  localStorage.removeItem(key);
});
```

## Success Criteria

✅ localStorage persists across sessions
✅ Set selection cycles correctly (0 → 1/2 → remaining → reset)
✅ Same answers produce same results across sets
✅ All questions are different per set
✅ Error handling works correctly
✅ Questions are age-appropriate and grammatically correct

