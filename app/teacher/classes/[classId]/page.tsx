"use client";

/**
 * Teacher Class Detail Page
 * Shows PINs, name mapping, and results for a specific class
 */

import { useEffect, useState } from 'react';
import TeacherClassManager from '@/components/TeacherClassManager';

export default function ClassDetailPage({
  params,
}: {
  params: { classId: string };
}) {
  const { classId } = params;
  const [classToken, setClassToken] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClassDetails();
  }, [classId]);

  const fetchClassDetails = async () => {
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
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
        <div className="max-w-6xl mx-auto text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">Luokkahallinta</h1>
          <p className="text-gray-600 mb-8">Luokka: {classId.substring(0, 8)}</p>
          
          <TeacherClassManager classId={classId} classToken={classToken} />
        </div>
      </div>
    </div>
  );
}

