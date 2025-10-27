# 🔍 How to Check Vercel Logs for Teacher Dashboard Error

## Steps to Diagnose:

### 1. Go to Vercel Dashboard
https://vercel.com/dashboard

### 2. Select Your Project
Careercompassii

### 3. Go to "Functions" Tab
Look for errors in the `/api/classes` function

### 4. OR Check Runtime Logs
- Look for any red error messages
- Copy and share them with me

---

## What to Look For:

Errors like:
- "relation classes does not exist"
- "permission denied"
- "authentication failed"
- "invalid token"

---

## Quick Fix to Try:

### Option 1: Check if Tables Exist

Go to Supabase SQL Editor and run:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'classes';
```

**Expected:** Should return 1 row with table_name = 'classes'

**If it returns 0 rows:** Tables don't exist, we need to re-run the SQL

**If it returns 1 row:** Tables exist, problem is elsewhere

---

Share what you find in Vercel logs or Supabase query results!

