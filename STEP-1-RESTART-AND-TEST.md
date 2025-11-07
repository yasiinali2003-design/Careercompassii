# Step 1: Restart Dev Server & Run Tests

## Current Status
❌ API returning 404 - Server needs rebuild after cache clear

## Action Required

### Step 1.1: Restart Dev Server

**In your terminal where the dev server is running:**

1. **Stop the server**: Press `Ctrl+C`

2. **Restart the server**:
   ```bash
   npm run dev
   ```

3. **Wait for rebuild** (~30-60 seconds)
   - Look for: "Ready in X ms" or "compiled successfully"

### Step 1.2: Verify Server is Ready

Once you see "Ready" or "compiled successfully", let me know and I'll:
- ✅ Test all API endpoints
- ✅ Run browser tests automatically
- ✅ Verify feature functionality

## What I'll Test

1. **API Endpoints** (10 tests):
   - Basic fetch
   - Filter by points
   - Filter by type (AMK/Yliopisto)
   - Search functionality
   - Sort by points
   - Pagination
   - Career matching
   - Data quality
   - Point range validation

2. **Feature Verification**:
   - Calculator appears for TASO2 users
   - Grade input works
   - Calculation is accurate
   - Programs display correctly

## Ready?

**Once your server shows "Ready", just say "server ready" and I'll run all tests automatically!**

