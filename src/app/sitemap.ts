import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { nearbyGuides } from '@/lib/nearby-guides';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://quisqueyastadium.com';
  
  const locales = routing.locales;
  
  const pages = [
    '',
    '/privacy-policy',
    '/terms-of-service',
    '/cookie-settings',
    '/entradas',
    '/calendario-2026-2027',
    '/capacidad',
    '/nuevo-estadio-quisqueya',
    '/mapa-asientos',
    '/licey-escogido',
    ...Object.keys(nearbyGuides).map(slug => `/nearby/${slug}`),
  ];

  const sitemap: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    pages.forEach((page) => {
      sitemap.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: page === '' ? 1 : 0.8,
      });
    });
  });

  return sitemap;
}
