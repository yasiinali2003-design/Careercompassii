#!/bin/bash
# Vercel Deployment Script
echo "🔍 Checking build..."
npm run build

if [ $? -eq 0 ]; then
  echo "✅ Build successful!"
  echo "📤 Attempting Vercel deployment..."
  echo ""
  echo "If you need to login to Vercel, run: npx vercel login"
  echo "Then run: npx vercel --prod"
else
  echo "❌ Build failed. Fix errors before deploying."
  exit 1
fi
