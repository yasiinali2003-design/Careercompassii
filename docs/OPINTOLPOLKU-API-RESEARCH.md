# Opintopolku API Research

## Research Summary

After researching Opintopolku API endpoints, here's what we found:

### Current Status

**Public API Documentation:** Not publicly available
- Opintopolku doesn't publish public API documentation
- API access may require registration with Opetushallitus (Finnish National Agency for Education)
- Contact: https://www.oph.fi/en/node/33

### Possible API Endpoints (Unverified)

Based on common patterns and Opintopolku's architecture:

1. **Konfo API** (Frontend API):
   - Base URL: `https://konfo-api.opintopolku.fi`
   - Endpoints:
     - `/koulutus/v1/koulutukset` - Study programs
     - `/hakemus/v1/hakukohteet` - Application options
     - `/hakemus/v1/hakukohteet/{id}/valintatapajonot` - Admission criteria

2. **Kouta Backend** (Backend API):
   - Base URL: `https://konfo-api.opintopolku.fi/kouta-backend`
   - Endpoints:
     - `/koulutus/v1/koulutukset` - Study programs
     - `/hakemus/v1/hakukohteet` - Application options

### Testing Results

- Direct API access: **Not accessible** (404/403 errors)
- Likely requires:
  - API key/authentication
  - Registration with Opetushallitus
  - Specific headers or tokens

### Alternative Approaches

Since public API access is not available, consider:

1. **Web Scraping** (Legal considerations apply):
   - Scrape Opintopolku website
   - Parse HTML/JSON from frontend
   - More fragile, requires maintenance

2. **Manual Data Entry**:
   - Export data from Opintopolku manually
   - Import via CSV
   - Most reliable, but time-consuming

3. **Contact Opetushallitus**:
   - Request API access
   - Get official documentation
   - Best long-term solution

4. **Use Existing Data Sources**:
   - Vipunen (Finnish education statistics)
   - University websites
   - Official admission statistics

### Recommended Next Steps

1. **Contact Opetushallitus** for API access
2. **Use CSV import** as interim solution
3. **Build web scraper** if API not available (with legal review)
4. **Use existing 82 programs** and expand manually

## Current Implementation

Our integration code is ready and will work once we have:
- Correct API endpoints
- Authentication credentials
- API documentation

The code structure supports:
- Multiple API endpoint configurations
- Authentication headers
- Rate limiting
- Error handling
- Data transformation

## Files Ready

- `lib/opintopolku/api.ts` - API client (needs endpoint updates)
- `lib/opintopolku/transformer.ts` - Data transformer (ready)
- `scripts/import-from-opintopolku.ts` - Import script (ready)

## Action Items

1. ✅ Research API endpoints
2. ⏳ Contact Opetushallitus for API access
3. ⏳ Update endpoints once confirmed
4. ⏳ Test with real API
5. ⏳ Import 800+ programs

