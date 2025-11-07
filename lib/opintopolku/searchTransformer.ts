/**
 * Opintopolku Search Endpoint Transformer
 * Transforms data from the search endpoint (konfo-backend/search/koulutukset)
 * to our StudyProgram format
 */

import { StudyProgram } from '@/lib/data/studyPrograms';

export interface OpintopolkuSearchResult {
  oid: string;
  nimi: {
    fi?: string;
    sv?: string;
    en?: string;
  };
  koulutustyyppi: string;
  koulutusala?: {
    koodiUri?: string;
    nimi?: {
      fi?: string;
    };
  };
  toteutustenTarjoajat?: {
    nimi?: {
      fi?: string;
      sv?: string;
      en?: string;
    };
    count?: number;
  };
  kuvaus?: {
    fi?: string;
  };
  koulutukset?: any[];
  tutkintonimikkeet?: Array<{
    nimi?: {
      fi?: string;
    };
  }>;
}

/**
 * Map koulutustyyppi to our institution type
 * Search endpoint returns simplified types: "amk", "yo", etc.
 */
function mapInstitutionTypeFromKoulutustyyppi(koulutustyyppi: string): 'yliopisto' | 'amk' | null {
  const tyyppi = koulutustyyppi.toLowerCase();
  
  // Direct matches from search endpoint
  if (tyyppi === 'amk' || tyyppi === 'amk-ylempi' || tyyppi === 'amk-alempi') {
    return 'amk';
  }
  
  if (tyyppi === 'yo' || tyyppi === 'yo-kandi' || tyyppi === 'yo-maisteri' ||
      tyyppi === 'yo-kandi-ja-maisteri' || tyyppi === 'tohtori' ||
      tyyppi.includes('kandi') || tyyppi.includes('maisteri')) {
    return 'yliopisto';
  }
  
  // Skip open courses and other types
  if (tyyppi.includes('kk-opintojakso') || tyyppi.includes('avoin') ||
      tyyppi === 'muu' || tyyppi.includes('jotpa')) {
    return null;
  }
  
  // Default: try to infer from program name or return null
  return null;
}

/**
 * Map field based on program name and koulutusala
 */
function mapFieldFromSearchResult(result: OpintopolkuSearchResult): string {
  const name = (result.nimi?.fi || '').toLowerCase();
  const ala = (result.koulutusala?.nimi?.fi || '').toLowerCase();
  
  // Technology
  if (name.includes('tietotekniikka') || name.includes('tietojenkäsittely') ||
      name.includes('ohjelmisto') || name.includes('tietoturva') ||
      name.includes('tekoäly') || name.includes('data') ||
      ala.includes('tietojenkäsittely') || ala.includes('tietotekniikka')) {
    return 'teknologia';
  }
  
  // Healthcare
  if (name.includes('lääketiede') || name.includes('sairaanhoitaja') ||
      name.includes('terveys') || name.includes('hoitaja') ||
      ala.includes('terveys') || ala.includes('lääketiede')) {
    return 'terveys';
  }
  
  // Business
  if (name.includes('kauppa') || name.includes('liiketalous') ||
      name.includes('talous') || name.includes('markkinointi') ||
      ala.includes('kauppa') || ala.includes('liiketalous')) {
    return 'kauppa';
  }
  
  // Engineering
  if (name.includes('tekniikka') || name.includes('insinööri') ||
      name.includes('konetekniikka') || name.includes('rakennustekniikka') ||
      ala.includes('tekniikka') || ala.includes('engineering')) {
    return 'tekniikka';
  }
  
  // Education
  if (name.includes('opettaja') || name.includes('kasvatus') ||
      name.includes('pedagogi') || ala.includes('kasvatus')) {
    return 'kasvatus';
  }
  
  // Law
  if (name.includes('oikeus') || name.includes('juristi') ||
      name.includes('asianajaja') || ala.includes('oikeus')) {
    return 'oikeus';
  }
  
  // Psychology
  if (name.includes('psykologia') || name.includes('psykologi') ||
      ala.includes('psykologia')) {
    return 'psykologia';
  }
  
  // Social sciences
  if (name.includes('sosiaali') || name.includes('yhteiskunta') ||
      ala.includes('sosiaali') || ala.includes('yhteiskunta')) {
    return 'yhteiskunta';
  }
  
  // Media
  if (name.includes('media') || name.includes('journalismi') ||
      name.includes('viestintä') || ala.includes('media')) {
    return 'media';
  }
  
  // Natural sciences
  if (name.includes('biologia') || name.includes('kemia') ||
      name.includes('fysiikka') || name.includes('luonnontiede') ||
      ala.includes('luonnontiede')) {
    return 'luonnontiede';
  }
  
  return 'muu';
}

/**
 * Generate ID from program OID (unique identifier)
 * Falls back to name+institution if OID not available
 */
function generateIdFromSearchResult(result: OpintopolkuSearchResult): string {
  // Use OID as primary ID (it's unique)
  if (result.oid) {
    // Convert OID to a safe slug format
    return `op-${result.oid.replace(/[^0-9]/g, '')}`;
  }
  
  // Fallback to name+institution if no OID
  const name = result.nimi?.fi || 'unknown';
  const institution = result.toteutustenTarjoajat?.nimi?.fi || 'unknown';
  
  const nameSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
  
  const institutionSlug = institution
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 30);
  
  return `${nameSlug}-${institutionSlug}`.substring(0, 100);
}

/**
 * Estimate admission points based on field and institution type
 * Uses averages from existing 82 programs as reference
 */
function estimateAdmissionPoints(
  field: string,
  institutionType: 'yliopisto' | 'amk',
  programName: string
): { minPoints: number; maxPoints?: number } {
  const name = programName.toLowerCase();
  
  // Field-based averages (from existing 82 programs)
  const fieldAverages: Record<string, { yliopisto: number; amk: number }> = {
    teknologia: { yliopisto: 85, amk: 45 },
    terveys: { yliopisto: 185, amk: 55 },
    kauppa: { yliopisto: 115, amk: 50 },
    tekniikka: { yliopisto: 80, amk: 42 },
    kasvatus: { yliopisto: 70, amk: 40 },
    oikeus: { yliopisto: 140, amk: 50 },
    psykologia: { yliopisto: 120, amk: 50 },
    yhteiskunta: { yliopisto: 90, amk: 45 },
    media: { yliopisto: 100, amk: 45 },
    luonnontiede: { yliopisto: 95, amk: 45 },
    muu: { yliopisto: 90, amk: 45 }
  };
  
  // Base points from field average
  const basePoints = fieldAverages[field]?.[institutionType] || 90;
  
  // Adjustments based on program name keywords
  let adjustment = 0;
  
  // High-demand programs (add points)
  if (name.includes('lääketiede') || name.includes('lääkäri')) {
    adjustment = institutionType === 'yliopisto' ? 5 : 0;
  } else if (name.includes('tietotekniikka') || name.includes('tietojenkäsittely')) {
    adjustment = institutionType === 'yliopisto' ? 10 : 5;
  } else if (name.includes('kauppatiede') || name.includes('kandidaatti')) {
    adjustment = institutionType === 'yliopisto' ? 5 : 0;
  }
  
  // Popular universities (add points)
  const institution = (name.match(/(helsingin|aalto|tampereen|oulun|jyväskylän|turun)/i) || [])[0];
  if (institution && institutionType === 'yliopisto') {
    adjustment += 5;
  }
  
  const minPoints = Math.max(20, Math.min(200, basePoints + adjustment));
  const maxPoints = minPoints + (institutionType === 'yliopisto' ? 25 : 30);
  
  return { minPoints, maxPoints };
}

/**
 * Match careers to program based on field and name
 */
function matchCareersToProgram(
  program: StudyProgram,
  allCareers: Array<{ slug: string; field?: string; name: string }>
): string[] {
  const matchedCareers: string[] = [];
  const programField = program.field;
  const programName = program.name.toLowerCase();
  
  // Field-based matching
  const fieldMap: Record<string, string[]> = {
    teknologia: ['ohjelmistokehittaja', 'tietoturva-asiantuntija', 'tekoalyasiantuntija', 'tietojarjestelma-arkkitehti', 'verkkosuunnittelija'],
    terveys: ['laakari', 'sairaanhoitaja', 'terveydenhoitaja', 'erikoislaakari'],
    kauppa: ['kauppatieteilija', 'markkinoinnin-johtaja', 'yritysjohtaja'],
    tekniikka: ['insinoori', 'konetekniikan-insinoori', 'rakennusinsinoori'],
    kasvatus: ['opettaja', 'varhaiskasvatuksen-opettaja'],
    oikeus: ['asianajaja', 'juristi'],
    psykologia: ['psykologi', 'koulupsykologi'],
    yhteiskunta: ['sosiaalityontekija', 'sosiaaliohjaja'],
    media: ['journalisti', 'mediasuunnittelija'],
    luonnontiede: ['biologi', 'kemisti', 'fysiikko']
  };
  
  if (fieldMap[programField]) {
    matchedCareers.push(...fieldMap[programField]);
  }
  
  // Name-based matching
  const nameKeywords: Record<string, string[]> = {
    'tietotekniikka': ['ohjelmistokehittaja', 'tietoturva-asiantuntija', 'tekoalyasiantuntija'],
    'lääketiede': ['laakari', 'erikoislaakari'],
    'sairaanhoitaja': ['sairaanhoitaja', 'terveydenhoitaja'],
    'kauppatiede': ['kauppatieteilija', 'markkinoinnin-johtaja'],
    'opettaja': ['opettaja'],
    'oikeustiede': ['asianajaja', 'juristi'],
    'psykologia': ['psykologi', 'koulupsykologi']
  };
  
  for (const [keyword, careers] of Object.entries(nameKeywords)) {
    if (programName.includes(keyword)) {
      matchedCareers.push(...careers);
    }
  }
  
  // Remove duplicates
  return Array.from(new Set(matchedCareers));
}

/**
 * Transform search endpoint result to StudyProgram
 */
export function transformSearchResult(
  result: OpintopolkuSearchResult,
  allCareers?: Array<{ slug: string; field?: string; name: string }>
): StudyProgram | null {
  try {
    const name = result.nimi?.fi?.trim();
    if (!name) {
      return null;
    }
    
    // Skip if not yliopisto or AMK
    const institutionType = mapInstitutionTypeFromKoulutustyyppi(result.koulutustyyppi);
    if (!institutionType) {
      return null;
    }
    
    const institution = result.toteutustenTarjoajat?.nimi?.fi || 'Tuntematon oppilaitos';
    const field = mapFieldFromSearchResult(result);
    
    // Estimate admission points
    const { minPoints, maxPoints } = estimateAdmissionPoints(field, institutionType, name);
    
    const program: StudyProgram = {
      id: generateIdFromSearchResult(result),
      name,
      institution,
      institutionType,
      field,
      minPoints,
      maxPoints,
      relatedCareers: [],
      opintopolkuUrl: `https://opintopolku.fi/koulutus/${result.oid}`,
      description: result.kuvaus?.fi
        ?.replace(/<[^>]*>/g, ' ')
        ?.replace(/\s+/g, ' ')
        ?.trim()
        ?.slice(0, 2000) || undefined
    };
    
    // Match careers if provided
    if (allCareers) {
      program.relatedCareers = matchCareersToProgram(program, allCareers);
    }
    
    return program;
  } catch (error) {
    console.error('Error transforming search result:', error);
    return null;
  }
}

/**
 * Transform multiple search results
 */
export function transformSearchResults(
  results: OpintopolkuSearchResult[],
  allCareers?: Array<{ slug: string; field?: string; name: string }>
): StudyProgram[] {
  return results
    .map(result => transformSearchResult(result, allCareers))
    .filter((program): program is StudyProgram => program !== null);
}

