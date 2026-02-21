'use client';

/**
 * Teacher First Login Page
 *
 * Flow:
 * 1. Teacher enters access code from admin
 * 2. System validates code and issues temp token
 * 3. Redirects to setup-password page with temp token
 */

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function TeacherFirstLoginPage() {
  const router = useRouter();
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/teacher-auth/first-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.code === 'ALREADY_ACTIVATED') {
          setError('Tili on jo aktivoitu. Kirjaudu sähköpostilla ja salasanalla.');
          setTimeout(() => {
            router.push('/teacher/login');
          }, 2000);
          return;
        }
        setError(data.error || 'Virheellinen pääsykoodi');
        return;
      }

      if (data.success && data.requirePasswordSetup && data.tempToken) {
        // Store temp token in sessionStorage for password setup
        sessionStorage.setItem('temp_token', data.tempToken);
        sessionStorage.setItem('teacher_name', data.teacher.name);
        sessionStorage.setItem('teacher_email', data.teacher.email);

        // Redirect to password setup page
        router.push('/teacher/setup-password');
      }
    } catch (err) {
      setError('Yhteyden muodostaminen epäonnistui');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-urak-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-urak-surface rounded-2xl shadow-xl p-8 border border-white/10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Ensimmäinen kirjautuminen
            </h1>
            <p className="text-urak-text-secondary">
              Syötä saamasi pääsykoodi aktivoidaksesi tilisi
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="accessCode" className="block text-sm font-medium text-neutral-200 mb-2">
                Pääsykoodi
              </label>
              <input
                id="accessCode"
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                placeholder="AB12CD34"
                className="w-full px-4 py-3 bg-white/5 border border-urak-border rounded-lg focus:ring-2 focus:ring-urak-accent-blue/40 text-white text-center text-2xl font-mono tracking-wider uppercase placeholder:text-gray-500"
                required
                autoFocus
                maxLength={12}
                disabled={loading}
              />
              <p className="mt-2 text-sm text-urak-text-tertiary">
                Sait pääsykoodin sähköpostilla tai ylläpitäjältä
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !accessCode.trim()}
              className="w-full bg-urak-accent-blue hover:bg-urak-accent-blue/90 text-urak-bg font-semibold py-3 px-4 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Tarkistetaan...
                </>
              ) : (
                'Jatka'
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-center text-sm text-urak-text-secondary">
              Oletko jo aktivoinut tilisi?{' '}
              <a href="/teacher/login" className="text-urak-accent-blue hover:text-urak-accent-blue/80 font-medium">
                Kirjaudu sisään
              </a>
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
