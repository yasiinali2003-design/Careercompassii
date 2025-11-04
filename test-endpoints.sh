#!/bin/bash

# Test script for CareerCompassi API endpoints
BASE_URL="http://localhost:3000"

echo "🧪 Testing CareerCompassi API Endpoints"
echo "========================================"
echo ""

# Test 1: Health check endpoints
echo "1. Testing health checks..."
echo "   GET /api/classes (health check)..."
curl -s "$BASE_URL/api/classes" | jq -r '.status // .success // "Error"' | head -1
echo ""

# Test 2: Test authentication requirement
echo "2. Testing authentication requirements..."
echo "   GET /api/classes (should require auth)..."
RESPONSE=$(curl -s "$BASE_URL/api/classes")
if echo "$RESPONSE" | grep -q "Not authenticated\|401"; then
    echo "   ✅ Correctly requires authentication"
else
    echo "   ⚠️  May not require authentication properly"
fi
echo ""

# Test 3: Test test page loads
echo "3. Testing test page..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/test")
if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Test page loads (HTTP $HTTP_CODE)"
else
    echo "   ❌ Test page error (HTTP $HTTP_CODE)"
fi
echo ""

# Test 4: Test homepage
echo "4. Testing homepage..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/")
if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Homepage loads (HTTP $HTTP_CODE)"
else
    echo "   ❌ Homepage error (HTTP $HTTP_CODE)"
fi
echo ""

# Test 5: Test teacher login page
echo "5. Testing teacher login page..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/teacher/login")
if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Teacher login page loads (HTTP $HTTP_CODE)"
else
    echo "   ❌ Teacher login page error (HTTP $HTTP_CODE)"
fi
echo ""

echo "✅ Basic endpoint tests completed!"
echo ""
echo "Note: Full authentication tests require cookies from browser login"
echo "      Please test manually in browser for:"
echo "      - Teacher login flow"
echo "      - Class creation"
echo "      - PIN generation"
echo "      - Test taking"
echo "      - Results viewing"




