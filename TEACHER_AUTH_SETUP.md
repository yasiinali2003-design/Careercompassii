# Teacher Authentication Setup - Individual Codes (Option A)

## Database Setup

1. Run the SQL script in Supabase SQL Editor:
   ```sql
   -- See supabase-teachers-table.sql
   ```

   This creates:
   - `teachers` table to store individual teacher access codes
   - Automatic code generation function
   - Unique constraint on access codes
   - RLS policies for security

## Environment Variables

**Optional (only for fallback if database unavailable):**
```bash
TEACHER_ACCESS_CODE=your-fallback-code-here
```

This is only used if Supabase is not configured. In normal operation, individual codes from the database are used.

## How It Works

1. **Admin creates teacher codes** → Visit `/admin/teachers` page
2. **Fill in teacher info** → Name (required), Email (optional), School (optional)
3. **System generates unique code** → 8-character alphanumeric code
4. **Admin copies and shares code** → Send to teacher via email/SMS/etc.
5. **Teacher logs in** → Uses their individual code at `/teacher/login`
6. **Access granted** → 7-day session cookie set

## Admin Interface

**Location:** `/admin/teachers`

**Features:**
- Generate new teacher access codes
- Copy codes to clipboard
- See teacher information (name, email, school)
- One-time use - generate as many as needed

## Security Features

- ✅ Individual codes per teacher (not shared)
- ✅ Codes stored in database with RLS
- ✅ Active/inactive status tracking
- ✅ Last login timestamp
- ✅ HTTP-only cookies
- ✅ 7-day session expiration
- ✅ Secure flag in production

## Accessing the Admin Page

1. Go to `/admin/teachers` (public access - you may want to protect this later)
2. Fill in teacher details
3. Click "Luo opettajakoodi"
4. Copy the generated code
5. Share with teacher via secure channel

## Future Enhancements

- [ ] Protect admin page with separate admin authentication
- [ ] List all existing teachers
- [ ] Deactivate/reactivate teacher accounts
- [ ] Reset teacher codes
- [ ] Bulk import teachers from CSV
