# Database Migration Guide - Core Metrics Table

**Date**: 2026-02-17
**Status**: Ready to execute
**Migration File**: `supabase/migrations/create_core_metrics_table.sql`

---

## 🎯 What This Migration Does

Creates the complete core metrics tracking infrastructure:

1. **core_metrics table** - stores all metric events
2. **3 materialized views** - pre-aggregated analytics for fast queries
3. **RLS policies** - anonymous INSERT, authenticated SELECT
4. **Helper functions** - refresh views, get weekly summary
5. **Indexes** - optimized for analytics queries

---

## 📋 Pre-Migration Checklist

Before running the migration, verify:

- [ ] You have access to Supabase dashboard
- [ ] You're in the correct project (careercompassi)
- [ ] You have the SQL Editor open
- [ ] Environment variables are set in `.env.local`:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
  SUPABASE_SERVICE_ROLE_KEY=eyJ...
  ```

---

## 🚀 Step-by-Step Migration Process

### Option 1: Supabase Dashboard (Recommended)

**Step 1**: Open Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project (careercompassi)
3. Click "SQL Editor" in the left sidebar

**Step 2**: Create New Query
1. Click "+ New query" button
2. Name it: `Create Core Metrics Table`

**Step 3**: Copy Migration SQL
1. Open `supabase/migrations/create_core_metrics_table.sql` in your editor
2. Copy ALL contents (lines 1-184)
3. Paste into Supabase SQL Editor

**Step 4**: Execute Migration
1. Click "Run" button (or press Cmd/Ctrl + Enter)
2. Wait for execution (should take 2-5 seconds)
3. Check for success message: "Success. No rows returned"

**Step 5**: Verify Tables Created
1. Click "Table Editor" in left sidebar
2. You should see new table: `core_metrics`
3. Click "Database" → "Tables" to verify structure
4. Check that indexes were created

**Step 6**: Verify Views Created
1. In SQL Editor, run:
   ```sql
   SELECT * FROM pg_matviews WHERE schemaname = 'public';
   ```
2. You should see 3 materialized views:
   - `career_click_rate`
   - `teacher_feedback_summary`
   - `none_relevant_rate`

**Step 7**: Verify Functions Created
1. In SQL Editor, run:
   ```sql
   SELECT proname, prosrc
   FROM pg_proc
   WHERE proname IN ('refresh_core_metrics_views', 'get_current_week_metrics');
   ```
2. You should see both functions listed

**Step 8**: Test RLS Policies
1. In SQL Editor, run:
   ```sql
   SELECT * FROM core_metrics LIMIT 10;
   ```
2. Should return empty result (no data yet)
3. Check policies exist:
   ```sql
   SELECT tablename, policyname, permissive, roles, cmd
   FROM pg_policies
   WHERE tablename = 'core_metrics';
   ```
4. You should see 2 policies:
   - "Allow anonymous metrics insertion" (INSERT, anon)
   - "Allow authenticated users to view metrics" (SELECT, authenticated)

---

### Option 2: Supabase CLI (Advanced)

**Step 1**: Install Supabase CLI (if not installed)
```bash
npm install -g supabase
```

**Step 2**: Link to Project
```bash
cd /Users/yasiinali/careercompassi
supabase link --project-ref your-project-ref
```

**Step 3**: Run Migration
```bash
supabase db push
```

**Step 4**: Verify Migration
```bash
supabase db diff
```

Should show no pending changes if migration succeeded.

---

## ✅ Post-Migration Verification

### Test 1: Insert Test Event (via API)

**In your terminal**, run:
```bash
curl -X POST http://localhost:3000/api/metrics \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test_migration_123",
    "event_type": "session_start",
    "event_data": {
      "career_slugs": ["test-career-1", "test-career-2"],
      "categories": ["tech"]
    },
    "cohort": "TASO2",
    "sub_cohort": "LUKIO"
  }'
```

**Expected response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid...",
    "session_id": "test_migration_123",
    "event_type": "session_start",
    "cohort": "TASO2",
    "sub_cohort": "LUKIO",
    "created_at": "2026-02-17T..."
  }
}
```

**If you get an error**, check:
- Is localhost:3000 running? (`npm run dev`)
- Are environment variables set in `.env.local`?
- Did the migration complete successfully?

---

### Test 2: Verify Event in Database

**In Supabase SQL Editor**, run:
```sql
SELECT * FROM core_metrics
WHERE session_id = 'test_migration_123';
```

**Expected result**:
| id | session_id | event_type | event_data | cohort | sub_cohort | created_at |
|----|------------|------------|------------|--------|------------|------------|
| uuid... | test_migration_123 | session_start | {"career_slugs": [...], ...} | TASO2 | LUKIO | 2026-02-17... |

---

### Test 3: Refresh Materialized Views

**In Supabase SQL Editor**, run:
```sql
SELECT refresh_core_metrics_views();
```

**Expected response**: "Success. No rows returned"

Then check views:
```sql
SELECT * FROM career_click_rate ORDER BY date DESC LIMIT 5;
SELECT * FROM teacher_feedback_summary ORDER BY date DESC LIMIT 5;
SELECT * FROM none_relevant_rate ORDER BY date DESC LIMIT 5;
```

Should show aggregated data (might be empty if no real events yet).

---

### Test 4: Get Weekly Summary

**In Supabase SQL Editor**, run:
```sql
SELECT * FROM get_current_week_metrics();
```

**Expected result**:
| metric_name | metric_value | total_count |
|-------------|--------------|-------------|
| career_click_rate | 0.00 | 1 |
| teacher_feedback_avg | 0.00 | 0 |
| none_relevant_rate | 0.00 | 1 |

(Values will be 0 until real data comes in)

---

## 🧪 Complete Browser Test Flow

Now that the database is ready, test the full metrics tracking flow:

### Test Flow: Complete a Test and Track Events

**Step 1**: Start localhost server
```bash
cd /Users/yasiinali/careercompassi
npm run dev
```

**Step 2**: Open browser to test page
```
http://localhost:3000/test
```

**Step 3**: Complete the test
- Answer all questions as TASO2/LUKIO student
- Submit test
- Wait for results page to load

**Step 4**: Check browser console
Open DevTools (F12 or Cmd+Option+I) → Console tab

**Expected console logs**:
```
[metrics] Tracked session_start: { session_id: "session_...", ... }
```

**Step 5**: Click on a career card
- Click "Tutustu uraan" button on any career

**Expected console log**:
```
[metrics] Tracked career_click: { career_slug: "...", rank: 1, ... }
```

**Step 6**: Click "None relevant" button
- Scroll to bottom of results page
- Click "Ei mikään näistä sovi minulle"
- Enter optional feedback
- Click "Lähetä palaute"

**Expected console log**:
```
[metrics] Tracked none_relevant: { career_slugs: [...], ... }
```

**Step 7**: Close the tab
- Close the results page tab

**Expected console log** (in Network tab):
```
POST /api/metrics (session_complete)
```
Note: This might not show in console due to timing, but will be in Network tab.

---

### Test Flow: Verify Events in Database

**In Supabase SQL Editor**, run:
```sql
SELECT
  session_id,
  event_type,
  cohort,
  sub_cohort,
  created_at
FROM core_metrics
ORDER BY created_at DESC
LIMIT 20;
```

**Expected result**: You should see 4 events from your test session:
1. `session_start` - when results loaded
2. `career_click` - when you clicked a career
3. `none_relevant` - when you submitted feedback
4. `session_complete` - when you closed the tab

---

### Test Flow: Check Metrics Dashboard

**Option A: Create Dashboard Page (Recommended)**

Create `app/teacher/metrics/page.tsx`:
```typescript
import { MetricsDashboard } from '@/components/MetricsDashboard';

export default function MetricsPage() {
  return (
    <div className="container mx-auto p-8 bg-slate-950 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-8">
        Metrics Dashboard
      </h1>
      <MetricsDashboard />
    </div>
  );
}
```

Then visit: `http://localhost:3000/teacher/metrics`

**Option B: SQL Query**

In Supabase SQL Editor:
```sql
-- Career Click Rate
SELECT
  ROUND(
    100.0 * COUNT(DISTINCT CASE WHEN event_type = 'career_click' THEN session_id END) /
    NULLIF(COUNT(DISTINCT CASE WHEN event_type = 'session_start' THEN session_id END), 0),
    2
  ) as click_rate_percentage,
  COUNT(DISTINCT CASE WHEN event_type = 'session_start' THEN session_id END) as total_sessions,
  COUNT(DISTINCT CASE WHEN event_type = 'career_click' THEN session_id END) as sessions_with_clicks
FROM core_metrics
WHERE event_type IN ('session_start', 'career_click')
  AND created_at >= NOW() - INTERVAL '7 days';

-- None Relevant Rate
SELECT
  ROUND(
    100.0 * COUNT(DISTINCT CASE WHEN event_type = 'none_relevant' THEN session_id END) /
    NULLIF(COUNT(DISTINCT CASE WHEN event_type = 'session_start' THEN session_id END), 0),
    2
  ) as none_relevant_percentage,
  COUNT(DISTINCT CASE WHEN event_type = 'session_start' THEN session_id END) as total_sessions,
  COUNT(DISTINCT CASE WHEN event_type = 'none_relevant' THEN session_id END) as none_relevant_count
FROM core_metrics
WHERE event_type IN ('session_start', 'none_relevant')
  AND created_at >= NOW() - INTERVAL '7 days';
```

---

## 🐛 Troubleshooting

### Problem 1: "Database not configured" error

**Cause**: Missing Supabase environment variables

**Solution**:
1. Check `.env.local` exists in project root
2. Verify all 3 variables are set:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```
3. Restart dev server: `npm run dev`

---

### Problem 2: "Failed to track metric" in console

**Cause**: API endpoint returning error

**Solution**:
1. Open Network tab in DevTools
2. Find POST request to `/api/metrics`
3. Check response body for error message
4. Common causes:
   - Table doesn't exist → Run migration
   - Invalid event_type → Check spelling
   - Missing required fields → Check request body

---

### Problem 3: No events showing in database

**Cause**: RLS policies blocking insert

**Solution**:
1. Check RLS is enabled:
   ```sql
   SELECT tablename, rowsecurity
   FROM pg_tables
   WHERE tablename = 'core_metrics';
   ```
   Should show `rowsecurity = true`

2. Check policies exist:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'core_metrics';
   ```
   Should show 2 policies

3. Test insert directly:
   ```sql
   INSERT INTO core_metrics (session_id, event_type, event_data, cohort)
   VALUES ('test123', 'session_start', '{}', 'TASO2');
   ```
   If this fails, RLS policy is blocking

---

### Problem 4: session_complete not tracked

**Cause**: `beforeunload` may not fire reliably in all browsers

**Solution**: This is expected behavior. Some browsers block `beforeunload` API calls.

**Alternatives**:
- Use Page Visibility API (future enhancement)
- Send beacon API instead of fetch
- Accept some data loss (not critical metric)

**For now**: Acceptable to have incomplete session_complete data

---

### Problem 5: Materialized views are empty

**Cause**: Views not refreshed after inserting data

**Solution**:
```sql
SELECT refresh_core_metrics_views();
```

Then check again:
```sql
SELECT * FROM career_click_rate ORDER BY date DESC LIMIT 5;
```

---

### Problem 6: TypeScript errors in API route

**Cause**: Supabase types not generated yet

**Solution**:
1. Generate types (optional):
   ```bash
   supabase gen types typescript --project-id your-project-ref > lib/database.types.ts
   ```

2. Or keep using type assertion (current approach):
   ```typescript
   const { data, error } = await (supabaseAdmin as any)
     .from('core_metrics')
     .insert({...})
   ```

---

## 📊 Expected Metrics After Test Session

After completing 1 test session with 2 career clicks and "none relevant" feedback:

**Career Click Rate**: 100% (1 session, 1 with clicks)
**Teacher Feedback**: N/A (no ratings yet)
**None Relevant Rate**: 100% (1 session, 1 said "none fit")

These metrics will stabilize as more sessions come in during the pilot.

---

## 🎯 Success Criteria

✅ Migration successful if:
- core_metrics table exists in Supabase
- 3 materialized views exist
- 2 RLS policies active
- 2 helper functions created
- Test event successfully inserted via API
- Events visible in database
- No errors in browser console during test flow

---

## 🚀 Next Steps After Migration

Once migration is complete and tested:

1. ✅ Mark "Run database migration" as completed
2. ✅ Move to "Test metrics tracking in browser"
3. Complete full test flow (5-10 test sessions)
4. Verify all 3 metrics calculate correctly
5. Prepare for teacher pilot (Week 3 Day 2-3)

---

## 📝 Migration Rollback (If Needed)

If you need to undo the migration:

```sql
-- Drop functions
DROP FUNCTION IF EXISTS get_current_week_metrics();
DROP FUNCTION IF EXISTS refresh_core_metrics_views();

-- Drop materialized views
DROP MATERIALIZED VIEW IF EXISTS career_click_rate;
DROP MATERIALIZED VIEW IF EXISTS teacher_feedback_summary;
DROP MATERIALIZED VIEW IF EXISTS none_relevant_rate;

-- Drop table (this will delete all data!)
DROP TABLE IF EXISTS core_metrics;
```

**Warning**: This will permanently delete all tracked metrics data!

---

## 📚 Related Documentation

- Full metrics system overview: [lib/metrics/README.md](../lib/metrics/README.md)
- Setup guide: [scripts/METRICS_SETUP_WEEK3_DAY1.md](./METRICS_SETUP_WEEK3_DAY1.md)
- UI integration: [scripts/UI_INTEGRATION_COMPLETE.md](./UI_INTEGRATION_COMPLETE.md)
- Type definitions: [lib/metrics/types.ts](../lib/metrics/types.ts)

---

**Status**: Ready to execute migration
**Estimated time**: 5-10 minutes (including verification)
**Risk level**: Low (can be rolled back if needed)

**Next action**: Open Supabase dashboard and execute the migration! 🚀
