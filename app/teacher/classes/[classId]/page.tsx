"use client";

/**
 * Teacher Class Detail Page
 * Shows PINs, name mapping, and results for a specific class
 * Uses UraKompassi design system colors
 */

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TeacherClassManager from '@/components/TeacherClassManager';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { ArrowLeft, ExternalLink, Copy, Check } from 'lucide-react';

export default function ClassDetailPage({
  params,
}: {
  params: { classId: string };
}) {
  const { classId } = params;
  const router = useRouter();
  const [classToken, setClassToken] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchClassDetails = useCallback(async () => {
    try {
      const response = await fetch(`/api/classes/${classId}`);
      const data = await response.json();
      if (data.success) {
        setClassToken(data.class.classToken);
      } else {
        console.error('Failed to fetch class details');
      }
    } catch (error) {
      console.error('Error fetching class details:', error);
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    fetchClassDetails();
  }, [fetchClassDetails]);

  const handleCopyToken = () => {
    if (classToken) {
      navigator.clipboard.writeText(`${window.location.origin}/${classToken}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Ladataan..." subtitle="Haetaan luokan tietoja">
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin h-10 w-10 border-4 border-urak-accent-blue border-t-transparent rounded-full"></div>
            <p className="text-urak-text-muted text-sm">Ladataan luokan tietoja...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Luokkahallinta"
      subtitle={`Luokka: ${classId.substring(0, 8)}`}
      actions={
        <div className="flex items-center gap-2">
          {classToken && (
            <>
              <button
                onClick={handleCopyToken}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white/5 hover:bg-white/10 border border-urak-border rounded-lg text-urak-text-secondary transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-urak-accent-blue" />
                    <span className="text-urak-accent-blue">Kopioitu!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Kopioi linkki</span>
                  </>
                )}
              </button>
              <a
                href={`/${classToken}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-urak-accent-blue/10 hover:bg-urak-accent-blue/20 border border-urak-accent-blue/20 rounded-lg text-urak-accent-blue transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Avaa tulossivu</span>
              </a>
            </>
          )}
        </div>
      }
    >
      {/* Back button */}
      <button
        onClick={() => router.push('/teacher/classes')}
        className="flex items-center gap-2 text-urak-text-secondary hover:text-white mb-6 transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm">Takaisin luokkalistaan</span>
      </button>

      {/* Main content card */}
      <div className="bg-urak-surface border border-urak-border rounded-2xl overflow-hidden">
        {/* Header strip */}
        <div className="bg-urak-accent-blue/10 px-6 py-4 border-b border-urak-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Luokan hallinta</h2>
              <p className="text-sm text-urak-text-muted mt-0.5">
                Hallitse PIN-koodeja, nimiä ja tuloksia
              </p>
            </div>
            {classToken && (
              <div className="hidden sm:flex items-center gap-2 text-xs text-urak-text-muted">
                <span>Tunnus:</span>
                <code className="bg-white/5 px-2 py-1 rounded font-mono text-urak-text-secondary">
                  {classToken}
                </code>
              </div>
            )}
          </div>
        </div>

        {/* Class manager content */}
        <div className="p-6">
          <TeacherClassManager classId={classId} classToken={classToken} />
        </div>
      </div>
    </DashboardLayout>
  );
}
