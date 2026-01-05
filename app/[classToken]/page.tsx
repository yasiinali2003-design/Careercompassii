"use client";

/**
 * Public Anonymous Results Page
 * Shows test results by class token (no authentication required)
 * NO NAMES shown - completely anonymous
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

export default function PublicClassResultsPage({
  params,
}: {
  params: { classToken: string };
}) {
  const { classToken } = params;

  const reservedPaths = useMemo(
    () => ['legal', 'teacher', 'admin', 'api', 'test', 'ammatit', 'kategoriat', 'kouluille', 'meista'],
    []
  );
  const isReservedPath = reservedPaths.includes(classToken.toLowerCase());

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = useCallback(async () => {
    try {
      const response = await fetch(`/api/classes/${classToken}/results`);

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
  }, [classToken]);

  useEffect(() => {
    if (isReservedPath) {
      setLoading(false);
      return;
    }
    fetchResults();
  }, [fetchResults, isReservedPath]);

  if (isReservedPath) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto text-center py-12">
          <p className="text-urak-text-secondary">Sivua ei löytynyt</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center">
            <p className="text-red-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-urak-surface rounded-xl shadow-lg border border-white/10 p-8">
          <h1 className="text-3xl font-bold mb-2">Luokantulokset</h1>
          <p className="text-neutral-300 mb-6">Anonyymit testitulokset</p>

          {results.length === 0 ? (
            <div className="text-center py-12 text-neutral-300">
              Tuloksia ei vielä saatavilla
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-white/5">
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

          <div className="mt-8 bg-urak-surface/50 border border-white/10 rounded-lg p-4">
            <p className="text-sm text-primary">
              💡 <strong>Huomio:</strong> Kaikki tulokset ovat täysin anonyymeja. 
              Nimia eivät näy, eivätkä koskaan ole näkyneet tämän sivun yhteydessä.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

