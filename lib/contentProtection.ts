/**
 * CONTENT PROTECTION
 * Obfuscation and dynamic content loading to prevent scraping
 */

/**
 * Obfuscate text content (simple encoding)
 * In production, use more sophisticated methods
 */
export function obfuscateText(text: string): string {
  // Simple base64 encoding (can be enhanced with custom encoding)
  if (typeof window === 'undefined') {
    // Server-side: return as-is (will be obfuscated client-side)
    return text;
  }
  
  // Client-side: decode if needed
  try {
    return atob(text);
  } catch {
    return text;
  }
}

/**
 * Encode text for obfuscation
 */
export function encodeText(text: string): string {
  return Buffer.from(text).toString('base64');
}

/**
 * Add random delays to prevent pattern detection
 */
export function getRandomDelay(min: number = 100, max: number = 500): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate dynamic class names to prevent CSS selectors
 */
export function generateDynamicClassName(base: string): string {
  const random = Math.random().toString(36).substring(2, 8);
  return `${base}-${random}`;
}

/**
 * Check if content should be loaded dynamically
 */
export function shouldLoadDynamically(): boolean {
  // Load dynamically if JavaScript is enabled (prevents basic scrapers)
  return typeof window !== 'undefined';
}


