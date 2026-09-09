import type { ReactNode } from 'react';
import { useTranslations, useMessages } from 'next-intl';

type Amenity = { id: string; title: string; items: string[] };

function AmenityIcon({ id }: { id: string }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  } as const;

  let paths: ReactNode;
  switch (id) {
    case 'wc':
      paths = (
        <>
          <circle cx="12" cy="5.5" r="2.5" />
          <path d="M5.5 21v-4.5a3 3 0 0 1 3-3h7a3 3 0 0 1 3 3V21" />
          <path d="M12 13.5V21" />
        </>
      );
      break;
    case 'parking':
      paths = <path d="M9 21V4h4.2a4.3 4.3 0 0 1 0 8.6H9" />;
      break;
    case 'dining':
      paths = (
        <>
          <path d="M7 3v6c0 2 3 2 3 0V3" />
          <path d="M8.5 3v18" />
          <path d="M15 3v4.5c0 1.8 2.8 1.8 2.8 0V3" />
          <path d="M16.4 8v13" />
        </>
      );
      break;
    case 'stay':
      paths = (
        <>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M4 11h16" />
          <rect x="8" y="4" width="8" height="5" />
          <path d="M8 15h3M15 15h1" />
        </>
      );
      break;
    case 'shopping':
      paths = (
        <>
          <path d="M6 8h12l-1.2 12H7.2L6 8Z" />
          <path d="M9 8a3 3 0 0 1 6 0" />
        </>
      );
      break;
    case 'fuel':
      paths = (
        <>
          <path d="M4 20V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v14" />
          <path d="M4 20h12" />
          <path d="M17 5l2 2v9a1.5 1.5 0 0 1-3 0v-1.5" />
          <rect x="17" y="7" width="3" height="3" rx="0.5" />
        </>
      );
      break;
    default:
      paths = <circle cx="12" cy="12" r="8" />;
  }

  return (
    <svg {...common} aria-hidden="true">
      {paths}
    </svg>
  );
}

export default function AmenitiesSection() {
  const t = useTranslations('amenities');
  const messages = useMessages() as any;
  const categories: Amenity[] = messages?.amenities?.categories ?? [];

  return (
    <section id="amenities" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <p className="mb-4" style={{ color: 'var(--text-muted)' }}>{t('subtitle')}</p>
        <div className="w-12 h-0.5 mb-6" style={{ background: 'var(--accent)' }} />

        {/* 中立性声明：只说明设施类型，不推荐具体商户 */}
        <p
          className="text-xs leading-relaxed mb-8 max-w-3xl"
          style={{ color: 'var(--text-muted)' }}
        >
          {t('disclaimer')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="rounded-2xl p-5 sm:p-6"
              style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
              }}
            >
              <div
                className="flex items-center gap-3 mb-3"
                style={{ color: 'var(--accent)' }}
              >
                <span
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--bg-secondary)' }}
                >
                  <AmenityIcon id={cat.id} />
                </span>
                <h3 className="font-display text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {cat.title}
                </h3>
              </div>
              <ul className="space-y-2.5">
                {(cat.items ?? []).map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    <span className="mt-1.5 flex-shrink-0 w-1 h-1 rounded-full" style={{ background: 'var(--accent)' }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
