"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function ChallengePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const returnTo = searchParams.get('returnTo') || '/';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function verifyChallenge() {
      try {
        // Get challenge token
        const tokenResponse = await fetch('/api/anti-scraping/verify');
        if (!tokenResponse.ok) {
          throw new Error('Failed to get challenge token');
        }
        
        const { token } = await tokenResponse.json();
        
        // Verify JavaScript is enabled
        const verifyResponse = await fetch('/api/anti-scraping/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, challenge: 'js-enabled' })
        });
        
        if (!verifyResponse.ok) {
          throw new Error('Challenge verification failed');
        }
        
        // Success - redirect back
        setTimeout(() => {
          router.push(returnTo);
        }, 500);
      } catch (err) {
        setError('Verification failed. Please enable JavaScript and try again.');
        setLoading(false);
      }
    }
    
    verifyChallenge();
  }, [returnTo, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <svg
              className="w-8 h-8 text-primary animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Verifying Access
          </h1>
          <p className="text-slate-600">
            {loading
              ? 'Please wait while we verify your browser...'
              : error || 'Redirecting...'}
          </p>
        </div>
        
        {error && (
          <Button
            onClick={() => window.location.reload()}
            className="w-full"
          >
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}


