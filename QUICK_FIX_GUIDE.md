# ⚡ Quick Fix - Run SQL Script

## The Problem
Login failed because the `teachers` table doesn't exist in your database.

## ✅ Solution (2 minutes)

### Step 1: Copy SQL Script
The file `SETUP_DATABASE.sql` contains **everything** you need. It's already created in your project!

### Step 2: Open Supabase
1. Go to: **https://supabase.com/dashboard**
2. Click your project
3. Click **"SQL Editor"** in left sidebar
4. Click **"New query"**

### Step 3: Run SQL
1. Open `SETUP_DATABASE.sql` from your project folder
2. **Copy ALL the contents** (Cmd/Ctrl + A, then Cmd/Ctrl + C)
3. **Paste into Supabase SQL Editor** (Cmd/Ctrl + V)
4. Click **"Run"** button (or press Cmd/Ctrl + Enter)
5. Wait for **"Success"** message ✅

### Step 4: Verify
You should see a table at the bottom showing:
- ✅ teachers - ✅ EXISTS
- ✅ classes - ✅ EXISTS
- ✅ pins - ✅ EXISTS
- ✅ results - ✅ EXISTS
- ✅ rate_limits - ✅ EXISTS

### Step 5: Test
1. Go to: **http://localhost:3000/admin/teachers**
2. Generate a teacher code
3. Use that code to login at: **http://localhost:3000/teacher/login**
4. ✅ Should work now!

---

## 🚀 That's It!

The SQL script creates:
- ✅ Teachers table (for login)
- ✅ Classes, Pins, Results tables (for teacher dashboard)
- ✅ Rate limits table (for rate limiting)
- ✅ All indexes and security policies
- ✅ All RPC functions

**Total time: ~2 minutes!**

---

## 🔗 Direct Links

- **Supabase SQL Editor:** https://supabase.com/dashboard/project/_/sql/new
- **Generate Teacher:** http://localhost:3000/admin/teachers
- **Teacher Login:** http://localhost:3000/teacher/login

---

**Status:** Ready to fix! Just run the SQL script. 🎉


