import { notFound } from "next/navigation";
import { getCareersByCategory } from "@/data/careers-fi";
import { getCategoryInfo, isValidCategory } from "@/lib/categories";
import { FilterOptions } from "@/utils/filters";
import CategoryPageClient from "./CategoryPageClient";

interface CategoryPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    location?: string;
    education?: string;
    remote?: string;
    outlook?: string;
    salaryMin?: string;
    salaryMax?: string;
    sort?: string;
  };
}

export default function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = params;

  // Validate category
  if (!isValidCategory(slug)) {
    notFound();
  }

  // Get category info
  const categoryInfo = getCategoryInfo(slug);
  if (!categoryInfo) {
    notFound();
  }

  // Get careers for this category
  const careers = getCareersByCategory(slug);

  // Parse search params
  const filters: FilterOptions = {
    location: searchParams.location || "Koko Suomi",
    education: searchParams.education || "Ei tutkintovaatimusta",
    remote: searchParams.remote || "Kaikki",
    outlook: searchParams.outlook || "Kaikki",
    salaryMin: parseInt(searchParams.salaryMin || "0"),
    salaryMax: parseInt(searchParams.salaryMax || "12000")
  };

  const sortBy = searchParams.sort || "popular";

  return (
    <CategoryPageClient
      categoryInfo={categoryInfo}
      careers={careers}
      initialFilters={filters}
      initialSortBy={sortBy}
    />
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const categoryInfo = getCategoryInfo(params.slug);
  
  if (!categoryInfo) {
    return {
      title: "Kategoria ei löytynyt - Urakompassi",
    };
  }

  return {
    title: `${categoryInfo.name_fi} – urat Suomessa | Urakompassi`,
    description: `Löydä ${categoryInfo.name_fi.toLowerCase()}-alan urat Suomessa. Katso palkat, koulutusvaatimukset ja työllisyysnäkymät.`,
  };
}
