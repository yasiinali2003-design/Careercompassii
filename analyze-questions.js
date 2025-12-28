// Analyze all question sets for duplicates

const dimensions = require('./lib/scoring/dimensions');

function extractUniqueQuestions(mappings) {
  const seen = new Set();
  const questions = [];
  for (const m of mappings) {
    if (!seen.has(m.q)) {
      seen.add(m.q);
      questions.push({ q: m.q, text: m.text });
    }
  }
  return questions.sort((a, b) => a.q - b.q);
}

// Get all question sets
const YLA = extractUniqueQuestions(dimensions.QUESTION_MAPPINGS.YLA);
const TASO2 = extractUniqueQuestions(dimensions.QUESTION_MAPPINGS.TASO2);
const NUORI = extractUniqueQuestions(dimensions.QUESTION_MAPPINGS.NUORI);
const LUKIO = extractUniqueQuestions(dimensions.TASO2_SUB_MAPPINGS.LUKIO);
const AMIS = extractUniqueQuestions(dimensions.TASO2_SUB_MAPPINGS.AMIS);

console.log('=== QUESTION SET SIZES ===');
console.log('YLA: ' + YLA.length + ' questions');
console.log('TASO2 (generic): ' + TASO2.length + ' questions');
console.log('TASO2 LUKIO: ' + LUKIO.length + ' questions');
console.log('TASO2 AMIS: ' + AMIS.length + ' questions');
console.log('NUORI: ' + NUORI.length + ' questions');

// Function to find similar questions within a set
function findSimilarWithin(questions, setName) {
  const similar = [];
  for (let i = 0; i < questions.length; i++) {
    for (let j = i + 1; j < questions.length; j++) {
      const text1 = questions[i].text.toLowerCase();
      const text2 = questions[j].text.toLowerCase();

      // Check for shared key words (excluding common Finnish words)
      const words1 = text1.split(/\s+/).filter(w => w.length > 4);
      const words2 = text2.split(/\s+/).filter(w => w.length > 4);
      const shared = words1.filter(w => words2.includes(w));

      // Check for similar concepts
      const concepts = [
        ['tiimi', 'ryhmä', 'yhteistyö', 'muiden kanssa'],
        ['johtaa', 'päättää', 'vastuuta', 'esihenkilö'],
        ['luova', 'suunnittelu', 'design', 'taide'],
        ['tekniikka', 'teknologia', 'ohjelmointi', 'it-ala'],
        ['terveys', 'hoito', 'sairas', 'lääke'],
        ['raha', 'palkka', 'ansaita'],
        ['vapaa-aika', 'perhe', 'harrastus'],
        ['kansainvälinen', 'ulkomaa', 'matkust'],
        ['itsenäi', 'itse päätöksiä'],
        ['käsillä', 'rakentaa', 'korjata', 'fyysinen'],
      ];

      let conceptMatch = false;
      for (const group of concepts) {
        const match1 = group.some(c => text1.includes(c));
        const match2 = group.some(c => text2.includes(c));
        if (match1 && match2) {
          conceptMatch = true;
          break;
        }
      }

      if (shared.length >= 2 || conceptMatch) {
        similar.push({
          q1: questions[i].q,
          q2: questions[j].q,
          text1: questions[i].text,
          text2: questions[j].text,
          sharedWords: shared
        });
      }
    }
  }
  return similar;
}

console.log('\n=== CHECKING FOR SIMILAR QUESTIONS WITHIN EACH SET ===\n');

const sets = [
  { name: 'YLA', questions: YLA },
  { name: 'TASO2 (generic)', questions: TASO2 },
  { name: 'TASO2 LUKIO', questions: LUKIO },
  { name: 'TASO2 AMIS', questions: AMIS },
  { name: 'NUORI', questions: NUORI }
];

for (const set of sets) {
  const similar = findSimilarWithin(set.questions, set.name);
  console.log('\n--- ' + set.name + ' (' + set.questions.length + ' questions) ---');
  if (similar.length === 0) {
    console.log('No similar questions found');
  } else {
    console.log('Found ' + similar.length + ' potentially similar pairs:');
    for (const s of similar) {
      console.log('  Q' + s.q1 + ' vs Q' + s.q2 + ':');
      console.log('    "' + s.text1 + '"');
      console.log('    "' + s.text2 + '"');
      if (s.sharedWords.length > 0) {
        console.log('    Shared words: ' + s.sharedWords.join(', '));
      }
      console.log('');
    }
  }
}

// Print all questions for manual review
console.log('\n=== ALL QUESTIONS FOR MANUAL REVIEW ===\n');

for (const set of sets) {
  console.log('\n--- ' + set.name + ' ---');
  for (const q of set.questions) {
    console.log('Q' + q.q + ': ' + q.text);
  }
}
