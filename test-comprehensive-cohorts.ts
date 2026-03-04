/**
 * COMPREHENSIVE COHORT TESTING
 *
 * Tests 5 diverse personality profiles across all 3 cohorts (15 total tests)
 * Verifies results page accuracy, alignment, and sensibility
 */

import { rankCareers, generateUserProfile } from './lib/scoring/scoringEngine';
import { calculateEducationPath } from './lib/scoring/educationPath';
import type { Cohort, TestAnswer } from './lib/scoring/types';

// Helper to create complete answer sets
function createAnswerSet(answers: { [key: number]: number }, defaultScore: number = 3): TestAnswer[] {
  const result: TestAnswer[] = [];
  for (let i = 0; i < 30; i++) {
    result.push({
      questionIndex: i,
      score: answers[i] !== undefined ? answers[i] : defaultScore
    });
  }
  return result;
}

// ===========================
// YLA COHORT (13-16 years)
// ===========================

// YLA Profile 1: Creative Artist (Luova)
const yla_creative = createAnswerSet({
  0: 2,   // Tech - not interested
  1: 3,   // Problem solving - moderate
  2: 5,   // Creative (stories, art, music) - LOVES IT
  3: 2,   // Hands-on building - not really
  4: 3,   // Nature/animals - moderate
  5: 4,   // Helping people - yes
  6: 3,   // Teaching - moderate
  7: 3,   // Planning - moderate
  8: 3,   // Instructions - can follow
  9: 3,   // Analytical - moderate
  10: 2,  // Healthcare - not main interest
  11: 2,  // Physical work - prefers creative
  12: 3,  // Biology - moderate
  13: 2,  // Sales - not interested
  14: 4,  // Languages - interested
  15: 4,  // Teamwork - yes
  16: 2,  // Structure - prefers flexibility
  17: 3,  // Outdoor - moderate
  18: 2,  // Focus (reverse) - can focus well
  19: 4,  // Independence - likes autonomy
  20: 3,  // Stress (reverse) - handles ok
  21: 4,  // Achievement - wants to succeed
  22: 3,  // Precision - moderate
  23: 3,  // Efficiency - moderate
  24: 5,  // Variety - loves diverse tasks
  25: 4,  // Recognition (reverse) - likes appreciation
  26: 4,  // Social impact - cares about meaning
  27: 3,  // Financial - moderate
  28: 3,  // Advancement - moderate
  29: 3,  // Stability - moderate
});

// YLA Profile 2: Tech Enthusiast (Innovoija)
const yla_tech = createAnswerSet({
  0: 5,   // Tech/gaming - LOVES IT
  1: 5,   // Problem solving - excellent
  2: 3,   // Creative - moderate
  3: 3,   // Hands-on - some interest
  4: 2,   // Nature - not priority
  5: 2,   // Helping - prefers tech
  6: 2,   // Teaching - not interested
  7: 4,   // Planning - plans projects
  8: 3,   // Instructions - can follow
  9: 5,   // Analytical - very logical
  10: 1,  // Healthcare - not interested
  11: 2,  // Physical - prefers desk
  12: 3,  // Biology - moderate
  13: 1,  // Sales - dislikes
  14: 3,  // Languages - moderate
  15: 2,  // Teamwork - prefers solo
  16: 4,  // Structure - likes clear tasks
  17: 1,  // Outdoor - prefers indoors
  18: 1,  // Focus (reverse) - excellent focus
  19: 5,  // Independence - very independent
  20: 2,  // Stress (reverse) - handles well
  21: 5,  // Achievement - highly driven
  22: 5,  // Precision - detail-oriented
  23: 4,  // Efficiency - optimizes
  24: 3,  // Variety - moderate
  25: 2,  // Recognition (reverse) - doesn't need praise
  26: 2,  // Social impact - not priority
  27: 4,  // Financial - values income
  28: 4,  // Advancement - career growth
  29: 3,  // Stability - moderate
});

// YLA Profile 3: Social Helper (Auttaja)
const yla_helper = createAnswerSet({
  0: 2,   // Tech - not main interest
  1: 3,   // Problem solving - moderate
  2: 3,   // Creative - some
  3: 2,   // Hands-on - not really
  4: 4,   // Nature/animals - cares about
  5: 5,   // Helping people - LOVES IT
  6: 5,   // Teaching - enjoys sharing
  7: 4,   // Planning - organized helper
  8: 4,   // Instructions - follows well
  9: 3,   // Analytical - moderate
  10: 5,  // Healthcare - very interested
  11: 3,  // Physical - moderate
  12: 4,  // Biology - interested
  13: 3,  // Sales - moderate
  14: 4,  // Languages - good at
  15: 5,  // Teamwork - loves collaboration
  16: 3,  // Structure - moderate
  17: 3,  // Outdoor - moderate
  18: 3,  // Focus (reverse) - can focus
  19: 2,  // Independence - prefers teamwork
  20: 3,  // Stress (reverse) - handles ok
  21: 4,  // Achievement - wants to succeed
  22: 4,  // Precision - careful
  23: 3,  // Efficiency - moderate
  24: 4,  // Variety - likes diverse tasks
  25: 3,  // Recognition (reverse) - moderate
  26: 5,  // Social impact - VERY important
  27: 3,  // Financial - moderate
  28: 3,  // Advancement - moderate
  29: 4,  // Stability - values security
});

// YLA Profile 4: Hands-On Builder (Rakentaja)
const yla_builder = createAnswerSet({
  0: 2,   // Tech/gaming - not main thing
  1: 3,   // Problem solving - practical
  2: 2,   // Creative - not primary
  3: 5,   // Hands-on - LOVES building/fixing
  4: 3,   // Nature - moderate
  5: 3,   // Helping - moderate
  6: 2,   // Teaching - not interested
  7: 4,   // Planning - plans projects
  8: 4,   // Instructions - follows well
  9: 3,   // Analytical - practical thinking
  10: 2,  // Healthcare - not interested
  11: 5,  // Physical work - loves it
  12: 3,  // Biology - moderate
  13: 2,  // Sales - not interested
  14: 2,  // Languages - not priority
  15: 3,  // Teamwork - works in crews
  16: 4,  // Structure - likes clear tasks
  17: 4,  // Outdoor - enjoys outside
  18: 3,  // Focus (reverse) - can focus
  19: 3,  // Independence - moderate
  20: 2,  // Stress (reverse) - handles well
  21: 4,  // Achievement - wants mastery
  22: 4,  // Precision - careful work
  23: 4,  // Efficiency - gets job done
  24: 3,  // Variety - moderate
  25: 3,  // Recognition (reverse) - moderate
  26: 3,  // Social impact - moderate
  27: 4,  // Financial - wants good income
  28: 3,  // Advancement - moderate
  29: 4,  // Stability - values security
});

// YLA Profile 5: Organized Planner (Järjestäjä)
const yla_organizer = createAnswerSet({
  0: 3,   // Tech - uses tools
  1: 4,   // Problem solving - systematic
  2: 2,   // Creative - not primary
  3: 2,   // Hands-on - prefers planning
  4: 2,   // Nature - not priority
  5: 3,   // Helping - moderate
  6: 3,   // Teaching - moderate
  7: 5,   // Planning - LOVES organizing
  8: 5,   // Instructions - follows perfectly
  9: 4,   // Analytical - logical
  10: 2,  // Healthcare - not main interest
  11: 2,  // Physical - prefers desk
  12: 3,  // Biology - moderate
  13: 3,  // Sales - moderate
  14: 4,  // Languages - good at
  15: 4,  // Teamwork - coordinates well
  16: 5,  // Structure - NEEDS clear structure
  17: 2,  // Outdoor - prefers indoors
  18: 1,  // Focus (reverse) - excellent focus
  19: 3,  // Independence - moderate
  20: 2,  // Stress (reverse) - handles well
  21: 5,  // Achievement - highly driven
  22: 5,  // Precision - very detail-oriented
  23: 5,  // Efficiency - optimizes everything
  24: 2,  // Variety - prefers routine
  25: 3,  // Recognition (reverse) - moderate
  26: 3,  // Social impact - moderate
  27: 4,  // Financial - values income
  28: 4,  // Advancement - career oriented
  29: 5,  // Stability - highly values security
});

// ===========================
// TASO2 COHORT (16-19 years)
// ===========================

// TASO2 Profile 1: Future Engineer (Innovoija)
const taso2_engineer = createAnswerSet({
  0: 5,   // Software/data - very interested
  1: 3,   // Healthcare - not path
  2: 3,   // Finance - moderate
  3: 3,   // Creative - some design interest
  4: 5,   // Engineering/R&D - LOVES IT
  5: 3,   // Education - moderate
  6: 3,   // International business - moderate
  7: 4,   // Science - interested
  8: 3,   // Arts - moderate
  9: 3,   // Writing - moderate
  10: 2,  // Law - not interested
  11: 3,  // Construction - some interest
  12: 2,  // Sales - not main thing
  13: 3,  // Office - can do
  14: 3,  // Support people - moderate
  15: 3,  // Entrepreneurship - maybe
  16: 3,  // Shift work - flexible
  17: 3,  // Client work - moderate
  18: 2,  // Detail (reverse) - very detailed
  19: 3,  // Fast-paced - moderate
  20: 4,  // Variety - likes different projects
  21: 2,  // Frustration (reverse) - patient
  22: 4,  // Aesthetics - design matters
  23: 4,  // Recognition - likes achievement
  24: 5,  // Growth - wants to learn
  25: 4,  // Impact - wants meaningful work
  26: 4,  // Financial - important
  27: 3,  // International - interested
  28: 4,  // Balance - values wellbeing
  29: 3,  // Travel - moderate
});

// TASO2 Profile 2: Healthcare Professional (Auttaja)
const taso2_healthcare = createAnswerSet({
  0: 2,   // Software - not path
  1: 5,   // Healthcare - VERY interested
  2: 2,   // Finance - not interested
  3: 2,   // Creative - not primary
  4: 2,   // Engineering - not interested
  5: 4,   // Education - interested in teaching
  6: 2,   // International business - not path
  7: 4,   // Science - biology/chemistry
  8: 2,   // Arts - not primary
  9: 3,   // Writing - moderate
  10: 2,  // Law - not interested
  11: 1,  // Construction - not interested
  12: 2,  // Sales - not interested
  13: 3,  // Office - can do
  14: 5,  // Support people - LOVES helping
  15: 2,  // Entrepreneurship - prefers stable
  16: 4,  // Shift work - willing (hospitals)
  17: 5,  // Client work - loves patient contact
  18: 1,  // Detail (reverse) - very detail-oriented
  19: 4,  // Fast-paced - can handle
  20: 3,  // Variety - moderate
  21: 1,  // Frustration (reverse) - very patient
  22: 3,  // Aesthetics - moderate
  23: 3,  // Recognition - moderate
  24: 5,  // Growth - wants to develop
  25: 5,  // Impact - VERY important
  26: 3,  // Financial - moderate
  27: 3,  // International - moderate
  28: 4,  // Balance - important
  29: 2,  // Travel - prefers local
});

// TASO2 Profile 3: Business Leader (Johtaja)
const taso2_business = createAnswerSet({
  0: 3,   // Software - tools
  1: 2,   // Healthcare - not path
  2: 5,   // Finance - very interested
  3: 3,   // Creative - marketing interest
  4: 2,   // Engineering - not path
  5: 3,   // Education - some interest
  6: 5,   // International business - LOVES IT
  7: 3,   // Science - moderate
  8: 3,   // Arts - moderate
  9: 4,   // Writing - business communication
  10: 3,  // Law - some interest
  11: 1,  // Construction - not interested
  12: 4,  // Sales - interested
  13: 4,  // Office - yes
  14: 4,  // Support people - leadership
  15: 5,  // Entrepreneurship - VERY interested
  16: 3,  // Shift work - flexible
  17: 5,  // Client work - loves it
  18: 2,  // Detail (reverse) - detail-oriented
  19: 5,  // Fast-paced - thrives on it
  20: 5,  // Variety - loves diverse tasks
  21: 2,  // Frustration (reverse) - persistent
  22: 4,  // Aesthetics - brand matters
  23: 5,  // Recognition - likes achievement
  24: 5,  // Growth - highly ambitious
  25: 4,  // Impact - wants to make difference
  26: 5,  // Financial - very important
  27: 5,  // International - loves global
  28: 3,  // Balance - moderate
  29: 5,  // Travel - loves it
});

// TASO2 Profile 4: Creative Designer (Luova)
const taso2_designer = createAnswerSet({
  0: 3,   // Software - design tools
  1: 2,   // Healthcare - not path
  2: 2,   // Finance - not interested
  3: 5,   // Creative work - LOVES design
  4: 2,   // Engineering - not path
  5: 3,   // Education - moderate
  6: 2,   // International business - not path
  7: 2,   // Science - not interested
  8: 5,   // Arts/visual - VERY interested
  9: 4,   // Writing - creative writing
  10: 2,  // Law - not interested
  11: 1,  // Construction - not interested
  12: 3,  // Sales - portfolio selling
  13: 3,  // Office - can do
  14: 3,  // Support people - moderate
  15: 4,  // Entrepreneurship - freelance interest
  16: 4,  // Shift work - flexible creative
  17: 4,  // Client work - enjoys collaboration
  18: 2,  // Detail (reverse) - very detailed
  19: 3,  // Fast-paced - moderate
  20: 5,  // Variety - loves diverse projects
  21: 3,  // Frustration (reverse) - moderate
  22: 5,  // Aesthetics - VERY important
  23: 4,  // Recognition - likes appreciation
  24: 5,  // Growth - wants to develop skills
  25: 4,  // Impact - meaningful work
  26: 3,  // Financial - moderate
  27: 4,  // International - design is global
  28: 5,  // Balance - very important
  29: 4,  // Travel - interested
});

// TASO2 Profile 5: Environmental Activist (Ympäristön-puolustaja)
const taso2_environmental = createAnswerSet({
  0: 2,   // Software - not main thing
  1: 2,   // Healthcare - not primary
  2: 2,   // Finance - not interested
  3: 3,   // Creative - some
  4: 3,   // Engineering - environmental tech
  5: 3,   // Education - environmental education
  6: 3,   // International - global issues
  7: 5,   // Science - biology/ecology
  8: 3,   // Arts - moderate
  9: 4,   // Writing - advocacy
  10: 3,  // Law - environmental law interest
  11: 3,  // Construction - green building
  12: 2,  // Sales - not interested
  13: 2,  // Office - prefers field
  14: 4,  // Support people - community work
  15: 3,  // Entrepreneurship - moderate
  16: 3,  // Shift work - flexible
  17: 3,  // Client work - moderate
  18: 2,  // Detail (reverse) - detailed research
  19: 3,  // Fast-paced - moderate
  20: 4,  // Variety - diverse projects
  21: 2,  // Frustration (reverse) - persistent
  22: 4,  // Aesthetics - nature beauty
  23: 3,  // Recognition - moderate
  24: 5,  // Growth - wants to learn
  25: 5,  // Impact - VERY important
  26: 2,  // Financial - not priority
  27: 4,  // International - global issues
  28: 4,  // Balance - values wellbeing
  29: 3,  // Travel - moderate
});

// ===========================
// NUORI COHORT (18-25+ years)
// ===========================

// NUORI Profile 1: Software Developer (Innovoija)
const nuori_developer = createAnswerSet({
  0: 5,   // Software/data - career path
  1: 1,   // Healthcare - not path
  2: 3,   // Finance - understands
  3: 2,   // Creative - some
  4: 4,   // Engineering/R&D - interested
  5: 2,   // Education - not main
  6: 3,   // Research - some interest
  7: 3,   // Business consulting - moderate
  8: 3,   // Hands-on - practical coding
  9: 3,   // Leadership - moderate
  10: 2,  // Writing - documentation
  11: 2,  // Physical - prefers desk
  12: 2,  // Social work - not path
  13: 2,  // Construction - not interested
  14: 3,  // Teamwork - scrum teams
  15: 4,  // Precision - code quality
  16: 2,  // Client fatigue (reverse) - moderate
  17: 2,  // Outdoor - prefers indoors
  18: 4,  // Innovation - loves new tech
  19: 3,  // Pace stress (reverse) - handles ok
  20: 3,  // Traditional values - moderate
  21: 3,  // Stability - moderate
  22: 5,  // Financial - important
  23: 4,  // Independence - likes autonomy
  24: 2,  // Routine - dislikes
  25: 3,  // Management - maybe later
  26: 4,  // Flexibility - remote work
  27: 3,  // Global - remote work
  28: 4,  // Impact - meaningful products
  29: 2,  // Culture (reverse) - culture important
});

// NUORI Profile 2: Marketing Manager (Johtaja)
const nuori_marketing = createAnswerSet({
  0: 3,   // Software - tools
  1: 2,   // Healthcare - not path
  2: 4,   // Finance - budget management
  3: 5,   // Creative - campaign creation
  4: 2,   // Engineering - not path
  5: 3,   // Education - training teams
  6: 3,   // Research - market research
  7: 5,   // Business consulting - strategy
  8: 2,   // Hands-on - prefers strategy
  9: 5,   // Leadership - loves leading
  10: 4,  // Writing - marketing copy
  11: 1,  // Physical - desk work
  12: 3,  // Social work - moderate
  13: 2,  // Construction - not interested
  14: 5,  // Teamwork - leads teams
  15: 4,  // Precision - brand standards
  16: 1,  // Client fatigue (reverse) - energized by people
  17: 2,  // Outdoor - office/meetings
  18: 5,  // Innovation - new campaigns
  19: 1,  // Pace stress (reverse) - thrives on pressure
  20: 3,  // Traditional values - moderate
  21: 3,  // Stability - moderate
  22: 5,  // Financial - high priority
  23: 4,  // Independence - strategic autonomy
  24: 1,  // Routine - dislikes monotony
  25: 5,  // Management - loves it
  26: 5,  // Flexibility - adaptable
  27: 5,  // Global - international brands
  28: 4,  // Impact - brand influence
  29: 1,  // Culture (reverse) - culture very important
});

// NUORI Profile 3: Nurse (Auttaja)
const nuori_nurse = createAnswerSet({
  0: 2,   // Software - not path
  1: 5,   // Healthcare - career path
  2: 2,   // Finance - not interested
  3: 2,   // Creative - not primary
  4: 2,   // Engineering - not path
  5: 4,   // Education - patient education
  6: 2,   // Research - some interest
  7: 2,   // Business - not interested
  8: 4,   // Hands-on - patient care
  9: 3,   // Leadership - charge nurse
  10: 3,  // Writing - patient notes
  11: 3,  // Physical - on feet all day
  12: 5,  // Social work - helping people
  13: 2,  // Construction - not interested
  14: 5,  // Teamwork - healthcare teams
  15: 5,  // Precision - medication accuracy
  16: 2,  // Client fatigue (reverse) - loves patients
  17: 2,  // Outdoor - hospital/clinic
  18: 3,  // Innovation - new treatments
  19: 2,  // Pace stress (reverse) - handles pressure
  20: 4,  // Traditional values - healthcare values
  21: 4,  // Stability - values security
  22: 4,  // Financial - decent income
  23: 3,  // Independence - follows protocols
  24: 3,  // Routine - some routine ok
  25: 2,  // Management - prefers patient care
  26: 4,  // Flexibility - shift flexibility
  27: 2,  // Global - local care
  28: 5,  // Impact - helping people
  29: 1,  // Culture (reverse) - culture very important
});

// NUORI Profile 4: Construction Project Manager (Rakentaja)
const nuori_construction = createAnswerSet({
  0: 2,   // Software - not path
  1: 1,   // Healthcare - not interested
  2: 4,   // Finance - project budgets
  3: 2,   // Creative - not primary
  4: 4,   // Engineering - construction engineering
  5: 2,   // Education - not interested
  6: 2,   // Research - not path
  7: 3,   // Business - project management
  8: 5,   // Hands-on - LOVES building
  9: 4,   // Leadership - project leadership
  10: 2,  // Writing - reports
  11: 5,  // Physical - active work
  12: 2,  // Social work - not path
  13: 5,  // Construction - career path
  14: 4,  // Teamwork - construction crews
  15: 5,  // Precision - safety standards
  16: 3,  // Client fatigue (reverse) - moderate
  17: 5,  // Outdoor - loves working outside
  18: 3,  // Innovation - new methods
  19: 2,  // Pace stress (reverse) - handles pressure
  20: 4,  // Traditional values - craftsmanship
  21: 4,  // Stability - secure industry
  22: 5,  // Financial - good income
  23: 3,  // Independence - moderate
  24: 3,  // Routine - projects vary
  25: 4,  // Management - project management
  26: 3,  // Flexibility - moderate
  27: 2,  // Global - local projects
  28: 3,  // Impact - building communities
  29: 3,  // Culture (reverse) - moderate
});

// NUORI Profile 5: Data Analyst (Järjestäjä)
const nuori_analyst = createAnswerSet({
  0: 5,   // Software/data - career path
  1: 2,   // Healthcare - not path
  2: 5,   // Finance - financial analysis
  3: 2,   // Creative - data visualization
  4: 3,   // Engineering - data engineering
  5: 2,   // Education - not main
  6: 4,   // Research - data research
  7: 4,   // Business consulting - business intelligence
  8: 2,   // Hands-on - desk work
  9: 3,   // Leadership - moderate
  10: 3,  // Writing - reports
  11: 1,  // Physical - desk work
  12: 2,  // Social work - not path
  13: 2,  // Construction - not interested
  14: 3,  // Teamwork - moderate
  15: 5,  // Precision - data accuracy critical
  16: 4,  // Client fatigue (reverse) - prefers data
  17: 1,  // Outdoor - prefers indoors
  18: 4,  // Innovation - new analytics methods
  19: 3,  // Pace stress (reverse) - handles deadlines
  20: 3,  // Traditional values - moderate
  21: 4,  // Stability - values security
  22: 5,  // Financial - high priority
  23: 4,  // Independence - independent analysis
  24: 3,  // Routine - some routine ok
  25: 2,  // Management - prefers analysis
  26: 4,  // Flexibility - remote work
  27: 3,  // Global - remote work
  28: 3,  // Impact - data-driven decisions
  29: 3,  // Culture (reverse) - moderate
});

// ===========================
// TEST EXECUTION
// ===========================

interface TestResult {
  profile: string;
  cohort: string;
  category: string;
  categoryScore: number;
  educationPath?: string;
  pathConfidence?: string;
  topCareers: string[];
  topStrengths: string[];
  makesense: boolean;
  issues: string[];
}

const tests: Array<{ name: string; answers: TestAnswer[]; cohort: Cohort; expectedCategory: string }> = [
  // YLA Tests
  { name: "YLA: Creative Artist", answers: yla_creative, cohort: 'YLA', expectedCategory: 'luova' },
  { name: "YLA: Tech Enthusiast", answers: yla_tech, cohort: 'YLA', expectedCategory: 'innovoija' },
  { name: "YLA: Social Helper", answers: yla_helper, cohort: 'YLA', expectedCategory: 'auttaja' },
  { name: "YLA: Hands-On Builder", answers: yla_builder, cohort: 'YLA', expectedCategory: 'rakentaja' },
  { name: "YLA: Organized Planner", answers: yla_organizer, cohort: 'YLA', expectedCategory: 'jarjestaja' },

  // TASO2 Tests
  { name: "TASO2: Future Engineer", answers: taso2_engineer, cohort: 'TASO2', expectedCategory: 'innovoija' },
  { name: "TASO2: Healthcare Professional", answers: taso2_healthcare, cohort: 'TASO2', expectedCategory: 'auttaja' },
  { name: "TASO2: Business Leader", answers: taso2_business, cohort: 'TASO2', expectedCategory: 'johtaja' },
  { name: "TASO2: Creative Designer", answers: taso2_designer, cohort: 'TASO2', expectedCategory: 'luova' },
  { name: "TASO2: Environmental Activist", answers: taso2_environmental, cohort: 'TASO2', expectedCategory: 'ympariston-puolustaja' },

  // NUORI Tests
  { name: "NUORI: Software Developer", answers: nuori_developer, cohort: 'NUORI', expectedCategory: 'innovoija' },
  { name: "NUORI: Marketing Manager", answers: nuori_marketing, cohort: 'NUORI', expectedCategory: 'johtaja' },
  { name: "NUORI: Nurse", answers: nuori_nurse, cohort: 'NUORI', expectedCategory: 'auttaja' },
  { name: "NUORI: Construction PM", answers: nuori_construction, cohort: 'NUORI', expectedCategory: 'rakentaja' },
  { name: "NUORI: Data Analyst", answers: nuori_analyst, cohort: 'NUORI', expectedCategory: 'jarjestaja' },
];

console.log('='.repeat(100));
console.log('COMPREHENSIVE COHORT TESTING - 15 Diverse Personality Profiles');
console.log('='.repeat(100));
console.log('');

const results: TestResult[] = [];

tests.forEach((test, index) => {
  const userProfile = generateUserProfile(test.answers, test.cohort);
  const topCareers = rankCareers(test.answers, test.cohort, 5);
  const educationPath = test.cohort !== 'NUORI' ? calculateEducationPath(test.answers, test.cohort) : null;

  const primaryCategory = userProfile.primaryCategory || 'none';
  const categoryScore = userProfile.categoryAffinities?.find(c => c.category === primaryCategory)?.score || 0;

  const result: TestResult = {
    profile: test.name,
    cohort: test.cohort,
    category: primaryCategory,
    categoryScore,
    educationPath: educationPath?.primary,
    pathConfidence: educationPath?.confidence,
    topCareers: topCareers.slice(0, 5).map(c => `${c.title} (${c.category})`),
    topStrengths: userProfile.topStrengths || [],
    makesense: true,
    issues: []
  };

  // Validate: Does category make sense?
  if (primaryCategory === 'none' || categoryScore < 40) {
    result.makesense = false;
    result.issues.push(`⚠️ Low category confidence: ${primaryCategory} (${categoryScore}%)`);
  }

  // Validate: Do careers match category?
  const careerCategories = topCareers.slice(0, 3).map(c => c.category);
  const categoryMatches = careerCategories.filter(cat => cat === primaryCategory).length;
  if (categoryMatches === 0) {
    result.issues.push(`⚠️ Career mismatch: Top 3 careers are ${careerCategories.join(', ')} but category is ${primaryCategory}`);
  }

  // Validate: Does education path make sense for category?
  if (educationPath) {
    const academicCategories = ['auttaja', 'innovoija', 'visionaari', 'luova'];
    const vocationalCategories = ['rakentaja', 'jarjestaja'];

    if (academicCategories.includes(primaryCategory) && educationPath.primary === 'ammattikoulu') {
      result.issues.push(`⚠️ Path mismatch: ${primaryCategory} typically needs lukio, got ${educationPath.primary}`);
    }
    if (vocationalCategories.includes(primaryCategory) && educationPath.primary === 'lukio' && categoryScore > 70) {
      result.issues.push(`⚠️ Path note: Strong ${primaryCategory} (${categoryScore}%) might benefit from ammattikoulu`);
    }
  }

  if (result.issues.length === 0) {
    result.issues.push('✅ All validations passed');
  }

  results.push(result);
});

// Print results by cohort
['YLA', 'TASO2', 'NUORI'].forEach(cohortName => {
  console.log(`\n${'='.repeat(100)}`);
  console.log(`${cohortName} COHORT RESULTS`);
  console.log('='.repeat(100));

  const cohortResults = results.filter(r => r.cohort === cohortName);

  cohortResults.forEach((result, index) => {
    console.log(`\n${index + 1}. ${result.profile}`);
    console.log('-'.repeat(100));
    console.log(`   Category: ${result.category} (${result.categoryScore}% affinity)`);
    if (result.educationPath) {
      console.log(`   Education: ${result.educationPath} (${result.pathConfidence} confidence)`);
    }
    console.log(`   Top Careers:`);
    result.topCareers.forEach((career, i) => console.log(`      ${i + 1}. ${career}`));
    console.log(`   Strengths: ${result.topStrengths.slice(0, 3).join(', ')}`);
    console.log(`   Validation:`);
    result.issues.forEach(issue => console.log(`      ${issue}`));
  });
});

// Overall summary
console.log(`\n${'='.repeat(100)}`);
console.log('OVERALL SUMMARY');
console.log('='.repeat(100));

const totalTests = results.length;
const passedTests = results.filter(r => r.makesense).length;
const highConfidence = results.filter(r => r.categoryScore >= 70).length;
const mediumConfidence = results.filter(r => r.categoryScore >= 50 && r.categoryScore < 70).length;
const lowConfidence = results.filter(r => r.categoryScore < 50).length;

console.log(`\nTotal tests: ${totalTests}`);
console.log(`Passed validation: ${passedTests}/${totalTests} (${(passedTests/totalTests*100).toFixed(1)}%)`);
console.log('');
console.log('Category Confidence Distribution:');
console.log(`  High (70%+): ${highConfidence}/${totalTests} (${(highConfidence/totalTests*100).toFixed(1)}%)`);
console.log(`  Medium (50-69%): ${mediumConfidence}/${totalTests} (${(mediumConfidence/totalTests*100).toFixed(1)}%)`);
console.log(`  Low (<50%): ${lowConfidence}/${totalTests} (${(lowConfidence/totalTests*100).toFixed(1)}%)`);
console.log('');

// Check education path accuracy (YLA + TASO2 only)
const withEducation = results.filter(r => r.educationPath);
const highPathConfidence = withEducation.filter(r => r.pathConfidence === 'high').length;
console.log('Education Path Confidence:');
console.log(`  High: ${highPathConfidence}/${withEducation.length} (${(highPathConfidence/withEducation.length*100).toFixed(1)}%)`);
console.log(`  Medium/Low: ${withEducation.length - highPathConfidence}/${withEducation.length}`);
console.log('');

console.log('CONCLUSION:');
if (passedTests / totalTests >= 0.8 && highConfidence / totalTests >= 0.6) {
  console.log('✅ EXCELLENT - System produces accurate, sensible results across all cohorts');
} else if (passedTests / totalTests >= 0.7) {
  console.log('⚠️  GOOD - Most results are accurate but some edge cases need attention');
} else {
  console.log('❌ NEEDS IMPROVEMENT - Significant accuracy issues detected');
}
console.log('');
