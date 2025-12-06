/**
 * Share Results Component
 * Provides social sharing and referral functionality
 */

'use client';

import { useState, useEffect } from 'react';
import { Share2, Copy, Check, Facebook, Twitter, Linkedin } from 'lucide-react';
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

  const careerTitles = (Array.isArray(topCareers) ? topCareers : [])
    .filter(c => c && typeof c === 'object' && c.title)
    .map(c => c.title);
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
          title: 'Urakompassi - Urapolku-testi',
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
    <div className="mt-8">
      <div
        className="
          relative
          max-w-4xl w-full mx-auto
          overflow-hidden
          rounded-[32px]
          border border-cyan-400/10
          bg-gradient-to-b from-white/6 via-white/3 to-white/2
          bg-clip-padding
          backdrop-blur-xl
          shadow-[0_24px_80px_rgba(0,0,0,0.65)]
          px-8 py-10 md:px-12 md:py-14
        "
      >
        {/* Top glow effect */}
        <div className="pointer-events-none absolute inset-x-8 -top-32 h-40 rounded-full bg-gradient-to-b from-cyan-300/25 to-transparent blur-3xl" />

        <div className="relative space-y-6">
          {/* Header */}
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-white mb-3">
              Jaa tuloksesi kavereiden kanssa
            </h3>
            <p className="text-sm md:text-base text-slate-200/80">
              Auta muita löytämään oma urapolku-testin avulla
            </p>
          </div>

          {/* Referral Code */}
          {referralCode && (
            <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <label className="text-xs font-medium text-slate-300/70 mb-2 block">
                    Sinun suosituslinkkisi:
                  </label>
                  <div className="text-sm font-mono text-white break-all">
                    {referralUrl}
                  </div>
                </div>
                <button
                  onClick={handleCopy}
                  className="
                    shrink-0
                    rounded-full
                    border border-white/20
                    bg-white/5
                    backdrop-blur-sm
                    px-4 py-2
                    text-sm font-medium text-white
                    transition
                    hover:bg-white/10
                    hover:border-white/30
                    focus-visible:outline-none
                    focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
                    flex items-center gap-2
                  "
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
                </button>
              </div>
            </div>
          )}

          {/* Share Buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            {/* Native Share (mobile) */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleShare}
                className="
                  group
                  relative inline-flex items-center justify-center
                  rounded-full
                  bg-gradient-to-r from-sky-500 to-blue-500
                  px-6 py-3
                  text-sm font-semibold text-white
                  shadow-[0_18px_40px_rgba(37,99,235,0.6)]
                  transition
                  hover:shadow-[0_20px_45px_rgba(37,99,235,0.65)]
                  hover:scale-[1.01]
                  focus-visible:outline-none
                  focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
                "
              >
                <Share2 className="h-4 w-4 mr-2" />
                Jaa
              </button>
            )}

            {/* Social Media Buttons */}
            <button
              onClick={shareToFacebook}
              className="
                rounded-full
                border border-white/20
                bg-white/5
                backdrop-blur-sm
                px-5 py-3
                text-sm font-medium text-white
                transition
                hover:bg-white/10
                hover:border-white/30
                focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
                flex items-center gap-2
              "
            >
              <Facebook className="h-4 w-4 text-blue-400" />
              Facebook
            </button>

            <button
              onClick={shareToTwitter}
              className="
                rounded-full
                border border-white/20
                bg-white/5
                backdrop-blur-sm
                px-5 py-3
                text-sm font-medium text-white
                transition
                hover:bg-white/10
                hover:border-white/30
                focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
                flex items-center gap-2
              "
            >
              <Twitter className="h-4 w-4 text-blue-400" />
              Twitter
            </button>

            <button
              onClick={shareToLinkedIn}
              className="
                rounded-full
                border border-white/20
                bg-white/5
                backdrop-blur-sm
                px-5 py-3
                text-sm font-medium text-white
                transition
                hover:bg-white/10
                hover:border-white/30
                focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
                flex items-center gap-2
              "
            >
              <Linkedin className="h-4 w-4 text-blue-400" />
              LinkedIn
            </button>
          </div>

          {/* Info Text */}
          <p className="text-xs text-slate-300/70 text-center pt-2">
            Kun joku käyttää sinun linkkiäsi, se auttaa meitä auttamaan enemmän ihmisiä löytämään oman urapolunsa.
          </p>
        </div>
      </div>
    </div>
  );
}

