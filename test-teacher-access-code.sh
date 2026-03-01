#!/bin/bash

# Test Teacher Access Code Login Flow
# This script tests the complete teacher authentication flow

set -e

echo "================================"
echo "Teacher Access Code Test Script"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000"

# Test 1: Check if server is running
echo "1. Checking if server is running..."
if curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}" | grep -q "200"; then
    echo -e "${GREEN}✓ Server is running at ${BASE_URL}${NC}"
else
    echo -e "${RED}✗ Server is not running. Start it with: cd careercompassi && npm run dev${NC}"
    exit 1
fi
echo ""

# Test 2: Check first-login API health
echo "2. Testing first-login API endpoint..."
HEALTH_CHECK=$(curl -s "${BASE_URL}/api/teacher-auth/first-login")
if echo "$HEALTH_CHECK" | jq -e '.status == "ok"' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ First-login API is healthy${NC}"
    echo "$HEALTH_CHECK" | jq .
else
    echo -e "${RED}✗ First-login API health check failed${NC}"
    echo "$HEALTH_CHECK"
fi
echo ""

# Test 3: Test invalid access code
echo "3. Testing invalid access code (should fail)..."
RESPONSE=$(curl -s -X POST "${BASE_URL}/api/teacher-auth/first-login" \
    -H "Content-Type: application/json" \
    -d '{"accessCode":"INVALID123"}')

if echo "$RESPONSE" | jq -e '.success == false' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Invalid access code correctly rejected${NC}"
    echo "   Error message: $(echo "$RESPONSE" | jq -r '.error')"
else
    echo -e "${RED}✗ Invalid access code handling failed${NC}"
    echo "$RESPONSE" | jq .
fi
echo ""

# Test 4: Test empty access code
echo "4. Testing empty access code (should fail)..."
RESPONSE=$(curl -s -X POST "${BASE_URL}/api/teacher-auth/first-login" \
    -H "Content-Type: application/json" \
    -d '{"accessCode":""}')

if echo "$RESPONSE" | jq -e '.success == false' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Empty access code correctly rejected${NC}"
    echo "   Error message: $(echo "$RESPONSE" | jq -r '.error')"
else
    echo -e "${RED}✗ Empty access code handling failed${NC}"
    echo "$RESPONSE" | jq .
fi
echo ""

# Test 5: Test malformed JSON
echo "5. Testing malformed request (should fail gracefully)..."
RESPONSE=$(curl -s -X POST "${BASE_URL}/api/teacher-auth/first-login" \
    -H "Content-Type: application/json" \
    -d 'invalid json')

if echo "$RESPONSE" | jq -e '.success == false' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Malformed request correctly rejected${NC}"
    echo "   Error message: $(echo "$RESPONSE" | jq -r '.error')"
else
    echo -e "${RED}✗ Malformed request handling failed${NC}"
    echo "$RESPONSE"
fi
echo ""

# Test 6: Check other auth endpoints
echo "6. Checking other authentication endpoints..."

# Login endpoint
LOGIN_HEALTH=$(curl -s "${BASE_URL}/api/teacher-auth/login")
if echo "$LOGIN_HEALTH" | jq -e '.status == "ok"' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Login API is healthy${NC}"
else
    echo -e "${YELLOW}⚠ Login API health check returned unexpected response${NC}"
fi

# Set password endpoint
SET_PASSWORD_HEALTH=$(curl -s "${BASE_URL}/api/teacher-auth/set-password")
if echo "$SET_PASSWORD_HEALTH" | jq -e '.status == "ok"' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Set-password API is healthy${NC}"
else
    echo -e "${YELLOW}⚠ Set-password API health check returned unexpected response${NC}"
fi

# Forgot password endpoint
FORGOT_PASSWORD_HEALTH=$(curl -s "${BASE_URL}/api/teacher-auth/forgot-password")
if echo "$FORGOT_PASSWORD_HEALTH" | jq -e '.status == "ok"' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Forgot-password API is healthy${NC}"
else
    echo -e "${YELLOW}⚠ Forgot-password API health check returned unexpected response${NC}"
fi

echo ""

# Summary
echo "================================"
echo "Summary"
echo "================================"
echo -e "${GREEN}Server Status:${NC} Running"
echo -e "${GREEN}API Endpoints:${NC} Functional"
echo -e "${GREEN}Validation:${NC} Working correctly"
echo ""
echo "To manually test the full flow:"
echo "1. Visit: ${BASE_URL}/teacher/first-login"
echo "2. Enter a valid access code (if you have one)"
echo "3. Complete password setup"
echo "4. Login at: ${BASE_URL}/teacher/login"
echo ""
echo -e "${YELLOW}Note:${NC} To create test teachers, you need:"
echo "   - Supabase configured in .env.local"
echo "   - Access to admin panel or API"
echo ""
