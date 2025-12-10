/**
 * Safe localStorage utilities with error handling
 * Handles QuotaExceededError, invalid JSON, and SSR scenarios
 */

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Check if localStorage is available (client-side only)
 */
export function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely get an item from localStorage
 * Returns null if not found, not available, or parse error
 */
export function safeGetItem<T>(key: string, defaultValue: T | null = null): T | null {
  if (!isLocalStorageAvailable()) {
    return defaultValue;
  }

  try {
    const item = window.localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    if (!isProduction) {
      console.warn(`[safeStorage] Error reading "${key}":`, error);
    }
    return defaultValue;
  }
}

/**
 * Safely get a string item from localStorage (no JSON parsing)
 */
export function safeGetString(key: string, defaultValue: string | null = null): string | null {
  if (!isLocalStorageAvailable()) {
    return defaultValue;
  }

  try {
    const item = window.localStorage.getItem(key);
    return item ?? defaultValue;
  } catch (error) {
    if (!isProduction) {
      console.warn(`[safeStorage] Error reading string "${key}":`, error);
    }
    return defaultValue;
  }
}

/**
 * Safely set an item in localStorage
 * Returns true if successful, false otherwise
 * Handles QuotaExceededError gracefully
 */
export function safeSetItem<T>(key: string, value: T): boolean {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    const serialized = JSON.stringify(value);
    window.localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    // Handle QuotaExceededError
    if (error instanceof DOMException &&
        (error.name === 'QuotaExceededError' || error.code === 22)) {
      if (!isProduction) {
        console.warn(`[safeStorage] Storage quota exceeded for "${key}". Attempting cleanup...`);
      }

      // Try to clear old data and retry
      try {
        cleanupOldData();
        const serialized = JSON.stringify(value);
        window.localStorage.setItem(key, serialized);
        return true;
      } catch {
        if (!isProduction) {
          console.error(`[safeStorage] Failed to save "${key}" even after cleanup`);
        }
        return false;
      }
    }

    if (!isProduction) {
      console.error(`[safeStorage] Error saving "${key}":`, error);
    }
    return false;
  }
}

/**
 * Safely set a string item in localStorage (no JSON serialization)
 */
export function safeSetString(key: string, value: string): boolean {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch (error) {
    if (error instanceof DOMException &&
        (error.name === 'QuotaExceededError' || error.code === 22)) {
      if (!isProduction) {
        console.warn(`[safeStorage] Storage quota exceeded for string "${key}"`);
      }
    } else if (!isProduction) {
      console.error(`[safeStorage] Error saving string "${key}":`, error);
    }
    return false;
  }
}

/**
 * Safely remove an item from localStorage
 */
export function safeRemoveItem(key: string): boolean {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    if (!isProduction) {
      console.error(`[safeStorage] Error removing "${key}":`, error);
    }
    return false;
  }
}

/**
 * Clean up old/stale data to free storage space
 */
function cleanupOldData(): void {
  if (!isLocalStorageAvailable()) {
    return;
  }

  try {
    // List of keys that can be safely cleared in emergency
    const expendableKeys = [
      'testFeedback',
      'abTestAssignments',
      'referralStats'
    ];

    for (const key of expendableKeys) {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // Ignore individual removal errors
      }
    }
  } catch {
    // Ignore cleanup errors
  }
}

/**
 * Get storage usage info (approximate)
 */
export function getStorageInfo(): { used: number; available: boolean } {
  if (!isLocalStorageAvailable()) {
    return { used: 0, available: false };
  }

  try {
    let total = 0;
    for (const key in window.localStorage) {
      if (Object.prototype.hasOwnProperty.call(window.localStorage, key)) {
        total += (window.localStorage[key]?.length ?? 0) * 2; // UTF-16 = 2 bytes per char
      }
    }
    return { used: total, available: true };
  } catch {
    return { used: 0, available: false };
  }
}
