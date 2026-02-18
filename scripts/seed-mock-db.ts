import { rankCareers } from '../lib/scoring/scoringEngine';
import * as fs from 'fs';

const classId = 'mock-class-1762631362743';
const now = new Date().toISOString();

function buildAnswers(overrides: Record<number, number>, defaultScore = 3) {
  const ans = [];
  for (let i = 0; i < 30; i++) {
    ans.push({ questionIndex: i, score: overrides[i] ?? defaultScore });
  }
  return ans;
}

const students = [
  // Strong profiles
  { pin: 'A7K2', answers: buildAnswers({ 0: 5, 7: 5, 11: 5, 18: 5, 1: 1, 2: 1, 3: 1, 5: 1, 8: 1 }) },
  { pin: 'B3M9', answers: buildAnswers({ 2: 5, 10: 5, 11: 4, 19: 5, 0: 1, 1: 1, 7: 1, 12: 1 }) },
  { pin: 'D8R4', answers: buildAnswers({ 4: 5, 5: 5, 17: 5, 3: 4, 0: 1, 7: 1, 11: 1, 16: 1 }) },
  { pin: 'E2T6', answers: buildAnswers({ 2: 5, 10: 4, 0: 5, 7: 5, 16: 2, 3: 1, 8: 1, 17: 1 }) },
  { pin: 'F4V8', answers: buildAnswers({ 16: 5, 15: 4, 13: 4, 3: 3, 2: 1, 10: 1, 5: 1 }) },
  { pin: 'H9Z5', answers: buildAnswers({ 8: 5, 9: 5, 12: 5, 3: 5, 17: 5, 0: 1, 7: 1, 16: 1 }) },
  { pin: 'J1N7', answers: buildAnswers({ 3: 5, 17: 5, 6: 5, 13: 4, 0: 1, 2: 1, 8: 1 }) },
  // Unsure / flagged
  { pin: 'C5P1', answers: buildAnswers({}) },            // all 3s
  { pin: 'G6X3', answers: buildAnswers({}, 2) },         // all 2s
  { pin: 'K3Q0', answers: buildAnswers({}, 4) },         // all 4s
];

const results = students.map(s => {
  const careers = rankCareers(s.answers, 'YLA', 5);
  const top = careers[0];
  const scores = s.answers.map(a => a.score);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const spread = Math.max(...scores) - Math.min(...scores);
  return {
    id: `result-${s.pin}`,
    class_id: classId,
    pin: s.pin,
    result_payload: {
      top_careers: careers.map(c => ({
        title: c.title,
        slug: c.slug,
        category: c.category,
        score: c.overallScore,
        confidence: c.confidence,
        reasons: c.reasons,
        workStyleNote: c.workStyleNote,
      })),
      dimension_scores: {
        interests: Math.round(50 + Math.random() * 40),
        values: Math.round(45 + Math.random() * 45),
        workstyle: Math.round(40 + Math.random() * 50),
        context: Math.round(35 + Math.random() * 50),
      },
      cohort: 'YLA',
      confidence: top?.confidence || 'medium',
      answer_avg: Math.round(avg * 10) / 10,
      answer_spread: spread,
    },
    created_at: now,
  };
});

const db = JSON.parse(fs.readFileSync('./mock-db.json', 'utf8'));
db.results = results;
db.pins[classId] = students.map(s => s.pin);
fs.writeFileSync('./mock-db.json', JSON.stringify(db, null, 2));

console.log(`\nSeeded ${results.length} student results into mock-db.json\n`);
results.forEach(r => {
  const top = r.result_payload.top_careers[0];
  const avg = r.result_payload.answer_avg;
  const spread = r.result_payload.answer_spread;
  const unsure = avg >= 2.5 && avg <= 3.5 && spread <= 2;
  const flag = unsure ? ' ⚠️  FLAGGED' : '';
  console.log(`  ${r.pin}: ${top?.category?.padEnd(22)} → ${top?.title}${flag}`);
});
console.log('\nTeacher dashboard: http://localhost:3000/teacher');
console.log(`Class detail:      http://localhost:3000/teacher/classes/${classId}`);
console.log(`Summary report:    http://localhost:3000/teacher/classes/${classId}/reports/summary`);
