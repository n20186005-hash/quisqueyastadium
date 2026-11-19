import { useTranslations, useMessages } from 'next-intl';
import { ATTRACTION } from '@/lib/attraction';

export default function Intro() {
  const t = useTranslations('intro');
  const tOff = useTranslations('officialManagement');
  const ta = useTranslations('accessibility');
  const tb = useTranslations('basicInfo');
  const messages = useMessages() as any;
  const items: string[] = messages?.intro?.visitGuide?.items || [];
  const alsoKnownAsItems: string[] = messages?.intro?.alsoKnownAs?.items || [];
  const geoHierarchy = [ATTRACTION.fullName, tb('cityValue'), ta('geoRegion'), ta('geoCountry')];

  return (
    <section className="section-padding">
      <div className="max-w-4xl mx-auto">
        {/* 地理归属层级：Estadio Quisqueya Juan Marichal → Santo Domingo → Distrito Nacional → Dominican Republic */}
        <nav
          aria-label={ta('breadcrumb')}
          className="text-xs sm:text-sm mb-6 overflow-x-auto whitespace-nowrap"
          style={{ color: 'var(--text-muted)' }}
        >
          {geoHierarchy.map((part, i) => (
            <span key={part}>
              {i > 0 && <span className="mx-1.5" style={{ color: 'var(--border-color)' }}>›</span>}
              <span className={i === 0 ? 'font-medium' : ''} style={i === 0 ? { color: 'var(--text-primary)' } : undefined}>
                {part}
              </span>
            </span>
          ))}
        </nav>

        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-8" style={{ background: 'var(--accent)' }} />

        {/* 首段等位声明：域名含义与官方全称在语义层面等同 */}
        {t.has('welcome') && (
          <p
            className="text-lg font-light leading-relaxed mb-6"
            style={{ color: 'var(--text-primary)' }}
            dangerouslySetInnerHTML={{
              __html: t('welcome').replace(
                /\*\*(.*?)\*\*/g,
                '<strong style="color: var(--text-primary); font-weight: 600;">$1</strong>'
              ),
            }}
          />
        )}

        <p
          className="text-lg leading-relaxed mb-12"
          style={{ color: 'var(--text-secondary)' }}
        >
          {t('description')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            className="rounded-xl p-6 sm:p-8"
            style={{ background: 'var(--bg-tertiary)' }}
          >
            <h3
              className="font-display text-xl font-semibold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              {t('visitGuide.title')}
            </h3>
            <ul className="space-y-3">
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="rounded-xl p-6 sm:p-8"
            style={{ background: 'var(--bg-tertiary)' }}
          >
            <h3
              className="font-display text-xl font-semibold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              {t('alsoKnownAs.title')}
            </h3>
            <ul className="space-y-3">
              {alsoKnownAsItems.map((keyword, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{keyword}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 p-6 sm:p-8 rounded-xl border border-[var(--accent)]" style={{ background: 'var(--bg-tertiary)' }}>
          <h2 className="font-display text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            {tOff('title')}
          </h2>
          <div className="text-base leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>
            {tOff('text')}
          </div>
        </div>
      </div>
    </section>
  );
}
