"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SchoolDashboardPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to teacher code generation (GDPR compliant - no student data access)
    router.replace('/admin/teachers');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <p className="text-neutral-300">Ohjataan opettajakoodien hallintaan...</p>
    </div>
  );
}
