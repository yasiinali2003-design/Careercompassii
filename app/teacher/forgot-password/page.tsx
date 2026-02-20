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
      const response = await fetch('/api/teacher-auth/forgot-password', {
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {/* Success Icon */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Tarkista sähköpostisi
              </h2>
              <p className="text-gray-600">
                Jos sähköpostiosoite on rekisteröity, lähetimme sinne palautuslinkin.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Seuraavat vaiheet:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Tarkista sähköpostisi ({email})</li>
                    <li>Klikkaa palautuslinkkiä sähköpostissa</li>
                    <li>Aseta uusi salasana</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-600">
              <p>
                <strong>Etkö saanut sähköpostia?</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Tarkista roskaposti-kansio</li>
                <li>Varmista, että kirjoitit oikean sähköpostiosoitteen</li>
                <li>Linkki on voimassa 1 tunnin</li>
              </ul>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link
                href="/teacher/login"
                className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Unohditko salasanan?
            </h1>
            <p className="text-gray-600">
              Syötä sähköpostiosoitteesi, niin lähetämme sinne palautuslinkin
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Sähköpostiosoite
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="matti@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                autoFocus
                maxLength={254}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
          <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
            <p className="text-center text-sm text-gray-600">
              Muistitko salasanan?{' '}
              <Link href="/teacher/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Kirjaudu sisään
              </Link>
            </p>
            <p className="text-center text-sm text-gray-600">
              Ensimmäinen kerta?{' '}
              <Link href="/teacher/first-login" className="text-blue-600 hover:text-blue-700 font-medium">
                Aktivoi tilisi
              </Link>
            </p>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Tarvitsetko apua?{' '}
            <a href="mailto:support@careercompassi.fi" className="text-blue-600 hover:text-blue-700">
              Ota yhteyttä tukeen
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
