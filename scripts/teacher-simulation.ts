/**
 * TEACHER END-TO-END SIMULATION
 * Simulates the full flow: teacher creates class → generates PINs →
 * 10 students complete tests → teacher views dashboard with results
 *
 * Mix of students: some have strong opinions, some are unsure (neutral answers)
 * Cohort: YLA (8th grade class, Siltamäen koulu, Opettaja: Maija Korhonen)
 *
 * "Unsure" detection: avg answer close to 3 (neutral) AND low score spread = flagged
 */

import { rankCareers } from '../lib/scoring/scoringEngine';
import type { CareerMatch } from '../lib/scoring/types';

interface StudentAnswer { questionIndex: number; score: number; }

interface StudentResult {
  pin: string;
  name: string;
  answers: StudentAnswer[];
  careers: CareerMatch[];
  confidence: 'high' | 'medium' | 'low';
  topCategory: string;
  avgAnswer: number;
  answerSpread: number;
  isUnsure: boolean;        // flagged: answered mostly neutral, unclear profile
  profileNote: string;      // teacher-facing insight
}

// ─── HELPERS ────────────────────────────────────────────────────────────────

function ans(overrides: Record<number, number>, count = 30): StudentAnswer[] {
  const base = Array.from({ length: count }, (_, i) => ({ questionIndex: i, score: 3 }));
  for (const [q, s] of Object.entries(overrides)) base[+q].score = s;
  return base;
}

function generatePin(index: number): string {
  const pins = ['A7K2', 'B3M9', 'C5P1', 'D8R4', 'E2T6', 'F4V8', 'G6X3', 'H9Z5', 'J1N7', 'K3Q0'];
  return pins[index];
}

function calcStats(answers: StudentAnswer[]) {
  const scores = answers.map(a => a.score);
  const avg = scores.reduce((s, v) => s + v, 0) / scores.length;
  const spread = Math.max(...scores) - Math.min(...scores);
  return { avg, spread };
}

// A student is "unsure" if avg ≈ 3 (between 2.5-3.5) AND spread ≤ 2
// Meaning they answered mostly neutral and never went extreme on anything
function detectUnsure(avg: number, spread: number): boolean {
  return avg >= 2.5 && avg <= 3.5 && spread <= 2;
}

function categoryFinnish(cat: string): string {
  const map: Record<string, string> = {
    'innovoija': 'Innovoija',
    'auttaja': 'Auttaja',
    'luova': 'Luova',
    'rakentaja': 'Rakentaja',
    'jarjestaja': 'Järjestäjä',
    'johtaja': 'Johtaja',
    'visionaari': 'Visionääri',
    'ympariston-puolustaja': 'Ympäristön puolustaja',
  };
  return map[cat] || cat;
}

function categoryEmoji(cat: string): string {
  const map: Record<string, string> = {
    'innovoija': '💻',
    'auttaja': '🤝',
    'luova': '🎨',
    'rakentaja': '🔧',
    'jarjestaja': '📋',
    'johtaja': '🏆',
    'visionaari': '🌍',
    'ympariston-puolustaja': '🌿',
  };
  return map[cat] || '❓';
}

function bar(value: number, max = 100, width = 20): string {
  const filled = Math.round((value / max) * width);
  return '█'.repeat(filled) + '░'.repeat(width - filled);
}

function confidenceLabel(c: string): string {
  if (c === 'high') return '🟢 Vahva';
  if (c === 'medium') return '🟡 Kohtalainen';
  return '🔴 Heikko';
}

// ─── 10 STUDENTS ────────────────────────────────────────────────────────────
// Mix: 6 strong profiles, 4 unsure/neutral students

const STUDENTS = [
  {
    name: 'Eetu Mäkinen',
    personality: 'Vahva: Innokas koodari, pelaa ja rakentaa sovelluksia',
    answers: ans({ 0:5, 1:5, 7:5, 11:5, 22:5, 14:4, 2:1, 12:1, 17:1, 15:2 })
  },
  {
    name: 'Sofia Virtanen',
    personality: 'Vahva: Luova taiteilija, piirtää ja tekee musiikkia',
    answers: ans({ 2:5, 10:5, 11:4, 19:5, 21:4, 8:4, 0:1, 3:1, 16:1 })
  },
  {
    name: 'Onni Leinonen',
    personality: 'Epävarma: Vastasi pääosin neutraalisti, ei selkeää suuntaa',
    answers: ans({ 0:3, 1:3, 2:3, 3:3, 4:3, 5:3, 6:3, 7:3, 8:3, 9:3,
                   10:3, 11:3, 12:3, 13:3, 14:3, 15:3, 16:3, 17:3, 18:3, 19:3,
                   20:3, 21:3, 22:3, 23:3, 24:3, 25:3, 26:3, 27:3, 28:3, 29:3 })
  },
  {
    name: 'Aino Korhonen',
    personality: 'Vahva: Luontorakastaja, haaveilee eläinlääkäristä',
    answers: ans({ 4:5, 5:5, 23:5, 7:4, 17:5, 12:4, 0:1, 24:1, 6:1 })
  },
  {
    name: 'Mikael Järvinen',
    personality: 'Epävarma: Vaihteleva, ristiriitaisia vastauksia eri suuntiin',
    answers: ans({ 0:4, 2:4, 8:4, 12:1, 15:5, 16:1, 19:4, 22:1, 3:4, 9:1 })
  },
  {
    name: 'Emma Saarinen',
    personality: 'Vahva: Järjestelmällinen koordinaattori, organisoija',
    answers: ans({ 16:5, 29:5, 15:4, 24:4, 11:4, 19:1, 2:1, 0:1, 17:1 })
  },
  {
    name: 'Luca Nieminen',
    personality: 'Epävarma: Pienen pisteyden pelaaja, suurin osa 2-3',
    answers: ans({ 0:2, 1:2, 2:3, 3:3, 4:2, 5:3, 6:2, 7:3, 8:2, 9:2,
                   10:3, 11:2, 12:3, 13:2, 14:3, 15:2, 16:3, 17:2, 18:3, 19:2 })
  },
  {
    name: 'Iida Mäkelä',
    personality: 'Vahva: Urheilullinen auttaja, opettaa ja valmentaa',
    answers: ans({ 8:5, 9:5, 12:5, 5:4, 23:5, 15:5, 0:1, 2:1, 16:1 })
  },
  {
    name: 'Roope Heikkinen',
    personality: 'Vahva: Käytännön rakentaja, ulkotyö ja kädet',
    answers: ans({ 3:5, 17:5, 8:4, 7:3, 15:2, 0:1, 14:1, 2:1, 11:2 })
  },
  {
    name: 'Liisa Tuominen',
    personality: 'Epävarma: Hieman korkeat pisteet kaikkialle, hajanainen profiili',
    answers: ans({ 0:4, 1:4, 2:4, 3:4, 4:4, 5:4, 6:4, 7:4, 8:4, 9:4,
                   10:3, 11:3, 12:3, 13:3, 14:3 })
  },
];

// ─── SIMULATE ────────────────────────────────────────────────────────────────

async function main() {
  const WIDTH = 72;
  const line = '─'.repeat(WIDTH);
  const dline = '═'.repeat(WIDTH);

  // ── PHASE 1: TEACHER SETUP ──────────────────────────────────────────────
  console.log('\n' + dline);
  console.log('  OPETTAJAN SIMULAATIO — URAKOMPASSI');
  console.log('  Siltamäen koulu | 8B | Opettaja: Maija Korhonen');
  console.log(dline);

  console.log('\n📋 VAIHE 1: OPETTAJA LUO LUOKAN JA GENEROI PIN-KOODIT');
  console.log(line);
  console.log('  Luokka:      8B — Siltamäen koulu');
  console.log('  Kohortti:    YLA (13-16v)');
  console.log('  Luokkatunnus: abc123def456  →  urakompassi.fi/abc123def456');
  console.log('  Opettaja kirjautuu sisään ja generoi 10 PIN-koodia:');
  console.log();

  const pinTable = STUDENTS.map((s, i) => ({ name: s.name, pin: generatePin(i) }));
  pinTable.forEach(({ name, pin }) => {
    console.log(`    PIN ${pin}  →  ${name}`);
  });

  console.log();
  console.log('  ✅ Opettaja jakaa luokkalinkin ja PIN-koodit oppilaille.');
  console.log('  📧 Vaihtoehtoisesti lähettää PIN-koodit sähköpostilla tai QR-koodina.');

  // ── PHASE 2: STUDENTS COMPLETE TESTS ───────────────────────────────────
  console.log('\n\n📝 VAIHE 2: OPPILAAT TEKEVÄT TESTIN');
  console.log(line);
  console.log('  Oppilaat menevät osoitteeseen urakompassi.fi/abc123def456');
  console.log('  Syöttävät oman PIN-koodinsa → tekevät 30 kysymyksen testin');
  console.log('  Tulokset tallentuvat automaattisesti opettajan näkymään.');
  console.log();

  const results: StudentResult[] = [];

  for (let i = 0; i < STUDENTS.length; i++) {
    const s = STUDENTS[i];
    const pin = generatePin(i);

    const careers = rankCareers(s.answers, 'YLA', 5);
    const { avg, spread } = calcStats(s.answers);
    const isUnsure = detectUnsure(avg, spread);
    const topCat = careers[0]?.category || 'tuntematon';
    const conf = careers[0]?.confidence || 'low';

    let profileNote = '';
    if (isUnsure && avg >= 2.5 && avg <= 3.5 && spread <= 2) {
      profileNote = 'Neutraali vastaustapa — suositellaan henkilökohtaista keskustelua';
    } else if (avg > 3.5 && spread <= 2) {
      profileNote = 'Vastasi korkeita pisteitä kauttaaltaan — hajanainen profiili';
    } else {
      profileNote = 'Selkeä profiili';
    }

    results.push({
      pin, name: s.name, answers: s.answers, careers,
      confidence: conf, topCategory: topCat,
      avgAnswer: Math.round(avg * 10) / 10,
      answerSpread: spread, isUnsure, profileNote
    });

    const status = isUnsure ? '⚠️  Epävarma' : '✅ Valmis';
    console.log(`  [${String(i+1).padStart(2,'0')}] ${pin}  ${s.name.padEnd(20)}  ${status}`);
  }

  // ── PHASE 3: TEACHER DASHBOARD ──────────────────────────────────────────
  console.log('\n\n' + dline);
  console.log('  📊 VAIHE 3: OPETTAJAN KOONTINÄKYMÄ');
  console.log('  teacher/classes/[classId] — Luokka 8B tulokset');
  console.log(dline);

  // Summary stats
  const completed = results.length;
  const unsureCount = results.filter(r => r.isUnsure).length;
  const strongCount = results.filter(r => !r.isUnsure).length;
  const highConfCount = results.filter(r => r.confidence === 'high').length;
  const catCounts: Record<string, number> = {};
  results.forEach(r => { catCounts[r.topCategory] = (catCounts[r.topCategory] || 0) + 1; });
  const topCat = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0];

  console.log('\n  ┌─ YHTEENVETO ──────────────────────────────────────────────┐');
  console.log(`  │  Testejä suoritettu:    ${String(completed).padEnd(4)} / 10                        │`);
  console.log(`  │  Vahva profiili:        ${String(strongCount).padEnd(4)}                            │`);
  console.log(`  │  Epävarma / Flaggattu:  ${String(unsureCount).padEnd(4)}  ⚠️                        │`);
  console.log(`  │  Korkea luottamus:      ${String(highConfCount).padEnd(4)}                            │`);
  console.log(`  │  Yleisin kategoria:     ${(categoryEmoji(topCat[0]) + ' ' + categoryFinnish(topCat[0])).padEnd(28)}    │`);
  console.log('  └──────────────────────────────────────────────────────────────┘');

  // Category distribution
  console.log('\n  📊 KATEGORIAJATKUMO LUOKASSA:');
  console.log('  ' + line);
  const sortedCats = Object.entries(catCounts).sort((a, b) => b[1] - a[1]);
  sortedCats.forEach(([cat, count]) => {
    const pct = Math.round((count / completed) * 100);
    const b = bar(pct, 100, 18);
    console.log(`  ${categoryEmoji(cat)} ${categoryFinnish(cat).padEnd(22)} ${b}  ${count} oppilas${count > 1 ? 'ta' : ''} (${pct}%)`);
  });

  // ── STUDENT RESULT TABLE ────────────────────────────────────────────────
  console.log('\n\n  📋 OPPILAIDEN TULOKSET — YKSITYISKOHTAINEN NÄKYMÄ:');
  console.log('  ' + line);

  const flagged: StudentResult[] = [];
  const strong: StudentResult[] = [];
  results.forEach(r => (r.isUnsure ? flagged : strong).push(r));

  // Strong profiles first
  console.log('\n  ✅ VAHVAT PROFIILIT (selkeä suunta):');
  strong.forEach(r => {
    const c1 = r.careers[0];
    const c2 = r.careers[1];
    const c3 = r.careers[2];
    console.log();
    console.log(`  ┌─ ${r.name.padEnd(20)} PIN: ${r.pin} ─────────────────────────────┐`);
    console.log(`  │  Profiilityyppi:  ${categoryEmoji(r.topCategory)} ${categoryFinnish(r.topCategory).padEnd(30)}          │`);
    console.log(`  │  Luottamus:       ${confidenceLabel(r.confidence).padEnd(35)}      │`);
    console.log(`  │                                                                  │`);
    console.log(`  │  TOP 3 URASUOSITUSTA:                                            │`);
    if (c1) console.log(`  │    1. ${c1.title.padEnd(38)} ${String(c1.overallScore).padStart(3)}%  │`);
    if (c2) console.log(`  │    2. ${c2.title.padEnd(38)} ${String(c2.overallScore).padStart(3)}%  │`);
    if (c3) console.log(`  │    3. ${c3.title.padEnd(38)} ${String(c3.overallScore).padStart(3)}%  │`);
    if (c1?.reasons?.[0]) {
      const reason = c1.reasons[0].substring(0, 58);
      console.log(`  │                                                                  │`);
      console.log(`  │  💬 "${reason}..."  │`);
    }
    if (c1?.workStyleNote) {
      console.log(`  │  ⚠️  ${c1.workStyleNote.substring(0, 60).padEnd(60)}  │`);
    }
    console.log('  └──────────────────────────────────────────────────────────────────┘');
  });

  // Flagged/unsure profiles
  console.log('\n\n  ⚠️  EPÄVARMAT OPPILAAT — SUOSITELLAAN LISÄKESKUSTELUA:');
  console.log('  (Nämä oppilaat vastasivat pääosin neutraalisti tai hajanaisesti)');

  flagged.forEach(r => {
    const c1 = r.careers[0];
    const c2 = r.careers[1];
    console.log();
    console.log(`  ┌─ ⚠️  ${r.name.padEnd(20)} PIN: ${r.pin} ───── EPÄVARMA ──────────┐`);
    console.log(`  │  Vastausten keskiarvo: ${String(r.avgAnswer).padEnd(4)}  Vaihteluväli: ${String(r.answerSpread).padEnd(2)} / 4         │`);
    console.log(`  │  Huomio: ${r.profileNote.padEnd(55)}   │`);
    console.log(`  │                                                                  │`);
    console.log(`  │  Epävarmat suositukset (heikko signaali):                        │`);
    if (c1) console.log(`  │    1. ${c1.title.padEnd(38)} ${String(c1.overallScore).padStart(3)}%  │`);
    if (c2) console.log(`  │    2. ${c2.title.padEnd(38)} ${String(c2.overallScore).padStart(3)}%  │`);
    console.log(`  │                                                                  │`);
    console.log(`  │  📌 Toimenpide-ehdotus: Varaa aika henkilökohtaiseen            │`);
    console.log(`  │     uraohjauskeskusteluun. Käy läpi kiinnostuksen kohteet.       │`);
    console.log('  └──────────────────────────────────────────────────────────────────┘');
  });

  // ── TOP CAREER DISTRIBUTION ACROSS CLASS ────────────────────────────────
  const allCareerCounts: Record<string, number> = {};
  results.forEach(r => {
    r.careers.slice(0, 3).forEach(c => {
      allCareerCounts[c.title] = (allCareerCounts[c.title] || 0) + 1;
    });
  });
  const topCareers = Object.entries(allCareerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  console.log('\n\n  🏆 LUOKAN SUOSITUIMMAT AMMATIT (top 3 per oppilas):');
  console.log('  ' + line);
  topCareers.forEach(([title, count], i) => {
    const b = bar(count, results.length, 14);
    console.log(`  ${String(i+1).padStart(2)}. ${title.padEnd(35)} ${b} ${count}x`);
  });

  // ── TEACHER ACTIONS ──────────────────────────────────────────────────────
  console.log('\n\n  ⚡ OPETTAJAN TOIMINNOT KOONTINÄKYMÄSSÄ:');
  console.log('  ' + line);
  console.log('  [📥 Lataa PDF-raportti]     — Koko luokan yhteenveto PDF:nä');
  console.log('  [👤 Yksittäinen raportti]   — Klikkaa oppilaan nimeä → täysi raportti');
  console.log('  [📊 Vertailunäkymä]         — Vertaa kahta oppilasta rinnakkain');
  console.log('  [📧 Lähetä oppilaalle]      — Lähetä tulokset sähköpostilla');
  console.log('  [💬 Merkitse käsitellyksi]  — Merkitse epävarma oppilas käsitellyksi');

  // ── FINAL SUMMARY ────────────────────────────────────────────────────────
  console.log('\n\n' + dline);
  console.log('  SIMULAATION YHTEENVETO');
  console.log(dline);
  console.log(`  Luokka 8B — ${completed} oppilasta suoritti testin`);
  console.log();
  console.log('  Vahvat profiilit:');
  strong.forEach(r => {
    console.log(`    ${categoryEmoji(r.topCategory)} ${r.name.padEnd(20)} → ${categoryFinnish(r.topCategory)} (${r.careers[0]?.title})`);
  });
  console.log();
  console.log('  Epävarmat — vaativat lisäohjausta:');
  flagged.forEach(r => {
    console.log(`    ⚠️  ${r.name.padEnd(20)} → Heikko signaali (ka: ${r.avgAnswer}, vaihteluväli: ${r.answerSpread})`);
  });
  console.log();
  console.log(`  Epävarmojen osuus luokassa: ${flagged.length}/${completed} (${Math.round(flagged.length/completed*100)}%)`);
  console.log('  → Tyypillinen luokka: noin 30-40% oppilaista hyötyy lisäohjauksesta.');
  console.log(dline);
  console.log();
}

main();
