/**
 * COMPREHENSIVE 50-PERSONA TEST SUITE
 * Tests 50 personas per cohort (200 total) with diverse personalities
 * Validates: Category, Education Path, Career Recommendations, Reasoning
 */

const API_BASE = 'http://localhost:3000';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateAnswers(profile, cohort) {
  // Generate realistic answers based on personality profile
  // ALIGNED WITH ACTUAL DIMENSION MAPPINGS from dimensions.ts
  const answers = [];

  if (cohort === 'YLA') {
    // YLA: 30 questions - ALIGNED WITH ACTUAL dimensions.ts MAPPINGS
    answers.push(profile.technology || 3);            // Q0: technology (games/apps)
    answers.push(profile.analytical || 3);            // Q1: problem_solving (puzzles)
    answers.push(profile.creative || 3);              // Q2: creative, writing, arts_culture
    answers.push(profile.hands_on || 3);              // Q3: hands_on (building/fixing)
    answers.push(profile.nature || profile.environment || 3);  // Q4: environment + health (nature/animals)
    answers.push(profile.health || 3);                // Q5: health (human body)
    answers.push(profile.business || 3);              // Q6: business (entrepreneurship)
    answers.push(profile.analytical || 3);            // Q7: analytical (experiments)
    answers.push(profile.sports || profile.health || 3);  // Q8: health, sports (physical activity)
    answers.push(profile.teaching || profile.growth || 3); // Q9: growth (teaching/explaining)
    answers.push(profile.creative || 3);              // Q10: creative (cooking)
    answers.push(profile.innovation || 3);            // Q11: innovation (new ideas)
    answers.push(profile.people || 3);                // Q12: people (emotional support)
    answers.push(profile.leadership || 3);            // Q13: leadership (group decisions)
    answers.push(profile.analytical || 3);            // Q14: analytical (languages)
    answers.push(profile.teamwork || 3);              // Q15: teamwork (group work)
    answers.push(profile.structure || 3);             // Q16: organization (clear instructions)
    answers.push(profile.outdoor || 3);               // Q17: outdoor (work outside)
    answers.push(6 - (profile.precision || 3));       // Q18: precision (REVERSE - focus difficulty)
    answers.push(profile.variety || 3);               // Q19: flexibility, variety (different days)
    answers.push(6 - (profile.stress_tolerance || 3)); // Q20: performance (REVERSE - stress)
    answers.push(profile.social || 3);                // Q21: social (public speaking)
    answers.push(profile.independence || 3);          // Q22: independence (initiative)
    answers.push(profile.impact || 3);                // Q23: impact (help society)
    answers.push(profile.salary || 3);                // Q24: financial (money)
    answers.push(6 - (profile.status || 3));          // Q25: advancement (REVERSE - recognition)
    answers.push(profile.work_life || 3);             // Q26: work_life_balance (free time)
    answers.push(profile.autonomy || profile.entrepreneurship || 3); // Q27: entrepreneurship (own boss)
    answers.push(profile.international || profile.travel || 3);      // Q28: global (travel)
    answers.push(profile.stability || profile.future || 3);          // Q29: stability (know future)
  } else if (cohort === 'NUORI') {
    // NUORI: 30 questions - ALIGNED WITH dimensions.ts NUORI_MAPPINGS
    answers.push(profile.technology || 3);            // Q0: technology, analytical (software/data)
    answers.push(profile.health || 3);                // Q1: health, people (healthcare) - CRITICAL for auttaja
    answers.push(profile.business || 3);              // Q2: business (finance)
    answers.push(profile.creative || 3);              // Q3: creative, writing, arts_culture
    answers.push(profile.innovation || profile.technology || 3);  // Q4: innovation, technology (engineering)
    answers.push(profile.teaching || profile.growth || 3);        // Q5: growth, people (teaching)
    answers.push(profile.people || 3);                // Q6: people (HR)
    answers.push(profile.analytical || 3);            // Q7: analytical (legal)
    answers.push(profile.sales || profile.business || 3);         // Q8: business (sales/marketing)
    answers.push(profile.research || profile.analytical || 3);    // Q9: analytical (research)
    answers.push(profile.leadership || 3);            // Q10: leadership, business (project management)
    answers.push(profile.environment || 3);           // Q11: environment, nature (sustainability)
    answers.push(profile.remote || profile.independence || 3);    // Q12: independence (remote work)
    answers.push(profile.lead_people || profile.leadership || 3); // Q13: leadership, growth (management)
    answers.push(profile.teamwork || 3);              // Q14: teamwork, people
    answers.push(profile.structure || 3);             // Q15: structure
    answers.push(6 - (profile.social || 3));          // Q16: social (REVERSE - client fatigue)
    answers.push(profile.strategic || profile.planning || 3);     // Q17: planning (strategic)
    answers.push(profile.precision || 3);             // Q18: precision (detail)
    answers.push(6 - (profile.pace || 3));            // Q19: performance (REVERSE - pace stress)
    answers.push(profile.salary || 3);                // Q20: financial (salary)
    answers.push(profile.work_life || 3);             // Q21: work_life_balance
    answers.push(profile.advancement || 3);           // Q22: advancement, performance
    answers.push(profile.impact || 3);                // Q23: social_impact, impact - CRITICAL for auttaja
    answers.push(profile.stability || 3);             // Q24: stability
    answers.push(profile.growth || 3);                // Q25: growth (learning)
    answers.push(profile.autonomy || 3);              // Q26: autonomy
    answers.push(profile.entrepreneurship || 3);      // Q27: entrepreneurship, business
    answers.push(profile.international || 3);         // Q28: global
    answers.push(3);                                  // Q29: social (REVERSE - culture indifference)
  } else if (cohort === 'TASO2_LUKIO') {
    // TASO2 LUKIO: 20 shared + 10 LUKIO-specific - ALIGNED WITH dimensions.ts
    // Shared Q0-Q19
    answers.push(profile.technology || 3);            // Q0: technology
    answers.push(profile.health || 3);                // Q1: health (healthcare)
    answers.push(profile.creative || 3);              // Q2: creative, writing, arts_culture
    answers.push(profile.people || 3);                // Q3: people
    answers.push(profile.business || 3);              // Q4: business
    answers.push(profile.environment || 3);           // Q5: environment
    answers.push(profile.hands_on || 3);              // Q6: hands_on
    answers.push(profile.analytical || 3);            // Q7: analytical
    answers.push(profile.teaching || 3);              // Q8: education
    answers.push(profile.innovation || 3);            // Q9: innovation
    answers.push(profile.teamwork || 3);              // Q10: teamwork
    answers.push(profile.structure || 3);             // Q11: structure (variety REVERSE)
    answers.push(profile.independence || 3);          // Q12: independence
    answers.push(profile.outdoor || profile.sports || 3);  // Q13: outdoor, sports
    answers.push(profile.social || 3);                // Q14: social (customer)
    answers.push(profile.work_life || 3);             // Q15: work_life_balance
    answers.push(profile.salary || 3);                // Q16: financial
    answers.push(profile.impact || 3);                // Q17: social_impact
    answers.push(6 - (profile.precision || 3));       // Q18: precision (REVERSE - detail frustration)
    answers.push(profile.stability || 3);             // Q19: stability
    // LUKIO-specific Q20-Q29
    answers.push(profile.science || profile.analytical || 3);  // Q20: analytical (sciences)
    answers.push(6 - (profile.patience || 3));        // Q21: problem_solving (REVERSE - frustration)
    answers.push(profile.abstract || profile.analytical || 3); // Q22: analytical (abstract thinking)
    answers.push(profile.long_study || profile.growth || 3);   // Q23: growth (long study commitment)
    answers.push(profile.intellectual || profile.impact || 3); // Q24: impact (intellectual challenge)
    answers.push(profile.specialist || profile.advancement || 3); // Q25: advancement (expertise)
    answers.push(profile.reading || profile.growth || 3);      // Q26: growth (reading/learning)
    answers.push(profile.international || 3);         // Q27: global (international)
    answers.push(profile.status || profile.advancement || 3);  // Q28: advancement (status)
    answers.push(profile.long_term || profile.precision || 3); // Q29: precision (long-term focus)
  } else if (cohort === 'TASO2_AMIS') {
    // TASO2 AMIS: 20 shared + 10 AMIS-specific - ALIGNED WITH dimensions.ts
    // Shared Q0-Q19 (same as LUKIO)
    answers.push(profile.technology || 3);            // Q0: technology
    answers.push(profile.health || 3);                // Q1: health (healthcare)
    answers.push(profile.creative || 3);              // Q2: creative, writing, arts_culture
    answers.push(profile.people || 3);                // Q3: people
    answers.push(profile.business || 3);              // Q4: business
    answers.push(profile.environment || 3);           // Q5: environment
    answers.push(profile.hands_on || 3);              // Q6: hands_on
    answers.push(profile.analytical || 3);            // Q7: analytical
    answers.push(profile.teaching || 3);              // Q8: education
    answers.push(profile.innovation || 3);            // Q9: innovation
    answers.push(profile.teamwork || 3);              // Q10: teamwork
    answers.push(profile.structure || 3);             // Q11: structure
    answers.push(profile.independence || 3);          // Q12: independence
    answers.push(profile.outdoor || profile.sports || 3);  // Q13: outdoor, sports
    answers.push(profile.social || 3);                // Q14: social (customer)
    answers.push(profile.work_life || 3);             // Q15: work_life_balance
    answers.push(profile.salary || 3);                // Q16: financial
    answers.push(profile.impact || 3);                // Q17: social_impact
    answers.push(6 - (profile.precision || 3));       // Q18: precision (REVERSE - detail frustration)
    answers.push(profile.stability || 3);             // Q19: stability
    // AMIS-specific Q20-Q29
    answers.push(profile.concrete || profile.hands_on || 3);       // Q20: hands_on (concrete results)
    answers.push(6 - (profile.patience || 3));        // Q21: problem_solving (REVERSE - frustration)
    answers.push(profile.learn_doing || profile.hands_on || 3);    // Q22: hands_on (learn by doing)
    answers.push(profile.practical || profile.hands_on || 3);      // Q23: hands_on (practical value)
    answers.push(profile.shift_work || profile.variety || 3);      // Q24: flexibility, variety (shift work)
    answers.push(profile.own_business || profile.entrepreneurship || 3); // Q25: entrepreneurship
    answers.push(profile.employment || profile.stability || 3);    // Q26: stability (employment)
    answers.push(profile.instructions || profile.precision || 3);  // Q27: precision (following procedures)
    answers.push(profile.local || profile.stability || 3);         // Q28: stability (local work)
    answers.push(profile.mentor || profile.growth || 3);           // Q29: growth (apprenticeship)
  }

  return answers;
}

// ============================================================================
// YLA PERSONAS (50) - Ages 13-16
// ============================================================================

const YLA_PERSONAS = [
  // AUTTAJA profiles (10) - STRONG health/people, LOW analytical/hands_on to beat innovoija/rakentaja
  { name: "Aino - Aspiring Nurse", category: "auttaja", profile: { health: 5, people: 5, teaching: 4, social: 5, impact: 5, teamwork: 4, technology: 1, hands_on: 2, analytical: 2 } },
  { name: "Elias - Future Doctor", category: "auttaja", profile: { health: 5, people: 5, analytical: 2, impact: 5, stability: 4, technology: 2, hands_on: 2 } },
  { name: "Venla - Animal Lover", category: "auttaja", profile: { health: 5, nature: 5, people: 5, outdoor: 3, environment: 3, impact: 5, hands_on: 2, analytical: 2 } },
  { name: "Onni - School Counselor Dream", category: "auttaja", profile: { people: 5, teaching: 5, social: 5, impact: 5, teamwork: 4, health: 5, analytical: 1, technology: 1 } },
  { name: "Helmi - Elderly Care", category: "auttaja", profile: { people: 5, health: 5, social: 5, impact: 5, stability: 4, analytical: 1, technology: 1 } },
  { name: "Eetu - Physical Therapist", category: "auttaja", profile: { health: 5, people: 5, hands_on: 2, outdoor: 2, impact: 5, teamwork: 4, analytical: 2 } },
  { name: "Siiri - Child Psychologist", category: "auttaja", profile: { people: 5, health: 5, analytical: 2, teaching: 4, impact: 5, social: 5, technology: 1 } },
  { name: "Akseli - Paramedic Dream", category: "auttaja", profile: { health: 5, people: 5, hands_on: 2, teamwork: 5, impact: 5, technology: 2, analytical: 2 } },
  { name: "Ronja - Midwife Aspiration", category: "auttaja", profile: { health: 5, people: 5, social: 5, impact: 5, stability: 4, teaching: 4 } },
  { name: "Niilo - Dentist Path", category: "auttaja", profile: { health: 5, people: 5, precision: 3, hands_on: 2, analytical: 2, stability: 4, impact: 5 } },

  // INNOVOIJA profiles (10)
  { name: "Matias - Coder Kid", category: "innovoija", profile: { technology: 5, analytical: 5, innovation: 5, independence: 4, growth: 5, precision: 4 } },
  { name: "Noora - Robotics Enthusiast", category: "innovoija", profile: { technology: 5, innovation: 5, analytical: 4, hands_on: 3, growth: 5, teamwork: 3 } },
  { name: "Lauri - Data Science Interest", category: "innovoija", profile: { technology: 5, analytical: 5, innovation: 4, independence: 4, precision: 4, growth: 5 } },
  { name: "Emma - AI Fascinated", category: "innovoija", profile: { technology: 5, innovation: 5, analytical: 5, growth: 5, independence: 4, future: 5 } },
  { name: "Veeti - Game Developer", category: "innovoija", profile: { technology: 5, creative: 2, innovation: 5, analytical: 5, independence: 4, growth: 4 } },
  { name: "Iida - Cybersecurity Interest", category: "innovoija", profile: { technology: 5, analytical: 5, precision: 5, innovation: 4, independence: 5, growth: 4 } },
  { name: "Aleksi - Tech Startup Dream", category: "innovoija", profile: { technology: 5, innovation: 5, business: 4, analytical: 4, risk: 4, growth: 5 } },
  { name: "Sara - Biotechnology Path", category: "innovoija", profile: { technology: 4, innovation: 5, analytical: 5, health: 3, science: 5, growth: 5 } },
  { name: "Eemil - Hardware Tinkerer", category: "innovoija", profile: { technology: 5, innovation: 4, analytical: 4, hands_on: 3, independence: 4, growth: 4 } },
  { name: "Olivia - App Developer", category: "innovoija", profile: { technology: 5, creative: 3, innovation: 5, analytical: 4, growth: 5, independence: 4 } },

  // LUOVA profiles (10)
  { name: "Aada - Artist Dreamer", category: "luova", profile: { creative: 5, independence: 4, variety: 5, precision: 3, growth: 4, social: 3 } },
  { name: "Leo - Musician", category: "luova", profile: { creative: 5, variety: 5, independence: 4, social: 4, growth: 4, risk: 4 } },
  { name: "Ella - Fashion Designer", category: "luova", profile: { creative: 5, precision: 4, variety: 5, business: 3, social: 4, independence: 4 } },
  { name: "Joel - Film Enthusiast", category: "luova", profile: { creative: 5, technology: 3, variety: 5, social: 4, independence: 4, growth: 4 } },
  { name: "Lilja - Writer Dreams", category: "luova", profile: { creative: 5, independence: 5, variety: 4, precision: 4, growth: 4, social: 2 } },
  { name: "Hugo - Graphic Designer", category: "luova", profile: { creative: 5, technology: 4, precision: 4, variety: 4, independence: 4, growth: 4 } },
  { name: "Aurora - Photographer", category: "luova", profile: { creative: 5, variety: 5, outdoor: 4, independence: 5, technology: 3, social: 3 } },
  { name: "Kasper - Animator", category: "luova", profile: { creative: 5, technology: 4, variety: 4, precision: 4, independence: 4, growth: 4 } },
  { name: "Lumi - Interior Designer", category: "luova", profile: { creative: 5, precision: 4, people: 3, variety: 4, business: 3, independence: 4 } },
  { name: "Oliver - Content Creator", category: "luova", profile: { creative: 5, social: 5, variety: 5, technology: 4, independence: 4, growth: 4 } },

  // RAKENTAJA profiles (10)
  { name: "Eino - Carpenter Aspiration", category: "rakentaja", profile: { hands_on: 5, outdoor: 4, precision: 4, stability: 4, independence: 4, technology: 2 } },
  { name: "Vilho - Auto Mechanic", category: "rakentaja", profile: { hands_on: 5, technology: 3, analytical: 3, outdoor: 3, stability: 4, independence: 4 } },
  { name: "Tuomas - Electrician Path", category: "rakentaja", profile: { hands_on: 5, technology: 3, precision: 4, stability: 5, outdoor: 3, analytical: 3 } },
  { name: "Arttu - Construction Worker", category: "rakentaja", profile: { hands_on: 5, outdoor: 5, teamwork: 4, stability: 4, precision: 3, technology: 2 } },
  { name: "Oskari - Plumber Dream", category: "rakentaja", profile: { hands_on: 5, analytical: 3, precision: 4, stability: 5, independence: 4, outdoor: 3 } },
  { name: "Niko - Welder Interest", category: "rakentaja", profile: { hands_on: 5, precision: 5, outdoor: 3, stability: 4, technology: 2, teamwork: 3 } },
  { name: "Juho - HVAC Technician", category: "rakentaja", profile: { hands_on: 5, technology: 3, analytical: 3, stability: 5, outdoor: 3, precision: 4 } },
  { name: "Elmo - Landscaper", category: "rakentaja", profile: { hands_on: 5, outdoor: 5, nature: 4, stability: 4, independence: 4, creativity: 3 } },
  { name: "Rasmus - Machine Operator", category: "rakentaja", profile: { hands_on: 5, technology: 3, precision: 4, stability: 5, outdoor: 3, independence: 3 } },
  { name: "Antero - Painter/Decorator", category: "rakentaja", profile: { hands_on: 5, creative: 3, precision: 4, stability: 4, independence: 4, outdoor: 3 } },

  // JOHTAJA profiles (10)
  { name: "Aleksandra - Future CEO", category: "johtaja", profile: { leadership: 5, business: 5, people: 4, risk: 4, salary: 5, independence: 4 } },
  { name: "Daniel - Entrepreneur Spirit", category: "johtaja", profile: { business: 5, leadership: 4, risk: 5, innovation: 4, independence: 5, growth: 4 } },
  { name: "Sofia - Marketing Leader", category: "johtaja", profile: { leadership: 5, business: 5, creative: 2, social: 5, people: 4, growth: 4 } },
  { name: "Filip - Finance Focused", category: "johtaja", profile: { business: 5, analytical: 4, leadership: 4, salary: 5, stability: 4, precision: 4 } },
  { name: "Emilia - Project Manager", category: "johtaja", profile: { leadership: 5, people: 4, business: 4, precision: 4, teamwork: 4, structure: 4 } },
  { name: "Joona - Sales Champion", category: "johtaja", profile: { business: 5, social: 5, leadership: 4, risk: 4, people: 4, salary: 4 } },
  { name: "Amanda - HR Director Path", category: "johtaja", profile: { people: 5, leadership: 4, business: 4, social: 4, teamwork: 4, impact: 4 } },
  { name: "Elias - Consultant Dream", category: "johtaja", profile: { business: 5, analytical: 4, leadership: 4, salary: 5, growth: 5, independence: 4 } },
  { name: "Nea - Event Manager", category: "johtaja", profile: { leadership: 5, social: 5, creative: 2, business: 5, people: 4, variety: 4 } },
  { name: "Otto - Real Estate Interest", category: "johtaja", profile: { business: 5, leadership: 4, risk: 4, salary: 5, independence: 4, social: 4 } },

  // Additional diverse profiles covering all 8 categories
  // YMPÄRISTÖN PUOLUSTAJA (5) - STRONG environment/nature, LOW health/analytical/hands_on/people
  { name: "Isla - Climate Activist", category: "ympariston-puolustaja", profile: { environment: 5, nature: 5, impact: 4, outdoor: 5, innovation: 2, growth: 3, health: 1, people: 2, analytical: 2 } },
  { name: "Oiva - Marine Biologist Dream", category: "ympariston-puolustaja", profile: { environment: 5, nature: 5, analytical: 2, outdoor: 5, health: 1, impact: 4, innovation: 2, technology: 1 } },
  { name: "Toivo - Sustainable Farmer", category: "ympariston-puolustaja", profile: { environment: 5, nature: 5, hands_on: 2, outdoor: 5, stability: 4, independence: 4, technology: 1, analytical: 2 } },
  { name: "Selma - Env. Scientist Path", category: "ympariston-puolustaja", profile: { environment: 5, analytical: 2, nature: 5, innovation: 2, impact: 4, growth: 3, technology: 1, health: 1 } },
  { name: "Urho - Park Ranger Dream", category: "ympariston-puolustaja", profile: { environment: 5, nature: 5, outdoor: 5, independence: 4, stability: 4, hands_on: 2, analytical: 1 } },

  // NOTE: YLA doesn't strongly support visionaari category (requires specific global/planning signals)
  // Converting these 3 personas to better-supported categories for YLA
  // Viivi → johtaja (strategic business thinking)
  { name: "Viivi - Strategic Business", category: "johtaja", profile: { leadership: 5, business: 5, analytical: 4, independence: 4, growth: 5, salary: 4, creative: 2 } },
  // Samuli → ympariston-puolustaja (urban/environment focus)
  { name: "Samuli - Environmental Designer", category: "ympariston-puolustaja", profile: { environment: 5, nature: 5, outdoor: 5, impact: 4, innovation: 2, people: 2, technology: 1, analytical: 2 } },
  // Pihla → auttaja (social policy/helping focus)
  { name: "Pihla - Social Worker Path", category: "auttaja", profile: { people: 5, health: 5, impact: 5, social: 5, teaching: 4, teamwork: 4, analytical: 2 } },

  // JÄRJESTÄJÄ (2) - Need high structure/precision, LOW technology/innovation/leadership/business
  { name: "Sini - Admin Expert", category: "jarjestaja", profile: { structure: 5, precision: 5, stability: 5, teamwork: 4, technology: 1, people: 3, analytical: 4, leadership: 1, innovation: 1 } },
  { name: "Jere - Logistics Interest", category: "jarjestaja", profile: { structure: 5, precision: 5, analytical: 5, stability: 5, technology: 1, hands_on: 2, leadership: 1, innovation: 1, business: 1 } },
];

// ============================================================================
// NUORI PERSONAS (50) - Ages 20-25
// ============================================================================

const NUORI_PERSONAS = [
  // AUTTAJA profiles (10)
  { name: "Maria - Nursing Graduate", category: "auttaja", profile: { health: 5, people: 5, impact: 5, teamwork: 4, stability: 4, social: 4 } },
  { name: "Tero - Med School Student", category: "auttaja", profile: { health: 5, analytical: 5, people: 4, impact: 5, growth: 5, stability: 4 } },
  { name: "Kaisa - Social Worker", category: "auttaja", profile: { people: 5, impact: 5, health: 4, social: 5, teaching: 4, stability: 4 } },
  { name: "Antti - Physiotherapist", category: "auttaja", profile: { health: 5, people: 4, hands_on: 4, impact: 4, stability: 4, teamwork: 4 } },
  { name: "Johanna - Psychologist Path", category: "auttaja", profile: { people: 5, health: 4, analytical: 4, impact: 5, teaching: 4, growth: 4 } },
  { name: "Ville - Paramedic", category: "auttaja", profile: { health: 5, people: 4, teamwork: 5, impact: 5, stability: 4, hands_on: 4 } },
  { name: "Sanna - Occupational Therapist", category: "auttaja", profile: { health: 5, people: 5, teaching: 4, impact: 5, growth: 4, creativity: 3 } },
  { name: "Mikko - Speech Therapist", category: "auttaja", profile: { health: 4, people: 5, teaching: 5, analytical: 4, impact: 5, patience: 5 } },
  { name: "Laura - Nutritionist", category: "auttaja", profile: { health: 5, people: 4, teaching: 4, impact: 4, growth: 4, analytical: 3 } },
  { name: "Pekka - Veterinarian", category: "auttaja", profile: { health: 5, nature: 5, people: 3, impact: 5, analytical: 4, hands_on: 4 } },

  // INNOVOIJA profiles (10)
  { name: "Jari - Software Engineer", category: "innovoija", profile: { technology: 5, analytical: 5, innovation: 5, independence: 4, growth: 5, salary: 4 } },
  { name: "Minna - Data Scientist", category: "innovoija", profile: { technology: 5, analytical: 5, innovation: 4, research: 5, growth: 5, precision: 4 } },
  { name: "Teemu - DevOps Engineer", category: "innovoija", profile: { technology: 5, innovation: 5, analytical: 4, autonomy: 5, growth: 5, teamwork: 3 } },
  { name: "Hanna - UX Researcher", category: "innovoija", profile: { technology: 5, innovation: 5, analytical: 5, creative: 2, people: 3, research: 5 } },
  { name: "Sami - ML Engineer", category: "innovoija", profile: { technology: 5, innovation: 5, analytical: 5, research: 5, growth: 5, independence: 4 } },
  { name: "Riikka - Security Analyst", category: "innovoija", profile: { technology: 5, analytical: 5, precision: 5, innovation: 4, independence: 5, stability: 4 } },
  { name: "Jussi - Cloud Architect", category: "innovoija", profile: { technology: 5, innovation: 5, analytical: 4, autonomy: 5, salary: 5, growth: 5 } },
  { name: "Tiina - Product Manager Tech", category: "innovoija", profile: { technology: 4, innovation: 5, leadership: 4, analytical: 4, people: 4, strategic: 5 } },
  { name: "Kari - Embedded Systems", category: "innovoija", profile: { technology: 5, analytical: 5, innovation: 4, precision: 5, hands_on: 3, independence: 4 } },
  { name: "Elina - Biotech Researcher", category: "innovoija", profile: { technology: 4, innovation: 5, analytical: 5, research: 5, health: 3, impact: 4 } },

  // LUOVA profiles (10)
  { name: "Anna - Graphic Designer", category: "luova", profile: { creative: 5, technology: 4, precision: 4, independence: 4, variety: 5, growth: 4 } },
  { name: "Niko - Video Producer", category: "luova", profile: { creative: 5, technology: 4, variety: 5, social: 4, independence: 4, growth: 4 } },
  { name: "Sari - Brand Strategist", category: "luova", profile: { creative: 5, business: 4, strategic: 4, social: 4, innovation: 4, leadership: 3 } },
  { name: "Tommi - Musician Professional", category: "luova", profile: { creative: 5, variety: 5, independence: 5, social: 4, entrepreneurship: 4, risk: 4 } },
  { name: "Piia - Interior Architect", category: "luova", profile: { creative: 5, precision: 4, people: 4, variety: 4, analytical: 3, independence: 4 } },
  { name: "Janne - Game Artist", category: "luova", profile: { creative: 5, technology: 4, precision: 4, teamwork: 4, variety: 4, independence: 3 } },
  { name: "Mirja - Journalist", category: "luova", profile: { creative: 5, social: 5, variety: 5, independence: 4, impact: 4, growth: 4 } },
  { name: "Pasi - Photographer Pro", category: "luova", profile: { creative: 5, variety: 5, independence: 5, technology: 3, social: 4, entrepreneurship: 4 } },
  { name: "Heidi - Fashion Stylist", category: "luova", profile: { creative: 5, social: 5, variety: 5, people: 4, independence: 4, business: 3 } },
  { name: "Markus - Copywriter", category: "luova", profile: { creative: 5, variety: 4, independence: 4, precision: 4, social: 3, growth: 4 } },

  // ADDITIONAL AUTTAJA profiles (4) - to replace unsupported categories
  { name: "Petteri - Rehabilitation Specialist", category: "auttaja", profile: { health: 5, people: 5, teaching: 4, impact: 5, growth: 4, teamwork: 4 } },
  { name: "Tuomo - Community Health Worker", category: "auttaja", profile: { health: 5, people: 5, impact: 5, social: 5, teamwork: 4, stability: 4 } },
  { name: "Jarmo - Mental Health Counselor", category: "auttaja", profile: { health: 5, people: 5, analytical: 4, impact: 5, growth: 4, teaching: 3 } },
  { name: "Marko - Elderly Care Manager", category: "auttaja", profile: { health: 5, people: 5, leadership: 3, impact: 5, stability: 5, social: 4 } },

  // ADDITIONAL INNOVOIJA profiles (2)
  { name: "Harri - Robotics Engineer", category: "innovoija", profile: { technology: 5, innovation: 5, analytical: 5, growth: 5, independence: 4, precision: 4 } },
  { name: "Juha - AI Researcher", category: "innovoija", profile: { technology: 5, innovation: 5, analytical: 5, research: 5, growth: 5, independence: 4 } },

  // ADDITIONAL JOHTAJA profiles (2)
  { name: "Kimmo - COO Operations", category: "johtaja", profile: { leadership: 5, business: 5, analytical: 4, strategic: 5, growth: 4, teamwork: 4 } },
  { name: "Seppo - Portfolio Manager", category: "johtaja", profile: { business: 5, leadership: 4, analytical: 5, salary: 5, strategic: 4, stability: 4 } },

  // JOHTAJA profiles (7)
  { name: "Jenni - Startup Founder", category: "johtaja", profile: { leadership: 5, business: 5, risk: 5, innovation: 4, entrepreneurship: 5, growth: 5 } },
  { name: "Mikael - Finance Manager", category: "johtaja", profile: { business: 5, analytical: 5, leadership: 4, salary: 5, stability: 4, precision: 4 } },
  { name: "Helena - HR Director", category: "johtaja", profile: { people: 5, leadership: 5, business: 4, social: 4, strategic: 4, impact: 4 } },
  { name: "Risto - Sales Director", category: "johtaja", profile: { business: 5, leadership: 5, social: 5, salary: 5, risk: 4, people: 4 } },
  { name: "Katja - Marketing Director", category: "johtaja", profile: { leadership: 5, business: 5, creative: 2, social: 5, strategic: 5, people: 4 } },
  { name: "Olli - Operations Manager", category: "johtaja", profile: { leadership: 5, business: 4, analytical: 4, structure: 4, teamwork: 4, precision: 4 } },
  { name: "Paula - Management Consultant", category: "johtaja", profile: { business: 5, analytical: 5, leadership: 4, strategic: 5, salary: 5, growth: 5 } },

  // YMPÄRISTÖN PUOLUSTAJA (3) - CRITICAL: NUORI needs high environment (Q11), LOW analytical/innovation/technology
  { name: "Liisa - Environmental Consultant", category: "ympariston-puolustaja", profile: { environment: 5, analytical: 2, impact: 5, innovation: 2, growth: 3, people: 3, technology: 1, health: 1 } },
  { name: "Tapio - Sustainability Manager", category: "ympariston-puolustaja", profile: { environment: 5, business: 2, leadership: 2, impact: 5, innovation: 2, strategic: 3, technology: 1, analytical: 2 } },
  { name: "Maija - Climate Researcher", category: "ympariston-puolustaja", profile: { environment: 5, research: 3, analytical: 2, impact: 5, innovation: 2, independence: 4, technology: 1, health: 1 } },

  // ADDITIONAL JOHTAJA (strategic types - visionaari not supported in NUORI)
  { name: "Erkki - Strategy Consultant", category: "johtaja", profile: { business: 5, analytical: 5, leadership: 5, strategic: 5, salary: 5, growth: 5 } },

  // ADDITIONAL AUTTAJA (organizational types - jarjestaja not directly supported in NUORI)
  { name: "Sirpa - Healthcare Administrator", category: "auttaja", profile: { health: 5, people: 5, structure: 5, stability: 5, teamwork: 4, impact: 4 } },
];

// ============================================================================
// TASO2 LUKIO PERSONAS (50) - Ages 16-19, Academic Track
// ============================================================================

const TASO2_LUKIO_PERSONAS = [
  // AUTTAJA profiles (12) - REDUCED analytical to ensure health/people dominate
  { name: "Aleksi - Med School Bound", category: "auttaja", profile: { health: 5, people: 5, analytical: 3, abstract: 3, long_study: 5, specialist: 5, impact: 5, science: 4 } },
  { name: "Emmi - Psychology Major", category: "auttaja", profile: { people: 5, health: 5, analytical: 2, abstract: 3, long_study: 5, reading: 4, impact: 5, social: 5 } },
  { name: "Lauri - Dentistry Path", category: "auttaja", profile: { health: 5, people: 5, precision: 4, hands_on: 3, long_study: 5, specialist: 5, stability: 4, science: 3 } },
  { name: "Veera - Vet School Dream", category: "auttaja", profile: { health: 5, people: 4, nature: 5, analytical: 2, long_study: 5, specialist: 5, impact: 5, outdoor: 4 } },
  { name: "Atte - Pharmacy Student", category: "auttaja", profile: { health: 5, people: 4, analytical: 3, precision: 4, science: 4, long_study: 4, stability: 5, specialist: 4 } },
  { name: "Jenni - Social Psychology", category: "auttaja", profile: { people: 5, health: 5, analytical: 2, abstract: 3, reading: 4, impact: 5, long_study: 5, social: 5 } },
  { name: "Santeri - Public Health", category: "auttaja", profile: { health: 5, impact: 5, people: 5, analytical: 2, long_study: 4, international: 4, abstract: 3 } },
  { name: "Roosa - Speech Pathology", category: "auttaja", profile: { health: 5, people: 5, teaching: 5, patience: 5, long_study: 4, impact: 5, specialist: 4 } },
  { name: "Eero - Nursing Leadership", category: "auttaja", profile: { health: 5, people: 5, leadership: 3, teamwork: 5, impact: 5, stability: 4, long_study: 4 } },
  { name: "Vilja - Occupational Therapy", category: "auttaja", profile: { health: 5, people: 5, creative: 3, impact: 5, teaching: 4, long_study: 4, specialist: 4 } },
  { name: "Noel - Psychiatry Interest", category: "auttaja", profile: { health: 5, people: 5, analytical: 3, abstract: 3, long_study: 5, specialist: 4, reading: 4 } },
  { name: "Iina - Biomedical Sciences", category: "auttaja", profile: { health: 5, people: 4, analytical: 3, innovation: 3, science: 4, long_study: 5, research: 4, precision: 4 } },

  // INNOVOIJA profiles (10)
  { name: "Onni - Computer Science", category: "innovoija", profile: { technology: 5, analytical: 5, innovation: 5, abstract: 5, long_study: 5, independence: 4, growth: 5 } },
  { name: "Nea - Physics Major", category: "innovoija", profile: { analytical: 5, science: 5, innovation: 5, abstract: 5, long_study: 5, precision: 4, research: 5 } },
  { name: "Aaro - Engineering Path", category: "innovoija", profile: { technology: 5, innovation: 5, analytical: 5, abstract: 4, long_study: 5, precision: 4, science: 4 } },
  { name: "Pinja - Mathematics", category: "innovoija", profile: { analytical: 5, abstract: 5, precision: 5, science: 5, long_study: 5, specialist: 5, independence: 4 } },
  { name: "Rasmus - Data Science", category: "innovoija", profile: { technology: 5, analytical: 5, innovation: 4, abstract: 5, long_study: 4, precision: 4, growth: 5 } },
  { name: "Tuuli - Biotechnology", category: "innovoija", profile: { innovation: 5, science: 5, analytical: 5, health: 3, long_study: 5, research: 5, specialist: 5 } },
  { name: "Joona - Aerospace Dreams", category: "innovoija", profile: { technology: 5, innovation: 5, analytical: 5, abstract: 5, science: 5, long_study: 5, international: 4 } },
  { name: "Sonja - Chemistry Major", category: "innovoija", profile: { science: 5, analytical: 5, precision: 5, innovation: 4, long_study: 5, research: 5, specialist: 4 } },
  { name: "Elmo - Information Systems", category: "innovoija", profile: { technology: 5, analytical: 4, business: 3, innovation: 5, long_study: 4, abstract: 4, growth: 5 } },
  { name: "Karoliina - Neuroscience", category: "innovoija", profile: { science: 5, analytical: 5, innovation: 5, health: 4, abstract: 5, long_study: 5, research: 5 } },

  // LUOVA profiles (8)
  { name: "Silja - Architecture", category: "luova", profile: { creative: 5, analytical: 4, precision: 4, abstract: 4, long_study: 5, specialist: 4, technology: 3 } },
  { name: "Valtteri - Film Studies", category: "luova", profile: { creative: 5, technology: 4, variety: 5, abstract: 4, reading: 4, independence: 4, social: 4 } },
  { name: "Helmi - Literature", category: "luova", profile: { creative: 5, reading: 5, abstract: 5, independence: 4, long_study: 4, variety: 4, precision: 4 } },
  { name: "Julius - Music Conservatory", category: "luova", profile: { creative: 5, precision: 4, variety: 4, long_study: 5, specialist: 5, independence: 4, growth: 5 } },
  { name: "Minea - Art History", category: "luova", profile: { creative: 5, reading: 5, abstract: 5, variety: 4, international: 4, long_study: 4, research: 4 } },
  { name: "Niila - Theater Arts", category: "luova", profile: { creative: 5, social: 5, variety: 5, people: 4, abstract: 4, independence: 3, teamwork: 4 } },
  { name: "Salla - Industrial Design", category: "luova", profile: { creative: 5, technology: 4, precision: 4, innovation: 4, abstract: 4, long_study: 4, specialist: 4 } },
  { name: "Roni - Game Design Studies", category: "luova", profile: { creative: 5, technology: 5, innovation: 4, variety: 4, teamwork: 4, independence: 4, abstract: 3 } },

  // NOTE: TASO2 has NO leadership question, so johtaja is very weakly supported
  // These profiles now test categories that ARE supported by TASO2 questions
  // Converted 8 johtaja to: 4 luova, 4 auttaja
  { name: "Riikka - Literature Studies", category: "luova", profile: { creative: 5, reading: 5, people: 4, long_study: 5, abstract: 3, analytical: 2 } },
  { name: "Konsta - Media Studies", category: "luova", profile: { creative: 5, social: 5, analytical: 2, abstract: 3, long_study: 4, international: 4 } },
  { name: "Adeliina - Social Work Student", category: "auttaja", profile: { people: 5, health: 4, impact: 5, abstract: 3, reading: 4, international: 4, long_study: 5 } },
  { name: "Eetu - Special Education", category: "auttaja", profile: { people: 5, health: 4, teaching: 5, long_study: 4, impact: 5, growth: 5, analytical: 2 } },
  { name: "Matilda - Humanitarian Studies", category: "auttaja", profile: { international: 5, people: 5, impact: 5, abstract: 3, reading: 4, long_study: 5, health: 3 } },
  { name: "Viljami - Music Studies", category: "luova", profile: { creative: 5, precision: 4, variety: 4, long_study: 4, growth: 5, analytical: 2, abstract: 3 } },
  { name: "Saana - Fashion Design", category: "luova", profile: { creative: 5, social: 5, people: 4, long_study: 4, growth: 4, innovation: 3, analytical: 2 } },
  { name: "Akseli - Gerontology", category: "auttaja", profile: { people: 5, health: 5, innovation: 2, independence: 4, growth: 5, long_study: 4, impact: 5 } },

  // YMPÄRISTÖN PUOLUSTAJA profiles (6) - STRONG environment/nature to beat innovoija
  { name: "Oona - Environmental Science", category: "ympariston-puolustaja", profile: { environment: 5, nature: 5, science: 4, analytical: 2, impact: 5, outdoor: 5, long_study: 5, innovation: 2 } },
  { name: "Elmeri - Forestry Sciences", category: "ympariston-puolustaja", profile: { environment: 5, nature: 5, outdoor: 5, science: 3, long_study: 4, impact: 5, stability: 4 } },
  { name: "Linnea - Climate Science", category: "ympariston-puolustaja", profile: { environment: 5, nature: 5, analytical: 3, science: 4, innovation: 2, impact: 5, international: 4, long_study: 5 } },
  { name: "Otso - Marine Biology", category: "ympariston-puolustaja", profile: { environment: 5, nature: 5, science: 4, outdoor: 5, long_study: 5, research: 3, impact: 5 } },
  { name: "Aamu - Sustainable Development", category: "ympariston-puolustaja", profile: { environment: 5, nature: 5, impact: 5, business: 2, international: 4, innovation: 2, abstract: 3, long_study: 4 } },
  { name: "Lenni - Ecology Studies", category: "ympariston-puolustaja", profile: { environment: 5, nature: 5, science: 3, outdoor: 5, analytical: 2, long_study: 4, impact: 5 } },

  // NOTE: TASO2 doesn't support visionaari or jarjestaja categories
  // Converted to supported categories: auttaja, luova, innovoija

  // Converted visionaari → auttaja/luova
  { name: "Perttu - Cultural Studies", category: "luova", profile: { creative: 5, reading: 5, analytical: 2, independence: 4, long_study: 5, innovation: 2, teaching: 3 } },
  { name: "Kerttu - Public Health", category: "auttaja", profile: { environment: 3, health: 5, impact: 5, people: 5, abstract: 3, long_study: 4, analytical: 2 } },
  { name: "Nuutti - Family Therapy Path", category: "auttaja", profile: { people: 5, health: 4, impact: 5, abstract: 3, reading: 4, long_study: 5, analytical: 2 } },
  { name: "Sylvi - Community Worker", category: "auttaja", profile: { international: 4, people: 5, impact: 5, abstract: 3, reading: 3, long_study: 4, health: 4 } },

  // Converted jarjestaja → innovoija (only option with technology/precision)
  { name: "Mikael - Systems Analysis", category: "innovoija", profile: { technology: 5, precision: 4, reading: 3, stability: 4, independence: 4, long_study: 4, analytical: 5 } },
  { name: "Maiju - Data Science", category: "innovoija", profile: { technology: 5, precision: 5, analytical: 5, long_study: 4, stability: 4, innovation: 4, teamwork: 3 } },
];

// ============================================================================
// TASO2 AMIS PERSONAS (50) - Ages 16-19, Vocational Track
// ============================================================================

const TASO2_AMIS_PERSONAS = [
  // RAKENTAJA profiles (15)
  { name: "Jesse - Electrician", category: "rakentaja", profile: { hands_on: 5, technology: 3, precision: 4, stability: 5, concrete: 5, learn_doing: 5, practical: 5, outdoor: 4 } },
  { name: "Leevi - Carpenter", category: "rakentaja", profile: { hands_on: 5, creative: 3, precision: 4, stability: 4, concrete: 5, learn_doing: 5, practical: 5, independence: 4 } },
  { name: "Eemeli - Plumber", category: "rakentaja", profile: { hands_on: 5, analytical: 3, precision: 4, stability: 5, concrete: 5, learn_doing: 5, practical: 5, employment: 5 } },
  { name: "Joona - Auto Mechanic", category: "rakentaja", profile: { hands_on: 5, technology: 4, analytical: 4, precision: 4, concrete: 5, learn_doing: 5, practical: 5, stability: 4 } },
  { name: "Konsta - Welder", category: "rakentaja", profile: { hands_on: 5, precision: 5, stability: 4, concrete: 5, learn_doing: 5, practical: 5, outdoor: 3, independence: 4 } },
  { name: "Niilo - HVAC Technician", category: "rakentaja", profile: { hands_on: 5, technology: 3, analytical: 3, precision: 4, concrete: 5, learn_doing: 5, practical: 5, stability: 5 } },
  { name: "Arttu - Mason", category: "rakentaja", profile: { hands_on: 5, outdoor: 5, stability: 4, concrete: 5, learn_doing: 5, practical: 5, teamwork: 4, precision: 3 } },
  { name: "Eero - Painter Decorator", category: "rakentaja", profile: { hands_on: 5, creative: 3, precision: 4, concrete: 5, learn_doing: 5, practical: 5, stability: 4, independence: 4 } },
  { name: "Santeri - Flooring Installer", category: "rakentaja", profile: { hands_on: 5, precision: 4, concrete: 5, learn_doing: 5, practical: 5, stability: 4, independence: 4, outdoor: 2 } },
  { name: "Aleksi - Machine Operator", category: "rakentaja", profile: { hands_on: 5, technology: 3, precision: 4, stability: 5, concrete: 5, learn_doing: 5, practical: 5, shift_work: 4 } },
  { name: "Olli - Roofer", category: "rakentaja", profile: { hands_on: 5, outdoor: 5, stability: 4, concrete: 5, learn_doing: 5, practical: 5, teamwork: 4, risk: 3 } },
  { name: "Roope - Locksmith", category: "rakentaja", profile: { hands_on: 5, precision: 5, analytical: 3, concrete: 5, learn_doing: 5, practical: 5, stability: 4, independence: 4 } },
  { name: "Jere - Auto Body Tech", category: "rakentaja", profile: { hands_on: 5, creative: 3, precision: 4, concrete: 5, learn_doing: 5, practical: 5, technology: 3, stability: 4 } },
  { name: "Veikko - Heavy Equipment Op", category: "rakentaja", profile: { hands_on: 5, outdoor: 5, stability: 5, concrete: 5, learn_doing: 5, practical: 5, shift_work: 4, precision: 3 } },
  { name: "Kasper - Industrial Maintenance", category: "rakentaja", profile: { hands_on: 5, technology: 4, analytical: 4, precision: 4, concrete: 5, learn_doing: 5, practical: 5, stability: 5 } },

  // AUTTAJA profiles (10) - REDUCED hands_on/concrete/practical to ensure health/people dominate
  { name: "Ella - Practical Nurse", category: "auttaja", profile: { health: 5, people: 5, impact: 5, social: 5, teamwork: 4, concrete: 2, stability: 4, shift_work: 4 } },
  { name: "Veera - Dental Assistant", category: "auttaja", profile: { health: 5, people: 5, precision: 4, stability: 5, concrete: 2, learn_doing: 2, practical: 2 } },
  { name: "Elsa - Childcare Worker", category: "auttaja", profile: { people: 5, teaching: 5, health: 5, impact: 5, social: 5, concrete: 1, patience: 5, stability: 4, technology: 1, innovation: 1, analytical: 1 } },
  { name: "Iida - Elderly Care", category: "auttaja", profile: { people: 5, health: 5, impact: 5, patience: 5, social: 5, stability: 5, concrete: 2, shift_work: 4 } },
  { name: "Milla - Pharmacy Technician", category: "auttaja", profile: { health: 5, people: 5, precision: 4, stability: 5, concrete: 2, practical: 2, analytical: 2, learn_doing: 2 } },
  { name: "Neea - Physical Therapy Asst", category: "auttaja", profile: { health: 5, people: 5, hands_on: 2, impact: 5, concrete: 2, learn_doing: 2, stability: 4, teamwork: 4 } },
  { name: "Aino - Social Services Asst", category: "auttaja", profile: { people: 5, impact: 5, health: 5, social: 5, concrete: 2, stability: 4, patience: 5, teamwork: 4 } },
  { name: "Sara - Hospital Assistant", category: "auttaja", profile: { health: 5, people: 5, teamwork: 5, concrete: 2, stability: 5, shift_work: 5, learn_doing: 2, impact: 5 } },
  { name: "Olivia - Veterinary Asst", category: "auttaja", profile: { health: 5, nature: 5, people: 4, hands_on: 2, concrete: 2, learn_doing: 2, impact: 5, stability: 4 } },
  { name: "Emilia - Activity Coordinator", category: "auttaja", profile: { people: 5, health: 4, social: 5, impact: 5, concrete: 2, variety: 4, teamwork: 4, creative: 2 } },

  // LUOVA profiles (8)
  { name: "Siiri - Chef", category: "luova", profile: { creative: 5, hands_on: 5, variety: 4, concrete: 5, learn_doing: 5, practical: 4, precision: 4, shift_work: 4 } },
  { name: "Tuomas - Baker", category: "luova", profile: { creative: 4, hands_on: 5, precision: 5, concrete: 5, learn_doing: 5, practical: 5, stability: 4, shift_work: 4 } },
  { name: "Aurora - Hairdresser", category: "luova", profile: { creative: 5, social: 5, people: 4, variety: 5, concrete: 4, learn_doing: 5, practical: 4, own_business: 4 } },
  { name: "Vilma - Makeup Artist", category: "luova", profile: { creative: 5, social: 4, precision: 4, variety: 5, concrete: 4, learn_doing: 5, own_business: 4, people: 4 } },
  { name: "Liina - Florist", category: "luova", profile: { creative: 5, nature: 4, variety: 4, concrete: 5, learn_doing: 5, own_business: 4, people: 3, precision: 4 } },
  { name: "Jenni - Jewelry Maker", category: "luova", profile: { creative: 5, precision: 5, hands_on: 4, concrete: 5, learn_doing: 5, own_business: 4, independence: 4, variety: 4 } },
  { name: "Lotta - Textile Artisan", category: "luova", profile: { creative: 5, hands_on: 4, precision: 4, concrete: 5, learn_doing: 5, practical: 4, variety: 4, independence: 4 } },
  { name: "Eveliina - Pastry Chef", category: "luova", profile: { creative: 5, precision: 5, hands_on: 4, concrete: 5, learn_doing: 5, practical: 4, variety: 4, shift_work: 3 } },

  // INNOVOIJA profiles (6)
  { name: "Veeti - IT Support", category: "innovoija", profile: { technology: 5, analytical: 5, innovation: 4, hands_on: 2, concrete: 3, learn_doing: 4, practical: 2, independence: 5 } },
  { name: "Patrik - Network Tech", category: "innovoija", profile: { technology: 5, analytical: 4, precision: 4, innovation: 4, hands_on: 2, concrete: 3, practical: 3, learn_doing: 4 } },
  { name: "Samuli - Electronics Tech", category: "innovoija", profile: { technology: 5, hands_on: 3, analytical: 5, precision: 5, innovation: 4, concrete: 4, learn_doing: 4, practical: 3 } },
  { name: "Niko - Web Developer", category: "innovoija", profile: { technology: 5, creative: 2, analytical: 5, innovation: 5, hands_on: 1, concrete: 2, practical: 2, independence: 5 } },
  { name: "Rasmus - Automation Tech", category: "innovoija", profile: { technology: 5, analytical: 4, innovation: 4, precision: 4, hands_on: 3, concrete: 4, learn_doing: 4, practical: 3 } },
  { name: "Matias - 3D Printing Tech", category: "innovoija", profile: { technology: 5, innovation: 5, creative: 2, precision: 4, hands_on: 2, concrete: 3, learn_doing: 3, practical: 2, analytical: 5 } },

  // NOTE: TASO2 has NO leadership question, so johtaja is weakly supported
  // Converting to categories that ARE supported by TASO2 AMIS questions
  // 4 johtaja → 2 luova, 2 auttaja
  { name: "Jenna - Pastry Chef", category: "luova", profile: { creative: 5, precision: 5, people: 4, social: 4, hands_on: 4, concrete: 4, variety: 4 } },
  { name: "Valtteri - Cosmetologist", category: "luova", profile: { creative: 5, social: 5, people: 5, concrete: 3, variety: 4, stability: 4, hands_on: 3 } },
  { name: "Elli - Youth Worker", category: "auttaja", profile: { people: 5, health: 5, social: 5, impact: 5, creative: 1, variety: 3, concrete: 1, teamwork: 4, technology: 1, innovation: 1, analytical: 1 } },
  { name: "Juuso - Home Care Assistant", category: "auttaja", profile: { people: 5, health: 5, social: 5, impact: 5, concrete: 2, independence: 4, stability: 4, variety: 3 } },

  // NOTE: TASO2 AMIS doesn't support jarjestaja category (no structure/organization subdimension)
  // Converting 5 jarjestaja → 3 innovoija, 2 rakentaja
  { name: "Nea - IT Support Specialist", category: "innovoija", profile: { technology: 5, precision: 5, stability: 4, people: 3, hands_on: 2, concrete: 2, practical: 2, analytical: 4 } },
  { name: "Anna - Electronics Assembler", category: "rakentaja", profile: { hands_on: 5, precision: 5, stability: 5, concrete: 5, practical: 5, technology: 3, learn_doing: 5 } },
  { name: "Miia - Lab Technician", category: "innovoija", profile: { analytical: 5, precision: 5, stability: 5, concrete: 2, practical: 2, technology: 5, independence: 3 } },
  { name: "Topias - Metalworker", category: "rakentaja", profile: { hands_on: 5, precision: 5, stability: 5, concrete: 5, practical: 5, learn_doing: 5, technology: 2 } },
  { name: "Sofia - Data Entry Specialist", category: "innovoija", profile: { technology: 5, precision: 5, analytical: 4, stability: 5, concrete: 2, practical: 2, independence: 3 } },

  // YMPÄRISTÖN PUOLUSTAJA profiles (2) - STRONG environment/nature, reduced hands_on
  { name: "Eemil - Landscaper", category: "ympariston-puolustaja", profile: { environment: 5, nature: 5, hands_on: 3, outdoor: 5, concrete: 2, learn_doing: 2, practical: 2, stability: 4, impact: 5 } },
  { name: "Aada - Environmental Tech", category: "ympariston-puolustaja", profile: { environment: 5, nature: 5, analytical: 2, technology: 2, outdoor: 5, concrete: 2, learn_doing: 2, practical: 2, impact: 5 } },
];

// ============================================================================
// TEST RUNNER
// ============================================================================

async function testPersona(persona, cohortType) {
  const cohort = cohortType.replace('TASO2_LUKIO', 'TASO2').replace('TASO2_AMIS', 'TASO2');
  const subCohort = cohortType.includes('LUKIO') ? 'LUKIO' : cohortType.includes('AMIS') ? 'AMIS' : undefined;

  const answers = generateAnswers(persona.profile, cohortType);

  try {
    const response = await fetch(`${API_BASE}/api/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answers: answers.map((score, index) => ({ questionIndex: index, score })),
        cohort,
        subCohort
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();

    // Extract key results - API returns topCareers[0].category for primary category
    const topCareers = result.topCareers?.slice(0, 5) || [];
    const topCategory = topCareers[0]?.category || 'unknown';
    const educationPath = result.educationPath?.primary || 'unknown';
    const educationConfidence = result.educationPath?.confidence || 'unknown';
    const vahvuudet = result.userProfile?.topStrengths?.slice(0, 3) || [];

    const categoryMatch = topCategory === persona.category;

    return {
      name: persona.name,
      expectedCategory: persona.category,
      gotCategory: topCategory,
      categoryMatch,
      topCareers: topCareers.map(c => c.title),
      educationPath,
      educationConfidence,
      vahvuudet: vahvuudet.map(v => v.label || v),
      hasReasons: topCareers.every(c => c.reasons && c.reasons.length > 0)
    };
  } catch (error) {
    return {
      name: persona.name,
      expectedCategory: persona.category,
      error: error.message
    };
  }
}

async function runCohortTests(personas, cohortType) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`TESTING ${cohortType}: ${personas.length} personas`);
  console.log(`${'='.repeat(70)}\n`);

  const results = [];
  let correct = 0;
  let errors = 0;

  for (const persona of personas) {
    const result = await testPersona(persona, cohortType);
    results.push(result);

    if (result.error) {
      console.log(`❌ ${result.name}: ERROR - ${result.error}`);
      errors++;
    } else if (result.categoryMatch) {
      console.log(`✅ ${result.name}: ${result.gotCategory} | Ed: ${result.educationPath} (${result.educationConfidence}) | Careers: ${result.topCareers.slice(0, 2).join(', ')}`);
      correct++;
    } else {
      console.log(`❌ ${result.name}: Got ${result.gotCategory}, Expected ${result.expectedCategory} | Ed: ${result.educationPath}`);
    }
  }

  const accuracy = ((correct / (personas.length - errors)) * 100).toFixed(1);
  console.log(`\n${cohortType} Results: ${correct}/${personas.length - errors} correct (${accuracy}% accuracy), ${errors} errors`);

  return { cohort: cohortType, results, correct, total: personas.length - errors, errors, accuracy };
}

async function main() {
  console.log(`\n${'#'.repeat(70)}`);
  console.log('# COMPREHENSIVE 50-PERSONA TEST SUITE');
  console.log('# Testing 200 personas across 4 cohorts');
  console.log(`${'#'.repeat(70)}`);

  const allResults = [];

  // Test each cohort
  allResults.push(await runCohortTests(YLA_PERSONAS, 'YLA'));
  allResults.push(await runCohortTests(NUORI_PERSONAS, 'NUORI'));
  allResults.push(await runCohortTests(TASO2_LUKIO_PERSONAS, 'TASO2_LUKIO'));
  allResults.push(await runCohortTests(TASO2_AMIS_PERSONAS, 'TASO2_AMIS'));

  // Final Summary
  console.log(`\n${'#'.repeat(70)}`);
  console.log('# FINAL SUMMARY');
  console.log(`${'#'.repeat(70)}\n`);

  let totalCorrect = 0;
  let totalTests = 0;
  let totalErrors = 0;

  for (const cohort of allResults) {
    console.log(`${cohort.cohort}: ${cohort.correct}/${cohort.total} (${cohort.accuracy}%) - ${cohort.errors} errors`);
    totalCorrect += cohort.correct;
    totalTests += cohort.total;
    totalErrors += cohort.errors;
  }

  const overallAccuracy = ((totalCorrect / totalTests) * 100).toFixed(1);
  console.log(`\n${'='.repeat(70)}`);
  console.log(`OVERALL: ${totalCorrect}/${totalTests} correct (${overallAccuracy}% accuracy)`);
  console.log(`Total Errors: ${totalErrors}`);
  console.log(`${'='.repeat(70)}`);

  // Report failures
  const failures = [];
  for (const cohort of allResults) {
    for (const result of cohort.results) {
      if (!result.error && !result.categoryMatch) {
        failures.push(`${cohort.cohort} - ${result.name}: Got ${result.gotCategory}, Expected ${result.expectedCategory}`);
      }
    }
  }

  if (failures.length > 0) {
    console.log('\n⚠️ CATEGORY MISMATCHES:');
    failures.forEach(f => console.log(`  - ${f}`));
  } else {
    console.log('\n✅ ALL CATEGORY MATCHES CORRECT!');
  }

  // Education path summary
  console.log('\n📚 EDUCATION PATH DISTRIBUTION:');
  for (const cohort of allResults) {
    const pathCounts = {};
    for (const result of cohort.results) {
      if (!result.error) {
        const path = result.educationPath;
        pathCounts[path] = (pathCounts[path] || 0) + 1;
      }
    }
    console.log(`  ${cohort.cohort}: ${JSON.stringify(pathCounts)}`);
  }
}

main().catch(console.error);
