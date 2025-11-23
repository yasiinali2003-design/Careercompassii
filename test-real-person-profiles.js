/**
 * REAL PERSON TEST PROFILES
 * Comprehensive testing with realistic personality profiles across all cohorts
 *
 * Test Coverage:
 * - YLA (15-16 years): 8 profiles covering all 8 categories
 * - TASO2 (17-19 years): 8 profiles covering all 8 categories
 * - NUORI (20-25 years): 8 profiles covering all 8 categories
 *
 * Total: 24 realistic personality profiles
 */

const API_BASE = 'http://localhost:3000';

// ============================================================================
// YLA COHORT (15-16 YEARS) - 8 PROFILES
// ============================================================================

const ylaProfiles = [
  {
    name: "Emma - Tech Enthusiast",
    category: "innovoija",
    cohort: "YLA",
    description: "Loves coding, robotics club, builds apps for fun",
    answers: [
      3, // Q1: Leadership - moderate
      5, // Q2: Technology - VERY HIGH
      4, // Q3: Problem solving - high
      2, // Q4: Arts - low
      3, // Q5: Writing - moderate
      5, // Q6: Math - VERY HIGH
      2, // Q7: Languages - low
      4, // Q8: Science - high
      3, // Q9: Sports - moderate
      5, // Q10: Gaming/tech hobbies - VERY HIGH
      2, // Q11: Music - low
      5, // Q12: Building/tinkering - VERY HIGH
      4, // Q13: Analytical thinking - high
      3, // Q14: Working with people - moderate
      2, // Q15: Nature - low
      2, // Q16: Health/care - low
      3, // Q17: Design - moderate
      2, // Q18: Photography - low
      3, // Q19: Entrepreneurship - moderate
      2, // Q20: Sales - low
      3, // Q21: Education - moderate
      5, // Q22: Innovation - VERY HIGH
      3, // Q23: Teamwork - moderate
      4, // Q24: Independent work - high
      5, // Q25: Learning new tech - VERY HIGH
      2, // Q26: Routine work - low
      4, // Q27: Creative problem solving - high
      5, // Q28: Making things - VERY HIGH
      3, // Q29: Helping others - moderate
      4  // Q30: Research - high
    ]
  },

  {
    name: "Aino - Future Nurse",
    category: "auttaja",
    cohort: "YLA",
    description: "Caring, volunteers at elderly home, wants to help people",
    answers: [
      3, // Q1: Leadership - moderate
      2, // Q2: Technology - low
      3, // Q3: Problem solving - moderate
      3, // Q4: Arts - moderate
      4, // Q5: Writing - high
      2, // Q6: Math - low
      4, // Q7: Languages - high
      4, // Q8: Science - high (biology)
      3, // Q9: Sports - moderate
      2, // Q10: Gaming - low
      3, // Q11: Music - moderate
      3, // Q12: Building - moderate
      3, // Q13: Analytical - moderate
      5, // Q14: Working with people - VERY HIGH
      3, // Q15: Nature - moderate
      5, // Q16: Health/care - VERY HIGH
      3, // Q17: Design - moderate
      2, // Q18: Photography - low
      2, // Q19: Entrepreneurship - low
      2, // Q20: Sales - low
      4, // Q21: Education - high
      3, // Q22: Innovation - moderate
      5, // Q23: Teamwork - VERY HIGH
      2, // Q24: Independent - low
      3, // Q25: Learning tech - moderate
      3, // Q26: Routine - moderate
      3, // Q27: Creative problem solving - moderate
      5, // Q28: Helping/caring - VERY HIGH
      5, // Q29: Social impact - VERY HIGH
      3  // Q30: Research - moderate
    ]
  },

  {
    name: "Ville - Young Artist",
    category: "luova",
    cohort: "YLA",
    description: "Draws constantly, wants to study game design or animation",
    answers: [
      2, // Q1: Leadership - low
      4, // Q2: Technology - high (digital art)
      3, // Q3: Problem solving - moderate
      5, // Q4: Arts - VERY HIGH
      3, // Q5: Writing - moderate
      2, // Q6: Math - low
      2, // Q7: Languages - low
      3, // Q8: Science - moderate
      2, // Q9: Sports - low
      4, // Q10: Gaming - high
      4, // Q11: Music - high
      3, // Q12: Building - moderate
      3, // Q13: Analytical - moderate
      3, // Q14: People - moderate
      3, // Q15: Nature - moderate
      2, // Q16: Health - low
      5, // Q17: Design - VERY HIGH
      5, // Q18: Photography/visual - VERY HIGH
      3, // Q19: Entrepreneurship - moderate
      2, // Q20: Sales - low
      2, // Q21: Education - low
      5, // Q22: Innovation - VERY HIGH
      3, // Q23: Teamwork - moderate
      4, // Q24: Independent - high
      4, // Q25: Learning - high
      2, // Q26: Routine - low
      5, // Q27: Creative thinking - VERY HIGH
      5, // Q28: Making things - VERY HIGH
      3, // Q29: Helping - moderate
      3  // Q30: Research - moderate
    ]
  },

  {
    name: "Mikko - Hands-On Builder",
    category: "rakentaja",
    cohort: "YLA",
    description: "Loves workshop class, fixes things, practical and concrete",
    answers: [
      3, // Q1: Leadership - moderate
      3, // Q2: Technology - moderate
      4, // Q3: Problem solving - high (practical)
      2, // Q4: Arts - low
      2, // Q5: Writing - low
      3, // Q6: Math - moderate
      2, // Q7: Languages - low
      3, // Q8: Science - moderate (physics)
      4, // Q9: Sports - high
      3, // Q10: Gaming - moderate
      2, // Q11: Music - low
      5, // Q12: Building/tinkering - VERY HIGH
      3, // Q13: Analytical - moderate
      3, // Q14: People - moderate
      3, // Q15: Nature - moderate
      2, // Q16: Health - low
      3, // Q17: Design - moderate
      2, // Q18: Photography - low
      2, // Q19: Entrepreneurship - low
      2, // Q20: Sales - low
      2, // Q21: Education - low
      3, // Q22: Innovation - moderate
      4, // Q23: Teamwork - high
      4, // Q24: Independent - high
      3, // Q25: Learning - moderate
      4, // Q26: Routine - high (likes structure)
      4, // Q27: Practical problem solving - high
      5, // Q28: Making/building - VERY HIGH
      3, // Q29: Helping - moderate
      2  // Q30: Research - low
    ]
  },

  {
    name: "Sofia - Student Leader",
    category: "johtaja",
    cohort: "YLA",
    description: "Class president, organizes events, natural leader",
    answers: [
      5, // Q1: Leadership - VERY HIGH
      3, // Q2: Technology - moderate
      4, // Q3: Problem solving - high
      3, // Q4: Arts - moderate
      4, // Q5: Writing/communication - high
      3, // Q6: Math - moderate
      3, // Q7: Languages - moderate
      3, // Q8: Science - moderate
      3, // Q9: Sports - moderate
      3, // Q10: Gaming - moderate
      3, // Q11: Music - moderate
      3, // Q12: Building - moderate
      4, // Q13: Analytical - high
      5, // Q14: Working with people - VERY HIGH
      2, // Q15: Nature - low
      2, // Q16: Health - low
      3, // Q17: Design - moderate
      3, // Q18: Photography - moderate
      5, // Q19: Entrepreneurship - VERY HIGH
      4, // Q20: Sales/persuasion - high
      4, // Q21: Education - high
      4, // Q22: Innovation - high
      5, // Q23: Teamwork - VERY HIGH
      3, // Q24: Independent - moderate
      4, // Q25: Learning - high
      3, // Q26: Routine - moderate
      4, // Q27: Strategic thinking - high
      3, // Q28: Making - moderate
      4, // Q29: Helping/leading - high
      3  // Q30: Research - moderate
    ]
  },

  {
    name: "Lauri - Young Strategist",
    category: "visionaari",
    cohort: "YLA",
    description: "Chess club, debate team, thinks big picture",
    answers: [
      4, // Q1: Leadership - high
      4, // Q2: Technology - high
      5, // Q3: Problem solving - VERY HIGH
      2, // Q4: Arts - low
      4, // Q5: Writing - high
      4, // Q6: Math - high
      2, // Q7: Languages - low
      4, // Q8: Science - high
      2, // Q9: Sports - low
      3, // Q10: Gaming - moderate (strategy games)
      2, // Q11: Music - low
      3, // Q12: Building - moderate
      5, // Q13: Analytical thinking - VERY HIGH
      3, // Q14: People - moderate
      2, // Q15: Nature - low
      2, // Q16: Health - low
      3, // Q17: Design - moderate
      2, // Q18: Photography - low
      4, // Q19: Entrepreneurship - high
      3, // Q20: Sales - moderate
      3, // Q21: Education - moderate
      5, // Q22: Innovation - VERY HIGH
      3, // Q23: Teamwork - moderate
      4, // Q24: Independent - high
      5, // Q25: Learning - VERY HIGH
      2, // Q26: Routine - low
      5, // Q27: Strategic thinking - VERY HIGH
      3, // Q28: Making - moderate
      3, // Q29: Helping - moderate
      5  // Q30: Research - VERY HIGH
    ]
  },

  {
    name: "Ida - Event Organizer",
    category: "jarjestaja",
    cohort: "YLA",
    description: "Plans school events, keeps everyone on schedule, detail-oriented",
    answers: [
      4, // Q1: Leadership - high
      3, // Q2: Technology - moderate
      3, // Q3: Problem solving - moderate
      3, // Q4: Arts - moderate
      4, // Q5: Writing - high
      3, // Q6: Math - moderate
      3, // Q7: Languages - moderate
      2, // Q8: Science - low
      3, // Q9: Sports - moderate
      2, // Q10: Gaming - low
      3, // Q11: Music - moderate
      2, // Q12: Building - low
      3, // Q13: Analytical - moderate
      5, // Q14: Working with people - VERY HIGH
      2, // Q15: Nature - low
      3, // Q16: Health - moderate
      3, // Q17: Design - moderate
      3, // Q18: Photography - moderate
      3, // Q19: Entrepreneurship - moderate
      3, // Q20: Sales - moderate
      3, // Q21: Education - moderate
      3, // Q22: Innovation - moderate
      5, // Q23: Teamwork - VERY HIGH
      2, // Q24: Independent - low
      3, // Q25: Learning - moderate
      5, // Q26: Routine/organization - VERY HIGH
      3, // Q27: Problem solving - moderate
      4, // Q28: Making/planning - high
      4, // Q29: Helping - high
      3  // Q30: Research - moderate
    ]
  },

  {
    name: "Elias - Eco Warrior",
    category: "ympariston-puolustaja",
    cohort: "YLA",
    description: "Climate activist, volunteers for environmental causes, vegan",
    answers: [
      3, // Q1: Leadership - moderate
      3, // Q2: Technology - moderate
      3, // Q3: Problem solving - moderate
      2, // Q4: Arts - low
      4, // Q5: Writing - high (activism)
      2, // Q6: Math - low
      3, // Q7: Languages - moderate
      5, // Q8: Science - VERY HIGH (biology/ecology)
      3, // Q9: Sports - moderate (outdoor)
      2, // Q10: Gaming - low
      3, // Q11: Music - moderate
      3, // Q12: Building - moderate
      4, // Q13: Analytical - high
      4, // Q14: People - high
      5, // Q15: Nature - VERY HIGH
      3, // Q16: Health - moderate
      3, // Q17: Design - moderate
      4, // Q18: Photography - high (nature)
      3, // Q19: Entrepreneurship - moderate
      2, // Q20: Sales - low
      4, // Q21: Education - high
      4, // Q22: Innovation - high
      4, // Q23: Teamwork - high
      3, // Q24: Independent - moderate
      4, // Q25: Learning - high
      3, // Q26: Routine - moderate
      4, // Q27: Problem solving - high
      5, // Q28: Environmental impact - VERY HIGH
      5, // Q29: Social/environmental cause - VERY HIGH
      4  // Q30: Research - high
    ]
  }
];

// ============================================================================
// TASO2 COHORT (17-19 YEARS) - 8 PROFILES
// ============================================================================

const taso2Profiles = [
  {
    name: "Matias - App Developer",
    category: "innovoija",
    cohort: "TASO2",
    description: "Already published apps, freelances, self-taught coder",
    answers: [
      4, // Q1: Leadership - high
      5, // Q2: Technology - VERY HIGH
      5, // Q3: Problem solving - VERY HIGH
      2, // Q4: Arts - low
      3, // Q5: Writing - moderate
      5, // Q6: Math - VERY HIGH
      2, // Q7: Languages - low
      4, // Q8: Science - high
      2, // Q9: Sports - low
      5, // Q10: Gaming/tech - VERY HIGH
      2, // Q11: Music - low
      5, // Q12: Building - VERY HIGH
      5, // Q13: Analytical - VERY HIGH
      3, // Q14: People - moderate
      2, // Q15: Nature - low
      2, // Q16: Health - low
      3, // Q17: Design - moderate
      2, // Q18: Photography - low
      5, // Q19: Entrepreneurship - VERY HIGH
      3, // Q20: Sales - moderate
      3, // Q21: Education - moderate
      5, // Q22: Innovation - VERY HIGH
      3, // Q23: Teamwork - moderate
      5, // Q24: Independent - VERY HIGH
      5, // Q25: Learning - VERY HIGH
      2, // Q26: Routine - low
      5, // Q27: Creative tech - VERY HIGH
      5, // Q28: Making - VERY HIGH
      3, // Q29: Helping - moderate
      4  // Q30: Research - high
    ]
  },

  {
    name: "Emilia - Healthcare Student",
    category: "auttaja",
    cohort: "TASO2",
    description: "First aid certified, volunteers at hospital, studying to be paramedic",
    answers: [
      4, // Q1: Leadership - high
      2, // Q2: Technology - low
      4, // Q3: Problem solving - high (practical)
      2, // Q4: Arts - low
      3, // Q5: Writing - moderate
      2, // Q6: Math - low
      3, // Q7: Languages - moderate
      5, // Q8: Science - VERY HIGH (anatomy)
      4, // Q9: Sports - high
      2, // Q10: Gaming - low
      2, // Q11: Music - low
      3, // Q12: Building - moderate
      4, // Q13: Analytical - high
      5, // Q14: Working with people - VERY HIGH
      3, // Q15: Nature - moderate
      5, // Q16: Health/care - VERY HIGH
      2, // Q17: Design - low
      2, // Q18: Photography - low
      3, // Q19: Entrepreneurship - moderate
      2, // Q20: Sales - low
      4, // Q21: Education - high
      3, // Q22: Innovation - moderate
      5, // Q23: Teamwork - VERY HIGH
      3, // Q24: Independent - moderate
      4, // Q25: Learning - high
      4, // Q26: Routine - high
      4, // Q27: Crisis problem solving - high
      5, // Q28: Helping - VERY HIGH
      5, // Q29: Social impact - VERY HIGH
      4  // Q30: Research - high
    ]
  },

  {
    name: "Olivia - Digital Artist",
    category: "luova",
    cohort: "TASO2",
    description: "Freelance illustrator, animation portfolio, applies to art school",
    answers: [
      2, // Q1: Leadership - low
      4, // Q2: Technology - high (digital tools)
      3, // Q3: Problem solving - moderate
      5, // Q4: Arts - VERY HIGH
      4, // Q5: Writing - high (storytelling)
      2, // Q6: Math - low
      3, // Q7: Languages - moderate
      2, // Q8: Science - low
      2, // Q9: Sports - low
      4, // Q10: Gaming - high (inspiration)
      5, // Q11: Music - VERY HIGH
      4, // Q12: Building - high (creative)
      3, // Q13: Analytical - moderate
      3, // Q14: People - moderate
      3, // Q15: Nature - moderate
      2, // Q16: Health - low
      5, // Q17: Design - VERY HIGH
      5, // Q18: Photography/visual - VERY HIGH
      4, // Q19: Entrepreneurship - high
      2, // Q20: Sales - low
      2, // Q21: Education - low
      5, // Q22: Innovation - VERY HIGH
      3, // Q23: Teamwork - moderate
      5, // Q24: Independent - VERY HIGH
      4, // Q25: Learning - high
      2, // Q26: Routine - low
      5, // Q27: Creative thinking - VERY HIGH
      5, // Q28: Making art - VERY HIGH
      3, // Q29: Helping - moderate
      3  // Q30: Research - moderate
    ]
  },

  {
    name: "Joonas - Mechanic Apprentice",
    category: "rakentaja",
    cohort: "TASO2",
    description: "Vocational school, fixes cars, works part-time at garage",
    answers: [
      3, // Q1: Leadership - moderate
      3, // Q2: Technology - moderate
      5, // Q3: Problem solving - VERY HIGH (mechanical)
      2, // Q4: Arts - low
      2, // Q5: Writing - low
      3, // Q6: Math - moderate
      2, // Q7: Languages - low
      3, // Q8: Science - moderate (physics)
      4, // Q9: Sports - high
      3, // Q10: Gaming - moderate
      2, // Q11: Music - low
      5, // Q12: Building/fixing - VERY HIGH
      4, // Q13: Analytical - high (diagnostic)
      3, // Q14: People - moderate
      2, // Q15: Nature - low
      2, // Q16: Health - low
      2, // Q17: Design - low
      2, // Q18: Photography - low
      3, // Q19: Entrepreneurship - moderate
      2, // Q20: Sales - low
      2, // Q21: Education - low
      3, // Q22: Innovation - moderate
      4, // Q23: Teamwork - high
      4, // Q24: Independent - high
      4, // Q25: Learning - high (hands-on)
      5, // Q26: Routine - VERY HIGH
      4, // Q27: Practical solving - high
      5, // Q28: Making/fixing - VERY HIGH
      3, // Q29: Helping - moderate
      2  // Q30: Research - low
    ]
  },

  {
    name: "Amanda - Business Student",
    category: "johtaja",
    cohort: "TASO2",
    description: "Runs school store, business club president, wants to study management",
    answers: [
      5, // Q1: Leadership - VERY HIGH
      4, // Q2: Technology - high
      4, // Q3: Problem solving - high
      3, // Q4: Arts - moderate
      4, // Q5: Writing - high
      4, // Q6: Math - high
      3, // Q7: Languages - moderate
      3, // Q8: Science - moderate
      3, // Q9: Sports - moderate
      3, // Q10: Gaming - moderate
      3, // Q11: Music - moderate
      3, // Q12: Building - moderate
      5, // Q13: Analytical - VERY HIGH
      5, // Q14: Working with people - VERY HIGH
      2, // Q15: Nature - low
      2, // Q16: Health - low
      3, // Q17: Design - moderate
      3, // Q18: Photography - moderate
      5, // Q19: Entrepreneurship - VERY HIGH
      5, // Q20: Sales - VERY HIGH
      4, // Q21: Education - high
      4, // Q22: Innovation - high
      5, // Q23: Teamwork - VERY HIGH
      4, // Q24: Independent - high
      4, // Q25: Learning - high
      4, // Q26: Routine - high
      5, // Q27: Strategic thinking - VERY HIGH
      3, // Q28: Making - moderate
      4, // Q29: Leading - high
      4  // Q30: Research - high
    ]
  },

  {
    name: "Eetu - Science Olympiad",
    category: "visionaari",
    cohort: "TASO2",
    description: "Physics olympiad medalist, wants to study theoretical physics",
    answers: [
      3, // Q1: Leadership - moderate
      4, // Q2: Technology - high
      5, // Q3: Problem solving - VERY HIGH
      2, // Q4: Arts - low
      3, // Q5: Writing - moderate
      5, // Q6: Math - VERY HIGH
      3, // Q7: Languages - moderate
      5, // Q8: Science - VERY HIGH
      2, // Q9: Sports - low
      3, // Q10: Gaming - moderate
      2, // Q11: Music - low
      3, // Q12: Building - moderate
      5, // Q13: Analytical - VERY HIGH
      2, // Q14: People - low
      3, // Q15: Nature - moderate
      2, // Q16: Health - low
      3, // Q17: Design - moderate
      2, // Q18: Photography - low
      3, // Q19: Entrepreneurship - moderate
      2, // Q20: Sales - low
      3, // Q21: Education - moderate
      5, // Q22: Innovation - VERY HIGH
      3, // Q23: Teamwork - moderate
      5, // Q24: Independent - VERY HIGH
      5, // Q25: Learning - VERY HIGH
      2, // Q26: Routine - low
      5, // Q27: Abstract thinking - VERY HIGH
      4, // Q28: Theoretical work - high
      2, // Q29: Helping - low
      5  // Q30: Research - VERY HIGH
    ]
  },

  {
    name: "Liisa - Office Admin Trainee",
    category: "jarjestaja",
    cohort: "TASO2",
    description: "Vocational business school, internship at law firm, organized and efficient",
    answers: [
      3, // Q1: Leadership - moderate
      4, // Q2: Technology - high (office tools)
      3, // Q3: Problem solving - moderate
      2, // Q4: Arts - low
      4, // Q5: Writing - high
      4, // Q6: Math - high
      3, // Q7: Languages - moderate
      2, // Q8: Science - low
      2, // Q9: Sports - low
      2, // Q10: Gaming - low
      2, // Q11: Music - low
      2, // Q12: Building - low
      4, // Q13: Analytical - high
      4, // Q14: Working with people - high
      2, // Q15: Nature - low
      2, // Q16: Health - low
      3, // Q17: Design - moderate
      2, // Q18: Photography - low
      3, // Q19: Entrepreneurship - moderate
      3, // Q20: Sales - moderate
      3, // Q21: Education - moderate
      2, // Q22: Innovation - low
      5, // Q23: Teamwork - VERY HIGH
      3, // Q24: Independent - moderate
      4, // Q25: Learning - high
      5, // Q26: Routine/organization - VERY HIGH
      3, // Q27: Problem solving - moderate
      4, // Q28: Organizing - high
      4, // Q29: Supporting - high
      3  // Q30: Research - moderate
    ]
  },

  {
    name: "Niko - Environmental Activist",
    category: "ympariston-puolustaja",
    cohort: "TASO2",
    description: "Climate strike organizer, studies environmental science, active in Greenpeace",
    answers: [
      5, // Q1: Leadership - VERY HIGH
      4, // Q2: Technology - high (social media)
      4, // Q3: Problem solving - high
      3, // Q4: Arts - moderate
      5, // Q5: Writing - VERY HIGH (activism)
      3, // Q6: Math - moderate
      4, // Q7: Languages - high
      5, // Q8: Science - VERY HIGH (ecology)
      3, // Q9: Sports - moderate
      2, // Q10: Gaming - low
      3, // Q11: Music - moderate
      3, // Q12: Building - moderate
      4, // Q13: Analytical - high
      5, // Q14: People - VERY HIGH
      5, // Q15: Nature - VERY HIGH
      4, // Q16: Health - high
      3, // Q17: Design - moderate
      4, // Q18: Photography - high
      4, // Q19: Entrepreneurship - high
      4, // Q20: Sales/persuasion - high
      5, // Q21: Education - VERY HIGH
      5, // Q22: Innovation - VERY HIGH
      5, // Q23: Teamwork - VERY HIGH
      4, // Q24: Independent - high
      5, // Q25: Learning - VERY HIGH
      2, // Q26: Routine - low
      5, // Q27: System thinking - VERY HIGH
      5, // Q28: Environmental action - VERY HIGH
      5, // Q29: Social impact - VERY HIGH
      5  // Q30: Research - VERY HIGH
    ]
  }
];

// ============================================================================
// NUORI COHORT (20-25 YEARS) - 8 PROFILES
// ============================================================================

const nuoriProfiles = [
  {
    name: "Sami - Bootcamp Graduate",
    category: "innovoija",
    cohort: "NUORI",
    description: "Career switcher from retail, completed coding bootcamp, looking for junior dev job",
    answers: [
      3, // Q1: Leadership - moderate
      5, // Q2: Technology - VERY HIGH
      5, // Q3: Problem solving - VERY HIGH
      2, // Q4: Arts - low
      3, // Q5: Writing - moderate
      4, // Q6: Math - high
      2, // Q7: Languages - low
      3, // Q8: Science - moderate
      3, // Q9: Sports - moderate
      5, // Q10: Gaming/tech - VERY HIGH
      2, // Q11: Music - low
      5, // Q12: Building - VERY HIGH
      5, // Q13: Analytical - VERY HIGH
      3, // Q14: People - moderate
      2, // Q15: Nature - low
      2, // Q16: Health - low
      3, // Q17: Design - moderate
      2, // Q18: Photography - low
      4, // Q19: Entrepreneurship - high
      2, // Q20: Sales - low
      3, // Q21: Education - moderate
      5, // Q22: Innovation - VERY HIGH
      4, // Q23: Teamwork - high
      4, // Q24: Independent - high
      5, // Q25: Learning - VERY HIGH
      2, // Q26: Routine - low
      5, // Q27: Tech problem solving - VERY HIGH
      5, // Q28: Building apps - VERY HIGH
      3, // Q29: Helping - moderate
      4  // Q30: Research - high
    ]
  },

  {
    name: "Jenni - Social Worker",
    category: "auttaja",
    cohort: "NUORI",
    description: "Social work student, works at youth center, passionate about helping at-risk youth",
    answers: [
      4, // Q1: Leadership - high
      2, // Q2: Technology - low
      4, // Q3: Problem solving - high (people)
      3, // Q4: Arts - moderate
      5, // Q5: Writing - VERY HIGH
      2, // Q6: Math - low
      4, // Q7: Languages - high
      3, // Q8: Science - moderate
      3, // Q9: Sports - moderate
      2, // Q10: Gaming - low
      3, // Q11: Music - moderate
      2, // Q12: Building - low
      4, // Q13: Analytical - high
      5, // Q14: Working with people - VERY HIGH
      3, // Q15: Nature - moderate
      5, // Q16: Health/wellbeing - VERY HIGH
      3, // Q17: Design - moderate
      3, // Q18: Photography - moderate
      2, // Q19: Entrepreneurship - low
      3, // Q20: Sales - moderate
      5, // Q21: Education - VERY HIGH
      3, // Q22: Innovation - moderate
      5, // Q23: Teamwork - VERY HIGH
      3, // Q24: Independent - moderate
      5, // Q25: Learning - VERY HIGH
      3, // Q26: Routine - moderate
      4, // Q27: Problem solving - high
      5, // Q28: Helping people - VERY HIGH
      5, // Q29: Social impact - VERY HIGH
      4  // Q30: Research - high
    ]
  },

  {
    name: "Petra - Freelance Designer",
    category: "luova",
    cohort: "NUORI",
    description: "Self-employed graphic designer, builds websites, has diverse client portfolio",
    answers: [
      4, // Q1: Leadership - high
      5, // Q2: Technology - VERY HIGH (design tools)
      4, // Q3: Problem solving - high
      5, // Q4: Arts - VERY HIGH
      4, // Q5: Writing - high
      3, // Q6: Math - moderate
      3, // Q7: Languages - moderate
      2, // Q8: Science - low
      2, // Q9: Sports - low
      4, // Q10: Gaming - high
      4, // Q11: Music - high
      4, // Q12: Building - high (digital)
      4, // Q13: Analytical - high
      4, // Q14: People - high (clients)
      2, // Q15: Nature - low
      2, // Q16: Health - low
      5, // Q17: Design - VERY HIGH
      5, // Q18: Photography/visual - VERY HIGH
      5, // Q19: Entrepreneurship - VERY HIGH
      4, // Q20: Sales - high
      3, // Q21: Education - moderate
      5, // Q22: Innovation - VERY HIGH
      3, // Q23: Teamwork - moderate
      5, // Q24: Independent - VERY HIGH
      5, // Q25: Learning - VERY HIGH
      2, // Q26: Routine - low
      5, // Q27: Creative thinking - VERY HIGH
      5, // Q28: Making/creating - VERY HIGH
      3, // Q29: Helping - moderate
      3  // Q30: Research - moderate
    ]
  },

  {
    name: "Kari - Construction Worker",
    category: "rakentaja",
    cohort: "NUORI",
    description: "Carpenter, completed vocational training, works on building sites",
    answers: [
      3, // Q1: Leadership - moderate
      2, // Q2: Technology - low
      5, // Q3: Problem solving - VERY HIGH (practical)
      2, // Q4: Arts - low
      2, // Q5: Writing - low
      4, // Q6: Math - high (measurements)
      2, // Q7: Languages - low
      3, // Q8: Science - moderate
      5, // Q9: Sports - VERY HIGH (physical)
      2, // Q10: Gaming - low
      2, // Q11: Music - low
      5, // Q12: Building - VERY HIGH
      4, // Q13: Analytical - high (spatial)
      4, // Q14: People - high (teamwork)
      3, // Q15: Nature - moderate
      2, // Q16: Health - low
      3, // Q17: Design - moderate (blueprints)
      2, // Q18: Photography - low
      3, // Q19: Entrepreneurship - moderate
      2, // Q20: Sales - low
      2, // Q21: Education - low
      3, // Q22: Innovation - moderate
      5, // Q23: Teamwork - VERY HIGH
      4, // Q24: Independent - high
      4, // Q25: Learning - high (practical)
      5, // Q26: Routine - VERY HIGH
      4, // Q27: Practical solving - high
      5, // Q28: Building/making - VERY HIGH
      3, // Q29: Helping - moderate
      2  // Q30: Research - low
    ]
  },

  {
    name: "Laura - Startup Founder",
    category: "johtaja",
    cohort: "NUORI",
    description: "Running small e-commerce business, studies business part-time, ambitious",
    answers: [
      5, // Q1: Leadership - VERY HIGH
      5, // Q2: Technology - VERY HIGH
      5, // Q3: Problem solving - VERY HIGH
      3, // Q4: Arts - moderate
      4, // Q5: Writing - high
      4, // Q6: Math - high
      3, // Q7: Languages - moderate
      3, // Q8: Science - moderate
      3, // Q9: Sports - moderate
      4, // Q10: Gaming - high
      2, // Q11: Music - low
      4, // Q12: Building - high (business)
      5, // Q13: Analytical - VERY HIGH
      5, // Q14: Working with people - VERY HIGH
      2, // Q15: Nature - low
      2, // Q16: Health - low
      4, // Q17: Design - high
      3, // Q18: Photography - moderate
      5, // Q19: Entrepreneurship - VERY HIGH
      5, // Q20: Sales - VERY HIGH
      4, // Q21: Education - high
      5, // Q22: Innovation - VERY HIGH
      5, // Q23: Teamwork - VERY HIGH
      5, // Q24: Independent - VERY HIGH
      5, // Q25: Learning - VERY HIGH
      3, // Q26: Routine - moderate
      5, // Q27: Strategic thinking - VERY HIGH
      5, // Q28: Building business - VERY HIGH
      4, // Q29: Leading - high
      4  // Q30: Research - high
    ]
  },

  {
    name: "Antti - Data Analyst",
    category: "visionaari",
    cohort: "NUORI",
    description: "Economics graduate, works in analytics, interested in AI and machine learning",
    answers: [
      3, // Q1: Leadership - moderate
      5, // Q2: Technology - VERY HIGH
      5, // Q3: Problem solving - VERY HIGH
      2, // Q4: Arts - low
      4, // Q5: Writing - high (reports)
      5, // Q6: Math - VERY HIGH
      3, // Q7: Languages - moderate
      5, // Q8: Science - VERY HIGH
      2, // Q9: Sports - low
      3, // Q10: Gaming - moderate
      2, // Q11: Music - low
      3, // Q12: Building - moderate
      5, // Q13: Analytical - VERY HIGH
      3, // Q14: People - moderate
      2, // Q15: Nature - low
      2, // Q16: Health - low
      3, // Q17: Design - moderate
      2, // Q18: Photography - low
      4, // Q19: Entrepreneurship - high
      3, // Q20: Sales - moderate
      4, // Q21: Education - high
      5, // Q22: Innovation - VERY HIGH
      3, // Q23: Teamwork - moderate
      5, // Q24: Independent - VERY HIGH
      5, // Q25: Learning - VERY HIGH
      3, // Q26: Routine - moderate
      5, // Q27: Strategic/analytical - VERY HIGH
      4, // Q28: Building models - high
      3, // Q29: Helping - moderate
      5  // Q30: Research - VERY HIGH
    ]
  },

  {
    name: "Minna - Project Coordinator",
    category: "jarjestaja",
    cohort: "NUORI",
    description: "Works in event management, organized conferences, detail-oriented professional",
    answers: [
      4, // Q1: Leadership - high
      4, // Q2: Technology - high (tools)
      4, // Q3: Problem solving - high
      3, // Q4: Arts - moderate
      5, // Q5: Writing - VERY HIGH
      3, // Q6: Math - moderate
      4, // Q7: Languages - high
      2, // Q8: Science - low
      3, // Q9: Sports - moderate
      2, // Q10: Gaming - low
      3, // Q11: Music - moderate
      3, // Q12: Building - moderate
      4, // Q13: Analytical - high
      5, // Q14: Working with people - VERY HIGH
      2, // Q15: Nature - low
      3, // Q16: Health - moderate
      4, // Q17: Design - high
      3, // Q18: Photography - moderate
      4, // Q19: Entrepreneurship - high
      4, // Q20: Sales - high
      4, // Q21: Education - high
      4, // Q22: Innovation - high
      5, // Q23: Teamwork - VERY HIGH
      3, // Q24: Independent - moderate
      5, // Q25: Learning - VERY HIGH
      5, // Q26: Routine/organization - VERY HIGH
      4, // Q27: Problem solving - high
      5, // Q28: Organizing - VERY HIGH
      4, // Q29: Helping - high
      4  // Q30: Research - high
    ]
  },

  {
    name: "Veera - Sustainability Consultant",
    category: "ympariston-puolustaja",
    cohort: "NUORI",
    description: "Environmental science graduate, advises companies on green practices",
    answers: [
      4, // Q1: Leadership - high
      4, // Q2: Technology - high
      5, // Q3: Problem solving - VERY HIGH
      3, // Q4: Arts - moderate
      5, // Q5: Writing - VERY HIGH
      4, // Q6: Math - high
      4, // Q7: Languages - high
      5, // Q8: Science - VERY HIGH
      3, // Q9: Sports - moderate
      2, // Q10: Gaming - low
      3, // Q11: Music - moderate
      3, // Q12: Building - moderate
      5, // Q13: Analytical - VERY HIGH
      5, // Q14: Working with people - VERY HIGH
      5, // Q15: Nature - VERY HIGH
      4, // Q16: Health - high
      4, // Q17: Design - high
      4, // Q18: Photography - high
      5, // Q19: Entrepreneurship - VERY HIGH
      5, // Q20: Sales/persuasion - VERY HIGH
      5, // Q21: Education - VERY HIGH
      5, // Q22: Innovation - VERY HIGH
      5, // Q23: Teamwork - VERY HIGH
      4, // Q24: Independent - high
      5, // Q25: Learning - VERY HIGH
      3, // Q26: Routine - moderate
      5, // Q27: Systems thinking - VERY HIGH
      5, // Q28: Environmental impact - VERY HIGH
      5, // Q29: Social impact - VERY HIGH
      5  // Q30: Research - VERY HIGH
    ]
  }
];

// ============================================================================
// TEST EXECUTION
// ============================================================================

async function testProfile(profile) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`Testing: ${profile.name} (${profile.cohort})`);
  console.log(`Expected Category: ${profile.category}`);
  console.log(`Description: ${profile.description}`);
  console.log('='.repeat(80));

  try {
    // Convert answers array to API format
    const answers = profile.answers.map((score, index) => ({
      questionIndex: index,
      score: score
    }));

    const response = await fetch(`${API_BASE}/api/score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        answers: answers,
        cohort: profile.cohort,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ HTTP Error ${response.status}: ${errorText}`);
      return {
        profile: profile.name,
        cohort: profile.cohort,
        expectedCategory: profile.category,
        actualCategory: 'ERROR',
        passed: false,
        error: `HTTP ${response.status}`,
      };
    }

    const result = await response.json();

    const actualCategory = result.topCareers?.[0]?.category || 'UNKNOWN';
    const topCareer = result.topCareers?.[0]?.title || 'NONE';
    const matchPercentage = result.topCareers?.[0]?.overallScore || 0;
    const educationPath = result.educationPath?.primary || 'NULL';

    const passed = actualCategory === profile.category;

    console.log(`\n📊 RESULTS:`);
    console.log(`Expected Category: ${profile.category}`);
    console.log(`Actual Category:   ${actualCategory} ${passed ? '✅' : '❌'}`);
    console.log(`Top Career:        ${topCareer} (${matchPercentage}% match)`);
    console.log(`Education Path:    ${educationPath}`);

    if (result.userProfile?.strengths && result.userProfile.strengths.length > 0) {
      console.log(`\n💪 Top Strengths:`);
      result.userProfile.strengths.slice(0, 3).forEach((s, i) => {
        console.log(`   ${i + 1}. ${s.dimension} (${s.score.toFixed(1)})`);
      });
    }

    if (!passed) {
      console.log(`\n⚠️  CATEGORY MISMATCH!`);
      console.log(`   Expected: ${profile.category}`);
      console.log(`   Got: ${actualCategory}`);
    }

    return {
      profile: profile.name,
      cohort: profile.cohort,
      expectedCategory: profile.category,
      actualCategory,
      topCareer,
      matchPercentage,
      educationPath,
      passed,
    };
  } catch (error) {
    console.error(`❌ Test failed:`, error.message);
    return {
      profile: profile.name,
      cohort: profile.cohort,
      expectedCategory: profile.category,
      actualCategory: 'ERROR',
      passed: false,
      error: error.message,
    };
  }
}

async function runAllTests() {
  console.log('\n' + '█'.repeat(80));
  console.log('█ COMPREHENSIVE REAL-PERSON TESTING');
  console.log('█ Testing 24 realistic personality profiles across all cohorts');
  console.log('█'.repeat(80));

  const allProfiles = [
    ...ylaProfiles,
    ...taso2Profiles,
    ...nuoriProfiles,
  ];

  const results = [];

  for (const profile of allProfiles) {
    const result = await testProfile(profile);
    results.push(result);
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // ============================================================================
  // SUMMARY REPORT
  // ============================================================================

  console.log('\n\n' + '█'.repeat(80));
  console.log('█ FINAL TEST SUMMARY');
  console.log('█'.repeat(80));

  const ylaPassed = results.filter(r => r.cohort === 'YLA' && r.passed).length;
  const ylaTotal = ylaProfiles.length;
  const taso2Passed = results.filter(r => r.cohort === 'TASO2' && r.passed).length;
  const taso2Total = taso2Profiles.length;
  const nuoriPassed = results.filter(r => r.cohort === 'NUORI' && r.passed).length;
  const nuoriTotal = nuoriProfiles.length;
  const totalPassed = results.filter(r => r.passed).length;
  const totalTests = results.length;

  console.log(`\n📊 RESULTS BY COHORT:`);
  console.log(`YLA:   ${ylaPassed}/${ylaTotal} passed (${((ylaPassed / ylaTotal) * 100).toFixed(0)}%)`);
  console.log(`TASO2: ${taso2Passed}/${taso2Total} passed (${((taso2Passed / taso2Total) * 100).toFixed(0)}%)`);
  console.log(`NUORI: ${nuoriPassed}/${nuoriTotal} passed (${((nuoriPassed / nuoriTotal) * 100).toFixed(0)}%)`);
  console.log(`\n🎯 OVERALL: ${totalPassed}/${totalTests} passed (${((totalPassed / totalTests) * 100).toFixed(0)}%)`);

  // Category breakdown
  const categoryResults = {};
  results.forEach(r => {
    if (!categoryResults[r.expectedCategory]) {
      categoryResults[r.expectedCategory] = { passed: 0, total: 0 };
    }
    categoryResults[r.expectedCategory].total++;
    if (r.passed) categoryResults[r.expectedCategory].passed++;
  });

  console.log(`\n📂 RESULTS BY CATEGORY:`);
  Object.entries(categoryResults).forEach(([category, stats]) => {
    const percentage = ((stats.passed / stats.total) * 100).toFixed(0);
    const status = stats.passed === stats.total ? '✅' : '⚠️';
    console.log(`${status} ${category}: ${stats.passed}/${stats.total} (${percentage}%)`);
  });

  // Failed tests
  const failures = results.filter(r => !r.passed);
  if (failures.length > 0) {
    console.log(`\n❌ FAILED TESTS (${failures.length}):`);
    failures.forEach(f => {
      console.log(`   ${f.profile} (${f.cohort}): Expected ${f.expectedCategory}, got ${f.actualCategory}`);
    });
  }

  // Education path check
  const missingEducation = results.filter(r => r.educationPath === 'NULL' || r.educationPath === 'UNKNOWN');
  if (missingEducation.length > 0) {
    console.log(`\n⚠️  MISSING EDUCATION PATHS (${missingEducation.length}):`);
    missingEducation.forEach(r => {
      console.log(`   ${r.profile} (${r.cohort})`);
    });
  }

  console.log('\n' + '█'.repeat(80));
  if (totalPassed === totalTests) {
    console.log('█ ✅ ALL TESTS PASSED! SYSTEM READY FOR PRODUCTION');
  } else {
    console.log(`█ ⚠️  ${totalTests - totalPassed} TESTS FAILED - REVIEW NEEDED`);
  }
  console.log('█'.repeat(80) + '\n');
}

// Run tests
runAllTests().catch(console.error);
