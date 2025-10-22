'use client';

/**
 * CAREER TEST RESULTS PAGE
 * Displays personalized career recommendations after test completion
 */

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/Logo';

// Types
interface DimensionScores {
  interests: number;
  values: number;
  workstyle: number;
  context: number;
}

interface CareerMatch {
  slug: string;
  title: string;
  category: string;
  overallScore: number;
  dimensionScores: {
    interests: number;
    values: number;
    workstyle: number;
    context: number;
  };
  reasons: string[];
  confidence: 'high' | 'medium' | 'low';
  salaryRange?: [number, number];
  outlook?: string;
}

interface UserProfile {
  cohort: string;
  dimensionScores: DimensionScores;
  topStrengths: string[];
  personalizedAnalysis?: string;
}

interface ResultsData {
  success: boolean;
  cohort: string;
  userProfile: UserProfile;
  topCareers: CareerMatch[];
  cohortCopy: {
    title: string;
    subtitle: string;
    ctaText: string;
    shareText: string;
  };
}

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [results, setResults] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get results from localStorage (set by test component)
    const storedResults = localStorage.getItem('careerTestResults');
    
    if (storedResults) {
      try {
        const data = JSON.parse(storedResults);
        setResults(data);
        setLoading(false);
      } catch (err) {
        setError('Virhe tulosten lataamisessa');
        setLoading(false);
      }
    } else {
      setError('Tuloksia ei löytynyt. Tee testi uudelleen.');
      setLoading(false);
    }
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analysoidaan tuloksiasi...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Virhe</CardTitle>
            <CardDescription>{error || 'Jotain meni pieleen'}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/test">
              <Button>Palaa testiin</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const { userProfile, topCareers, cohortCopy } = results;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Logo - Top Left */}
        <div className="mb-8">
          <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
            <Logo className="h-12 w-auto" />
          </Link>
        </div>
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {cohortCopy.title}
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            {cohortCopy.subtitle}
          </p>
        </div>

        {/* User Profile Summary */}
        <Card className="mb-8 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Sinun profiilisi
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Personalized Analysis Text */}
            {userProfile.personalizedAnalysis && (
              <div className="mb-6">
                <div className="text-gray-700 leading-relaxed space-y-4 whitespace-pre-line">
                  {userProfile.personalizedAnalysis}
                </div>
              </div>
            )}

            {/* Top Strengths */}
            {userProfile.topStrengths && userProfile.topStrengths.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">Vahvuutesi:</h3>
                <div className="flex flex-wrap gap-2">
                  {userProfile.topStrengths.map((strength, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Dimension Scores - Hidden from user */}
            {/* Users don't need to see raw dimension scores */}
          </CardContent>
        </Card>

        {/* Career Matches */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Ammattiehdotukset vastaustesi perusteella
          </h2>
          
          <div className="space-y-4">
            {topCareers.map((career, index) => (
              <CareerMatchCard
                key={career.slug}
                career={career}
                rank={index + 1}
                ctaText={cohortCopy.ctaText}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
          <Link href="/ammatit">
            <Button size="lg" variant="outline">
              Selaa kaikkia ammatteja
            </Button>
          </Link>
          <Link href="/test">
            <Button size="lg">
              Tee testi uudelleen
            </Button>
          </Link>
        </div>

        {/* Share */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">{cohortCopy.shareText}</p>
        </div>
      </div>
    </div>
  );
}

// ========== COMPONENTS ==========

function DimensionBar({ label, score, color }: { label: string; score: number; color: string }) {
  const percentage = Math.round(score * 100);
  
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-600">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`${color} h-2.5 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

function CareerMatchCard({ 
  career, 
  rank, 
  ctaText 
}: { 
  career: CareerMatch; 
  rank: number; 
  ctaText: string;
}) {
  const getConfidenceBadge = (confidence: string) => {
    const styles = {
      high: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-gray-100 text-gray-800'
    };
    const labels = {
      high: 'Vahva suositus',
      medium: 'Hyvä vaihtoehto',
      low: 'Mahdollinen vaihtoehto'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[confidence as keyof typeof styles]}`}>
        {labels[confidence as keyof typeof labels]}
      </span>
    );
  };

  const getMatchColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl font-bold text-gray-400">#{rank}</span>
              <CardTitle className="text-2xl">{career.title}</CardTitle>
            </div>
            <CardDescription className="capitalize text-sm">
              {career.category}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${getMatchColor(career.overallScore)}`}>
              {career.overallScore}%
            </div>
            <div className="text-xs text-gray-500">yhteensopivuus</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Confidence Badge */}
        <div>
          {getConfidenceBadge(career.confidence)}
        </div>

        {/* Reasons */}
        {career.reasons && career.reasons.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Miksi tämä sopii sinulle:</h4>
            <ul className="space-y-2">
              {career.reasons.map((reason, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-600">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Dimension Breakdown - Hidden from user */}
        {/* Users don't need to see technical dimension scores */}

        {/* Salary & Outlook */}
        {(career.salaryRange || career.outlook) && (
          <div className="flex flex-wrap gap-4 pt-2 text-sm text-gray-600">
            {career.salaryRange && (
              <div className="flex items-center gap-1">
                <span className="font-medium">Palkka:</span>
                <span>{career.salaryRange[0]}-{career.salaryRange[1]} €/kk</span>
              </div>
            )}
            {career.outlook && (
              <div className="flex items-center gap-1">
                <span className="font-medium">Työllisyysnäkymä:</span>
                <span className="capitalize">{career.outlook}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Link href={`/ammatit/${career.slug}`} className="w-full">
          <Button className="w-full" variant="default">
            {ctaText}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

