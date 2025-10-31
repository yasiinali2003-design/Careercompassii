"use client";

/**
 * Create New Class Page
 * Teacher creates a class and generates PINs
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateClassToken } from '@/lib/teacherCrypto';
import TeacherNav from '@/components/TeacherNav';
import TeacherFooter from '@/components/TeacherFooter';

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

  if (classData) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
        <TeacherNav />
        <div className="flex-1 max-w-4xl mx-auto p-8 w-full">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-6">Luokka luotu!</h1>
            
            <div className="space-y-4 mb-8">
              
              <div>
                <label className="font-semibold text-gray-700">Julkinen linkki (anonyymi):</label>
                <p className="text-blue-600 font-mono text-sm bg-blue-50 p-2 rounded break-all">
                  https://careercompassii.vercel.app/{classData.classToken}
                </p>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ Tallenna tämä linkki turvallisesti. Oppilaat tarvitsevat sen nähdäkseen tuloksensa.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => router.push(`/teacher/classes/${classData.classId}`)}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Siirry luokkahallintaan
              </button>
              <button
                onClick={() => setClassData(null)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Luo toinen luokka
              </button>
            </div>
          </div>
        </div>
        <TeacherFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
      <TeacherNav />
      <div className="flex-1 max-w-2xl mx-auto p-8 w-full">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">Luo uusi luokka</h1>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 font-semibold">{error}</p>
              <p className="text-red-700 text-sm mt-2">
                Tämä tapahtuu jos tietokantatauluja ei ole vielä luotu. 
                Päätetään tämä yhdessä pian!
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="teacherId" className="block font-semibold text-gray-700 mb-2">
                Opettajan tunnus
              </label>
              <input
                id="teacherId"
                type="text"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                placeholder="esim. matti-opettaja"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Tunnus auttaa tunnistamaan sinut omistajaksi
              </p>
            </div>

            <button
              onClick={handleCreate}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Luodaan...' : 'Luo luokka'}
            </button>

            <button
              onClick={() => router.push('/teacher/classes')}
              className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition"
            >
              Peruuta
            </button>
          </div>

          <div className="mt-8 space-y-4">
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Mitä tapahtuu?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>1. Luo luokka → saat luokkatunnuksen ja julkisen linkin</li>
                <li>2. Luo PIN-koodit → jaa oppilaille</li>
                <li>3. Syötä nimilista (vain omalle laitteellesi)</li>
                <li>4. Tarkastele tuloksia nimillä yhdistettynä</li>
              </ul>
            </div>
            </div>
          </div>
        </div>
        <TeacherFooter />
      </div>
    );
  }

