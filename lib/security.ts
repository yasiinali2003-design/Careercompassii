/**
 * Security utilities for CareerCompassi
 * Uses Argon2id for password hashing (modern best practice)
 * Uses Web Crypto API for tokens and other utilities
 */

import { hash, verify } from '@node-rs/argon2';
import crypto from 'crypto';

// ============================================================================
// PASSWORD HASHING (ARGON2ID)
// ============================================================================

// Argon2id parameters (OWASP recommended for production)
const ARGON2_OPTIONS = {
  memoryCost: 19456,      // 19 MiB
  timeCost: 2,            // 2 iterations
  parallelism: 1,         // 1 thread
  hashLength: 32,         // 32 bytes output
};

/**
 * Hash a password using Argon2id
 * Returns the hash string (includes salt, parameters automatically)
 *
 * Why Argon2id?
 * - Winner of Password Hashing Competition (2015)
 * - Resistant to GPU/ASIC attacks
 * - Memory-hard (expensive to parallelize)
 * - OWASP and NIST recommended
 */
export async function hashPassword(password: string): Promise<string> {
  return await hash(password, ARGON2_OPTIONS);
}

/**
 * Verify a password against a stored Argon2id hash
 * Timing-safe comparison built into the library
 */
export async function verifyPassword(
  storedHash: string,
  password: string
): Promise<boolean> {
  try {
    return await verify(storedHash, password);
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
 * Default: 48-char hex (24 bytes) for reset/temp tokens
 * Used for password reset tokens, temp activation tokens, etc.
 */
export function generateSecureToken(length: number = 24): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Hash a token using SHA-256
 * Used to store reset tokens and temp tokens securely in database
 *
 * Why hash tokens?
 * - If DB is compromised, attacker can't use tokens directly
 * - Token is only sent via email (single point of exposure)
 * - Hash is one-way (can't reverse to get original token)
 */
export function hashToken(token: string): string {
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
}

/**
 * Verify a token against its hash using timing-safe comparison
 * Prevents timing attacks during token validation
 */
export function verifyToken(token: string, hash: string): boolean {
  const tokenHash = hashToken(token);
  // Timing-safe comparison prevents timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(tokenHash),
    Buffer.from(hash)
  );
}

/**
 * Generate a cryptographically secure PIN
 * Uses only unambiguous characters (no 0, O, I, L, 1)
 */
export function generateSecurePin(length: number = 6): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const bytes = crypto.randomBytes(length);
  let pin = '';

  for (let i = 0; i < length; i++) {
    pin += chars[bytes[i] % chars.length];
  }

  return pin;
}

// ============================================================================
// PASSWORD STRENGTH VALIDATION
// ============================================================================

/**
 * Validate password strength using length-based security (modern best practice)
 *
 * Why length-only?
 * - Teachers will use passphrases ("opettaja-kahvi-kirja-2026") → easier to remember
 * - Length-based security is modern best practice
 * - No frustrating complexity requirements
 * - 10 chars is secure enough for school pilot
 * - Strength meter guides users without forcing rules
 */
export function validatePasswordStrength(password: string): {
  valid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  message: string;
} {
  const length = password.length;

  // Minimum: 10 characters (length-based security)
  if (length < 10) {
    return {
      valid: false,
      strength: 'weak',
      message: 'Salasanan on oltava vähintään 10 merkkiä pitkä'
    };
  }

  // Calculate strength (for UI meter)
  let strength: 'weak' | 'medium' | 'strong' = 'medium';

  if (length >= 16) {
    strength = 'strong';
  } else if (length >= 12) {
    strength = 'medium';
  }

  // Bonus: check for variety (not required, just for strength meter)
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>\-_]/.test(password);

  const varietyCount = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

  if (varietyCount >= 3 && length >= 12) {
    strength = 'strong';
  }

  return {
    valid: true,
    strength,
    message: strength === 'strong'
      ? 'Vahva salasana!'
      : 'Hyvä! Käytä pidempi salasana parempaa turvallisuutta varten.'
  };
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
export function hashIpAddress(ip: string): string {
  const salt = process.env.IP_HASH_SALT || 'careercompassi-ip-salt-2026';
  const data = `${salt}:${ip}`;

  return crypto
    .createHash('sha256')
    .update(data)
    .digest('hex');
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
  const random = crypto.randomBytes(24).toString('hex');
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
