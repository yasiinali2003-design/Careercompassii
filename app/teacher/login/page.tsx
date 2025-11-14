"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/Logo';
import { GraduationCap, Lock, ArrowRight } from 'lucide-react';

export default function TeacherLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
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
      const normalized = password.trim();
      if (!normalized) {
        setError('Syötä opettajakoodi');
        setLoading(false);
        return;
      }
      const response = await fetch('/api/teacher-auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: normalized }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to the intended page or dashboard
        router.push(returnTo);
        router.refresh(); // Ensure middleware recognizes the new cookie
      } else {
        setError(data.error || 'Opettajakoodi ei kelpaa');
      }
    } catch (err) {
      setError('Verkkovirhe. Yritä uudelleen.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
            <Logo className="h-12 w-auto mx-auto mb-4" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Opettajien hallintapaneeli</h1>
          <p className="text-sm text-gray-600 mt-2">Kirjaudu sisään opettajakoodilla</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg border-2 border-primary/20">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Kirjaudu sisään</CardTitle>
            <CardDescription className="text-center">
              Syötä opettajakoodi päästäksesi hallintapaneeliin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Opettajakoodi
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Syötä koodi"
                  required
                  autoFocus
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  'Kirjaudutaan...'
                ) : (
                  <>
                    Kirjaudu sisään
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <GraduationCap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-primary">
                    <p className="font-semibold mb-1">Opettajille</p>
                    <p>
                      Jos sinulla ei ole opettajakoodia, ota yhteyttä ylläpitoon tai tarkista
                      sähköpostistasi koodi.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Takaisin etusivulle
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Tämä alue on suojattu. Vain opettajilla on pääsy.
          </p>
        </div>
      </div>
    </div>
  );
}

