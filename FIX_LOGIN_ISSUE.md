# 🔧 Fix Login Issue - Quick Solution

## Problem
Login shows: **"Sisäänkirjautuminen epäonnistui"** (Login failed)

## Root Cause
The `teachers` table doesn't exist in your Supabase database yet.

---

## ✅ Solution (5 minutes)

### Step 1: Open Supabase Dashboard
1. Go to: https://supabase.com/dashboard
2. Select your project

### Step 2: Open SQL Editor
1. Click **"SQL Editor"** in the left sidebar
2. Click **"New query"**

### Step 3: Run This SQL

Copy and paste this entire SQL script:

```sql
-- Teachers table for individual access codes
CREATE TABLE IF NOT EXISTS teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  name TEXT,
  school_name TEXT,
  access_code TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  created_by TEXT
);

-- Index for fast lookups by access code
CREATE INDEX IF NOT EXISTS idx_teachers_access_code ON teachers(access_code) WHERE is_active = true;

-- Enable RLS (Row Level Security)
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything (for API access)
CREATE POLICY "Service role full access on teachers"
  ON teachers
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create function to generate unique access codes
CREATE OR REPLACE FUNCTION generate_teacher_code()
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Generate 8-character alphanumeric code (uppercase)
    new_code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM teachers WHERE access_code = new_code) INTO exists_check;
    
    -- If code is unique, exit loop
    EXIT WHEN NOT exists_check;
  END LOOP;
  
  RETURN new_code;
END;
$$ LANGUAGE plpgsql;
```

### Step 4: Run the Query
1. Click **"Run"** button (or press Cmd/Ctrl + Enter)
2. Wait for "Success" message
3. ✅ Table created!

---

## ✅ Step 5: Generate Teacher Code

1. Go to: http://localhost:3000/admin/teachers
2. Fill in the form:
   - **Name:** Test Teacher
   - **Email:** test@example.com (optional)
   - **School:** Test School (optional)
3. Click **"Luo opettajakoodi"**
4. ✅ Copy the **access code** (8-digit code like `A1B2C3D4`)

---

## ✅ Step 6: Login

1. Go to: http://localhost:3000/teacher/login
2. Enter the **access code** you just generated
3. Click **"Kirjaudu sisään"**
4. ✅ Should redirect to `/teacher/classes`!

---

## 🧪 Verify It Works

Run this command to test:

```bash
./debug-login.sh
```

Should now show:
- ✅ Teacher generation works!
- ✅ Access code generated

---

## 🔍 If Still Not Working

### Check 1: Verify Table Exists

Run this in Supabase SQL Editor:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'teachers';
```

**Expected:** Should return 1 row with `teachers`

### Check 2: Verify RPC Function Exists

```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name = 'generate_teacher_code';
```

**Expected:** Should return 1 row

### Check 3: Check Server Logs

In terminal where `npm run dev` is running, look for:
- `[API/Teachers] Error creating teacher:` - shows specific error
- `[Teacher Auth] Teacher lookup failed:` - shows why login failed

---

## 📝 Quick Reference

**Files:**
- SQL Script: `supabase-teachers-table.sql`
- Debug Script: `debug-login.sh`

**URLs:**
- Generate Teacher: http://localhost:3000/admin/teachers
- Teacher Login: http://localhost:3000/teacher/login
- Classes Page: http://localhost:3000/teacher/classes

---

**After fixing, you'll be able to:**
✅ Generate teacher codes  
✅ Login with codes  
✅ Access teacher dashboard  
✅ Create classes and manage students  

**Status:** Once you run the SQL, everything should work! 🎉






