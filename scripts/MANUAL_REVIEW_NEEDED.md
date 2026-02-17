# Manual Review Needed - Career Metadata

Auto-tagging completed with the following statistics:

## Summary Stats
- **Total careers**: 617
- **Entry**: 364
- **Mid**: 249  
- **Senior**: 4

## Senior Level Careers (Need Review)

These 4 careers were auto-tagged as "senior" - please review:

1. **teatteriohjaaja** (Theater Director)
   - Reason: Ends with "ohjaaja"
   - Recommendation: Could be **mid** (creative director role, not management)

2. **mainostoimiston-art-director** (Art Director)
   - Reason: Contains "director"
   - Recommendation: **senior** (correct - this is a leadership role in agencies)

3. **rakennustyönjohtaja** (Construction Site Manager)
   - Reason: Ends with "johtaja"
   - Recommendation: **mid** (site management, not company management)

4. **lennonjohtaja** (Air Traffic Controller)
   - Reason: Ends with "johtaja"
   - Recommendation: **mid** or **entry** (technical specialist role, not management)

## Low Confidence Suggestions (153 careers)

Run this command to see all low-confidence suggestions:
```bash
jq '.[] | select(.suggestedLevelConfidence == "low") | {id, title_fi, suggestedLevel, suggestedLevelReason}' scripts/career-metadata-suggestions.json
```

## Next Steps

1. Review the 4 senior careers above
2. Review low-confidence suggestions
3. Make manual corrections to `career-metadata-suggestions.json`
4. Run `apply-career-metadata.ts` to write changes back to `careers-fi.ts`

