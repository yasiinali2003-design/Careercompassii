'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import CareerCompassTest from "@/components/CareerCompassTest"
import { Logo } from "@/components/Logo"
import { extractReferralCodeFromUrl, trackReferral } from '@/lib/referralSystem';

export default function TestPage() {
  const searchParams = useSearchParams();
  const pin = searchParams?.get('pin') || null;
  const classToken = searchParams?.get('classToken') || null;
  const [scrolled, setScrolled] = useState(false);

  // Track referral code if present
  useEffect(() => {
    const referralCode = extractReferralCodeFromUrl();
    if (referralCode) {
      trackReferral(referralCode);
    }
  }, []);

  // Handle scroll for header blending
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Removed console.log for production

  return (
    <div className="min-h-screen bg-transparent">
      {/* Navigation */}
      <nav
        className="sticky top-0 z-50 border-b transition-all duration-300"
        style={{
          background: "transparent",
          backgroundColor: scrolled ? "rgba(11, 16, 21, 0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(10px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(10px)" : "none",
          borderColor: scrolled ? "rgba(255, 255, 255, 0.1)" : "transparent",
        }}
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between relative z-10">
          <Logo />
          <Button 
            variant="outline" 
            asChild
            className="border-white/10 bg-white/5 hover:bg-white/10 text-white"
          >
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Takaisin
            </Link>
          </Button>
        </div>
      </nav>

      {/* Test Component */}
      <CareerCompassTest pin={pin} classToken={classToken} />
    </div>
  )
}