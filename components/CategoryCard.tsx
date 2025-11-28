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
          className={`bg-[#11161f] ring-1 ring-white/5 rounded-xl py-6 px-6 shadow-[0_0_24px_rgba(0,0,0,0.25)] hover:ring-white/10 transition-all duration-200 ${className} ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex items-start gap-4">
            <span className="text-xs font-medium text-white/70 bg-white/5 px-2 py-1 rounded-md flex-shrink-0">
              {formattedNumber}
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white">
                {category.name_fi}
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                {category.description}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
