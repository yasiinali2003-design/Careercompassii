## Core Metrics Tracking System

**Release A Week 3 Day 1**

This directory contains the core metrics tracking system for evaluating recommendation quality.

---

## 📊 The 3 Core Metrics

### 1. **Career Click Rate** (`careerClickRate`)
- **What**: Percentage of users who click on ≥1 recommended career
- **Why**: Measures engagement and relevance of recommendations
- **Target**: ≥60% (students find recommendations interesting enough to explore)

### 2. **Teacher Feedback** (`teacherFeedback`)
- **What**: Teacher ratings (1-5) after OPO session
- **Why**: Teachers are expert evaluators of career guidance quality
- **Target**: ≥4.0 average rating

### 3. **None Relevant Rate** (`noneRelevantRate`)
- **What**: Percentage of sessions where student clicks "Ei mikään näistä sovi"
- **Why**: Direct signal that recommendations missed the mark
- **Target**: ≤15% (most students find at least some careers relevant)

---

## 🏗️ Architecture

### Database Layer
**File**: `supabase/migrations/create_core_metrics_table.sql`

**Table**: `core_metrics`
```sql
- id: UUID
- session_id: TEXT (unique per test session)
- event_type: TEXT (career_click | none_relevant | teacher_feedback | session_start | session_complete)
- event_data: JSONB (event-specific data)
- cohort: TEXT (YLA | TASO2 | NUORI)
- sub_cohort: TEXT (LUKIO | AMIS | NULL)
- created_at: TIMESTAMP
```

**Materialized Views** (for fast analytics):
- `career_click_rate` - Aggregated click rates by cohort/date
- `teacher_feedback_summary` - Average ratings and distribution
- `none_relevant_rate` - Aggregated "none fit" rates

### API Layer
**File**: `app/api/metrics/route.ts`

**Endpoints**:
- `POST /api/metrics` - Track metric events (anonymous, no auth required)
- `GET /api/metrics?start_date=...&end_date=...&cohort=...` - Get metrics summary (authenticated)

### Client Layer
**File**: `lib/metrics/tracking.ts`

**Functions**:
- `trackCareerClick(slug, title, rank, score, category, cohort)` - Track career clicks
- `trackNoneRelevant(careers, cohort, reason?)` - Track "none fit" clicks
- `trackTeacherFeedback(rating, cohort, teacherId?, comments?)` - Track teacher ratings
- `trackSessionStart(careers, categories, cohort)` - Track results page view
- `trackSessionComplete(clickCount, timeOnPage, cohort)` - Track session end

---

## 🔧 Usage Examples

### 1. Track Career Click (in Results Page)

```tsx
import { trackCareerClick, incrementCareerClickCounter } from '@/lib/metrics/tracking';

function CareerCard({ career, rank, cohort, subCohort }) {
  const handleClick = () => {
    // Track the click
    trackCareerClick(
      career.slug,
      career.title,
      rank,
      career.overallScore,
      career.category,
      cohort,
      subCohort
    );

    // Increment counter for session_complete tracking
    incrementCareerClickCounter();

    // Navigate to career details
    router.push(`/careers/${career.slug}`);
  };

  return (
    <div onClick={handleClick}>
      <h3>{career.title}</h3>
      <p>{career.category}</p>
    </div>
  );
}
```

### 2. Track "None Relevant" Button

```tsx
import { trackNoneRelevant } from '@/lib/metrics/tracking';

function NoneRelevantButton({ topCareers, cohort, subCohort }) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [reason, setReason] = useState('');

  const handleClick = () => {
    setShowFeedback(true);
  };

  const handleSubmit = () => {
    const careerSlugs = topCareers.map(c => c.slug);
    trackNoneRelevant(careerSlugs, cohort, subCohort, reason);
    setShowFeedback(false);
  };

  return (
    <>
      <button onClick={handleClick}>
        Ei mikään näistä sovi minulle
      </button>

      {showFeedback && (
        <div>
          <textarea
            placeholder="Miksi ei? (valinnainen)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <button onClick={handleSubmit}>Lähetä</button>
        </div>
      )}
    </>
  );
}
```

### 3. Track Teacher Feedback (in Teacher Dashboard)

```tsx
import { trackTeacherFeedback } from '@/lib/metrics/tracking';

function TeacherFeedbackForm({ cohort, subCohort, teacherId, classId }) {
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');

  const handleSubmit = () => {
    trackTeacherFeedback(
      rating,
      cohort,
      subCohort,
      teacherId,
      classId,
      comments
    );
    alert('Kiitos palautteesta!');
  };

  return (
    <div>
      <h3>Kuinka hyödyllisiä suositukset olivat oppilaille?</h3>
      <div>
        {[1, 2, 3, 4, 5].map(r => (
          <button
            key={r}
            onClick={() => setRating(r)}
            style={{ backgroundColor: rating === r ? 'blue' : 'gray' }}
          >
            {r}
          </button>
        ))}
      </div>
      <textarea
        placeholder="Lisäkommentteja (valinnainen)"
        value={comments}
        onChange={(e) => setComments(e.target.value)}
      />
      <button onClick={handleSubmit}>Lähetä arvio</button>
    </div>
  );
}
```

### 4. Track Session Start (in Results Page)

```tsx
import { trackSessionStart } from '@/lib/metrics/tracking';
import { useEffect } from 'react';

function ResultsPage({ results, cohort, subCohort }) {
  useEffect(() => {
    // Track session start when results load
    const careerSlugs = results.topCareers.map(c => c.slug);
    const categories = [...new Set(results.topCareers.map(c => c.category))];

    trackSessionStart(careerSlugs, categories, cohort, subCohort);
  }, []);

  return (
    <div>
      {/* Results UI */}
    </div>
  );
}
```

---

## 📈 Analytics Queries

### Get Current Week Summary

```sql
SELECT * FROM get_current_week_metrics();
```

Returns:
```
metric_name             | metric_value | total_count
-----------------------|--------------|------------
career_click_rate      |        67.50 |          40
teacher_feedback_avg   |         4.20 |           5
none_relevant_rate     |        12.50 |          40
```

### Get Metrics by Cohort (Last 7 Days)

```sql
-- Career Click Rate by Cohort
SELECT cohort, sub_cohort, SUM(total_sessions), AVG(click_rate_percentage)
FROM career_click_rate
WHERE date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY cohort, sub_cohort;

-- Teacher Feedback by Cohort
SELECT cohort, sub_cohort, AVG(average_rating), SUM(total_ratings)
FROM teacher_feedback_summary
WHERE date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY cohort, sub_cohort;

-- None Relevant Rate by Cohort
SELECT cohort, sub_cohort, SUM(total_sessions), AVG(none_relevant_percentage)
FROM none_relevant_rate
WHERE date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY cohort, sub_cohort;
```

### Refresh Materialized Views

```sql
-- Call this after significant data changes or on a schedule (e.g., every hour)
SELECT refresh_core_metrics_views();
```

---

## 🎯 Success Criteria for Release A

After Week 3 pilot (2-3 teachers, ~40-60 students):

**Baseline Targets**:
- ✅ Career Click Rate: ≥50% (acceptable for launch)
- ✅ Teacher Feedback: ≥3.5 average (acceptable for launch)
- ✅ None Relevant Rate: ≤20% (acceptable for launch)

**Goal Targets** (after Release B improvements):
- 🎯 Career Click Rate: ≥60%
- 🎯 Teacher Feedback: ≥4.0
- 🎯 None Relevant Rate: ≤15%

---

## 🔄 Maintenance

### Refresh Schedule
Set up a cron job to refresh materialized views:

```sql
-- Option 1: Hourly refresh (low traffic)
SELECT cron.schedule('refresh-metrics', '0 * * * *', $$
  SELECT refresh_core_metrics_views();
$$);

-- Option 2: Every 15 minutes (higher traffic)
SELECT cron.schedule('refresh-metrics', '*/15 * * * *', $$
  SELECT refresh_core_metrics_views();
$$);
```

### Data Retention
Core metrics are lightweight. No need to delete old data (useful for long-term trend analysis).

If needed, archive data older than 1 year:
```sql
-- Archive to separate table
INSERT INTO core_metrics_archive SELECT * FROM core_metrics WHERE created_at < NOW() - INTERVAL '1 year';
DELETE FROM core_metrics WHERE created_at < NOW() - INTERVAL '1 year';
```

---

## 📝 Type Definitions

See `types.ts` for full TypeScript definitions:
- `MetricsEvent` - Base event structure
- `CareerClickData` - Career click event data
- `NoneRelevantData` - "None fit" event data
- `TeacherFeedbackData` - Teacher rating event data
- `SessionStartData` - Session start event data
- `SessionCompleteData` - Session complete event data
- `MetricsSummary` - Aggregated metrics summary

---

## 🚀 Deployment Checklist

Before deploying metrics tracking:

1. ✅ Run database migration: `create_core_metrics_table.sql`
2. ✅ Verify table exists: `SELECT * FROM core_metrics LIMIT 1;`
3. ✅ Test API endpoint: `POST /api/metrics` with sample data
4. ✅ Add tracking to results page (session_start, career_click)
5. ✅ Add "Ei mikään näistä sovi" button to results page
6. ✅ Add teacher feedback form to teacher dashboard
7. ✅ Set up materialized view refresh schedule
8. ✅ Create analytics dashboard for teachers/admins

---

## 🎓 Next Steps (Week 3 Day 2-5)

**Day 2-3**: Use metrics during pilot
- Teachers use feedback form after each OPO session
- Monitor career click rates in real-time
- Track "none fit" rate to identify problem cases

**Day 4**: Analyze pilot metrics
- Which cohorts have low click rates?
- Which careers are clicked most/least?
- What feedback did teachers provide?

**Day 5**: Deploy Release A
- Metrics tracking live in production
- Monitor metrics dashboard weekly
- Use data to plan Release B improvements
