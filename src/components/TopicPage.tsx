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

          <div
            className="mt-2 mb-10 p-4 rounded-xl text-sm flex items-start gap-3"
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
