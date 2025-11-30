'use client';

/**
 * ResultPageLayout
 * 
 * Main layout wrapper for the results page with sticky navigation.
 * Provides smooth scrolling to sections and consistent spacing.
 */

import { ReactNode, useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Logo } from '@/components/Logo';

interface ResultPageLayoutProps {
  children: ReactNode;
  cohortType: 'nuoriAikuinen' | 'ylaste' | 'toinenAste';
  sections?: Array<{
    id: string;
    label: string;
  }>;
}

export function ResultPageLayout({ 
  children, 
  cohortType,
  sections = []
}: ResultPageLayoutProps) {
  const [activeSection, setActiveSection] = useState<string>('');
  const [scrolled, setScrolled] = useState(false);

  // Default sections based on cohort - memoized to prevent useEffect dependency issues
  const defaultSections = useMemo(() => {
    return sections.length > 0 ? sections : [
      { id: 'profiili', label: 'Profiilisi' },
      ...(cohortType !== 'nuoriAikuinen' ? [{ id: 'koulutus', label: 'Koulutus' }] : []),
      { id: 'ammatit', label: 'Ammattisuositukset' },
    ];
  }, [sections, cohortType]);

  // Track scroll for header background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // Offset for sticky nav

      // Reverse to check from bottom to top
      const reversedSections = [...defaultSections].reverse();
      for (const section of reversedSections) {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [defaultSections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for sticky nav height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="min-h-screen bg-transparent relative">
      {/* Sticky Navigation Bar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="sticky top-0 z-40 transition-all duration-300"
        style={{
          background: 'transparent',
          backgroundColor: scrolled ? 'rgba(11, 16, 21, 0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(10px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Logo variant="default" href="/" />
            </Link>

            {/* Navigation Links */}
            {defaultSections.length > 0 && (
              <div className="hidden md:flex items-center gap-6">
                {defaultSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`
                      text-sm font-medium
                      transition-colors
                      px-3 py-1.5 rounded-lg
                      ${
                        activeSection === section.id
                          ? 'text-cyan-400 bg-cyan-400/10'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="relative z-10">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 py-8 lg:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}

