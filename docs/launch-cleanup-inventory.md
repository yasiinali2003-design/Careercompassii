# Launch Cleanup Inventory — 2025-11-07

This inventory captures every file currently flagged as modified and classifies whether we **keep** the change for the upcoming release or **reset** it back to the upstream version.

## Keep (project-critical changes)

These files implement the new career-data expansion, calculator/storage upgrades, UI fixes, test coverage, and supporting tooling we want to ship.

- `app/api/study-programs/route.ts`
- `app/ammatit/[slug]/page.tsx`
- `app/ammatit/layout.tsx`
- `app/ammatit/page.tsx`
- `app/page.tsx`
- `app/test/results/page.tsx`
- `app/todistuspistelaskuri/page.tsx`
- `components/Footer.tsx`
- `components/ProgramDetailsModal.tsx`
- `components/StudyProgramsList.tsx`
- `components/TodistuspisteCalculator.tsx`
- `data/careers-fi.ts`
- `data/README.md`
- `lib/api/studyPrograms.ts`
- `lib/data/studyPrograms.ts`
- `lib/todistuspiste.ts`
- `lib/todistuspiste/` (new config, insights, and narrative helpers behind the weighted calculator)
- `migrations/add-study-program-point-history.sql`
- `scripts/import-point-history.ts`
- `test-todistuspiste-calculation.js`
- `test-todistuspiste-integration.js`
- `test-todistuspiste-programs.js`
- `docs/CAREER-SOURCES-2025-11-07.md`
- `docs/CAREER-UPDATE-2025-11-07.md`
- `docs/MISSING-RELATED-CAREERS-2025-11-07.md`
- `docs/TASO2-LASKURI-ANALYTICS.md`
- `docs/launch-cleanup-inventory.md` (this file)

> _Note:_ The todistuspiste test suite was rewritten to mirror the new weighted subject model, and `test-todistuspiste-programs.js` replaces the missing JSON dependency.

## Reset (unintentional or noise changes)

Reset these files to upstream `main` before staging commits. They currently contain trailing newlines, formatting drift, or exploratory edits outside the release scope.

- All top-level operational docs touched with only `+1` newline, e.g. `ACTION-REQUIRED.md`, `BROWSER-TEST-*`, `STEP-*`, `PLAN-IMPROVE-UX-TRUST.md`, etc.
- Administrative SQL scripts and provisioning helpers with whitespace-only diffs (`CHECK_TEACHERS_TABLE.sql`, `CREATE_TEST_TEACHER.sql`, `migrations/*.sql`, `scripts/*.ts`, `run-*.sh`, etc.) that we already reverted.
- Teacher/analytics modules that picked up incidental refactors (`app/[classToken]/page.tsx`, `app/admin/school-dashboard/page.tsx`, `components/TeacherClassManager.tsx`, `app/teacher/classes/[classId]/page.tsx`) — restored to reduce scope.
- Miscellaneous utility components with newline-only diffs (`components/ui/*.tsx`, `lib/scoring/*.ts`, `lib/notification*.ts`, `lib/referralSystem.ts`, `lib/schoolAnalytics.ts`, `lib/teacherPackage.ts`, etc.).
- Public legal pages and static HTML test fixtures under `public/` that only changed by a single trailing newline.
- Legacy test runners/scripts (`test-*.js/html/md`) that only changed by a single line and do not support the new calculator flow.

After the reset step the remaining diff should match exactly the files listed in the **Keep** section above.
