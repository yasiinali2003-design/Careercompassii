'use client';

/**
 * TEST PAGE FOR METRICS TRACKING
 * Simple page to verify metrics tracking works without needing database
 */

import { useEffect, useState } from 'react';
import { trackSessionStart, trackCareerClick, trackNoneRelevant, incrementCareerClickCounter } from '@/lib/metrics/tracking';

export default function TestMetricsPage() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  useEffect(() => {
    addLog('Page loaded');
    // Test session start
    trackSessionStart(
      ['test-career-1', 'test-career-2'],
      ['tekija', 'auttaja'],
      'TASO2',
      'LUKIO'
    );
    addLog('✓ trackSessionStart() called');
  }, []);

  const handleTestCareerClick = () => {
    trackCareerClick(
      'test-career-1',
      'Test Career Title',
      1,
      85.5,
      'tekija',
      'TASO2',
      'LUKIO'
    );
    incrementCareerClickCounter();
    addLog('✓ trackCareerClick() called (check Network tab for POST /api/metrics)');
  };

  const handleTestNoneRelevant = () => {
    trackNoneRelevant(
      ['test-career-1', 'test-career-2'],
      'TASO2',
      'LUKIO',
      'Just testing the system'
    );
    addLog('✓ trackNoneRelevant() called (check Network tab for POST /api/metrics)');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Metrics Tracking Test Page</h1>

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>Open Browser DevTools (F12 or Cmd+Option+I)</li>
            <li>Go to Network tab</li>
            <li>Filter by "metrics" or "XHR"</li>
            <li>Click the buttons below</li>
            <li>Check for POST requests to /api/metrics</li>
            <li>Click on each request to see the payload</li>
          </ol>
        </div>

        <div className="space-y-4 mb-8">
          <button
            onClick={handleTestCareerClick}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Test Career Click Tracking
          </button>

          <button
            onClick={handleTestNoneRelevant}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Test "None Relevant" Tracking
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Event Log</h2>
          <div className="bg-gray-900 rounded p-4 font-mono text-sm space-y-1">
            {logs.length === 0 ? (
              <div className="text-gray-500">No events yet...</div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="text-green-400">{log}</div>
              ))
            )}
          </div>
        </div>

        <div className="mt-8 bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-6">
          <h3 className="text-yellow-400 font-semibold mb-2">⚠️ Expected Behavior</h3>
          <ul className="list-disc list-inside space-y-1 text-yellow-200 text-sm">
            <li>API calls will show in Network tab</li>
            <li>They may return 503 "Database not configured" - this is OK!</li>
            <li>The important part is that the tracking functions are being called</li>
            <li>Once database is set up, these will work properly</li>
          </ul>
        </div>

        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h3 className="font-semibold mb-2">Session ID:</h3>
          <code className="text-green-400 text-sm break-all">
            {typeof window !== 'undefined' && sessionStorage.getItem('urakompassi_session_id')}
          </code>
        </div>
      </div>
    </div>
  );
}
