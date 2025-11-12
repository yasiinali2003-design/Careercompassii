#!/usr/bin/env node

/**
 * Comprehensive Cohort Testing Script
 * Tests all 3 cohorts (YLA, TASO2, NUORI) with different answer patterns
 */

const fs = require('fs');
const path = require('path');

// Import the scoring engine
const { calculateScore } = require('./lib/scoring/scoringEngine.ts');

// Test cases for each cohort
const testCases = {
  YLA: [
    {
      name: "Tech-interested student",
      answers: [5, 4, 3, 5, 4, 3, 2, 3, 4, 5, 3, 2, 4, 3, 5, 2, 3, 4, 2, 3, 2, 4, 3, 5, 4, 3, 2, 3, 4, 5],
      expectedTopics: ["technology", "analytical"]
    },
    {
      name: "People-oriented student",
      answers: [2, 3, 5, 2, 3, 5, 4, 3, 2, 3, 5, 4, 3, 5, 2, 5, 4, 2, 3, 4, 5, 2, 3, 2, 3, 4, 5, 3, 2, 3],
      expectedTopics: ["people", "care"]
    },
    {
      name: "Hands-on/practical student",
      answers: [2, 3, 2, 3, 5, 4, 3, 2, 3, 2, 3, 4, 3, 2, 3, 2, 4, 5, 4, 3, 2, 5, 4, 3, 5, 4, 3, 5, 4, 3],
      expectedTopics: ["hands_on", "practical"]
    },
    {
      name: "Creative student",
      answers: [3, 2, 4, 3, 2, 3, 5, 4, 5, 3, 2, 5, 3, 2, 4, 3, 2, 3, 5, 4, 3, 2, 3, 4, 2, 3, 5, 4, 3, 2],
      expectedTopics: ["creative", "artistic"]
    },
    {
      name: "Balanced/uncertain student",
      answers: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      expectedTopics: ["varied"]
    }
  ],
  TASO2: [
    {
      name: "Tech/Engineering student",
      answers: [5, 2, 3, 2, 5, 2, 4, 3, 2, 3, 4, 3, 4, 5, 3, 2, 3, 4, 3, 4, 5, 2, 5, 2, 3, 4, 2, 3, 3, 4],
      expectedTopics: ["technology", "engineering"]
    },
    {
      name: "Leadership-focused student",
      answers: [2, 5, 3, 2, 3, 4, 3, 4, 3, 2, 4, 3, 4, 4, 3, 2, 3, 4, 5, 3, 5, 2, 3, 2, 4, 5, 4, 3, 2, 4],
      expectedTopics: ["leadership", "business"]
    },
    {
      name: "Sports/Active student",
      answers: [2, 3, 5, 2, 3, 4, 3, 2, 3, 4, 3, 2, 3, 4, 3, 2, 4, 3, 2, 5, 4, 5, 3, 2, 5, 3, 2, 4, 3, 5],
      expectedTopics: ["sports", "active"]
    },
    {
      name: "Healthcare/helping student",
      answers: [2, 3, 2, 3, 2, 3, 5, 4, 3, 5, 4, 5, 4, 3, 2, 3, 4, 3, 2, 3, 2, 3, 4, 3, 2, 3, 4, 3, 3, 2],
      expectedTopics: ["people", "healthcare"]
    },
    {
      name: "Legal/Security student",
      answers: [2, 3, 2, 4, 5, 4, 3, 2, 3, 4, 5, 4, 3, 2, 3, 4, 3, 2, 4, 3, 2, 3, 4, 3, 2, 3, 4, 5, 3, 2],
      expectedTopics: ["legal", "analytical"]
    }
  ],
  NUORI: [
    {
      name: "High-salary focused",
      answers: [4, 3, 2, 5, 3, 2, 4, 3, 2, 5, 3, 2, 5, 4, 2, 3, 4, 2, 4, 3, 5, 2, 3, 4, 4, 5, 3, 2, 3, 4],
      expectedTopics: ["business", "financial"]
    },
    {
      name: "Work-life balance focused",
      answers: [3, 4, 3, 2, 3, 5, 3, 2, 3, 2, 4, 5, 3, 2, 5, 3, 3, 5, 4, 2, 3, 2, 3, 2, 5, 3, 5, 5, 2, 3],
      expectedTopics: ["balance", "stability"]
    },
    {
      name: "Creative/Media professional",
      answers: [3, 2, 5, 3, 2, 3, 4, 5, 4, 3, 4, 3, 2, 3, 4, 4, 5, 3, 2, 3, 2, 4, 3, 4, 4, 3, 4, 2, 3, 5],
      expectedTopics: ["creative", "media"]
    },
    {
      name: "International/Travel focused",
      answers: [4, 3, 3, 4, 3, 2, 4, 3, 4, 3, 3, 2, 3, 4, 3, 5, 3, 2, 3, 5, 2, 3, 4, 5, 3, 3, 4, 3, 2, 4],
      expectedTopics: ["global", "travel"]
    },
    {
      name: "Leadership/Management focused",
      answers: [3, 2, 3, 5, 4, 2, 3, 2, 3, 4, 3, 3, 5, 4, 2, 3, 4, 2, 4, 2, 5, 3, 3, 3, 4, 5, 3, 3, 4, 2],
      expectedTopics: ["leadership", "management"]
    }
  ]
};

console.log('🧪 CareerCompassi Cohort Testing Suite\n');
console.log('=' .repeat(60));

// Test each cohort
for (const [cohort, tests] of Object.entries(testCases)) {
  console.log(`\n\n🎯 Testing ${cohort} Cohort`);
  console.log('-'.repeat(60));

  tests.forEach((test, index) => {
    console.log(`\n  Test ${index + 1}: ${test.name}`);

    try {
      // Create answers object
      const answers = {};
      test.answers.forEach((value, qIndex) => {
        answers[qIndex] = value;
      });

      // Calculate score
      const result = calculateScore(answers, cohort);

      // Display results
      console.log(`    ✓ Test completed successfully`);
      console.log(`    📊 Top careers found: ${result.careers?.length || 0}`);

      if (result.careers && result.careers.length > 0) {
        console.log(`    🥇 Top 3 careers:`);
        result.careers.slice(0, 3).forEach((career, i) => {
          console.log(`       ${i + 1}. ${career.title} (${(career.matchScore * 100).toFixed(1)}%)`);
        });
      }

      // Check quality score
      if (result.qualityScore !== undefined) {
        const quality = result.qualityScore >= 0.7 ? '✅ Good' :
                       result.qualityScore >= 0.5 ? '⚠️ Moderate' :
                       '❌ Low';
        console.log(`    📈 Quality Score: ${(result.qualityScore * 100).toFixed(1)}% ${quality}`);
      }

      // Check dimensions
      if (result.dimensions) {
        console.log(`    🎨 Top dimensions:`);
        const sortedDims = Object.entries(result.dimensions)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 3);
        sortedDims.forEach(([dim, score]) => {
          console.log(`       - ${dim}: ${score.toFixed(2)}`);
        });
      }

    } catch (error) {
      console.log(`    ❌ Test failed: ${error.message}`);
      console.error(`    Error details:`, error);
    }
  });
}

console.log('\n\n' + '='.repeat(60));
console.log('✅ Testing complete!\n');
