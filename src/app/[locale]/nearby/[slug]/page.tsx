import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SITE_URL } from '@/lib/attraction';
import { nearbyGuides } from '@/lib/nearby-guides';
import { routing } from '@/i18n/routing';

type Locale = 'es' | 'en' | 'zh';
type Slug = keyof typeof nearbyGuides;
type Params = { params: Promise<{ locale: string; slug: string }> };

const labels = {
  es: { home: 'Inicio', around: 'Otros lugares para visitar', basics: 'Información básica', location: 'Dirección', hours: 'Horarios y entradas', hoursText: 'Verifica el horario y la tarifa del día en la fuente oficial.', see: 'Qué observar', history: 'Historia y significado', transit: 'Cómo llegar', tips: 'Consejos de visita y fotografías', manager: 'Sobre este lugar y quién lo administra', architecture: 'Arquitectura y detalles para observar', photoTips: 'Dónde tomar fotografías', faq: 'Preguntas frecuentes', rating: 'Valoración de visitantes', ratingText: 'Consulta la puntuación actual y el número de reseñas en la ficha independiente de Google Maps. No se muestra una cifra sin fecha de verificación.', maps: 'Mapa de este lugar', source: 'Información institucional', photo: 'Fotografía del lugar', related: 'Volver al estadio', route: 'Ruta sugerida', routeText: 'Visita el lugar a tu ritmo y continúa al Estadio Quisqueya solo si el calendario confirma un evento.' },
  en: { home: 'Home', around: 'Nearby places', basics: 'Basic information', location: 'Address', hours: 'Opening and tickets', hoursText: 'Check opening times and admission on the official source for your visit date.', see: 'What to see', history: 'History and context', transit: 'Getting there', tips: 'Visit and photo advice', manager: 'About this place and its management', architecture: 'Architecture and details', photoTips: 'Photography viewpoints', faq: 'Frequently asked questions', rating: 'Visitor reviews', ratingText: 'See the current score and review count on this place’s own Google Maps listing. No unverified rating is displayed here.', maps: 'Map for this location', source: 'Institutional information', photo: 'Location photograph', related: 'Back to the stadium', route: 'Suggested visit', routeText: 'Explore the site at a relaxed pace, and visit Estadio Quisqueya if an event is scheduled.' },
  zh: { home: '首页', around: '周边独立景点', basics: '基本信息', location: '地址', hours: '开放时间与门票', hoursText: '请依出行当天管理机构的公告核对开放时间和票价。', see: '参观重点', history: '历史与文化', transit: '交通方式', tips: '游览与拍照建议', manager: '关于本景点及管理主体', architecture: '建筑特色与观察重点', photoTips: '实景拍摄机位', faq: '常见问答', rating: '游客评分与评价', ratingText: '可通过该地点独立 Google 地图条目查看当前评分与评价数量；本站不展示未经核实日期的数字。', maps: '该景点 Google 地图', source: '管理机构资料', photo: '景点实景照片', related: '返回球场首页', route: '建议路线', routeText: '按现场开放区域参观，若球场当天有赛事，可再安排棒球观赛。' },
} as const;

export function generateStaticParams() {
  return routing.locales.flatMap(locale => (Object.keys(nearbyGuides) as Slug[]).map(slug => ({ locale, slug })));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!(slug in nearbyGuides) || !(locale in labels)) return {};
  const guide = nearbyGuides[slug as Slug];
  const info = guide.localized[locale as Locale];
  return {
    title: info.title,
    description: info.intro,
    alternates: {
      canonical: `${SITE_URL}/${locale}/nearby/${slug}`,
      languages: Object.fromEntries(['es', 'en', 'zh', 'x-default'].map(l => [l, `${SITE_URL}/${l === 'x-default' ? 'es' : l}/nearby/${slug}`])),
    },
  };
}

export default async function NearbyGuidePage({ params }: Params) {
  const { locale, slug } = await params;
  if (!(slug in nearbyGuides) || !(locale in labels)) notFound();
  setRequestLocale(locale);
  const guide = nearbyGuides[slug as Slug];
  const info = guide.localized[locale as Locale];
  const ui = labels[locale as Locale];
  const details = info as typeof info & { architecture?: string; route?: string; photoTips?: string; faq?: readonly string[] };
  const sections = [
    [ui.history, info.history], [ui.architecture, details.architecture], [ui.see, info.visit], [ui.transit, info.transport],
    [ui.route, details.route || ui.routeText], [ui.tips, info.tips], [ui.photoTips, details.photoTips],
    [ui.rating, ui.ratingText],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]));
  const other = (Object.keys(nearbyGuides) as Slug[]).filter(key => key !== slug);
  return <>
    <Header />
    <main className="pt-28 pb-20 px-4" style={{ background: 'var(--bg-primary)' }}>
      <article className="max-w-4xl mx-auto">
        <nav className="text-sm mb-7" style={{ color: 'var(--accent)' }}><a href={`/${locale}`}>{ui.home}</a> / {ui.around}</nav>
        <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">{info.title}</h1>
        <p className="text-xl mb-6" style={{ color: 'var(--text-secondary)' }}>{info.subtitle}</p>
        <img src={guide.image} alt={guide.name} loading="eager" className="w-full max-h-[430px] object-cover rounded-2xl" />
        <div className="text-xs mt-2 mb-9" style={{ color: 'var(--text-muted)' }}><a href={guide.photoSource} target="_blank" rel="noopener noreferrer" className="hover:underline">{ui.photo} · Wikimedia Commons ↗</a></div>
        <p className="text-lg leading-relaxed mb-9" style={{ color: 'var(--text-secondary)' }}>{info.intro}</p>
        <section className="rounded-2xl p-6 mb-9" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
          <h2 className="font-display text-2xl font-semibold mb-4">{ui.basics}</h2>
          <p className="mb-3"><strong>{ui.location}:</strong> {guide.address}</p>
          <p className="mb-5"><strong>{ui.hours}:</strong> {ui.hoursText}</p>
          <div className="flex flex-wrap gap-5 text-sm font-semibold" style={{ color: 'var(--accent)' }}>
            <a href={guide.maps} target="_blank" rel="noopener noreferrer">{ui.maps} ↗</a>
            <a href={guide.official} target="_blank" rel="noopener noreferrer">{ui.source} ↗</a>
          </div>
        </section>
        <section className="rounded-2xl p-6 sm:p-8 mb-10" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
          <h2 className="font-display text-2xl font-semibold mb-4">{ui.manager}</h2>
          <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{info.manager}</p>
        </section>
        {sections.map(([heading, body]) => <section key={heading} className="mb-8"><h2 className="font-display text-2xl font-semibold mb-3">{heading}</h2><p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{body}</p></section>)}
        {details.faq && <section className="mb-10"><h2 className="font-display text-2xl font-semibold mb-4">{ui.faq}</h2><div className="space-y-3">{details.faq.map((answer, index) => <p key={index} className="rounded-xl p-4 leading-relaxed" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>{answer}</p>)}</div></section>}
        <section className="mt-12 rounded-2xl p-6" style={{ background: 'var(--bg-tertiary)' }}>
          <h2 className="font-display text-xl font-semibold mb-4">{ui.around}</h2>
          <div className="flex flex-col gap-3" style={{ color: 'var(--accent)' }}>
            {other.map(key => <a key={key} href={`/${locale}/nearby/${key}`} className="hover:underline">{nearbyGuides[key].localized[locale as Locale].title}</a>)}
            <a href={`/${locale}`} className="hover:underline">{ui.related}</a>
          </div>
        </section>
      </article>
    </main>
    <Footer />
  </>;
}
