'use client';

import { usePathname } from 'next/navigation';
import { Footer } from '@/components/Footer';

/**
 * Conditionally renders the footer based on the current route.
 * Excludes footer from teacher dashboard and other admin pages.
 */
export function ConditionalFooter() {
  const pathname = usePathname();

  // Don't show footer on teacher dashboard pages
  const hideFooterPaths = ['/teacher'];

  const shouldHideFooter = hideFooterPaths.some(path =>
    pathname?.startsWith(path)
  );

  if (shouldHideFooter) {
    return null;
  }

  return <Footer />;
}
