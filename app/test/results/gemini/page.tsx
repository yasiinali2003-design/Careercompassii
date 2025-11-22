'use client';

/**
 * GEMINI 3 ENHANCED CAREER TEST RESULTS PAGE
 * Uses Gemini 3's generative UI and advanced reasoning for better career guidance
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';
import GeminiResultsDisplay from '@/components/GeminiResultsDisplay';
import GeminiCareerPathVisualization from '@/components/GeminiCareerPathVisualization';
import GeminiCareerContent from '@/components/GeminiCareerContent';

interface GeminiAnalysis {
  personalityType: string;
  matchPercentage: number;
  topCareers: Array<{
    name: string;
    match: number;
    description: string;
    salary: string;
    education: string;
  }>;
  strengths: string[];
  learningPath: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  careerRoadmap: Array<{
    stage: string;
    timeline: string;
    actions: string[];
  }>;
  insights: string;
}

export default function GeminiResultsPage() {
  const router = useRouter();
  const [analysisData, setAnalysisData] = useState<GeminiAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'path' | 'explore'>('overview');
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);

  useEffect(() => {
    fetchGeminiAnalysis();
  }, []);

  const fetchGeminiAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get the test results from localStorage
      const storedResults = localStorage.getItem('careerTestResults');

      if (!storedResults) {
        setError('Tuloksia ei löytynyt. Tee testi uudelleen.');
        setLoading(false);
        return;
      }

      const testResults = JSON.parse(storedResults);

      // Call Gemini 3 analysis API
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: testResults.answers || {},
          userProfile: {
            age: testResults.userProfile?.age,
            education: testResults.cohort,
            interests: testResults.userProfile?.topStrengths || [],
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAnalysisData(data.analysis);
      } else {
        setError(data.error || 'Analyysin luominen epäonnistui');
      }
    } catch (err) {
      console.error('Gemini analysis error:', err);
      setError('Virhe analyysin lataamisessa');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1419] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-8 w-24 h-24 border-4 border-[#2B5F75] border-t-[#E8994A] rounded-full"
          />
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-gray-400 text-xl"
          >
            Gemini 3 analysoi tuloksiasi ja luo personoitua sisältöä...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error || !analysisData) {
    return (
      <div className="min-h-screen bg-[#0f1419] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full rounded-3xl bg-gradient-to-br from-red-500/10 to-transparent backdrop-blur-xl border border-red-500/20 p-8 text-center"
        >
          <span className="text-6xl mb-6 block">⚠️</span>
          <h2 className="text-2xl font-bold text-white mb-4">Virhe</h2>
          <p className="text-gray-400 mb-6">{error || 'Jotain meni pieleen'}</p>
          <div className="flex gap-4 justify-center">
            <Link href="/test">
              <button className="px-6 py-3 bg-[#2B5F75] hover:bg-[#2B5F75]/80 rounded-xl text-white font-medium transition-all">
                Palaa testiin
              </button>
            </Link>
            <button
              onClick={fetchGeminiAnalysis}
              className="px-6 py-3 bg-[#E8994A] hover:bg-[#E8994A]/80 rounded-xl text-white font-medium transition-all"
            >
              Yritä uudelleen
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1419]">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0f1419]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
              <Logo className="h-10 w-auto" />
            </Link>

            {/* Navigation Tabs */}
            <div className="flex gap-2">
              {[
                { id: 'overview', label: 'Yhteenveto', icon: '📊' },
                { id: 'path', label: 'Urapolku', icon: '🛤️' },
                { id: 'explore', label: 'Tutustu uraan', icon: '🔍' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`
                    px-6 py-2 rounded-xl font-medium transition-all
                    ${selectedTab === tab.id
                      ? 'bg-gradient-to-r from-[#2B5F75] to-[#4A7C59] text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }
                  `}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            <Link href="/test/results">
              <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 text-sm transition-all">
                Perinteinen näkymä
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Gemini Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-center gap-2"
        >
          <div className="px-6 py-3 bg-gradient-to-r from-[#E8994A]/20 to-[#2B5F75]/20 backdrop-blur-sm rounded-2xl border border-white/10 flex items-center gap-3">
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-2xl"
            >
              ✨
            </motion.span>
            <div>
              <p className="text-white font-semibold">Tehostettu Gemini 3:lla</p>
              <p className="text-gray-400 text-sm">Generatiivinen tekoäly tuottaa personoitua sisältöä</p>
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <GeminiResultsDisplay
            analysisData={analysisData}
            onGenerateUI={false}
          />
        )}

        {selectedTab === 'path' && (
          <GeminiCareerPathVisualization
            userGoals={analysisData.topCareers.map(c => c.name)}
            currentSkills={analysisData.strengths}
          />
        )}

        {selectedTab === 'explore' && (
          <div className="space-y-8">
            {/* Career Selector */}
            {!selectedCareer ? (
              <div>
                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-bold text-white mb-6 text-center"
                >
                  Valitse ura tutkittavaksi
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {analysisData.topCareers.map((career, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      onClick={() => setSelectedCareer(career.name)}
                      className="text-left p-6 rounded-2xl bg-gradient-to-br from-[#2B5F75]/10 to-transparent backdrop-blur-xl border border-white/10 hover:border-[#E8994A]/50 transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">{career.name}</h3>
                        <span className="px-3 py-1 bg-[#4A7C59]/20 text-[#4A7C59] rounded-full text-sm font-medium">
                          {career.match}%
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">{career.description}</p>
                      <div className="flex gap-2 text-xs">
                        <span className="text-[#E8994A]">💰 {career.salary}</span>
                        <span className="text-[#2B5F75]">🎓 {career.education}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <button
                  onClick={() => setSelectedCareer(null)}
                  className="mb-6 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 transition-all flex items-center gap-2"
                >
                  ← Palaa takaisin
                </button>

                <GeminiCareerContent
                  career={selectedCareer}
                  userContext={{
                    interests: analysisData.strengths,
                    currentSkills: analysisData.strengths,
                    personalityType: analysisData.personalityType,
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-16 border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            Tulokset luotu käyttämällä Google Gemini 3 -tekoälyä • {new Date().toLocaleDateString('fi-FI')}
          </p>
        </div>
      </div>
    </div>
  );
}
