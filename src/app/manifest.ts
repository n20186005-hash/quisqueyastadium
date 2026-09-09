import type { MetadataRoute } from 'next';
import { ATTRACTION, DOMAIN_NAME } from '@/lib/attraction';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${ATTRACTION.fullName} (${ATTRACTION.city}) - Visitor Guide & Location`,
    short_name: ATTRACTION.shortName,
    description: `Comprehensive visitor guide to ${ATTRACTION.fullName} in ${ATTRACTION.city}, ${ATTRACTION.stateProvince}, ${ATTRACTION.country}.`,
    id: `${DOMAIN_NAME}/`,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#faf8f4',
    theme_color: '#2d6375',
    lang: 'en',
    categories: ['travel', 'sports'],
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
