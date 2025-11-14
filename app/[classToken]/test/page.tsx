"use client";

/**
 * Student Login Page
 * Students enter their PIN to take the test
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentLoginPage({
  params,
}: {
  params: { classToken: string };
}) {
  const { classToken } = params;
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const normalizePin = (value: string) =>
    value.toUpperCase().replace(/[^A-Z0-9]/g, '');

  const handleLogin = async () => {
    const normalizedPin = normalizePin(pin);
    const normalizedClassToken = classToken.trim();

    if (!normalizedPin) {
      setError('Syötä PIN-koodi');
      return;
    }

    setError('');
    
    // Validate PIN with API
    try {
      const response = await fetch('/api/validate-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: normalizedPin, classToken: normalizedClassToken }),
      });
      
      const data = await response.json();
      
      if (data.success && data.isValid) {
        // Redirect to test with PIN and classToken
        router.push(`/test?pin=${normalizedPin}&classToken=${normalizedClassToken}`);
      } else {
        setError('PIN-koodi ei ole voimassa. Tarkista koodi ja kokeile uudelleen.');
      }
    } catch (e) {
      setError('PIN-koodin vahvistus epäonnistui. Yritä myöhemmin uudelleen.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50/20 p-8">
      <div className="max-w-md mx-auto mt-20">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2">Kirjaudu testiin</h1>
          <p className="text-gray-600 mb-6">
            Syötä oppilaanunnesi antama PIN-koodi
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="pin" className="block font-semibold text-gray-700 mb-2">
                PIN-koodi
              </label>
              <input
                id="pin"
                type="text"
                value={pin}
                onChange={(e) => setPin(normalizePin(e.target.value))}
                placeholder="esim. A4K7"
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-mono text-2xl uppercase tracking-widest"
              />
              <p className="text-sm text-gray-500 mt-1">
                Anna oppilaanumero-opettajasi antama PIN-koodi
              </p>
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary transition font-semibold"
            >
              Aloita testi
            </button>
          </div>

          <div className="mt-6 bg-slate-50 border border-primary/20 rounded-lg p-4">
            <p className="text-sm text-primary">
              💡 <strong>Vinkki:</strong> Jos sinulla ei ole PIN-koodia, ota yhteyttä oppilaanumero-opettajaasi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

