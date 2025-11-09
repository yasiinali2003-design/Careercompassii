# Site Password Protection Setup

## ✅ What's Implemented

I've added site-wide password protection to your website. Visitors will need to enter a password before accessing the site.

## 🔧 Setup Instructions

### 1. Local Development (.env.local)

Create or update `.env.local` file in your project root:

```env
SITE_PASSWORD=CCYHAHAIKUNZIBBI22!
```

### 2. Vercel Production

Add the environment variable in Vercel:

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Click **Add New**
3. Name: `SITE_PASSWORD`
4. Value: `CCYHAHAIKUNZIBBI22!`
5. Environment: **Production**, **Preview**, **Development** (select all)
6. Click **Save**
7. **Redeploy** your site (Vercel → Deployments → ... → Redeploy)

## 🎯 How It Works

- **Password Page**: Visitors are redirected to `/site-auth` if not authenticated
- **Cookie-based**: Once authenticated, users stay logged in for 30 days
- **Site-wide**: Protects all public pages
- **Exclusions**: 
  - `/teacher/*` routes (have their own authentication)
  - `/admin/*` routes (have their own authentication)
  - `/api/*` routes (needed for functionality)
  - Static assets (`/_next/*`, etc.)

## 🔒 Password

Your site password is: `CCYHAHAIKUNZIBBI22!`

**Important**: Keep this password secure! Store it only in environment variables, never in code.

## ✅ Testing

1. **Test locally**: 
   - Add `SITE_PASSWORD` to `.env.local`
   - Restart dev server: `npm run dev`
   - Visit `http://localhost:3000` - should show password prompt

2. **Test production**:
   - Add `SITE_PASSWORD` to Vercel environment variables
   - Redeploy
   - Visit `https://www.careercompassi.com` - should show password prompt

## 🚫 Disable Password Protection

To temporarily disable password protection:

1. **Local**: Remove or comment out `SITE_PASSWORD` in `.env.local`
2. **Vercel**: Delete the `SITE_PASSWORD` environment variable or set it to empty string

## 📝 Notes

- Password is case-sensitive
- Cookie lasts 30 days (users won't need to re-enter for a month)
- Password prompt has a clean, branded design matching your site
- Redirects users back to the page they tried to visit after authentication



