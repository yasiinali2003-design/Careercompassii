"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryInfo } from "@/lib/categories";
import { 
  Palette, 
  Users, 
  Lightbulb, 
  Hammer, 
  Heart, 
  Leaf, 
  Eye, 
  ClipboardList 
} from "lucide-react";

interface CategoryCardProps {
  category: CategoryInfo;
  className?: string;
}

// Professional icon mapping
const categoryIcons = {
  luova: Palette,
  johtaja: Users,
  innovoija: Lightbulb,
  rakentaja: Hammer,
  auttaja: Heart,
  "ympariston-puolustaja": Leaf,
  visionaari: Eye,
  jarjestaja: ClipboardList
};

// Color psychology-based background colors for icon containers
const categoryColors = {
  luova: {
    bg: "bg-purple-50",
    bgHover: "group-hover:bg-purple-100",
    icon: "text-purple-600",
    iconHover: "group-hover:text-purple-700"
  },
  johtaja: {
    bg: "bg-blue-50",
    bgHover: "group-hover:bg-blue-100", 
    icon: "text-blue-600",
    iconHover: "group-hover:text-blue-700"
  },
  innovoija: {
    bg: "bg-yellow-50",
    bgHover: "group-hover:bg-yellow-100",
    icon: "text-yellow-600", 
    iconHover: "group-hover:text-yellow-700"
  },
  rakentaja: {
    bg: "bg-slate-50",
    bgHover: "group-hover:bg-slate-100",
    icon: "text-slate-600",
    iconHover: "group-hover:text-slate-700"
  },
  auttaja: {
    bg: "bg-emerald-50",
    bgHover: "group-hover:bg-emerald-100",
    icon: "text-emerald-600",
    iconHover: "group-hover:text-emerald-700"
  },
  "ympariston-puolustaja": {
    bg: "bg-green-50",
    bgHover: "group-hover:bg-green-100",
    icon: "text-green-600",
    iconHover: "group-hover:text-green-700"
  },
  visionaari: {
    bg: "bg-indigo-50",
    bgHover: "group-hover:bg-indigo-100",
    icon: "text-indigo-600",
    iconHover: "group-hover:text-indigo-700"
  },
  jarjestaja: {
    bg: "bg-stone-50",
    bgHover: "group-hover:bg-stone-100",
    icon: "text-stone-600",
    iconHover: "group-hover:text-stone-700"
  }
};

export default function CategoryCard({ category, className = "" }: CategoryCardProps) {
  const IconComponent = categoryIcons[category.slug as keyof typeof categoryIcons];
  const colors = categoryColors[category.slug as keyof typeof categoryColors];
  
  return (
    <Link href={`/ammatit?personalityType=${category.name_fi}`} className="block">
      <Card className={`group hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50 cursor-pointer ${className}`}>
        <CardContent className="p-6 text-center">
          <div className={`h-14 w-14 rounded-xl ${colors.bg} ${colors.bgHover} flex items-center justify-center mx-auto mb-4 transition-colors shadow-sm`}>
            {IconComponent && (
              <IconComponent className={`h-7 w-7 ${colors.icon} ${colors.iconHover} transition-colors`} />
            )}
          </div>
          <h3 className="text-lg font-semibold mb-2 text-slate-900">{category.name_fi}</h3>
          <p className="text-sm text-slate-600 leading-relaxed">{category.description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
