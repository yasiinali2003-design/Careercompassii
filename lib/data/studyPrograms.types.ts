export type LangLevel = 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Ei vaatimusta';

export type OutlookStatus = 'kasvaa' | 'vakaa' | 'laskee' | 'vaihtelee' | 'supistuu';

export interface MoneyRange {
  median: number;
  range: [number, number];
  source: { name: string; url: string; year: number };
}

export interface Outlook {
  status: OutlookStatus;
  explanation: string;
  source: { name: string; url: string; year: number };
}

export interface StudyProgramHistory {
  year: number;
  minPoints: number | null;
  medianPoints?: number | null;
  maxPoints?: number | null;
  applicantCount?: number | null;
  notes?: string;
}

export interface StudyProgram {
  id: string;
  name: string;
  institution: string;
  institutionType: 'yliopisto' | 'amk';
  field: string;
  minPoints: number;
  maxPoints?: number;
  relatedCareers: string[];
  opintopolkuUrl?: string;
  description?: string;
  pointHistory?: StudyProgramHistory[];
  reach?: boolean;
  tags?: string[];
}
