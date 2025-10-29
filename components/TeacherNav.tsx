"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { LogOut, Home } from 'lucide-react';

export default function TeacherNav() {
  const router = useRouter();

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
    <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50 mb-8">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/teacher/classes" className="hover:opacity-80 transition-opacity">
          <Logo className="h-10 w-auto" />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/teacher/classes/new">
            <Button variant="outline" size="sm">
              Luo uusi luokka
            </Button>
          </Link>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Kirjaudu ulos
          </Button>
        </div>
      </div>
    </nav>
  );
}

