"use client";

/**
 * Teacher Classes Page
 * List all classes for a teacher
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TeacherNav from '@/components/TeacherNav';

interface Class {
  id: string;
  class_token: string;
  created_at: string;
}

export default function TeacherClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch classes from API
    // For now, show empty state
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <TeacherNav />
        <div className="max-w-6xl mx-auto p-8">
          <h1 className="text-3xl font-bold mb-8">Omat luokat</h1>
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <TeacherNav />
      <div className="max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Omat luokat</h1>
          <p className="text-gray-600">Hallinnoi oppilasluokkiasi ja tarkastele tuloksia</p>
        </div>

        {classes.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <p className="text-gray-600 mb-6">Sinulla ei ole vielä luokkia</p>
            <Link
              href="/teacher/classes/new"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Luo uusi luokka
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {classes.map(classItem => (
              <Link
                key={classItem.id}
                href={`/teacher/classes/${classItem.id}`}
                className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-lg">Luokka {classItem.id.substring(0, 8)}</h3>
                <p className="text-gray-600 text-sm">
                  Luotu: {new Date(classItem.created_at).toLocaleDateString('fi-FI')}
                </p>
              </Link>
            ))}
            <Link
              href="/teacher/classes/new"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition text-center"
            >
              + Luo uusi luokka
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

