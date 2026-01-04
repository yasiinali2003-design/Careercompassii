'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Eye } from 'lucide-react';

const SAMPLE_QUESTIONS = {
  YLA: [
    "Pidätkö lukemisesta ja tarinoista?",
    "Pidätkö matematiikasta ja laskemisesta?",
    "Opitko mieluummin tekemällä ja kokeilemalla itse?",
  ],
  TASO2: [
    "Kiinnostaako sinua koodaaminen tai omien ohjelmien tekeminen?",
    "Haluaisitko auttaa ihmisiä voimaan hyvin?",
    "Kiinnostaako sinua grafiikka, kuvat tai visuaalinen suunnittelu?",
  ],
  NUORI: [
    "Kiinnostaako sinua IT-ala ja digitaaliset ratkaisut?",
    "Haluaisitko työskennellä terveydenhuollossa ja hoivatyössä?",
    "Kiinnostaako sinua luovat alat ja sisällöntuotanto?",
  ],
};

export default function TestPreview() {
  const [selectedCohort, setSelectedCohort] = useState<'YLA' | 'TASO2' | 'NUORI'>('TASO2');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);

  const questions = SAMPLE_QUESTIONS[selectedCohort];
  const totalQuestions = 30;

  const handleNext = () => {
    setAnswer(null);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setCurrentQuestion(0);
    }
  };

  return (
    <div className="rounded-2xl border-2 border-white/20 bg-[#1a1d23] overflow-hidden">
      <div className="p-8 border-b border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <Eye className="h-8 w-8 text-blue-400" />
          <h2 className="text-3xl font-bold text-white">Kokeile testiä</h2>
        </div>
        <p className="text-lg text-neutral-400">Näin testin kysymykset näyttävät (3 esimerkkiä)</p>
      </div>

      <div className="p-8 space-y-6">
        {/* Cohort Selector */}
        <div>
          <p className="text-neutral-300 mb-3 font-medium">Valitse ikäryhmäsi nähdäksesi esimerkkikysymyksiä:</p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => { setSelectedCohort('YLA'); setCurrentQuestion(0); setAnswer(null); }}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCohort === 'YLA'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/5 text-neutral-300 hover:bg-white/10'
              }`}
            >
              Yläasteen oppilas
            </button>
            <button
              onClick={() => { setSelectedCohort('TASO2'); setCurrentQuestion(0); setAnswer(null); }}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCohort === 'TASO2'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/5 text-neutral-300 hover:bg-white/10'
              }`}
            >
              Toisen asteen opiskelija
            </button>
            <button
              onClick={() => { setSelectedCohort('NUORI'); setCurrentQuestion(0); setAnswer(null); }}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCohort === 'NUORI'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/5 text-neutral-300 hover:bg-white/10'
              }`}
            >
              Nuori aikuinen
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm text-neutral-400 mb-2">
            <span>Esimerkkikysymys {currentQuestion + 1} / {questions.length}</span>
            <span>Oikeassa testissä on {totalQuestions} kysymystä</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Display */}
        <div className="bg-white/5 rounded-lg p-6 min-h-[200px] flex flex-col justify-center">
          <h3 className="text-2xl font-semibold text-white mb-6">
            {questions[currentQuestion]}
          </h3>

          {/* Answer Scale */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {[
              { value: 1, label: 'Ei lainkaan' },
              { value: 2, label: 'Vähän' },
              { value: 3, label: 'Kohtalaisesti' },
              { value: 4, label: 'Paljon' },
              { value: 5, label: 'Erittäin paljon' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setAnswer(option.value)}
                className={`px-4 py-3 rounded-lg font-medium transition-all text-sm ${
                  answer === option.value
                    ? 'bg-blue-500 text-white ring-2 ring-blue-400'
                    : 'bg-white/10 text-neutral-300 hover:bg-white/20'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-4">
          <div className="text-sm text-neutral-400">
            {answer !== null ? (
              <span className="text-green-400 flex items-center gap-1">
                <span className="text-lg">✓</span> Vastattu
              </span>
            ) : (
              <span>Valitse vastaus</span>
            )}
          </div>
          <button
            onClick={handleNext}
            disabled={answer === null}
            className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
              answer === null
                ? 'bg-white/10 text-neutral-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {currentQuestion < questions.length - 1 ? 'Seuraava' : 'Alusta'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* CTA */}
        <div className="border-t border-white/10 pt-6">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-6 text-center">
            <p className="text-neutral-300 mb-4">
              Oikeassa testissä vastaat <strong className="text-white">30 kysymykseen</strong> ja
              saat <strong className="text-white">henkilökohtaiset urasuositukset</strong> vastaustesi perusteella.
            </p>
            <Link href="/test">
              <button className="px-8 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg flex items-center gap-2 mx-auto transition-all">
                Aloita oikea testi
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
