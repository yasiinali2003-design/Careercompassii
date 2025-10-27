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

  const handleLogin = () => {
    if (!pin.trim()) {
      setError('Syötä PIN-koodi');
      return;
    }

    // TODO: Validate PIN with API
    
    // Redirect to test with PIN and classToken
    router.push(`/test?pin=${pin}&classToken=${classToken}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
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
                onChange={(e) => setPin(e.target.value.toUpperCase())}
                placeholder="esim. A4K7"
                maxLength={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-mono text-2xl uppercase tracking-widest"
              />
              <p className="text-sm text-gray-500 mt-1">
                Anna oppilaanumero-opettajasi antama PIN-koodi
              </p>
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Aloita testi
            </button>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              💡 <strong>Vinkki:</strong> Jos sinulla ei ole PIN-koodia, ota yhteyttä oppilaanumero-opettajaasi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

