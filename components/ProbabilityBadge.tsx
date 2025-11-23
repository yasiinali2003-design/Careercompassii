import { getProbabilityIndicator, ProbabilityIndicator } from '@/lib/todistuspiste/probability';

interface ProbabilityBadgeProps {
  userPoints: number;
  programMinPoints: number;
  programMedianPoints?: number | null;
}

export function ProbabilityBadge({ userPoints, programMinPoints, programMedianPoints }: ProbabilityBadgeProps) {
  const probability = getProbabilityIndicator(userPoints, programMinPoints, programMedianPoints);

  return (
    <div className={`rounded-lg border-2 p-3 ${probability.bgColor}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{probability.icon}</span>
        <span className={`text-sm font-bold ${probability.color}`}>
          {probability.label} ({probability.percentage}%)
        </span>
      </div>
      <p className={`text-xs ${probability.color.replace('text-', 'text-').replace('-700', '-600').replace('-600', '-700')}`}>
        {probability.description}
      </p>
    </div>
  );
}
