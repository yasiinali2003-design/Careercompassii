#!/usr/bin/env node

const fs = require('fs');

// 25 additional progressive/creative careers for Helsinki's "woke" market
const progressiveCareers = [
  // SOCIAL IMPACT & ACTIVISM (8 careers)
  {
    slug: "diversity-and-inclusion-specialist",
    title: "Diversity & Inclusion Specialist",
    category: "auttaja",
    interests: { technology: 0.4, people: 1, creative: 0.6, analytical: 0.6, hands_on: 0, business: 0.6, environment: 0, health: 0.4, innovation: 0.5 },
    workstyle: { teamwork: 0.9, independence: 0.5, leadership: 0.7, organization: 0.8, problem_solving: 0.8 },
    values: { growth: 0.8, impact: 1 },
    context: { outdoor: 0 }
  },
  {
    slug: "social-justice-advocate",
    title: "Social Justice Advocate",
    category: "auttaja",
    interests: { technology: 0.3, people: 1, creative: 0.7, analytical: 0.6, hands_on: 0, business: 0.4, environment: 0, health: 0.3, innovation: 0.5 },
    workstyle: { teamwork: 0.9, independence: 0.6, leadership: 0.7, organization: 0.7, problem_solving: 0.8 },
    values: { growth: 0.7, impact: 1 },
    context: { outdoor: 0.2 }
  },
  {
    slug: "community-organizer",
    title: "Community Organizer",
    category: "auttaja",
    interests: { technology: 0.4, people: 1, creative: 0.7, analytical: 0.5, hands_on: 0.3, business: 0.4, environment: 0, health: 0, innovation: 0.5 },
    workstyle: { teamwork: 1, independence: 0.5, leadership: 0.8, organization: 0.8, problem_solving: 0.8 },
    values: { growth: 0.7, impact: 1 },
    context: { outdoor: 0.4 }
  },
  {
    slug: "nonprofit-program-coordinator",
    title: "Nonprofit Program Coordinator",
    category: "jarjestaja",
    interests: { technology: 0.4, people: 0.9, creative: 0.5, analytical: 0.6, hands_on: 0, business: 0.5, environment: 0, health: 0, innovation: 0.4 },
    workstyle: { teamwork: 0.9, independence: 0.5, leadership: 0.6, organization: 0.9, problem_solving: 0.7 },
    values: { growth: 0.7, impact: 0.9 },
    context: { outdoor: 0 }
  },
  {
    slug: "human-rights-researcher",
    title: "Human Rights Researcher",
    category: "visionaari",
    interests: { technology: 0.4, people: 0.8, creative: 0.6, analytical: 0.9, hands_on: 0, business: 0.3, environment: 0, health: 0, innovation: 0.4 },
    workstyle: { teamwork: 0.7, independence: 0.8, leadership: 0.6, organization: 0.8, problem_solving: 0.9 },
    values: { growth: 0.7, impact: 1 },
    context: { outdoor: 0 }
  },
  {
    slug: "accessibility-consultant",
    title: "Accessibility Consultant",
    category: "auttaja",
    interests: { technology: 0.7, people: 0.9, creative: 0.6, analytical: 0.7, hands_on: 0, business: 0.5, environment: 0, health: 0.3, innovation: 0.6 },
    workstyle: { teamwork: 0.8, independence: 0.6, leadership: 0.6, organization: 0.8, problem_solving: 0.8 },
    values: { growth: 0.7, impact: 0.9 },
    context: { outdoor: 0 }
  },
  {
    slug: "gender-equality-advisor",
    title: "Gender Equality Advisor",
    category: "auttaja",
    interests: { technology: 0.3, people: 1, creative: 0.5, analytical: 0.7, hands_on: 0, business: 0.6, environment: 0, health: 0, innovation: 0.5 },
    workstyle: { teamwork: 0.9, independence: 0.6, leadership: 0.7, organization: 0.8, problem_solving: 0.8 },
    values: { growth: 0.7, impact: 1 },
    context: { outdoor: 0 }
  },
  {
    slug: "youth-empowerment-coordinator",
    title: "Youth Empowerment Coordinator",
    category: "auttaja",
    interests: { technology: 0.5, people: 1, creative: 0.7, analytical: 0.5, hands_on: 0.3, business: 0.4, environment: 0, health: 0, innovation: 0.5 },
    workstyle: { teamwork: 0.9, independence: 0.5, leadership: 0.7, organization: 0.8, problem_solving: 0.7 },
    values: { growth: 0.8, impact: 0.9 },
    context: { outdoor: 0.3 }
  },

  // SUSTAINABILITY & ETHICAL DESIGN (7 careers)
  {
    slug: "sustainable-fashion-designer",
    title: "Sustainable Fashion Designer",
    category: "luova",
    interests: { technology: 0.4, people: 0.5, creative: 1, analytical: 0.5, hands_on: 0.7, business: 0.6, environment: 0.9, health: 0, innovation: 0.8 },
    workstyle: { teamwork: 0.6, independence: 0.8, leadership: 0.4, organization: 0.7, problem_solving: 0.7 },
    values: { growth: 0.7, impact: 0.9 },
    context: { outdoor: 0 }
  },
  {
    slug: "circular-economy-specialist",
    title: "Circular Economy Specialist",
    category: "ympariston-puolustaja",
    interests: { technology: 0.5, people: 0.6, creative: 0.7, analytical: 0.8, hands_on: 0.3, business: 0.8, environment: 1, health: 0, innovation: 0.9 },
    workstyle: { teamwork: 0.8, independence: 0.6, leadership: 0.7, organization: 0.8, problem_solving: 0.9 },
    values: { growth: 0.8, impact: 0.9 },
    context: { outdoor: 0 }
  },
  {
    slug: "ethical-brand-strategist",
    title: "Ethical Brand Strategist",
    category: "luova",
    interests: { technology: 0.5, people: 0.7, creative: 0.9, analytical: 0.7, hands_on: 0, business: 0.8, environment: 0.6, health: 0, innovation: 0.7 },
    workstyle: { teamwork: 0.8, independence: 0.6, leadership: 0.6, organization: 0.8, problem_solving: 0.8 },
    values: { growth: 0.8, impact: 0.9 },
    context: { outdoor: 0 }
  },
  {
    slug: "green-building-designer",
    title: "Green Building Designer",
    category: "ympariston-puolustaja",
    interests: { technology: 0.6, people: 0.5, creative: 0.9, analytical: 0.8, hands_on: 0.5, business: 0.5, environment: 1, health: 0, innovation: 0.8 },
    workstyle: { teamwork: 0.7, independence: 0.7, leadership: 0.5, organization: 0.8, problem_solving: 0.9 },
    values: { growth: 0.7, impact: 0.9 },
    context: { outdoor: 0.2 }
  },
  {
    slug: "zero-waste-consultant",
    title: "Zero Waste Consultant",
    category: "ympariston-puolustaja",
    interests: { technology: 0.4, people: 0.7, creative: 0.7, analytical: 0.7, hands_on: 0.4, business: 0.7, environment: 1, health: 0, innovation: 0.8 },
    workstyle: { teamwork: 0.8, independence: 0.7, leadership: 0.7, organization: 0.8, problem_solving: 0.8 },
    values: { growth: 0.7, impact: 1 },
    context: { outdoor: 0.3 }
  },
  {
    slug: "sustainable-product-designer",
    title: "Sustainable Product Designer",
    category: "luova",
    interests: { technology: 0.6, people: 0.5, creative: 1, analytical: 0.7, hands_on: 0.6, business: 0.6, environment: 0.9, health: 0, innovation: 0.9 },
    workstyle: { teamwork: 0.7, independence: 0.7, leadership: 0.4, organization: 0.7, problem_solving: 0.8 },
    values: { growth: 0.8, impact: 0.9 },
    context: { outdoor: 0 }
  },
  {
    slug: "ethical-sourcing-manager",
    title: "Ethical Sourcing Manager",
    category: "jarjestaja",
    interests: { technology: 0.5, people: 0.7, creative: 0.4, analytical: 0.8, hands_on: 0, business: 0.8, environment: 0.7, health: 0, innovation: 0.5 },
    workstyle: { teamwork: 0.8, independence: 0.6, leadership: 0.7, organization: 0.9, problem_solving: 0.8 },
    values: { growth: 0.7, impact: 0.9 },
    context: { outdoor: 0 }
  },

  // INCLUSIVE MEDIA & REPRESENTATION (5 careers)
  {
    slug: "inclusive-content-creator",
    title: "Inclusive Content Creator",
    category: "luova",
    interests: { technology: 0.6, people: 0.8, creative: 1, analytical: 0.4, hands_on: 0.4, business: 0.5, environment: 0, health: 0, innovation: 0.7 },
    workstyle: { teamwork: 0.7, independence: 0.8, leadership: 0.5, organization: 0.6, problem_solving: 0.6 },
    values: { growth: 0.7, impact: 0.9 },
    context: { outdoor: 0 }
  },
  {
    slug: "cultural-sensitivity-consultant",
    title: "Cultural Sensitivity Consultant",
    category: "auttaja",
    interests: { technology: 0.4, people: 1, creative: 0.7, analytical: 0.7, hands_on: 0, business: 0.6, environment: 0, health: 0, innovation: 0.5 },
    workstyle: { teamwork: 0.9, independence: 0.6, leadership: 0.7, organization: 0.7, problem_solving: 0.8 },
    values: { growth: 0.7, impact: 0.9 },
    context: { outdoor: 0 }
  },
  {
    slug: "representation-editor",
    title: "Representation Editor",
    category: "luova",
    interests: { technology: 0.5, people: 0.8, creative: 0.8, analytical: 0.7, hands_on: 0, business: 0.5, environment: 0, health: 0, innovation: 0.6 },
    workstyle: { teamwork: 0.8, independence: 0.6, leadership: 0.6, organization: 0.8, problem_solving: 0.7 },
    values: { growth: 0.6, impact: 0.9 },
    context: { outdoor: 0 }
  },
  {
    slug: "documentary-filmmaker-social-issues",
    title: "Documentary Filmmaker (Social Issues)",
    category: "luova",
    interests: { technology: 0.7, people: 0.8, creative: 1, analytical: 0.6, hands_on: 0.7, business: 0.4, environment: 0, health: 0, innovation: 0.7 },
    workstyle: { teamwork: 0.7, independence: 0.8, leadership: 0.6, organization: 0.7, problem_solving: 0.8 },
    values: { growth: 0.7, impact: 1 },
    context: { outdoor: 0.6 }
  },
  {
    slug: "multicultural-marketing-specialist",
    title: "Multicultural Marketing Specialist",
    category: "luova",
    interests: { technology: 0.6, people: 0.9, creative: 0.8, analytical: 0.6, hands_on: 0, business: 0.8, environment: 0, health: 0, innovation: 0.6 },
    workstyle: { teamwork: 0.8, independence: 0.6, leadership: 0.6, organization: 0.7, problem_solving: 0.7 },
    values: { growth: 0.7, impact: 0.8 },
    context: { outdoor: 0 }
  },

  // COMMUNITY ARTS & CULTURE (5 careers)
  {
    slug: "public-art-coordinator",
    title: "Public Art Coordinator",
    category: "luova",
    interests: { technology: 0.4, people: 0.8, creative: 1, analytical: 0.5, hands_on: 0.5, business: 0.5, environment: 0, health: 0, innovation: 0.6 },
    workstyle: { teamwork: 0.9, independence: 0.5, leadership: 0.6, organization: 0.8, problem_solving: 0.7 },
    values: { growth: 0.6, impact: 0.9 },
    context: { outdoor: 0.6 }
  },
  {
    slug: "cultural-events-producer",
    title: "Cultural Events Producer",
    category: "jarjestaja",
    interests: { technology: 0.5, people: 0.9, creative: 0.9, analytical: 0.5, hands_on: 0.5, business: 0.7, environment: 0, health: 0, innovation: 0.6 },
    workstyle: { teamwork: 0.9, independence: 0.5, leadership: 0.7, organization: 0.9, problem_solving: 0.8 },
    values: { growth: 0.7, impact: 0.8 },
    context: { outdoor: 0.4 }
  },
  {
    slug: "art-therapy-facilitator",
    title: "Art Therapy Facilitator",
    category: "auttaja",
    interests: { technology: 0.2, people: 1, creative: 1, analytical: 0.5, hands_on: 0.7, business: 0.2, environment: 0, health: 0.8, innovation: 0.5 },
    workstyle: { teamwork: 0.7, independence: 0.7, leadership: 0.6, organization: 0.7, problem_solving: 0.7 },
    values: { growth: 0.7, impact: 1 },
    context: { outdoor: 0 }
  },
  {
    slug: "community-arts-director",
    title: "Community Arts Director",
    category: "johtaja",
    interests: { technology: 0.4, people: 0.9, creative: 1, analytical: 0.5, hands_on: 0.4, business: 0.6, environment: 0, health: 0, innovation: 0.7 },
    workstyle: { teamwork: 0.9, independence: 0.5, leadership: 0.9, organization: 0.8, problem_solving: 0.8 },
    values: { growth: 0.7, impact: 0.9 },
    context: { outdoor: 0.3 }
  },
  {
    slug: "museum-education-specialist",
    title: "Museum Education Specialist",
    category: "auttaja",
    interests: { technology: 0.5, people: 0.9, creative: 0.8, analytical: 0.6, hands_on: 0.3, business: 0.3, environment: 0, health: 0, innovation: 0.6, education: 0.9 },
    workstyle: { teamwork: 0.8, independence: 0.6, leadership: 0.6, organization: 0.8, problem_solving: 0.7 },
    values: { growth: 0.7, impact: 0.8 },
    context: { outdoor: 0 }
  }
];

console.log('📋 PROGRESSIVE CREATIVE CAREERS FOR HELSINKI');
console.log('='.repeat(80));
console.log('');
console.log('Created 25 careers focused on Helsinki/Uusimaa values:');
console.log('');
console.log('🌈 Social Impact & Activism (8 careers):');
progressiveCareers.slice(0, 8).forEach(c => console.log(`   - ${c.title}`));
console.log('');
console.log('♻️  Sustainability & Ethical Design (7 careers):');
progressiveCareers.slice(8, 15).forEach(c => console.log(`   - ${c.title}`));
console.log('');
console.log('📢 Inclusive Media & Representation (5 careers):');
progressiveCareers.slice(15, 20).forEach(c => console.log(`   - ${c.title}`));
console.log('');
console.log('🎨 Community Arts & Culture (5 careers):');
progressiveCareers.slice(20, 25).forEach(c => console.log(`   - ${c.title}`));
console.log('');
console.log('='.repeat(80));
console.log('');
console.log('These careers align with:');
console.log('  ✓ Social justice & equity');
console.log('  ✓ Environmental consciousness');
console.log('  ✓ Diversity & inclusion');
console.log('  ✓ Community engagement');
console.log('  ✓ Progressive values');
console.log('');
console.log('Perfect for the Helsinki/Uusimaa market! 🇫🇮');
console.log('');

// Export for adding to database
fs.writeFileSync('./progressive-careers.json', JSON.stringify(progressiveCareers, null, 2));
console.log('💾 Saved to progressive-careers.json');
console.log('');
console.log('Next step: Run the add-helsinki-modern-careers.js script to add all 75 careers (50 + 25)');
