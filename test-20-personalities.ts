/**
 * COMPREHENSIVE PERSONALITY TEST VALIDATION
 * Tests 20 different personality types across all 3 cohorts
 * Validates that test results match the person's actual personality
 */

import { rankCareers, generateUserProfile } from './lib/scoring/scoringEngine';
import { TestAnswer, Cohort } from './lib/scoring/types';

// ========== PERSONALITY DEFINITIONS ==========

interface PersonalityProfile {
  name: string;
  traits: string[];
  morals: string;
  motivation: string;
  flaws: string[];
  snapshot: string;
  expectedCategory: string; // Which category should this match?
  answerPattern: (cohort: Cohort) => TestAnswer[]; // Function to generate answers
}

// ========== ANSWER PATTERN GENERATORS ==========

/**
 * Generate answers based on personality traits
 * Each function returns answers for a specific cohort
 */

// 1. The Idealistic Reformer - jarjestaja (organized, principled, disciplined)
function idealisticReformerAnswers(cohort: Cohort): TestAnswer[] {
  const answers: TestAnswer[] = [];
  const questionCount = cohort === 'TASO2' ? 33 : 30;
  
  for (let i = 0; i < questionCount; i++) {
    let score = 3; // Default neutral
    
    // High scores for: analytical, organization, structure, planning, fairness
    // Questions that map to these (approximate indices):
    if (i === 0 || i === 1 || i === 4 || i === 5 || i === 6) { // analytical questions
      score = 5;
    } else if (i === 7 || i === 8 || i === 9) { // people/helping - moderate
      score = 4;
    } else if (i >= 10 && i <= 15) { // organization, planning, structure
      score = 5;
    } else if (i >= 16 && i <= 20) { // values, fairness, justice
      score = 5;
    } else if (i >= 21 && i <= 25) { // workstyle, discipline
      score = 5;
    } else {
      score = 3; // Neutral for others
    }
    
    answers.push({ questionIndex: i, score });
  }
  
  return answers;
}

// 2. The Empathetic Helper - auttaja (caring, generous, people-pleaser)
function empatheticHelperAnswers(cohort: Cohort): TestAnswer[] {
  const answers: TestAnswer[] = [];
  const questionCount = cohort === 'TASO2' ? 33 : 30;
  
  for (let i = 0; i < questionCount; i++) {
    let score = 3;
    
    // High scores for: people, health, helping, social impact
    if (i === 7 || i === 8 || i === 9) { // people/helping questions
      score = 5;
    } else if (i >= 10 && i <= 15) { // health, education, social impact
      score = 5;
    } else if (i >= 16 && i <= 20) { // values, impact, helping motivation
      score = 5;
    } else if (i >= 21 && i <= 25) { // teamwork, teaching workstyle
      score = 4;
    } else {
      score = 2; // Lower for tech, analytical, hands-on
    }
    
    answers.push({ questionIndex: i, score });
  }
  
  return answers;
}

// 3. The Independent Achiever - johtaja (ambitious, adaptable, image-conscious)
function independentAchieverAnswers(cohort: Cohort): TestAnswer[] {
  const answers: TestAnswer[] = [];
  const questionCount = cohort === 'TASO2' ? 33 : 30;
  
  for (let i = 0; i < questionCount; i++) {
    let score = 3;
    
    // High scores for: leadership, business, advancement, organization
    if (i >= 10 && i <= 15) { // leadership, business, organization
      score = 5;
    } else if (i >= 16 && i <= 20) { // values, advancement, financial
      score = 5;
    } else if (i >= 21 && i <= 25) { // workstyle, leadership, planning
      score = 5;
    } else if (i === 0 || i === 1) { // analytical - moderate
      score = 4;
    } else {
      score = 3;
    }
    
    answers.push({ questionIndex: i, score });
  }
  
  return answers;
}

// 4. The Creative Individualist - luova (expressive, introspective, dramatic)
function creativeIndividualistAnswers(cohort: Cohort): TestAnswer[] {
  const answers: TestAnswer[] = [];
  const questionCount = cohort === 'TASO2' ? 33 : 30;
  
  for (let i = 0; i < questionCount; i++) {
    let score = 3;
    
    // High scores for: creative, arts_culture, writing, independence
    if (i === 0) { // reading/writing
      score = 5;
    } else if (i >= 10 && i <= 15) { // creative, arts, culture
      score = 5;
    } else if (i >= 21 && i <= 25) { // independence, creative workstyle
      score = 5;
    } else if (i === 7 || i === 8) { // people - moderate (for expression)
      score = 4;
    } else {
      score = 2; // Lower for tech, analytical, hands-on
    }
    
    answers.push({ questionIndex: i, score });
  }
  
  return answers;
}

// 5. The Intellectual Observer - innovoija (analytical, curious, detached)
function intellectualObserverAnswers(cohort: Cohort): TestAnswer[] {
  const answers: TestAnswer[] = [];
  const questionCount = cohort === 'TASO2' ? 33 : 30;
  
  for (let i = 0; i < questionCount; i++) {
    let score = 3;
    
    // High scores for: analytical, technology, problem-solving, innovation
    if (i === 0 || i === 1 || i === 4 || i === 5 || i === 6) { // analytical
      score = 5;
    } else if (i === 3) { // technology
      score = 5;
    } else if (i >= 10 && i <= 15) { // innovation, problem-solving
      score = 5;
    } else if (i >= 21 && i <= 25) { // independence, problem-solving workstyle
      score = 4;
    } else {
      score = 2; // Lower for people, creative, hands-on
    }
    
    answers.push({ questionIndex: i, score });
  }
  
  return answers;
}

// 6. The Loyal Guardian - jarjestaja (responsible, cautious, committed)
function loyalGuardianAnswers(cohort: Cohort): TestAnswer[] {
  const answers: TestAnswer[] = [];
  const questionCount = cohort === 'TASO2' ? 33 : 30;
  
  for (let i = 0; i < questionCount; i++) {
    let score = 3;
    
    // High scores for: organization, structure, responsibility, security
    if (i >= 10 && i <= 15) { // organization, structure
      score = 5;
    } else if (i >= 21 && i <= 25) { // organization, structure workstyle
      score = 5;
    } else if (i >= 16 && i <= 20) { // values, security, stability
      score = 4;
    } else if (i === 0 || i === 1) { // analytical - moderate
      score = 4;
    } else {
      score = 3;
    }
    
    answers.push({ questionIndex: i, score });
  }
  
  return answers;
}

// 7. The Enthusiastic Visionary - visionaari (spontaneous, optimistic, scattered)
function enthusiasticVisionaryAnswers(cohort: Cohort): TestAnswer[] {
  const answers: TestAnswer[] = [];
  const questionCount = cohort === 'TASO2' ? 33 : 30;
  
  for (let i = 0; i < questionCount; i++) {
    let score = 3;
    
    // High scores for: global, planning (but flexible), innovation, freedom
    if (i >= 16 && i <= 20) { // values, global, freedom
      score = 5;
    } else if (i >= 10 && i <= 15) { // innovation, new experiences
      score = 4;
    } else if (i >= 21 && i <= 25) { // planning (but flexible), independence
      score = 4;
    } else {
      score = 3;
    }
    
    answers.push({ questionIndex: i, score });
  }
  
  return answers;
}

// 8. The Assertive Challenger - johtaja (bold, decisive, confrontational)
function assertiveChallengerAnswers(cohort: Cohort): TestAnswer[] {
  const answers: TestAnswer[] = [];
  const questionCount = cohort === 'TASO2' ? 33 : 30;
  
  for (let i = 0; i < questionCount; i++) {
    let score = 3;
    
    // High scores for: leadership, control, independence, business
    if (i >= 10 && i <= 15) { // leadership, business
      score = 5;
    } else if (i >= 21 && i <= 25) { // leadership, control workstyle
      score = 5;
    } else if (i >= 16 && i <= 20) { // values, control, independence
      score = 5;
    } else {
      score = 3;
    }
    
    answers.push({ questionIndex: i, score });
  }
  
  return answers;
}

// 9. The Peaceful Mediator - auttaja (easygoing, patient, agreeable)
function peacefulMediatorAnswers(cohort: Cohort): TestAnswer[] {
  const answers: TestAnswer[] = [];
  const questionCount = cohort === 'TASO2' ? 33 : 30;
  
  for (let i = 0; i < questionCount; i++) {
    let score = 3;
    
    // High scores for: people, helping, harmony, teamwork
    if (i === 7 || i === 8 || i === 9) { // people/helping
      score = 5;
    } else if (i >= 16 && i <= 20) { // values, harmony, helping
      score = 5;
    } else if (i >= 21 && i <= 25) { // teamwork, teaching workstyle
      score = 4;
    } else {
      score = 3; // Neutral for others
    }
    
    answers.push({ questionIndex: i, score });
  }
  
  return answers;
}

// 10. The Practical Realist - rakentaja (grounded, efficient, detail-oriented)
function practicalRealistAnswers(cohort: Cohort): TestAnswer[] {
  const answers: TestAnswer[] = [];
  const questionCount = cohort === 'TASO2' ? 33 : 30;
  
  for (let i = 0; i < questionCount; i++) {
    let score = 3;
    
    // High scores for: hands_on, precision, practical, detail-oriented
    if (i === 2) { // hands_on learning
      score = 5;
    } else if (i >= 10 && i <= 15) { // practical, hands_on work
      score = 5;
    } else if (i >= 21 && i <= 25) { // precision, performance workstyle
      score = 5;
    } else {
      score = 2; // Lower for creative, analytical, people
    }
    
    answers.push({ questionIndex: i, score });
  }
  
  return answers;
}

// 11. The Adventurous Free Spirit - visionaari (daring, hands-on, restless)
function adventurousFreeSpiritAnswers(cohort: Cohort): TestAnswer[] {
  const answers: TestAnswer[] = [];
  const questionCount = cohort === 'TASO2' ? 33 : 30;
  
  for (let i = 0; i < questionCount; i++) {
    let score = 3;
    
    // High scores for: freedom, adventure, hands_on, global
    if (i === 2) { // hands_on
      score = 5;
    } else if (i >= 16 && i <= 20) { // values, freedom, adventure
      score = 5;
    } else if (i >= 21 && i <= 25) { // independence, freedom workstyle
      score = 5;
    } else {
      score = 3;
    }
    
    answers.push({ questionIndex: i, score });
  }
  
  return answers;
}

// 12. The Compassionate Visionary - auttaja (idealistic, gentle, imaginative)
function compassionateVisionaryAnswers(cohort: Cohort): TestAnswer[] {
  const answers: TestAnswer[] = [];
  const questionCount = cohort === 'TASO2' ? 33 : 30;
  
  for (let i = 0; i < questionCount; i++) {
    let score = 3;
    
    // High scores for: people, helping, growth, impact
    if (i === 7 || i === 8 || i === 9) { // people/helping
      score = 5;
    } else if (i >= 10 && i <= 15) { // education, growth, impact
      score = 5;
    } else if (i >= 16 && i <= 20) { // values, impact, helping
      score = 5;
    } else if (i >= 21 && i <= 25) { // teaching, teamwork workstyle
      score = 4;
    } else {
      score = 3;
    }
    
    answers.push({ questionIndex: i, score });
  }
  
  return answers;
}

// 13. The Commanding Organizer - johtaja (structured, authoritative, decisive)
function commandingOrganizerAnswers(cohort: Cohort): TestAnswer[] {
  const answers: TestAnswer[] = [];
  const questionCount = cohort === 'TASO2' ? 33 : 30;
  
  for (let i = 0; i < questionCount; i++) {
    let score = 3;
    
    // High scores for: leadership, organization, structure, control
    if (i >= 10 && i <= 15) { // leadership, organization, business
      score = 5;
    } else if (i >= 21 && i <= 25) { // leadership, organization, structure workstyle
      score = 5;
    } else if (i >= 16 && i <= 20) { // values, control, efficiency
      score = 5;
    } else if (i === 0 || i === 1) { // analytical - moderate
      score = 4;
    } else {
      score = 3;
    }
    
    answers.push({ questionIndex: i, score });
  }
  
  return answers;
}

// 14. The Warm Social Butterfly - auttaja (friendly, outgoing, enthusiastic)
function warmSocialButterflyAnswers(cohort: Cohort): TestAnswer[] {
  const answers: TestAnswer[] = [];
  const questionCount = cohort === 'TASO2' ? 33 : 30;
  
  for (let i = 0; i < questionCount; i++) {
    let score = 3;
    
    // High scores for: people, social, relationships, teamwork
    if (i === 7 || i === 8 || i === 9) { // people/helping
      score = 5;
    } else if (i >= 16 && i <= 20) { // values, relationships, social
      score = 5;
    } else if (i >= 21 && i <= 25) { // teamwork, social workstyle
      score = 5;
    } else {
      score = 2; // Lower for analytical, tech, hands-on
    }
    
    answers.push({ questionIndex: i, score });
  }
  
  return answers;
}

// 15. The Detached Strategist - visionaari (logical, strategic, calm)
function detachedStrategistAnswers(cohort: Cohort): TestAnswer[] {
  const answers: TestAnswer[] = [];
  const questionCount = cohort === 'TASO2' ? 33 : 30;
  
  for (let i = 0; i < questionCount; i++) {
    let score = 3;
    
    // High scores for: analytical, planning, strategic, global
    if (i === 0 || i === 1 || i === 4 || i === 5 || i === 6) { // analytical
      score = 5;
    } else if (i >= 21 && i <= 25) { // planning, strategic workstyle
      score = 5;
    } else if (i >= 16 && i <= 20) { // values, global, strategic
      score = 4;
    } else {
      score = 2; // Lower for people, creative, hands-on
    }
    
    answers.push({ questionIndex: i, score });
  }
  
  return answers;
}

// 16. The Humble Caregiver - auttaja (reliable, nurturing, self-sacrificing)
function humbleCaregiverAnswers(cohort: Cohort): TestAnswer[] {
  const answers: TestAnswer[] = [];
  const questionCount = cohort === 'TASO2' ? 33 : 30;
  
  for (let i = 0; i < questionCount; i++) {
    let score = 3;
    
    // High scores for: people, helping, health, service
    if (i === 7 || i === 8 || i === 9) { // people/helping
      score = 5;
    } else if (i >= 10 && i <= 15) { // health, service, helping
      score = 5;
    } else if (i >= 16 && i <= 20) { // values, service, helping
      score = 5;
    } else if (i >= 21 && i <= 25) { // teamwork, teaching workstyle
      score = 4;
    } else {
      score = 2; // Lower for tech, analytical, leadership
    }
    
    answers.push({ questionIndex: i, score });
  }
  
  return answers;
}

// 17. The Dramatic Charmer - luova (witty, dramatic, confident)
function dramaticCharmerAnswers(cohort: Cohort): TestAnswer[] {
  const answers: TestAnswer[] = [];
  const questionCount = cohort === 'TASO2' ? 33 : 30;
  
  for (let i = 0; i < questionCount; i++) {
    let score = 3;
    
    // High scores for: creative, arts, expression, independence
    if (i === 0) { // reading/writing
      score = 5;
    } else if (i >= 10 && i <= 15) { // creative, arts, culture
      score = 5;
    } else if (i >= 21 && i <= 25) { // independence, creative workstyle
      score = 5;
    } else if (i === 7 || i === 8) { // people - moderate (for performance)
      score = 4;
    } else {
      score = 2; // Lower for tech, analytical, hands-on
    }
    
    answers.push({ questionIndex: i, score });
  }
  
  return answers;
}

// 18. The Quiet Stoic - jarjestaja (calm, resilient, minimalistic)
function quietStoicAnswers(cohort: Cohort): TestAnswer[] {
  const answers: TestAnswer[] = [];
  const questionCount = cohort === 'TASO2' ? 33 : 30;
  
  for (let i = 0; i < questionCount; i++) {
    let score = 3;
    
    // High scores for: organization, structure, independence, calm
    if (i >= 10 && i <= 15) { // organization, structure
      score = 4;
    } else if (i >= 21 && i <= 25) { // organization, independence workstyle
      score = 4;
    } else if (i >= 16 && i <= 20) { // values, stability, calm
      score = 4;
    } else {
      score = 3; // Neutral for most
    }
    
    answers.push({ questionIndex: i, score });
  }
  
  return answers;
}

// 19. The Curious Inventor - innovoija (innovative, eccentric, enthusiastic)
function curiousInventorAnswers(cohort: Cohort): TestAnswer[] {
  const answers: TestAnswer[] = [];
  const questionCount = cohort === 'TASO2' ? 33 : 30;
  
  for (let i = 0; i < questionCount; i++) {
    let score = 3;
    
    // High scores for: technology, innovation, creative problem-solving
    if (i === 3) { // technology
      score = 5;
    } else if (i === 0 || i === 1 || i === 4 || i === 5 || i === 6) { // analytical
      score = 5;
    } else if (i >= 10 && i <= 15) { // innovation, creative problem-solving
      score = 5;
    } else if (i >= 21 && i <= 25) { // independence, innovation workstyle
      score = 4;
    } else {
      score = 2; // Lower for people, hands-on
    }
    
    answers.push({ questionIndex: i, score });
  }
  
  return answers;
}

// 20. The Ethical Leader - johtaja (inspiring, responsible, integrity-driven)
function ethicalLeaderAnswers(cohort: Cohort): TestAnswer[] {
  const answers: TestAnswer[] = [];
  const questionCount = cohort === 'TASO2' ? 33 : 30;
  
  for (let i = 0; i < questionCount; i++) {
    let score = 3;
    
    // High scores for: leadership, organization, values, responsibility
    if (i >= 10 && i <= 15) { // leadership, organization, business
      score = 5;
    } else if (i >= 21 && i <= 25) { // leadership, organization workstyle
      score = 5;
    } else if (i >= 16 && i <= 20) { // values, ethics, responsibility
      score = 5;
    } else if (i === 7 || i === 8) { // people - moderate (for leadership)
      score = 4;
    } else {
      score = 3;
    }
    
    answers.push({ questionIndex: i, score });
  }
  
  return answers;
}

// ========== PERSONALITY PROFILES ==========

const personalities: PersonalityProfile[] = [
  {
    name: "The Idealistic Reformer",
    traits: ["principled", "disciplined", "perfectionistic"],
    morals: "Always seeks fairness and justice",
    motivation: "Improve the world",
    flaws: ["rigid", "overly critical"],
    snapshot: "A civil-rights volunteer who edits local policies for fun.",
    expectedCategory: "jarjestaja",
    answerPattern: idealisticReformerAnswers
  },
  {
    name: "The Empathetic Helper",
    traits: ["caring", "generous", "people-pleaser"],
    morals: "Everyone deserves support",
    motivation: "Being needed and appreciated",
    flaws: ["self-neglect", "overly emotional"],
    snapshot: "A nurse who works double shifts to help coworkers.",
    expectedCategory: "auttaja",
    answerPattern: empatheticHelperAnswers
  },
  {
    name: "The Independent Achiever",
    traits: ["ambitious", "adaptable", "image-conscious"],
    morals: "Hard work defines worth",
    motivation: "Success and recognition",
    flaws: ["competitive", "avoids failure at all costs"],
    snapshot: "A startup founder obsessed with productivity hacks.",
    expectedCategory: "johtaja",
    answerPattern: independentAchieverAnswers
  },
  {
    name: "The Creative Individualist",
    traits: ["expressive", "introspective", "dramatic"],
    morals: "Authenticity above everything",
    motivation: "Being unique and understood",
    flaws: ["moodiness", "self-centeredness"],
    snapshot: "An artist who turns every emotion into a project.",
    expectedCategory: "luova",
    answerPattern: creativeIndividualistAnswers
  },
  {
    name: "The Intellectual Observer",
    traits: ["analytical", "curious", "detached"],
    morals: "Knowledge is the path to truth",
    motivation: "Understanding how things work",
    flaws: ["withdrawn", "overthinks"],
    snapshot: "A researcher who forgets meals when deep in thought.",
    expectedCategory: "innovoija",
    answerPattern: intellectualObserverAnswers
  },
  {
    name: "The Loyal Guardian",
    traits: ["responsible", "cautious", "committed"],
    morals: "Protect those who depend on you",
    motivation: "Security and stability",
    flaws: ["anxiety", "distrust"],
    snapshot: "A security manager who triple-checks everything.",
    expectedCategory: "jarjestaja",
    answerPattern: loyalGuardianAnswers
  },
  {
    name: "The Enthusiastic Visionary",
    traits: ["spontaneous", "optimistic", "scattered"],
    morals: "Life should be enjoyed",
    motivation: "Freedom and new experiences",
    flaws: ["avoids discomfort", "impulsive"],
    snapshot: "A travel blogger who books flights at 3 a.m.",
    expectedCategory: "visionaari",
    answerPattern: enthusiasticVisionaryAnswers
  },
  {
    name: "The Assertive Challenger",
    traits: ["bold", "decisive", "confrontational"],
    morals: "Strength is necessary for survival",
    motivation: "Control and independence",
    flaws: ["intimidating", "stubborn"],
    snapshot: "A CEO who negotiates aggressively but protects their team fiercely.",
    expectedCategory: "johtaja",
    answerPattern: assertiveChallengerAnswers
  },
  {
    name: "The Peaceful Mediator",
    traits: ["easygoing", "patient", "agreeable"],
    morals: "Harmony above all",
    motivation: "Avoid conflict",
    flaws: ["indecisive", "passive"],
    snapshot: "A counselor who helps everyone but avoids their own problems.",
    expectedCategory: "auttaja",
    answerPattern: peacefulMediatorAnswers
  },
  {
    name: "The Practical Realist",
    traits: ["grounded", "efficient", "detail-oriented"],
    morals: "Do what works, not what's ideal",
    motivation: "Practical solutions",
    flaws: ["uncreative", "inflexible"],
    snapshot: "A mechanic who fixes everything with a calm demeanor.",
    expectedCategory: "rakentaja",
    answerPattern: practicalRealistAnswers
  },
  {
    name: "The Adventurous Free Spirit",
    traits: ["daring", "hands-on", "restless"],
    morals: "Live in the moment",
    motivation: "Thrill and freedom",
    flaws: ["risk-taking", "commitment issues"],
    snapshot: "A rock climber who travels the world with minimal supplies.",
    expectedCategory: "visionaari",
    answerPattern: adventurousFreeSpiritAnswers
  },
  {
    name: "The Compassionate Visionary",
    traits: ["idealistic", "gentle", "imaginative"],
    morals: "Help others grow",
    motivation: "Changing the world through compassion",
    flaws: ["too trusting", "impractical"],
    snapshot: "A teacher who mentors struggling students passionately.",
    expectedCategory: "auttaja",
    answerPattern: compassionateVisionaryAnswers
  },
  {
    name: "The Commanding Organizer",
    traits: ["structured", "authoritative", "decisive"],
    morals: "Order creates success",
    motivation: "Control and efficiency",
    flaws: ["overbearing", "impatient"],
    snapshot: "A military officer with a strict schedule for everything.",
    expectedCategory: "johtaja",
    answerPattern: commandingOrganizerAnswers
  },
  {
    name: "The Warm Social Butterfly",
    traits: ["friendly", "outgoing", "enthusiastic"],
    morals: "Relationships make life meaningful",
    motivation: "Social bonding and fun",
    flaws: ["fears rejection", "distractible"],
    snapshot: "A party planner who remembers everyone's birthdays.",
    expectedCategory: "auttaja",
    answerPattern: warmSocialButterflyAnswers
  },
  {
    name: "The Detached Strategist",
    traits: ["logical", "strategic", "calm"],
    morals: "Emotions cloud judgment",
    motivation: "Efficiency and mastery",
    flaws: ["lack of empathy", "distant"],
    snapshot: "A chess coach who speaks in probabilities.",
    expectedCategory: "visionaari",
    answerPattern: detachedStrategistAnswers
  },
  {
    name: "The Humble Caregiver",
    traits: ["reliable", "nurturing", "self-sacrificing"],
    morals: "Serve quietly, without reward",
    motivation: "Helping others feel safe",
    flaws: ["overextends", "avoids spotlight"],
    snapshot: "A community cook who feeds anyone who walks in.",
    expectedCategory: "auttaja",
    answerPattern: humbleCaregiverAnswers
  },
  {
    name: "The Dramatic Charmer",
    traits: ["witty", "dramatic", "confident"],
    morals: "Life is a stage—play your role well",
    motivation: "Attention and admiration",
    flaws: ["manipulative tendencies", "vanity"],
    snapshot: "An actor who tells stories bigger than life.",
    expectedCategory: "luova",
    answerPattern: dramaticCharmerAnswers
  },
  {
    name: "The Quiet Stoic",
    traits: ["calm", "resilient", "minimalistic"],
    morals: "Endure hardship with dignity",
    motivation: "Personal strength",
    flaws: ["emotionally closed off"],
    snapshot: "A forest ranger living simply and peacefully.",
    expectedCategory: "jarjestaja",
    answerPattern: quietStoicAnswers
  },
  {
    name: "The Curious Inventor",
    traits: ["innovative", "eccentric", "enthusiastic"],
    morals: "Creativity drives progress",
    motivation: "Build things no one has imagined",
    flaws: ["messy", "forgetful"],
    snapshot: "A tinkerer with a garage full of half-finished prototypes.",
    expectedCategory: "innovoija",
    answerPattern: curiousInventorAnswers
  },
  {
    name: "The Ethical Leader",
    traits: ["inspiring", "responsible", "integrity-driven"],
    morals: "Lead by example",
    motivation: "Making ethical change",
    flaws: ["overburdened", "takes too much responsibility"],
    snapshot: "A nonprofit director who refuses shortcuts.",
    expectedCategory: "johtaja",
    answerPattern: ethicalLeaderAnswers
  }
];

// ========== TEST RUNNER ==========

interface TestResult {
  personality: string;
  cohort: Cohort;
  expectedCategory: string;
  actualCategory: string;
  topCareer: string;
  matchScore: number;
  passed: boolean;
  dimensionScores: any;
  topCareers: any[];
}

function runTests(): TestResult[] {
  const results: TestResult[] = [];
  const cohorts: Cohort[] = ['YLA', 'TASO2', 'NUORI'];
  
  for (const personality of personalities) {
    for (const cohort of cohorts) {
      try {
        const answers = personality.answerPattern(cohort);
        const topCareers = rankCareers(answers, cohort, 5);
        const userProfile = generateUserProfile(answers, cohort);
        
        // Determine actual category from top careers
        const actualCategory = topCareers[0]?.category || 'unknown';
        const topCareer = topCareers[0]?.title || 'Unknown';
        const matchScore = topCareers[0]?.overallScore || 0;
        
        const passed = actualCategory === personality.expectedCategory;
        
        results.push({
          personality: personality.name,
          cohort,
          expectedCategory: personality.expectedCategory,
          actualCategory,
          topCareer,
          matchScore,
          passed,
          dimensionScores: userProfile.dimensionScores,
          topCareers: topCareers.slice(0, 3)
        });
      } catch (error) {
        console.error(`Error testing ${personality.name} (${cohort}):`, error);
        results.push({
          personality: personality.name,
          cohort,
          expectedCategory: personality.expectedCategory,
          actualCategory: 'ERROR',
          topCareer: 'ERROR',
          matchScore: 0,
          passed: false,
          dimensionScores: {},
          topCareers: []
        });
      }
    }
  }
  
  return results;
}

// ========== RESULTS ANALYSIS ==========

function analyzeResults(results: TestResult[]): void {
  console.log('\n' + '='.repeat(80));
  console.log('COMPREHENSIVE PERSONALITY TEST VALIDATION RESULTS');
  console.log('='.repeat(80) + '\n');
  
  // Group by cohort
  const byCohort: Record<Cohort, TestResult[]> = {
    YLA: [],
    TASO2: [],
    NUORI: []
  };
  
  for (const result of results) {
    byCohort[result.cohort].push(result);
  }
  
  // Analyze each cohort
  for (const cohort of ['YLA', 'TASO2', 'NUORI'] as Cohort[]) {
    const cohortResults = byCohort[cohort];
    const passed = cohortResults.filter(r => r.passed).length;
    const total = cohortResults.length;
    const successRate = (passed / total) * 100;
    
    console.log(`\n${'='.repeat(80)}`);
    console.log(`${cohort} COHORT - ${total} Tests`);
    console.log(`${'='.repeat(80)}`);
    console.log(`Success Rate: ${passed}/${total} (${successRate.toFixed(1)}%)\n`);
    
    // Show failures
    const failures = cohortResults.filter(r => !r.passed);
    if (failures.length > 0) {
      console.log(`❌ FAILURES (${failures.length}):`);
      console.log('-'.repeat(80));
      for (const failure of failures) {
        console.log(`\n${failure.personality}`);
        console.log(`  Expected: ${failure.expectedCategory}`);
        console.log(`  Got:      ${failure.actualCategory}`);
        console.log(`  Top Career: ${failure.topCareer} (${failure.matchScore.toFixed(1)}%)`);
        if (failure.topCareers.length > 1) {
          console.log(`  Top 3: ${failure.topCareers.map(c => `${c.title} (${c.category})`).join(', ')}`);
        }
      }
      console.log('\n');
    }
    
    // Show successes
    const successes = cohortResults.filter(r => r.passed);
    if (successes.length > 0) {
      console.log(`✅ SUCCESSES (${successes.length}):`);
      console.log('-'.repeat(80));
      for (const success of successes) {
        console.log(`${success.personality} → ${success.actualCategory} (${success.matchScore.toFixed(1)}%)`);
      }
      console.log('\n');
    }
  }
  
  // Overall summary
  console.log(`\n${'='.repeat(80)}`);
  console.log('OVERALL SUMMARY');
  console.log(`${'='.repeat(80)}`);
  
  const totalPassed = results.filter(r => r.passed).length;
  const totalTests = results.length;
  const overallSuccessRate = (totalPassed / totalTests) * 100;
  
  console.log(`\nTotal Tests: ${totalTests}`);
  console.log(`Passed: ${totalPassed}`);
  console.log(`Failed: ${totalTests - totalPassed}`);
  console.log(`Success Rate: ${overallSuccessRate.toFixed(1)}%\n`);
  
  // Category breakdown
  console.log('Category Distribution:');
  const categoryCounts: Record<string, number> = {};
  for (const result of results) {
    categoryCounts[result.actualCategory] = (categoryCounts[result.actualCategory] || 0) + 1;
  }
  for (const [category, count] of Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${category}: ${count}`);
  }
  
  // BRUTAL HONESTY SECTION
  console.log(`\n${'='.repeat(80)}`);
  console.log('BRUTAL HONEST ASSESSMENT');
  console.log(`${'='.repeat(80)}\n`);
  
  if (overallSuccessRate >= 80) {
    console.log('✅ TEST IS WORKING WELL');
    console.log(`   ${overallSuccessRate.toFixed(1)}% accuracy is solid for a personality test.`);
  } else if (overallSuccessRate >= 60) {
    console.log('⚠️  TEST NEEDS IMPROVEMENT');
    console.log(`   ${overallSuccessRate.toFixed(1)}% accuracy is acceptable but could be better.`);
    console.log('   Review failed cases and adjust question weights.');
  } else {
    console.log('❌ TEST HAS SIGNIFICANT ISSUES');
    console.log(`   ${overallSuccessRate.toFixed(1)}% accuracy is too low.`);
    console.log('   Major algorithm adjustments needed.');
  }
  
  // Specific issues
  const categoryFailures: Record<string, string[]> = {};
  for (const result of results.filter(r => !r.passed)) {
    if (!categoryFailures[result.expectedCategory]) {
      categoryFailures[result.expectedCategory] = [];
    }
    categoryFailures[result.expectedCategory].push(result.personality);
  }
  
  if (Object.keys(categoryFailures).length > 0) {
    console.log('\n⚠️  Categories with failures:');
    for (const [category, personalities] of Object.entries(categoryFailures)) {
      console.log(`   ${category}: ${personalities.length} failures`);
      console.log(`     ${personalities.join(', ')}`);
    }
  }
}

// ========== RUN TESTS ==========

if (require.main === module) {
  const results = runTests();
  analyzeResults(results);
  
  // Export results for further analysis
  const fs = require('fs');
  const path = require('path');
  const outputPath = path.join(__dirname, 'personality-test-results.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n📊 Detailed results saved to: ${outputPath}`);
}

export { runTests, analyzeResults, personalities };
























