# Career Recommendation Demand & Diversity Weights

This document summarises how demand outlook and result diversity are combined inside the
`rankCareers` algorithm (`lib/scoring/scoringEngine.ts`).

## Outlook tiers (2024 refresh)

| Status       | Meaning (2024) | Data source example |
|--------------|----------------|---------------------|
| `kasvaa`     | Strong hiring momentum, positive trend in 2024 labour statistics | Työmarkkinatori, TEM toimialaraportit |
| `vakaa`      | Recruitments continue, but growth is moderate or project based | EK suhdannebarometri 2/2024 |
| `vaihtelee`  | Hiring depends on project pipelines or public funding cycles | Business Finland Nano & Quantum 2024 |
| `supistuu`   | Open positions have decreased year-on-year and competition has intensified | APFI Työllisyyskatsaus 2024 |
| `laskee`     | Legacy alias for `supistuu` (kept for backwards compatibility) | — |

The demand mapping lives in `lib/scoring/rankingConfig.ts` and is consumed by the scoring engine
and automated regression tests (`test-career-ranking.ts`). Update the table and the config file together
when new labour-market data is ingested.

## Configurable weights

`lib/scoring/rankingConfig.ts` centralises the tuning knobs:

- `DEMAND_WEIGHTS`: numeric weight for each status. Higher numbers win tie breaks.
- `RANKING_WEIGHTS.demandBoost`: per-weight multiplier added on top of the cosine fit score.
- `RANKING_WEIGHTS.similarTitlePenalty`: penalty that is applied each time we would surface another
  role with the same suffix (e.g. `insinööri`, `asiantuntija`).
- `RANKING_WEIGHTS.primaryDiversityLimit` / `fallbackDiversityLimit`: how many careers with the same
  diversity key are allowed before the algorithm falls back to duplicates to fill the requested limit.

To adjust behaviour you only need to edit this file. The regression test checks that demand ordering stays
monotonic and that the first results keep a varied set of diversity keys.

## Updating data

When you ingest fresh career data:

1. Update the `job_outlook` block in `data/careers-fi.ts` for the affected roles with a 2024+ source.
2. Run `npm test` to ensure `test-career-ranking.ts` and the todistuspiste suites pass.
3. If a status changes category (e.g. from `supistuu` to `vakaa`), update the table above to keep the
   documentation aligned with live data.
