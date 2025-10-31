#!/bin/bash

# Debug script for teacher login issues

BASE_URL="http://localhost:3000"

echo "🔍 Debugging Teacher Login Issue"
echo "================================="
echo ""

echo "1. Testing teacher generation endpoint..."
RESPONSE=$(curl -s -X POST "$BASE_URL/api/teachers/generate" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Teacher","email":"test@example.com","schoolName":"Test School"}')

echo "Response: $RESPONSE"
echo ""

if echo "$RESPONSE" | grep -q '"success":true'; then
  echo "✅ Teacher generation works!"
  CODE=$(echo "$RESPONSE" | grep -o '"access_code":"[^"]*"' | cut -d'"' -f4)
  echo "   Access Code: $CODE"
else
  echo "❌ Teacher generation failed"
  echo "   This usually means:"
  echo "   1. 'teachers' table doesn't exist in Supabase"
  echo "   2. Or database connection issue"
  echo ""
  echo "   SOLUTION:"
  echo "   1. Go to Supabase Dashboard → SQL Editor"
  echo "   2. Run the SQL from: supabase-teachers-table.sql"
  echo "   3. Then try generating teacher code again"
fi

echo ""
echo "2. Checking environment variables..."
ENV_CHECK=$(curl -s "$BASE_URL/api/test-env")
echo "$ENV_CHECK" | grep -q '"supabaseServiceKey":"✅ Set"' && echo "✅ Supabase service key configured" || echo "❌ Supabase service key missing"

echo ""
echo "💡 Next Steps:"
echo "   1. If teachers table is missing, run SQL script in Supabase"
echo "   2. Generate teacher code at: http://localhost:3000/admin/teachers"
echo "   3. Use that code to login at: http://localhost:3000/teacher/login"



