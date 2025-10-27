"use client";

/**
 * Public Anonymous Results Page
 * Shows test results by class token (no authentication required)
 * NO NAMES shown - completely anonymous
 */

import { useEffect, useState } from 'react';

export default function PublicClassResultsPage({
  params,
}: {
  params: { classToken: string };
}) {
  const { classToken } = params;
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResults();
  }, [classToken]);

  const fetchResults = async () => {
    try {
      const response = await fetch(
        `https://careercompassii.vercel.app/.netlify/functions/get-class-results?classToken=${classToken}`
      );
      
      const data = await response.json();
      if (data.success) {
        setResults(data.results);
      } else {
        setError('Luokkahaku epäonnistui');
      }
    } catch (err) {
      console.error('Error fetching results:', err);
      setError('Verkkovirhe');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2">Luokantulokset</h1>
          <p className="text-gray-600 mb-6">Anonyymit testitulokset</p>

          {results.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              Tuloksia ei vielä saatavilla
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-3 text-left">PIN</th>
                    <th className="border p-3 text-left">Suosituin ammatti</th>
                    <th className="border p-3 text-left">Päivämäärä</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, i) => {
                    const topCareer = result.result_payload?.top_careers?.[0];
                    return (
                      <tr key={i}>
                        <td className="border p-3 font-mono text-sm">{result.pin}</td>
                        <td className="border p-3">
                          {topCareer?.title || '—'}
                        </td>
                        <td className="border p-3 text-sm">
                          {new Date(result.created_at).toLocaleDateString('fi-FI')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              💡 <strong>Huomio:</strong> Kaikki tulokset ovat täysin anonyymeja. 
              Nimia eivät näy, eivätkä koskaan ole näkyneet tämän sivun yhteydessä.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

