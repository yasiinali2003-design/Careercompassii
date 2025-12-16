"use client";

import { useEffect, useLayoutEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

export default function ScrollNav() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const isUrakirjastoPage = pathname === "/ammatit" || pathname?.startsWith("/ammatit/");
  const hasScrolledToTop = useRef(false);

  // Force scroll to top on landing page - runs before paint
  useLayoutEffect(() => {
    if (isLandingPage && typeof window !== 'undefined' && !hasScrolledToTop.current) {
      // Disable browser's automatic scroll restoration globally
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
      // Force scroll to top immediately and synchronously
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      hasScrolledToTop.current = true;
      // Also set scrolled state based on actual position
      setScrolled(window.scrollY > 50);
    }
  }, [isLandingPage]);

  // Also run on first paint to catch any timing issues
  useEffect(() => {
    if (isLandingPage && typeof window !== 'undefined') {
      // Double-check we're at top after hydration
      const checkAndScroll = () => {
        if (window.scrollY > 0) {
          window.scrollTo(0, 0);
          setScrolled(false);
        }
      };
      // Run immediately
      checkAndScroll();
      // And after a small delay to catch late scroll restoration
      const timeoutId = setTimeout(checkAndScroll, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [isLandingPage]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 50);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className="sticky top-0 z-50 animate-fade-in-down border-b transition-all duration-300"
      style={{
        backgroundColor: scrolled 
          ? "rgba(11, 16, 21, 0.95)" 
          : (isLandingPage || isUrakirjastoPage)
            ? "transparent" 
            : "rgba(11, 16, 21, 0.98)",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(10px)" : "none",
        borderColor: scrolled ? "rgba(255, 255, 255, 0.1)" : "transparent",
      }}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between relative z-10">
        <div className="flex items-center">
          <div className="hidden sm:block">
            <Logo />
          </div>
          <div className="sm:hidden">
            <Logo variant="iconOnly" />
          </div>
        </div>
        <div className="flex items-center gap-8">
          <Link
            href="/#miten"
            className="text-sm font-medium text-neutral-300 hover:text-white transition-all duration-300 hover:scale-105 hidden sm:block"
          >
            Miten toimii
          </Link>
          <Link
            href="/ammatit"
            className="text-sm font-medium text-neutral-300 hover:text-white transition-all duration-300 hover:scale-105 hidden sm:block"
          >
            Urakirjasto
          </Link>
          <Link
            href="/meista"
            className="text-sm font-medium text-neutral-300 hover:text-white transition-all duration-300 hover:scale-105 hidden sm:block"
          >
            Meistä
          </Link>
          <Link
            href="/teacher/login"
            className="text-sm font-medium text-neutral-300 hover:text-white transition-all duration-300 hover:scale-105 hidden sm:block"
          >
            Opettajille
          </Link>
          <Button
            asChild
            className="bg-urak-accent-blue hover:bg-urak-accent-blue/90 text-urak-bg font-medium px-6 h-10 rounded-full transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-2xl hover:-translate-y-0.5"
          >
            <Link href="/test">Aloita testi</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}

