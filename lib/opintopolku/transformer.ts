/**
 * Opintopolku Data Transformer
 * Converts Opintopolku API data to our StudyProgram format
 */

import { OpintopolkuStudyProgram, OpintopolkuAdmissionInfo } from './api';
import { StudyProgram } from '@/lib/data/studyPrograms';

/**
 * Map Opintopolku institution type to our format
 */
function mapInstitutionType(koodiUri: string, organisaatiotyyppi?: string): 'yliopisto' | 'amk' {
  const uri = koodiUri.toLowerCase();
  const orgType = organisaatiotyyppi?.toLowerCase() || '';
  
  // Check for university indicators
  if (uri.includes('yliopisto') || uri.includes('university') || 
      orgType.includes('yliopisto') || orgType.includes('university')) {
    return 'yliopisto';
  }
  
  // Check for AMK indicators
  if (uri.includes('amk') || uri.includes('ammattikorkeakoulu') || 
      uri.includes('university of applied sciences') ||
      orgType.includes('amk') || orgType.includes('ammattikorkeakoulu')) {
    return 'amk';
  }
  
  // Default to yliopisto if unclear (most TASO2 users are interested in universities)
  return 'yliopisto';
}

/**
 * Map Opintopolku field to our field categories
 */
function mapField(koulutusala: string, koulutustyyppi?: string): string {
  const ala = koulutusala.toLowerCase();
  const tyyppi = koulutustyyppi?.toLowerCase() || '';
  
  // Technology
  if (ala.includes('tietojenkäsittely') || ala.includes('tietotekniikka') || 
      ala.includes('computer') || ala.includes('information')) {
    return 'teknologia';
  }
  
  // Healthcare
  if (ala.includes('terveys') || ala.includes('lääketiede') || 
      ala.includes('health') || ala.includes('medicine') ||
      tyyppi.includes('sairaanhoitaja') || tyyppi.includes('laakari')) {
    return 'terveys';
  }
  
  // Business
  if (ala.includes('kauppa') || ala.includes('liiketalous') || 
      ala.includes('business') || ala.includes('economics')) {
    return 'kauppa';
  }
  
  // Engineering
  if (ala.includes('tekniikka') || ala.includes('engineering') ||
      tyyppi.includes('konetekniikka') || tyyppi.includes('rakennustekniikka')) {
    return 'tekniikka';
  }
  
  // Education
  if (ala.includes('kasvatus') || ala.includes('opettaja') || 
      ala.includes('education') || ala.includes('pedagogy')) {
    return 'kasvatus';
  }
  
  // Law
  if (ala.includes('oikeus') || ala.includes('law') || ala.includes('jurid')) {
    return 'oikeus';
  }
  
  // Psychology
  if (ala.includes('psykologia') || ala.includes('psychology')) {
    return 'psykologia';
  }
  
  // Social sciences
  if (ala.includes('yhteiskunta') || ala.includes('sosiaali') || 
      ala.includes('social') || ala.includes('society')) {
    return 'yhteiskunta';
  }
  
  // Media
  if (ala.includes('media') || ala.includes('viestintä') || 
      ala.includes('journalism') || ala.includes('communication')) {
    return 'media';
  }
  
  // Natural sciences
  if (ala.includes('luonnontiede') || ala.includes('natural') || 
      ala.includes('biologia') || ala.includes('chemistry') || ala.includes('fysiikka')) {
    return 'luonnontiede';
  }
  
  // Default
  return 'muu';
}

/**
 * Generate ID from program name and institution
 */
function generateId(name: string, institution: string): string {
  const nameSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  const institutionSlug = institution
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  return `${nameSlug}-${institutionSlug}`;
}

/**
 * Match careers to study programs based on field and name
 */
function matchCareersToProgram(
  program: StudyProgram,
  allCareers: Array<{ slug: string; field?: string; name: string }>
): string[] {
  const matchedCareers: string[] = [];
  const programField = program.field;
  const programName = program.name.toLowerCase();
  
  // Match by field
  const fieldMatches = allCareers.filter(career => {
    if (!career.field) return false;
    const careerField = career.field.toLowerCase();
    
    // Direct field match
    if (careerField === programField) return true;
    
    // Related field matches
    const fieldMap: Record<string, string[]> = {
      'teknologia': ['ohjelmistokehittaja', 'tietoturva-asiantuntija', 'tekoalyasiantuntija', 'tietojarjestelma-arkkitehti', 'verkkosuunnittelija'],
      'terveys': ['laakari', 'sairaanhoitaja', 'terveydenhoitaja', 'erikoislaakari'],
      'kauppa': ['kauppatieteilija', 'markkinoinnin-johtaja', 'yritysjohtaja'],
      'tekniikka': ['insinoori', 'konetekniikan-insinoori', 'rakennusinsinoori'],
      'kasvatus': ['opettaja', 'varhaiskasvatuksen-opettaja'],
      'oikeus': ['asianajaja', 'juristi'],
      'psykologia': ['psykologi', 'koulupsykologi'],
      'yhteiskunta': ['sosiaalityontekija', 'sosiaaliohjaja'],
      'media': ['journalisti', 'mediasuunnittelija'],
      'luonnontiede': ['biologi', 'kemisti', 'fysiikko']
    };
    
    return fieldMap[programField]?.includes(career.slug) || false;
  });
  
  matchedCareers.push(...fieldMatches.map(c => c.slug));
  
  // Match by program name keywords
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
 * Transform Opintopolku program to our StudyProgram format
 */
export function transformOpintopolkuProgram(
  opProgram: OpintopolkuStudyProgram,
  admissionInfo?: OpintopolkuAdmissionInfo,
  allCareers?: Array<{ slug: string; field?: string; name: string }>
): StudyProgram | null {
  try {
    const name = opProgram.nimi?.fi || '';
    const institution = admissionInfo?.organisaatio?.nimi?.fi || 'Tuntematon oppilaitos';
    
    if (!name) {
      return null; // Skip programs without names
    }
    
    const institutionType = mapInstitutionType(
      opProgram.koulutustyyppi?.koodiUri || '',
      admissionInfo?.organisaatio?.organisaatiotyyppi?.koodiUri
    );
    
    const field = mapField(
      opProgram.koulutusala?.nimi?.fi || '',
      opProgram.koulutustyyppi?.nimi?.fi
    );
    
    // Extract admission points
    let minPoints: number | undefined;
    let maxPoints: number | undefined;
    
    if (admissionInfo) {
      // Try todistusvalinta points first
      if (admissionInfo.todistusvalinta) {
        minPoints = admissionInfo.todistusvalinta.minimipisteet;
        maxPoints = admissionInfo.todistusvalinta.maksimipisteet;
      }
      
      // Fallback to valintatapajono
      if (!minPoints && admissionInfo.valintatapajono) {
        const jono = admissionInfo.valintatapajono.find(j => 
          j.minimipisteet !== undefined
        );
        if (jono) {
          minPoints = jono.minimipisteet;
          maxPoints = jono.maksimipisteet;
        }
      }
    }
    
    // Skip if no points available (we need points for filtering)
    if (minPoints === undefined) {
      return null;
    }
    
    const program: StudyProgram = {
      id: generateId(name, institution),
      name,
      institution,
      institutionType,
      field,
      minPoints,
      maxPoints,
      relatedCareers: [],
      opintopolkuUrl: opProgram.metadata?.linkki || `https://opintopolku.fi/koulutus/${opProgram.id}`,
      description: opProgram.metadata?.kuvaus?.fi || undefined
    };
    
    // Match careers if provided
    if (allCareers) {
      program.relatedCareers = matchCareersToProgram(program, allCareers);
    }
    
    return program;
  } catch (error) {
    console.error('Error transforming program:', error);
    return null;
  }
}

/**
 * Load careers for matching (from our careers database)
 */
export async function loadCareersForMatching(): Promise<Array<{ slug: string; field?: string; name: string }>> {
  try {
    // Import careers from the careers data file
    const { careersData } = await import('@/data/careers-fi');
    
    if (!careersData || !Array.isArray(careersData)) {
      console.warn('Could not load careers - will match without career data');
      return [];
    }
    
    return careersData
      .filter((career: any) => career && career.id) // Filter out invalid entries
      .map((career: any) => ({
        slug: career.id || '',
        field: career.category || '',
        name: career.title || career.name || ''
      }));
  } catch (error) {
    console.warn('Could not load careers for matching:', error);
    return [];
  }
}

