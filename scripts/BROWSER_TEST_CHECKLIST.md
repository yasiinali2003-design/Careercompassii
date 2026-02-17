# Browser Testing Checklist - Metrics Tracking

**Date**: 2026-02-17
**Status**: Ready for testing
**Goal**: Verify all 4 metric events track correctly in browser

---

## 🎯 Test Objectives

Verify that all metrics tracking works end-to-end:

1. ✅ **session_start** - Tracks when results page loads
2. ✅ **career_click** - Tracks when user clicks on career card
3. ✅ **none_relevant** - Tracks when user says "none fit"
4. ✅ **session_complete** - Tracks when user closes page

---

## 📋 Pre-Test Setup

### Step 1: Verify Database Migration

Before browser testing, confirm the migration ran successfully:

**In Supabase SQL Editor**, run:
```sql
-- Check table exists
SELECT COUNT(*) as row_count FROM core_metrics;

-- Check materialized views exist
SELECT matviewname FROM pg_matviews WHERE schemaname = 'public';
```

**Expected result**:
- `row_count: 0` (empty table, ready for data)
- 3 views: `career_click_rate`, `teacher_feedback_summary`, `none_relevant_rate`

---

### Step 2: Start Localhost Server

```bash
cd /Users/yasiinali/careercompassi
npm run dev
```

**Expected output**:
```
> careercompassi@0.1.0 dev
> next dev

  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Ready in xxxms
```

---

### Step 3: Open Browser DevTools

1. Open Chrome/Firefox/Safari
2. Press `F12` (or `Cmd+Option+I` on Mac)
3. Go to **Console** tab
4. Clear console (click trash icon)

---

## 🧪 Test Flow 1: Complete Test Session

### Test 1.1: Session Start Tracking

**Action**: Complete test and reach results page

1. Navigate to `http://localhost:3000/test`
2. Select cohort: **TASO2** (Toisen asteen opiskelija)
3. Select path: **Lukio**
4. Answer all questions (any answers are fine)
5. Click "Näytä tulokset" button
6. Wait for results page to load

**Expected Console Output**:
```javascript
[metrics] Tracked session_start: {
  session_id: "session_1739875200000_abc123",
  event_type: "session_start",
  career_slugs: ["ohjelmistokehittaja", "ux-suunnittelija", ...],
  categories: ["tekniikka", "luova", ...],
  cohort: "TASO2",
  sub_cohort: "LUKIO"
}
```

**Expected Network Request**:
- Request: `POST http://localhost:3000/api/metrics`
- Status: `200 OK`
- Response body: `{ success: true, data: {...} }`

**✅ Test Passes If**:
- Console shows "[metrics] Tracked session_start"
- Network tab shows successful POST to /api/metrics
- No errors in console

---

### Test 1.2: Career Click Tracking

**Action**: Click on a career card

1. On results page, find career #1 (top recommendation)
2. Click "Tutustu uraan" button

**Expected Console Output**:
```javascript
[metrics] Tracked career_click: {
  session_id: "session_1739875200000_abc123",
  event_type: "career_click",
  career_slug: "ohjelmistokehittaja",
  career_title: "Ohjelmistokehittäjä",
  rank: 1,
  overall_score: 85.5,
  category: "tekniikka",
  cohort: "TASO2",
  sub_cohort: "LUKIO"
}
```

**Expected Network Request**:
- Request: `POST http://localhost:3000/api/metrics`
- Status: `200 OK`
- Career page loads (new tab or navigation)

**✅ Test Passes If**:
- Console shows "[metrics] Tracked career_click"
- Rank matches card position (1-5)
- sessionStorage has `careers_clicked` = "1"

**Repeat**: Click on career #2 and verify:
- Console shows second career_click event
- sessionStorage has `careers_clicked` = "2"

---

### Test 1.3: Alternative Click Tracking

**Action**: Click on secondary link

1. On results page, find career #3
2. Click "Näytä koulutuspolut ja työpaikat" link (not the button)

**Expected Console Output**:
```javascript
[metrics] Tracked career_click: {
  session_id: "session_1739875200000_abc123",
  event_type: "career_click",
  career_slug: "data-analyytikko",
  rank: 3,
  ...
}
```

**✅ Test Passes If**:
- Both primary button AND secondary link track clicks
- Same event structure for both
- sessionStorage increments correctly

---

### Test 1.4: None Relevant Tracking

**Action**: Click "None of these fit" button

1. Navigate back to results page (or refresh)
2. Scroll to bottom of career recommendations
3. Find "Ei mikään näistä sovi minulle" button
4. Click the button
5. Form expands with textarea
6. Enter optional feedback: "Haluan työskennellä ulkona"
7. Click "Lähetä palaute" button

**Expected Console Output**:
```javascript
[metrics] Tracked none_relevant: {
  session_id: "session_1739875200000_abc123",
  event_type: "none_relevant",
  career_slugs: ["ohjelmistokehittaja", "ux-suunnittelija", ...],
  cohort: "TASO2",
  sub_cohort: "LUKIO",
  reason: "Haluan työskennellä ulkona"
}
```

**Expected UI Behavior**:
- Form expands smoothly (animation)
- After submit, shows "✓ Kiitos palautteesta!"
- Success message disappears after 2 seconds
- Button returns to collapsed state

**✅ Test Passes If**:
- Console shows "[metrics] Tracked none_relevant"
- Reason is included in event_data
- UI animations work smoothly

**Edge Case**: Test without reason
1. Click button again
2. Leave textarea empty
3. Click "Lähetä palaute"
4. Verify tracking still works (reason should be undefined/null)

---

### Test 1.5: Session Complete Tracking

**Action**: Close results page tab

1. On results page, note the session_id from console
2. Close the browser tab (Cmd+W or click X)

**Expected Behavior**:
- `beforeunload` event fires
- POST request sent to /api/metrics (may not show in console due to timing)

**✅ Test Passes If**:
- After closing tab, check Network tab before closing DevTools
- Look for final POST to /api/metrics with event_type: "session_complete"
- Contains: `careers_clicked`, `time_on_page` (in seconds)

**Note**: This event is harder to verify in browser due to timing. We'll verify in database instead.

---

## 🗄️ Test Flow 2: Database Verification

After completing Test Flow 1, verify events are in database.

### Step 2.1: Check Raw Events

**In Supabase SQL Editor**, run:
```sql
SELECT
  id,
  session_id,
  event_type,
  event_data,
  cohort,
  sub_cohort,
  created_at
FROM core_metrics
ORDER BY created_at DESC
LIMIT 20;
```

**Expected Results**: You should see 4-6 events from your test session:

| session_id | event_type | cohort | sub_cohort | event_data (summary) |
|------------|------------|--------|------------|---------------------|
| session_xxx | session_start | TASO2 | LUKIO | {"career_slugs": [...], "categories": [...]} |
| session_xxx | career_click | TASO2 | LUKIO | {"career_slug": "ohjelmistokehittaja", "rank": 1, ...} |
| session_xxx | career_click | TASO2 | LUKIO | {"career_slug": "ux-suunnittelija", "rank": 2, ...} |
| session_xxx | career_click | TASO2 | LUKIO | {"career_slug": "data-analyytikko", "rank": 3, ...} |
| session_xxx | none_relevant | TASO2 | LUKIO | {"career_slugs": [...], "reason": "Haluan..."} |
| session_xxx | session_complete | TASO2 | LUKIO | {"careers_clicked": 3, "time_on_page": 45} |

**✅ Test Passes If**:
- All events have same session_id
- event_type values are correct
- cohort and sub_cohort match test input
- Timestamps are sequential (session_start first, session_complete last)

---

### Step 2.2: Verify Career Click Count

**In Supabase SQL Editor**, run:
```sql
SELECT
  session_id,
  COUNT(*) as click_count
FROM core_metrics
WHERE event_type = 'career_click'
GROUP BY session_id
ORDER BY click_count DESC;
```

**Expected Result**:
- Your test session should show `click_count: 3` (if you clicked 3 careers)

---

### Step 2.3: Check Session Complete Data

**In Supabase SQL Editor**, run:
```sql
SELECT
  session_id,
  event_data->>'careers_clicked' as careers_clicked,
  event_data->>'time_on_page' as time_on_page_seconds,
  created_at
FROM core_metrics
WHERE event_type = 'session_complete'
ORDER BY created_at DESC
LIMIT 5;
```

**Expected Result**:
- `careers_clicked` should match actual clicks (e.g., "3")
- `time_on_page_seconds` should be reasonable (e.g., 30-120 seconds)

---

### Step 2.4: Verify None Relevant Feedback

**In Supabase SQL Editor**, run:
```sql
SELECT
  session_id,
  event_data->>'career_slugs' as careers_shown,
  event_data->>'reason' as feedback_reason,
  created_at
FROM core_metrics
WHERE event_type = 'none_relevant'
ORDER BY created_at DESC
LIMIT 5;
```

**Expected Result**:
- `careers_shown` should be array of 5 career slugs
- `feedback_reason` should be your typed feedback (or null if skipped)

---

## 🧪 Test Flow 3: Metrics Calculation

After collecting test data, verify metrics calculate correctly.

### Step 3.1: Refresh Materialized Views

**In Supabase SQL Editor**, run:
```sql
SELECT refresh_core_metrics_views();
```

**Expected**: "Success. No rows returned"

---

### Step 3.2: Check Career Click Rate

**In Supabase SQL Editor**, run:
```sql
SELECT
  cohort,
  sub_cohort,
  date,
  total_sessions,
  sessions_with_clicks,
  click_rate_percentage
FROM career_click_rate
ORDER BY date DESC
LIMIT 5;
```

**Expected Result**:
- `total_sessions: 1` (your test session)
- `sessions_with_clicks: 1` (you clicked careers)
- `click_rate_percentage: 100.00` (1/1 = 100%)

---

### Step 3.3: Check None Relevant Rate

**In Supabase SQL Editor**, run:
```sql
SELECT
  cohort,
  sub_cohort,
  date,
  total_sessions,
  none_relevant_count,
  none_relevant_percentage
FROM none_relevant_rate
ORDER BY date DESC
LIMIT 5;
```

**Expected Result**:
- `total_sessions: 1`
- `none_relevant_count: 1` (you clicked the button)
- `none_relevant_percentage: 100.00`

---

### Step 3.4: Get Weekly Summary

**In Supabase SQL Editor**, run:
```sql
SELECT * FROM get_current_week_metrics();
```

**Expected Result**:

| metric_name | metric_value | total_count |
|-------------|--------------|-------------|
| career_click_rate | 100.00 | 1 |
| teacher_feedback_avg | 0.00 | 0 |
| none_relevant_rate | 100.00 | 1 |

**Note**: Percentages will be 100% with only 1 test session. They'll stabilize with more data.

---

## 🧪 Test Flow 4: Multiple Sessions

To verify metrics aggregate correctly, complete 2-3 more test sessions.

### Session 2: AMIS Student Who Clicks Careers

1. Complete test as **TASO2** / **Ammattikoulu**
2. Click 2 careers
3. DON'T click "none relevant"
4. Close tab

**Expected Metrics After**:
- Total sessions: 2
- Career click rate: 100% (2/2)
- None relevant rate: 50% (1/2)

---

### Session 3: Student Who Doesn't Click

1. Complete test as **TASO2** / **Lukio**
2. DON'T click any careers
3. DON'T click "none relevant"
4. Just close tab

**Expected Metrics After**:
- Total sessions: 3
- Career click rate: 66.67% (2/3)
- None relevant rate: 33.33% (1/3)

---

### Session 4: Student Who Only Says "None Fit"

1. Complete test as **YLA**
2. DON'T click careers
3. Click "none relevant" and submit
4. Close tab

**Expected Metrics After**:
- Total sessions: 4
- Career click rate: 50% (2/4)
- None relevant rate: 50% (2/4)

---

## 📊 Expected Final Metrics (After 4 Test Sessions)

**Raw Events Table**:
- Total rows: ~16-20 events
- 4 session_start events
- ~2-5 career_click events
- 2 none_relevant events
- ~3-4 session_complete events

**Career Click Rate View**:
- total_sessions: 4
- sessions_with_clicks: 2
- click_rate_percentage: 50.00%

**None Relevant Rate View**:
- total_sessions: 4
- none_relevant_count: 2
- none_relevant_percentage: 50.00%

**Teacher Feedback View**:
- total_ratings: 0 (we haven't tested teacher feedback form yet)
- average_rating: null

---

## 🐛 Common Issues & Fixes

### Issue 1: No console logs appear

**Cause**: Tracking functions might be failing silently

**Debug**:
1. Open Network tab in DevTools
2. Filter for "metrics"
3. Check if POST requests are being sent
4. Click on request → Preview tab → Check response

**Fix**: If no requests are sent, check:
- Is `cohort` prop being passed to components?
- Open `app/test/results/page.tsx` and verify useEffect is running

---

### Issue 2: "Database not configured" error

**Cause**: Missing environment variables

**Fix**:
1. Check `.env.local` exists
2. Verify all 3 Supabase variables are set
3. Restart dev server: `npm run dev`

---

### Issue 3: Events not in database

**Cause**: API endpoint returning error

**Debug**:
1. Check Network tab → POST /api/metrics
2. Look at response body
3. Common errors:
   - "Table doesn't exist" → Run migration
   - "RLS policy" error → Check policies in Supabase

**Fix**: Run migration SQL in Supabase dashboard

---

### Issue 4: session_complete not tracked

**Cause**: `beforeunload` doesn't fire reliably in all browsers

**Status**: Expected behavior - some browsers block this

**Workaround**: Check database directly:
```sql
SELECT COUNT(*) FROM core_metrics WHERE event_type = 'session_complete';
```

If count is 0 after multiple tests, this is a known limitation. Not critical for pilot.

---

### Issue 5: Metrics views are empty

**Cause**: Views not refreshed

**Fix**:
```sql
SELECT refresh_core_metrics_views();
```

Then query again.

---

## ✅ Test Completion Checklist

After completing all test flows, verify:

- [ ] All 4 event types appear in console logs
- [ ] Network tab shows successful POST requests
- [ ] Database has events from 4+ test sessions
- [ ] Career click rate calculates correctly
- [ ] None relevant rate calculates correctly
- [ ] Materialized views refresh successfully
- [ ] Weekly summary function returns data
- [ ] No TypeScript errors in console
- [ ] No React errors in console
- [ ] UI animations work smoothly

---

## 🚀 Next Steps After Testing

Once all tests pass:

1. ✅ Mark "Test metrics tracking in browser" as completed
2. Document any issues found
3. Move to Week 3 Day 2-3: **Pilot with 2-3 Teachers**
4. Prepare pilot instructions for teachers
5. Monitor metrics during pilot sessions

---

## 📝 Test Results Template

Copy this template to document your test results:

```markdown
## Metrics Browser Test Results

**Date**: 2026-02-17
**Tester**: [Your name]
**Browser**: Chrome/Firefox/Safari [version]

### Test Flow 1: Single Session

- [ ] session_start tracked: YES / NO
- [ ] career_click tracked: YES / NO
- [ ] none_relevant tracked: YES / NO
- [ ] session_complete tracked: YES / NO

**Console logs**: ✅ All events logged / ❌ Errors found
**Network requests**: ✅ All successful / ❌ Some failed
**Database verification**: ✅ All events stored / ❌ Missing events

### Test Flow 2: Database Verification

- [ ] Raw events table populated: YES / NO
- [ ] Event count matches expectations: YES / NO
- [ ] Session IDs consistent: YES / NO

### Test Flow 3: Metrics Calculation

- [ ] Materialized views refresh: YES / NO
- [ ] Career click rate correct: YES / NO
- [ ] None relevant rate correct: YES / NO
- [ ] Weekly summary works: YES / NO

### Test Flow 4: Multiple Sessions

Sessions completed: [X]
- [ ] Metrics aggregate correctly: YES / NO
- [ ] Percentages calculate as expected: YES / NO

### Issues Found

[List any issues encountered]

### Overall Status

✅ PASS - All tests successful, ready for pilot
⚠️  PARTIAL - Some issues, needs fixes
❌ FAIL - Major issues, not ready

**Notes**: [Any additional observations]
```

---

**Status**: Ready for browser testing
**Estimated time**: 20-30 minutes for complete test suite
**Next action**: Complete Test Flow 1-4 and document results! 🧪
