# Step 2: Balance Yliopisto/AMK Programs

## Current Status
- **Yliopisto:** 51 programs
- **AMK:** 281 programs
- **Ratio:** Very imbalanced (1:5.5)

## Goal
Balance the ratio to better serve users interested in universities.

**Target:** ~150 yliopisto, ~200 AMK (more balanced)

## Implementation Plan

### Step 2.1: Update Scraper to Fetch Yliopisto Only

We'll modify the scraper to fetch only yliopisto programs.

### Step 2.2: Fetch 150 Yliopisto Programs

Run the scraper with yliopisto filter to get more university programs.

### Step 2.3: Import to Database

Import the new yliopisto programs, skipping existing ones.

## Expected Results

After completion:
- **Yliopisto:** ~150 programs
- **AMK:** ~281 programs  
- **Total:** ~431 programs
- **Better balance** for users

## Ready to Proceed?

Once Step 1 tests pass, I'll implement Step 2 automatically.

