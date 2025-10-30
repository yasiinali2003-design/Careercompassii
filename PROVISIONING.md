Provisioning teacher codes (Admin-only)

Overview
- Generate teacher access codes in bulk from a CSV when a school purchases a package.
- One code per teacher; send to school-domain emails only.

CSV format
```
name,email,school
Matti Virtanen,matti.virtanen@koulu.fi,Helsingin yläaste
Liisa Laine,liisa.laine@koulu.fi,Helsingin yläaste
```

How to run
1) Ensure `.env.local` contains:
```
NEXT_PUBLIC_SUPABASE_URL=...your supabase url...
SUPABASE_SERVICE_ROLE_KEY=...service role key...
```
2) Save your CSV somewhere (absolute path recommended).
3) Run:
```
node provision-teachers.js /absolute/path/to/teachers.csv
```
4) The script prints created codes and writes `provisioned_teachers_<timestamp>.csv` with results.

Emailing teachers
- Send each teacher their code and the login URL `/teacher/login`.
- Include the setup guide and support email.

Security/controls
- Use school-domain emails.
- Keep the generated summary CSV for audit. Revoke/rotate via `teachers.is_active=false` or by issuing a new code.


