# Quick Start - Run All Steps Automatically

## 🚀 One Command to Run Everything

I've created an automated script that will:
1. ✅ Wait for server to be ready
2. ✅ Run all browser tests
3. ✅ Fetch 150 yliopisto programs
4. ✅ Import to database
5. ✅ Show final results

## How to Run

### Option 1: Automated Script (Recommended)

**First, restart your dev server:**
```bash
# In your terminal where dev server runs:
Ctrl+C  # Stop server
npm run dev  # Restart
```

**Then in a new terminal, run:**
```bash
cd /Users/yasiinali/careercompassi
./run-all-steps.sh
```

The script will:
- Wait for server to be ready (up to 2 minutes)
- Run all tests automatically
- Proceed to Step 2 if tests pass
- Show complete results

### Option 2: Manual Step-by-Step

**Step 1: Restart Server**
```bash
npm run dev
```

**Step 2: Wait for "Ready" message**

**Step 3: Tell me "server ready"**
I'll run all tests and proceed automatically.

## What Will Happen

1. **Step 1: Tests** (~30 seconds)
   - 10 API endpoint tests
   - Verify all functionality

2. **Step 2: Balance Programs** (~5-10 minutes)
   - Fetch 150 yliopisto programs
   - Import to database
   - Balance ratio improved

3. **Results**
   - Before: 51 yliopisto, 281 AMK
   - After: ~150 yliopisto, 281 AMK
   - Total: ~431 programs

## Ready?

**Restart your dev server, then run:**
```bash
./run-all-steps.sh
```

Or tell me "server ready" and I'll do it for you!

