import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SITE_URL } from '@/lib/attraction';
import { nearbyGuides } from '@/lib/nearby-guides';
import { nearbyVisitDetails, originalGuideExtras } from '@/lib/nearby-visit-details';
import { routing } from '@/i18n/routing';

type Locale = 'es' | 'en' | 'zh';
type Slug = keyof typeof nearbyGuides;
type Params = { params: Promise<{ locale: string; slug: string }> };

const labels = {
  es: { home: 'Inicio', around: 'Otros lugares para visitar', basics: 'Información básica', location: 'Dirección', hours: 'Horarios y entradas', hoursText: 'Verifica el horario y la tarifa del día en la fuente oficial.', see: 'Qué observar', history: 'Historia y significado', transit: 'Cómo llegar', tips: 'Consejos de visita y fotografías', manager: 'Sobre este lugar y quién lo administra', architecture: 'Arquitectura y detalles para observar', photoTips: 'Dónde tomar fotografías', faq: 'Preguntas frecuentes', rating: 'Valoración de visitantes', ratingText: 'Consulta la puntuación actual y el número de reseñas en la ficha independiente de Google Maps. No se muestra una cifra sin fecha de verificación.', maps: 'Mapa de este lugar', source: 'Información institucional', photo: 'Fotografía del lugar', related: 'Volver al estadio', route: 'Ruta sugerida', routeText: 'Visita el lugar a tu ritmo y continúa al Estadio Quisqueya solo si el calendario confirma un evento.' },
  en: { home: 'Home', around: 'Nearby places', basics: 'Basic information', location: 'Address', hours: 'Opening and tickets', hoursText: 'Check opening times and admission on the official source for your visit date.', see: 'What to see', history: 'History and context', transit: 'Getting there', tips: 'Visit and photo advice', manager: 'About this place and its management', architecture: 'Architecture and details', photoTips: 'Photography viewpoints', faq: 'Frequently asked questions', rating: 'Visitor reviews', ratingText: 'See the current score and review count on this place’s own Google Maps listing. No unverified rating is displayed here.', maps: 'Map for this location', source: 'Institutional information', photo: 'Location photograph', related: 'Back to the stadium', route: 'Suggested visit', routeText: 'Explore the site at a relaxed pace, and visit Estadio Quisqueya if an event is scheduled.' },
  zh: { home: '首页', around: '周边独立景点', basics: '基本信息', location: '地址', hours: '开放时间与门票', hoursText: '请依出行当天管理机构的公告核对开放时间和票价。', see: '参观重点', history: '历史与文化', transit: '交通方式', tips: '游览与拍照建议', manager: '关于本景点及管理主体', architecture: '建筑特色与观察重点', photoTips: '实景拍摄机位', faq: '常见问答', rating: '游客评分与评价', ratingText: '可通过该地点独立 Google 地图条目查看当前评分与评价数量；本站不展示未经核实日期的数字。', maps: '该景点 Google 地图', source: '管理机构资料', photo: '景点实景照片', related: '返回球场首页', route: '建议路线', routeText: '按现场开放区域参观，若球场当天有赛事，可再安排棒球观赛。' },
} as const;

const expandedLabels = {
  es: { explore: 'Explora este lugar', visit: 'Planifica tu visita', highlights: 'Lo más destacado', type: 'Tipo de lugar', duration: 'Tiempo sugerido', access: 'Acceso', opening: 'Horarios de apertura', tickets: 'Precios y entradas', discover: 'Descubre su historia y sus detalles', experience: 'Experiencia principal', numberedRoute: 'Itinerario a pie, paso a paso', reminders: 'Antes de salir', accommodation: 'Dónde alojarse para recorrer la zona', reviews: 'Opiniones de visitantes', reviewsLink: 'Consulta reseñas recientes y su fecha en Google Maps', directions: 'Dirección y guía de transporte', nearby: 'Más lugares cercanos', step: 'Etapa' },
  en: { explore: 'Discover this place', visit: 'Plan your visit', highlights: 'Visit highlights', type: 'Place type', duration: 'Suggested time', access: 'Access', opening: 'Opening hours', tickets: 'Admission and tickets', discover: 'Explore its story and design', experience: 'Main experience', numberedRoute: 'A step-by-step walking route', reminders: 'Before you go', accommodation: 'Where to stay for this area', reviews: 'Visitor reviews', reviewsLink: 'Read recent ratings and dated reviews on Google Maps', directions: 'Address and transport guide', nearby: 'More nearby places', step: 'Stop' },
  zh: { explore: '探索这处景点', visit: '游览建议', highlights: '景区特色', type: '景点类型', duration: '建议停留', access: '入场与到达', opening: '开放时间', tickets: '门票价格', discover: '发现历史与建筑魅力', experience: '核心体验', numberedRoute: '游览路线 · 编号步骤', reminders: '游览须知', accommodation: '周边住宿建议', reviews: '游客评价', reviewsLink: '在 Google 地图查看近期评分、评价数量与日期', directions: '交通指南 · 地址与地图', nearby: '更多周边专页', step: '第' },
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
  const extra = expandedLabels[locale as Locale];
  const practical = nearbyVisitDetails[slug]?.[locale as Locale];
  const details = info as typeof info & { architecture?: string; route?: string; photoTips?: string; faq?: readonly string[] };
  const originalExtras = originalGuideExtras[slug]?.[locale as Locale];
  const architecture = details.architecture || originalExtras?.architecture || practical?.highlight;
  const photoTips = details.photoTips || originalExtras?.photoTips;
  const faq = details.faq || originalExtras?.faq;
  const other = (Object.keys(nearbyGuides) as Slug[]).filter(key => key !== slug);
  return <>
    <Header />
    <main className="pt-28 pb-20 px-4" style={{ background: 'var(--bg-primary)' }}>
      <article className="max-w-4xl mx-auto">
        <nav className="text-sm mb-7" style={{ color: 'var(--accent)' }}><a href={`/${locale}`}>{ui.home}</a> / {ui.around}</nav>
        <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">{info.title}</h1>
        <p className="text-xl mb-6" style={{ color: 'var(--text-secondary)' }}>{info.subtitle}</p>
        <div className="flex flex-wrap items-center gap-3 mb-6 text-sm">
          <a href={guide.maps} target="_blank" rel="noopener noreferrer" className="rounded-full px-4 py-2 font-semibold" style={{ background: 'var(--bg-tertiary)', color: 'var(--accent)', border: '1px solid var(--border-color)' }}>{ui.maps}</a>
          <span className="rounded-full px-4 py-2" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>{practical?.type}</span>
          <span className="rounded-full px-4 py-2" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>{practical?.duration}</span>
          <a href={guide.maps} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: 'var(--accent)' }}>{extra.reviewsLink}</a>
        </div>
        <img src={guide.image} alt={guide.name} loading="eager" className="w-full max-h-[430px] object-cover rounded-2xl" />
        <div className="text-xs mt-2 mb-9" style={{ color: 'var(--text-muted)' }}><a href={guide.photoSource} target="_blank" rel="noopener noreferrer" className="hover:underline">{ui.photo} · Wikimedia Commons ↗</a></div>
        <h2 className="font-display text-2xl font-semibold mb-3">{extra.explore}</h2>
        <p className="text-lg leading-relaxed mb-9" style={{ color: 'var(--text-secondary)' }}>{info.intro}</p>
        <section className="mb-9">
          <h2 className="font-display text-2xl font-semibold mb-3">{extra.visit}</h2>
          <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{info.visit}</p>
        </section>
        {practical && <section className="mb-9">
          <h2 className="font-display text-2xl font-semibold mb-3">{extra.highlights}</h2>
          <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{practical.highlight}</p>
        </section>}
        <section className="rounded-2xl p-6 sm:p-8 mb-9" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
          <h2 className="font-display text-2xl font-semibold mb-4">{ui.manager}</h2>
          <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{info.manager}</p>
        </section>
        <section className="rounded-2xl p-6 mb-9" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
          <h2 className="font-display text-2xl font-semibold mb-4">{ui.basics}</h2>
          <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-4 mb-5 leading-relaxed">
            <div><dt className="font-semibold">{ui.location}</dt><dd style={{ color: 'var(--text-secondary)' }}>{guide.address}</dd></div>
            {practical && <><div><dt className="font-semibold">{extra.type}</dt><dd style={{ color: 'var(--text-secondary)' }}>{practical.type}</dd></div><div><dt className="font-semibold">{extra.duration}</dt><dd style={{ color: 'var(--text-secondary)' }}>{practical.duration}</dd></div><div><dt className="font-semibold">{extra.access}</dt><dd style={{ color: 'var(--text-secondary)' }}>{practical.transport}</dd></div></>}
            <div><dt className="font-semibold">{ui.manager}</dt><dd style={{ color: 'var(--text-secondary)' }}>{info.manager}</dd></div>
          </dl>
          <div className="flex flex-wrap gap-5 text-sm font-semibold" style={{ color: 'var(--accent)' }}>
            <a href={guide.maps} target="_blank" rel="noopener noreferrer">{ui.maps} ↗</a>
            <a href={guide.official} target="_blank" rel="noopener noreferrer">{ui.source} ↗</a>
          </div>
        </section>
        <section className="grid sm:grid-cols-2 gap-6 mb-10">
          <div className="rounded-2xl p-6" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}><h2 className="font-display text-2xl font-semibold mb-3">{extra.opening}</h2><p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{practical?.hours || ui.hoursText}</p></div>
          <div className="rounded-2xl p-6" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}><h2 className="font-display text-2xl font-semibold mb-3">{extra.tickets}</h2><p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{practical?.tickets || ui.hoursText}</p></div>
        </section>
        <section className="mb-10"><h2 className="font-display text-2xl font-semibold mb-3">{ui.transit}</h2><p className="leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{info.transport}</p>{practical && <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{practical.transport}</p>}</section>
        <section className="mb-10"><h2 className="font-display text-3xl font-semibold mb-6">{extra.discover}</h2><div className="grid sm:grid-cols-2 gap-6">
          {([[ui.history, info.history], [ui.architecture, architecture], [ui.see, info.visit], [extra.experience, practical?.highlight || info.visit]] as [string, string | undefined][]).map(([heading, body]) => <div key={heading} className="rounded-xl p-5" style={{ border: '1px solid var(--border-color)' }}><h3 className="font-display text-xl font-semibold mb-3">{heading}</h3><p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{body}</p></div>)}
        </div></section>
        <section className="mb-10"><h2 className="font-display text-2xl font-semibold mb-4">{extra.numberedRoute}</h2>{practical ? <ol className="space-y-4">{practical.routeSteps.map((step, index) => <li key={step} className="flex items-start gap-4"><span className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full font-bold" style={{ background: 'var(--bg-tertiary)', color: 'var(--accent)' }}>{index + 1}</span><p className="pt-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{step}</p></li>)}</ol> : <p>{ui.routeText}</p>}{details.route && <p className="mt-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{details.route}</p>}</section>
        <section className="mb-10"><h2 className="font-display text-2xl font-semibold mb-3">{extra.reminders}</h2><p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{info.tips}</p></section>
        {photoTips && <section className="mb-10"><h2 className="font-display text-2xl font-semibold mb-3">{ui.photoTips}</h2><p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{photoTips}</p></section>}
        {practical && <section className="mb-10"><h2 className="font-display text-2xl font-semibold mb-3">{extra.accommodation}</h2><p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{practical.lodging}</p></section>}
        <section className="rounded-2xl p-6 mb-10" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}><h2 className="font-display text-2xl font-semibold mb-3">{extra.reviews}</h2><p className="leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>{ui.ratingText}</p><a href={guide.maps} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline" style={{ color: 'var(--accent)' }}>{extra.reviewsLink}</a></section>
        {faq && <section className="mb-10"><h2 className="font-display text-2xl font-semibold mb-4">{ui.faq}</h2><div className="space-y-3">{faq.map((answer, index) => <p key={index} className="rounded-xl p-4 leading-relaxed" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>{answer}</p>)}</div></section>}
        <section className="mb-12"><h2 className="font-display text-2xl font-semibold mb-3">{extra.directions}</h2><p className="leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{guide.address}</p><p className="leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>{info.transport}</p><a href={guide.maps} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-xl px-5 py-3 font-semibold" style={{ background: 'var(--bg-tertiary)', color: 'var(--accent)', border: '1px solid var(--border-color)' }}>{ui.maps}</a></section>
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
