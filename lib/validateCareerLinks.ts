/**
 * Validate career links and ensure they work correctly
 */

import { careersData } from '../data/careers-fi';

/**
 * Get all valid career slugs
 */
export function getAllValidCareerSlugs(): Set<string> {
  return new Set(careersData.map(career => career.id));
}

/**
 * Validate related careers for a specific career
 */
export function validateRelatedCareers(careerId: string): {
  valid: string[];
  invalid: string[];
} {
  const career = careersData.find(c => c.id === careerId);
  if (!career || !career.related_careers) {
    return { valid: [], invalid: [] };
  }

  const validSlugs = getAllValidCareerSlugs();
  const valid: string[] = [];
  const invalid: string[] = [];

  career.related_careers.forEach(slug => {
    if (validSlugs.has(slug)) {
      valid.push(slug);
    } else {
      invalid.push(slug);
    }
  });

  return { valid, invalid };
}

/**
 * Get related careers with validation
 */
export function getValidatedRelatedCareers(careerId: string): string[] {
  const { valid } = validateRelatedCareers(careerId);
  return valid;
}

/**
 * Validate all careers and return report
 */
export function validateAllCareerLinks(): {
  total: number;
  withRelated: number;
  invalidLinks: Array<{ careerId: string; invalidSlugs: string[] }>;
} {
  const validSlugs = getAllValidCareerSlugs();
  const invalidLinks: Array<{ careerId: string; invalidSlugs: string[] }> = [];

  careersData.forEach(career => {
    if (career.related_careers && career.related_careers.length > 0) {
      const invalid = career.related_careers.filter(
        slug => !validSlugs.has(slug)
      );
      
      if (invalid.length > 0) {
        invalidLinks.push({
          careerId: career.id,
          invalidSlugs: invalid
        });
      }
    }
  });

  return {
    total: careersData.length,
    withRelated: careersData.filter(c => c.related_careers && c.related_careers.length > 0).length,
    invalidLinks
  };
}

/**
 * Get career by slug with validation
 */
export function getCareerBySlug(slug: string) {
  return careersData.find(c => c.id === slug);
}

/**
 * Check if career slug exists
 */
export function careerSlugExists(slug: string): boolean {
  return getAllValidCareerSlugs().has(slug);
}

