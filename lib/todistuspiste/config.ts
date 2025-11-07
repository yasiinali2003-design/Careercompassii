export type GradeSymbol = 'L' | 'E' | 'M' | 'C' | 'B' | 'A' | 'I';

export interface SubjectVariant {
  key: string;
  label: string;
  coefficient: number;
  description?: string;
}

export interface SubjectDefinition {
  key: string;
  label: string;
  required: boolean;
  helperText?: string;
  coefficient?: number;
  variants?: SubjectVariant[];
  defaultVariantKey?: string;
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

export const SUBJECT_DEFINITIONS: SubjectDefinition[] = [
  {
    key: 'äidinkieli',
    label: 'Äidinkieli',
    required: true,
    coefficient: 1
  },
  {
    key: 'matematiikka',
    label: 'Matematiikka',
    required: true,
    helperText: 'Valitse suoritettu taso (pitkä tai lyhyt).',
    variants: [
      { key: 'pitka', label: 'Pitkä matematiikka', coefficient: 1.5, description: 'Ylioppilaskokeen pitkä matematiikka' },
      { key: 'lyhyt', label: 'Lyhyt matematiikka', coefficient: 1.0, description: 'Ylioppilaskokeen lyhyt matematiikka' }
    ],
    defaultVariantKey: 'pitka'
  },
  {
    key: 'englanti',
    label: 'Englanti',
    required: true,
    helperText: 'Valitse oletko suorittanut A- vai B-tason kielen.',
    variants: [
      { key: 'a', label: 'A-kieli', coefficient: 1.15 },
      { key: 'b', label: 'B-kieli', coefficient: 1.0 }
    ],
    defaultVariantKey: 'a'
  },
  {
    key: 'toinen-kotimainen',
    label: 'Toinen kotimainen kieli',
    required: false,
    helperText: 'Valitse taso (A- tai B-kieli).',
    variants: [
      { key: 'a', label: 'A-kieli', coefficient: 1.1 },
      { key: 'b', label: 'B-kieli', coefficient: 1.0 }
    ],
    defaultVariantKey: 'b'
  },
  {
    key: 'reaaliaineet',
    label: 'Reaaliaineet',
    required: false,
    helperText: 'Syötä vahvin reaaliaineesi (esim. historia, fysiikka, biologia).',
    coefficient: 1.0
  },
  {
    key: 'reaali-2',
    label: 'Toinen reaaliaine',
    required: false,
    coefficient: 1.0
  },
  {
    key: 'reaali-3',
    label: 'Kolmas reaaliaine',
    required: false,
    coefficient: 1.0
  },
  {
    key: 'muu-kieli',
    label: 'Muu vieras kieli',
    required: false,
    helperText: 'Valitse mahdollinen toinen vieras kieli (A/B).',
    variants: [
      { key: 'a', label: 'A-kieli', coefficient: 1.05 },
      { key: 'b', label: 'B-kieli', coefficient: 1.0 }
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

