"use client";

import React, { useState } from 'react';
import { HelpCircle, Info } from 'lucide-react';

interface TooltipProps {
  content: string;
  children?: React.ReactNode;
  icon?: 'help' | 'info';
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export function Tooltip({ 
  content, 
  children, 
  icon = 'help',
  position = 'top',
  className = '' 
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-white/90 border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-white/90 border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-white/90 border-t-transparent border-b-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-white/90 border-t-transparent border-b-transparent border-l-transparent',
  };

  return (
    <div 
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children || (
        <button
          type="button"
          className="inline-flex items-center justify-center text-urak-text-muted hover:text-urak-accent-blue transition-colors focus:outline-none focus:ring-2 focus:ring-urak-accent-blue/50 rounded-full"
          aria-label="Ohje"
        >
          {icon === 'help' ? (
            <HelpCircle className="h-4 w-4" />
          ) : (
            <Info className="h-4 w-4" />
          )}
        </button>
      )}
      
      {isVisible && (
        <div
          className={`
            absolute z-50 px-3 py-2 text-xs text-white bg-white/95 backdrop-blur-sm rounded-lg shadow-lg
            max-w-xs whitespace-normal
            ${positionClasses[position]}
            pointer-events-none
          `}
          role="tooltip"
        >
          <div className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`} />
          {content}
        </div>
      )}
    </div>
  );
}










