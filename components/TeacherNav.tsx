"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { LogOut, HelpCircle } from 'lucide-react';
import TeacherFAQ from '@/components/TeacherFAQ';

export default function TeacherNav() {
  const router = useRouter();
  const [faqOpen, setFaqOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/teacher-auth/logout', { method: 'POST' });
      router.push('/teacher/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if API fails
      router.push('/teacher/login');
    }
  };

  return (
    <>
      <nav className="border-b border-white/10 bg-[#05070B]/95 backdrop-blur-xl sticky top-0 z-50 mb-8">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setFaqOpen(true)}
              variant="ghost"
              size="sm"
              className="text-urak-text-secondary hover:text-urak-text-primary"
              title="Tuki ja UKK"
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-urak-text-secondary hover:text-urak-text-primary"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Kirjaudu ulos
            </Button>
          </div>
        </div>
      </nav>
      <TeacherFAQ isOpen={faqOpen} onClose={() => setFaqOpen(false)} />
    </>
  );
}

