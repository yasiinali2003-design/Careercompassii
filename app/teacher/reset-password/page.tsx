'use client';

/**
 * Reset Password Page
 *
 * Flow:
 * 1. Teacher arrives here from email link with reset token
 * 2. Enters new password (min 10 chars, strength meter)
 * 3. Confirms password
 * 4. System resets password and redirects to login
 */

import { useState, FormEvent, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    // Get token from URL
    const resetToken = searchParams.get('token');
    if (!resetToken) {
      setError('Virheellinen palautuslinkki. Pyydä uusi linkki.');
      return;
    }
    setToken(resetToken);
  }, [searchParams]);

  // Calculate password strength
  const getPasswordStrength = (): { strength: 'weak' | 'medium' | 'strong'; message: string; color: string } => {
    const length = password.length;

    if (length < 10) {
      return {
        strength: 'weak',
        message: 'Salasanan on oltava vähintään 10 merkkiä pitkä',
        color: 'text-red-600'
      };
    }

    let strength: 'weak' | 'medium' | 'strong' = 'medium';
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>\-_]/.test(password);
    const varietyCount = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

    if (length >= 16) {
      strength = 'strong';
    } else if (length >= 12 && varietyCount >= 3) {
      strength = 'strong';
    } else if (length >= 12) {
      strength = 'medium';
    }

    if (strength === 'strong') {
      return { strength, message: 'Vahva salasana!', color: 'text-green-600' };
    } else {
      return { strength, message: 'Hyvä! Käytä pidempi salasana parempaa turvallisuutta varten.', color: 'text-yellow-600' };
    }
  };

  const strengthInfo = password ? getPasswordStrength() : null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Virheellinen palautuslinkki');
      return;
    }

    // Validate password length
    if (password.length < 10) {
      setError('Salasanan on oltava vähintään 10 merkkiä pitkä');
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Salasanat eivät täsmää');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/teacher-auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Salasanan vaihto epäonnistui');
        return;
      }

      if (data.success) {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/teacher/login');
        }, 3000);
      }
    } catch (err) {
      setError('Yhteyden muodostaminen epäonnistui');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Salasana vaihdettu!
            </h2>
            <p className="text-gray-600 mb-4">
              Salasanasi on vaihdettu onnistuneesti.
            </p>
            <p className="text-sm text-gray-500">
              Sinut ohjataan kirjautumissivulle...
            </p>
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
              Aseta uusi salasana
            </h1>
            <p className="text-gray-600">
              Syötä uusi salasana tilillesi
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Uusi salasana
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Vähintään 10 merkkiä"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  autoFocus
                  minLength={10}
                  maxLength={128}
                  disabled={loading || !token}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Password Strength Meter */}
              {password && strengthInfo && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          strengthInfo.strength === 'strong'
                            ? 'bg-green-500 w-full'
                            : strengthInfo.strength === 'medium'
                            ? 'bg-yellow-500 w-2/3'
                            : 'bg-red-500 w-1/3'
                        }`}
                      />
                    </div>
                  </div>
                  <p className={`text-sm ${strengthInfo.color}`}>
                    {strengthInfo.message}
                  </p>
                </div>
              )}

              <p className="mt-2 text-sm text-gray-500">
                Vinkki: Käytä helposti muistettavaa lausetta, kuten &ldquo;kahvi-opettaja-kirja-2026&rdquo;
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Vahvista salasana
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Kirjoita salasana uudelleen"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                minLength={10}
                maxLength={128}
                disabled={loading || !token}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !token || !password || !confirmPassword || password !== confirmPassword || password.length < 10}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Vaihdetaan salasanaa...
                </>
              ) : (
                'Vaihda salasana'
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Muistitko salasanan?{' '}
              <a href="/teacher/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Kirjaudu sisään
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="text-gray-600">Ladataan...</div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
