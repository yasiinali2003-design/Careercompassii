"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to teacher code generation (GDPR compliant)
    router.replace('/admin/teachers');
  }, [router]);

  return null;
}

















