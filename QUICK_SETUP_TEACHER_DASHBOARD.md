# 🚀 Quick Setup: Teacher Dashboard

## ⚠️ The Problem:

You got error: **"policy already exists"**

This means the SQL tried to create things that already exist.

---

## ✅ The Fix:

I created a **NEW file**: `supabase-teacher-dashboard-fixed.sql`

This version:
- ✅ Safe to run multiple times
- ✅ Drops old policies before creating new ones
- ✅ Uses `IF NOT EXISTS` for everything
- ✅ Won't crash if policies already exist

---

## 📋 Steps to Fix:

### 1. Copy the Fixed SQL

Open: `supabase-teacher-dashboard-fixed.sql`
Copy ALL the content (lines 1-213)

### 2. Go to Supabase

1. Go to: https://supabase.com/dashboard
2. Select your project: **CareerCompas prod**
3. Go to: **SQL Editor**
4. Click: **New Query**

### 3. Paste and Run

1. Paste the SQL from `supabase-teacher-dashboard-fixed.sql`
2. Click: **Run** (or press Cmd+Return)
3. Wait for: **"Success"** message

---

## 🎯 What Will Happen:

1. ✅ Drops old policies
2. ✅ Creates tables (if they don't exist)
3. ✅ Creates new policies
4. ✅ Creates functions
5. ✅ Grants permissions
6. ✅ Shows success message

---

## 📸 After Running:

You should see:
```
NOTICE: Teacher Dashboard schema created successfully!
Success. No rows returned.
```

Then the Teacher Dashboard will work!

---

## 🧪 Test It:

After running the SQL:

1. Go to: `/teacher/classes/new`
2. Enter teacher ID: "test-teacher"
3. Click: "Luo luokka"
4. Should work now! ✅

---

**That's it!** Just copy-paste the fixed SQL and run it. 

