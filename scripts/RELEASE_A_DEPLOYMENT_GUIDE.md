# Release A: Deployment Guide

**Date**: 2026-02-17
**Release**: Release A - Foundation & Trust
**Status**: Ready for production deployment

---

## 🎯 Release A Overview

### What This Release Delivers

**Core Value Proposition**: Trustworthy career recommendations that match Finnish education system

**Key Improvements from Baseline**:
1. ✅ **No senior titles** for young students (YLA/TASO2)
2. ✅ **Education path filtering** (LUKIO prefers university, AMIS prefers vocational)
3. ✅ **Diversity in recommendations** (max 2 per career family)
4. ✅ **Core metrics tracking** (career click rate, none relevant rate, teacher feedback)

**Target Users**:
- 13-15 year olds (YLA - peruskoulun yläaste)
- 16-19 year olds (TASO2 - lukio & ammattikoulu)
- 20-25 year olds (NUORI - nuoret aikuiset)

---

## 📋 Pre-Deployment Checklist

### Phase 1: Code Quality Verification

#### 1.1 TypeScript Compilation

```bash
npm run build
```

**Expected output**:
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
```

**✅ Pass criteria**: No TypeScript errors, build completes successfully

---

#### 1.2 Test Suite (if applicable)

```bash
npm run test
```

**Expected**: All tests pass (or skip if no tests yet)

---

#### 1.3 Code Linting

```bash
npm run lint
```

**Expected output**:
```
✓ No ESLint warnings or errors
```

**✅ Pass criteria**: No linting errors

---

### Phase 2: Functional Testing

#### 2.1 Test All 3 Cohorts

**Test YLA (13-15 year olds)**:
1. Navigate to http://localhost:3000/test
2. Select "Peruskoulun yläaste (13-15v)"
3. Complete test with any answers
4. Verify results page shows:
   - ✅ 5 career recommendations
   - ✅ No senior titles (johtaja, päällikkö, CTO, etc.)
   - ✅ Entry-level careers only
5. Check browser console for errors: **NONE**

**Test TASO2 LUKIO (16-19, academic track)**:
1. Navigate to http://localhost:3000/test
2. Select "Toisen asteen opiskelija (16-19v)" → "Lukio"
3. Complete test
4. Verify results page shows:
   - ✅ 5 career recommendations
   - ✅ No amis-only careers (check education tags)
   - ✅ University/AMK paths preferred
   - ✅ Max 2 careers from same family
5. Check console: **NO ERRORS**

**Test TASO2 AMIS (16-19, vocational track)**:
1. Navigate to http://localhost:3000/test
2. Select "Toisen asteen opiskelija (16-19v)" → "Ammattikoulu"
3. Complete test
4. Verify results page shows:
   - ✅ 5 career recommendations
   - ✅ Vocational paths prioritized
   - ✅ University-only careers penalized
   - ✅ Diversity rule applied
5. Check console: **NO ERRORS**

**Test NUORI (20-25 year olds)**:
1. Navigate to http://localhost:3000/test
2. Select "Nuori aikuinen (20-25v)"
3. Complete test
4. Verify results page shows:
   - ✅ 5 career recommendations
   - ✅ Entry + mid-level careers allowed
   - ✅ No education filtering (all paths shown)
5. Check console: **NO ERRORS**

---

#### 2.2 Test Metrics Tracking

**Session start tracking**:
1. Complete test, reach results page
2. Open DevTools → Console
3. Verify: `[metrics] Tracked session_start`
4. Check Network tab: POST to /api/metrics returns 200 OK

**Career click tracking**:
1. Click "Tutustu uraan" button on career #1
2. Verify console: `[metrics] Tracked career_click`
3. Click "Näytä koulutuspolut" link on career #2
4. Verify console: Second career_click event

**None relevant tracking**:
1. Scroll to bottom, click "Ei mikään näistä sovi minulle"
2. Enter feedback: "Test feedback"
3. Click "Lähetä palaute"
4. Verify console: `[metrics] Tracked none_relevant`
5. Verify UI: Shows "✓ Kiitos palautteesta!"

**Session complete tracking**:
1. Close results page tab
2. Check Network tab (before closing DevTools): POST to /api/metrics with session_complete

---

#### 2.3 Verify Database Events

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

**Expected**: Recent events from test sessions (all 4 event types present)

---

#### 2.4 Test Edge Cases

**Empty state**:
1. Manually trigger empty careers array (if possible)
2. Verify: "Ei ammattisuosituksia saatavilla" message shows

**Missing cohort data**:
1. Test without education path selected
2. Verify: System handles gracefully (no crashes)

**Network errors**:
1. Turn off network
2. Click career card
3. Verify: Metrics fail silently (no user-facing errors)

---

### Phase 3: Performance Verification

#### 3.1 Lighthouse Score

**Run Lighthouse audit**:
1. Open DevTools → Lighthouse tab
2. Select "Desktop" mode
3. Run audit on results page
4. Target scores:
   - Performance: ≥80
   - Accessibility: ≥90
   - Best Practices: ≥90
   - SEO: ≥80

**Note**: Exact scores depend on deployment environment

---

#### 3.2 Page Load Time

**Test results page load**:
1. Complete test, measure time to results page
2. Target: ≤3 seconds from submit to rendered results
3. Check Network tab → DOMContentLoaded

---

### Phase 4: Security Verification

#### 4.1 Environment Variables

**Verify .env.local is NOT committed**:
```bash
git status
```

**Expected**: `.env.local` NOT in staged files

**Verify .gitignore includes**:
```bash
cat .gitignore | grep .env.local
```

**Expected**: `.env.local` is listed

---

#### 4.2 Supabase RLS Policies

**In Supabase dashboard**, verify:

**core_metrics table**:
- ✅ RLS enabled
- ✅ Anonymous INSERT policy active
- ✅ Authenticated SELECT policy active
- ✅ No public SELECT policy (data privacy)

**Check with**:
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'core_metrics';
```

**Expected**: `rowsecurity = true`

---

#### 4.3 API Endpoint Security

**Test anonymous access**:
```bash
# Should succeed (anonymous can INSERT)
curl -X POST http://localhost:3000/api/metrics \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test",
    "event_type": "session_start",
    "event_data": {},
    "cohort": "TASO2"
  }'
```

**Expected**: 200 OK response

**Test unauthenticated GET**:
```bash
# Should fail or return limited data (authentication required)
curl http://localhost:3000/api/metrics
```

**Expected**: 401 Unauthorized or empty data (no sensitive info leaked)

---

### Phase 5: Data Integrity

#### 5.1 Verify Career Count

**Check total careers**:
```bash
grep -c "slug:" data/careers-fi.ts
```

**Expected**: 617 careers

---

#### 5.2 Verify Metadata Coverage

**Check careerLevel coverage**:
```bash
grep -c "careerLevel:" data/careers-fi.ts
```

**Expected**: 617 (all careers have level)

**Check education_tags coverage**:
```bash
grep -c "education_tags:" data/careers-fi.ts
```

**Expected**: 617 (all careers have tags)

---

#### 5.3 Sample Career Verification

**Check a senior career is tagged correctly**:
```bash
grep -A 5 "toimitusjohtaja" data/careers-fi.ts | grep careerLevel
```

**Expected**: `careerLevel: 'senior'`

**Check an entry career is tagged correctly**:
```bash
grep -A 5 "ohjelmistokehittaja" data/careers-fi.ts | grep careerLevel
```

**Expected**: `careerLevel: 'entry'` or `'mid'`

---

### Phase 6: Regression Testing

#### 6.1 Verify Personality Detection Still Works

**Test Creative + Tech profile**:
1. Complete test emphasizing:
   - High creativity scores
   - High technology scores
   - High hands-on scores
2. Verify top 5 includes:
   - ✅ At least 1 creative career
   - ✅ At least 1 tech career
   - ✅ Careers match personality type

**Test Helper profile**:
1. Complete test emphasizing:
   - High people-oriented scores
   - High helping/impact scores
2. Verify top 5 includes:
   - ✅ At least 1 helper career (nurse, teacher, counselor)
   - ✅ No purely technical careers

---

#### 6.2 Verify Boost Pools Still Work

**Check Creative_Leader pool**:
1. Answer questions to trigger Creative_Leader personality
2. Verify top 5 recommendations
3. Expected: Careers from creative + leadership intersection
4. **Verify NO senior titles**: No "markkinointijohtaja", "brändijohtaja", etc.

---

### Phase 7: Documentation Review

#### 7.1 README Accuracy

**Check README.md**:
- ✅ Project description accurate
- ✅ Setup instructions work
- ✅ Environment variables documented
- ✅ No outdated information

---

#### 7.2 Code Comments

**Verify critical sections have comments**:
- ✅ scoringEngine.ts - personality detection logic
- ✅ scoringEngine.ts - education filtering logic
- ✅ scoringEngine.ts - diversity rule logic
- ✅ API endpoints - authentication/authorization notes

---

## 🚀 Deployment Steps

### Option 1: Vercel Deployment (Recommended)

#### Step 1: Prepare Repository

**Commit all changes**:
```bash
git status
git add .
git commit -m "Release A: Foundation & Trust - Ready for production"
git push origin main
```

---

#### Step 2: Configure Vercel Project

**In Vercel Dashboard**:
1. Go to https://vercel.com/dashboard
2. Select your project (or create new from GitHub)
3. Go to Settings → Environment Variables
4. Add production environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```
5. Select environment: **Production**
6. Click "Save"

---

#### Step 3: Configure Build Settings

**In Vercel → Settings → General**:
- Framework Preset: **Next.js**
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`
- Node.js Version: **18.x** (or latest LTS)

---

#### Step 4: Deploy

**Option A: Automatic deploy (recommended)**:
1. Push to `main` branch
2. Vercel auto-deploys
3. Wait for build to complete (~2-5 minutes)
4. Verify deployment at https://your-project.vercel.app

**Option B: Manual deploy**:
1. In Vercel dashboard, click "Deployments"
2. Click "Deploy" button
3. Select branch: `main`
4. Click "Deploy"

---

#### Step 5: Verify Production Deployment

**Test production site**:
1. Visit https://your-project.vercel.app/test
2. Complete test as TASO2/LUKIO
3. Verify results page loads
4. Check browser console: **NO ERRORS**
5. Verify metrics tracking works (check Supabase)

---

#### Step 6: Run Production Smoke Tests

**Quick smoke test checklist**:
- [ ] Homepage loads
- [ ] Test page loads (all cohorts)
- [ ] Results page renders correctly
- [ ] Career detail pages load
- [ ] Metrics tracking works
- [ ] No console errors
- [ ] HTTPS certificate valid

---

### Option 2: Custom Server Deployment

#### Prerequisites

- Node.js 18+ installed on server
- PM2 or similar process manager
- Nginx or similar reverse proxy
- SSL certificate (Let's Encrypt)

#### Step 1: Build for Production

```bash
npm run build
```

---

#### Step 2: Start Production Server

**Using PM2**:
```bash
pm2 start npm --name "careercompassi" -- start
pm2 save
pm2 startup
```

**Using direct Node**:
```bash
NODE_ENV=production npm start
```

---

#### Step 3: Configure Nginx

**Example config** (`/etc/nginx/sites-available/careercompassi`):
```nginx
server {
    listen 80;
    server_name your-domain.fi;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.fi;

    ssl_certificate /etc/letsencrypt/live/your-domain.fi/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.fi/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

#### Step 4: Enable SSL

```bash
sudo certbot --nginx -d your-domain.fi
```

---

## 📊 Post-Deployment Verification

### Immediate Checks (5 minutes)

**1. Homepage loads**:
- Visit https://your-domain.fi
- Verify: No errors, page renders

**2. Test flow works**:
- Visit https://your-domain.fi/test
- Complete test
- Verify: Results page loads with 5 careers

**3. Metrics tracking works**:
- Complete test
- Check Supabase → core_metrics table
- Verify: New session_start event appears

**4. No console errors**:
- Open DevTools → Console
- Verify: No red errors

---

### 24-Hour Monitoring

**Metrics to watch**:
- [ ] Page load time (≤3 seconds)
- [ ] Error rate (≤1%)
- [ ] Metrics API success rate (≥95%)
- [ ] User engagement (career click rate ≥50%)

**Check Vercel Analytics** (or server logs):
- Request count
- Error count
- Response times

**Check Supabase Metrics**:
```sql
-- Count events in last 24 hours
SELECT
  event_type,
  COUNT(*) as event_count
FROM core_metrics
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY event_type;
```

**Expected after first day** (assuming 10-20 users):
- session_start: 10-20
- career_click: 5-15
- none_relevant: 0-5
- session_complete: 8-18

---

### 1-Week Monitoring

**Weekly metrics review**:
```sql
SELECT * FROM get_current_week_metrics();
```

**Target metrics**:
- Career click rate: ≥60%
- None relevant rate: ≤15%
- Teacher feedback: ≥4.0 (if collected)

**If metrics below target**:
1. Review pilot feedback
2. Check which careers are clicked most/least
3. Identify missing careers
4. Plan Release B improvements

---

## 🐛 Troubleshooting Production Issues

### Issue 1: Build Fails on Vercel

**Error**: TypeScript compilation error

**Solution**:
1. Run `npm run build` locally
2. Fix TypeScript errors
3. Commit and push
4. Redeploy

---

### Issue 2: Environment Variables Not Working

**Error**: "Database not configured" in production

**Solution**:
1. Verify environment variables in Vercel dashboard
2. Check variable names match exactly
3. Redeploy after saving variables

---

### Issue 3: Metrics Not Tracking

**Error**: No events in Supabase core_metrics table

**Debug steps**:
1. Check Network tab: Are POST requests being sent?
2. Check response: Is API returning 200 OK?
3. Check Supabase RLS policies: Are they active?
4. Check environment variables: Are they set correctly?

**Fix**: Run this in Supabase SQL Editor:
```sql
-- Check if table exists
SELECT COUNT(*) FROM core_metrics;

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'core_metrics';

-- Test direct insert
INSERT INTO core_metrics (session_id, event_type, event_data, cohort)
VALUES ('test', 'session_start', '{}', 'TASO2');
```

---

### Issue 4: Slow Page Load

**Error**: Results page takes >5 seconds to load

**Debug**:
1. Check Vercel Function logs for timeout errors
2. Check if scoring algorithm is taking too long
3. Verify career vector calculations are cached

**Temporary fix**:
```typescript
// In scoringEngine.ts, add timing logs
console.time('scoring');
const results = generateRecommendations(...);
console.timeEnd('scoring');
```

**Long-term fix**: Optimize scoring algorithm or pre-compute vectors

---

### Issue 5: CORS Errors

**Error**: Browser console shows CORS errors

**Solution**: Add CORS headers in `next.config.js`:
```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
        ],
      },
    ];
  },
};
```

---

## 📋 Rollback Plan

### If Critical Issues Found

**Immediate rollback** (Vercel):
1. Go to Vercel → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"
4. Verify rollback successful

**If using custom server**:
```bash
# Stop current version
pm2 stop careercompassi

# Checkout previous version
git checkout <previous-commit-hash>
npm install
npm run build

# Restart
pm2 restart careercompassi
```

---

## ✅ Release A Deployment Checklist

**Pre-Deployment** (Local):
- [ ] TypeScript compiles (`npm run build`)
- [ ] All 3 cohorts tested locally
- [ ] Metrics tracking verified
- [ ] No console errors
- [ ] Edge cases handled
- [ ] Security verified (RLS, env vars)
- [ ] Data integrity checked (617 careers, all tagged)

**Deployment**:
- [ ] Code committed and pushed
- [ ] Environment variables set in Vercel/server
- [ ] Build settings configured
- [ ] Deployment triggered
- [ ] Build completed successfully

**Post-Deployment**:
- [ ] Production site loads
- [ ] Test flow works end-to-end
- [ ] Metrics tracking works
- [ ] No console errors
- [ ] HTTPS certificate valid
- [ ] 24-hour monitoring started

**1-Week Follow-up**:
- [ ] Review weekly metrics
- [ ] Check teacher feedback
- [ ] Document any issues
- [ ] Plan Release B improvements

---

## 🎯 Success Criteria

**Release A is successful if**:
- ✅ Site loads without errors
- ✅ All 3 cohorts can complete test
- ✅ Career click rate ≥60%
- ✅ None relevant rate ≤15%
- ✅ Teacher feedback ≥4.0
- ✅ No senior titles shown to YLA students
- ✅ Education filtering works correctly
- ✅ Metrics tracking operational

---

## 📚 Related Documentation

- [WEEK3_DAY1_COMPLETE.md](./WEEK3_DAY1_COMPLETE.md) - Metrics setup
- [BROWSER_TEST_CHECKLIST.md](./BROWSER_TEST_CHECKLIST.md) - Testing guide
- [RUN_MIGRATION_GUIDE.md](./RUN_MIGRATION_GUIDE.md) - Database migration
- [UI_INTEGRATION_COMPLETE.md](./UI_INTEGRATION_COMPLETE.md) - UI integration

---

**Next**: Deploy to production and monitor! 🚀

**After Release A**: Plan Release B improvements based on pilot data
