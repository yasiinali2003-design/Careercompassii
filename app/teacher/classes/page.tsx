"use client";

/**
 * Teacher Classes Page
 * Professional dashboard overview of all classes
 * Inspired by Dashly X design
 */

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ClassCard from '@/components/dashboard/ClassCard';
import StatsCard from '@/components/dashboard/StatsCard';
import {
  Users,
  CheckCircle,
  Clock,
  Plus,
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  TrendingUp,
} from 'lucide-react';

interface ClassStats {
  totalPins: number;
  completedResults: number;
  pendingCount: number;
  completionRate: number;
  lastSubmission: string | null;
  atRiskCount: number;
}

interface TeacherClass {
  id: string;
  class_token: string;
  created_at: string;
  updated_at?: string;
  stats?: ClassStats;
}

export default function TeacherClassesPage() {
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'completion'>('newest');

  useEffect(() => {
    async function fetchClasses() {
      try {
        setLoading(true);
        const response = await fetch('/api/classes');
        const data = await response.json();

        if (data.success && Array.isArray(data.classes)) {
          setClasses(data.classes);
        } else {
          console.error('Failed to fetch classes:', data.error);
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchClasses();
  }, []);

  // Calculate overall stats
  const overallStats = useMemo(() => {
    const totalClasses = classes.length;
    const totalStudents = classes.reduce((acc, c) => acc + (c.stats?.totalPins ?? 0), 0);
    const completedTests = classes.reduce((acc, c) => acc + (c.stats?.completedResults ?? 0), 0);
    const pendingTests = classes.reduce((acc, c) => acc + (c.stats?.pendingCount ?? 0), 0);
    const avgCompletion = totalClasses > 0
      ? Math.round(classes.reduce((acc, c) => acc + (c.stats?.completionRate ?? 0), 0) / totalClasses)
      : 0;

    return { totalClasses, totalStudents, completedTests, pendingTests, avgCompletion };
  }, [classes]);

  // Filter and sort classes
  const filteredClasses = useMemo(() => {
    let result = [...classes];

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.id.toLowerCase().includes(query) ||
        c.class_token.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else {
        return (b.stats?.completionRate ?? 0) - (a.stats?.completionRate ?? 0);
      }
    });

    return result;
  }, [classes, searchQuery, sortBy]);

  if (loading) {
    return (
      <DashboardLayout title="Luokat" subtitle="Ladataan...">
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 border-4 border-urak-accent-blue border-t-transparent rounded-full animate-spin" />
            <p className="text-urak-text-muted text-sm">Ladataan luokkia...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Luokat"
      subtitle="Hallitse luokkia ja seuraa oppilaiden etenemistä"
      actions={
        <Link
          href="/teacher/classes/new"
          className="flex items-center gap-2 bg-urak-accent-blue hover:bg-urak-accent-blue/90 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Luo luokka</span>
        </Link>
      }
    >
      {/* Stats overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Luokkia yhteensä"
          value={overallStats.totalClasses}
          icon={LayoutGrid}
          variant="primary"
        />
        <StatsCard
          title="Oppilaita"
          value={overallStats.totalStudents}
          icon={Users}
          variant="default"
        />
        <StatsCard
          title="Valmiit testit"
          value={overallStats.completedTests}
          icon={CheckCircle}
          variant="success"
        />
        <StatsCard
          title="Keskimääräinen valmius"
          value={`${overallStats.avgCompletion}%`}
          icon={TrendingUp}
          variant="default"
          subtitle={`${overallStats.pendingTests} kesken`}
        />
      </div>

      {/* Filters and search */}
      <div className="bg-urak-surface rounded-2xl border border-urak-border p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-urak-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Hae luokkaa..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-urak-border rounded-xl text-sm text-white placeholder:text-urak-text-muted focus:outline-none focus:ring-2 focus:ring-urak-accent-blue/30 focus:border-urak-accent-blue/50 transition-all"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-urak-text-muted" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'completion')}
              className="bg-white/5 border border-urak-border rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-urak-accent-blue/30 cursor-pointer"
            >
              <option value="newest">Uusin ensin</option>
              <option value="oldest">Vanhin ensin</option>
              <option value="completion">Valmiusaste</option>
            </select>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center bg-white/5 border border-urak-border rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-urak-accent-blue/20 text-urak-accent-blue'
                  : 'text-urak-text-muted hover:text-white'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-urak-accent-blue/20 text-urak-accent-blue'
                  : 'text-urak-text-muted hover:text-white'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Classes grid/list */}
      {filteredClasses.length === 0 ? (
        <div className="bg-urak-surface rounded-2xl border border-urak-border p-12 text-center">
          {classes.length === 0 ? (
            <>
              <div className="w-16 h-16 bg-urak-accent-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <LayoutGrid className="h-8 w-8 text-urak-accent-blue" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Ei vielä luokkia
              </h3>
              <p className="text-urak-text-muted text-sm mb-6 max-w-md mx-auto">
                Aloita luomalla ensimmäinen luokka. Oppilaat voivat tehdä testin käyttämällä luokan linkkiä.
              </p>
              <Link
                href="/teacher/classes/new"
                className="inline-flex items-center gap-2 bg-urak-accent-blue hover:bg-urak-accent-blue/90 text-white text-sm font-medium px-6 py-3 rounded-xl transition-colors"
              >
                <Plus className="h-4 w-4" />
                Luo ensimmäinen luokka
              </Link>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-urak-text-muted" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Ei hakutuloksia
              </h3>
              <p className="text-urak-text-muted text-sm">
                Kokeile eri hakusanaa
              </p>
            </>
          )}
        </div>
      ) : (
        <div className={
          viewMode === 'grid'
            ? 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3'
            : 'flex flex-col gap-3'
        }>
          {filteredClasses.map((classItem) => (
            <ClassCard
              key={classItem.id}
              id={classItem.id}
              classToken={classItem.class_token}
              createdAt={classItem.created_at}
              stats={classItem.stats}
            />
          ))}
        </div>
      )}

      {/* Results count */}
      {filteredClasses.length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-urak-text-muted">
            Näytetään {filteredClasses.length} / {classes.length} luokkaa
          </p>
        </div>
      )}
    </DashboardLayout>
  );
}
