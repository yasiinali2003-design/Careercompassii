"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CategoryInfo } from "@/lib/categories";

interface CategoryCardProps {
  category: CategoryInfo;
  className?: string;
  index: number;
}

export default function CategoryCard({ category, className = "", index }: CategoryCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Format number with leading zero (01, 02, etc.)
  const formattedNumber = String(index + 1).padStart(2, '0');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger the animation based on index
          setTimeout(() => {
            setIsVisible(true);
          }, index * 150); // 150ms delay between each card
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [index]);

  return (
    <div ref={cardRef}>
      <Link href={`/ammatit?personalityType=${category.slug}`} className="block group">
        <div
          className={`bg-white border-2 border-slate-200 p-6 rounded-xl hover:border-primary transition-all duration-500 hover:shadow-sm ${className} ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex items-start gap-4">
            <span className="text-3xl font-bold text-primary group-hover:text-primary/80 transition-colors flex-shrink-0">
              {formattedNumber}
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                {category.name_fi}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {category.description}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
