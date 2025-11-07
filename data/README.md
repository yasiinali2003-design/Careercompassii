# Point History Dataset

Place JSON files containing historical todistusvalinta point data in this directory.

Expected structure for each row (`PointHistoryRow`):

```
[
  {
    "program_id": "tietotekniikka-aalto",
    "data_year": 2024,
    "min_points": 87.5,
    "median_points": 93.2,
    "max_points": 101.0,
    "applicant_count": 2450,
    "notes": "Source: Opetushallitus 2024"
  }
]
```

Run `tsx scripts/import-point-history.ts data/point-history-2024.json` to import the data into Supabase.

