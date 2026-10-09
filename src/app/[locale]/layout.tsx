import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import zhMessages from '@/messages/zh.json';
import enMessages from '@/messages/en.json';
import esMessages from '@/messages/es.json';
import { ATTRACTION, SITE_URL, DOMAIN_NAME, canonicalUrl } from '@/lib/attraction';
import PwaRegister from '@/components/PwaRegister';

const messagesByLocale: Record<string, { meta: { title: string; description: string } }> = {
  zh: zhMessages as { meta: { title: string; description: string } },
  en: enMessages as { meta: { title: string; description: string } },
  es: esMessages as { meta: { title: string; description: string } },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = messagesByLocale[locale]?.meta ?? messagesByLocale.en.meta;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${ATTRACTION.fullName} | ${DOMAIN_NAME}`,
      template: `%s | ${ATTRACTION.fullName}`,
    },
    description: meta.description,
    alternates: {
      canonical: canonicalUrl(locale),
    },
    keywords: [
      ATTRACTION.fullName,
      ATTRACTION.shortName,
      `${ATTRACTION.city} ${ATTRACTION.shortName}`,
      `${ATTRACTION.city} baseball stadium`,
      `${ATTRACTION.city} ${ATTRACTION.country}`,
    ],
    applicationName: DOMAIN_NAME,
    manifest: '/manifest.webmanifest',
    icons: {
      icon: [
        { url: '/icon.svg', type: 'image/svg+xml' },
        { url: '/icons/icon-512.png', type: 'image/png', sizes: '512x512' },
      ],
      apple: [
        { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
    openGraph: {
      type: 'website',
      siteName: ATTRACTION.fullName,
      title: `${ATTRACTION.fullName} (${ATTRACTION.city})`,
      description: meta.description,
      url: canonicalUrl(locale),
      locale: locale === 'zh' ? 'zh_CN' : locale === 'es' ? 'es_DO' : 'en_US',
      alternateLocale: ['zh_CN', 'en_US', 'es_DO'],
      images: [
        {
          url: ATTRACTION.heroImageUrl,
          width: 1200,
          height: 630,
          alt: `${ATTRACTION.fullName} in ${ATTRACTION.city}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${ATTRACTION.fullName} (${ATTRACTION.city})`,
      description: meta.description,
      images: [ATTRACTION.heroImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      'apple-mobile-web-app-title': ATTRACTION.fullName,
    },
  };
}

export const viewport: Viewport = {
  themeColor: '#2d6375',
  width: 'device-width',
  initialScale: 1,
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  const htmlLang = locale === 'zh' ? 'zh-CN' : locale === 'es' ? 'es-DO' : 'en-US';

  return (
    <html lang={htmlLang} suppressHydrationWarning>
      <body>
        {/* GA4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-HXM22WWPKP`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-HXM22WWPKP');`}
        </Script>

        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
        <PwaRegister />
      </body>
    </html>
  );
}
