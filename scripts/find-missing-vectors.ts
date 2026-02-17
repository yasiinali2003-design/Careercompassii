import { careersData } from '../data/careers-fi';
import { CAREER_VECTORS } from '../lib/scoring/careerVectors';

const careerIds = new Set(careersData.map(c => c.id));
const vectorIds = new Set(CAREER_VECTORS.map(v => v.slug));

const missingVectors = careersData.filter(c => !vectorIds.has(c.id));
console.log(`Careers missing vectors (${missingVectors.length}):`);
missingVectors.forEach(c => {
  console.log(`  - ${c.id} | ${c.title_fi} | ${c.category}`);
});
