/**
 * Site authentication utilities
 * Passwords are configured via environment variables only - no hardcoded defaults
 */

interface ResolveOptions {
  includeDevelopmentDefaults?: boolean;
}

function normalize(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function resolveSitePasswords(options: ResolveOptions = {}): string[] {
  const includeDevelopmentDefaults =
    options.includeDevelopmentDefaults ?? process.env.NODE_ENV !== 'production';

  const envCandidates = [
    process.env.SITE_PASSWORD,
    process.env.ADMIN_SITE_PASSWORD,
    process.env.PLAYWRIGHT_SITE_PASSWORD,
    process.env.NEXT_PUBLIC_SITE_PASSWORD,
    process.env.SITE_PASSWORD_FALLBACK
  ]
    .map(normalize)
    .filter((value): value is string => Boolean(value));

  const unique = new Set<string>(envCandidates);

  // In development, also accept dev fallback password from env if set
  if (includeDevelopmentDefaults && process.env.DEV_SITE_PASSWORD) {
    const devPassword = normalize(process.env.DEV_SITE_PASSWORD);
    if (devPassword) {
      unique.add(devPassword);
    }
  }

  return Array.from(unique.values());
}

export function sitePasswordIsConfigured(): boolean {
  return resolveSitePasswords({ includeDevelopmentDefaults: false }).length > 0;
}

export function getDefaultSitePassword(): string | null {
  const passwords = resolveSitePasswords({ includeDevelopmentDefaults: false });
  return passwords.length > 0 ? passwords[0] : null;
}

