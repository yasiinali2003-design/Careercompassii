// Career Catalog Types
export type Outlook = 'Kasvaa' | 'Vakaa';
export type WorkMode = 'Etä' | 'Paikan päällä' | 'Hybrid';

export interface Career {
  slug: string;
  title: string;
  summary: string;
  longDescription?: string;
  salaryMin?: number; // €/kk
  salaryMax?: number; // €/kk
  outlook?: Outlook;
  educationLevel: string[];  // ['AMK','Yliopisto','Oppisopimus','Lyhytkoulutus']
  industry: string[];        // ['Design','Teknologia','Hoiva','Rakentaminen',...]
  personalityType: string[]; // ['Luova','Johtaja','Rakentaja','Visionääri',...]
  workMode?: WorkMode;
  skillsHard?: string[];
  skillsSoft?: string[];
  dailyTasks?: string[];
  opintopolkuLinks?: { label: string; url: string }[];
  relatedSlugs?: string[];
}

export interface CareerFilters {
  search?: string;
  industry?: string[];
  educationLevel?: string[];
  personalityType?: string[];
  workMode?: string[];
  outlook?: string[];
  salaryMin?: number;
  salaryMax?: number;
}

export interface CareerCatalogProps {
  careers: Career[];
  initialFilters?: CareerFilters;
}
