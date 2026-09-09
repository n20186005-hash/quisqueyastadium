import { useTranslations } from 'next-intl';

export default function TicketsSection() {
  const t = useTranslations('tickets');

  return (
    <section id="tickets" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <p className="mb-4 text-sm" style={{ color: 'var(--text-muted)' }}>{t('subtitle')}</p>
        <div className="w-12 h-0.5 mb-10" style={{ background: 'var(--accent)' }} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Official online sales */}
          <div
            className="rounded-2xl p-6 sm:p-8 flex flex-col"
            style={{ background: 'var(--bg-tertiary)', border: '2px solid var(--accent)' }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
              style={{ background: 'var(--accent)' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <path d="M2 10h20" />
                <path d="M6 15h4" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              {t('onlineTitle')}
            </h3>
            <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--text-secondary)' }}>
              {t('onlineText')}
            </p>
            <a
              href={t('lidomUrl')}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-medium"
              style={{ background: 'var(--accent)', color: 'white' }}
            >
              {t('onlineCta')}
            </a>
          </div>

          {/* Stadium box office */}
          <div
            className="rounded-2xl p-6 sm:p-8 flex flex-col"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
              style={{ background: 'var(--accent)' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 2a7 7 0 0 1 7 7c0 4-3 6.5-7 12-4-5.5-7-8-7-12a7 7 0 0 1 7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              {t('officeTitle')}
            </h3>
            <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--text-secondary)' }}>
              {t('officeText')}
            </p>
            <a
              href="#map"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-medium"
              style={{
                background: 'var(--bg-tertiary)',
                color: 'var(--accent)',
                border: '1px solid var(--accent)',
              }}
            >
              {t('directionsLabel')}
            </a>
          </div>

          {/* Schedule & capacity */}
          <div
            className="rounded-2xl p-6 sm:p-8 flex flex-col"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
              style={{ background: 'var(--accent)' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M8 2v4M16 2v4M3 10h18" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              {t('scheduleTitle')}
            </h3>
            <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--text-secondary)' }}>
              {t('scheduleText')}
            </p>
            <a
              href={t('lidomUrl')}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-medium"
              style={{
                background: 'var(--bg-tertiary)',
                color: 'var(--accent)',
                border: '1px solid var(--accent)',
              }}
            >
              {t('lidomLinkLabel')}
            </a>
          </div>
        </div>

        {/* Official channels notice */}
        <div
          className="mt-6 p-4 rounded-xl text-sm flex items-start gap-3"
          style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" className="flex-shrink-0 mt-0.5">
            <path d="M12 2l10 4v6c0 5-4.3 8.6-10 10C6.3 20.6 2 17 2 12V6l10-4z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
          <p style={{ color: 'var(--text-secondary)' }}>{t('notice')}</p>
        </div>
      </div>
    </section>
  );
}
