"use client";

/**
 * Teacher Class Detail Page
 * Shows PINs, name mapping, and results for a specific class
 */

import { use } from 'react';
import TeacherClassManager from '@/components/TeacherClassManager';

export default function ClassDetailPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const resolvedParams = use(params);
  const { classId } = resolvedParams;

  // TODO: Fetch class details and token from API
  // For now, using placeholder
  const classToken = 'placeholder-token';

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

