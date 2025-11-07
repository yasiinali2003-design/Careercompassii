# Step 1: Restart Server & Run Tests - Instructions

## 🎯 Goal
Verify that the Todistuspistelaskuri feature works correctly after server rebuild.

## 📋 Steps

### Step 1.1: Restart Dev Server

**In your terminal:**
1. Stop current server: `Ctrl+C`
2. Restart: `npm run dev`
3. Wait for: "Ready" or "compiled successfully" message

### Step 1.2: Run Tests

**Option A: Automatic (Recommended)**
```bash
./auto-test-once-ready.sh
```
This script will:
- Wait for server to be ready
- Run all 10 browser tests automatically
- Show results summary

**Option B: Manual**
Once server is ready, tell me "server ready" and I'll run the tests for you.

## ✅ Expected Results

After tests complete, you should see:
- ✅ 10/10 tests passed
- ✅ All API endpoints working
- ✅ All filtering/search working
- ✅ Data quality verified

## 🚀 Ready?

**Restart your dev server now, then either:**
1. Run `./auto-test-once-ready.sh` yourself, OR
2. Tell me "server ready" and I'll run tests for you

Let's proceed!

