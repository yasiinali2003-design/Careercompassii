"use client";

/**
 * Class Card Component
 * Professional card display for class overview
 * Uses UraKompassi design system colors
 */

import Link from 'next/link';
import {
  Users,
  Clock,
  AlertTriangle,
  ChevronRight,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { useState } from 'react';

interface ClassStats {
  totalPins: number;
  completedResults: number;
  pendingCount: number;
  completionRate: number;
  lastSubmission: string | null;
  atRiskCount: number;
}

interface ClassCardProps {
  id: string;
  classToken: string;
  createdAt: string;
  stats?: ClassStats;
}

export default function ClassCard({
  id,
  classToken,
  createdAt,
  stats,
}: ClassCardProps) {
  const [copied, setCopied] = useState(false);

  const completed = stats?.completedResults ?? 0;
  const totalPins = stats?.totalPins ?? 0;
  const pending = stats?.pendingCount ?? Math.max(totalPins - completed, 0);
  const completionRate = stats?.completionRate ?? 0;
  const atRiskCount = stats?.atRiskCount ?? 0;
  const studentTestPath = `/${classToken}/test`;
  const classResultsPath = `/${classToken}`;

  const formatDate = (isoDate: string) => {
    try {
      return new Date(isoDate).toLocaleDateString('fi-FI', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return isoDate;
    }
  };

  const formatDateTime = (isoDate: string | null | undefined) => {
    if (!isoDate) return 'Ei vielä';
    try {
      return new Date(isoDate).toLocaleString('fi-FI', {
        dateStyle: 'short',
        timeStyle: 'short',
      });
    } catch {
      return isoDate;
    }
  };

  const handleCopyLink = async () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const link = `${origin}${studentTestPath}`;

    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="group bg-urak-surface rounded-2xl border border-urak-border overflow-hidden transition-all duration-200 hover:border-urak-accent-blue/30 hover:shadow-lg hover:shadow-black/20">
      {/* Header */}
      <div className="p-5 border-b border-urak-border">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-white group-hover:text-urak-accent-blue transition-colors">
              Luokka {id.substring(0, 8)}
            </h3>
            <p className="text-xs text-urak-text-muted mt-0.5">
              Luotu {formatDate(createdAt)}
            </p>
          </div>
          {atRiskCount > 0 && (
            <div className="flex items-center gap-1.5 bg-white/10 text-urak-text-secondary text-xs font-medium px-2.5 py-1 rounded-full">
              <AlertTriangle className="h-3 w-3" />
              {atRiskCount}
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-urak-text-muted">Valmius</span>
          <span className="text-xs font-medium text-white">{completionRate}%</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-urak-accent-blue rounded-full transition-all duration-500"
            style={{ width: `${Math.max(0, Math.min(completionRate, 100))}%` }}
          />
        </div>
      </div>

      {/* Stats grid */}
      <div className="px-5 pb-4 grid grid-cols-3 gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-urak-text-muted mb-1">
            <Users className="h-3.5 w-3.5" />
            <span className="text-[11px] uppercase tracking-wide">Valmiina</span>
          </div>
          <p className="text-sm font-medium text-white">
            {completed}<span className="text-urak-text-muted">/{totalPins}</span>
          </p>
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-urak-text-muted mb-1">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-[11px] uppercase tracking-wide">Kesken</span>
          </div>
          <p className="text-sm font-medium text-white">{pending}</p>
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-urak-text-muted mb-1">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-[11px] uppercase tracking-wide">Viimeisin</span>
          </div>
          <p className="text-xs font-medium text-white truncate">
            {formatDateTime(stats?.lastSubmission)}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 pb-5 flex items-center gap-2">
        <Link
          href={`/teacher/classes/${id}`}
          className="flex-1 flex items-center justify-center gap-2 bg-urak-accent-blue/10 hover:bg-urak-accent-blue/20 text-urak-accent-blue text-sm font-medium py-2.5 rounded-xl transition-colors"
        >
          Avaa luokka
          <ChevronRight className="h-4 w-4" />
        </Link>
        <button
          onClick={handleCopyLink}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-urak-text-muted hover:text-white transition-colors"
          title="Kopioi testilinkki"
        >
          {copied ? (
            <Check className="h-4 w-4 text-urak-accent-blue" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
        <Link
          href={classResultsPath}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-urak-text-muted hover:text-white transition-colors"
          title="Näytä tulossivu"
        >
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
