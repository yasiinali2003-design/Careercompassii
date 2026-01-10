/**
 * COMPREHENSIVE TEST SUITE - 20 REALISTIC MIXED PERSONALITIES
 * 20 Personalities × 4 Cohorts = 80 Tests
 *
 * Each personality combines multiple traits like real humans do
 * e.g., "Creative helper", "Tech-savvy environmentalist", "Analytical leader"
 */

const fs = require('fs');
const path = require('path');

// Read and parse the career vectors file
const careerVectorsPath = path.join(__dirname, 'lib/scoring/careerVectors.ts');
const content = fs.readFileSync(careerVectorsPath, 'utf-8');

const careerRegex = /\{\s*slug:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*interests:\s*\{([^}]+)\},\s*workstyle:\s*\{([^}]+)\}/g;

const careers = [];
let match;
while ((match = careerRegex.exec(content)) !== null) {
  const [, slug, title, category, interestsStr, workstyleStr] = match;
  const interests = {};
  interestsStr.match(/(\w+):\s*([\d.]+)/g)?.forEach(m => {
    const [key, val] = m.split(':').map(s => s.trim());
    interests[key] = parseFloat(val);
  });
  const workstyle = {};
  workstyleStr.match(/(\w+):\s*([\d.]+)/g)?.forEach(m => {
    const [key, val] = m.split(':').map(s => s.trim());
    workstyle[key] = parseFloat(val);
  });
  careers.push({ slug, title, category, interests, workstyle });
}

console.log(`Loaded ${careers.length} careers\n`);

// Cosine similarity
function cosineSimilarity(a, b) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  let dot = 0, normA = 0, normB = 0;
  for (const k of keys) {
    const va = a[k] || 0, vb = b[k] || 0;
    dot += va * vb; normA += va * va; normB += vb * vb;
  }
  return normA > 0 && normB > 0 ? dot / (Math.sqrt(normA) * Math.sqrt(normB)) : 0;
}

function calculateScore(profile, career) {
  return (cosineSimilarity(profile.interests, career.interests) * 0.5) +
         (cosineSimilarity(profile.workstyle, career.workstyle) * 0.5);
}

function getTopStrengths(profile) {
  const scores = [
    { name: 'luovuus', score: profile.interests.creative || 0 },
    { name: 'johtaminen', score: profile.workstyle.leadership || 0 },
    { name: 'innovatiivisuus', score: profile.interests.innovation || 0 },
    { name: 'analyyttisyys', score: profile.interests.analytical || 0 },
    { name: 'teknologia', score: profile.interests.technology || 0 },
    { name: 'ihmisläheisyys', score: profile.interests.people || 0 },
    { name: 'terveys/hoiva', score: profile.interests.health || 0 },
    { name: 'käytännöllisyys', score: profile.interests.hands_on || 0 },
    { name: 'yrittäjyys', score: profile.interests.business || 0 },
    { name: 'itsenäisyys', score: profile.workstyle.independence || 0 },
    { name: 'tiimityö', score: profile.workstyle.teamwork || 0 },
    { name: 'suunnitelmallisuus', score: profile.workstyle.planning || 0 },
    { name: 'ongelmanratkaisu', score: profile.workstyle.problem_solving || 0 },
    { name: 'luonto/ympäristö', score: profile.interests.nature || 0 },
    { name: 'tarkkuus', score: profile.workstyle.precision || 0 },
    { name: 'sosiaalisuus', score: profile.workstyle.social || 0 },
  ];
  return scores.sort((a, b) => b.score - a.score).slice(0, 4);
}

// Run single test
function runTest(profile, expectedCategories, expectedKeywords, verbose = false) {
  const scored = careers.map(c => ({
    ...c, score: calculateScore(profile, c)
  })).sort((a, b) => b.score - a.score);

  const top8 = scored.slice(0, 8);
  const strengths = getTopStrengths(profile);

  const categoryMatch = top8.filter(c => expectedCategories.includes(c.category)).length;
  const keywordMatch = expectedKeywords.filter(kw =>
    top8.some(c => c.title.toLowerCase().includes(kw.toLowerCase()) || c.slug.includes(kw.toLowerCase()))
  ).length;

  // Pass if at least 4 careers match expected categories OR at least 2 keywords found
  const pass = categoryMatch >= 4 || keywordMatch >= 2;

  if (verbose) {
    console.log(`   Strengths: ${strengths.slice(0, 3).map(s => `${s.name}(${(s.score*100).toFixed(0)}%)`).join(', ')}`);
    console.log(`   Top 5 careers: ${top8.slice(0, 5).map(c => `${c.title}[${c.category}]`).join(', ')}`);
    console.log(`   Category match: ${categoryMatch}/8, Keywords: ${keywordMatch}/${expectedKeywords.length}`);
  }

  return { pass, categoryMatch, keywordMatch, top5: top8.slice(0, 5).map(c => c.title), topCategories: [...new Set(top8.map(c => c.category))] };
}

// ==================== 20 REALISTIC MIXED PERSONALITY PROFILES ====================

const PERSONALITIES = [
  // 1. Creative + Helper (Art Therapist type)
  {
    name: "1. Luova Auttaja",
    description: "Creative person who wants to help others through art/design",
    profile: {
      interests: { creative: 0.85, people: 0.80, health: 0.55, arts_culture: 0.82, education: 0.65, innovation: 0.50, technology: 0.35, analytical: 0.40, hands_on: 0.50, business: 0.25, nature: 0.35, sports: 0.25, writing: 0.70, environment: 0.30 },
      workstyle: { leadership: 0.40, independence: 0.65, teamwork: 0.75, planning: 0.50, problem_solving: 0.60, motivation: 0.75, autonomy: 0.70, social: 0.80, flexibility: 0.75, variety: 0.70, organization: 0.45, precision: 0.45, performance: 0.60, teaching: 0.70, structure: 0.35 }
    },
    expectedCategories: ['luova', 'auttaja'],
    expectedKeywords: ['suunnittelija', 'opettaja', 'terapeutti', 'taide', 'ohjaaja', 'valmentaja']
  },

  // 2. Tech + Business (Startup Founder type)
  {
    name: "2. Tech-Yrittäjä",
    description: "Technical person with strong business drive",
    profile: {
      interests: { technology: 0.88, business: 0.82, innovation: 0.85, analytical: 0.75, creative: 0.45, people: 0.60, education: 0.40, hands_on: 0.45, health: 0.15, arts_culture: 0.25, nature: 0.20, sports: 0.30, writing: 0.50, environment: 0.25 },
      workstyle: { leadership: 0.80, independence: 0.82, teamwork: 0.65, planning: 0.85, problem_solving: 0.90, motivation: 0.85, autonomy: 0.85, social: 0.60, flexibility: 0.70, variety: 0.75, organization: 0.70, precision: 0.65, performance: 0.85, teaching: 0.40, structure: 0.55 }
    },
    expectedCategories: ['innovoija', 'johtaja'],
    expectedKeywords: ['kehittäjä', 'johtaja', 'yrittäjä', 'startup', 'teknologia', 'päällikkö']
  },

  // 3. Helper + Organizer (Healthcare Administrator type)
  {
    name: "3. Hoiva-Järjestäjä",
    description: "Caring person who excels at organization and administration",
    profile: {
      interests: { people: 0.85, health: 0.78, business: 0.55, analytical: 0.60, education: 0.65, technology: 0.45, creative: 0.30, innovation: 0.40, hands_on: 0.35, arts_culture: 0.25, nature: 0.30, sports: 0.30, writing: 0.50, environment: 0.30 },
      workstyle: { leadership: 0.60, independence: 0.50, teamwork: 0.80, planning: 0.85, problem_solving: 0.65, motivation: 0.70, autonomy: 0.50, social: 0.85, flexibility: 0.45, variety: 0.50, organization: 0.90, precision: 0.80, performance: 0.70, teaching: 0.65, structure: 0.85 }
    },
    expectedCategories: ['auttaja', 'jarjestaja'],
    expectedKeywords: ['hoitaja', 'koordinaattori', 'sihteeri', 'sosiaali', 'hallinto', 'opettaja']
  },

  // 4. Builder + Tech (Mechatronics Engineer type)
  {
    name: "4. Tekninen Rakentaja",
    description: "Hands-on person with strong technical skills",
    profile: {
      interests: { hands_on: 0.88, technology: 0.80, analytical: 0.65, innovation: 0.60, creative: 0.35, people: 0.40, business: 0.35, education: 0.30, health: 0.15, arts_culture: 0.20, nature: 0.45, sports: 0.50, writing: 0.25, environment: 0.40 },
      workstyle: { leadership: 0.40, independence: 0.80, teamwork: 0.55, planning: 0.65, problem_solving: 0.85, motivation: 0.60, autonomy: 0.80, social: 0.40, flexibility: 0.55, variety: 0.65, organization: 0.55, precision: 0.90, performance: 0.80, teaching: 0.30, structure: 0.70 }
    },
    expectedCategories: ['rakentaja', 'innovoija'],
    expectedKeywords: ['asentaja', 'insinööri', 'mekaanikko', 'teknikko', 'kehittäjä', 'sähkö']
  },

  // 5. Leader + Helper (School Principal type)
  {
    name: "5. Johtava Auttaja",
    description: "Leadership-oriented person who wants to help and educate",
    profile: {
      interests: { people: 0.88, education: 0.82, business: 0.60, health: 0.50, innovation: 0.50, technology: 0.40, creative: 0.40, analytical: 0.55, hands_on: 0.25, arts_culture: 0.35, nature: 0.30, sports: 0.40, writing: 0.55, environment: 0.30 },
      workstyle: { leadership: 0.88, independence: 0.60, teamwork: 0.80, planning: 0.85, problem_solving: 0.70, motivation: 0.90, autonomy: 0.65, social: 0.90, flexibility: 0.55, variety: 0.60, organization: 0.80, precision: 0.55, performance: 0.75, teaching: 0.85, structure: 0.70 }
    },
    expectedCategories: ['johtaja', 'auttaja'],
    expectedKeywords: ['johtaja', 'päällikkö', 'rehtori', 'opettaja', 'valmentaja', 'esimies']
  },

  // 6. Environmentalist + Tech (Environmental Engineer type)
  {
    name: "6. Ympäristö-Teknologi",
    description: "Nature lover with technical problem-solving skills",
    profile: {
      interests: { nature: 0.85, environment: 0.88, technology: 0.70, analytical: 0.72, innovation: 0.68, hands_on: 0.55, creative: 0.40, people: 0.50, business: 0.35, education: 0.50, health: 0.35, arts_culture: 0.30, sports: 0.45, writing: 0.45 },
      workstyle: { leadership: 0.50, independence: 0.75, teamwork: 0.60, planning: 0.78, problem_solving: 0.85, motivation: 0.70, autonomy: 0.75, social: 0.55, flexibility: 0.60, variety: 0.65, organization: 0.60, precision: 0.70, performance: 0.65, teaching: 0.45, structure: 0.55 }
    },
    expectedCategories: ['ympariston-puolustaja', 'innovoija'],
    expectedKeywords: ['ympäristö', 'insinööri', 'kestäv', 'tutkija', 'energia', 'kehittäjä']
  },

  // 7. Creative + Tech (UX Designer type)
  {
    name: "7. Luova Teknologi",
    description: "Creative person who loves technology and design",
    profile: {
      interests: { creative: 0.88, technology: 0.80, innovation: 0.82, arts_culture: 0.70, analytical: 0.55, people: 0.60, writing: 0.65, business: 0.45, hands_on: 0.45, education: 0.40, health: 0.15, nature: 0.25, sports: 0.20, environment: 0.25 },
      workstyle: { leadership: 0.45, independence: 0.78, teamwork: 0.65, planning: 0.60, problem_solving: 0.75, motivation: 0.70, autonomy: 0.80, social: 0.60, flexibility: 0.85, variety: 0.85, organization: 0.50, precision: 0.60, performance: 0.70, teaching: 0.40, structure: 0.35 }
    },
    expectedCategories: ['luova', 'innovoija'],
    expectedKeywords: ['suunnittelija', 'kehittäjä', 'ux', 'graafinen', 'peli', 'digitaalinen']
  },

  // 8. Visionary + Leader (CEO type)
  {
    name: "8. Visionääri-Johtaja",
    description: "Strategic thinker with strong leadership abilities",
    profile: {
      interests: { innovation: 0.90, business: 0.85, analytical: 0.78, technology: 0.65, people: 0.70, creative: 0.50, education: 0.45, environment: 0.45, writing: 0.60, hands_on: 0.25, health: 0.25, arts_culture: 0.35, nature: 0.30, sports: 0.35 },
      workstyle: { leadership: 0.95, independence: 0.75, teamwork: 0.70, planning: 0.92, problem_solving: 0.88, motivation: 0.90, autonomy: 0.80, social: 0.75, flexibility: 0.60, variety: 0.70, organization: 0.80, precision: 0.55, performance: 0.90, teaching: 0.55, structure: 0.60 }
    },
    expectedCategories: ['johtaja', 'visionaari'],
    expectedKeywords: ['johtaja', 'toimitusjohtaja', 'strategia', 'päällikkö', 'konsultti', 'kehitys']
  },

  // 9. Builder + Environmentalist (Sustainable Construction type)
  {
    name: "9. Ekologinen Rakentaja",
    description: "Hands-on person passionate about sustainable building",
    profile: {
      interests: { hands_on: 0.85, nature: 0.78, environment: 0.80, technology: 0.55, analytical: 0.45, innovation: 0.55, creative: 0.40, people: 0.45, business: 0.30, education: 0.35, health: 0.25, arts_culture: 0.25, sports: 0.50, writing: 0.25 },
      workstyle: { leadership: 0.40, independence: 0.75, teamwork: 0.60, planning: 0.65, problem_solving: 0.70, motivation: 0.60, autonomy: 0.75, social: 0.50, flexibility: 0.55, variety: 0.60, organization: 0.55, precision: 0.80, performance: 0.75, teaching: 0.35, structure: 0.60 }
    },
    expectedCategories: ['rakentaja', 'ympariston-puolustaja'],
    expectedKeywords: ['rakennus', 'asentaja', 'ympäristö', 'energia', 'metsä', 'maatalous']
  },

  // 10. Analytical + Creative (Data Visualization Specialist type)
  {
    name: "10. Analyyttinen Luova",
    description: "Data-driven person with strong visual/creative skills",
    profile: {
      interests: { analytical: 0.85, creative: 0.78, technology: 0.72, innovation: 0.70, arts_culture: 0.55, writing: 0.60, business: 0.50, people: 0.45, education: 0.45, hands_on: 0.30, health: 0.20, nature: 0.30, sports: 0.25, environment: 0.30 },
      workstyle: { leadership: 0.45, independence: 0.80, teamwork: 0.55, planning: 0.75, problem_solving: 0.88, motivation: 0.65, autonomy: 0.82, social: 0.50, flexibility: 0.70, variety: 0.75, organization: 0.65, precision: 0.80, performance: 0.70, teaching: 0.45, structure: 0.50 }
    },
    expectedCategories: ['innovoija', 'luova', 'visionaari'],
    expectedKeywords: ['analyytikko', 'data', 'suunnittelija', 'kehittäjä', 'tutkija', 'konsultti']
  },

  // 11. Helper + Sports (Sports Therapist/Coach type)
  {
    name: "11. Urheilullinen Auttaja",
    description: "People-person who loves sports and physical wellbeing",
    profile: {
      interests: { people: 0.85, sports: 0.82, health: 0.78, education: 0.65, hands_on: 0.55, nature: 0.50, creative: 0.35, technology: 0.30, business: 0.35, innovation: 0.40, analytical: 0.40, arts_culture: 0.30, writing: 0.40, environment: 0.40 },
      workstyle: { leadership: 0.60, independence: 0.55, teamwork: 0.85, planning: 0.60, problem_solving: 0.60, motivation: 0.90, autonomy: 0.55, social: 0.90, flexibility: 0.65, variety: 0.70, organization: 0.50, precision: 0.50, performance: 0.80, teaching: 0.85, structure: 0.45 }
    },
    expectedCategories: ['auttaja'],
    expectedKeywords: ['valmentaja', 'fysio', 'terapeutti', 'ohjaaja', 'opettaja', 'hoitaja']
  },

  // 12. Organizer + Tech (IT Project Manager type)
  {
    name: "12. IT-Järjestäjä",
    description: "Organized person with tech skills, loves managing projects",
    profile: {
      interests: { technology: 0.78, business: 0.70, analytical: 0.72, innovation: 0.55, people: 0.60, education: 0.45, creative: 0.35, hands_on: 0.35, health: 0.20, arts_culture: 0.25, nature: 0.25, sports: 0.30, writing: 0.50, environment: 0.25 },
      workstyle: { leadership: 0.70, independence: 0.55, teamwork: 0.78, planning: 0.92, problem_solving: 0.75, motivation: 0.70, autonomy: 0.60, social: 0.70, flexibility: 0.50, variety: 0.55, organization: 0.95, precision: 0.85, performance: 0.80, teaching: 0.45, structure: 0.90 }
    },
    expectedCategories: ['jarjestaja', 'johtaja', 'innovoija'],
    expectedKeywords: ['projekti', 'koordinaattori', 'päällikkö', 'IT', 'kehittäjä', 'hallinto']
  },

  // 13. Creative + Business (Marketing Creative type)
  {
    name: "13. Luova Bisnes",
    description: "Creative person with strong business acumen",
    profile: {
      interests: { creative: 0.85, business: 0.80, arts_culture: 0.72, innovation: 0.70, people: 0.65, writing: 0.75, technology: 0.50, analytical: 0.50, education: 0.40, hands_on: 0.30, health: 0.20, nature: 0.25, sports: 0.25, environment: 0.25 },
      workstyle: { leadership: 0.65, independence: 0.70, teamwork: 0.70, planning: 0.70, problem_solving: 0.65, motivation: 0.80, autonomy: 0.75, social: 0.75, flexibility: 0.80, variety: 0.85, organization: 0.55, precision: 0.50, performance: 0.80, teaching: 0.45, structure: 0.40 }
    },
    expectedCategories: ['luova', 'johtaja'],
    expectedKeywords: ['markkinointi', 'suunnittelija', 'brändi', 'sisältö', 'mainost', 'luova']
  },

  // 14. Tech + Helper (Health Tech Specialist type)
  {
    name: "14. Terveys-Teknologi",
    description: "Tech person passionate about healthcare innovation",
    profile: {
      interests: { technology: 0.85, health: 0.78, innovation: 0.80, analytical: 0.75, people: 0.60, education: 0.50, creative: 0.40, business: 0.50, hands_on: 0.40, arts_culture: 0.25, nature: 0.30, sports: 0.35, writing: 0.45, environment: 0.30 },
      workstyle: { leadership: 0.50, independence: 0.75, teamwork: 0.65, planning: 0.70, problem_solving: 0.88, motivation: 0.70, autonomy: 0.78, social: 0.55, flexibility: 0.60, variety: 0.65, organization: 0.65, precision: 0.80, performance: 0.75, teaching: 0.45, structure: 0.55 }
    },
    expectedCategories: ['innovoija', 'visionaari', 'johtaja'],  // Tech-focused profile gets tech/innovation careers
    expectedKeywords: ['kehittäjä', 'analyytikko', 'tutkija', 'johtaja', 'data', 'insinööri']
  },

  // 15. Environmentalist + Helper (Environmental Educator type)
  {
    name: "15. Ympäristö-Kasvattaja",
    description: "Nature lover who wants to educate and help others",
    profile: {
      interests: { nature: 0.88, environment: 0.85, people: 0.78, education: 0.80, health: 0.45, creative: 0.45, innovation: 0.50, technology: 0.40, analytical: 0.50, hands_on: 0.55, business: 0.25, arts_culture: 0.40, sports: 0.45, writing: 0.55 },
      workstyle: { leadership: 0.55, independence: 0.60, teamwork: 0.75, planning: 0.65, problem_solving: 0.60, motivation: 0.80, autonomy: 0.60, social: 0.85, flexibility: 0.65, variety: 0.70, organization: 0.55, precision: 0.50, performance: 0.60, teaching: 0.90, structure: 0.45 }
    },
    expectedCategories: ['ympariston-puolustaja', 'auttaja'],
    expectedKeywords: ['ympäristö', 'opettaja', 'ohjaaja', 'luonto', 'biologi', 'kasvattaja']
  },

  // 16. Analytical + Leader (Management Consultant type)
  {
    name: "16. Analyyttinen Johtaja",
    description: "Data-driven leader who excels at strategy",
    profile: {
      interests: { analytical: 0.88, business: 0.85, innovation: 0.72, technology: 0.65, people: 0.65, education: 0.45, creative: 0.40, writing: 0.60, hands_on: 0.25, health: 0.25, arts_culture: 0.30, nature: 0.25, sports: 0.35, environment: 0.30 },
      workstyle: { leadership: 0.88, independence: 0.70, teamwork: 0.70, planning: 0.90, problem_solving: 0.92, motivation: 0.80, autonomy: 0.75, social: 0.70, flexibility: 0.55, variety: 0.65, organization: 0.82, precision: 0.78, performance: 0.88, teaching: 0.50, structure: 0.70 }
    },
    expectedCategories: ['johtaja', 'visionaari'],
    expectedKeywords: ['johtaja', 'konsultti', 'analyytikko', 'päällikkö', 'strategia', 'kehitys']
  },

  // 17. Builder + Creative (Craftsman/Artisan type)
  {
    name: "17. Luova Käsityöläinen",
    description: "Hands-on creative who makes beautiful things",
    profile: {
      interests: { hands_on: 0.90, creative: 0.82, arts_culture: 0.75, innovation: 0.55, technology: 0.45, nature: 0.50, people: 0.45, business: 0.40, analytical: 0.35, education: 0.40, health: 0.20, sports: 0.40, writing: 0.35, environment: 0.40 },
      workstyle: { leadership: 0.35, independence: 0.88, teamwork: 0.45, planning: 0.55, problem_solving: 0.65, motivation: 0.60, autonomy: 0.90, social: 0.45, flexibility: 0.70, variety: 0.75, organization: 0.50, precision: 0.85, performance: 0.70, teaching: 0.40, structure: 0.45 }
    },
    expectedCategories: ['rakentaja', 'luova'],
    expectedKeywords: ['puuseppä', 'suunnittelija', 'käsityö', 'metalli', 'taiteilija', 'muotoilija']
  },

  // 18. Visionary + Environmentalist (Sustainability Strategist type)
  {
    name: "18. Kestävyys-Visionääri",
    description: "Future-focused person passionate about sustainability",
    profile: {
      interests: { environment: 0.88, innovation: 0.85, nature: 0.80, analytical: 0.70, technology: 0.60, business: 0.55, people: 0.55, education: 0.55, creative: 0.45, writing: 0.55, hands_on: 0.40, health: 0.35, arts_culture: 0.35, sports: 0.35 },
      workstyle: { leadership: 0.70, independence: 0.72, teamwork: 0.65, planning: 0.85, problem_solving: 0.80, motivation: 0.78, autonomy: 0.72, social: 0.65, flexibility: 0.60, variety: 0.70, organization: 0.65, precision: 0.60, performance: 0.70, teaching: 0.55, structure: 0.55 }
    },
    expectedCategories: ['visionaari', 'ympariston-puolustaja'],
    expectedKeywords: ['ympäristö', 'kestäv', 'strategia', 'tutkija', 'kehitys', 'konsultti']
  },

  // 19. Helper + Organizer + Tech (Healthcare IT Coordinator type)
  {
    name: "19. Terveys-IT-Koordinaattori",
    description: "Organized helper who bridges healthcare and technology",
    profile: {
      interests: { health: 0.80, technology: 0.75, people: 0.78, analytical: 0.65, business: 0.55, education: 0.55, innovation: 0.55, creative: 0.30, hands_on: 0.35, arts_culture: 0.25, nature: 0.30, sports: 0.30, writing: 0.45, environment: 0.30 },
      workstyle: { leadership: 0.55, independence: 0.55, teamwork: 0.80, planning: 0.85, problem_solving: 0.72, motivation: 0.70, autonomy: 0.55, social: 0.78, flexibility: 0.50, variety: 0.55, organization: 0.90, precision: 0.82, performance: 0.75, teaching: 0.55, structure: 0.85 }
    },
    expectedCategories: ['auttaja', 'jarjestaja', 'innovoija'],
    expectedKeywords: ['koordinaattori', 'hoitaja', 'IT', 'hallinto', 'terveys', 'kehittäjä']
  },

  // 20. All-rounder Leader (General Manager type)
  {
    name: "20. Monipuolinen Johtaja",
    description: "Well-rounded leader with diverse skills",
    profile: {
      interests: { business: 0.82, people: 0.78, innovation: 0.72, technology: 0.60, analytical: 0.65, creative: 0.50, education: 0.55, environment: 0.45, health: 0.40, hands_on: 0.40, arts_culture: 0.40, nature: 0.40, sports: 0.45, writing: 0.55 },
      workstyle: { leadership: 0.92, independence: 0.65, teamwork: 0.80, planning: 0.85, problem_solving: 0.78, motivation: 0.88, autonomy: 0.70, social: 0.82, flexibility: 0.65, variety: 0.75, organization: 0.78, precision: 0.60, performance: 0.85, teaching: 0.60, structure: 0.65 }
    },
    expectedCategories: ['johtaja'],
    expectedKeywords: ['johtaja', 'päällikkö', 'esimies', 'toimitusjohtaja', 'rehtori', 'manageri']
  }
];

const COHORTS = ['YLA', 'TASO2_LUKIO', 'TASO2_AMIS', 'NUORI'];

// ==================== RUN ALL TESTS ====================

console.log('█'.repeat(105));
console.log('   COMPREHENSIVE TEST SUITE: 20 REALISTIC MIXED PERSONALITIES × 4 COHORTS = 80 TESTS');
console.log('█'.repeat(105));

const allResults = [];

for (const cohort of COHORTS) {
  console.log(`\n${'═'.repeat(105)}`);
  console.log(`COHORT: ${cohort}`);
  console.log('═'.repeat(105));

  const cohortResults = [];

  for (const personality of PERSONALITIES) {
    const adjustedProfile = JSON.parse(JSON.stringify(personality.profile));

    // Cohort-specific adjustments
    if (cohort === 'YLA') {
      Object.keys(adjustedProfile.interests).forEach(k => {
        adjustedProfile.interests[k] = Math.min(1, adjustedProfile.interests[k] * 1.02);
      });
    } else if (cohort === 'NUORI') {
      adjustedProfile.workstyle.leadership = Math.min(1, adjustedProfile.workstyle.leadership * 1.05);
      adjustedProfile.interests.business = Math.min(1, adjustedProfile.interests.business * 1.05);
    }

    const result = runTest(adjustedProfile, personality.expectedCategories, personality.expectedKeywords, false);

    const status = result.pass ? '✅' : '❌';
    console.log(`${status} ${personality.name.padEnd(35)} | Cat: ${result.categoryMatch}/8 | KW: ${result.keywordMatch}/${personality.expectedKeywords.length} | Top: ${result.topCategories.slice(0,2).join(',')}`);

    cohortResults.push({
      personality: personality.name,
      cohort,
      ...result
    });
  }

  const passedInCohort = cohortResults.filter(r => r.pass).length;
  console.log(`\n   ${cohort} Summary: ${passedInCohort}/20 passed`);

  allResults.push(...cohortResults);
}

// ==================== DETAILED FAILURE ANALYSIS ====================

const failures = allResults.filter(r => !r.pass);
if (failures.length > 0) {
  console.log(`\n${'═'.repeat(105)}`);
  console.log(`DETAILED FAILURE ANALYSIS (${failures.length} failures)`);
  console.log('═'.repeat(105));

  // Group by personality
  const failuresByPerson = {};
  failures.forEach(f => {
    if (!failuresByPerson[f.personality]) failuresByPerson[f.personality] = [];
    failuresByPerson[f.personality].push(f);
  });

  for (const [person, fails] of Object.entries(failuresByPerson)) {
    const personality = PERSONALITIES.find(p => p.name === person);
    console.log(`\n❌ ${person} (${fails.length} failures in: ${fails.map(f => f.cohort).join(', ')})`);
    console.log(`   Expected: ${personality.expectedCategories.join(', ')}`);
    console.log(`   Got: ${fails[0].topCategories.join(', ')}`);
    console.log(`   Top 5: ${fails[0].top5.join(', ')}`);
  }
}

// ==================== FINAL SUMMARY ====================

console.log('\n\n' + '█'.repeat(105));
console.log('                                    FINAL SUMMARY');
console.log('█'.repeat(105));

// Summary table
console.log('\n┌' + '─'.repeat(103) + '┐');
console.log('│ Personality                              │  YLA  │ LUKIO │ AMIS  │ NUORI │ Total │');
console.log('├' + '─'.repeat(103) + '┤');

for (const personality of PERSONALITIES) {
  const name = personality.name.substring(0, 40).padEnd(40);
  const results = COHORTS.map(cohort => {
    const r = allResults.find(x => x.personality === personality.name && x.cohort === cohort);
    return r?.pass ? '  ✅  ' : '  ❌  ';
  });
  const total = allResults.filter(x => x.personality === personality.name && x.pass).length;
  console.log(`│ ${name} │${results.join('│')}│  ${total}/4  │`);
}

console.log('├' + '─'.repeat(103) + '┤');

// Totals row
const totals = COHORTS.map(cohort => {
  const passed = allResults.filter(x => x.cohort === cohort && x.pass).length;
  return ` ${String(passed).padStart(2)}/20 `;
});
const grandTotal = allResults.filter(x => x.pass).length;
console.log(`│ ${'TOTAL'.padEnd(40)} │${totals.join('│')}│ ${grandTotal}/80 │`);
console.log('└' + '─'.repeat(103) + '┘');

// Final verdict
console.log(`\n${'═'.repeat(105)}`);
const passRate = ((grandTotal / 80) * 100).toFixed(1);
if (grandTotal === 80) {
  console.log(`🎉 PERFECT SCORE: ALL 80/80 TESTS PASSED (${passRate}%)`);
} else if (grandTotal >= 72) {
  console.log(`✅ EXCELLENT: ${grandTotal}/80 TESTS PASSED (${passRate}%)`);
} else if (grandTotal >= 64) {
  console.log(`⚠️  GOOD: ${grandTotal}/80 TESTS PASSED (${passRate}%)`);
} else {
  console.log(`❌ NEEDS WORK: ${grandTotal}/80 TESTS PASSED (${passRate}%)`);
}
console.log('═'.repeat(105) + '\n');
