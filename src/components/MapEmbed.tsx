import { useTranslations } from 'next-intl';
import { ATTRACTION } from '@/lib/attraction';

export default function MapEmbed() {
  const t = useTranslations('mapSection');
  const tb = useTranslations('basicInfo');

  return (
    <section id="map" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <p className="mb-8 text-sm" style={{ color: 'var(--text-muted)' }}>{t('subtitle')}</p>
        <div className="w-12 h-0.5 mb-10" style={{ background: 'var(--accent)' }} />

        {/* NAP 区块：名称、地址、电话、Plus Code 与地图商户信息完全一致 */}
        <div
          className="rounded-xl p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
          style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
        >
          <div>
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>
              {tb('officialName')}
            </p>
            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              {ATTRACTION.fullName}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>
              {tb('address')}
            </p>
            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
              {tb('addressValue')}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>
              {tb('phone')}
            </p>
            <a
              href={`tel:${ATTRACTION.phoneE164}`}
              className="font-medium hover:underline"
              style={{ color: 'var(--text-primary)' }}
            >
              {ATTRACTION.phoneDisplay}
            </a>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>
              {tb('plusCode')}
            </p>
            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
              {tb('plusCodeValue')}
            </p>
          </div>
        </div>

        {/* Map */}
        <div
          className="map-container relative rounded-xl overflow-hidden"
          style={{ border: '1px solid var(--map-border)' }}
        >
          {/*
            Google Maps 嵌入（使用 Google 官方 pb 参数 embed 链接）
          */}
          <iframe
            src={ATTRACTION.mapsEmbedSrc}
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title="Google Maps - Estadio Quisqueya Juan Marichal, Santo Domingo"
          />
        </div>

        {/* Open in Google Maps */}
        <div className="mt-6 flex justify-center">
          <a
            href={ATTRACTION.mapsShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white transition-colors"
            style={{ background: 'var(--accent)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {t('openMaps')}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>

        {/* 权威外链：政府 / 官方旅游局 */}
        <p className="mt-6 text-center text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {t('officialText')}{' '}
          <a
            href={ATTRACTION.govtTourismUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline font-medium"
            style={{ color: 'var(--accent)' }}
          >
            {t('officialLinkLabel')}
          </a>
          .
        </p>
      </div>
    </section>
  );
}
