/**
 * Security utilities for Urakompassi
 * Uses Web Crypto API for cross-runtime compatibility (Node.js and Edge)
 */

// ============================================================================
// PASSWORD HASHING (PBKDF2)
// ============================================================================

const PBKDF2_ITERATIONS = 100000;
const SALT_LENGTH = 16;
const KEY_LENGTH = 32;

/**
 * Hash a password using PBKDF2-SHA256
 * Returns a string in format: salt:hash (both base64 encoded)
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    KEY_LENGTH * 8
  );

  const hashArray = new Uint8Array(derivedBits);
  const saltBase64 = btoa(String.fromCharCode.apply(null, Array.from(salt)));
  const hashBase64 = btoa(String.fromCharCode.apply(null, Array.from(hashArray)));

  return `${saltBase64}:${hashBase64}`;
}

/**
 * Verify a password against a stored hash
 * Uses timing-safe comparison to prevent timing attacks
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    const [saltBase64, expectedHashBase64] = storedHash.split(':');
    if (!saltBase64 || !expectedHashBase64) {
      return false;
    }

    const salt = Uint8Array.from(atob(saltBase64), c => c.charCodeAt(0));
    const expectedHash = Uint8Array.from(atob(expectedHashBase64), c => c.charCodeAt(0));

    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits']
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: PBKDF2_ITERATIONS,
        hash: 'SHA-256',
      },
      keyMaterial,
      KEY_LENGTH * 8
    );

    const actualHash = new Uint8Array(derivedBits);

    // Timing-safe comparison
    return timingSafeEqual(actualHash, expectedHash);
  } catch {
    return false;
  }
}

/**
 * Timing-safe comparison of two byte arrays
 * Prevents timing attacks by always comparing all bytes
 */
function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i];
  }

  return result === 0;
}

// ============================================================================
// SECURE TOKEN GENERATION
// ============================================================================

/**
 * Generate a cryptographically secure random token
 * Used for session tokens, CSRF tokens, etc.
 */
export function generateSecureToken(length: number = 32): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Generate a cryptographically secure PIN
 * Uses only unambiguous characters (no 0, O, I, L, 1)
 */
export function generateSecurePin(length: number = 6): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  let pin = '';

  for (let i = 0; i < length; i++) {
    pin += chars[bytes[i] % chars.length];
  }

  return pin;
}

// ============================================================================
// CSRF PROTECTION
// ============================================================================

/**
 * Generate a CSRF token
 */
export function generateCsrfToken(): string {
  return generateSecureToken(32);
}

/**
 * Verify CSRF token (timing-safe)
 */
export function verifyCsrfToken(token: string, expectedToken: string): boolean {
  if (!token || !expectedToken || token.length !== expectedToken.length) {
    return false;
  }

  const encoder = new TextEncoder();
  const a = encoder.encode(token);
  const b = encoder.encode(expectedToken);

  return timingSafeEqual(a, b);
}

// ============================================================================
// IP HASHING FOR GDPR COMPLIANCE
// ============================================================================

/**
 * Hash an IP address for GDPR-compliant storage
 * Uses SHA-256 with a salt to prevent rainbow table attacks
 */
export async function hashIpAddress(ip: string): Promise<string> {
  const salt = process.env.IP_HASH_SALT || 'urakompassi-ip-salt-2025';
  const encoder = new TextEncoder();
  const data = encoder.encode(`${salt}:${ip}`);

  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = new Uint8Array(hashBuffer);

  return Array.from(hashArray)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// ============================================================================
// SESSION TOKEN GENERATION
// ============================================================================

/**
 * Generate a secure session token with embedded metadata
 * Format: timestamp.randomBytes (both hex encoded)
 */
export function generateSessionToken(): string {
  const timestamp = Date.now().toString(16);
  const random = generateSecureToken(24);
  return `${timestamp}.${random}`;
}

/**
 * Validate session token format and check if expired
 */
export function validateSessionToken(token: string, maxAgeMs: number = 7 * 24 * 60 * 60 * 1000): boolean {
  if (!token || typeof token !== 'string') {
    return false;
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return false;
  }

  const [timestampHex, random] = parts;

  // Validate random part length
  if (!random || random.length !== 48) {
    return false;
  }

  // Validate timestamp
  try {
    const timestamp = parseInt(timestampHex, 16);
    if (isNaN(timestamp)) {
      return false;
    }

    const now = Date.now();
    const age = now - timestamp;

    // Check if token is from the future (clock skew tolerance: 5 minutes)
    if (timestamp > now + 5 * 60 * 1000) {
      return false;
    }

    // Check if token is expired
    if (age > maxAgeMs) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

// ============================================================================
// INPUT VALIDATION
// ============================================================================

/**
 * HTML entity encoding map for XSS prevention
 */
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

/**
 * Encode HTML entities to prevent XSS
 */
export function encodeHtmlEntities(str: string): string {
  return str.replace(/[&<>"'`=/]/g, (char) => HTML_ENTITIES[char] || char);
}

/**
 * Sanitize string input - removes and encodes potentially dangerous content
 * Provides comprehensive XSS protection for user inputs
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  let sanitized = input.trim();

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');

  // Remove javascript: and other dangerous protocols
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/vbscript:/gi, '');
  sanitized = sanitized.replace(/data:text\/html/gi, '');

  // Remove event handlers (onclick, onerror, onload, etc.)
  sanitized = sanitized.replace(/on\w+\s*=/gi, '');

  // Remove script tags and their contents
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove other dangerous tags
  sanitized = sanitized.replace(/<(iframe|object|embed|form|input|button|link|meta|style)[^>]*>/gi, '');

  // Remove closing tags for the above
  sanitized = sanitized.replace(/<\/(iframe|object|embed|form|input|button|link|meta|style)>/gi, '');

  // Encode remaining HTML entities
  sanitized = encodeHtmlEntities(sanitized);

  // Limit length
  return sanitized.slice(0, 10000);
}

/**
 * Sanitize input for display (less strict, preserves more formatting)
 * Use this for text that will be displayed but not executed
 */
export function sanitizeForDisplay(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    .replace(/[<>]/g, (char) => HTML_ENTITIES[char] || char)
    .slice(0, 50000);
}

/**
 * Validate email format using RFC 5322 simplified pattern
 */
export function isValidEmail(email: string): boolean {
  if (typeof email !== 'string' || email.length > 254) {
    return false;
  }

  // RFC 5322 simplified pattern
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  return emailRegex.test(email);
}

/**
 * Validate PIN format
 */
export function isValidPin(pin: string): boolean {
  if (typeof pin !== 'string') {
    return false;
  }

  // PIN should be 4-8 alphanumeric characters
  const pinRegex = /^[A-Z0-9]{4,8}$/;
  return pinRegex.test(pin.toUpperCase());
}
