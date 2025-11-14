"use client";

/**
 * Teacher Class Detail Page
 * Shows PINs, name mapping, and results for a specific class
 */

import { useCallback, useEffect, useState } from 'react';
import TeacherClassManager from '@/components/TeacherClassManager';
import TeacherNav from '@/components/TeacherNav';
import TeacherFooter from '@/components/TeacherFooter';

export default function ClassDetailPage({
  params,
}: {
  params: { classId: string };
}) {
  const { classId } = params;
  const [classToken, setClassToken] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const fetchClassDetails = useCallback(async () => {
    try {
      const response = await fetch(`/api/classes/${classId}`);
      const data = await response.json();
      if (data.success) {
        setClassToken(data.class.classToken);
      } else {
        console.error('Failed to fetch class details');
      }
    } catch (error) {
      console.error('Error fetching class details:', error);
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    fetchClassDetails();
  }, [fetchClassDetails]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-teal-50/20">
        <TeacherNav />
        <div className="flex-1 max-w-6xl mx-auto p-8 w-full text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        </div>
        <TeacherFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-teal-50/20">
      <TeacherNav />
      <div className="flex-1 max-w-6xl mx-auto p-8 w-full">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">Luokkahallinta</h1>
          <p className="text-gray-600 mb-8">Luokka: {classId.substring(0, 8)}</p>
          
          <TeacherClassManager classId={classId} classToken={classToken} />
        </div>
      </div>
      <TeacherFooter />
    </div>
  );
}

