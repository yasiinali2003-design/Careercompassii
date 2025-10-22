/**
 * COHORT-SPECIFIC CONFIGURATION
 * UI copy and settings for each age group
 */

import { Cohort } from './types';

// ========== UI COPY FOR RESULTS PAGE ==========

export interface CohortCopy {
  title: string;
  subtitle: string;
  strengthsTitle: string;
  careersTitle: string;
  ctaText: string;
  shareText: string;
  restartText: string;
  exploreText: string;
}

export const COHORT_COPY: Record<Cohort, CohortCopy> = {
  YLA: {
    title: "Sinun tuloksesi",
    subtitle: "Näiden perustiedolla voimme ehdottaa seuraavia ammatteja:",
    strengthsTitle: "Sinun vahvuutesi",
    careersTitle: "Ammattiehdotukset vastaustesi perusteella",
    ctaText: "Tutustu ammattiin",
    shareText: "Jaa tuloksesi kavereiden kanssa",
    restartText: "Tee testi uudelleen",
    exploreText: "Tutki lisää Urakirjastossa"
  },
  
  TASO2: {
    title: "Henkilökohtainen analyysi",
    subtitle: "Vastauksesi perusteella voisit harkita näitä urapolkuja:",
    strengthsTitle: "Sinun vahvuutesi",
    careersTitle: "Ammattiehdotukset vastaustesi perusteella",
    ctaText: "Näytä lisätietoja",
    shareText: "Jaa tuloksesi",
    restartText: "Tee testi uudelleen",
    exploreText: "Selaa kaikkia ammatteja"
  },
  
  NUORI: {
    title: "Urasuosituksesi",
    subtitle: "Profiilisi perusteella voit tutustua näihin ammatteihin:",
    strengthsTitle: "Profiilisi vahvuudet",
    careersTitle: "Ammattiehdotukset vastaustesi perusteella",
    ctaText: "Tutustu uraan",
    shareText: "Jaa tuloksesi",
    restartText: "Tee analyysi uudelleen",
    exploreText: "Tutki koko Urakirjastoa"
  }
};

// Helper function
export function getCohortCopy(cohort: Cohort): CohortCopy {
  return COHORT_COPY[cohort];
}

// ========== COHORT METADATA ==========

export interface CohortMetadata {
  name: string;
  ageRange: string;
  description: string;
  focusAreas: string[];
}

export const COHORT_METADATA: Record<Cohort, CohortMetadata> = {
  YLA: {
    name: "Yläaste",
    ageRange: "13-15 vuotta",
    description: "Tutustu itseesi ja löydä kiinnostuksesi",
    focusAreas: ["Kiinnostuksen kohteet", "Luontaiset taipumukset", "Työskentelytavat"]
  },
  
  TASO2: {
    name: "Toisen asteen",
    ageRange: "16-19 vuotta",
    description: "Löydä suuntasi ja suunnittele tulevaisuuttasi",
    focusAreas: ["Urasuunnittelu", "Koulutusvalinnat", "Vahvuuksien tunnistaminen"]
  },
  
  NUORI: {
    name: "Nuori aikuinen",
    ageRange: "20-25 vuotta",
    description: "Rakenna oma polkusi ja löydä urapolku",
    focusAreas: ["Urapolku", "Työmarkkinat", "Uramuutos"]
  }
};

