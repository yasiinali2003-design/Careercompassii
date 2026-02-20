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
              Ensimmäinen kirjautuminen
            </h1>
            <p className="text-gray-600">
              Syötä saamasi pääsykoodi aktivoidaksesi tilisi
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-2">
                Pääsykoodi
              </label>
              <input
                id="accessCode"
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                placeholder="AB12CD34"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl font-mono tracking-wider uppercase"
                required
                autoFocus
                maxLength={12}
                disabled={loading}
              />
              <p className="mt-2 text-sm text-gray-500">
                Sait pääsykoodin sähköpostilla tai ylläpitäjältä
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !accessCode.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Oletko jo aktivoinut tilisi?{' '}
              <a href="/teacher/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Kirjaudu sisään
              </a>
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
