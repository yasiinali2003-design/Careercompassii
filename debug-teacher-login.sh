#!/bin/bash

# Debug Teacher Login Issue

BASE_URL="http://localhost:3000"

echo "🔍 Debugging Teacher Login..."
echo "=============================="
echo ""

echo "1. Testing teacher generation..."
GENERATE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/teachers/generate" \
  -H "Content-Type: application/json" \
  -d '{"name":"Debug Test","email":"debug@test.com","schoolName":"Debug School"}')

echo "$GENERATE_RESPONSE" | grep -q '"success":true'
if [ $? -eq 0 ]; then
  CODE=$(echo "$GENERATE_RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('teacher', {}).get('access_code', 'N/A'))" 2>/dev/null)
  echo "✅ Teacher generated!"
  echo "   Access Code: $CODE"
  echo ""
  echo "2. Testing login with code..."
  LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/teacher-auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"password\":\"$CODE\"}")
  
  echo "$LOGIN_RESPONSE" | grep -q '"success":true'
  if [ $? -eq 0 ]; then
    echo "✅ Login successful!"
  else
    echo "❌ Login failed"
    echo "   Response: $LOGIN_RESPONSE"
    echo ""
    echo "   Possible issues:"
    echo "   - Code not found in database"
    echo "   - Code is inactive (is_active = false)"
    echo "   - Case sensitivity (code should be uppercase)"
    echo "   - Database connection issue"
  fi
else
  echo "❌ Failed to generate teacher"
  echo "   Response: $GENERATE_RESPONSE"
  echo ""
  echo "   Check:"
  echo "   - Is teachers table created?"
  echo "   - Is generate_teacher_code() function working?"
fi

echo ""
echo "3. Checking server logs..."
echo "   Check terminal where 'npm run dev' is running"
echo "   Look for: [Teacher Auth] or [API/Teachers] messages"






