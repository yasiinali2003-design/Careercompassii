# How to Run the Teachers Table SQL Script

## Step-by-Step Instructions

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Navigate to SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy the SQL Script**
   - Open `supabase-teachers-table.sql` from this project
   - Copy ALL the contents (lines 1-54)

4. **Paste and Run**
   - Paste into the SQL Editor
   - Click "Run" button (or press Cmd/Ctrl + Enter)
   - Wait for "Success" message

5. **Verify Table Created**
   - Go to "Table Editor" in left sidebar
   - You should see a new table called `teachers`
   - It should have these columns:
     - id (UUID)
     - email (text)
     - name (text)
     - school_name (text)
     - access_code (text, unique)
     - is_active (boolean)
     - created_at (timestamp)
     - last_login (timestamp)
     - created_by (text)

6. **Verify Function Created**
   - Go back to "SQL Editor"
   - Click "Functions" tab
   - You should see `generate_teacher_code` function

## What This Creates

✅ `teachers` table - stores individual teacher accounts
✅ `generate_teacher_code()` function - auto-generates unique 8-char codes
✅ Index for fast code lookups
✅ RLS policies for security

## Next Steps After Running SQL

1. Go to `/admin/teachers` page
2. Generate your first teacher code
3. Test login at `/teacher/login`
4. Start creating more teacher codes as needed!

## Troubleshooting

**If you get "relation already exists" error:**
- That's OK! The script uses `IF NOT EXISTS` so it's safe to run multiple times
- Your table already exists, skip to next step

**If RPC function error:**
- The JavaScript fallback will generate codes automatically
- Still works, just uses JS instead of SQL function

