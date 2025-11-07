# TASO2 Todistuspistelaskuri – Mittaus & Seuranta

## 1. Tavoitteet

- **Käytön aktivointi**: vähintään 60 % kutsutuista pilot-käyttäjistä suorittaa laskennan loppuun (points + ohjelmalista).
- **Skenaarioiden käyttö**: 40 % käyttäjistä avaa “entä jos” -skenaasio-osuuden ja tekee vähintään yhden muutoksen.
- **Suosikit**: vähintään 30 % tallentaa vähintään yhden ohjelman suosikiksi.

## 2. Tapahtumat (Client-side tracking)

Suositellut event-nimet (voit käyttää esim. Plausible, Google Analytics 4 tai omaa Supabase-telemetriaa). Tapahtumat voidaan lähettää `window.analytics?.track` tai vastaavalla modulilla.

| Event | Kuvaus | Lisädata |
|-------|--------|----------|
| `laskuri_start` | Käyttäjä saapuu laskurille | `cohort` (TASO2), `fromResults` (true/false) |
| `laskuri_calculated` | Ensimmäinen onnistunut pisteiden lasku | `points`, `bonusPoints`, `subjectsFilled` |
| `scenario_open` | Skenaariomoduli avataan | `subjectsWithGrades` |
| `scenario_result` | Skenaariossa uusi arvosana valittu | `subjectKey`, `fromGrade`, `toGrade`, `deltaPoints` |
| `favorite_toggle` | Ohjelma lisätty/poistettu suosikeista | `programId`, `isFavorite`, `educationType` |
| `program_modal_open` | Ohjelmakortti avattu tarkemmin | `programId`, `institutionType`, `year` |
| `exit_to_opintopolku` | Käyttäjä klikkaa Opintopolku-linkkiä | `programId` |

## 3. Mittarit & Dashboard

- **Konversiopolku**: `laskuri_start → laskuri_calculated → program_modal_open → exit_to_opintopolku`.
- **Skenaariosyvyys**: keskimääräinen `scenario_result` per käyttäjä.
- **Suosikkijakauma**: tallennettujen ohjelmien määrä per käyttäjä + eniten tallennetut ohjelmat.
- **Palaute**: liitä tulevaan palautelomakkeeseen kysymys “Kuinka selkeä ohjaus oli?” (Likert 1–5).

## 4. Usability Check (Pilot)

1. Järjestä 3–5 etähaastattelua TASO2-oppilaiden kanssa (käyttötilanne 15 min).
2. Tarkkaile etenemistä wizardissa ja tunnista kohdat, joissa käyttäjä epäröi.
3. Kerää avoin palaute: “Mitä lisätietoa kaipaisit ennen hakemista?”

## 5. Data Refresh Routine

- **Kuukausittain**: aja `scripts/import-point-history.ts` uusilla JSON-tiedostoilla ja varmista, että Supabase palauttaa historiatiedot.
- **Julkaisut**: dokumentoi päivityspäivä yläbanneriin (päivität `app/todistuspistelaskuri/page.tsx`).
- **QA**: tarkista muutama ohjelma käsin (min/median/maksimi). Tee tarvittaessa vertailu Opetushallituksen sivuihin.

