/**
 * ROBOTS.TXT GENERATOR
 * Configures search engine crawling for all pages
 */

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://urakompassi.fi';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/teacher/',
          '/_next/',
          '/test/results',  // Don't index dynamic test results
        ],
      },
      {
        userAgent: 'GPTBot',  // OpenAI crawler
        disallow: '/',  // Prevent AI training on content
      },
      {
        userAgent: 'CCBot',  // Common Crawl bot
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
