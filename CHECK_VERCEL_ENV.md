# 🔧 Check Vercel Environment Variables

## The Problem:

Error: "Failed to create class. Make sure the database tables exist."

**Root cause:** Missing or incorrect environment variable in Vercel.

---

## ✅ What You Need to Check:

### Go to Vercel Dashboard:

1. https://vercel.com/dashboard
2. Select your project: **Careercompassii**
3. Go to: **Settings** → **Environment Variables**
4. Check if these are set:

### Required Variables:

1. ✅ `NEXT_PUBLIC_SUPABASE_URL` - Should be set
2. ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Should be set  
3. ❌ `SUPABASE_SERVICE_ROLE_KEY` - **MISSING?**

---

## 🎯 The Issue:

The Teacher Dashboard API uses `supabaseAdmin` which requires:
- `SUPABASE_SERVICE_ROLE_KEY` environment variable

If this is missing, the API returns error.

---

## 🔧 How to Fix:

### Get Your Supabase Keys:

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Go to: **Settings** → **API**
4. Copy:
   - **Project URL** (you probably already have this)
   - **service_role** key (this is what's missing!)

### Add to Vercel:

1. Go to Vercel Dashboard
2. Settings → Environment Variables
3. Add new variable:
   - **Key:** `SUPABASE_SERVICE_ROLE_KEY`
   - **Value:** (paste your service_role key from Supabase)
   - **Environment:** Production, Preview, Development (all)
4. **Save**

### Redeploy:

1. Go to: **Deployments**
2. Click the "..." menu on latest deployment
3. Click: **Redeploy**

---

## ✅ After This:

Teacher Dashboard should work!

Try creating a class again at:
`https://careercompassii.vercel.app/teacher/classes/new`

---

## Still Not Working?

Check Vercel Logs:
1. Vercel Dashboard → **Deployments**
2. Latest deployment → **Functions** → `/api/classes`
3. Look for error messages
4. Share what you see

