/**
 * Opintopolku API Client
 * Fetches study programs from Opintopolku (Finland's national study program database)
 * 
 * NOTE: Opintopolku doesn't provide public API documentation.
 * API access may require registration with Opetushallitus.
 * Contact: https://www.oph.fi/en/node/33
 * 
 * Possible API Endpoints (unverified, may require authentication):
 * - Konfo API: https://konfo-api.opintopolku.fi/koulutus/v1/koulutukset
 * - Kouta Backend: https://konfo-api.opintopolku.fi/kouta-backend/koulutus/v1/koulutukset
 * 
 * Alternative: Use CSV import or contact Opetushallitus for API access
 */

export interface OpintopolkuStudyProgram {
  id: string;
  nimi: {
    fi: string;
    sv?: string;
    en?: string;
  };
  koulutustyyppi: {
    koodiUri: string;
    nimi: {
      fi: string;
    };
  };
  koulutusala: {
    koodiUri: string;
    nimi: {
      fi: string;
    };
  };
  koulutustyyppiKoodi?: string;
  tutkintonimike?: Array<{
    nimi: {
      fi: string;
    };
  }>;
  metadata?: {
    kuvaus?: {
      fi?: string;
    };
    linkki?: string;
  };
}

export interface OpintopolkuAdmissionInfo {
  koulutusId: string;
  hakukohdeId: string;
  nimi: {
    fi: string;
  };
  koulutuspaikat: number;
  hakijat: number;
  valintatapajono?: Array<{
    nimi: string;
    minimipisteet?: number;
    maksimipisteet?: number;
  }>;
  todistusvalinta?: {
    minimipisteet?: number;
    maksimipisteet?: number;
  };
  organisaatio: {
    nimi: {
      fi: string;
    };
    organisaatiotyyppi: {
      koodiUri: string;
      nimi: {
        fi: string;
      };
    };
  };
}

/**
 * Fetch study programs from Opintopolku API
 * @param limit Maximum number of programs to fetch
 * @param offset Pagination offset
 * @returns Array of study programs
 */
export async function fetchOpintopolkuPrograms(
  limit: number = 100,
  offset: number = 0
): Promise<OpintopolkuStudyProgram[]> {
  try {
    // Try multiple possible API endpoints
    // Based on network analysis, Opintopolku uses konfo-backend for search
    // Note: These endpoints may require authentication or may not be publicly accessible
    const possibleEndpoints = [
      'https://opintopolku.fi/konfo-backend/search/koulutukset', // Found in network requests
      'https://konfo-api.opintopolku.fi/koulutus/v1/koulutukset',
      'https://konfo-api.opintopolku.fi/kouta-backend/koulutus/v1/koulutukset',
      'https://opintopolku.fi/api/koulutus/v1/koulutukset'
    ];
    
    let lastError: Error | null = null;
    
    for (const baseUrl of possibleEndpoints) {
      try {
        // Build URL with appropriate query parameters
        let url: string;
        if (baseUrl.includes('/search/')) {
          // Search endpoint uses different parameters
          url = `${baseUrl}?lng=fi&order=desc&page=${Math.floor(offset / limit) + 1}&size=${limit}&sort=score`;
        } else {
          url = `${baseUrl}?limit=${limit}&offset=${offset}`;
        }
        
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'CareerCompassi/1.0',
            // Add API key if available from environment
            ...(process.env.OPINTOLPOLKU_API_KEY && {
              'Authorization': `Bearer ${process.env.OPINTOLPOLKU_API_KEY}`
            })
          }
        });

        if (!response.ok) {
          if (response.status === 404 || response.status === 403) {
            // Try next endpoint
            continue;
          }
          throw new Error(`Opintopolku API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        // Handle different response formats
        if (Array.isArray(data)) {
          return data;
        } else if (data.content && Array.isArray(data.content)) {
          return data.content;
        } else if (data.koulutukset && Array.isArray(data.koulutukset)) {
          return data.koulutukset;
        } else if (data.results && Array.isArray(data.results)) {
          // Search endpoint format
          return data.results;
        } else if (data.hits && Array.isArray(data.hits)) {
          // Alternative search format
          return data.hits;
        }
        
        return [];
      } catch (error: any) {
        lastError = error;
        // Try next endpoint
        continue;
      }
    }
    
    // If all endpoints failed, throw the last error
    if (lastError) {
      throw new Error(`All Opintopolku API endpoints failed. Last error: ${lastError.message}. 
      
      Possible reasons:
      - API endpoints require authentication (set OPINTOLPOLKU_API_KEY env variable)
      - API endpoints have changed
      - API is not publicly accessible
      
      Solutions:
      1. Contact Opetushallitus for API access: https://www.oph.fi/en/node/33
      2. Use CSV import instead: scripts/import-from-csv.ts
      3. Expand database manually`);
    }
    
    return [];
  } catch (error: any) {
    console.error('Error fetching from Opintopolku API:', error.message);
    throw error;
  }
}

/**
 * Fetch admission points for study programs
 * @param koulutusIds Array of study program IDs
 * @returns Array of admission information
 */
export async function fetchAdmissionPoints(
  koulutusIds: string[]
): Promise<OpintopolkuAdmissionInfo[]> {
  try {
    // Try multiple possible API endpoints
    const possibleEndpoints = [
      'https://konfo-api.opintopolku.fi/hakemus/v1/hakukohteet',
      'https://konfo-api.opintopolku.fi/kouta-backend/hakemus/v1/hakukohteet',
      'https://opintopolku.fi/api/hakemus/v1/hakukohteet'
    ];
    
    const results: OpintopolkuAdmissionInfo[] = [];
    
    // Fetch in batches to avoid overwhelming the API
    const batchSize = 50;
    for (let i = 0; i < koulutusIds.length; i += batchSize) {
      const batch = koulutusIds.slice(i, i + batchSize);
      const idsParam = batch.join(',');
      
      let success = false;
      for (const baseUrl of possibleEndpoints) {
        try {
          const url = `${baseUrl}?koulutusId=${idsParam}`;
          
          const response = await fetch(url, {
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'CareerCompassi/1.0',
              // Add API key if available
              ...(process.env.OPINTOLPOLKU_API_KEY && {
                'Authorization': `Bearer ${process.env.OPINTOLPOLKU_API_KEY}`
              })
            }
          });

          if (!response.ok) {
            if (response.status === 404 || response.status === 403) {
              // Try next endpoint
              continue;
            }
            console.warn(`Failed to fetch admission points for batch: ${response.status}`);
            continue;
          }

          const data = await response.json();
          
          // Handle different response formats
          if (Array.isArray(data)) {
            results.push(...data);
          } else if (data.content && Array.isArray(data.content)) {
            results.push(...data.content);
          } else if (data.hakukohteet && Array.isArray(data.hakukohteet)) {
            results.push(...data.hakukohteet);
          }
          
          success = true;
          break; // Success, no need to try other endpoints
        } catch (error: any) {
          // Try next endpoint
          continue;
        }
      }
      
      if (!success) {
        console.warn(`Could not fetch admission points for batch ${i / batchSize + 1}`);
      }
      
      // Rate limiting: wait between batches
      if (i + batchSize < koulutusIds.length) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
      }
    }
    
    return results;
  } catch (error: any) {
    console.error('Error fetching admission points:', error.message);
    return [];
  }
}

/**
 * Check if Opintopolku API is available
 */
export async function checkOpintopolkuAvailability(): Promise<boolean> {
  // Try multiple endpoints
  const possibleEndpoints = [
    'https://konfo-api.opintopolku.fi/koulutus/v1/koulutukset?limit=1',
    'https://konfo-api.opintopolku.fi/kouta-backend/koulutus/v1/koulutukset?limit=1',
    'https://opintopolku.fi/api/koulutus/v1/koulutukset?limit=1'
  ];
  
  for (const url of possibleEndpoints) {
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        headers: {
          'Accept': 'application/json',
          ...(process.env.OPINTOLPOLKU_API_KEY && {
            'Authorization': `Bearer ${process.env.OPINTOLPOLKU_API_KEY}`
          })
        }
      });
      if (response.ok) {
        return true;
      }
    } catch {
      continue;
    }
  }
  
  return false;
}

