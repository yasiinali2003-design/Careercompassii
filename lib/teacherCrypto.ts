/**
 * CLIENT-SIDE CRYPTO UTILITIES FOR TEACHER NAME MAPPING
 * 
 * IMPORTANT: 
 * - All encryption/decryption happens CLIENT-SIDE only
 * - Never sent to server
 * - AES-GCM encryption for security
 * - Uses Web Crypto API (native browser)
 */

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12; // 96 bits for AES-GCM

/**
 * Generate encryption key from passphrase
 */
async function deriveKey(passphrase: string): Promise<CryptoKey> {
  // Import passphrase as key material
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  // Derive key using PBKDF2
  const salt = encoder.encode('careercompassi-salt-v1'); // Fixed salt for consistency
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    {
      name: ALGORITHM,
      length: KEY_LENGTH
    },
    false,
    ['encrypt', 'decrypt']
  );

  return key;
}

/**
 * Encrypt name mapping
 * @param mapping Record of PIN -> Name
 * @param passphrase Teacher's password
 * @returns Base64-encoded encrypted string
 */
export async function encryptMapping(
  mapping: Record<string, string>,
  passphrase: string
): Promise<string> {
  try {
    // Validate passphrase
    if (!passphrase || passphrase.length < 8) {
      throw new Error('Passphrase must be at least 8 characters');
    }

    // Serialize mapping to JSON
    const encoder = new TextEncoder();
    const jsonString = JSON.stringify(mapping);
    const data = encoder.encode(jsonString);

    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

    // Derive key
    const key = await deriveKey(passphrase);

    // Encrypt
    const encrypted = await crypto.subtle.encrypt(
      {
        name: ALGORITHM,
        iv: iv
      },
      key,
      data
    );

    // Combine IV + encrypted data and encode to base64
    const combined = new Uint8Array(IV_LENGTH + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), IV_LENGTH);

    // Convert to base64
    const chars: string[] = [];
    for (let i = 0; i < combined.length; i++) {
      chars.push(String.fromCharCode(combined[i]));
    }
    return btoa(chars.join(''));
  } catch (error) {
    console.error('[TeacherCrypto] Encryption error:', error);
    throw new Error('Encryption failed: ' + (error as Error).message);
  }
}

/**
 * Decrypt name mapping
 * @param encryptedData Base64-encoded encrypted string
 * @param passphrase Teacher's password
 * @returns Record of PIN -> Name
 */
export async function decryptMapping(
  encryptedData: string,
  passphrase: string
): Promise<Record<string, string>> {
  try {
    // Validate passphrase
    if (!passphrase || passphrase.length < 8) {
      throw new Error('Passphrase must be at least 8 characters');
    }

    // Decode from base64
    const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));

    // Extract IV and encrypted data
    const iv = combined.slice(0, IV_LENGTH);
    const encrypted = combined.slice(IV_LENGTH);

    // Derive key
    const key = await deriveKey(passphrase);

    // Decrypt
    const decrypted = await crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv: iv
      },
      key,
      encrypted
    );

    // Deserialize
    const decoder = new TextDecoder();
    const jsonString = decoder.decode(decrypted);
    const mapping = JSON.parse(jsonString);

    // Validate result
    if (typeof mapping !== 'object' || mapping === null) {
      throw new Error('Invalid decrypted data');
    }

    return mapping as Record<string, string>;
  } catch (error) {
    console.error('[TeacherCrypto] Decryption error:', error);
    throw new Error('Decryption failed: Incorrect passphrase or corrupted data');
  }
}

/**
 * Save name mapping to localStorage
 */
export function saveMappingToStorage(classId: string, mapping: Record<string, string>): void {
  try {
    const key = `cc:class:${classId}:mapping`;
    localStorage.setItem(key, JSON.stringify(mapping));
  } catch (error) {
    console.error('[TeacherCrypto] Failed to save to localStorage:', error);
    throw new Error('Failed to save mapping to browser storage');
  }
}

/**
 * Load name mapping from localStorage
 */
export function loadMappingFromStorage(classId: string): Record<string, string> | null {
  try {
    const key = `cc:class:${classId}:mapping`;
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    return JSON.parse(stored) as Record<string, string>;
  } catch (error) {
    console.error('[TeacherCrypto] Failed to load from localStorage:', error);
    return null;
  }
}

/**
 * Delete name mapping from localStorage
 */
export function deleteMappingFromStorage(classId: string): void {
  try {
    const key = `cc:class:${classId}:mapping`;
    localStorage.removeItem(key);
  } catch (error) {
    console.error('[TeacherCrypto] Failed to delete from localStorage:', error);
  }
}

/**
 * Export encrypted mapping as downloadable file
 */
export function exportMappingAsFile(
  mapping: Record<string, string>,
  passphrase: string,
  classId: string
): void {
  (async () => {
    try {
      const encrypted = await encryptMapping(mapping, passphrase);
      
      const blob = new Blob([encrypted], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `careercompassi-class-${classId}-names.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('[TeacherCrypto] Export error:', error);
      throw error;
    }
  })();
}

/**
 * Import encrypted mapping from file
 */
export async function importMappingFromFile(
  file: File,
  passphrase: string
): Promise<Record<string, string>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const encryptedData = e.target?.result as string;
        const mapping = await decryptMapping(encryptedData, passphrase);
        resolve(mapping);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Generate secure random token for class
 */
export function generateClassToken(): string {
  // Generate 32 random bytes (256 bits) and encode as base64url
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  
  // Convert to base64url (URL-safe)
  const chars: string[] = [];
  for (let i = 0; i < randomBytes.length; i++) {
    chars.push(String.fromCharCode(randomBytes[i]));
  }
  const base64 = btoa(chars.join(''))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  
  return base64.substring(0, 22); // 22 chars = ~132 bits entropy
}

/**
 * Generate student PIN (4-6 alphanumeric)
 */
export function generateStudentPin(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No 0, 1, I, O (avoid confusion)
  const length = 4;
  let pin = '';
  
  for (let i = 0; i < length; i++) {
    pin += chars[Math.floor(Math.random() * chars.length)];
  }
  
  return pin;
}

