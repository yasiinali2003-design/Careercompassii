# Career Database Quality Audit Report

## Executive Summary

**Total Careers:** 175  
**Date:** 2025-01-26  
**Analysis Type:** Quality audit and gap analysis

---

## 1. Quality Issues Found

### 1.1 Placeholder Sources and URLs
**Status:** 🔴 Critical Issue  
**Count:** 74 careers (42.3% of total)

74 careers have placeholder sources or URLs (marked as "Lähde tarkistettava" or URL "#"). These need to be replaced with authoritative sources from TE-palvelut, Tilastokeskus, or other official Finnish career information sources.

**Examples:**
- Sisällöntuottaja
- Muusikko
- Kameramies
- Kirjailija
- Tuotemuotoilija
- Animaattori
- Teatteriohjaaja
- Valokuvaaja
- Pukusuunnittelija
- Puuseppä

**Recommendation:** Prioritize updating sources for high-demand careers first (healthcare, tech, education).

---

### 1.2 Duplicate Careers
**Status:** 🟡 Medium Issue  
**Count:** 7 duplicate entries

The following careers appear multiple times with slight variations (hyphens/spaces):

1. **Tekoälyasiantuntija / Tekoäly-asiantuntija** (2 variants)
   - `tekoälyasiantuntija` (innovoija)
   - `tekoaly-asiantuntija` (innovoija)
   - `tekoäly-asiantuntija` (innovoija)

2. **Puuseppä** (2 variants)
   - `puuseppa` (rakentaja)
   - `puuseppä` (rakentaja)

3. **Sähköasentaja** (2 variants)
   - `sahkonasentaja` (rakentaja)
   - `sähköasentaja` (jarjestaja)

4. **Energiainsinööri** (2 variants)
   - `energiainsinööri` (innovoija)
   - `energiainsinoori` (rakentaja)

5. **Sisällöntuottaja** (2 variants)
   - `sisallontuottaja` (luova)
   - `sisällöntuottaja` (auttaja)

6. **Mobiilisovelluskehittäjä** (2 variants)
   - `mobiilisovelluskehittaja` (innovoija)
   - `mobiilisovelluskehittäjä` (luova)

**Recommendation:** Merge duplicates and standardize naming. Keep one canonical version per career.

---

### 1.3 Missing Fields
**Status:** 🟢 Good  
**Count:** 0 careers

All careers have required fields (salary, outlook, education paths). No missing critical data detected.

---

### 1.4 Category Misclassifications
**Status:** 🟡 Medium Issue  
**Count:** Several instances

Some careers appear to be misclassified:

- **Sähköasentaja** appears in both `rakentaja` and `jarjestaja` categories
- **Energiainsinööri** appears in both `innovoija` and `rakentaja` categories
- **Sisällöntuottaja** appears in both `luova` and `auttaja` categories
- **Mobiilisovelluskehittäjä** appears in both `innovoija` and `luova` categories
- **Ympäristöasiantuntija** in `luova` (should likely be `ympariston-puolustaja`)

**Recommendation:** Review and standardize category assignments. Each career should belong to one primary category.

---

## 2. Category Distribution Analysis

| Category | Count | Percentage | Status |
|----------|-------|------------|--------|
| auttaja | 35 | 20.0% | ✅ Well represented |
| innovoija | 28 | 16.0% | ✅ Well represented |
| luova | 26 | 14.9% | ✅ Well represented |
| rakentaja | 20 | 11.4% | 🟡 Could be expanded |
| jarjestaja | 19 | 10.9% | 🟡 Could be expanded |
| johtaja | 17 | 9.7% | 🟡 Could be expanded |
| ympariston-puolustaja | 15 | 8.6% | 🟡 Could be expanded |
| visionaari | 15 | 8.6% | 🟡 Could be expanded |

**Analysis:**
- Top 3 categories (auttaja, innovoija, luova) represent 50.9% of all careers
- Bottom 4 categories (rakentaja, jarjestaja, johtaja, ympariston-puolustaja, visionaari) represent 49.1%
- Distribution is relatively balanced, but some categories could benefit from more entries

**Recommendation:** Consider adding more careers to underrepresented categories, especially:
- **rakentaja** (construction/trades) - important for vocational students
- **jarjestaja** (organizers) - administrative and service roles
- **ympariston-puolustaja** (environmental defenders) - growing sector

---

## 3. Overall Quality Score

**Quality Score:** 6.5/10

**Breakdown:**
- ✅ Complete data structure (salary, outlook, education paths): 10/10
- ⚠️ Source quality (74 careers with placeholders): 4/10
- ⚠️ Duplicate removal needed: 7/10
- ⚠️ Category consistency: 7/10

**Priority Actions:**
1. **High Priority:** Fix duplicate entries (7 careers)
2. **High Priority:** Update placeholder sources (74 careers)
3. **Medium Priority:** Review category classifications
4. **Low Priority:** Expand underrepresented categories

---

## 4. Recommendations

### Immediate Actions (Next Sprint)
1. **Remove duplicate careers** - Merge the 7 duplicate entries
2. **Update top 20 careers** - Replace placeholder sources with official Finnish sources
3. **Fix category misclassifications** - Standardize category assignments

### Short-term Improvements (Next Month)
1. **Source audit** - Update all 74 careers with placeholder sources
2. **Category expansion** - Add 5-10 careers to underrepresented categories
3. **Data validation** - Create automated checks to prevent future duplicates

### Long-term Enhancements (Next Quarter)
1. **Comprehensive source update** - All careers should have authoritative sources
2. **Category rebalancing** - Aim for more even distribution across categories
3. **Quality monitoring** - Regular audits to maintain data quality

---

## 5. Low-Quality Careers Summary

**Criteria for "Low Quality":**
- Has placeholder sources/URLs
- Is a duplicate entry
- Has category misclassification

**Total Low-Quality Careers:** ~81 careers (46.3%)

**Top Priority Fixes:**
1. Tekoälyasiantuntija variants (duplicate)
2. Puuseppä variants (duplicate)
3. Sähköasentaja variants (duplicate + category issue)
4. Energiainsinööri variants (duplicate + category issue)
5. Sisällöntuottaja variants (duplicate + category issue)
6. Mobiilisovelluskehittäjä variants (duplicate + category issue)

---

*Report generated by Career Database Audit Script*

