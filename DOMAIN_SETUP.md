# Domain Setup Instructions for careercompassi.com

## Step 1: Connect Domain in Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your project: `careercompassii` (or similar)
3. Go to **Settings** → **Domains**
4. Click **Add Domain**
5. Enter: `careercompassi.com`
6. Also add: `www.careercompassi.com` (click Add again)

## Step 2: Configure DNS Records

You'll need to update DNS records at your domain registrar. Vercel will show you the exact values needed.

**Option A: Using Vercel Nameservers (Recommended)**
- Copy the nameservers Vercel provides
- Go to your domain registrar (where you bought careercompassi.com)
- Update nameservers to Vercel's nameservers

**Option B: Using DNS Records**
Add these DNS records at your registrar:
- **A Record**: `@` → Vercel's IP (Vercel will show this)
- **CNAME Record**: `www` → `cname.vercel-dns.com`

## Step 3: Enable Password Protection

1. In Vercel Dashboard → Your Project → **Settings**
2. Go to **Deployment Protection**
3. Enable **Password Protection**
4. Set a password (e.g., your chosen password)
5. Save

**Note**: Password protection is available on Vercel Pro plan. If you're on Hobby plan, you may need to upgrade.

## Step 4: Verify Setup

1. Wait for DNS propagation (can take up to 48 hours, usually much faster)
2. Check SSL certificate (Vercel provides automatically)
3. Visit `https://careercompassi.com` - you should see password prompt
4. Visit `https://www.careercompassi.com` - should also work

## Step 5: Test

Once connected:
- ✅ Site should prompt for password
- ✅ `robots.txt` should prevent indexing (already added)
- ✅ Noindex meta tags prevent search engines (already added)
- ✅ SSL certificate should be active

## When Ready to Launch

1. Remove password protection in Vercel Dashboard
2. Update `robots.txt` to allow indexing (or remove it)
3. Update metadata in `app/layout.tsx` to allow indexing
4. Submit sitemap to Google Search Console (optional)

## Current Protection

✅ `robots.txt` - Blocks all crawlers
✅ Noindex meta tags - Prevents indexing
⏳ Password protection - To be enabled in Vercel Dashboard
⏳ Domain connection - To be done in Vercel Dashboard

---

**Important**: The actual domain connection and password protection must be done through the Vercel web dashboard as they're not configurable via CLI. I've set up the technical preparation (robots.txt and noindex tags) to help keep it hidden.


