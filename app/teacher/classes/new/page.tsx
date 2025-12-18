"use client";

/**
 * Create New Class Page
 * Teacher creates a class and generates PINs
 * Uses UraKompassi design system colors
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import {
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  BookOpen,
  Users,
  ClipboardList,
  BarChart3
} from 'lucide-react';

interface ClassData {
  classId: string;
  classToken: string;
  createdAt: string;
}

export default function NewClassPage() {
  const router = useRouter();
  const [teacherId, setTeacherId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = async () => {
    if (!teacherId.trim()) {
      setError('Syötä opettajan tunnus');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherId })
      });

      const data = await response.json();

      if (data.success) {
        setClassData({
          classId: data.classId,
          classToken: data.classToken,
          createdAt: data.createdAt
        });
      } else {
        setError(data.error || 'Luokan luominen epäonnistui');
      }
    } catch (err) {
      setError('Verkkovirhe. Yritä uudelleen.');
      console.error('Error creating class:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (classData) {
      navigator.clipboard.writeText(`https://urakompassi.fi/${classData.classToken}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Success state - class created
  if (classData) {
    return (
      <DashboardLayout
        title="Luokka luotu!"
        subtitle="Uusi luokka on valmis käytettäväksi"
      >
        {/* Back button */}
        <button
          onClick={() => router.push('/teacher/classes')}
          className="flex items-center gap-2 text-urak-text-secondary hover:text-white mb-6 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Takaisin luokkalistaan</span>
        </button>

        {/* Success card */}
        <div className="max-w-2xl">
          <div className="bg-urak-surface border border-urak-border rounded-2xl overflow-hidden">
            {/* Success header */}
            <div className="bg-urak-accent-blue/10 px-6 py-5 border-b border-urak-border">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-urak-accent-blue/20 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-urak-accent-blue" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Luokka luotu onnistuneesti!</h2>
                  <p className="text-sm text-urak-text-muted">Voit nyt jakaa linkin oppilaille</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Public link */}
              <div>
                <label className="block text-sm font-medium text-urak-text-secondary mb-2">
                  Julkinen linkki (anonyymi)
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white/5 border border-urak-border rounded-xl px-4 py-3">
                    <code className="text-urak-accent-blue text-sm font-mono break-all">
                      https://urakompassi.fi/{classData.classToken}
                    </code>
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-2 px-4 py-3 bg-urak-accent-blue/10 hover:bg-urak-accent-blue/20 border border-urak-accent-blue/20 rounded-xl text-urak-accent-blue transition-colors"
                  >
                    {copied ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-white/5 border border-urak-border rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-urak-text-secondary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-urak-text-secondary">
                    Tallenna tämä linkki turvallisesti. Oppilaat tarvitsevat sen nähdäkseen tuloksensa.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => router.push(`/teacher/classes/${classData.classId}`)}
                  className="flex-1 flex items-center justify-center gap-2 bg-urak-accent-blue hover:bg-urak-accent-blue/90 text-white px-6 py-3 rounded-xl font-medium transition-all"
                >
                  <ExternalLink className="h-4 w-4" />
                  Siirry luokkahallintaan
                </button>
                <button
                  onClick={() => setClassData(null)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-urak-border rounded-xl text-urak-text-secondary transition-colors"
                >
                  Luo toinen luokka
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Create form
  return (
    <DashboardLayout
      title="Luo uusi luokka"
      subtitle="Luo luokka ja jaa PIN-koodit oppilaille"
    >
      {/* Back button */}
      <button
        onClick={() => router.push('/teacher/classes')}
        className="flex items-center gap-2 text-urak-text-secondary hover:text-white mb-6 transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm">Takaisin luokkalistaan</span>
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2">
          <div className="bg-urak-surface border border-urak-border rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-urak-accent-blue/10 px-6 py-4 border-b border-urak-border">
              <h2 className="text-lg font-semibold text-white">Luokan tiedot</h2>
              <p className="text-sm text-urak-text-muted mt-0.5">
                Syötä tiedot uuden luokan luomiseksi
              </p>
            </div>

            {/* Form content */}
            <div className="p-6 space-y-6">
              {/* Error message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-300">{error}</p>
                      <p className="text-sm text-red-200/60 mt-1">
                        Luokan luominen epäonnistui. Tarkista tiedot ja yritä uudelleen.
                      </p>
                      <div className="text-sm text-red-200/60 mt-3 space-y-1">
                        <p className="font-medium">Ratkaisu:</p>
                        <ol className="list-decimal list-inside space-y-1 ml-2">
                          <li>Tarkista verkkoyhteys ja yritä uudelleen</li>
                          <li>Varmista että olet kirjautunut sisään</li>
                          <li>Jos ongelma jatkuu, ota yhteyttä tukeen: info@urakompassi.fi</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Teacher ID input */}
              <div>
                <label htmlFor="teacherId" className="block text-sm font-medium text-urak-text-secondary mb-2">
                  Opettajan tunnus
                </label>
                <input
                  id="teacherId"
                  type="text"
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  placeholder="esim. matti-opettaja"
                  className="w-full px-4 py-3 bg-white/5 border border-urak-border rounded-xl text-white placeholder:text-urak-text-muted focus:outline-none focus:ring-2 focus:ring-urak-accent-blue/40 focus:border-urak-accent-blue/40 transition-all"
                />
                <p className="text-sm text-urak-text-muted mt-2">
                  Tunnus auttaa tunnistamaan sinut omistajaksi
                </p>
              </div>

              {/* Submit button */}
              <button
                onClick={handleCreate}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-urak-accent-blue hover:bg-urak-accent-blue/90 disabled:bg-urak-accent-blue/50 text-white px-6 py-3.5 rounded-xl font-medium transition-all disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Luodaan...</span>
                  </>
                ) : (
                  <span>Luo luokka</span>
                )}
              </button>

              {/* Cancel button */}
              <button
                onClick={() => router.push('/teacher/classes')}
                className="w-full flex items-center justify-center px-6 py-3 bg-white/5 hover:bg-white/10 border border-urak-border rounded-xl text-urak-text-secondary transition-colors"
              >
                Peruuta
              </button>
            </div>
          </div>
        </div>

        {/* Info sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-urak-surface border border-urak-border rounded-2xl overflow-hidden">
            <div className="bg-urak-accent-blue/10 px-5 py-4 border-b border-urak-border">
              <h3 className="font-semibold text-white">Miten tämä toimii?</h3>
            </div>
            <div className="p-5">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-urak-accent-blue/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-4 w-4 text-urak-accent-blue" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">1. Luo luokka</p>
                    <p className="text-xs text-urak-text-muted mt-0.5">
                      Saat luokkatunnuksen ja julkisen linkin
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-urak-accent-blue/10 flex items-center justify-center flex-shrink-0">
                    <Users className="h-4 w-4 text-urak-accent-blue" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">2. Luo PIN-koodit</p>
                    <p className="text-xs text-urak-text-muted mt-0.5">
                      Jaa PIN-koodit oppilaille
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-urak-accent-blue/10 flex items-center justify-center flex-shrink-0">
                    <ClipboardList className="h-4 w-4 text-urak-accent-blue" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">3. Syötä nimilista</p>
                    <p className="text-xs text-urak-text-muted mt-0.5">
                      Vain omalle laitteellesi
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-urak-accent-blue/10 flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="h-4 w-4 text-urak-accent-blue" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">4. Seuraa tuloksia</p>
                    <p className="text-xs text-urak-text-muted mt-0.5">
                      Tarkastele tuloksia nimillä yhdistettynä
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
