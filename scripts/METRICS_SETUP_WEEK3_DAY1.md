# Core Metrics Tracking Setup - Release A Week 3 Day 1

**Date**: 2026-02-17
**Status**: ✅ COMPLETE

---

## Executive Summary

Implemented comprehensive metrics tracking system to evaluate recommendation quality during Week 3 pilot and beyond.

**Result**: Full metrics infrastructure ready for pilot testing with 2-3 teachers.

---

## 🎯 The 3 Core Metrics

### 1. **Career Click Rate** (`careerClickRate`)
**Definition**: Percentage of users who click on ≥1 recommended career

**Why it matters**:
- Direct signal of engagement
- If students don't click, recommendations aren't interesting
- Easy to measure, hard to game

**Success criteria**:
- 🎯 Target: ≥60% (excellent)
- ✅ Acceptable: ≥50% (good enough for Release A)
- ⚠️ Needs work: <50%

---

### 2. **Teacher Feedback** (`teacherFeedback`)
**Definition**: Teacher ratings (1-5) after OPO session

**Why it matters**:
- Teachers are expert evaluators
- Teachers see student reactions firsthand
- Teachers renew licenses based on quality

**Success criteria**:
- 🎯 Target: ≥4.0 average (excellent)
- ✅ Acceptable: ≥3.5 (good enough for Release A)
- ⚠️ Needs work: <3.5

---

### 3. **None Relevant Rate** (`noneRelevantRate`)
**Definition**: Percentage of sessions where student clicks "Ei mikään näistä sovi"

**Why it matters**:
- Direct signal of recommendation failure
- Students rarely say "none fit" if anything resonates
- Identifies edge cases needing improvement

**Success criteria**:
- 🎯 Target: ≤15% (excellent)
- ✅ Acceptable: ≤20% (good enough for Release A)
- ⚠️ Needs work: >20%

---

## 📁 Files Created

### 1. Type Definitions
**File**: `lib/metrics/types.ts` (150 lines)

**Purpose**: TypeScript types for all metrics events and summaries

**Key exports**:
- `MetricsEvent` - Base event structure
- `MetricEventType` - Event type enum
- `CareerClickData`, `NoneRelevantData`, `TeacherFeedbackData` - Event data types
- `MetricsSummary` - Aggregated metrics for dashboard
- `MetricsQuery` - Query parameters for analytics

---

### 2. Database Migration
**File**: `supabase/migrations/create_core_metrics_table.sql` (200 lines)

**Purpose**: Database schema for metrics tracking with materialized views for fast analytics

**Created**:
- ✅ `core_metrics` table - Stores all metric events
- ✅ `career_click_rate` materialized view - Aggregated click rates
- ✅ `teacher_feedback_summary` materialized view - Rating summaries
- ✅ `none_relevant_rate` materialized view - "None fit" rates
- ✅ `refresh_core_metrics_views()` function - Refresh all views
- ✅ `get_current_week_metrics()` function - Quick weekly summary

**Indexes**:
- session_id, event_type, cohort, created_at
- Composite index: (cohort, event_type)
- Materialized view indexes: date, cohort

**RLS Policies**:
- Anonymous users: INSERT only (track metrics)
- Authenticated users: SELECT only (view dashboard)

---

### 3. API Endpoint
**File**: `app/api/metrics/route.ts` (220 lines)

**Purpose**: REST API for tracking and retrieving metrics

**Endpoints**:

#### POST /api/metrics
Track a metric event (anonymous, no auth)

**Request body**:
```json
{
  "session_id": "session_1234567890_abc123",
  "event_type": "career_click",
  "event_data": {
    "career_slug": "ohjelmistokehittaja",
    "career_title": "Ohjelmistokehittäjä",
    "rank": 1,
    "overall_score": 87.5,
    "category": "tekija"
  },
  "cohort": "TASO2",
  "sub_cohort": "LUKIO"
}
```

**Response**:
```json
{
  "success": true,
  "data": { "id": "uuid", ... }
}
```

#### GET /api/metrics?start_date=2026-02-10&end_date=2026-02-17&cohort=TASO2
Get metrics summary (authenticated only)

**Response**:
```json
{
  "success": true,
  "summary": {
    "careerClickRate": {
      "total_sessions": 45,
      "sessions_with_clicks": 32,
      "click_rate": 71.11
    },
    "teacherFeedback": {
      "total_ratings": 3,
      "average_rating": 4.33,
      "rating_distribution": { "1": 0, "2": 0, "3": 0, "4": 2, "5": 1 }
    },
    "noneRelevantRate": {
      "total_sessions": 45,
      "none_relevant_count": 6,
      "none_relevant_rate": 13.33
    },
    "time_period": {
      "start_date": "2026-02-10",
      "end_date": "2026-02-17"
    }
  },
  "raw_events": [...]
}
```

---

### 4. Client-Side Tracking Utilities
**File**: `lib/metrics/tracking.ts` (200 lines)

**Purpose**: Easy-to-use functions for tracking metrics from React components

**Key functions**:

```typescript
// Track career card click
trackCareerClick(slug, title, rank, score, category, cohort, subCohort?)

// Track "None of these fit" button
trackNoneRelevant(careerSlugs, cohort, subCohort?, reason?)

// Track teacher rating
trackTeacherFeedback(rating, cohort, subCohort?, teacherId?, classId?, comments?)

// Track session start (results page view)
trackSessionStart(careerSlugs, categories, cohort, subCohort?)

// Track session complete (user leaves results page)
trackSessionComplete(careersClicked, timeOnPage, cohort, subCohort?)

// Helper: Get or generate session ID
getSessionId()

// Helper: Increment click counter for session tracking
incrementCareerClickCounter()
```

**Session management**:
- Session ID stored in `sessionStorage` (persists across page reloads, cleared on browser close)
- Format: `session_{timestamp}_{random}`
- Unique per test session

---

### 5. Dashboard Component
**File**: `components/MetricsDashboard.tsx` (300 lines)

**Purpose**: Visual dashboard for viewing metrics (for teachers/admins)

**Features**:
- ✅ Real-time metrics display
- ✅ Color-coded status (green/blue/yellow/red)
- ✅ Target thresholds visible
- ✅ Rating distribution chart
- ✅ Summary insights with actionable recommendations
- ✅ Date range filtering
- ✅ Cohort filtering
- ✅ Loading states
- ✅ Error handling

**Status indicators**:
- **Green** (Excellent): Exceeds target
- **Blue** (Good): Meets acceptable threshold
- **Yellow** (Fair): Below acceptable but not critical
- **Red** (Needs Improvement): Critical, action required

**Usage**:
```tsx
import { MetricsDashboard } from '@/components/MetricsDashboard';

<MetricsDashboard
  startDate="2026-02-10"
  endDate="2026-02-17"
  cohort="TASO2"
  subCohort="LUKIO"
/>
```

---

### 6. Documentation
**File**: `lib/metrics/README.md` (400 lines)

**Purpose**: Comprehensive guide for developers and teachers

**Sections**:
- ✅ Overview of 3 core metrics
- ✅ Architecture (database, API, client)
- ✅ Usage examples with code snippets
- ✅ Analytics SQL queries
- ✅ Success criteria and targets
- ✅ Maintenance guide
- ✅ Deployment checklist

---

## 🔧 Implementation Details

### Session Tracking Flow

1. **User completes test** → Redirected to results page
2. **Results page loads** → Call `trackSessionStart(careers, categories, cohort)`
3. **User clicks career card** → Call `trackCareerClick(...)` + `incrementCareerClickCounter()`
4. **User clicks "Ei mikään näistä sovi"** → Show feedback form → Call `trackNoneRelevant(...)`
5. **User leaves page** → Call `trackSessionComplete(clickCount, timeOnPage, cohort)`
6. **Teacher reviews session** → Call `trackTeacherFeedback(rating, ...)`

### Data Flow

```
Client (Results Page)
  ↓
trackCareerClick() / trackNoneRelevant() / trackTeacherFeedback()
  ↓
POST /api/metrics
  ↓
Supabase: core_metrics table
  ↓
Materialized views (refreshed hourly)
  ↓
GET /api/metrics
  ↓
MetricsDashboard component
  ↓
Teacher/Admin sees metrics
```

### Performance Optimization

**Materialized Views**:
- Pre-aggregated metrics for fast queries
- Refresh schedule: Hourly (or every 15 min during pilot)
- Avoids expensive GROUP BY on every dashboard load

**Indexes**:
- `session_id`: Fast lookup for session events
- `event_type`: Fast filtering by metric type
- `cohort`: Fast cohort-specific queries
- `created_at`: Fast time-range queries

**RLS Policies**:
- Anonymous INSERT: Students don't need accounts to track metrics
- Authenticated SELECT: Only teachers/admins see dashboard

---

## 📊 Analytics Capabilities

### Real-Time Queries

```sql
-- Quick summary (all 3 metrics, current week)
SELECT * FROM get_current_week_metrics();

-- Career click rate by cohort (last 7 days)
SELECT cohort, sub_cohort, AVG(click_rate_percentage) as avg_click_rate
FROM career_click_rate
WHERE date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY cohort, sub_cohort;

-- Teacher feedback by date
SELECT date, AVG(average_rating) as avg_rating, SUM(total_ratings) as ratings
FROM teacher_feedback_summary
WHERE date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY date
ORDER BY date DESC;

-- None relevant rate trend
SELECT date, AVG(none_relevant_percentage) as avg_rate
FROM none_relevant_rate
WHERE date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY date
ORDER BY date DESC;
```

### Deep Dive Queries

```sql
-- Which careers are clicked most?
SELECT
  event_data->>'career_slug' as career,
  event_data->>'category' as category,
  COUNT(*) as clicks,
  AVG((event_data->>'rank')::int) as avg_rank
FROM core_metrics
WHERE event_type = 'career_click'
  AND created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY event_data->>'career_slug', event_data->>'category'
ORDER BY clicks DESC
LIMIT 20;

-- Which cohorts have lowest click rates?
SELECT
  cohort,
  sub_cohort,
  ROUND(100.0 *
    COUNT(DISTINCT CASE WHEN event_type = 'career_click' THEN session_id END) /
    NULLIF(COUNT(DISTINCT CASE WHEN event_type = 'session_start' THEN session_id END), 0),
    2
  ) as click_rate
FROM core_metrics
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY cohort, sub_cohort
ORDER BY click_rate ASC;

-- Teacher feedback comments (qualitative)
SELECT
  created_at,
  cohort,
  sub_cohort,
  event_data->>'rating' as rating,
  event_data->>'comments' as comments
FROM core_metrics
WHERE event_type = 'teacher_feedback'
  AND event_data->>'comments' IS NOT NULL
ORDER BY created_at DESC;
```

---

## ✅ Integration Checklist

Before Week 3 Day 2 pilot:

### Database
- [ ] Run migration: `supabase migration up supabase/migrations/create_core_metrics_table.sql`
- [ ] Verify table exists: `SELECT COUNT(*) FROM core_metrics;`
- [ ] Test materialized views: `SELECT * FROM career_click_rate LIMIT 1;`
- [ ] Test helper function: `SELECT * FROM get_current_week_metrics();`

### API
- [ ] Test POST endpoint: Send sample career_click event
- [ ] Test GET endpoint: Retrieve metrics summary
- [ ] Verify anonymous INSERT works (no auth required)
- [ ] Verify authenticated SELECT works (teacher account)

### Client Integration
- [ ] Add `trackSessionStart()` to results page load
- [ ] Add `trackCareerClick()` to career card click handler
- [ ] Add "Ei mikään näistä sovi" button to results page
- [ ] Add `trackSessionComplete()` to page unload
- [ ] Add teacher feedback form to teacher dashboard

### Dashboard
- [ ] Create metrics page for teachers: `/teacher/metrics`
- [ ] Test dashboard with sample data
- [ ] Verify date range filtering works
- [ ] Verify cohort filtering works

### Monitoring
- [ ] Set up materialized view refresh schedule (hourly or every 15min)
- [ ] Set up alerts for critical thresholds (click rate <40%, none relevant >30%)
- [ ] Create weekly report email for admins

---

## 🎯 Success Criteria for Week 3 Pilot

**Pilot Setup** (2-3 teachers, ~40-60 students):
- ✅ All metrics tracking working
- ✅ Dashboard visible to teachers
- ✅ No technical errors

**Baseline Metrics** (acceptable for Release A):
- ✅ Career Click Rate: ≥50%
- ✅ Teacher Feedback: ≥3.5 average
- ✅ None Relevant Rate: ≤20%

**Goal Metrics** (target after Release B):
- 🎯 Career Click Rate: ≥60%
- 🎯 Teacher Feedback: ≥4.0 average
- 🎯 None Relevant Rate: ≤15%

**Data Collection**:
- ✅ ≥30 sessions tracked (enough for statistical significance)
- ✅ ≥3 teacher ratings (one per teacher)
- ✅ Optional: Qualitative feedback from teachers

---

## 📈 Next Steps

### Week 3 Day 2-3: Run Pilot
1. Teachers use system in real OPO sessions
2. Monitor metrics dashboard during pilot
3. Collect teacher feedback forms after each session
4. Document any technical issues

### Week 3 Day 4: Analyze Results
1. Review metrics summary (all 3 core metrics)
2. Identify low-performing cohorts/careers
3. Read teacher feedback comments
4. Determine if missing careers need to be added

### Week 3 Day 5: Deploy Release A
1. Fix any pilot issues
2. Add high-impact missing careers (if needed)
3. Deploy to production
4. Continue monitoring metrics weekly

---

## 🚨 Maintenance

### Scheduled Tasks

**Hourly** (during pilot):
```sql
SELECT refresh_core_metrics_views();
```

**Daily**:
- Check metrics dashboard for anomalies
- Review "none relevant" feedback text

**Weekly**:
- Generate metrics report for stakeholders
- Compare week-over-week trends
- Identify improvement opportunities

### Alerts to Set Up

- **Low Click Rate**: If weekly click rate <40%, email admins
- **High None Relevant**: If weekly none relevant rate >30%, email admins
- **Low Teacher Feedback**: If any rating ≤2, email admins immediately

---

## 🎓 Learning from Metrics

### What High Click Rate Means
- ✅ Students find recommendations engaging
- ✅ Career titles/categories are clear
- ✅ Recommendations span diverse interests

### What Low Click Rate Means
- ⚠️ Recommendations don't resonate
- ⚠️ Students already know these careers (not novel)
- ⚠️ Career titles unclear/intimidating

### What High Teacher Feedback Means
- ✅ Teachers trust the system
- ✅ Students had positive reactions
- ✅ Fits into OPO curriculum well

### What Low Teacher Feedback Means
- ⚠️ Recommendations don't match student reactions
- ⚠️ Technical issues during session
- ⚠️ System feels like "black box" (not explainable)

### What Low None Relevant Rate Means
- ✅ Most students find ≥1 career that fits
- ✅ Filtering logic working correctly
- ✅ Diversity rule preventing over-clustering

### What High None Relevant Rate Means
- ⚠️ Recommendations too narrow/specific
- ⚠️ Cohort filtering too aggressive
- ⚠️ Missing career clusters for certain profiles

---

## 📝 Final Notes

**Why These 3 Metrics?**
- Simple enough to track with <1000 users
- Directly measure recommendation quality
- Actionable (can improve based on data)
- Teachers understand them (not black-box ML metrics)

**Why NOT Track Yet?**
- Conversion funnels (too complex for pilot)
- A/B tests (need ≥1000 users)
- Long-term outcomes (need months of data)
- Detailed personality analysis (premature optimization)

**The Goal**: Ship fast, learn fast, iterate fast.

---

**Status**: ✅ Week 3 Day 1 COMPLETE

**Next**: Week 3 Day 2-3 - Pilot with 2-3 teachers
