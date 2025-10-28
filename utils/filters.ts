// Pure functions for filtering and sorting careers
import { CareerFI } from "@/data/careers-fi";

export interface FilterOptions {
  location: string;
  education: string;
  remote: string;
  outlook: string;
  salaryMin: number;
  salaryMax: number;
}

export interface SortOption {
  value: string;
  label: string;
}

export const sortOptions: SortOption[] = [
  { value: "popular", label: "Suosituin" },
  { value: "education", label: "Koulutuksen pituus" },
  { value: "demand", label: "Kysyntä" },
  { value: "entry", label: "Aloitustason roolit" }
];

export const locationOptions = [
  "Koko Suomi",
  "PK-seutu",
  "Pirkanmaa", 
  "Varsinais-Suomi"
];

export const educationOptions = [
  "Ei tutkintovaatimusta",
  "Toinen aste",
  "AMK",
  "Yliopisto"
];

export const remoteOptions = [
  "Kaikki",
  "Kyllä",
  "Osittain", 
  "Ei"
];

export const outlookOptions = [
  "Kaikki",
  "kasvaa",
  "vakaa"
];

export const workStyleOptions = [
  "Kaikki",
  "Etä",
  "Osittain",
  "Paikan päällä"
];

// Filter functions
export function filterCareers(careers: CareerFI[], filters: FilterOptions): CareerFI[] {
  return careers.filter(career => {
    // Location filter (mock - in real app would check actual job locations)
    if (filters.location !== "Koko Suomi") {
      // For now, all careers pass location filter
      // TODO: Implement actual location filtering based on job data
    }

    // Education filter
    if (filters.education !== "Ei tutkintovaatimusta") {
      const hasEducation = career.education_paths.some(path => {
        if (filters.education === "Toinen aste") {
          return path.includes("Toinen aste") || path.includes("perustutkinto");
        }
        if (filters.education === "AMK") {
          return path.includes("AMK");
        }
        if (filters.education === "Yliopisto") {
          return path.includes("Yliopisto") || path.includes("maisteri");
        }
        return false;
      });
      if (!hasEducation) return false;
    }

    // Remote work filter
    if (filters.remote !== "Kaikki") {
      if (filters.remote === "Kyllä" && career.work_conditions.remote === "Ei") {
        return false;
      }
      if (filters.remote === "Osittain" && career.work_conditions.remote === "Ei") {
        return false;
      }
      if (filters.remote === "Ei" && career.work_conditions.remote !== "Ei") {
        return false;
      }
    }

    // Demand/Outlook filter
    if (filters.outlook && filters.outlook !== "Kaikki") {
      if (career.job_outlook.status !== filters.outlook) {
        return false;
      }
    }

    // Salary filter
    const medianSalary = career.salary_eur_month.median;
    if (medianSalary < filters.salaryMin || medianSalary > filters.salaryMax) {
      return false;
    }

    return true;
  });
}

// Sort functions
export function sortCareers(careers: CareerFI[], sortBy: string): CareerFI[] {
  const sorted = [...careers];

  switch (sortBy) {
    case "demand":
      const demandOrder = { "kasvaa": 4, "vakaa": 3, "laskee": 2, "vaihtelee": 1 };
      return sorted.sort((a, b) => {
        const aDemand = demandOrder[a.job_outlook.status];
        const bDemand = demandOrder[b.job_outlook.status];
        return bDemand - aDemand;
      });
    
    case "education":
      return sorted.sort((a, b) => {
        const aEducation = getEducationLevel(a.education_paths);
        const bEducation = getEducationLevel(b.education_paths);
        return aEducation - bEducation;
      });

    case "entry":
      return sorted.sort((a, b) => b.entry_roles.length - a.entry_roles.length);
    
    case "popular":
    default:
      // Default order (as provided in data)
      return sorted;
  }
}

// Helper function to determine education level for sorting
function getEducationLevel(educationPaths: string[]): number {
  if (educationPaths.some(path => path.includes("Yliopisto") || path.includes("maisteri"))) {
    return 3; // University
  }
  if (educationPaths.some(path => path.includes("AMK"))) {
    return 2; // AMK
  }
  if (educationPaths.some(path => path.includes("Toinen aste") || path.includes("perustutkinto"))) {
    return 1; // Secondary
  }
  return 0; // No requirement
}

// URL parameter helpers
export function filtersToSearchParams(filters: FilterOptions, sortBy: string): URLSearchParams {
  const params = new URLSearchParams();
  
  if (filters.location !== "Koko Suomi") {
    params.set("location", filters.location);
  }
  if (filters.education !== "Ei tutkintovaatimusta") {
    params.set("education", filters.education);
  }
  if (filters.remote !== "Kaikki") {
    params.set("remote", filters.remote);
  }
  if (filters.salaryMin !== 0) {
    params.set("salaryMin", filters.salaryMin.toString());
  }
  if (filters.salaryMax !== 12000) {
    params.set("salaryMax", filters.salaryMax.toString());
  }
  if (sortBy !== "popular") {
    params.set("sort", sortBy);
  }
  
  return params;
}

export function searchParamsToFilters(searchParams: URLSearchParams): { filters: FilterOptions; sortBy: string } {
  const filters: FilterOptions = {
    location: searchParams.get("location") || "Koko Suomi",
    education: searchParams.get("education") || "Ei tutkintovaatimusta",
    remote: searchParams.get("remote") || "Kyllä",
    outlook: searchParams.get("outlook") || "Kaikki",
    salaryMin: parseInt(searchParams.get("salaryMin") || "0"),
    salaryMax: parseInt(searchParams.get("salaryMax") || "12000")
  };
  
  const sortBy = searchParams.get("sort") || "popular";
  
  return { filters, sortBy };
}
