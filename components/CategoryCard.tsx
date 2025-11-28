"use client";

import Link from "next/link";
import { CategoryInfo } from "@/lib/categories";
import { AnimatedCard } from "@/components/ui/AnimatedCard";

interface CategoryCardProps {
  category: CategoryInfo;
  className?: string;
  index: number;
}

export default function CategoryCard({ category, className = "", index }: CategoryCardProps) {
  // Format number with leading zero (01, 02, etc.)
  const formattedNumber = String(index + 1).padStart(2, '0');

  return (
    <AnimatedCard
      delay={index * 0.05}
      className={`bg-[#11161f] ring-1 ring-white/5 rounded-xl p-6 shadow-[0_0_24px_rgba(0,0,0,0.25)] hover:bg-white/[0.03] ${className}`}
    >
      <Link href={`/ammatit?personalityType=${category.slug}`} className="block group">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-medium text-white/70 bg-white/5 px-2 py-1 rounded-md">
            {formattedNumber}
          </span>
          <h3 className="text-lg font-semibold text-white">
            {category.name_fi}
          </h3>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed">
          {category.description}
        </p>
      </Link>
    </AnimatedCard>
  );
}
