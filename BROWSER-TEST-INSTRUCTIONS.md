# Browser Testing Instructions

## ✅ All Tests Passed (100%)

Database tests: **15/15 passed (100%)**

## Browser Testing Steps

### Option 1: Test via HTML Test Page

1. **Start the development server** (if not running):
   ```bash
   npm run dev
   ```

2. **Open the test page**:
   - Navigate to: `http://localhost:3000/test-browser-todistuspiste.html`
   - Or open the file directly in your browser

3. **Run tests**:
   - Click "Run All Tests" button
   - Or run individual tests one by one

### Option 2: Test via Browser Console

1. **Open browser console** (F12 or Cmd+Option+I)

2. **Test API endpoint**:
   ```javascript
   // Test 1: Basic fetch
   fetch('/api/study-programs')
     .then(r => r.json())
     .then(d => console.log('✅ Programs:', d.programs?.length || 0))
     .catch(e => console.error('❌ Error:', e));

   // Test 2: Filter by points
   fetch('/api/study-programs?points=50&limit=10')
     .then(r => r.json())
     .then(d => console.log('✅ Filtered:', d.programs?.length || 0))
     .catch(e => console.error('❌ Error:', e));

   // Test 3: Filter by type
   fetch('/api/study-programs?type=amk&limit=10')
     .then(r => r.json())
     .then(d => {
       const allAMK = d.programs?.every(p => p.institution_type === 'amk');
       console.log(allAMK ? '✅ All AMK' : '❌ Not all AMK');
     })
     .catch(e => console.error('❌ Error:', e));

   // Test 4: Search
   fetch('/api/study-programs?search=tietotekniikka&limit=10')
     .then(r => r.json())
     .then(d => console.log('✅ Search results:', d.programs?.length || 0))
     .catch(e => console.error('❌ Error:', e));

   // Test 5: Sort
   fetch('/api/study-programs?sort=points_asc&limit=10')
     .then(r => r.json())
     .then(d => {
       const sorted = d.programs?.every((p, i) => 
         i === 0 || p.min_points >= d.programs[i - 1].min_points
       );
       console.log(sorted ? '✅ Sorted correctly' : '❌ Not sorted');
     })
     .catch(e => console.error('❌ Error:', e));
   ```

### Option 3: Test Full Feature Flow

1. **Navigate to test results page**:
   - Go to: `http://localhost:3000/test/results`
   - Or complete a test as TASO2 user

2. **Check Todistuspistelaskuri**:
   - Should appear for TASO2 users with yliopisto/AMK recommendation
   - Enter grades and calculate points
   - Verify programs are displayed
   - Check filtering and search work

## Expected Results

### API Endpoints Should Return:
- ✅ `/api/study-programs` - List of programs
- ✅ `/api/study-programs?points=50` - Filtered by points
- ✅ `/api/study-programs?type=amk` - Filtered by type
- ✅ `/api/study-programs?search=tietotekniikka` - Search results
- ✅ `/api/study-programs?sort=points_asc` - Sorted results

### Data Quality:
- ✅ All programs have names, institutions, points
- ✅ Points are in valid range (20-200)
- ✅ Programs have correct institution types
- ✅ Career matching works

## Test Checklist

- [ ] API endpoints respond correctly
- [ ] Filtering by points works
- [ ] Filtering by institution type works
- [ ] Search functionality works
- [ ] Sorting works
- [ ] Pagination works
- [ ] Career matching works
- [ ] Data quality is good
- [ ] Todistuspistelaskuri component renders
- [ ] Calculator calculates points correctly
- [ ] Programs list displays correctly

## Notes

- If dev server is not running, start it with `npm run dev`
- Tests may fail if API is not available (expected in some environments)
- Browser tests verify the actual user experience

