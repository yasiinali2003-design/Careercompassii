'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { generateSmartScenarios, SmartScenario } from '@/lib/todistuspiste/smartScenarios';
import { SubjectInputs } from '@/lib/todistuspiste';
import { ArrowRight, Target, Zap, Rocket, Plus } from 'lucide-react';

interface SmartScenariosModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: SubjectInputs;
  targetPoints: number;
  programName: string;
  scheme?: 'yliopisto' | 'amk';
}

export function SmartScenariosModal({
  isOpen,
  onClose,
  inputs,
  targetPoints,
  programName,
  scheme = 'yliopisto'
}: SmartScenariosModalProps) {
  const scenarios = generateSmartScenarios(inputs, targetPoints, scheme);

  const getScenarioIcon = (scenarioId: string) => {
    switch (scenarioId) {
      case 'easiest': return <Target className="h-5 w-5" />;
      case 'balanced': return <Zap className="h-5 w-5" />;
      case 'high-impact': return <Rocket className="h-5 w-5" />;
      case 'new-subject': return <Plus className="h-5 w-5" />;
      default: return <Target className="h-5 w-5" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'hard': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-neutral-800/30 text-gray-800 border-gray-300';
    }
  };

  const getSuccessColor = (probability: number) => {
    if (probability >= 70) return 'text-green-700';
    if (probability >= 50) return 'text-blue-700';
    if (probability >= 35) return 'text-yellow-700';
    return 'text-orange-700';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Reitit ohjelmaan: {programName}
          </DialogTitle>
          <p className="text-sm text-neutral-300">
            Valitse itsellesi sopivin tie tavoitteeseen. Jokaisessa reitissä näkyy tarvittavat parannukset ja arvioitu onnistumistodennäköisyys.
          </p>
        </DialogHeader>

        {scenarios.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-neutral-300">Ei saatavilla skenaarioita tällä hetkellä.</p>
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            {scenarios.map((scenario, index) => (
              <div
                key={scenario.id}
                className={`rounded-lg border-2 p-4 ${getDifficultyColor(scenario.difficulty)}`}
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-shrink-0">
                    {getScenarioIcon(scenario.id)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-base">{scenario.title}</h3>
                    <p className="text-xs opacity-80">{scenario.description}</p>
                  </div>
                  <div className={`text-sm font-bold ${getSuccessColor(scenario.successProbability)}`}>
                    {scenario.successProbability}%
                  </div>
                </div>

                {/* Improvements */}
                <div className="space-y-2 mb-3">
                  <p className="text-xs font-semibold opacity-90">Tarvittavat parannukset:</p>
                  {scenario.improvements.map((improvement, idx) => {
                    const from = improvement.currentGrade || '—';
                    return (
                      <div key={idx} className="flex items-center gap-2 text-sm bg-white/50 rounded px-2 py-1">
                        <span className="font-mono text-xs">•</span>
                        <span className="font-medium">{improvement.subjectLabel}:</span>
                        <span className="flex items-center gap-1">
                          {from} <ArrowRight className="h-3 w-3" /> {improvement.suggestedGrade}
                        </span>
                        <span className="text-xs opacity-80">(+{improvement.pointGain.toFixed(1)}p)</span>
                      </div>
                    );
                  })}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                  <div className="bg-white/50 rounded px-2 py-1">
                    <span className="opacity-80">Yhteensä:</span>{' '}
                    <span className="font-bold">+{scenario.totalPointGain.toFixed(1)} pistettä</span>
                  </div>
                  <div className="bg-white/50 rounded px-2 py-1">
                    <span className="opacity-80">Uudet pisteet:</span>{' '}
                    <span className="font-bold">{scenario.newTotalPoints.toFixed(1)}</span>
                  </div>
                </div>

                {/* Effort */}
                <div className="text-xs bg-white/50 rounded px-2 py-1">
                  <span className="font-semibold">⏱️ Arvio:</span> {scenario.effortDescription}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose} variant="outline">
            Sulje
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
