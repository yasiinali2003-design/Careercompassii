/**
 * Share Results Component
 * Provides social sharing and referral functionality
 */

'use client';

import { useState, useEffect } from 'react';
import { Share2, Copy, Check, Facebook, Twitter, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  generateReferralCode, 
  createReferralUrl, 
  createShareText,
  trackReferral,
  extractReferralCodeFromUrl 
} from '@/lib/referralSystem';

interface ShareResultsProps {
  topCareers: Array<{ title: string }>;
  cohort: string;
}

export function ShareResults({ topCareers, cohort }: ShareResultsProps) {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>('');

  useEffect(() => {
    // Generate or retrieve referral code
    const storedCode = localStorage.getItem('careerCompassiUserReferralCode');
    if (storedCode) {
      setReferralCode(storedCode);
    } else {
      const newCode = generateReferralCode();
      setReferralCode(newCode);
      localStorage.setItem('careerCompassiUserReferralCode', newCode);
    }

    // Check if user came from a referral link
    const incomingRef = extractReferralCodeFromUrl();
    if (incomingRef) {
      trackReferral(incomingRef);
    }

    // Generate share URL
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    setShareUrl(currentUrl);
  }, []);

  const careerTitles = topCareers.map(c => c.title);
  const shareText = referralCode 
    ? createShareText(careerTitles, referralCode)
    : createShareText(careerTitles);

  const referralUrl = referralCode ? createReferralUrl(referralCode) : shareUrl;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CareerCompassi - Urapolku-testi',
          text: shareText,
          url: referralUrl,
        });
      } catch (err) {
        // User cancelled or error occurred
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback to copy
      handleCopy();
    }
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(shareText);
    const url = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(referralUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Jaa tuloksesi kavereiden kanssa
        </h3>
        <p className="text-sm text-gray-600">
          Auta muita löytämään oma urapolku-testin avulla
        </p>
      </div>

      {/* Referral Code */}
      {referralCode && (
        <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                Sinun suosituslinkkisi:
              </label>
              <div className="text-sm font-mono text-gray-800 break-all">
                {referralUrl}
              </div>
            </div>
            <Button
              onClick={handleCopy}
              variant="outline"
              size="sm"
              className="shrink-0"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Kopioitu!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Kopioi
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Share Buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        {/* Native Share (mobile) */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <Button
            onClick={handleShare}
            variant="default"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Jaa
          </Button>
        )}

        {/* Social Media Buttons */}
        <Button
          onClick={shareToFacebook}
          variant="outline"
          className="bg-white hover:bg-gray-50"
        >
          <Facebook className="h-4 w-4 mr-2 text-blue-600" />
          Facebook
        </Button>

        <Button
          onClick={shareToTwitter}
          variant="outline"
          className="bg-white hover:bg-gray-50"
        >
          <Twitter className="h-4 w-4 mr-2 text-blue-400" />
          Twitter
        </Button>

        <Button
          onClick={shareToLinkedIn}
          variant="outline"
          className="bg-white hover:bg-gray-50"
        >
          <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
          LinkedIn
        </Button>
      </div>

      {/* Info Text */}
      <p className="text-xs text-gray-500 text-center mt-4">
        Kun joku käyttää sinun linkkiäsi, se auttaa meitä auttamaan enemmän ihmisiä löytämään oman urapolunsa.
      </p>
    </div>
  );
}

