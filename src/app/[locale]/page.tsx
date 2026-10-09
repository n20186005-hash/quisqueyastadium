import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import QuickAccess from '@/components/QuickAccess';
import Intro from '@/components/Intro';
import BasicInfo from '@/components/BasicInfo';
import HistoryTimeline from '@/components/HistoryTimeline';
import RouteSection from '@/components/RouteSection';
import HoursSection from '@/components/HoursSection';
import TicketsSection from '@/components/TicketsSection';
import TransportSection from '@/components/TransportSection';
import WeatherSection from '@/components/WeatherSection';
import AmenitiesSection from '@/components/AmenitiesSection';
import StorySection from '@/components/StorySection';
import Gallery from '@/components/Gallery';
import Reviews from '@/components/Reviews';
import NearbySection from '@/components/NearbySection';
import MapEmbed from '@/components/MapEmbed';
import SourcesSection from '@/components/SourcesSection';
import FaqSection from '@/components/FaqSection';
import Footer from '@/components/Footer';
import { routing } from '@/i18n/routing';
import zhMessages from '@/messages/zh.json';
import enMessages from '@/messages/en.json';
import esMessages from '@/messages/es.json';
import {
  ATTRACTION,
  SITE_URL,
  canonicalUrl,
  touristAttractionJsonLd,
  faqPageJsonLd,
} from '@/lib/attraction';

type FaqItem = { q: string; a: string };

const messagesByLocale: Record<
  string,
  {
    meta: { title: string; description: string };
    faq: { items: FaqItem[] };
  }
> = {
  zh: zhMessages as { meta: { title: string; description: string }; faq: { items: FaqItem[] } },
  en: enMessages as { meta: { title: string; description: string }; faq: { items: FaqItem[] } },
  es: esMessages as { meta: { title: string; description: string }; faq: { items: FaqItem[] } },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const meta = messagesByLocale[locale]?.meta ?? messagesByLocale.en.meta;

  const languageMap: Record<string, string> = {
    'x-default': `${SITE_URL}/es`,
    es: `${SITE_URL}/es`,
    en: `${SITE_URL}/en`,
    zh: `${SITE_URL}/zh`,
  };

  return {
    // TDK：全称 + 城市 + 域名含义，同时写满 canonical / OG
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: canonicalUrl(locale),
      languages: languageMap,
    },
    openGraph: {
      type: 'website',
      siteName: ATTRACTION.fullName,
      title: meta.title,
      description: meta.description,
      url: canonicalUrl(locale),
      locale: locale === 'zh' ? 'zh_CN' : locale === 'es' ? 'es_DO' : 'en_US',
      alternateLocale: ['zh_CN', 'en_US', 'es_DO'],
      images: [
        {
          url: ATTRACTION.heroImageUrl,
          width: 1200,
          height: 630,
          alt: `${ATTRACTION.fullName} in ${ATTRACTION.city}, ${ATTRACTION.country}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [ATTRACTION.heroImageUrl],
    },
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const messages = messagesByLocale[locale] ?? messagesByLocale.en;
  const faqItems = messages.faq?.items ?? [];

  const entityJsonLd = JSON.stringify(touristAttractionJsonLd(locale)).replace(/</g, '\\u003c');
  const faqJsonLd = JSON.stringify(faqPageJsonLd(faqItems)).replace(/</g, '\\u003c');

  return (
    <>
      {/* 结构化数据（置于正文顶端，等同 head 语义，供 Google 快速识别） */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: entityJsonLd }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />

      <Header />
      <main>
        <Hero />
        <QuickAccess />
        <Intro />
        <BasicInfo />
        <StorySection />
        <HistoryTimeline />
        <RouteSection />
        <HoursSection />
        <AmenitiesSection />
        <TicketsSection />
        <TransportSection />
        <WeatherSection />
        <Gallery />
        <Reviews />
        <NearbySection />
        <MapEmbed />
        <SourcesSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}
