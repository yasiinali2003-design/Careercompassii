# Package Differences Explanation

## Current System Architecture

Currently, CareerCompass has **ONE unified system** that handles all cohorts:
- **YLA** (Yläaste - Middle School)
- **TASO2** (Toinen aste - Secondary Education)
- **NUORI** (Nuori aikuinen - Young Adult)

---

## Understanding "Yläaste Package" vs "Premium Package"

Based on the codebase, there is **currently no package/pricing differentiation**. However, here's what these concepts might refer to:

### Potential "Yläaste Package" (Basic/Free)
**Would include:**
- Basic career test
- Standard career recommendations (3-5 careers)
- Basic teacher dashboard
- Education path recommendations (Lukio/Ammattikoulu for YLA)
- CSV exports

**Current Status**: ✅ This is what you have now for ALL cohorts

### Potential "Premium Package" (Enhanced/Paid)
**Would include everything above, PLUS:**
- Advanced analytics dashboard
- Detailed student profiles
- Multi-test tracking (student progress over time)
- Parent/guardian reports
- Custom branding (school logos)
- Priority support
- Advanced filtering and analytics
- Bulk operations
- API access
- Integration capabilities

**Current Status**: ⚠️ Some premium features already exist (analytics, detailed profiles) but not gated behind pricing

---

## Recommendation: Package Structure

If you want to differentiate packages, consider:

### 🆓 Yläaste Package (Free/Basic)
- For individual teachers or small schools
- Up to 50 students per teacher
- Basic dashboard
- Standard exports

### 💼 Premium Package (Paid)
- For schools/districts
- Unlimited students
- Advanced analytics
- Priority support
- Custom branding
- Multi-year tracking
- Parent portal
- Advanced reporting

### 🏫 Enterprise Package (Custom)
- For large districts
- Custom integrations
- Dedicated support
- Custom features
- Training included

---

## Current Implementation

**Right now, ALL features are available to ALL users** regardless of package.

To implement packages, you would need:
1. Package/subscription field in `teachers` table
2. Feature flags in teacher dashboard
3. Payment system integration
4. Upgrade prompts for premium features

---

## For Pilot Schools

**Recommendation**: Offer everything as "Premium" for pilot schools (free during pilot) to:
1. Get maximum feedback
2. Show full value
3. Build case studies
4. Test all features

Then after pilot:
- Introduce package tiers
- Grandfather pilot schools into premium
- Start charging new schools appropriately

---

## Technical Implementation (If Needed)

Would need to add:
1. Package field to teachers table
2. Feature flags in components
3. Payment processing (Stripe, etc.)
4. Upgrade flow in dashboard

**But this is NOT needed for pilot** - focus on features first, monetization later.

