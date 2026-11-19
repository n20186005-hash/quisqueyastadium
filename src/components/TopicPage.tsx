import { ATTRACTION, SITE_URL, faqPageJsonLd } from '@/lib/attraction';

type Section = { heading: string; body: string };
type FaqItem = { q: string; a: string };
type TopicData = {
  title: string;
  h1: string;
  intro: string;
  disclaimer: string;
  sections: Section[];
  faq: FaqItem[];
};

const RELATED_LABEL: Record<string, string> = {
  zh: '相关页面',
  es: 'Páginas relacionadas',
  en: 'Related pages',
};
const FAQ_LABEL: Record<string, string> = {
  zh: '常见问题',
  es: 'Preguntas frecuentes',
  en: 'Frequently asked questions',
};
const INFO = {
  es: { overview: 'Información esencial', rating: 'Valoración mostrada en este sitio', address: 'Dirección', access: 'Acceso y transporte', management: 'Administración del estadio', managementBody: 'El Patronato de Administración y Cuidado del Estadio Quisqueya gestiona el recinto conforme al régimen vigente. LIDOM y los clubes organizan sus respectivos partidos y venta de entradas.', hours: 'Horario', hoursBody: 'El acceso se organiza según el partido o evento. Confirma puertas y horario en tu entrada.', price: 'Entradas', priceBody: 'Precios según club, sector y partido; no existe tarifa única.', map: 'Abrir Google Maps', schedule: 'Calendario oficial de LIDOM', source: 'Fuente sobre la administración', photo: 'Imagen del estadio' },
  en: { overview: 'Essential information', rating: 'Rating displayed on this site', address: 'Address', access: 'Getting there', management: 'Stadium management', managementBody: 'The Patronato de Administración y Cuidado del Estadio Quisqueya manages the venue under the current administration framework. LIDOM and the clubs organize their respective games and ticketing.', hours: 'Opening', hoursBody: 'Entry follows the event schedule. Check gate opening and start times on your ticket.', price: 'Tickets', priceBody: 'Prices vary by home club, section and game; there is no single stadium-wide rate.', map: 'Open Google Maps', schedule: 'Official LIDOM schedule', source: 'Management source', photo: 'Stadium photograph' },
  zh: { overview: '基础资料', rating: '本站显示的评分', address: '地址', access: '交通与到达', management: '球场管理主体', managementBody: '基斯克亚球场现由 Patronato de Administración y Cuidado del Estadio Quisqueya 管理。LIDOM 与各主场球队分别组织赛事和售票。', hours: '开放时间', hoursBody: '按具体赛事安排入场，请依据门票核对开门与开赛时间。', price: '票价', priceBody: '因主队、分区及场次而异，没有统一固定票价。', map: '打开 Google 地图', schedule: 'LIDOM 官方赛程', source: '管理资料来源', photo: '球场实景' },
} as const;

export default function TopicPage({
  locale,
  topicSlug,
  topic,
  related,
  homeHref,
  homeLabel,
}: {
  locale: string;
  topicSlug: string;
  topic: TopicData;
  related: { label: string; href: string }[];
  homeHref: string;
  homeLabel: string;
}) {
  const currentUrl = `${SITE_URL}/${locale}/${topicSlug}`;
  const ui = INFO[locale as keyof typeof INFO] ?? INFO.en;

  const faqJsonLd = JSON.stringify(faqPageJsonLd(topic.faq)).replace(/</g, '\\u003c');
  const breadcrumbJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: homeLabel,
        item: `${SITE_URL}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: topic.h1,
        item: currentUrl,
      },
    ],
  }).replace(/</g, '\\u003c');

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />

      <main className="min-h-screen pt-32 pb-16 px-4" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-4xl mx-auto">
          <nav
            aria-label="Breadcrumb"
            className="text-xs sm:text-sm mb-6"
            style={{ color: 'var(--text-muted)' }}
          >
            <a href={homeHref} className="hover:underline">
              {homeLabel}
            </a>
            <span className="mx-1.5" style={{ color: 'var(--border-color)' }}>
              ›
            </span>
            <span style={{ color: 'var(--text-primary)' }}>{topic.h1}</span>
          </nav>

          <h1
            className="font-display text-4xl sm:text-5xl font-bold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            {topic.h1}
          </h1>
          <p className="text-lg leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
            {topic.intro}
          </p>

          <section className="rounded-2xl p-5 sm:p-7 mb-9" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
            <h2 className="font-display text-2xl font-semibold mb-4">{ui.overview}</h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <div><strong>{ui.address}:</strong> {ATTRACTION.streetAddress}, Santo Domingo, República Dominicana</div>
              <div><strong>{ui.rating}:</strong> {ATTRACTION.rating}/5 ({ATTRACTION.reviewCount}) · Google Maps</div>
              <div><strong>{ui.hours}:</strong> {ui.hoursBody}</div>
              <div><strong>{ui.price}:</strong> {ui.priceBody}</div>
            </div>
            <div className="flex flex-wrap gap-4 mt-5 text-sm font-semibold" style={{ color: 'var(--accent)' }}>
              <a href={ATTRACTION.mapsShareUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">{ui.map} ↗</a>
              <a href="https://www.lidom.com/estadisticas_v2-0/calendario/" target="_blank" rel="noopener noreferrer" className="hover:underline">{ui.schedule} ↗</a>
            </div>
          </section>

          <section className="mb-9" style={{ color: 'var(--text-secondary)' }}>
            <h2 className="font-display text-2xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>{ui.management}</h2>
            <p className="leading-relaxed mb-3">{ui.managementBody}</p>
            <a href="https://www.presidencia.gob.do/noticias/poder-ejecutivo-deposita-proyecto-de-ley-para-construir-moderno-estadio-de-beisbol-y" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline" style={{ color: 'var(--accent)' }}>{ui.source} ↗</a>
          </section>

          <div className="sr-only mt-2 mb-10 p-4 rounded-xl text-sm flex items-start gap-3"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
              className="flex-shrink-0 mt-0.5"
            >
              <path d="M12 2l10 4v6c0 5-4.3 8.6-10 10C6.3 20.6 2 17 2 12V6l10-4z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <p style={{ color: 'var(--text-secondary)' }}>{topic.disclaimer}</p>
          </div>

          <div className="space-y-8">
            {topic.sections.map((s, i) => (
              <div key={i} className="space-y-3">
                <h2
                  className="font-display text-2xl font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {s.heading}
                </h2>
                <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>

          {related.length > 0 && (
            <div className="mt-12">
              <h2
                className="font-display text-xl font-semibold mb-4"
                style={{ color: 'var(--text-primary)' }}
              >
                {RELATED_LABEL[locale] ?? RELATED_LABEL.en}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {related.map((r) => (
                  <a
                    key={r.href}
                    href={r.href}
                    className="rounded-2xl p-5 transition-transform hover:-translate-y-1"
                    style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
                  >
                    <span className="font-medium" style={{ color: 'var(--accent)' }}>
                      {r.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12">
            <h2
              className="font-display text-2xl font-semibold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              {FAQ_LABEL[locale] ?? FAQ_LABEL.en}
            </h2>
            <div className="space-y-4">
              {topic.faq.map((f, i) => (
                <div
                  key={i}
                  className="rounded-xl p-5"
                  style={{ background: 'var(--bg-tertiary)' }}
                >
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    {f.q}
                  </h3>
                  <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {f.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
