"use client";

/**
 * Teacher Class Manager Component
 * Handles: PIN generation, name mapping (local), results viewing
 */

import { useState, useEffect } from 'react';
import { 
  saveMappingToStorage, 
  loadMappingFromStorage,
  exportMappingAsFile,
  importMappingFromFile
} from '@/lib/teacherCrypto';
import { generateStudentPin } from '@/lib/teacherCrypto';

interface Props {
  classId: string;
  classToken: string;
}

export default function TeacherClassManager({ classId, classToken }: Props) {
  const [activeTab, setActiveTab] = useState<'pins' | 'names' | 'results'>('pins');
  const [pins, setPins] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [nameMapping, setNameMapping] = useState<Record<string, string>>({});
  const [results, setResults] = useState<any[]>([]);

  // Load existing PINs
  useEffect(() => {
    fetchPins();
    loadNameMapping();
    fetchResults();
  }, [classId]);

  const fetchPins = async () => {
    try {
      const response = await fetch(`/api/classes/${classId}/pins`);
      const data = await response.json();
      if (data.success) {
        setPins(data.pins.map((p: any) => p.pin));
      }
    } catch (error) {
      console.error('Error fetching PINs:', error);
    }
  };

  const loadNameMapping = () => {
    const mapping = loadMappingFromStorage(classId);
    if (mapping) {
      setNameMapping(mapping);
    }
  };

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/classes/${classId}/results`);
      const data = await response.json();
      if (data.success) {
        setResults(data.results);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  const generatePins = async (count: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/classes/${classId}/pins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count })
      });

      const data = await response.json();
      if (data.success) {
        setPins(data.pins);
      } else {
        alert('Virhe PIN-koodien luonnissa');
      }
    } catch (error) {
      console.error('Error generating PINs:', error);
      alert('Verkkovirhe');
    } finally {
      setLoading(false);
    }
  };

  const updateNameMapping = (pin: string, name: string) => {
    const updated = { ...nameMapping, [pin]: name };
    setNameMapping(updated);
    saveMappingToStorage(classId, updated);
  };

  const handleExport = () => {
    const passphrase = prompt('Syötä salasana salaukseen:');
    if (passphrase) {
      try {
        exportMappingAsFile(nameMapping, passphrase, classId);
      } catch (error) {
        alert('Virhe viennissä');
      }
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const passphrase = prompt('Syötä salasana purkamiseen:');
    if (!passphrase) return;

    try {
      const mapping = await importMappingFromFile(file, passphrase);
      setNameMapping(mapping);
      saveMappingToStorage(classId, mapping);
      alert('Nimilista tuotu onnistuneesti!');
    } catch (error) {
      alert('Virhe: Väärä salasana tai viallinen tiedosto');
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('pins')}
            className={`py-2 px-4 font-medium ${
              activeTab === 'pins'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            PIN-koodit
          </button>
          <button
            onClick={() => setActiveTab('names')}
            className={`py-2 px-4 font-medium ${
              activeTab === 'names'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Nimilista
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`py-2 px-4 font-medium ${
              activeTab === 'results'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Tulokset
          </button>
        </div>
      </div>

      {/* PIN Tab */}
      {activeTab === 'pins' && (
        <div className="space-y-4">
          <div className="flex gap-4">
            <button
              onClick={() => generatePins(10)}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Luodaan...' : 'Luo 10 PIN-koodia'}
            </button>
            <button
              onClick={() => generatePins(25)}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Luodaan...' : 'Luo 25 PIN-koodia'}
            </button>
          </div>

          {pins.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Luo PIN-koodit ({pins.length} kpl)</h3>
              <div className="grid grid-cols-4 gap-2">
                {pins.map((pin, i) => (
                  <div key={i} className="bg-white p-2 rounded border text-center font-mono text-sm">
                    {pin}
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  const csv = pins.join('\n');
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `pins-${classId.substring(0, 8)}.csv`;
                  a.click();
                }}
                className="mt-4 text-blue-600 hover:underline"
              >
                📥 Lataa CSV-muodossa
              </button>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              💡 <strong>Vinkki:</strong> Tulosta tai tallenna PIN-koodit turvallisesti. 
              Jaa ne oppilaille, jotta he voivat kirjautua testiin.
            </p>
          </div>
        </div>
      )}

      {/* Names Tab */}
      {activeTab === 'names' && (
        <div className="space-y-4">
          {pins.length === 0 ? (
            <p className="text-gray-600">Luo ensin PIN-koodit</p>
          ) : (
            <>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ <strong>Turvallisuus:</strong> Nimet tallennetaan VAIN omalle laitteellesi. 
                  Nimet eivät koskaan poistu tältä selaimelta.
                </p>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {pins.map((pin) => (
                  <div key={pin} className="flex gap-4 items-center">
                    <span className="font-mono text-sm bg-gray-100 px-3 py-2 rounded w-24 text-center">
                      {pin}
                    </span>
                    <input
                      type="text"
                      value={nameMapping[pin] || ''}
                      onChange={(e) => updateNameMapping(pin, e.target.value)}
                      placeholder="Oppilaan nimi"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleExport}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  📤 Vie salattuna
                </button>
                <label className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 cursor-pointer inline-block">
                  📥 Tuo salattua
                  <input
                    type="file"
                    onChange={handleImport}
                    className="hidden"
                    accept=".json"
                  />
                </label>
              </div>
            </>
          )}
        </div>
      )}

      {/* Results Tab */}
      {activeTab === 'results' && (
        <div className="space-y-4">
          {results.length === 0 ? (
            <p className="text-gray-600">Tuloksia ei vielä saatavilla</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-2 text-left">Nimi</th>
                    <th className="border p-2 text-left">PIN</th>
                    <th className="border p-2 text-left">Aikana</th>
                    <th className="border p-2 text-left">Keskiarvo</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, i) => (
                    <tr key={i}>
                      <td className="border p-2">{nameMapping[result.pin] || '—'}</td>
                      <td className="border p-2 font-mono text-sm">{result.pin}</td>
                      <td className="border p-2">
                        {new Date(result.created_at).toLocaleDateString('fi-FI')}
                      </td>
                      <td className="border p-2">
                        {result.result_payload?.dimension_scores ? 
                          (() => {
                            const scores = result.result_payload.dimension_scores as Record<string, number>;
                            const avg = Object.values(scores).reduce((a, b) => a + b, 0) / 4;
                            return Math.round(avg) + '%';
                          })()
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Public Link */}
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="font-semibold mb-2">Julkinen linkki (anonyymi):</p>
        <p className="text-sm text-blue-600 break-all">
          https://careercompassii.vercel.app/{classToken}
        </p>
      </div>
    </div>
  );
}

