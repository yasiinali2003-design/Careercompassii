/**
 * SCORING SYSTEM - TYPE DEFINITIONS
 * Phase 1A: Question Mapping & Type System
 */

// ========== COHORT TYPES ==========

export type Cohort = 'YLA' | 'TASO2' | 'NUORI';

// ========== DIMENSION TYPES ==========

export type Dimension = 'interests' | 'values' | 'workstyle' | 'context';

export type SubDimension = 
  // Interests sub-dimensions
  | 'technology' | 'people' | 'creative' | 'analytical' | 'hands_on'
  | 'business' | 'environment' | 'health' | 'education' | 'innovation'
  | 'arts_culture' | 'sports' | 'nature' | 'writing'
  
  // Workstyle sub-dimensions
  | 'teamwork' | 'independence' | 'leadership' | 'organization'
  | 'planning' | 'problem_solving' | 'precision' | 'performance'
  | 'teaching' | 'motivation' | 'autonomy' | 'social' | 'structure'
  | 'flexibility' | 'variety'
  
  // Values sub-dimensions
  | 'growth' | 'impact' | 'global' | 'career_clarity' | 'financial'
  | 'entrepreneurship' | 'social_impact' | 'stability' | 'advancement'
  | 'work_life_balance' | 'company_size'
  
  // Context sub-dimensions
  | 'outdoor' | 'international' | 'work_environment';

// ========== QUESTION MAPPING TYPES ==========

export interface QuestionMapping {
  q: number;                  // Question index (0-29)
  text: string;               // Question text in Finnish
  dimension: Dimension;       // Primary dimension
  subdimension: SubDimension; // Specific aspect being measured
  weight: number;             // Importance weight (0.5 - 2.0)
  reverse: boolean;           // If true, high score = low dimension value
  notes?: string;             // Optional explanation
}

export interface CohortQuestionSet {
  YLA: QuestionMapping[];
  TASO2: QuestionMapping[];
  NUORI: QuestionMapping[];
}

// ========== ANSWER TYPES ==========

export interface TestAnswer {
  questionIndex: number;
  score: number; // 1-5 (Likert scale)
}

export interface NormalizedAnswer {
  questionIndex: number;
  normalizedScore: number; // 0-1
  dimension: Dimension;
  subdimension: SubDimension;
  weight: number;
}

// ========== SCORING RESULT TYPES ==========

export interface DimensionScores {
  interests: number;      // 0-1
  values: number;         // 0-1
  workstyle: number;      // 0-1
  context: number;        // 0-1
}

export interface DetailedDimensionScores {
  interests: Record<string, number>;  // Sub-dimension scores
  values: Record<string, number>;
  workstyle: Record<string, number>;
  context: Record<string, number>;
}

export interface UserProfile {
  cohort: Cohort;
  dimensionScores: DimensionScores;
  detailedScores?: DetailedDimensionScores;
  topStrengths: string[];           // Top 3 strongest areas
  profileType?: string;              // e.g., "Tech-savvy Innovator"
  summary?: string;                  // Brief personality summary
  personalizedAnalysis?: string;     // 2-3 paragraph personalized text
}

// ========== CAREER MATCHING TYPES ==========

export interface CareerVector {
  slug: string;
  title: string;
  category: string;
  
  // Dimension vectors (each subdimension has a score 0-1)
  interests: Record<SubDimension, number>;
  values: Record<SubDimension, number>;
  workstyle: Record<SubDimension, number>;
  context: Record<SubDimension, number>;
}

export interface CareerMatch {
  slug: string;
  title: string;
  category: string;
  overallScore: number;              // 0-100
  dimensionScores: {                 // Breakdown by dimension
    interests: number;
    values: number;
    workstyle: number;
    context: number;
  };
  reasons: string[];                 // 2-3 Finnish sentences explaining fit
  confidence: 'high' | 'medium' | 'low'; // Based on data quality
  salaryRange?: [number, number];
  outlook?: string;
}

// ========== WEIGHTING TYPES ==========

export interface ScoringWeights {
  interests: number;
  values: number;
  workstyle: number;
  context: number;
}

// Cohort-specific weights (younger = more interest-focused, older = more values-focused)
export const COHORT_WEIGHTS: Record<Cohort, ScoringWeights> = {
  YLA: {
    interests: 0.50,  // Younger students: focus on what excites them
    values: 0.15,     // Limited values data in questions
    workstyle: 0.25,  // How they like to work
    context: 0.10     // Limited context data
  },
  TASO2: {
    interests: 0.45,
    values: 0.20,
    workstyle: 0.25,
    context: 0.10
  },
  NUORI: {
    interests: 0.40,  // Young adults: more balanced
    values: 0.25,     // Career sustainability matters more
    workstyle: 0.25,
    context: 0.10
  }
};

// ========== API RESPONSE TYPES ==========

export interface ScoringAPIRequest {
  cohort: Cohort;
  answers: TestAnswer[];
}

export interface ScoringAPIResponse {
  success: boolean;
  userProfile: UserProfile;
  topCareers: CareerMatch[];
  cohortCopy: {
    title: string;
    subtitle: string;
    ctaText: string;
  };
  error?: string;
}

