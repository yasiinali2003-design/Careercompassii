// Category mapping and routing utilities
// Maps category slugs to Finnish names and provides intro text

export interface CategoryInfo {
  slug: string;
  name_fi: string;
  name_en: string;
  description: string;
  intro: string;
}

export const categories: Record<string, CategoryInfo> = {
  luova: {
    slug: "luova",
    name_fi: "Luova",
    name_en: "Creative",
    description: "Taiteilijat, suunnittelijat ja sisällöntuottajat",
    intro: "Luova-alan urat sopivat ihmisille, joilla on vahva visuaalinen silmä ja halu luoda jotain uutta. Tämä ala yhdistää taiteellisuutta ja teknologiaa, ja tarjoaa mahdollisuuksia itsenäiseen työskentelyyn sekä perinteisiin työsuhteisiin."
  },
  johtaja: {
    slug: "johtaja",
    name_fi: "Johtaja",
    name_en: "Leader",
    description: "Yrittäjät, managerit ja vaikuttajat",
    intro: "Johtaja-tyyppiset urat sopivat luonnollisille johtajille, jotka haluavat vaikuttaa ja ohjata muita. Tämä ala tarjoaa mahdollisuuksia yrittäjyyteen, johtamiseen ja strategiseen ajatteluun."
  },
  innovoija: {
    slug: "innovoija",
    name_fi: "Innovoija",
    name_en: "Innovator",
    description: "Tech-rakentajat ja ongelmanratkaisijat",
    intro: "Innovoija-alan urat sopivat teknologiaan kiinnostuneille ja ongelmanratkaisijoille. Tämä nopeasti kehittyvä ala tarjoaa hyviä palkkoja ja mahdollisuuksia vaikuttaa tulevaisuuteen."
  },
  rakentaja: {
    slug: "rakentaja",
    name_fi: "Rakentaja",
    name_en: "Builder",
    description: "Käytännön tekijät ja käsityöläiset",
    intro: "Rakentaja-alan urat sopivat käytännönläheisille ihmisille, jotka haluavat nähdä konkreettisia tuloksia työstään. Tämä ala tarjoaa vakaata työllisyyttä ja mahdollisuuksia itsenäiseen työskentelyyn."
  },
  auttaja: {
    slug: "auttaja",
    name_fi: "Auttaja",
    name_en: "Helper",
    description: "Hoitajat, opettajat ja puolustajat",
    intro: "Auttaja-alan urat sopivat ihmisille, jotka haluavat auttaa muita ja tehdä työtä, jolla on merkitystä. Tämä ala tarjoaa tyydyttävää työtä ja mahdollisuuksia vaikuttaa yhteiskuntaan."
  },
  "ympariston-puolustaja": {
    slug: "ympariston-puolustaja",
    name_fi: "Ympäristön puolustaja",
    name_en: "Environmental Defender",
    description: "Vihreät ajattelijat ja kestävän kehityksen tekijät",
    intro: "Ympäristön puolustaja -alan urat sopivat ympäristöasioista kiinnostuneille, jotka haluavat vaikuttaa kestävään kehitykseen. Tämä kasvava ala tarjoaa mahdollisuuksia vaikuttaa tulevaisuuteen."
  },
  visionaari: {
    slug: "visionaari",
    name_fi: "Visionääri",
    name_en: "Visionary",
    description: "Tulevaisuuden näkijät ja strategit",
    intro: "Visionääri-alan urat sopivat strategisesti ajatteleville, jotka haluavat vaikuttaa pitkän aikavälin kehitykseen. Tämä ala tarjoaa mahdollisuuksia johtamiseen ja innovaatioihin."
  },
  jarjestaja: {
    slug: "jarjestaja",
    name_fi: "Järjestäjä",
    name_en: "Organizer",
    description: "Koordinaattorit ja projektipäälliköt",
    intro: "Järjestäjä-alan urat sopivat organisointikykyisille ihmisille, jotka haluavat koordinoida ja hallita projekteja. Tämä ala tarjoaa mahdollisuuksia projektinhallintaan ja johtamiseen."
  }
};

// Helper functions
export function getCategoryInfo(slug: string): CategoryInfo | null {
  return categories[slug] || null;
}

export function getAllCategories(): CategoryInfo[] {
  return Object.values(categories);
}

export function getCategorySlugs(): string[] {
  return Object.keys(categories);
}

// Validation function
export function isValidCategory(slug: string): boolean {
  return slug in categories;
}
