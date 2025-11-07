/**
 * Study Programs API Client
 * Fetches study programs from API with fallback to static data
 */

import { StudyProgram, StudyProgramHistory } from '@/lib/data/studyPrograms';
import { studyPrograms as staticPrograms } from '@/lib/data/studyPrograms';

export interface StudyProgramsApiResponse {
  programs: StudyProgram[];
  total: number;
  limit: number;
  offset: number;
  hasMore?: boolean;
}

export interface StudyProgramsQuery {
  points?: number;
  type?: 'yliopisto' | 'amk';
  field?: string;
  careers?: string[];
  search?: string;
  limit?: number;
  offset?: number;
  sort?: 'match' | 'points-low' | 'points-high' | 'name';
  includeHistory?: boolean;
}

/**
 * Fetch study programs from API with fallback to static data
 */
export async function fetchStudyPrograms(
  query: StudyProgramsQuery = {}
): Promise<StudyProgramsApiResponse> {
  const {
    points,
    type,
    field,
    careers = [],
    search,
    limit = 50,
    offset = 0,
    sort = 'match',
    includeHistory = true
  } = query;

  try {
    // Build query parameters
    const params = new URLSearchParams();
    if (points !== undefined) params.set('points', points.toString());
    if (type) params.set('type', type);
    if (field && field !== 'all') params.set('field', field);
    if (careers.length > 0) params.set('careers', careers.join(','));
    if (search) params.set('search', search);
    params.set('limit', limit.toString());
    params.set('offset', offset.toString());
    params.set('sort', sort);
    if (includeHistory) params.set('history', 'true');

    // Try API first
    const response = await fetch(`/api/study-programs?${params.toString()}`);
    
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.warn('[StudyProgramsAPI] API request failed, using static data:', response.status);
      throw new Error('API request failed');
    }
  } catch (error) {
    // Fallback to static data
    console.log('[StudyProgramsAPI] Using static data fallback');
    return getStaticPrograms(query);
  }
}

/**
 * Get programs from static data (fallback)
 */
function getStaticPrograms(query: StudyProgramsQuery): StudyProgramsApiResponse {
  let filtered = [...staticPrograms];

  // Filter by type
  if (query.type) {
    filtered = filtered.filter(p => p.institutionType === query.type);
  }

  // Filter by field
  if (query.field && query.field !== 'all') {
    filtered = filtered.filter(p => p.field === query.field);
  }

  // Filter by points
  if (query.points !== undefined) {
    filtered = filtered.filter(p => {
      const min = p.minPoints;
      const max = p.maxPoints || min + 50;
      return query.points! >= min - 30 && query.points! <= max + 20;
    });
  }

  // Filter by careers
  if (query.careers && query.careers.length > 0) {
    filtered = filtered.filter(p =>
      p.relatedCareers.some(c => query.careers!.includes(c))
    );
  }

  // Search
  if (query.search) {
    const searchLower = query.search.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(searchLower) ||
      p.institution.toLowerCase().includes(searchLower) ||
      (p.description && p.description.toLowerCase().includes(searchLower))
    );
  }

  // Sort
  if (query.sort === 'points-low') {
    filtered.sort((a, b) => a.minPoints - b.minPoints);
  } else if (query.sort === 'points-high') {
    filtered.sort((a, b) => b.minPoints - a.minPoints);
  } else if (query.sort === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name, 'fi'));
  } else if (query.sort === 'match' && query.careers && query.careers.length > 0 && query.points !== undefined) {
    // Sort by match quality
    filtered.sort((a, b) => {
      const aMatches = a.relatedCareers.filter(c => query.careers!.includes(c)).length;
      const bMatches = b.relatedCareers.filter(c => query.careers!.includes(c)).length;
      if (bMatches !== aMatches) return bMatches - aMatches;
      const aDiff = Math.abs(query.points! - a.minPoints);
      const bDiff = Math.abs(query.points! - b.minPoints);
      return aDiff - bDiff;
    });
  }

  // Apply pagination
  const limit = query.limit || 50;
  const offset = query.offset || 0;
  const paginated = filtered.slice(offset, offset + limit);

  return {
    programs: paginated,
    total: filtered.length,
    limit,
    offset,
    hasMore: (offset + limit) < filtered.length
  };
}

/**
 * Get a single study program by ID
 */
export async function fetchStudyProgramById(id: string): Promise<StudyProgram | null> {
  try {
    const response = await fetch(`/api/study-programs?search=${encodeURIComponent(id)}&limit=1`);
    if (response.ok) {
      const data = await response.json();
      return data.programs.find((p: StudyProgram) => p.id === id) || null;
    }
  } catch (error) {
    console.warn('[StudyProgramsAPI] Error fetching program by ID, using static data');
  }

  // Fallback to static data
  return staticPrograms.find(p => p.id === id) || null;
}

