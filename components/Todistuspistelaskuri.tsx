"use client";

import React, { useState, useEffect } from 'react';

// Finnish matriculation exam grades and points
const EXAM_GRADES = {
  'L': { label: 'Laudatur (L)', points: 7 },
  'E': { label: 'Eximia (E)', points: 6 },
  'M': { label: 'Magna (M)', points: 5 },
  'C': { label: 'Cum laude (C)', points: 4 },
  'B': { label: 'Lubenter (B)', points: 3 },
  'A': { label: 'Approbatur (A)', points: 2 },
  'I': { label: 'Improbatur (I)', points: 0 },
  '': { label: 'Ei vielä suoritettu', points: 0 }
};

// Common matriculation exam subjects
const EXAM_SUBJECTS = [
  // Äidinkieli (mandatory)
  { id: 'AI', name: 'Äidinkieli', category: 'mandatory', multiplier: 1 },

  // Matematiikka (one mandatory)
  { id: 'MAA', name: 'Pitkä matematiikka', category: 'math', multiplier: 1 },
  { id: 'MAB', name: 'Lyhyt matematiikka', category: 'math', multiplier: 1 },

  // Kielet
  { id: 'ENA', name: 'Englanti (pitkä)', category: 'language', multiplier: 1 },
  { id: 'EAB', name: 'Englanti (keskipitkä)', category: 'language', multiplier: 1 },
  { id: 'RUA', name: 'Ruotsi (pitkä)', category: 'language', multiplier: 1 },
  { id: 'RUB', name: 'Ruotsi (keskipitkä)', category: 'language', multiplier: 1 },
  { id: 'SAA', name: 'Saksa (pitkä)', category: 'language', multiplier: 1 },
  { id: 'RAA', name: 'Ranska (pitkä)', category: 'language', multiplier: 1 },
  { id: 'SPA', name: 'Espanja (pitkä)', category: 'language', multiplier: 1 },

  // Reaalikokeet
  { id: 'HI', name: 'Historia', category: 'real', multiplier: 1 },
  { id: 'YH', name: 'Yhteiskuntaoppi', category: 'real', multiplier: 1 },
  { id: 'FY', name: 'Fysiikka', category: 'real', multiplier: 1 },
  { id: 'KE', name: 'Kemia', category: 'real', multiplier: 1 },
  { id: 'BI', name: 'Biologia', category: 'real', multiplier: 1 },
  { id: 'GE', name: 'Maantiede', category: 'real', multiplier: 1 },
  { id: 'PS', name: 'Psykologia', category: 'real', multiplier: 1 },
  { id: 'FI', name: 'Filosofia', category: 'real', multiplier: 1 },
  { id: 'ET', name: 'Terveystieto', category: 'real', multiplier: 1 },
  { id: 'UE', name: 'Uskonto/Elämänkatsomustieto', category: 'real', multiplier: 1 },
];

type ExamGrade = '' | 'L' | 'E' | 'M' | 'C' | 'B' | 'A' | 'I';

interface ExamResult {
  subject: string;
  grade: ExamGrade;
}

interface TodistuspistelaskuriProps {
  onCalculate?: (totalPoints: number, exams: ExamResult[]) => void;
}

export default function Todistuspistelaskuri({ onCalculate }: TodistuspistelaskuriProps) {
  const [selectedExams, setSelectedExams] = useState<Record<string, ExamGrade>>(() => {
    // Load from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('yoExamResults');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return {};
        }
      }
    }
    return {};
  });

  const [expanded, setExpanded] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);

  // Calculate total points
  useEffect(() => {
    let points = 0;
    const completedExams: ExamResult[] = [];

    Object.entries(selectedExams).forEach(([subject, grade]) => {
      if (grade && grade !== '') {
        const gradePoints = EXAM_GRADES[grade]?.points || 0;
        const exam = EXAM_SUBJECTS.find(e => e.id === subject);
        if (exam) {
          points += gradePoints * exam.multiplier;
          completedExams.push({ subject, grade });
        }
      }
    });

    setTotalPoints(points);

    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('yoExamResults', JSON.stringify(selectedExams));
    }

    // Notify parent
    if (onCalculate) {
      onCalculate(points, completedExams);
    }
  }, [selectedExams, onCalculate]);

  const updateGrade = (subjectId: string, grade: ExamGrade) => {
    setSelectedExams(prev => ({
      ...prev,
      [subjectId]: grade
    }));
  };

  const completedCount = Object.values(selectedExams).filter(g => g && g !== '').length;
  const hasAnyExams = completedCount > 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-[#0F172A]">
            📊 Todistuspistelaskuri
          </h3>
          <p className="text-sm text-[#475569] mt-1">
            Syötä ylioppilaskirjoitustesi tulokset nähdäksesi, mitkä urat ovat saavutettavissa
          </p>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1E40AF] transition-colors"
        >
          {expanded ? 'Piilota' : 'Avaa laskuri'}
        </button>
      </div>

      {/* Points Summary */}
      {hasAnyExams && (
        <div className="bg-gradient-to-r from-[#2563EB]/10 to-[#7C3AED]/10 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#475569]">Yhteensä pisteitä</p>
              <p className="text-3xl font-bold text-[#2563EB]">{totalPoints} pistettä</p>
              <p className="text-xs text-[#64748B] mt-1">
                {completedCount} koetta suoritettu
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#64748B]">Keskiarvo</p>
              <p className="text-2xl font-semibold text-[#7C3AED]">
                {completedCount > 0 ? (totalPoints / completedCount).toFixed(1) : '0.0'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Exam Selection (Expandable) */}
      {expanded && (
        <div className="space-y-6">
          {/* Mandatory exams */}
          <div>
            <h4 className="font-semibold text-[#0F172A] mb-3 flex items-center gap-2">
              <span className="text-red-500">*</span>
              Pakolliset kokeet
            </h4>
            <div className="space-y-2">
              {EXAM_SUBJECTS.filter(e => e.category === 'mandatory' || e.category === 'math').map(exam => (
                <div key={exam.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <label className="flex-1 text-sm font-medium text-[#0F172A]">
                    {exam.name}
                  </label>
                  <select
                    value={selectedExams[exam.id] || ''}
                    onChange={(e) => updateGrade(exam.id, e.target.value as ExamGrade)}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  >
                    <option value="">Valitse arvosana</option>
                    {Object.entries(EXAM_GRADES).filter(([key]) => key !== '').map(([value, { label }]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Language exams */}
          <div>
            <h4 className="font-semibold text-[#0F172A] mb-3">Kielikokeet</h4>
            <div className="space-y-2">
              {EXAM_SUBJECTS.filter(e => e.category === 'language').map(exam => (
                <div key={exam.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <label className="flex-1 text-sm font-medium text-[#0F172A]">
                    {exam.name}
                  </label>
                  <select
                    value={selectedExams[exam.id] || ''}
                    onChange={(e) => updateGrade(exam.id, e.target.value as ExamGrade)}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  >
                    <option value="">Ei suoritettu</option>
                    {Object.entries(EXAM_GRADES).filter(([key]) => key !== '').map(([value, { label }]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Real subject exams */}
          <div>
            <h4 className="font-semibold text-[#0F172A] mb-3">Reaalikokeet</h4>
            <div className="space-y-2">
              {EXAM_SUBJECTS.filter(e => e.category === 'real').map(exam => (
                <div key={exam.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <label className="flex-1 text-sm font-medium text-[#0F172A]">
                    {exam.name}
                  </label>
                  <select
                    value={selectedExams[exam.id] || ''}
                    onChange={(e) => updateGrade(exam.id, e.target.value as ExamGrade)}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  >
                    <option value="">Ei suoritettu</option>
                    {Object.entries(EXAM_GRADES).filter(([key]) => key !== '').map(([value, { label }]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Help text */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>💡 Ohje:</strong> Valitse kaikki kokeet, jotka olet suorittanut tai aiot suorittaa.
              Jos et ole vielä suorittanut koetta, jätä se tyhjäksi. Pisteet päivittyvät automaattisesti.
            </p>
          </div>
        </div>
      )}

      {!expanded && !hasAnyExams && (
        <div className="text-center py-8 text-[#64748B]">
          <p className="text-sm">Avaa laskuri syöttääksesi ylioppilaskirjoitustesi tulokset</p>
        </div>
      )}
    </div>
  );
}

// Export helper function to check if points are sufficient for a career
export function checkCareerEligibility(totalPoints: number, career: any): {
  eligible: boolean;
  message: string;
  icon: string;
} {
  // This is a simplified example - you would need actual pisterajat data
  // For now, we'll use rough estimates based on typical requirements

  const minPoints = 30; // Minimum typical requirement
  const goodPoints = 40; // Good chance
  const excellentPoints = 50; // Excellent chance

  if (totalPoints === 0) {
    return {
      eligible: false,
      message: 'Täytä pistelaskuri nähdäksesi, riittävätkö pisteesi',
      icon: 'ℹ️'
    };
  }

  if (totalPoints >= excellentPoints) {
    return {
      eligible: true,
      message: `Pisteesi riittävät erinomaisesti (${totalPoints} pistettä)`,
      icon: '✅'
    };
  }

  if (totalPoints >= goodPoints) {
    return {
      eligible: true,
      message: `Pisteesi riittävät hyvin (${totalPoints} pistettä)`,
      icon: '✅'
    };
  }

  if (totalPoints >= minPoints) {
    return {
      eligible: true,
      message: `Pisteesi voivat riittää (${totalPoints} pistettä)`,
      icon: '⚠️'
    };
  }

  return {
    eligible: false,
    message: `Pisteet saattavat olla riittämättömät (${totalPoints} pistettä)`,
    icon: '⚠️'
  };
}
