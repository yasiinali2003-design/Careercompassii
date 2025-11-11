export type GradeSymbol = 'L' | 'E' | 'M' | 'C' | 'B' | 'A' | 'I';

export type TodistuspisteScheme = 'yliopisto' | 'amk';

export const TODISTUSPISTE_SCHEMES: readonly TodistuspisteScheme[] = ['yliopisto', 'amk'] as const;

export const TODISTUSPISTE_SCHEME_SETTINGS: Record<
  TodistuspisteScheme,
  { maxSubjects?: number; bonusPolicy: 'standard' | 'none' }
> = {
  yliopisto: {
    maxSubjects: 5,
    bonusPolicy: 'none'
  },
  amk: {
    maxSubjects: 5,
    bonusPolicy: 'none'
  }
};

export type GradeWeights = Partial<Record<GradeSymbol, number>>;

export interface SubjectVariant {
  key: string;
  label: string;
  coefficient: number;
  description?: string;
  amkCoefficient?: number;
  amkGradeWeights?: GradeWeights;
  gradeWeights?: GradeWeights;
  schemeGroup?: Partial<Record<TodistuspisteScheme, string>>;
}

export interface SubjectChoice {
  id: string;
  label: string;
  description?: string;
}

export interface SubjectDefinition {
  key: string;
  label: string;
  required: boolean;
  helperText?: string;
  coefficient?: number;
  amkCoefficient?: number;
  amkGradeWeights?: GradeWeights;
  gradeWeights?: GradeWeights;
  schemeGroup?: Partial<Record<TodistuspisteScheme, string>>;
  variants?: SubjectVariant[];
  defaultVariantKey?: string;
  allowSubjectChoice?: boolean;
  subjectChoices?: SubjectChoice[];
}

export const GRADE_OPTIONS: { value: GradeSymbol; label: string }[] = [
  { value: 'L', label: 'L – Laudatur' },
  { value: 'E', label: 'E – Eximia' },
  { value: 'M', label: 'M – Magna' },
  { value: 'C', label: 'C – Cum laude' },
  { value: 'B', label: 'B – Lubenter' },
  { value: 'A', label: 'A – Approbatur' },
  { value: 'I', label: 'I – Improbatur' }
];

const GRADE_WEIGHT_TABLES = {
  motherTongue: {
    L: 46,
    E: 41,
    M: 34,
    C: 26,
    B: 18,
    A: 10
  } as GradeWeights,
  mathLong: {
    L: 46,
    E: 43,
    M: 40,
    C: 35,
    B: 27,
    A: 19
  } as GradeWeights,
  mathShort: {
    L: 40,
    E: 35,
    M: 27,
    C: 19,
    B: 13,
    A: 6
  } as GradeWeights,
  languageLong: {
    L: 46,
    E: 41,
    M: 34,
    C: 26,
    B: 18,
    A: 10
  } as GradeWeights,
  languageMedium: {
    L: 38,
    E: 34,
    M: 26,
    C: 18,
    B: 12,
    A: 5
  } as GradeWeights,
  languageShort: {
    L: 30,
    E: 27,
    M: 21,
    C: 15,
    B: 9,
    A: 3
  } as GradeWeights,
  reaali: {
    L: 30,
    E: 27,
    M: 21,
    C: 15,
    B: 9,
    A: 3
  } as GradeWeights
};

export const SUBJECT_DEFINITIONS: SubjectDefinition[] = [
  {
    key: 'äidinkieli',
    label: 'Äidinkieli',
    required: true,
    coefficient: 1,
    gradeWeights: GRADE_WEIGHT_TABLES.motherTongue,
    amkGradeWeights: GRADE_WEIGHT_TABLES.motherTongue,
    schemeGroup: {
      yliopisto: 'motherTongue',
      amk: 'motherTongue'
    }
  },
  {
    key: 'matematiikka',
    label: 'Matematiikka',
    required: true,
    helperText: 'Valitse suoritettu taso (pitkä tai lyhyt).',
    variants: [
      {
        key: 'pitka',
        label: 'Pitkä matematiikka',
        coefficient: 1.5,
        description: 'Ylioppilaskokeen pitkä matematiikka',
        gradeWeights: GRADE_WEIGHT_TABLES.mathLong,
        amkGradeWeights: GRADE_WEIGHT_TABLES.mathLong,
        schemeGroup: {
          yliopisto: 'mathematics',
          amk: 'mathematics'
        }
      },
      {
        key: 'lyhyt',
        label: 'Lyhyt matematiikka',
        coefficient: 1.0,
        description: 'Ylioppilaskokeen lyhyt matematiikka',
        gradeWeights: GRADE_WEIGHT_TABLES.mathShort,
        amkGradeWeights: GRADE_WEIGHT_TABLES.mathShort,
        schemeGroup: {
          yliopisto: 'mathematics',
          amk: 'mathematics'
        }
      }
    ],
    defaultVariantKey: 'pitka'
  },
  {
    key: 'englanti',
    label: 'Englanti',
    required: true,
    helperText: 'Valitse oletko suorittanut A- vai B-tason kielen.',
    variants: [
      {
        key: 'a',
        label: 'A-kieli',
        coefficient: 1.15,
        gradeWeights: GRADE_WEIGHT_TABLES.languageLong,
        amkGradeWeights: GRADE_WEIGHT_TABLES.languageLong,
        schemeGroup: {
          yliopisto: 'primaryLanguage',
          amk: 'primaryLanguage'
        }
      },
      {
        key: 'b',
        label: 'B-kieli',
        coefficient: 1.0,
        gradeWeights: GRADE_WEIGHT_TABLES.languageMedium,
        amkGradeWeights: GRADE_WEIGHT_TABLES.languageMedium,
        schemeGroup: {
          yliopisto: 'primaryLanguage',
          amk: 'primaryLanguage'
        }
      }
    ],
    defaultVariantKey: 'a'
  },
  {
    key: 'toinen-kotimainen',
    label: 'Toinen kotimainen kieli',
    required: false,
    helperText: 'Valitse taso (A- tai B-kieli).',
    variants: [
      {
        key: 'a',
        label: 'A-kieli',
        coefficient: 1.1,
        gradeWeights: GRADE_WEIGHT_TABLES.languageLong,
        amkGradeWeights: GRADE_WEIGHT_TABLES.languageLong,
        schemeGroup: {
          yliopisto: 'primaryLanguage',
          amk: 'primaryLanguage'
        }
      },
      {
        key: 'b',
        label: 'B-kieli',
        coefficient: 1.0,
        gradeWeights: GRADE_WEIGHT_TABLES.languageMedium,
        amkGradeWeights: GRADE_WEIGHT_TABLES.languageMedium,
        schemeGroup: {
          yliopisto: 'primaryLanguage',
          amk: 'primaryLanguage'
        }
      }
    ],
    defaultVariantKey: 'b'
  },
  {
    key: 'reaaliaineet',
    label: 'Reaaliaine',
    required: false,
    helperText: 'Valitse ensin reaaliaine ja anna arvosana.',
    coefficient: 1.0,
    gradeWeights: GRADE_WEIGHT_TABLES.reaali,
    amkGradeWeights: GRADE_WEIGHT_TABLES.reaali,
    schemeGroup: {
      yliopisto: 'extra',
      amk: 'extra'
    },
    allowSubjectChoice: true,
    subjectChoices: [
      { id: 'biologia', label: 'Biologia' },
      { id: 'maantiede', label: 'Maantiede' },
      { id: 'yhteiskuntaoppi', label: 'Yhteiskuntaoppi' },
      { id: 'historia', label: 'Historia' },
      { id: 'psykologia', label: 'Psykologia' },
      { id: 'filosofia', label: 'Filosofia' },
      { id: 'uskonto-et', label: 'Uskonto / ET' },
      { id: 'terveystieto', label: 'Terveystieto' },
      { id: 'kemia', label: 'Kemia' },
      { id: 'fysiikka', label: 'Fysiikka' }
    ]
  },
  {
    key: 'reaali-2',
    label: 'Toinen reaaliaine',
    required: false,
    coefficient: 1.0,
    gradeWeights: GRADE_WEIGHT_TABLES.reaali,
    amkGradeWeights: GRADE_WEIGHT_TABLES.reaali,
    schemeGroup: {
      yliopisto: 'extra',
      amk: 'extra'
    },
    allowSubjectChoice: true,
    subjectChoices: [
      { id: 'biologia', label: 'Biologia' },
      { id: 'maantiede', label: 'Maantiede' },
      { id: 'yhteiskuntaoppi', label: 'Yhteiskuntaoppi' },
      { id: 'historia', label: 'Historia' },
      { id: 'psykologia', label: 'Psykologia' },
      { id: 'filosofia', label: 'Filosofia' },
      { id: 'uskonto-et', label: 'Uskonto / ET' },
      { id: 'terveystieto', label: 'Terveystieto' },
      { id: 'kemia', label: 'Kemia' },
      { id: 'fysiikka', label: 'Fysiikka' }
    ]
  },
  {
    key: 'reaali-3',
    label: 'Kolmas reaaliaine',
    required: false,
    coefficient: 1.0,
    gradeWeights: GRADE_WEIGHT_TABLES.reaali,
    amkGradeWeights: GRADE_WEIGHT_TABLES.reaali,
    schemeGroup: {
      yliopisto: 'extra',
      amk: 'extra'
    },
    allowSubjectChoice: true,
    subjectChoices: [
      { id: 'biologia', label: 'Biologia' },
      { id: 'maantiede', label: 'Maantiede' },
      { id: 'yhteiskuntaoppi', label: 'Yhteiskuntaoppi' },
      { id: 'historia', label: 'Historia' },
      { id: 'psykologia', label: 'Psykologia' },
      { id: 'filosofia', label: 'Filosofia' },
      { id: 'uskonto-et', label: 'Uskonto / ET' },
      { id: 'terveystieto', label: 'Terveystieto' },
      { id: 'kemia', label: 'Kemia' },
      { id: 'fysiikka', label: 'Fysiikka' }
    ]
  },
  {
    key: 'muu-kieli',
    label: 'Muu vieras kieli',
    required: false,
    helperText: 'Valitse mahdollinen toinen vieras kieli (A/B).',
    variants: [
      {
        key: 'a',
        label: 'A-kieli',
        coefficient: 1.05,
        gradeWeights: GRADE_WEIGHT_TABLES.reaali,
        amkGradeWeights: GRADE_WEIGHT_TABLES.reaali,
        schemeGroup: {
          yliopisto: 'extra',
          amk: 'extra'
        }
      },
      {
        key: 'b',
        label: 'B-kieli',
        coefficient: 1.0,
        gradeWeights: GRADE_WEIGHT_TABLES.reaali,
        amkGradeWeights: GRADE_WEIGHT_TABLES.reaali,
        schemeGroup: {
          yliopisto: 'extra',
          amk: 'extra'
        }
      }
    ],
    defaultVariantKey: 'b'
  }
];

export const SUBJECT_DEFINITION_MAP: Record<string, SubjectDefinition> = SUBJECT_DEFINITIONS.reduce(
  (acc, subject) => {
    acc[subject.key] = subject;
    return acc;
  },
  {} as Record<string, SubjectDefinition>
);
