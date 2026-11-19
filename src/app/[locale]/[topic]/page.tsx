import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { ATTRACTION, SITE_URL } from '@/lib/attraction';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicPage from '@/components/TopicPage';
import type { Metadata } from 'next';
import zhMessages from '@/messages/zh.json';
import enMessages from '@/messages/en.json';
import esMessages from '@/messages/es.json';

const TOPIC_SLUGS = [
  'entradas',
  'calendario-2026-2027',
  'capacidad',
  'nuevo-estadio-quisqueya',
  'mapa-asientos',
  'licey-escogido',
];

export const dynamicParams = false;

const messagesByLocale: Record<string, any> = {
  zh: zhMessages,
  en: enMessages,
  es: esMessages,
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    TOPIC_SLUGS.map((topic) => ({ locale, topic }))
  );
}

type PageProps = { params: Promise<{ locale: string; topic: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, topic } = await params;
  if (!TOPIC_SLUGS.includes(topic)) return {};

  const messages = messagesByLocale[locale] ?? messagesByLocale.en;
  const data = messages?.topics?.[topic];
  if (!data) return {};

  const languageMap: Record<string, string> = {
    'x-default': `${SITE_URL}/es/${topic}`,
    es: `${SITE_URL}/es/${topic}`,
    en: `${SITE_URL}/en/${topic}`,
    zh: `${SITE_URL}/zh/${topic}`,
  };

  return {
    title: data.title,
    description: data.intro,
    alternates: {
      canonical: `${SITE_URL}/${locale}/${topic}`,
      languages: languageMap,
    },
    openGraph: {
      type: 'article',
      siteName: ATTRACTION.fullName,
      title: data.title,
      description: data.intro,
      url: `${SITE_URL}/${locale}/${topic}`,
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
      title: data.title,
      description: data.intro,
      images: [ATTRACTION.heroImageUrl],
    },
  };
}

export default async function TopicRoute({ params }: PageProps) {
  const { locale, topic } = await params;
  setRequestLocale(locale);

  if (!TOPIC_SLUGS.includes(topic)) notFound();

  const messages = messagesByLocale[locale] ?? messagesByLocale.en;
  const data = messages?.topics?.[topic];
  if (!data) notFound();

  const related = TOPIC_SLUGS.filter((s) => s !== topic).map((s) => ({
    label: messages.topics[s].h1 as string,
    href: `/${locale}/${s}`,
  }));

  const homeLabel = locale === 'zh' ? '首页' : locale === 'es' ? 'Inicio' : 'Home';

  return (
    <>
      <Header />
      <TopicPage
        locale={locale}
        topicSlug={topic}
        topic={data}
        related={related}
        homeHref={`/${locale}`}
        homeLabel={homeLabel}
      />
      <Footer />
    </>
  );
}
