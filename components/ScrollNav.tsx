"use client";

import { useEffect, useLayoutEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

export default function ScrollNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const isUrakirjastoPage = pathname === "/ammatit" || pathname?.startsWith("/ammatit/");
  const hasScrolledToTop = useRef(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

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
          {/* Desktop Navigation */}
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

          {/* Desktop CTA */}
          <Button
            asChild
            className="bg-urak-accent-blue hover:bg-urak-accent-blue/90 text-urak-bg font-medium px-6 h-10 rounded-full transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-2xl hover:-translate-y-0.5 hidden sm:flex"
          >
            <Link href="/test">Aloita testi</Link>
          </Button>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 text-neutral-300 hover:text-white transition-colors"
            aria-label={mobileMenuOpen ? "Sulje valikko" : "Avaa valikko"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="sm:hidden fixed inset-0 top-[65px] z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`sm:hidden fixed top-[65px] right-0 w-72 h-[calc(100vh-65px)] bg-[#0B1015]/98 backdrop-blur-lg border-l border-white/10 z-50 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex flex-col p-6 space-y-2">
          <Link
            href="/#miten"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-medium text-neutral-300 hover:text-white hover:bg-white/5 px-4 py-3 rounded-lg transition-all"
          >
            Miten toimii
          </Link>
          <Link
            href="/ammatit"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-medium text-neutral-300 hover:text-white hover:bg-white/5 px-4 py-3 rounded-lg transition-all"
          >
            Urakirjasto
          </Link>
          <Link
            href="/meista"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-medium text-neutral-300 hover:text-white hover:bg-white/5 px-4 py-3 rounded-lg transition-all"
          >
            Meistä
          </Link>
          <Link
            href="/teacher/login"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-medium text-neutral-300 hover:text-white hover:bg-white/5 px-4 py-3 rounded-lg transition-all"
          >
            Opettajille
          </Link>

          <div className="pt-4 border-t border-white/10 mt-4">
            <Button
              asChild
              className="w-full bg-urak-accent-blue hover:bg-urak-accent-blue/90 text-urak-bg font-medium h-12 rounded-full"
            >
              <Link href="/test" onClick={() => setMobileMenuOpen(false)}>
                Aloita testi
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </nav>
  );
}

