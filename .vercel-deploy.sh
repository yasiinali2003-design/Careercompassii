#!/bin/bash
# Vercel Deployment Script

if [ -z "$1" ]; then
  echo "❌ Usage: ./vercel-deploy.sh <vercel_token>"
  exit 1
fi

TOKEN=$1

echo "🔍 Building project..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed! Fix errors before deploying."
  exit 1
fi

echo "✅ Build successful!"
echo "🚀 Deploying to Vercel production..."

npx vercel deploy --prod --token "$TOKEN" --yes

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Deployment successful!"
  echo "🌐 Your site is live at: https://careercompassii.vercel.app"
else
  echo "❌ Deployment failed. Check error messages above."
  exit 1
fi
