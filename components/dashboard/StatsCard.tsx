"use client";

/**
 * Stats Card Component
 * Professional stat display for dashboard metrics
 * Uses UraKompassi design system colors
 */

import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning';
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
}: StatsCardProps) {
  // All variants now use the same blue-based styling for consistency
  const isHighlighted = variant === 'primary';

  return (
    <div
      className={`
        bg-urak-surface rounded-2xl border border-urak-border p-5
        transition-all duration-200 hover:border-urak-accent-blue/30
        ${isHighlighted ? 'border-urak-accent-blue/20' : ''}
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-urak-text-muted font-medium">{title}</p>
          <p className="text-2xl font-semibold text-white mt-1">{value}</p>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${isHighlighted ? 'bg-urak-accent-blue/15' : 'bg-white/5'}`}>
            <Icon className={`h-5 w-5 ${isHighlighted ? 'text-urak-accent-blue' : 'text-urak-text-muted'}`} />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="flex items-center gap-2">
          {trend && (
            <span
              className={`
                text-xs font-medium px-2 py-0.5 rounded-full
                ${trend.positive
                  ? 'bg-urak-accent-blue/15 text-urak-accent-blue'
                  : 'bg-white/10 text-urak-text-secondary'
                }
              `}
            >
              {trend.positive ? '+' : ''}{trend.value}%
            </span>
          )}
          {subtitle && (
            <p className="text-xs text-urak-text-muted">{subtitle}</p>
          )}
        </div>
      )}
    </div>
  );
}
