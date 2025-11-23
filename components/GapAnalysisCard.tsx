'use client';

import { analyzeGap } from '@/lib/todistuspiste/gapAnalysis';
import { SubjectInputs } from '@/lib/todistuspiste';
import { ArrowRight } from 'lucide-react';

interface GapAnalysisCardProps {
  inputs: SubjectInputs;
  targetPoints: number;
  scheme?: 'yliopisto' | 'amk';
}

export function GapAnalysisCard({ inputs, targetPoints, scheme = 'yliopisto' }: GapAnalysisCardProps) {
  const analysis = analyzeGap(inputs, targetPoints, scheme);

  if (analysis.gap <= 0) {
    return (
      <div className="rounded-lg border-2 bg-green-50 border-green-300 p-4">
        <p className="text-sm font-semibold text-green-800 flex items-center gap-2">
          <span className="text-lg">✓</span>
          Pisteesi riittävät jo tähän ohjelmaan!
        </p>
      </div>
    );
  }

  if (!analysis.isAchievable || analysis.bestPath.length === 0) {
    return (
      <div className="rounded-lg border-2 bg-orange-50 border-orange-300 p-4">
        <p className="text-sm font-semibold text-orange-800 flex items-center gap-2">
          <span className="text-lg">⚠️</span>
          Tarvitset {analysis.gap.toFixed(1)} pistettä lisää
        </p>
        <p className="text-xs text-orange-700 mt-1">
          Tämä on hyvin haastava tavoite nykyisillä arvosanoilla. Harkitse vaihtoehtoisia ohjelmia.
        </p>
      </div>
    );
  }

  const totalGain = analysis.bestPath.reduce((sum, imp) => sum + imp.pointGain, 0);

  return (
    <div className="rounded-lg border-2 bg-blue-50 border-blue-300 p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">💡</span>
        <p className="text-sm font-semibold text-blue-800">
          Polku sisään: tarvitset {analysis.gap.toFixed(1)} pistettä lisää
        </p>
      </div>

      <div className="space-y-1 mb-2">
        {analysis.bestPath.slice(0, 3).map((improvement, index) => {
          const from = improvement.currentGrade || '—';
          return (
            <div key={index} className="flex items-center gap-2 text-xs text-blue-700">
              <span className="font-mono">•</span>
              <span className="font-medium">{improvement.subjectLabel}:</span>
              <span className="flex items-center gap-1">
                {from} <ArrowRight className="h-3 w-3" /> {improvement.suggestedGrade}
              </span>
              <span className="text-blue-600">(+{improvement.pointGain.toFixed(1)}p)</span>
            </div>
          );
        })}
      </div>

      <p className="text-xs font-semibold text-blue-800 mt-2">
        Yhteensä: +{totalGain.toFixed(1)} pistettä = {analysis.currentPoints + totalGain >= analysis.targetPoints ? 'SISÄLLÄ!' : 'Lähellä tavoitetta'}
      </p>
    </div>
  );
}
