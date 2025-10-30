# 🔍 Debug Login Issue

## Problem
"Sisäänkirjautuminen epäonnistui" - Login failed

## Quick Tests

### Test 1: Check if teachers exist
**I generated a test teacher with code:** `EB3C5133`

Try logging in with this code:
1. Go to: http://localhost:3000/teacher/login
2. Enter: `EB3C5133`
3. Click "Kirjaudu sisään"

---

### Test 2: Check database directly

Run this SQL in Supabase SQL Editor:

```sql
-- Check if teachers exist
SELECT id, name, access_code, is_active 
FROM teachers 
ORDER BY created_at DESC 
LIMIT 10;
```

**If this returns 0 rows:**
- No teachers in database
- Generate a new teacher code via `/admin/teachers`
- Or run SQL to create one manually

---

### Test 3: Verify RPC function exists

Run this in Supabase:

```sql
-- Check if function exists
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name = 'generate_teacher_code';

-- Test function
SELECT generate_teacher_code();
```

**If function doesn't exist:**
- Run just the function creation part from `SETUP_DATABASE.sql`

---

## Common Issues

### 1. Code not in database
**Solution:** Generate teacher via `/admin/teachers` page

### 2. `is_active = false`
**Solution:** Check in Supabase and set to true:
```sql
UPDATE teachers SET is_active = true WHERE access_code = 'YOUR_CODE';
```

### 3. Case sensitivity
- Code should be uppercase
- Login automatically converts to uppercase
- Verify code is stored as uppercase in database

### 4. RPC function missing
If `generate_teacher_code()` doesn't exist, run this:

```sql
CREATE OR REPLACE FUNCTION generate_teacher_code()
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    new_code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 8));
    SELECT EXISTS(SELECT 1 FROM teachers WHERE access_code = new_code) INTO exists_check;
    EXIT WHEN NOT exists_check;
  END LOOP;
  RETURN new_code;
END;
$$ LANGUAGE plpgsql;
```

---

## Manual Teacher Creation

If generation fails, create manually:

```sql
INSERT INTO teachers (name, email, school_name, access_code, is_active)
VALUES ('Test Teacher', 'test@example.com', 'Test School', 'TEST1234', true)
RETURNING id, name, access_code;
```

Then login with code: `TEST1234`

---

## Check Server Logs

In terminal where `npm run dev` is running, look for:
- `[Teacher Auth] Looking up code: ...`
- `[Teacher Auth] Query result: ...`
- `[Teacher Auth] Teacher lookup failed: ...`

These will tell you exactly what's wrong.

