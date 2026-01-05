"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Users, TrendingUp, GraduationCap, Briefcase, AlertCircle } from "lucide-react";
import { CategoryInfo } from "@/lib/categories";
import { CareerFI } from "@/data/careers-fi";
import { Logo } from "@/components/Logo";
import { FilterOptions, filterCareers, sortCareers, filtersToSearchParams } from "@/utils/filters";
import Filters from "@/components/Filters";
import CareerCard from "@/components/CareerCard";
import TopStats from "@/components/TopStats";

interface CategoryPageClientProps {
  categoryInfo: CategoryInfo;
  careers: CareerFI[];
  initialFilters: FilterOptions;
  initialSortBy: string;
}

export default function CategoryPageClient({
  categoryInfo,
  careers,
  initialFilters,
  initialSortBy
}: CategoryPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [filteredCareers, setFilteredCareers] = useState<CareerFI[]>([]);

  // Update URL when filters or sort change
  useEffect(() => {
    const params = filtersToSearchParams(filters, sortBy);
    const newUrl = params.toString() ? `?${params.toString()}` : '';
    router.replace(`/kategoriat/${categoryInfo.slug}${newUrl}`, { scroll: false });
  }, [filters, sortBy, router, categoryInfo.slug]);

  // Filter and sort careers
  useEffect(() => {
    let filtered = filterCareers(careers, filters);
    filtered = sortCareers(filtered, sortBy);
    setFilteredCareers(filtered);
  }, [careers, filters, sortBy]);

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  const handleReset = () => {
    setFilters({
      location: "Koko Suomi",
      education: "Ei tutkintovaatimusta",
      remote: "Kaikki",
      outlook: "Kaikki",
      salaryMin: 0,
      salaryMax: 12000
    });
    setSortBy("popular");
  };

  // Calculate stats
  const avgSalary = careers.length > 0 
    ? Math.round(careers.reduce((sum, career) => sum + career.salary_eur_month.median, 0) / careers.length)
    : 0;

  const growingCareers = careers.filter(career => career.job_outlook.status === "kasvaa").length;
  const stableCareers = careers.filter(career => career.job_outlook.status === "vakaa").length;

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-urak-bg/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo className="h-10 w-auto" />
          </Link>
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Takaisin etusivulle
            </Link>
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              {categoryInfo.name_fi}-urat Suomessa
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            {categoryInfo.intro}
          </p>
        </div>

        {/* Stats Cards */}
        <TopStats careers={careers} />

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Filters
              filters={filters}
              sortBy={sortBy}
              onFiltersChange={handleFiltersChange}
              onSortChange={handleSortChange}
              onReset={handleReset}
            />
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                Urat
              </h2>
              {filteredCareers.length !== careers.length && (
                <Button variant="outline" size="sm" onClick={handleReset}>
                  Näytä kaikki
                </Button>
              )}
            </div>

            {filteredCareers.length === 0 ? (
              <Card className="border-dashed border-2 border-muted-foreground/25">
                <CardContent className="p-12 text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold mb-2">Ei tuloksia</h3>
                  <p className="text-muted-foreground mb-4">
                    Yritä muuttaa suodattimia löytääksesi sopivia uravaihtoehtoja.
                  </p>
                  <Button onClick={handleReset}>
                    Tyhjennä suodattimet
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {filteredCareers.map((career) => (
                  <CareerCard key={career.id} career={career} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <Card className="border-2 border-primary/30 bg-gradient-to-br from-card to-primary/5">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6">Usein kysytyt kysymykset</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Mistä palkkatiedot tulevat?</h3>
                  <p className="text-muted-foreground text-sm">
                    Palkkatiedot perustuvat TE-palveluiden, ammattiliittojen ja muiden virallisten lähteiden tietoihin. 
                    Palkat voivat vaihdella alueittain ja kokemuksen mukaan.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Miten työllisyysnäkymät määritetään?</h3>
                  <p className="text-muted-foreground text-sm">
                    Työllisyysnäkymät perustuvat Työmarkkinatorin ja muiden virallisten lähteiden tietoihin. 
                    &quot;Kasvaa&quot; tarkoittaa, että alan kysyntä on kasvussa, &quot;vakaa&quot; että kysyntä pysyy samana.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Tarvitsenko aina korkeakoulututkinnon?</h3>
                  <p className="text-muted-foreground text-sm">
                    Ei, monet urat ovat saatavilla myös toisen asteen koulutuksella tai työkokemuksella. 
                    Jotkut alat vaativat kuitenkin tiettyjä tutkintoja tai lisenssejä.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Disclaimer */}
        <div className="mt-8">
          <Card className="border-2 border-accent/30 bg-gradient-to-br from-card to-accent/5">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-slate-600" />
                Tärkeä huomautus
              </h3>
              <p className="text-muted-foreground text-sm">
                Tämä tieto on tarkoitettu ohjaukseen ja inspiraatioksi. Palkat ja työllisyysnäkymät voivat vaihdella, 
                ja suosittelemme tarkistamaan ajantasaiset tiedot virallisista lähteistä ennen päätösten tekemistä.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
