#!/usr/bin/env node

const fs = require('fs');

// Read and parse the careerVectors file
const content = fs.readFileSync('./lib/scoring/careerVectors.ts', 'utf8');
const match = content.match(/export const CAREER_VECTORS[^=]*=\s*(\[[\s\S]*?\]);/);

if (!match) {
  console.log('Could not parse CAREER_VECTORS');
  process.exit(1);
}

const careerVectors = eval(match[1]);
const visionaariCareers = careerVectors.filter(c => c.category === 'visionaari');

console.log('🔍 VISIONAARI CAREER AUDIT');
console.log('='.repeat(80));
console.log(`Total visionaari careers: ${visionaariCareers.length}\n`);

const missingBoth = [];
const hasBusiness = [];
const hasLeadership = [];
const hasBoth = [];

visionaariCareers.forEach(career => {
  const businessScore = career.interests?.business || 0;
  const leadershipScore = career.workstyle?.leadership || 0;

  if (businessScore > 0 && leadershipScore > 0) {
    hasBoth.push({
      title: career.title,
      slug: career.slug,
      business: businessScore,
      leadership: leadershipScore
    });
  } else if (businessScore > 0) {
    hasBusiness.push({
      title: career.title,
      slug: career.slug,
      business: businessScore,
      leadership: leadershipScore
    });
  } else if (leadershipScore > 0) {
    hasLeadership.push({
      title: career.title,
      slug: career.slug,
      business: businessScore,
      leadership: leadershipScore
    });
  } else {
    missingBoth.push({
      title: career.title,
      slug: career.slug,
      business: businessScore,
      leadership: leadershipScore
    });
  }
});

console.log('✅ CAREERS WITH BOTH business AND leadership:', hasBoth.length);
hasBoth.slice(0, 5).forEach(c => {
  console.log(`   ✓ ${c.title.padEnd(50)} business=${c.business.toFixed(2)} leadership=${c.leadership.toFixed(2)}`);
});
if (hasBoth.length > 5) console.log(`   ... and ${hasBoth.length - 5} more`);

console.log('\n✅ CAREERS WITH business ONLY:', hasBusiness.length);
hasBusiness.slice(0, 5).forEach(c => {
  console.log(`   ✓ ${c.title.padEnd(50)} business=${c.business.toFixed(2)}`);
});
if (hasBusiness.length > 5) console.log(`   ... and ${hasBusiness.length - 5} more`);

console.log('\n✅ CAREERS WITH leadership ONLY:', hasLeadership.length);
hasLeadership.slice(0, 5).forEach(c => {
  console.log(`   ✓ ${c.title.padEnd(50)} leadership=${c.leadership.toFixed(2)}`);
});
if (hasLeadership.length > 5) console.log(`   ... and ${hasLeadership.length - 5} more`);

console.log('\n❌ CAREERS MISSING BOTH business AND leadership:', missingBoth.length);
missingBoth.forEach(c => {
  console.log(`   ✗ ${c.title.padEnd(50)} ← NEEDS business OR leadership`);
});

console.log('\n' + '='.repeat(80));
console.log('📊 SUMMARY:');
console.log(`   Total visionaari careers: ${visionaariCareers.length}`);
console.log(`   ✅ Has business AND leadership: ${hasBoth.length}`);
console.log(`   ✅ Has business only: ${hasBusiness.length}`);
console.log(`   ✅ Has leadership only: ${hasLeadership.length}`);
console.log(`   ❌ Missing both: ${missingBoth.length}`);
console.log('='.repeat(80));

console.log('\n💡 PHASE 4 ACTION:');
console.log(`   Review ${missingBoth.length} careers and add business OR leadership subdimension`);
console.log('   Guidelines:');
console.log('   - Strategic/consulting roles → leadership=0.8-1.0');
console.log('   - Entrepreneurial/business roles → business=0.8-1.0');
console.log('   - Research/academic roles → May need reclassification\n');
