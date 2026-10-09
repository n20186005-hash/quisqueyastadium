import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

const ICONS: Record<string, JSX.Element> = {
  entradas: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z" />
    </svg>
  ),
  calendario: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M8 2v4M16 2v4M3 10h18" />
    </svg>
  ),
  capacidad: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <path d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-6h6v6" />
    </svg>
  ),
  llegar: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
};

export default function QuickAccess() {
  const t = useTranslations('quickAccess');
  const locale = useLocale();
  const prefix = `/${locale}`;

  const cards = [
    { key: 'entradas', href: `${prefix}/entradas` },
    { key: 'calendario', href: `${prefix}/calendario-2026-2027` },
    { key: 'capacidad', href: `${prefix}/capacidad` },
    { key: 'llegar', href: `${prefix}/#transport` },
  ] as const;

  return (
    <section className="section-padding" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <p className="mb-4 text-sm" style={{ color: 'var(--text-muted)' }}>
          {t('subtitle')}
        </p>
        <div className="w-12 h-0.5 mb-10" style={{ background: 'var(--accent)' }} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <a
              key={card.key}
              href={card.href}
              className="rounded-2xl p-6 flex flex-col gap-3 transition-transform hover:-translate-y-1"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: 'var(--accent)' }}
              >
                {ICONS[card.key]}
              </div>
              <h3 className="font-display text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                {t(`${card.key}.label`)}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {t(`${card.key}.desc`)}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
