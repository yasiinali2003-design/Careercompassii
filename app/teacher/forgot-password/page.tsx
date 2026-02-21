'use client';

/**
 * Forgot Password Page
 *
 * Flow:
 * 1. Teacher enters email address
 * 2. System sends reset link to email (always returns success)
 * 3. Teacher receives email with reset link
 * 4. Clicks link to reset password
 */

import { useState, FormEvent } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch('/api/teacher-auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      // Always show success (prevents email enumeration)
      setSubmitted(true);
    } catch (err) {
      // Even on error, show success (prevents enumeration)
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-urak-bg flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-urak-surface rounded-2xl shadow-xl p-8 border border-white/10">
            {/* Success Icon */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Tarkista sähköpostisi
              </h2>
              <p className="text-urak-text-secondary">
                Jos sähköpostiosoite on rekisteröity, lähetimme sinne palautuslinkin.
              </p>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-200">
                  <p className="font-medium mb-1">Seuraavat vaiheet:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Tarkista sähköpostisi ({email})</li>
                    <li>Klikkaa palautuslinkkiä sähköpostissa</li>
                    <li>Aseta uusi salasana</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm text-urak-text-secondary">
              <p>
                <strong>Etkö saanut sähköpostia?</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Tarkista roskaposti-kansio</li>
                <li>Varmista, että kirjoitit oikean sähköpostiosoitteen</li>
                <li>Linkki on voimassa 1 tunnin</li>
              </ul>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <Link
                href="/teacher/login"
                className="block text-center text-sm text-urak-accent-blue hover:text-urak-accent-blue/80 font-medium"
              >
                ← Takaisin kirjautumiseen
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-urak-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-urak-surface rounded-2xl shadow-xl p-8 border border-white/10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Unohditko salasanan?
            </h1>
            <p className="text-urak-text-secondary">
              Syötä sähköpostiosoitteesi, niin lähetämme sinne palautuslinkin
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-200 mb-2">
                Sähköpostiosoite
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="matti@example.com"
                className="w-full px-4 py-3 bg-white/5 border border-urak-border rounded-lg focus:ring-2 focus:ring-urak-accent-blue/40 text-white placeholder:text-gray-500"
                required
                autoFocus
                maxLength={254}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full bg-urak-accent-blue hover:bg-urak-accent-blue/90 text-urak-bg font-semibold py-3 px-4 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Lähetetään...
                </>
              ) : (
                'Lähetä palautuslinkki'
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
            <p className="text-center text-sm text-urak-text-secondary">
              Muistitko salasanan?{' '}
              <Link href="/teacher/login" className="text-urak-accent-blue hover:text-urak-accent-blue/80 font-medium">
                Kirjaudu sisään
              </Link>
            </p>
            <p className="text-center text-sm text-urak-text-secondary">
              Ensimmäinen kerta?{' '}
              <Link href="/teacher/first-login" className="text-urak-accent-blue hover:text-urak-accent-blue/80 font-medium">
                Aktivoi tilisi
              </Link>
            </p>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-urak-text-tertiary">
            Tarvitsetko apua?{' '}
            <a href="mailto:support@careercompassi.fi" className="text-urak-accent-blue hover:text-urak-accent-blue/80">
              Ota yhteyttä tukeen
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
