'use client';

/**
 * Setup Password Page
 *
 * Flow:
 * 1. Teacher arrives here from first-login with temp token
 * 2. Sets password (min 10 chars, strength meter)
 * 3. Confirms password
 * 4. System creates session and redirects to dashboard
 */

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SetupPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Check if temp token exists
    const tempToken = sessionStorage.getItem('temp_token');
    const name = sessionStorage.getItem('teacher_name');
    const email = sessionStorage.getItem('teacher_email');

    if (!tempToken) {
      router.push('/teacher/first-login');
      return;
    }

    setTeacherName(name || '');
    setTeacherEmail(email || '');
  }, [router]);

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
      const tempToken = sessionStorage.getItem('temp_token');

      if (!tempToken) {
        setError('Istunto on vanhentunut. Aloita alusta.');
        setTimeout(() => {
          router.push('/teacher/first-login');
        }, 2000);
        return;
      }

      const response = await fetch('/api/teacher-auth/set-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tempToken,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Salasanan asettaminen epäonnistui');
        return;
      }

      if (data.success) {
        // Clear session storage
        sessionStorage.removeItem('temp_token');
        sessionStorage.removeItem('teacher_name');
        sessionStorage.removeItem('teacher_email');

        // Redirect to dashboard
        router.push(data.redirectTo || '/teacher/dashboard');
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Tervetuloa{teacherName ? `, ${teacherName}` : ''}!
            </h1>
            <p className="text-urak-text-secondary">
              Aseta salasana tilillesi
            </p>
            {teacherEmail && (
              <p className="text-sm text-urak-text-tertiary mt-1">
                {teacherEmail}
              </p>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-200 mb-2">
                Salasana
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Vähintään 10 merkkiä"
                  className="w-full px-4 py-3 pr-12 bg-white/5 border border-urak-border rounded-lg focus:ring-2 focus:ring-urak-accent-blue/40 text-white placeholder:text-gray-500"
                  required
                  autoFocus
                  minLength={10}
                  maxLength={128}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
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

              <p className="mt-2 text-sm text-urak-text-tertiary">
                Vinkki: Käytä helposti muistettavaa lausetta, kuten &ldquo;kahvi-opettaja-kirja-2026&rdquo;
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-200 mb-2">
                Vahvista salasana
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Kirjoita salasana uudelleen"
                className="w-full px-4 py-3 bg-white/5 border border-urak-border rounded-lg focus:ring-2 focus:ring-urak-accent-blue/40 text-white placeholder:text-gray-500"
                required
                minLength={10}
                maxLength={128}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !password || !confirmPassword || password !== confirmPassword || password.length < 10}
              className="w-full bg-urak-accent-blue hover:bg-urak-accent-blue/90 text-urak-bg font-semibold py-3 px-4 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Asetetaan salasanaa...
                </>
              ) : (
                'Aseta salasana ja kirjaudu'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
