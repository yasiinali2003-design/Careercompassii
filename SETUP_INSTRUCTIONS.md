# Rate Limiting & Question Shuffle Setup

## ✅ Implementation Complete

### What Was Added:

1. **Rate Limiting (GDPR-Compliant)**
   - `lib/rateLimit.ts` - Rate limiting with hashed IP addresses
   - Limits: 10 tests/hour, 50 tests/day per IP
   - Stores hashed IPs in Supabase (no PII)

2. **Question Shuffle**
   - `lib/questionShuffle.ts` - Shuffle utility functions
   - `components/CareerCompassTest.tsx` - Questions shuffled on load
   - `app/api/score/route.ts` - Unshuffles answers before scoring

---

## 🚀 Deployment Steps

### Step 1: Create Rate Limits Table in Supabase

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to SQL Editor
4. Create a new query
5. Copy and paste the SQL from `supabase-rate-limits-table.sql`
6. Run the query

This creates the `rate_limits` table needed for tracking.

---

### Step 2: Add Environment Variable (Optional)

For extra security, you can set a custom salt for hashing:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add new variable:
   - **Name:** `RATE_LIMIT_SALT`
   - **Value:** (generate a random string, e.g., `openssl rand -hex 32`)
3. Redeploy

**Note:** If not set, a default salt is used. Setting a custom one is more secure.

---

### Step 3: Test Locally

```bash
# Test rate limiting
npm run dev

# Try submitting test multiple times quickly
# Should see rate limit after 10 requests in 1 hour
```

---

### Step 4: Deploy to Vercel

```bash
# Commit changes
git add .
git commit -m "Add rate limiting and question shuffle"
git push origin main

# Vercel will auto-deploy
```

---

## 🧪 How It Works

### Rate Limiting Flow:

```
1. User submits test → API receives request
2. Extract IP address → Hash with SHA-256 + salt
3. Check Supabase for existing requests (last 24h)
4. Count: Last hour, Last 24 hours
5. If < limits: Allow, record request
6. If >= limits: Return HTTP 429 (Too Many Requests)
```

### Question Shuffle Flow:

```
Frontend:
1. User selects cohort (YLA/TASO2/NUORI)
2. Questions shuffled using Fisher-Yates algorithm
3. Mapping stored: [shuffled position → original index]
4. Hash key generated for verification

Backend:
1. Receives shuffled answers + mapping + key
2. Verifies shuffle key
3. Unshuffles answers back to original order
4. Processes with existing scoring algorithm
5. Returns results
```

---

## 📊 Monitoring

### Check Rate Limits in Supabase:

```sql
-- View recent rate limit activity
SELECT 
  hashed_ip,
  COUNT(*) as request_count,
  MIN(created_at) as first_request,
  MAX(created_at) as last_request
FROM rate_limits
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY hashed_ip
ORDER BY request_count DESC;
```

### Clean Up Old Records:

```sql
-- Delete records older than 7 days
DELETE FROM rate_limits
WHERE created_at < NOW() - INTERVAL '7 days';
```

---

## 🎯 Configuration

### Adjust Rate Limits:

Edit `lib/rateLimit.ts`:

```typescript
const RATE_LIMIT_CONFIG = {
  maxRequestsPerHour: 10, // Change this
  maxRequestsPerDay: 50,  // Change this
  windowHours: 1,
  windowDays: 24
};
```

### Disable Rate Limiting (if needed):

In `app/api/score/route.ts`, comment out:

```typescript
// Check rate limit (GDPR-compliant hashed IP)
// const rateLimitCheck = await checkRateLimit(request);
// if (rateLimitCheck) {
//   return NextResponse.json(...);
// }
```

---

## 🔒 Privacy & GDPR

### What We Store:
- ✅ Hashed IP addresses (SHA-256)
- ✅ Timestamps
- ✅ No personal information
- ✅ No identifiable data

### What We Don't Store:
- ❌ Original IP addresses
- ❌ User names
- ❌ Email addresses
- ❌ Any PII (Personally Identifiable Information)

### Compliance:
- GDPR Article 32 (Security of processing)
- Pseudonymization (GDPR Article 4)
- Data minimization (GDPR Article 5)

---

## 🐛 Troubleshooting

### Issue: Rate limiting not working

**Check:**
1. Is `rate_limits` table created in Supabase?
2. Are environment variables set correctly?
3. Check Vercel runtime logs for errors

### Issue: Questions not shuffling

**Check:**
1. Clear browser cache (hard refresh: Cmd+Shift+R)
2. Check browser console for errors
3. Verify shuffle logic in `components/CareerCompassTest.tsx`

### Issue: HTTP 429 errors

**This is expected behavior!** 
- Wait 1 hour after 10 requests
- Or wait 24 hours after 50 requests
- Limits reset automatically

---

## ✅ Testing Checklist

- [ ] Created `rate_limits` table in Supabase
- [ ] Set `RATE_LIMIT_SALT` environment variable (optional)
- [ ] Tested locally: Rate limiting works
- [ ] Tested locally: Questions shuffle correctly
- [ ] Deployed to Vercel
- [ ] Tested on live site
- [ ] Monitored Supabase for rate limit records

---

## 📚 Files Modified

### New Files:
- `lib/rateLimit.ts` - Rate limiting logic
- `lib/questionShuffle.ts` - Shuffle utilities
- `supabase-rate-limits-table.sql` - Database schema
- `SETUP_INSTRUCTIONS.md` - This file

### Modified Files:
- `app/api/score/route.ts` - Added rate limiting and unshuffle
- `components/CareerCompassTest.tsx` - Added question shuffle

---

## 🎉 Done!

Your website now has:
- ✅ GDPR-compliant rate limiting
- ✅ Question shuffle to prevent gaming
- ✅ Professional security measures
- ✅ Production-ready implementation

**Next steps:**
1. Create the rate_limits table in Supabase
2. Deploy to Vercel
3. Test on production
4. Monitor for abuse

---

**Questions? Check Vercel logs or Supabase console for debugging.**

