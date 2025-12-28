"use client";

import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface SuccessMessageProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export function SuccessMessage({ 
  message, 
  onDismiss,
  className = '' 
}: SuccessMessageProps) {
  return (
    <div className={`
      bg-green-500/10 border border-green-500/30 rounded-xl p-4 ${className}
    `}>
      <div className="flex items-start gap-3">
        <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-green-400 font-medium">
            {message}
          </p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-green-400 hover:opacity-70 transition-opacity flex-shrink-0"
            aria-label="Sulje"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
























