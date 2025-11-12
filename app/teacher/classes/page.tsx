"use client";

/**
 * Teacher Classes Page
 * Dashboard overview of all classes
 */

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import TeacherNav from '@/components/TeacherNav';
import TeacherFooter from '@/components/TeacherFooter';

interface ClassStats {
  totalPins: number;
  completedResults: number;
  pendingCount: number;
  completionRate: number;
  lastSubmission: string | null;
  atRiskCount: number;
}

interface TeacherClass {
  id: string;
  class_token: string;
  created_at: string;
  updated_at?: string;
  stats?: ClassStats;
}

export default function TeacherClassesPage() {
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [loading, setLoading] = useState(true);

  const handleCopyLink = useCallback((link: string) => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      alert('Kopiointi ei ole tuettu tässä selaimessa. Kopioi linkki käsin.');
      return;
    }

    navigator.clipboard
      .writeText(link)
      .then(() => alert('Linkki kopioitu leikepöydälle.'))
      .catch(() => alert('Linkin kopiointi epäonnistui. Yritä kopioida linkki käsin.'));
  }, []);

  useEffect(() => {
    async function fetchClasses() {
      try {
        const response = await fetch('/api/classes');
        const data = await response.json();

        if (data.success && Array.isArray(data.classes)) {
          setClasses(data.classes);
        } else {
          console.error('Failed to fetch classes:', data.error);
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchClasses();
  }, []);

  const formatDate = (isoDate: string) => {
    try {
      return new Date(isoDate).toLocaleDateString('fi-FI');
    } catch {
      return isoDate;
    }
  };

  const formatDateTime = (isoDate: string | null | undefined) => {
    if (!isoDate) return 'Ei vielä tuloksia';
    try {
      return new Date(isoDate).toLocaleString('fi-FI', {
        dateStyle: 'short',
        timeStyle: 'short',
      });
    } catch {
      return isoDate;
    }
  };

  const renderProgressBar = (percentage: number) => {
    const safePercentage = Math.max(0, Math.min(percentage, 100));

    return (
      <div className="space-y-1">
        <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
            style={{ width: `${safePercentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Valmiina</span>
          <span>{safePercentage}%</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
        <TeacherNav />
        <div className="flex-1 max-w-6xl mx-auto p-8 w-full">
          <h1 className="text-3xl font-bold mb-8">Omat luokat</h1>
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
        <TeacherFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
      <TeacherNav />
      <div className="flex-1 max-w-6xl mx-auto p-8 w-full">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Omat luokat</h1>
            <p className="text-gray-600">Yleisnäkymä luokkien etenemisestä ja ilmoituksista</p>
          </div>
          <Link
            href="/teacher/classes/new"
            className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            ➕ Luo uusi luokka
          </Link>
        </div>

        {classes.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <p className="text-gray-600 mb-6">Sinulla ei ole vielä luokkia</p>
            <Link
              href="/teacher/classes/new"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Luo uusi luokka
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {classes.map((classItem) => {
              const stats = classItem.stats;
              const completed = stats?.completedResults ?? 0;
              const totalPins = stats?.totalPins ?? 0;
              const pending = stats?.pendingCount ?? Math.max(totalPins - completed, 0);
              const completionRate = stats?.completionRate ?? 0;
              const atRiskCount = stats?.atRiskCount ?? 0;
              const lastSubmission = formatDateTime(stats?.lastSubmission);
              const studentTestPath = `/${classItem.class_token}/test`;
              const classResultsPath = `/${classItem.class_token}`;

              return (
                <div
                  key={classItem.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5 flex flex-col"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Luokka {classItem.id.substring(0, 8)}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Luotu {formatDate(classItem.created_at)}
                      </p>
                    </div>
                    {atRiskCount > 0 && (
                      <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">
                        ⚠️ {atRiskCount} tarvitsee huomiota
                      </span>
                    )}
                  </div>

                  {renderProgressBar(completionRate)}

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <p className="font-semibold text-gray-700">Suoritetut testit</p>
                      <p>{completed} / {totalPins}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Kesken</p>
                      <p>{pending}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Viimeisin tulos</p>
                      <p>{lastSubmission}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">PIN-linkki</p>
                      <button
                        type="button"
                        onClick={() => {
                          const origin = typeof window !== 'undefined' ? window.location.origin : '';
                          handleCopyLink(`${origin}${studentTestPath}`);
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        Kopioi testilinkki
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 mt-auto flex flex-wrap gap-3">
                    <Link
                      href={`/teacher/classes/${classItem.id}`}
                      className="inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                    >
                      Avaa luokka
                    </Link>
                    <Link
                      href={classResultsPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                    >
                      Näytä tulossivu
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <TeacherFooter />
    </div>
  );
}
