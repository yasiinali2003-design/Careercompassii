"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FilterOptions, sortOptions, locationOptions, educationOptions, remoteOptions } from "@/utils/filters";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, X } from "lucide-react";

interface FiltersProps {
  filters: FilterOptions;
  sortBy: string;
  onFiltersChange: (filters: FilterOptions) => void;
  onSortChange: (sortBy: string) => void;
  onReset: () => void;
  className?: string;
}

export default function Filters({ 
  filters, 
  sortBy, 
  onFiltersChange, 
  onSortChange, 
  onReset,
  className = "" 
}: FiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSalaryChange = (values: number[]) => {
    handleFilterChange('salaryMin', values[0]);
    handleFilterChange('salaryMax', values[1]);
  };

  const hasActiveFilters = 
    filters.location !== "Koko Suomi" ||
    filters.education !== "Ei tutkintovaatimusta" ||
    filters.remote !== "Kyllä" ||
    filters.salaryMin !== 0 ||
    filters.salaryMax !== 12000;

  return (
    <div className={`${className}`}>
      {/* Mobile Filter Toggle */}
      <div className="md:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Suodattimet
            {hasActiveFilters && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                Aktiivinen
              </span>
            )}
          </div>
          {isOpen ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
        </Button>
      </div>

      {/* Filter Panel */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:block`}>
        <Card className="border-2 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Suodattimet ja järjestäminen</h3>
              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={onReset}>
                  <X className="h-4 w-4 mr-1" />
                  Tyhjennä
                </Button>
              )}
            </div>

            <div className="space-y-6">
              {/* Location Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Sijainti</label>
                <Select
                  value={localFilters.location}
                  onValueChange={(value) => handleFilterChange('location', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {locationOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Education Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Koulutustaso</label>
                <Select
                  value={localFilters.education}
                  onValueChange={(value) => handleFilterChange('education', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {educationOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Remote Work Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Etätyö</label>
                <Select
                  value={localFilters.remote}
                  onValueChange={(value) => handleFilterChange('remote', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {remoteOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Salary Range Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Palkka (€/kk)
                </label>
                <div className="px-2">
                  <Slider
                    value={[localFilters.salaryMin, localFilters.salaryMax]}
                    onValueChange={handleSalaryChange}
                    max={12000}
                    min={0}
                    step={100}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{localFilters.salaryMin.toLocaleString('fi-FI')} €</span>
                    <span>{localFilters.salaryMax.toLocaleString('fi-FI')} €</span>
                  </div>
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <label className="text-sm font-medium mb-2 block">Järjestä</label>
                <Select
                  value={sortBy}
                  onValueChange={onSortChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
