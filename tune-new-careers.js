#!/usr/bin/env node

/**
 * Fine-tune New Career Subdimension Scores
 * Adjusts scores to improve matching for specific user profiles
 */

const fs = require('fs');

// Careers to tune with their adjustments
const tuningAdjustments = {
  // TECH/STARTUP CAREERS - Boost innovation, business, entrepreneurship
  "product-manager": {
    interests: { innovation: 0.9, business: 1.0 },
    workstyle: { leadership: 0.9 },
    values: { growth: 0.9, impact: 0.9 }
  },
  "growth-hacker": {
    interests: { innovation: 1.0, business: 1.0, analytical: 1.0 },
    values: { growth: 1.0 }
  },
  "devops-engineer": {
    interests: { technology: 1.0, innovation: 0.9 },
    workstyle: { problem_solving: 1.0 }
  },
  "ux-researcher": {
    interests: { people: 1.0, creative: 0.7, innovation: 0.7 },
    workstyle: { problem_solving: 0.9 }
  },
  "data-analyst": {
    interests: { analytical: 1.0, technology: 0.9, business: 0.7 }
  },
  "scrum-master": {
    workstyle: { teamwork: 1.0, organization: 1.0, leadership: 0.8 }
  },
  "customer-success-manager": {
    interests: { people: 1.0, business: 0.8 },
    values: { impact: 0.9 }
  },

  // SOCIAL IMPACT CAREERS - Boost people, impact, social values
  "diversity-and-inclusion-specialist": {
    interests: { people: 1.0 },
    values: { impact: 1.0, growth: 0.9 },
    workstyle: { leadership: 0.8 }
  },
  "social-justice-advocate": {
    interests: { people: 1.0 },
    values: { impact: 1.0 },
    workstyle: { leadership: 0.8 }
  },
  "community-organizer": {
    interests: { people: 1.0 },
    workstyle: { teamwork: 1.0, leadership: 0.9 },
    values: { impact: 1.0 }
  },
  "gender-equality-advisor": {
    interests: { people: 1.0 },
    values: { impact: 1.0 },
    workstyle: { leadership: 0.8 }
  },
  "human-rights-researcher": {
    interests: { people: 0.9, analytical: 0.9 },
    values: { impact: 1.0 }
  },
  "accessibility-consultant": {
    interests: { people: 1.0, technology: 0.8 },
    values: { impact: 1.0 }
  },
  "youth-empowerment-coordinator": {
    interests: { people: 1.0 },
    values: { impact: 1.0, growth: 0.9 }
  },
  "nonprofit-program-coordinator": {
    interests: { people: 1.0 },
    values: { impact: 0.9 }
  },

  // SUSTAINABILITY CAREERS - Boost environment to maximum
  "sustainable-fashion-designer": {
    interests: { environment: 1.0, creative: 1.0, innovation: 0.9 },
    values: { impact: 1.0 }
  },
  "circular-economy-specialist": {
    interests: { environment: 1.0, innovation: 1.0, business: 0.9 },
    values: { impact: 1.0 }
  },
  "zero-waste-consultant": {
    interests: { environment: 1.0, business: 0.8 },
    values: { impact: 1.0 }
  },
  "ethical-brand-strategist": {
    interests: { environment: 0.8, creative: 0.9, business: 0.9 },
    values: { impact: 1.0 }
  },
  "green-building-designer": {
    interests: { environment: 1.0, creative: 0.9, innovation: 0.9 },
    values: { impact: 1.0 }
  },
  "sustainable-product-designer": {
    interests: { environment: 1.0, creative: 1.0, innovation: 1.0 },
    values: { impact: 1.0 }
  },
  "ethical-sourcing-manager": {
    interests: { environment: 0.9, business: 0.9 },
    values: { impact: 1.0 }
  },

  // BUSINESS CONSULTING CAREERS - Boost analytical, business, leadership
  "management-consultant": {
    interests: { business: 1.0, analytical: 1.0 },
    workstyle: { leadership: 0.9, problem_solving: 1.0 },
    values: { growth: 1.0 }
  },
  "strategy-consultant": {
    interests: { business: 1.0, analytical: 1.0, innovation: 0.8 },
    workstyle: { leadership: 1.0, problem_solving: 1.0 },
    values: { growth: 1.0, impact: 1.0 }
  },
  "business-analyst": {
    interests: { business: 1.0, analytical: 1.0, technology: 0.7 },
    workstyle: { problem_solving: 1.0 }
  },
  "digital-transformation-consultant": {
    interests: { technology: 0.9, business: 1.0, innovation: 1.0 },
    workstyle: { leadership: 0.9 },
    values: { growth: 1.0, impact: 1.0 }
  },

  // CREATIVE CAREERS - Already working well, minor boosts
  "content-creator": {
    interests: { creative: 1.0, innovation: 0.8 },
    workstyle: { independence: 1.0 }
  },
  "social-media-manager": {
    interests: { people: 1.0, creative: 0.9 },
    values: { growth: 0.8 }
  },
  "content-strategist": {
    interests: { creative: 0.9, analytical: 0.7, business: 0.8 },
    workstyle: { organization: 0.9 }
  }
};

console.log('🎯 Fine-tuning New Career Subdimension Scores\n');
console.log(`Adjusting ${Object.keys(tuningAdjustments).length} careers...\n`);

// Read the file
let content = fs.readFileSync('./lib/scoring/careerVectors.ts', 'utf8');
let adjustedCount = 0;
let notFoundCount = 0;

// Process each career
Object.entries(tuningAdjustments).forEach(([slug, adjustments]) => {
  // Find the career in the file
  const careerPattern = new RegExp(
    `(\\{[^}]*"slug":\\s*"${slug}"[^}]*\\})`,
    's'
  );

  const match = content.match(careerPattern);

  if (!match) {
    console.log(`⚠️  Could not find career: ${slug}`);
    notFoundCount++;
    return;
  }

  let careerObj = match[1];
  let updated = false;

  // Apply interest adjustments
  if (adjustments.interests) {
    Object.entries(adjustments.interests).forEach(([key, value]) => {
      const interestPattern = new RegExp(
        `("interests":\\s*\\{[^}]*"${key}":\\s*)([0-9.]+)`,
        's'
      );
      if (careerObj.match(interestPattern)) {
        careerObj = careerObj.replace(interestPattern, `$1${value}`);
        updated = true;
      }
    });
  }

  // Apply workstyle adjustments
  if (adjustments.workstyle) {
    Object.entries(adjustments.workstyle).forEach(([key, value]) => {
      const workstylePattern = new RegExp(
        `("workstyle":\\s*\\{[^}]*"${key}":\\s*)([0-9.]+)`,
        's'
      );
      if (careerObj.match(workstylePattern)) {
        careerObj = careerObj.replace(workstylePattern, `$1${value}`);
        updated = true;
      }
    });
  }

  // Apply values adjustments
  if (adjustments.values) {
    Object.entries(adjustments.values).forEach(([key, value]) => {
      const valuesPattern = new RegExp(
        `("values":\\s*\\{[^}]*"${key}":\\s*)([0-9.]+)`,
        's'
      );
      if (careerObj.match(valuesPattern)) {
        careerObj = careerObj.replace(valuesPattern, `$1${value}`);
        updated = true;
      }
    });
  }

  if (updated) {
    content = content.replace(match[1], careerObj);
    adjustedCount++;
    console.log(`✅ Adjusted: ${slug}`);
  }
});

// Write back
fs.writeFileSync('./lib/scoring/careerVectors.ts', content);

console.log(`\n📊 Summary:`);
console.log(`   ✅ Adjusted: ${adjustedCount} careers`);
console.log(`   ⚠️  Not found: ${notFoundCount} careers`);
console.log(`\n✨ Tuning complete! Rebuild the app to see changes.\n`);
