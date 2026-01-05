"use client";

/**
 * Admin Page for Managing Teachers
 * Generate individual access codes for teachers
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/Logo';
import Link from 'next/link';
import { GraduationCap, Copy, Check, Plus } from 'lucide-react';

interface Teacher {
  id: string;
  name: string;
  email?: string;
  school_name?: string;
  access_code: string;
  created_at: string;
}

export default function AdminTeachersPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [packageType, setPackageType] = useState<'premium' | 'yläaste'>('yläaste');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newTeacher, setNewTeacher] = useState<Teacher | null>(null);
  const [copied, setCopied] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to access the API - it returns 404 if not authenticated
        const response = await fetch('/api/teachers/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: '' }), // Empty name to trigger validation, not creation
        });

        // If we get 404, we're not authenticated
        if (response.status === 404) {
          router.push('/admin/login');
          return;
        }

        // Any other response means we're authenticated (even validation errors)
        setIsAuthenticated(true);
      } catch {
        // Network error - redirect to login
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [router]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setNewTeacher(null);

    try {
      const response = await fetch('/api/teachers/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email: email.trim() || null,
          schoolName: schoolName.trim() || null,
          package: packageType,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setNewTeacher(data.teacher);
        setName('');
        setEmail('');
        setSchoolName('');
      } else {
        setError(data.error || 'Koodin luominen epäonnistui');
      }
    } catch (err) {
      setError('Verkkovirhe. Yritä uudelleen.');
      console.error('Error generating code:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-400">Tarkistetaan käyttöoikeuksia...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <nav className="border-b border-white/10 bg-urak-bg/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo className="h-10 w-auto" />
          </Link>
          <Link href="/teacher/login">
            <Button variant="outline" size="sm">
              Opettajien hallintapaneeli
            </Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Opettajakoodien hallinta
          </h1>
          <p className="text-neutral-300">
            Luo yksilöllisiä opettajakoodeja jokaiselle opettajalle
          </p>
        </div>

        {/* Generate New Teacher Code */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Luo uusi opettajakoodi
            </CardTitle>
            <CardDescription>
              Täytä tiedot ja saat automaattisesti luodun yksilöllisen koodin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-200 mb-2">
                  Nimi <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="esim. Matti Virtanen"
                  required
                  className="w-full px-4 py-3 border-2 border-white/20 rounded-lg focus:border-primary focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all bg-white/5 backdrop-blur-sm text-white placeholder:text-neutral-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-200 mb-2">
                  Sähköposti (valinnainen)
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="esim. matti.virtanen@koulu.fi"
                  className="w-full px-4 py-3 border-2 border-white/20 rounded-lg focus:border-primary focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all bg-white/5 backdrop-blur-sm text-white placeholder:text-neutral-500"
                />
              </div>

              <div>
                <label htmlFor="schoolName" className="block text-sm font-medium text-neutral-200 mb-2">
                  Koulu (valinnainen)
                </label>
                <input
                  id="schoolName"
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="esim. Helsingin yläaste"
                  className="w-full px-4 py-3 border-2 border-white/20 rounded-lg focus:border-primary focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all bg-white/5 backdrop-blur-sm text-white placeholder:text-neutral-500"
                />
              </div>

              <div>
                <label htmlFor="package" className="block text-sm font-medium text-neutral-200 mb-2">
                  Paketti <span className="text-red-500">*</span>
                </label>
                <select
                  id="package"
                  value={packageType}
                  onChange={(e) => setPackageType(e.target.value as 'premium' | 'yläaste')}
                  required
                  className="w-full px-4 py-3 border-2 border-white/20 rounded-lg focus:border-primary focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all bg-white/5 backdrop-blur-sm text-white"
                >
                  <option value="yläaste">Yläaste (Standard)</option>
                  <option value="premium">Premium</option>
                </select>
                <p className="text-xs text-neutral-400 mt-1">
                  {packageType === 'premium' 
                    ? 'Premium: API-pääsy, 5v säilytys, vertailuanalyytiikka, PDF-raportit'
                    : 'Yläaste: Perustoiminnot, 3v säilytys'}
                </p>
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
                disabled={loading || !name.trim()}
              >
                {loading ? 'Luodaan...' : 'Luo opettajakoodi'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Display New Teacher Code */}
        {newTeacher && (
          <Card className="mb-8 border-2 border-green-300/50 bg-white/5 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Check className="h-5 w-5" />
                Opettajakoodi luotu onnistuneesti!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg border-2 border-green-300/50 p-6">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-neutral-300">Nimi:</label>
                    <p className="text-lg font-semibold text-gray-900">{newTeacher.name}</p>
                  </div>
                  {newTeacher.email && (
                    <div>
                      <label className="text-sm font-medium text-neutral-300">Sähköposti:</label>
                      <p className="text-lg text-gray-900">{newTeacher.email}</p>
                    </div>
                  )}
                  {newTeacher.school_name && (
                    <div>
                      <label className="text-sm font-medium text-neutral-300">Koulu:</label>
                      <p className="text-lg text-gray-900">{newTeacher.school_name}</p>
                    </div>
                  )}
                  <div className="pt-4 border-t border-gray-200">
                    <label className="text-sm font-medium text-neutral-300 block mb-2">
                      Opettajakoodi:
                    </label>
                    <div className="flex items-center gap-3">
                      <code className="flex-1 px-4 py-3 bg-neutral-800/30 border-2 border-gray-300 rounded-lg text-2xl font-bold text-gray-900 tracking-wider font-mono">
                        {newTeacher.access_code}
                      </code>
                      <Button
                        onClick={() => handleCopy(newTeacher.access_code)}
                        variant="outline"
                        size="lg"
                        className="flex items-center gap-2"
                      >
                        {copied ? (
                          <>
                            <Check className="h-4 w-4" />
                            Kopioitu!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Kopioi
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg p-4">
                <p className="text-sm text-primary">
                  <strong>Vinkki:</strong> Kopioi opettajakoodi ja lähetä se opettajalle sähköpostitse
                  tai muulla turvallisella tavalla. Koodi on yksilöllinen ja voimassa heti.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <GraduationCap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm text-primary">
                <p className="font-semibold mb-1">Mitä tapahtuu?</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Jokainen opettaja saa oman yksilöllisen koodin</li>
                  <li>Koodi on 8 merkin pituinen ja koostuu kirjaimista ja numeroista</li>
                  <li>Koodi toimii heti luonnin jälkeen</li>
                  <li>Voit luoda niin monta koodia kuin tarvitaan</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

