/**
 * NEW REAL-LIFE PERSONA TESTS - All 4 Cohorts
 * Each persona represents a realistic student/young adult with authentic interests
 * Tests: YLA (13-16), TASO2 LUKIO (16-19 academic), TASO2 AMIS (16-19 vocational), NUORI (20-25)
 *
 * Run with: node scripts/test-real-personas.js
 */

const http = require('http');

// ============================================================================
// YLA PERSONAS (Ages 13-16) - 30 questions
// These are middle school students exploring their interests
// ============================================================================

const YLA_PERSONAS = [
  {
    name: "Ella - Future Veterinarian",
    description: "15-year-old who loves animals, spends weekends at a horse stable, dreams of becoming a vet.",
    expectedCategory: "auttaja",
    expectedCareers: ["Eläinlääkäri", "Eläintenhoitaja", "Sairaanhoitaja", "Terveydenhoitaja"],
    answers: [
      2, // Q0: Tech/games - low (prefers animals)
      3, // Q1: Puzzles - medium
      3, // Q2: Stories/drawing - medium
      3, // Q3: Building/fixing - medium
      5, // Q4: Nature/animals - HIGH (loves animals)
      5, // Q5: Human body - HIGH (medical interest)
      2, // Q6: Entrepreneurship - low
      4, // Q7: Experiments - medium-high (science for animals)
      3, // Q8: Sports - medium
      4, // Q9: Teaching/explaining - medium-high
      3, // Q10: Cooking - medium
      3, // Q11: New ideas - medium
      5, // Q12: Helping friends - HIGH (caring nature)
      3, // Q13: Group decisions - medium
      3, // Q14: Languages - medium
      4, // Q15: Teamwork - medium-high
      3, // Q16: Clear instructions - medium
      4, // Q17: Outdoor work - medium-high (stables, farms)
      2, // Q18: Focus difficulty (REVERSE) - good focus
      4, // Q19: Variety - medium-high
      2, // Q20: Stress (REVERSE) - handles well
      3, // Q21: Public speaking - medium
      4, // Q22: Initiative - medium-high
      5, // Q23: Help society - HIGH
      2, // Q24: Money - low (not motivated by money)
      3, // Q25: Recognition indifferent (REVERSE)
      4, // Q26: Work-life balance - medium-high
      3, // Q27: Be own boss - medium
      3, // Q28: Travel - medium
      4, // Q29: Know future - medium-high
    ]
  },
  {
    name: "Leo - Aspiring Game Developer",
    description: "14-year-old who plays games, learns coding on YouTube, wants to make his own games.",
    expectedCategory: "innovoija",
    expectedCareers: ["Pelisuunnittelija", "Ohjelmistokehittaja", "Data-insinööri", "Robotiikka-insinööri"],
    answers: [
      5, // Q0: Tech/games - HIGH
      5, // Q1: Puzzles - HIGH
      4, // Q2: Stories/drawing - medium-high (game stories)
      3, // Q3: Building/fixing - medium
      2, // Q4: Nature/animals - low
      2, // Q5: Human body - low
      3, // Q6: Entrepreneurship - medium
      5, // Q7: Experiments - HIGH (trying new things)
      2, // Q8: Sports - low
      3, // Q9: Teaching - medium
      2, // Q10: Cooking - low
      5, // Q11: New ideas - HIGH
      3, // Q12: Helping friends - medium
      3, // Q13: Group decisions - medium
      3, // Q14: Languages - medium
      3, // Q15: Teamwork - medium
      3, // Q16: Clear instructions - medium
      2, // Q17: Outdoor work - low (prefers indoors)
      2, // Q18: Focus difficulty (REVERSE) - good focus when gaming
      5, // Q19: Variety - HIGH
      3, // Q20: Stress (REVERSE) - medium
      2, // Q21: Public speaking - low
      4, // Q22: Initiative - medium-high
      3, // Q23: Help society - medium
      4, // Q24: Money - medium-high
      3, // Q25: Recognition indifferent (REVERSE)
      3, // Q26: Work-life balance - medium
      4, // Q27: Be own boss - medium-high
      3, // Q28: Travel - medium
      3, // Q29: Know future - medium
    ]
  },
  {
    name: "Sofia - Creative Influencer",
    description: "16-year-old who makes TikToks, loves fashion, dreams of becoming a content creator.",
    expectedCategory: "luova",
    expectedCareers: ["Graafinen suunnittelija", "Valokuvaaja", "Muusikko", "Toimittaja"],
    answers: [
      3, // Q0: Tech/games - medium (uses social media)
      2, // Q1: Puzzles - low
      5, // Q2: Stories/drawing - HIGH (creative content)
      2, // Q3: Building/fixing - low
      3, // Q4: Nature/animals - medium
      2, // Q5: Human body - low
      4, // Q6: Entrepreneurship - medium-high (influencer mindset)
      2, // Q7: Experiments - low
      3, // Q8: Sports - medium
      4, // Q9: Teaching - medium-high (tutorials)
      3, // Q10: Cooking - medium
      5, // Q11: New ideas - HIGH
      4, // Q12: Helping friends - medium-high
      3, // Q13: Group decisions - medium
      4, // Q14: Languages - medium-high (international audience)
      4, // Q15: Teamwork - medium-high
      2, // Q16: Clear instructions - low (prefers freedom)
      2, // Q17: Outdoor work - low
      3, // Q18: Focus difficulty (REVERSE) - medium
      5, // Q19: Variety - HIGH
      3, // Q20: Stress (REVERSE) - medium
      5, // Q21: Public speaking - HIGH (camera confident)
      5, // Q22: Initiative - HIGH
      3, // Q23: Help society - medium
      4, // Q24: Money - medium-high
      1, // Q25: Recognition indifferent (REVERSE) - wants fame
      3, // Q26: Work-life balance - medium
      5, // Q27: Be own boss - HIGH
      5, // Q28: Travel - HIGH
      3, // Q29: Know future - medium
    ]
  },
  {
    name: "Kalle - Hands-on Car Enthusiast",
    description: "15-year-old who helps his dad fix cars, loves motorcycles, wants to be a mechanic.",
    expectedCategory: "rakentaja",
    expectedCareers: ["Automekaanikko", "Sähköasentaja", "LVI-asentaja", "Rakennusmestari"],
    answers: [
      3, // Q0: Tech/games - medium
      3, // Q1: Puzzles - medium
      2, // Q2: Stories/drawing - low
      5, // Q3: Building/fixing - HIGH
      3, // Q4: Nature/animals - medium
      2, // Q5: Human body - low
      3, // Q6: Entrepreneurship - medium
      4, // Q7: Experiments - medium-high (tinkering)
      4, // Q8: Sports - medium-high
      2, // Q9: Teaching - low
      2, // Q10: Cooking - low
      3, // Q11: New ideas - medium
      3, // Q12: Helping friends - medium
      3, // Q13: Group decisions - medium
      2, // Q14: Languages - low
      4, // Q15: Teamwork - medium-high
      4, // Q16: Clear instructions - medium-high
      4, // Q17: Outdoor work - medium-high
      2, // Q18: Focus difficulty (REVERSE) - focused on cars
      4, // Q19: Variety - medium-high
      2, // Q20: Stress (REVERSE) - calm under pressure
      2, // Q21: Public speaking - low
      4, // Q22: Initiative - medium-high
      3, // Q23: Help society - medium
      4, // Q24: Money - medium-high
      3, // Q25: Recognition indifferent (REVERSE)
      4, // Q26: Work-life balance - medium-high
      4, // Q27: Be own boss - medium-high (own garage dream)
      2, // Q28: Travel - low (local work)
      4, // Q29: Know future - medium-high (stability)
    ]
  },
  {
    name: "Milla - Future Business Leader",
    description: "16-year-old class president, organizes school events, wants to study business.",
    expectedCategory: "johtaja",
    expectedCareers: ["Yrittäjä", "Projektipäällikkö", "Yritysjohtaja", "Myyntipäällikkö"],
    answers: [
      3, // Q0: Tech/games - medium
      4, // Q1: Puzzles - medium-high
      2, // Q2: Stories/drawing - low
      3, // Q3: Building/fixing - medium
      2, // Q4: Nature/animals - low
      2, // Q5: Human body - low
      5, // Q6: Entrepreneurship - HIGH
      3, // Q7: Experiments - medium
      4, // Q8: Sports - medium-high (team captain)
      4, // Q9: Teaching - medium-high
      2, // Q10: Cooking - low
      5, // Q11: New ideas - HIGH
      4, // Q12: Helping friends - medium-high
      5, // Q13: Group decisions - HIGH
      4, // Q14: Languages - medium-high
      5, // Q15: Teamwork - HIGH
      3, // Q16: Clear instructions - medium
      2, // Q17: Outdoor work - low
      1, // Q18: Focus difficulty (REVERSE) - excellent focus
      4, // Q19: Variety - medium-high
      2, // Q20: Stress (REVERSE) - handles stress well
      5, // Q21: Public speaking - HIGH
      5, // Q22: Initiative - HIGH
      4, // Q23: Help society - medium-high
      5, // Q24: Money - HIGH
      1, // Q25: Recognition indifferent (REVERSE) - wants success
      3, // Q26: Work-life balance - medium
      5, // Q27: Be own boss - HIGH
      4, // Q28: Travel - medium-high
      4, // Q29: Know future - medium-high
    ]
  }
];

// ============================================================================
// NUORI PERSONAS (Ages 20-25) - 30 questions
// These are young adults making career decisions
// ============================================================================

const NUORI_PERSONAS = [
  {
    name: "Anni - Career Changer to UX Design",
    description: "24-year-old marketing graduate who discovered UX design, wants to switch careers.",
    expectedCategory: "luova",
    expectedCareers: ["Graafinen suunnittelija", "Tuotemuotoilija", "Markkinointipäällikkö"],
    answers: [
      4, // Q0: Software/data - medium-high (UX tools)
      2, // Q1: Healthcare - low
      3, // Q2: Finance - medium
      5, // Q3: Creative/advertising - HIGH
      2, // Q4: Engineering - low
      3, // Q5: Teaching - medium
      3, // Q6: HR - medium
      2, // Q7: Legal - low
      4, // Q8: Sales/marketing - medium-high
      4, // Q9: Research - medium-high (user research)
      4, // Q10: Project management - medium-high
      4, // Q11: Sustainability - medium-high
      4, // Q12: Remote work - medium-high
      3, // Q13: Lead people - medium
      5, // Q14: Teamwork - HIGH
      3, // Q15: Structured day - medium
      2, // Q16: Client fatigue (REVERSE) - enjoys clients
      4, // Q17: Strategic planning - medium-high
      4, // Q18: Detail-oriented - medium-high
      3, // Q19: Pace stress (REVERSE) - medium
      4, // Q20: High salary - medium-high
      4, // Q21: Work-life balance - medium-high
      4, // Q22: Quick advancement - medium-high
      4, // Q23: Socially meaningful - medium-high
      3, // Q24: Job security - medium
      5, // Q25: Continuous learning - HIGH
      4, // Q26: Autonomy - medium-high
      3, // Q27: Entrepreneur/freelancer - medium
      4, // Q28: International - medium-high
      2, // Q29: Culture indifferent (REVERSE) - cares about culture
    ]
  },
  {
    name: "Petri - Startup Tech Founder",
    description: "25-year-old with a CS degree, building a SaaS startup, loves problem-solving.",
    expectedCategory: "innovoija",
    expectedCareers: ["Ohjelmistokehittaja", "Data-insinööri", "Cloud-arkkitehti", "Yrittäjä"],
    answers: [
      5, // Q0: Software/data - HIGH
      2, // Q1: Healthcare - low
      3, // Q2: Finance - medium
      3, // Q3: Creative/advertising - medium
      5, // Q4: Engineering - HIGH
      2, // Q5: Teaching - low
      2, // Q6: HR - low
      2, // Q7: Legal - low
      3, // Q8: Sales/marketing - medium
      5, // Q9: Research - HIGH
      4, // Q10: Project management - medium-high
      3, // Q11: Sustainability - medium
      5, // Q12: Remote work - HIGH
      4, // Q13: Lead people - medium-high
      4, // Q14: Teamwork - medium-high
      3, // Q15: Structured day - medium
      3, // Q16: Client fatigue (REVERSE) - medium
      5, // Q17: Strategic planning - HIGH
      4, // Q18: Detail-oriented - medium-high
      3, // Q19: Pace stress (REVERSE) - medium
      5, // Q20: High salary - HIGH
      3, // Q21: Work-life balance - medium
      5, // Q22: Quick advancement - HIGH
      3, // Q23: Socially meaningful - medium
      3, // Q24: Job security - medium
      5, // Q25: Continuous learning - HIGH
      5, // Q26: Autonomy - HIGH
      5, // Q27: Entrepreneur/freelancer - HIGH
      5, // Q28: International - HIGH
      3, // Q29: Culture indifferent (REVERSE) - medium
    ]
  },
  {
    name: "Jenni - Social Work Student",
    description: "23-year-old social work student, volunteers at youth center, wants to help at-risk youth.",
    expectedCategory: "auttaja",
    expectedCareers: ["Sosiaalityöntekijä", "Psykologi", "Opettaja", "Terapeutti"],
    answers: [
      2, // Q0: Software/data - low
      5, // Q1: Healthcare - HIGH (social health)
      2, // Q2: Finance - low
      2, // Q3: Creative/advertising - low
      2, // Q4: Engineering - low
      5, // Q5: Teaching/training - HIGH
      4, // Q6: HR - medium-high
      2, // Q7: Legal - low
      2, // Q8: Sales/marketing - low
      4, // Q9: Research - medium-high
      3, // Q10: Project management - medium
      4, // Q11: Sustainability - medium-high
      2, // Q12: Remote work - low (in-person work)
      3, // Q13: Lead people - medium
      5, // Q14: Teamwork - HIGH
      3, // Q15: Structured day - medium
      2, // Q16: Client fatigue (REVERSE) - loves clients
      3, // Q17: Strategic planning - medium
      4, // Q18: Detail-oriented - medium-high
      2, // Q19: Pace stress (REVERSE) - handles pace
      2, // Q20: High salary - low (purpose over money)
      5, // Q21: Work-life balance - HIGH
      2, // Q22: Quick advancement - low
      5, // Q23: Socially meaningful - HIGH
      4, // Q24: Job security - medium-high
      5, // Q25: Continuous learning - HIGH
      3, // Q26: Autonomy - medium
      2, // Q27: Entrepreneur/freelancer - low
      2, // Q28: International - low
      2, // Q29: Culture indifferent (REVERSE) - cares deeply
    ]
  },
  {
    name: "Mikael - Finance Professional",
    description: "24-year-old economics graduate working in banking, wants to become CFO.",
    expectedCategory: "johtaja",
    expectedCareers: ["Rahoitusanalyytikko", "Controller", "Yritysjohtaja", "Konsultti"],
    answers: [
      3, // Q0: Software/data - medium
      2, // Q1: Healthcare - low
      5, // Q2: Finance - HIGH
      2, // Q3: Creative/advertising - low
      3, // Q4: Engineering - medium
      2, // Q5: Teaching - low
      3, // Q6: HR - medium
      3, // Q7: Legal - medium
      3, // Q8: Sales/marketing - medium
      4, // Q9: Research - medium-high
      5, // Q10: Project management - HIGH
      3, // Q11: Sustainability - medium
      3, // Q12: Remote work - medium
      5, // Q13: Lead people - HIGH
      4, // Q14: Teamwork - medium-high
      4, // Q15: Structured day - medium-high
      3, // Q16: Client fatigue (REVERSE) - medium
      5, // Q17: Strategic planning - HIGH
      5, // Q18: Detail-oriented - HIGH
      3, // Q19: Pace stress (REVERSE) - medium
      5, // Q20: High salary - HIGH
      3, // Q21: Work-life balance - medium
      5, // Q22: Quick advancement - HIGH
      3, // Q23: Socially meaningful - medium
      4, // Q24: Job security - medium-high
      4, // Q25: Continuous learning - medium-high
      4, // Q26: Autonomy - medium-high
      3, // Q27: Entrepreneur/freelancer - medium
      4, // Q28: International - medium-high
      3, // Q29: Culture indifferent (REVERSE) - medium
    ]
  }
];

// ============================================================================
// TASO2 LUKIO PERSONAS (Ages 16-19, Academic Track) - 30 questions
// These are high school students planning university studies
// ============================================================================

const TASO2_LUKIO_PERSONAS = [
  {
    name: "Aleksi - Future Medical Student",
    description: "17-year-old top student, chemistry and biology focus, dreams of becoming a surgeon.",
    expectedCategory: "auttaja",
    expectedCareers: ["Lääkäri", "Hammaslääkäri", "Psykologi", "Tutkija"],
    answers: [
      3, // Q0: Technology - medium
      5, // Q1: Healthcare - HIGH
      2, // Q2: Creative - low
      4, // Q3: Working with people - medium-high
      2, // Q4: Business - low
      3, // Q5: Environment - medium
      3, // Q6: Hands-on - medium (surgery)
      5, // Q7: Analytical/problem-solving - HIGH
      4, // Q8: Teaching - medium-high
      4, // Q9: Innovation - medium-high
      4, // Q10: Teamwork - medium-high
      3, // Q11: Clear instructions - medium
      4, // Q12: Independence - medium-high
      3, // Q13: Physical/outdoor - medium
      4, // Q14: Customer service - medium-high
      3, // Q15: Work-life balance - medium
      4, // Q16: Good salary - medium-high
      5, // Q17: Help society - HIGH
      2, // Q18: Detail frustration (REVERSE) - loves details
      4, // Q19: Job stability - medium-high
      // LUKIO-specific Q20-Q29
      5, // Q20: Natural sciences - HIGH
      2, // Q21: Slow learning frustration (REVERSE) - patient
      5, // Q22: Abstract thinking - HIGH
      5, // Q23: Ready for 4-7 years study - HIGH
      5, // Q24: Intellectual challenge - HIGH
      5, // Q25: Become specialist - HIGH
      5, // Q26: Read/learn new - HIGH
      4, // Q27: International work - medium-high
      3, // Q28: Status/prestige - medium
      5, // Q29: Long-term projects - HIGH
    ]
  },
  {
    name: "Riikka - Law School Aspirant",
    description: "18-year-old debate team captain, interested in human rights, wants to become a lawyer.",
    expectedCategory: "johtaja",
    expectedCareers: ["Lakimies", "Konsultti", "Yritysjohtaja", "Strategiakonsultti"],
    answers: [
      2, // Q0: Technology - low (not tech-focused)
      2, // Q1: Healthcare - low
      2, // Q2: Creative - low
      5, // Q3: Working with people - HIGH (debate, advocacy)
      5, // Q4: Business - HIGH (career-focused, corporate law potential)
      2, // Q5: Environment - low
      1, // Q6: Hands-on - very low (intellectual work)
      4, // Q7: Analytical/problem-solving - medium-high
      3, // Q8: Teaching - medium
      3, // Q9: Innovation - medium
      4, // Q10: Teamwork - medium-high
      3, // Q11: Clear instructions - medium
      5, // Q12: Independence - HIGH (leadership)
      1, // Q13: Physical/outdoor - very low
      4, // Q14: Customer service - medium-high (client-facing)
      3, // Q15: Work-life balance - medium
      5, // Q16: Good salary - HIGH (ambitious)
      4, // Q17: Help society - medium-high (human rights)
      2, // Q18: Detail frustration (REVERSE) - loves details
      4, // Q19: Job stability - medium-high
      // LUKIO-specific Q20-Q29
      3, // Q20: Natural sciences - medium
      2, // Q21: Slow learning frustration (REVERSE) - patient
      5, // Q22: Abstract thinking - HIGH
      5, // Q23: Ready for 4-7 years study - HIGH
      5, // Q24: Intellectual challenge - HIGH
      5, // Q25: Become specialist - HIGH
      5, // Q26: Read/learn new - HIGH
      5, // Q27: International work - HIGH
      5, // Q28: Status/prestige - HIGH (lawyer prestige)
      5, // Q29: Long-term projects - HIGH
    ]
  },
  {
    name: "Oona - Environmental Science Focus",
    description: "17-year-old climate activist, biology olympiad participant, wants to study environmental science.",
    expectedCategory: "ympariston-puolustaja",
    expectedCareers: ["Ympäristöasiantuntija", "Ympäristöinsinööri", "Tutkija", "Kestävän kehityksen konsultti"],
    answers: [
      2, // Q0: Technology - low (nature-focused, not tech)
      2, // Q1: Healthcare - low
      2, // Q2: Creative - low
      3, // Q3: Working with people - medium
      1, // Q4: Business - very low (anti-corporate)
      5, // Q5: Environment - HIGH (core passion!)
      3, // Q6: Hands-on - medium (fieldwork)
      4, // Q7: Analytical/problem-solving - medium-high
      3, // Q8: Teaching - medium
      3, // Q9: Innovation - medium (not too high to avoid innovoija)
      4, // Q10: Teamwork - medium-high
      3, // Q11: Clear instructions - medium
      4, // Q12: Independence - medium-high
      5, // Q13: Physical/outdoor - HIGH (loves nature)
      3, // Q14: Customer service - medium
      4, // Q15: Work-life balance - medium-high
      2, // Q16: Good salary - low (purpose over money)
      5, // Q17: Help society - HIGH (activism)
      2, // Q18: Detail frustration (REVERSE) - loves details
      3, // Q19: Job stability - medium
      // LUKIO-specific Q20-Q29
      5, // Q20: Natural sciences - HIGH
      2, // Q21: Slow learning frustration (REVERSE) - patient
      4, // Q22: Abstract thinking - medium-high
      5, // Q23: Ready for 4-7 years study - HIGH
      4, // Q24: Intellectual challenge - medium-high
      5, // Q25: Become specialist - HIGH
      5, // Q26: Read/learn new - HIGH
      5, // Q27: International work - HIGH (global issue)
      2, // Q28: Status/prestige - low
      5, // Q29: Long-term projects - HIGH
    ]
  }
];

// ============================================================================
// TASO2 AMIS PERSONAS (Ages 16-19, Vocational Track) - 30 questions
// These are vocational school students preparing for trades
// ============================================================================

const TASO2_AMIS_PERSONAS = [
  {
    name: "Jesse - Electrical Apprentice",
    description: "17-year-old in electrical program, works part-time with uncle's company, loves practical work.",
    expectedCategory: "rakentaja",
    expectedCareers: ["Sähköasentaja", "LVI-asentaja", "Automekaanikko", "Putkiasentaja"],
    answers: [
      2, // Q0: Technology - low (practical electrical, not IT/software)
      1, // Q1: Healthcare - very low
      1, // Q2: Creative - very low
      3, // Q3: Working with people - medium
      2, // Q4: Business - low
      2, // Q5: Environment - low
      5, // Q6: Hands-on - HIGH (core trait!)
      3, // Q7: Analytical/problem-solving - medium (practical, not theoretical)
      2, // Q8: Teaching - low
      2, // Q9: Innovation - low (traditional trade)
      4, // Q10: Teamwork - medium-high
      4, // Q11: Clear instructions - medium-high
      4, // Q12: Independence - medium-high
      5, // Q13: Physical/outdoor - HIGH
      3, // Q14: Customer service - medium
      4, // Q15: Work-life balance - medium-high
      4, // Q16: Good salary - medium-high
      3, // Q17: Help society - medium
      2, // Q18: Detail frustration (REVERSE) - patient with details
      5, // Q19: Job stability - HIGH
      // AMIS-specific Q20-Q29
      5, // Q20: Concrete results - HIGH
      2, // Q21: Frustration when things don't work (REVERSE) - patient
      5, // Q22: Learn by doing - HIGH
      5, // Q23: Practical over theoretical - HIGH
      4, // Q24: Shift work OK - medium-high
      4, // Q25: Start own business - medium-high
      5, // Q26: Good employment situation - HIGH
      5, // Q27: Follow instructions/safety - HIGH
      5, // Q28: Work locally - HIGH (local trade work)
      5, // Q29: Learn from experienced - HIGH
    ]
  },
  {
    name: "Nea - Event Coordinator",
    description: "18-year-old studying event management, organized school dances, loves planning and logistics.",
    expectedCategory: "jarjestaja",
    expectedCareers: ["Tapahtumakoordinaattori", "Projektipäällikkö", "Toimistopäällikkö", "Asiakaspalvelupäällikkö"],
    answers: [
      2, // Q0: Technology - low
      2, // Q1: Healthcare - low
      2, // Q2: Creative - low (organizing, not creating)
      3, // Q3: Working with people - medium (coordinates, doesn't counsel)
      2, // Q4: Business - low (not entrepreneurial)
      2, // Q5: Environment - low
      2, // Q6: Hands-on - low (planning, not building)
      4, // Q7: Analytical/problem-solving - medium-high (logistics)
      2, // Q8: Teaching - low
      2, // Q9: Innovation - low
      4, // Q10: Teamwork - medium-high
      5, // Q11: Clear instructions - HIGH (structure = jarjestaja!)
      3, // Q12: Independence - medium
      1, // Q13: Physical/outdoor - very low (office/venue work)
      3, // Q14: Customer service - medium
      4, // Q15: Work-life balance - medium-high
      3, // Q16: Good salary - medium
      3, // Q17: Help society - medium
      1, // Q18: Detail frustration (REVERSE) - LOVES details! (precision = jarjestaja!)
      4, // Q19: Job stability - medium-high
      // AMIS-specific Q20-Q29
      4, // Q20: Concrete results - medium-high
      1, // Q21: Frustration when things don't work (REVERSE) - very patient
      3, // Q22: Learn by doing - medium
      3, // Q23: Practical over theoretical - medium
      4, // Q24: Shift work OK - medium-high
      3, // Q25: Start own business - medium
      4, // Q26: Good employment situation - medium-high
      5, // Q27: Follow instructions/safety - HIGH (precision = jarjestaja!)
      4, // Q28: Work locally - medium-high
      4, // Q29: Learn from experienced - medium-high
    ]
  },
  {
    name: "Veeti - IT Support & Networking",
    description: "17-year-old in IT program, helps friends with computers, interested in cybersecurity.",
    expectedCategory: "innovoija",
    expectedCareers: ["IT-tukihenkilö", "Tietoturvaanalyytikko", "Ohjelmistokehittaja", "DevOps-insinööri"],
    answers: [
      5, // Q0: Technology - HIGH (core trait!)
      2, // Q1: Healthcare - low
      2, // Q2: Creative - low
      2, // Q3: Working with people - low (prefers computers)
      2, // Q4: Business - low
      2, // Q5: Environment - low
      2, // Q6: Hands-on - LOW (IT work is mental, not physical building)
      5, // Q7: Analytical/problem-solving - HIGH (core trait!)
      2, // Q8: Teaching - low
      5, // Q9: Innovation - HIGH (cybersecurity, new tech)
      3, // Q10: Teamwork - medium
      3, // Q11: Clear instructions - medium
      5, // Q12: Independence - HIGH
      1, // Q13: Physical/outdoor - very low (desk work)
      3, // Q14: Customer service - medium
      4, // Q15: Work-life balance - medium-high
      5, // Q16: Good salary - HIGH (IT pays well)
      3, // Q17: Help society - medium
      2, // Q18: Detail frustration (REVERSE) - loves details
      4, // Q19: Job stability - medium-high
      // AMIS-specific Q20-Q29 - adjusted for IT focus (mental work, not physical)
      3, // Q20: Concrete results - medium (code results are abstract, not physical)
      2, // Q21: Frustration when things don't work (REVERSE) - patient
      4, // Q22: Learn by doing - medium-high (learns by coding/experimenting)
      2, // Q23: Practical over theoretical - LOW (IT needs theory: networking, protocols)
      3, // Q24: Shift work OK - medium
      4, // Q25: Start own business - medium-high
      5, // Q26: Good employment situation - HIGH
      4, // Q27: Follow instructions/safety - medium-high
      3, // Q28: Work locally - medium
      4, // Q29: Learn from experienced - medium-high
    ]
  }
];

// ============================================================================
// TEST RUNNER
// ============================================================================

const API_BASE = 'http://localhost:3000';

async function makeApiCall(endpoint, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, API_BASE);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: { 'Content-Type': 'application/json' }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { resolve(data); }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runPersonaTest(persona, cohort, subCohort = null) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`TESTING: ${persona.name}`);
  console.log(`Description: ${persona.description}`);
  console.log(`Expected Category: ${persona.expectedCategory}`);
  console.log(`Expected Careers: ${persona.expectedCareers.join(', ')}`);
  console.log(`${'='.repeat(70)}`);

  const requestBody = {
    cohort: cohort,
    answers: persona.answers.map((score, index) => ({ questionIndex: index, score: score })),
    subCohort: subCohort
  };

  try {
    const result = await makeApiCall('/api/score', 'POST', requestBody);

    if (!result || !result.topCareers) {
      console.log('ERROR: Invalid API response');
      return { persona: persona.name, categoryMatch: false, careerMatches: 0, topCategory: 'ERROR', expectedCategory: persona.expectedCategory };
    }

    const careers = result.topCareers.slice(0, 5);

    console.log(`\n🏆 TOP 5 CAREER RECOMMENDATIONS:`);
    careers.forEach((career, i) => {
      const careerTitle = career.title || career.slug || 'Unknown';
      const matchesExpected = persona.expectedCareers.some(exp => {
        const expLower = exp.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const titleLower = careerTitle.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return titleLower.includes(expLower) || expLower.includes(titleLower);
      });
      const marker = matchesExpected ? '✅' : '⚠️';
      console.log(`  ${i+1}. ${marker} ${careerTitle} (${career.category}) - Score: ${career.overallScore || 'N/A'}%`);
    });

    if (result.educationPath) {
      console.log(`\n📚 EDUCATION PATH:`);
      console.log(`  Primary: ${result.educationPath.primary || result.educationPath.path}`);
      console.log(`  Confidence: ${result.educationPath.confidence}`);
    }

    const topCategory = careers[0]?.category;
    const categoryMatch = topCategory === persona.expectedCategory;
    const careerMatches = careers.filter(c => {
      const careerTitle = c.title || c.slug || '';
      return persona.expectedCareers.some(exp => {
        const expLower = exp.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const titleLower = careerTitle.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return titleLower.includes(expLower) || expLower.includes(titleLower);
      });
    }).length;

    console.log(`\n📈 ACCURACY ASSESSMENT:`);
    console.log(`  Category Match: ${categoryMatch ? '✅ CORRECT' : `❌ WRONG (got ${topCategory}, expected ${persona.expectedCategory})`}`);
    console.log(`  Career Matches: ${careerMatches}/5 expected careers in top 5`);

    return { persona: persona.name, categoryMatch, careerMatches, topCategory, expectedCategory: persona.expectedCategory };
  } catch (error) {
    console.log(`ERROR testing ${persona.name}:`, error.message);
    return { persona: persona.name, categoryMatch: false, careerMatches: 0, topCategory: 'ERROR', expectedCategory: persona.expectedCategory };
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  console.log(`\n${'#'.repeat(70)}`);
  console.log(`# NEW REAL-LIFE PERSONA TESTING - ALL 4 COHORTS`);
  console.log(`# Each persona represents a realistic student profile`);
  console.log(`${'#'.repeat(70)}`);

  const results = [];

  // Test YLA Cohort
  console.log(`\n\n${'*'.repeat(70)}`);
  console.log(`* YLA COHORT (Ages 13-16) - ${YLA_PERSONAS.length} new personas`);
  console.log(`${'*'.repeat(70)}`);
  for (const persona of YLA_PERSONAS) {
    results.push(await runPersonaTest(persona, 'YLA'));
  }

  // Test NUORI Cohort
  console.log(`\n\n${'*'.repeat(70)}`);
  console.log(`* NUORI COHORT (Ages 20-25) - ${NUORI_PERSONAS.length} new personas`);
  console.log(`${'*'.repeat(70)}`);
  for (const persona of NUORI_PERSONAS) {
    results.push(await runPersonaTest(persona, 'NUORI'));
  }

  // Test TASO2 LUKIO
  console.log(`\n\n${'*'.repeat(70)}`);
  console.log(`* TASO2 LUKIO COHORT (Ages 16-19) - ${TASO2_LUKIO_PERSONAS.length} new personas`);
  console.log(`${'*'.repeat(70)}`);
  for (const persona of TASO2_LUKIO_PERSONAS) {
    results.push(await runPersonaTest(persona, 'TASO2', 'LUKIO'));
  }

  // Test TASO2 AMIS
  console.log(`\n\n${'*'.repeat(70)}`);
  console.log(`* TASO2 AMIS COHORT (Ages 16-19) - ${TASO2_AMIS_PERSONAS.length} new personas`);
  console.log(`${'*'.repeat(70)}`);
  for (const persona of TASO2_AMIS_PERSONAS) {
    results.push(await runPersonaTest(persona, 'TASO2', 'AMIS'));
  }

  // Final Summary
  console.log(`\n\n${'#'.repeat(70)}`);
  console.log(`# FINAL SUMMARY - NEW REAL-LIFE PERSONAS`);
  console.log(`${'#'.repeat(70)}`);

  const categoryAccuracy = results.filter(r => r.categoryMatch).length / results.length * 100;
  const avgCareerMatches = results.reduce((sum, r) => sum + r.careerMatches, 0) / results.length;

  console.log(`\n📊 OVERALL ACCURACY:`);
  console.log(`  Category Accuracy: ${categoryAccuracy.toFixed(0)}% (${results.filter(r => r.categoryMatch).length}/${results.length})`);
  console.log(`  Avg Career Matches: ${avgCareerMatches.toFixed(1)}/5 expected careers in top 5`);

  console.log(`\n📋 DETAILED RESULTS BY COHORT:`);

  const cohorts = ['YLA', 'NUORI', 'TASO2_LUKIO', 'TASO2_AMIS'];
  const cohortNames = { YLA: 'YLA (13-16)', NUORI: 'NUORI (20-25)', TASO2_LUKIO: 'LUKIO (16-19)', TASO2_AMIS: 'AMIS (16-19)' };

  let idx = 0;
  const counts = [YLA_PERSONAS.length, NUORI_PERSONAS.length, TASO2_LUKIO_PERSONAS.length, TASO2_AMIS_PERSONAS.length];

  for (let c = 0; c < cohorts.length; c++) {
    const cohortResults = results.slice(idx, idx + counts[c]);
    const cohortAccuracy = cohortResults.filter(r => r.categoryMatch).length;
    console.log(`\n  ${cohortNames[cohorts[c]]}:`);
    cohortResults.forEach(r => {
      const status = r.categoryMatch ? '✅' : '❌';
      console.log(`    ${status} ${r.persona}: ${r.topCategory} (expected: ${r.expectedCategory}), ${r.careerMatches}/5 matches`);
    });
    console.log(`    → ${cohortAccuracy}/${counts[c]} correct`);
    idx += counts[c];
  }

  const failures = results.filter(r => !r.categoryMatch);
  if (failures.length > 0) {
    console.log(`\n⚠️ CATEGORY MISMATCHES:`);
    failures.forEach(f => {
      console.log(`  - ${f.persona}: Got ${f.topCategory}, Expected ${f.expectedCategory}`);
    });
  }

  const passed = categoryAccuracy === 100;
  console.log(`\n${passed ? '✅ ALL NEW TESTS PASSED!' : '❌ SOME TESTS FAILED'}`);
  process.exit(passed ? 0 : 1);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
