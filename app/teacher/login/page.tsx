"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import ScrollNav from '@/components/ScrollNav';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { GraduationCap, Lock, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { getCsrfTokenFromCookie } from '@/lib/csrf';

export default function TeacherLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const returnTo = searchParams.get('returnTo') || '/teacher/classes';

  useEffect(() => {
    // Check if already authenticated
    const checkAuth = async () => {
      const response = await fetch('/api/teacher-auth/check');
      const data = await response.json();
      if (data.authenticated) {
        router.push(returnTo);
      }
    };
    checkAuth();
  }, [router, returnTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedPassword = password.trim();

      if (!normalizedEmail || !normalizedPassword) {
        setError('Syötä sähköposti ja salasana');
        setLoading(false);
        return;
      }

      const csrfToken = getCsrfTokenFromCookie();
      const response = await fetch('/api/teacher-auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken && { 'x-csrf-token': csrfToken }),
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password: normalizedPassword
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to the intended page or dashboard
        router.push(returnTo);
        router.refresh(); // Ensure middleware recognizes the new cookie
      } else if (data.code === 'PASSWORD_NOT_SET' || data.requirePasswordSetup) {
        // Teacher hasn't activated account yet
        setError('Aktivoi tilisi ensin pääsykoodilla');
        setTimeout(() => {
          router.push('/teacher/first-login');
        }, 2000);
      } else {
        setError(data.error || 'Virheelliset kirjautumistiedot');
      }
    } catch {
      setError('Verkkovirhe. Yritä uudelleen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      <ScrollNav />

      <AnimatedSection className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-16 md:py-24">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-10 text-center">
            <Link href="/" className="inline-block hover:opacity-80 transition-opacity mb-6">
              <Logo className="h-12 w-auto mx-auto" />
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Opettajien hallintapaneeli</h1>
            <p className="text-sm text-urak-text-secondary">Kirjaudu sisään sähköpostilla ja salasanalla</p>
          </div>

          {/* Login Card */}
          <div className="bg-urak-surface/70 border border-urak-border/60 rounded-3xl px-6 py-8 md:px-8 md:py-10 shadow-lg shadow-black/25">
            {/* Lock Icon */}
            <div className="flex items-center justify-center mb-6">
              <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center p-3">
                <Lock className="h-5 w-5 text-urak-accent-blue" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-white mb-2">Kirjaudu sisään</h2>
              <p className="text-sm text-urak-text-secondary">
                Syötä sähköpostisi ja salasanasi
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm text-urak-text-secondary mb-2">
                  Sähköpostiosoite
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="matti@example.com"
                  required
                  autoFocus
                  className="w-full px-4 py-3 bg-white/5 border border-urak-border rounded-xl focus:outline-none focus:ring-2 focus:ring-urak-accent-blue/40 text-white placeholder:text-gray-500 transition-all"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm text-urak-text-secondary mb-2">
                  Salasana
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Syötä salasanasi"
                    required
                    className="w-full px-4 py-3 pr-12 bg-white/5 border border-urak-border rounded-xl focus:outline-none focus:ring-2 focus:ring-urak-accent-blue/40 text-white placeholder:text-gray-500 transition-all"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-urak-accent-blue hover:bg-urak-accent-blue/90 text-urak-bg font-medium rounded-full py-3 text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  'Kirjaudutaan...'
                ) : (
                  <>
                    Kirjaudu sisään
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Forgot Password Link */}
            <div className="mt-4 text-center space-y-2">
              <Link
                href="/teacher/forgot-password"
                className="block text-sm text-urak-accent-blue hover:text-urak-accent-blue/80 transition-colors"
              >
                Unohditko salasanan?
              </Link>
              <Link
                href="/teacher/first-login"
                className="block text-sm text-urak-text-secondary hover:text-white transition-colors"
              >
                Ensimmäinen kirjautuminen? Aktivoi tili pääsykoodilla
              </Link>
            </div>

            {/* Opettajille Info Box */}
            <div className="mt-8 pt-8 border-t border-urak-border/40">
              <div className="bg-urak-surface/40 border border-urak-border/40 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <GraduationCap className="h-4 w-4 text-urak-accent-blue mt-0.5 flex-shrink-0" />
                  <div className="text-xs md:text-sm text-urak-text-secondary">
                    <p className="font-semibold text-white mb-1">Ensimmäinen kerta?</p>
                    <p className="mb-2">
                      Aktivoi tilisi ensin pääsykoodilla, jonka sait sähköpostissa.
                    </p>
                    <Link
                      href="/teacher/first-login"
                      className="text-urak-accent-blue hover:text-urak-accent-blue/80 transition-colors font-medium"
                    >
                      Aktivoi tili →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Back Link */}
            <div className="mt-6 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-urak-text-muted hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Takaisin etusivulle
              </Link>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-8 text-center">
            <p className="text-xs text-urak-text-muted">
              Tämä alue on suojattu. Vain opettajilla on pääsy.
            </p>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
