# Step-by-Step Testing Guide for CareerCompassi

Follow these steps in order to test your website completely.

## 🎯 Prerequisites

✅ **Development server running:** `npm run dev`  
✅ **Environment variables set:** Check `/api/test-env`  
✅ **Database accessible:** Supabase project connected

---

## Step 1: Database Verification ⚠️ CRITICAL

### Option A: Using SQL Editor (Recommended)
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor**
4. Copy and paste contents of `verify-database.sql`
5. Run the query
6. Check all tables show ✅

### Option B: Using Test Script
```bash
# If tsx is installed
npx tsx test-database-connectivity.ts
```

### If Tables Are Missing:
Run these SQL files in Supabase SQL Editor (in order):
1. `supabase-teachers-table.sql` - Creates teachers table
2. `supabase-teacher-dashboard.sql` - Creates classes, pins, results tables
3. `supabase-rate-limits-table.sql` - Creates rate_limits table

---

## Step 2: Generate Test Teacher Account

1. **Open:** http://localhost:3000/admin/teachers
2. **Fill form:**
   - Name: "Test Teacher"
   - Email: "test@example.com"
   - School: "Test School"
3. **Click:** "Luo opettajakoodi"
4. **Copy the access code** (e.g., `10956888`) - You'll need this!
5. ✅ Should see success message with access code

**Expected Result:** Success message with 8-digit access code

---

## Step 3: Test Teacher Login

1. **Open:** http://localhost:3000/teacher/login
2. **Enter access code** from Step 2
3. **Click:** "Kirjaudu sisään"
4. ✅ Should redirect to `/teacher/classes`

**Expected Result:** Redirects to classes page, TeacherNav shows logout button

---

## Step 4: Test Classes Page (NEW FEATURE)

1. **You should be on:** `/teacher/classes`
2. **Check:**
   - ✅ Page loads without errors
   - ✅ Shows "Omat luokat" heading
   - ✅ Either shows "Sinulla ei ole vielä luokkia" OR list of existing classes
   - ✅ "Luo uusi luokka" button visible

**Expected Result:** Page loads, can see create button or existing classes

---

## Step 5: Create a New Class

1. **Click:** "Luo uusi luokka" button
2. **On `/teacher/classes/new`:**
   - Form should auto-fill teacher ID (from cookie)
   - OR manually enter teacher ID if prompted
3. **Click:** "Luo luokka"
4. ✅ Should show:
   - Class ID
   - Class Token (long random string)
   - Public link: `/{classToken}`
5. **Copy the class token** - You'll need it!

**Expected Result:** Class created, see class ID and token

---

## Step 6: Generate PINs for Class

1. **Navigate to:** `/teacher/classes/{classId}` (or click link from Step 5)
2. **Go to:** "PIN-koodit" tab
3. **Click:** "Generoi 10 PIN-koodia" or "Generoi 25 PIN-koodia"
4. ✅ Should see:
   - List of 4-6 character PIN codes
   - Download CSV button
5. **Copy one PIN** (e.g., `A1B2`) - You'll use it for testing!

**Expected Result:** PINs generated and displayed, CSV downloadable

---

## Step 7: Test Name Mapping (GDPR Compliance)

1. **On class page:** Go to "Nimilista" tab
2. **Enter a test name** next to a PIN (e.g., "Test Student")
3. ✅ Check browser DevTools → Network tab:
   - **NO network requests should contain the name**
   - Names should only be in localStorage
4. **Click:** "Vie salattuna" (Export encrypted)
5. ✅ Should prompt for passphrase
6. ✅ Should download encrypted file

**Expected Result:** Names stored only locally, export works

---

## Step 8: Take Test as Student

1. **Open new incognito/private window** (simulate different student)
2. **Go to:** http://localhost:3000/test
3. **Click:** "Aloita testi"
4. **Select cohort:** Choose one (YLA, TASO2, or NUORI)
5. ✅ **Verify question shuffle:**
   - Note order of first few questions
   - Refresh page and start again
   - Questions should be in different order!
6. **Complete test:**
   - Answer all 30 questions
   - When prompted, enter PIN from Step 6
7. ✅ **Submit test**
8. ✅ Should see results page with:
   - Top 3-5 careers
   - Personality analysis
   - Dimension scores

**Expected Result:** Test completes, results shown, PIN validated

---

## Step 9: View Results as Teacher

1. **Go back to teacher window:** `/teacher/classes/{classId}`
2. **Click:** "Tulokset" tab
3. ✅ Should see:
   - Results list with PIN codes
   - Top careers for each result
   - Dates/timestamps
   - If names were mapped, should see names too

**Expected Result:** Results displayed with PINs, dates, career recommendations

---

## Step 10: Test Public Anonymous Link

1. **Copy the public link** from class page: `/{classToken}`
2. **Open in new incognito window**
3. ✅ Should see:
   - Anonymous results table
   - PIN codes
   - Top careers
   - Dates
   - **NO names visible anywhere**

**Expected Result:** Public page shows anonymous results only (GDPR compliant)

---

## Step 11: Test Rate Limiting

1. **Go to:** `/test`
2. **Rapidly submit test** 11 times (use fake/different PINs if needed)
3. ✅ After 10 submissions, should see:
   - HTTP 429 error OR
   - Rate limit message
   - "Too many requests" or similar
4. ✅ After 1 hour OR clearing rate_limits table, should work again

**Expected Result:** Rate limit kicks in after 10 requests/hour

---

## Step 12: Test Question Shuffle (Already Verified in Step 8)

If not done yet:
1. Take test multiple times
2. Note question order varies
3. Scoring still works correctly

---

## Step 13: GDPR Compliance Verification

### Check Network Requests:
1. Open DevTools → Network tab
2. Filter by "results" or "api"
3. Take test and submit
4. ✅ **Verify NO requests contain:**
   - Student names
   - Email addresses
   - Personal identifiers

### Check Database:
1. Go to Supabase → Table Editor
2. Check `results` table
3. ✅ **Verify NO name columns exist**
4. ✅ Only PIN, class_id, result_payload exist

**Expected Result:** Zero PII in network requests or database

---

## Step 14: Test Logout

1. **Click:** "Kirjaudu ulos" in TeacherNav
2. ✅ Should redirect to `/teacher/login`
3. ✅ Try accessing `/teacher/classes` directly
4. ✅ Should redirect back to login (middleware protection)

**Expected Result:** Logout works, routes protected after logout

---

## ✅ Final Checklist

- [ ] All pages load without errors
- [ ] Teacher can login with access code
- [ ] Classes list shows (new feature working!)
- [ ] Can create new classes
- [ ] Can generate PINs
- [ ] Students can take test with PIN
- [ ] Results save correctly
- [ ] Teacher can view results
- [ ] Public link shows anonymous results only
- [ ] Rate limiting works (after 10 requests)
- [ ] Question shuffle works
- [ ] Names never sent to server (GDPR compliant)
- [ ] Logout works correctly

---

## 🐛 If Something Fails

### Common Issues:

1. **"Database tables not created yet"**
   - Run SQL scripts in Supabase

2. **"Not authenticated" errors**
   - Check cookies are being set
   - Verify teacher login worked

3. **"Class not found or access denied"**
   - Verify teacher owns the class
   - Check teacher_id cookie is set

4. **Rate limiting too strict**
   - Clear `rate_limits` table in Supabase
   - OR wait 1 hour for reset

5. **Questions not shuffling**
   - Clear browser cache (Cmd+Shift+R)
   - Check console for errors

---

## 📊 Test Results

Document any issues found:
- [ ] Feature: ______ Issue: ______ Status: ______

---

**Testing Completed:** [Date]  
**Tester:** [Your name]  
**Status:** ✅ All tests passed / ⚠️ Issues found (see notes)


