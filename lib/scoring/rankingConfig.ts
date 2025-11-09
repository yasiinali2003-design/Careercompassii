export type DemandWeights = Record<string, number>;

export const DEMAND_WEIGHTS: DemandWeights = {
  kasvaa: 3,
  vakaa: 2,
  vaihtelee: 1,
  supistuu: 0,
  laskee: 0
};

export const RANKING_WEIGHTS = {
  demandBoost: 45,
  similarTitlePenalty: 12,
  primaryDiversityLimit: 1,
  fallbackDiversityLimit: 2
};

const GENERIC_TITLE_SUFFIXES = ['asiantuntija', 'insinööri', 'suunnittelija', 'koordinaattori'];

export function getDemandWeight(status?: string): number {
  if (!status) return DEMAND_WEIGHTS.vakaa;
  return DEMAND_WEIGHTS[status] ?? DEMAND_WEIGHTS.vakaa;
}

export function getDiversityKey(title: string): string {
  const normalized = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z\-\säöå]/g, '')
    .replace(/[-\s]+/g, ' ')
    .trim();

  if (!normalized) {
    return 'unknown';
  }

  const parts = normalized.split(' ');
  let candidate = parts[parts.length - 1];

  if (GENERIC_TITLE_SUFFIXES.includes(candidate) && parts.length > 1) {
    candidate = candidate;
  } else {
    for (const suffix of GENERIC_TITLE_SUFFIXES) {
      if (candidate.endsWith(suffix)) {
        candidate = suffix;
        break;
      }
    }
  }

  return candidate;
}
