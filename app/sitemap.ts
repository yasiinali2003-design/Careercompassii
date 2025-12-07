/**
 * SITEMAP GENERATOR
 * Generates sitemap.xml for all career pages
 * Helps search engines discover and index all new careers
 */

import { MetadataRoute } from 'next';
import { generateCareersSitemap } from '@/lib/seo/careerMetadata';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://careercompass.fi';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/test`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ammatit`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/todistuspistelaskuri`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // All career pages
  const careerPages = generateCareersSitemap();

  // Category pages
  const categories = [
    'rakentaja',
    'ympariston-puolustaja',
    'johtaja',
    'visionaari',
    'luova',
    'innovoija',
    'jarjestaja',
    'auttaja',
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/ammatit?category=${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...careerPages];
}
