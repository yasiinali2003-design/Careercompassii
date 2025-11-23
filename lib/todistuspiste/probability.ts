/**
 * Probability and admission chance calculations
 */

export interface ProbabilityIndicator {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
  percentage: number;
  description: string;
}

/**
 * Calculate admission probability based on user points vs program threshold
 */
export function getProbabilityIndicator(
  userPoints: number,
  programMinPoints: number,
  programMedianPoints?: number | null
): ProbabilityIndicator {
  const gap = userPoints - programMinPoints;
  const medianGap = programMedianPoints ? userPoints - programMedianPoints : null;

  // Exceptional - well above median
  if (medianGap !== null && medianGap >= 10) {
    return {
      label: 'Erittäin todennäköinen',
      color: 'text-green-700',
      bgColor: 'bg-green-100 border-green-300',
      icon: '🎯',
      percentage: 95,
      description: 'Pisteesi ovat selvästi mediaanin yläpuolella. Pääset todennäköisesti sisään.'
    };
  }

  // Very likely - significantly above minimum
  if (gap >= 15) {
    return {
      label: 'Erittäin hyvä mahdollisuus',
      color: 'text-green-600',
      bgColor: 'bg-green-50 border-green-200',
      icon: '✅',
      percentage: 90,
      description: 'Pisteesi ovat hyvin pisterajan yläpuolella. Hyvin vahva hakija.'
    };
  }

  // Likely - comfortably above minimum
  if (gap >= 5) {
    return {
      label: 'Hyvä mahdollisuus',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200',
      icon: '✓',
      percentage: 75,
      description: 'Pisteesi ovat turvallisesti pisterajan yläpuolella.'
    };
  }

  // Possible - just above minimum
  if (gap >= 0) {
    return {
      label: 'Mahdollinen',
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-50 border-yellow-300',
      icon: '⚡',
      percentage: 55,
      description: 'Pisteesi ovat pisterajan tuntumassa. Kannattaa hakea, mutta valmistaudu kilpailuun.'
    };
  }

  // Reach - slightly below
  if (gap >= -5) {
    return {
      label: 'Tavoitteellinen',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 border-orange-200',
      icon: '🎲',
      percentage: 35,
      description: 'Pisteesi ovat hieman pisterajan alapuolella. Voit parantaa mahdollisuuksia nostamalla arvosanoja.'
    };
  }

  // Unlikely - significantly below
  if (gap >= -15) {
    return {
      label: 'Haastava',
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200',
      icon: '⚠️',
      percentage: 15,
      description: 'Pisteesi ovat selvästi pisterajan alapuolella. Suosittelemme vaihtoehtoisempia ohjelmia.'
    };
  }

  // Very unlikely
  return {
    label: 'Erittäin haastava',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50 border-gray-300',
    icon: '📊',
    percentage: 5,
    description: 'Pisteesi ovat huomattavasti pisterajan alapuolella. Harkitse vaihtoehtoisia polkuja.'
  };
}

/**
 * Get historical trend direction
 */
export interface TrendIndicator {
  direction: 'up' | 'down' | 'stable';
  change: number;
  label: string;
  icon: string;
  color: string;
}

export function getTrendIndicator(
  pointHistory: Array<{ year: string; minPoints: number }>
): TrendIndicator | null {
  if (!pointHistory || pointHistory.length < 2) {
    return null;
  }

  // Sort by year descending
  const sorted = [...pointHistory].sort((a, b) => b.year.localeCompare(a.year));
  const latest = sorted[0].minPoints;
  const previous = sorted[1].minPoints;
  const change = latest - previous;

  if (Math.abs(change) < 2) {
    return {
      direction: 'stable',
      change: 0,
      label: 'Vakaa',
      icon: '→',
      color: 'text-gray-600'
    };
  }

  if (change > 0) {
    return {
      direction: 'up',
      change,
      label: 'Vaikeutui',
      icon: '↗',
      color: 'text-red-600'
    };
  }

  return {
    direction: 'down',
    change: Math.abs(change),
    label: 'Helpottui',
    icon: '↘',
    color: 'text-green-600'
  };
}
