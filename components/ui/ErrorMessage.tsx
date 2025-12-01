"use client";

import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
  type?: 'error' | 'warning' | 'info';
  className?: string;
}

export function ErrorMessage({ 
  message, 
  onDismiss, 
  type = 'error',
  className = '' 
}: ErrorMessageProps) {
  const bgColors = {
    error: 'bg-red-500/10 border-red-500/30',
    warning: 'bg-yellow-500/10 border-yellow-500/30',
    info: 'bg-blue-500/10 border-blue-500/30',
  };

  const textColors = {
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
  };

  const iconColors = {
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
  };

  // Split message by newlines for better formatting
  const lines = message.split('\n').filter(line => line.trim());

  return (
    <div className={`
      ${bgColors[type]} border rounded-xl p-4 ${className}
    `}>
      <div className="flex items-start gap-3">
        <AlertCircle className={`h-5 w-5 ${iconColors[type]} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <div className={`text-sm ${textColors[type]} space-y-1`}>
            {lines.map((line, index) => (
              <p key={index} className={index === 0 ? 'font-semibold' : ''}>
                {line}
              </p>
            ))}
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className={`${textColors[type]} hover:opacity-70 transition-opacity flex-shrink-0`}
            aria-label="Sulje"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

