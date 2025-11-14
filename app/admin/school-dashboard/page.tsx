"use client";

/**
 * School-Wide Analytics Dashboard
 * Shows aggregated analytics across all classes
 */

import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/Logo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Users, GraduationCap, Calendar, AlertCircle } from 'lucide-react';

interface SchoolAnalytics {
  totalTests: number;
  totalClasses: number;
  topCareers: Array<{ name: string; count: number; percentage: number }>;
  educationPathDistribution: {
    lukio: number;
    ammattikoulu: number;
    kansanopisto: number;
  };
  dimensionAverages: {
    interests: number;
    values: number;
    workstyle: number;
    context: number;
  };
  cohortDistribution: Record<string, number>;
  trends: {
    byMonth: Array<{
      month: string;
      tests: number;
      topCareers: Array<{ name: string; count: number }>;
    }>;
    byYear: Array<{
      year: string;
      tests: number;
      educationPathDistribution: {
        lukio: number;
        ammattikoulu: number;
        kansanopisto: number;
      };
    }>;
  };
  insights: string[];
}

export default function SchoolDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<SchoolAnalytics | null>(null);
  const [teacherId, setTeacherId] = useState('');
  const [since, setSince] = useState('');

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (teacherId) params.append('teacherId', teacherId);
      if (since) params.append('since', since);

      const response = await fetch(`/api/admin/school-analytics?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setAnalytics(data.analytics);
      } else {
        setError(data.error || 'Failed to load analytics');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, [since, teacherId]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p>Ladataan analytiikkaa...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center text-red-600">
            <AlertCircle className="h-12 w-12 mx-auto mb-4" />
            <p>Virhe: {error}</p>
            <Button onClick={fetchAnalytics} className="mt-4">
              Yritä uudelleen
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p>Ei dataa saatavilla.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/20">
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo className="h-10 w-auto" />
          </Link>
          <div className="flex gap-4">
            <Link href="/admin/teachers">
              <Button variant="outline" size="sm">
                Opettajahallinta
              </Button>
            </Link>
            <Link href="/teacher/login">
              <Button variant="outline" size="sm">
                Opettajien hallintapaneeli
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Koulun analytiikka
          </h1>
          <p className="text-gray-600">
            Yhteenveto kaikista luokista ja oppilaiden testeistä
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Suodattimet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Opettaja ID (valinnainen)
                </label>
                <input
                  type="text"
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  placeholder="Filtteröi tietyn opettajan luokat"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Alkaen päivämäärästä (valinnainen)
                </label>
                <input
                  type="date"
                  value={since}
                  onChange={(e) => setSince(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Testejä yhteensä</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalTests}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.totalClasses} luokassa
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Luokkia</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalClasses}</div>
              <p className="text-xs text-muted-foreground">
                Aktiivisia luokkia
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">YLA-testejä</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.cohortDistribution.YLA || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Koulutuspolkusuosituksia
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trendi</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.trends.byMonth.length > 0
                  ? analytics.trends.byMonth[analytics.trends.byMonth.length - 1].tests
                  : 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Viime kuussa
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Insights */}
        {analytics.insights.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Oivallukset</CardTitle>
              <CardDescription>Automaattisesti tunnistetut kuvioita</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analytics.insights.map((insight, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Top Careers */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Yleisimmät ammatit</CardTitle>
            <CardDescription>Top 15 suosituinta ammattia kaikista testeistä</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.topCareers.length > 0 ? (
              <div className="space-y-3">
                {analytics.topCareers.map((career, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-500 w-6">{index + 1}.</span>
                      <span className="font-medium">{career.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${career.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-16 text-right">
                        {career.count} ({career.percentage}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Ei dataa saatavilla.</p>
            )}
          </CardContent>
        </Card>

        {/* Education Path Distribution */}
        {analytics.educationPathDistribution.lukio +
          analytics.educationPathDistribution.ammattikoulu +
          analytics.educationPathDistribution.kansanopisto > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Koulutuspolut (YLA)</CardTitle>
              <CardDescription>Jakauma koulutuspolkusuosituksissa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(() => {
                  const total = analytics.educationPathDistribution.lukio +
                    analytics.educationPathDistribution.ammattikoulu +
                    analytics.educationPathDistribution.kansanopisto;
                  const lukioPct = total > 0
                    ? Math.round((analytics.educationPathDistribution.lukio / total) * 100)
                    : 0;
                  const ammattikouluPct = total > 0
                    ? Math.round((analytics.educationPathDistribution.ammattikoulu / total) * 100)
                    : 0;
                  const kansanopistoPct = total > 0
                    ? Math.round((analytics.educationPathDistribution.kansanopisto / total) * 100)
                    : 0;

                  return (
                    <>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Lukio</span>
                          <span className="text-sm text-gray-600">
                            {analytics.educationPathDistribution.lukio} ({lukioPct}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-primary h-3 rounded-full"
                            style={{ width: `${lukioPct}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Ammattikoulu</span>
                          <span className="text-sm text-gray-600">
                            {analytics.educationPathDistribution.ammattikoulu} ({ammattikouluPct}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-green-600 h-3 rounded-full"
                            style={{ width: `${ammattikouluPct}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Kansanopisto</span>
                          <span className="text-sm text-gray-600">
                            {analytics.educationPathDistribution.kansanopisto} ({kansanopistoPct}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-secondary h-3 rounded-full"
                            style={{ width: `${kansanopistoPct}%` }}
                          />
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dimension Averages */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Keskimääräiset dimensiot</CardTitle>
            <CardDescription>Oppilaiden profiilien keskiarvot</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'Kiinnostukset', value: analytics.dimensionAverages.interests },
                { label: 'Arvot', value: analytics.dimensionAverages.values },
                { label: 'Työtapa', value: analytics.dimensionAverages.workstyle },
                { label: 'Konteksti', value: analytics.dimensionAverages.context },
              ].map((dim) => (
                <div key={dim.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{dim.label}</span>
                    <span className="text-sm text-gray-600">{Math.round(dim.value)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-primary h-3 rounded-full"
                      style={{ width: `${Math.min(Math.max(dim.value, 0), 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        {analytics.trends.byMonth.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Kuukausittainen trendi</CardTitle>
              <CardDescription>Testien määrä kuukausittain</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.trends.byMonth.slice(-6).map((month, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{month.month}</span>
                    <div className="flex items-center gap-4">
                      <div className="w-48 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              (month.tests / Math.max(...analytics.trends.byMonth.map((m) => m.tests || 1))) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">{month.tests}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Yearly Trends */}
        {analytics.trends.byYear.length > 1 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Vuosittainen vertailu</CardTitle>
              <CardDescription>Koulutuspolkujen jakauma vuosittain</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.trends.byYear.map((year, index) => {
                  const total = year.educationPathDistribution.lukio +
                    year.educationPathDistribution.ammattikoulu +
                    year.educationPathDistribution.kansanopisto;
                  return (
                    <div key={index}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{year.year}</span>
                        <span className="text-sm text-gray-600">{year.tests} testiä</span>
                      </div>
                      {total > 0 && (
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            Lukio: {year.educationPathDistribution.lukio} (
                            {Math.round((year.educationPathDistribution.lukio / total) * 100)}%)
                          </div>
                          <div>
                            Ammattikoulu: {year.educationPathDistribution.ammattikoulu} (
                            {Math.round((year.educationPathDistribution.ammattikoulu / total) * 100)}%)
                          </div>
                          <div>
                            Kansanopisto: {year.educationPathDistribution.kansanopisto} (
                            {Math.round((year.educationPathDistribution.kansanopisto / total) * 100)}%)
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

