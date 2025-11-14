# Multi-Teacher Access Feature (Premium)

## Overview
Allows Premium schools to have up to 5 teachers collaborating on the same dashboard, sharing classes and analytics.

## Setup Instructions

### 1. Run Database Migration
Execute the SQL migration in your Supabase dashboard:
```bash
# Upload and run: supabase-multi-teacher.sql
```

This creates:
- `schools` table
- `school_teachers` junction table
- Helper functions for queries
- Row Level Security policies

### 2. Verify Tables Created
Check in Supabase that these tables exist:
- `public.schools`
- `public.school_teachers`

### 3. Test Multi-Teacher Feature

#### Creating a School
1. Go to `/teacher/school`
2. Enter school name
3. Click "Luo uusi koulu"
4. You are automatically added as **admin**

#### Inviting Teachers (Premium only)
1. Select your school
2. Enter teacher ID to invite
3. Choose role: Admin, Teacher, or Viewer
4. Click "Lähetä kutsu"

#### Roles
- **Admin**: Can invite/remove teachers, manage school settings
- **Teacher**: Can create classes, view all school data
- **Viewer**: Read-only access to school data

## Package Limits
- **Yläaste**: 1 teacher (single login)
- **Premium**: Up to 5 teachers (collaboration)

## API Endpoints

### GET /api/schools
Get all schools for authenticated teacher
**Response:**
```json
{
  "success": true,
  "schools": [
    {
      "school_id": "uuid",
      "school_name": "Helsinki High School",
      "package": "premium",
      "role": "admin",
      "teacher_count": 3
    }
  ]
}
```

### POST /api/schools
Create a new school
**Request:**
```json
{
  "name": "School Name",
  "package": "yläaste"
}
```

### GET /api/schools/[schoolId]/teachers
Get all teachers in a school

### POST /api/schools/[schoolId]/teachers
Invite a teacher to the school
**Request:**
```json
{
  "newTeacherId": "teacher-id",
  "role": "teacher"
}
```

### DELETE /api/schools/[schoolId]/teachers?teacherId=xxx
Remove a teacher from the school

## Database Schema

### schools
```sql
CREATE TABLE public.schools (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  package TEXT NOT NULL, -- 'free', 'yläaste', 'premium'
  max_teachers INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

### school_teachers
```sql
CREATE TABLE public.school_teachers (
  id UUID PRIMARY KEY,
  school_id UUID REFERENCES schools(id),
  teacher_id TEXT NOT NULL,
  role TEXT NOT NULL, -- 'admin', 'teacher', 'viewer'
  invited_by TEXT,
  joined_at TIMESTAMPTZ
);
```

## Usage Example

### For Schools
1. **Purchase Premium package** (2,000€/year)
2. **Create school** in the dashboard
3. **Invite colleagues** (up to 4 more teachers)
4. **Collaborate** on classes and analytics
5. **Share insights** across the team

### Benefits
- Team collaboration
- Shared workload
- Consistent guidance approach
- Cross-class analytics
- Backup access (if one teacher is absent)

## Future Enhancements
- Email invitations (vs manual teacher ID entry)
- Class assignments (assign specific classes to specific teachers)
- Activity log (see who did what)
- Custom permissions (fine-grained access control)
- School-wide reports (aggregate across all classes)

## Troubleshooting

### "Database not configured" error
- Ensure Supabase connection is working
- Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

### "Cannot add more teachers" error
- Check if school has reached max_teachers limit
- Verify school package is set to 'premium'
- Run: `SELECT * FROM schools WHERE id = 'school-id'`

### "Access denied" error
- Verify teacher is part of the school
- Check role permissions (only admins can invite/remove)

## Security

- Row Level Security (RLS) enforced
- Teachers can only see schools they belong to
- Only admins can modify school membership
- Cannot remove the last admin
- API validates all permissions

## Cost
This feature is **Premium only** (2,000€/year per school).

## Support
For questions: support@urakompassi.com
