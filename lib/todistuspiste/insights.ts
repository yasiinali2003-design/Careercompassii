import { SUBJECT_DEFINITIONS, SubjectDefinition, SubjectVariant, GradeSymbol } from './config';
import { SubjectInputs, calculateTodistuspisteet, getGradePoints, TodistuspisteResult } from '../todistuspiste';

const GRADE_ORDER: GradeSymbol[] = ['I', 'A', 'B', 'C', 'M', 'E', 'L'];

function getVariantLabel(subject: SubjectDefinition, variantKey?: string) {
  if (!subject.variants || subject.variants.length === 0) return subject.label;
  const variant = subject.variants.find(v => v.key === variantKey) || subject.variants.find(v => v.key === subject.defaultVariantKey) || subject.variants[0];
  return `${subject.label} (${variant.label})`;
}

function getNextGrade(grade: GradeSymbol): GradeSymbol | null {
  const index = GRADE_ORDER.indexOf(grade);
  if (index === -1 || index === GRADE_ORDER.length - 1) {
    return null;
  }
  return GRADE_ORDER[index + 1];
}

export function getImprovementSuggestions(inputs: SubjectInputs, result: TodistuspisteResult) {
  const suggestions: string[] = [];

  SUBJECT_DEFINITIONS.forEach(subject => {
    const input = inputs[subject.key];
    if (!input?.grade) return;

    const nextGrade = getNextGrade(input.grade);
    if (!nextGrade) return;

    const simulatedInputs: SubjectInputs = {
      ...inputs,
      [subject.key]: {
        ...input,
        grade: nextGrade
      }
    };

    const simulated = calculateTodistuspisteet(simulatedInputs, { scheme: result.scheme });
    const delta = simulated.totalPoints - result.totalPoints;

    if (delta <= 0) return;

    const subjectLabel = getVariantLabel(subject, input.variantKey);
    const formattedDelta = delta.toFixed(2).replace('.', ',');
    suggestions.push(`${subjectLabel}: Nostamalla arvosanan tasolta ${input.grade} → ${nextGrade} saisit noin +${formattedDelta} pistettä.`);
  });

  if (suggestions.length === 0) {
    suggestions.push('Olet jo erinomainen! Arvosanojen nostaminen tuo vain pieniä lisäpisteitä – keskity pitämään nykyinen tasosi.');
  }

  return suggestions.slice(0, 4);
}

