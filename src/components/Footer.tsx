import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { ATTRACTION, SITE_URL } from '@/lib/attraction';

export default function Footer() {
  const t = useTranslations('footer');
  const tb = useTranslations('basicInfo');
  const locale = useLocale();
  const prefix = `/${locale}`;

  const officialLinksObj = t.raw('officialLinks') as Record<string, { name: string; url: string }>;
  const officialLinks = Object.values(officialLinksObj);

  return (
    <footer
      className="py-12 px-4 sm:px-6"
      style={{ background: 'var(--bg-tertiary)', borderTop: '1px solid var(--border-color)' }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-8">
          <div className="max-w-md">
            <h3 className="font-display text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              Estadio Quisqueya Juan Marichal
            </h3>
            <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
              {t('officialResourcesTitle')}
            </p>
            <div className="flex flex-col gap-2">
              {officialLinks.map((link, i) => (
                <a 
                  key={i}
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:underline text-sm" 
                  style={{ color: 'var(--accent)' }}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm mt-4 sm:mt-0">
            <a href={`${prefix}/privacy-policy`} style={{ color: 'var(--text-secondary)' }} className="hover:underline">
              {t('privacy')}
            </a>
            <a href={`${prefix}/terms-of-service`} style={{ color: 'var(--text-secondary)' }} className="hover:underline">
              {t('terms')}
            </a>
            <a href={`${prefix}/cookie-settings`} style={{ color: 'var(--text-secondary)' }} className="hover:underline">
              {t('cookies')}
            </a>
          </div>
        </div>

        <div
          className="pt-6 pb-6 text-center text-xs space-y-2"
          style={{ borderTop: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
        >
          {/* NAP 一致性：官方名称 / 地址 / 电话 与 Google Maps 商户资料保持一致 */}
          <p className="max-w-3xl mx-auto leading-relaxed">
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{ATTRACTION.fullName}</span>
            <span aria-hidden="true"> · </span>
            {tb('addressValue')}
            <span aria-hidden="true"> · </span>
            <a href={`tel:${ATTRACTION.phoneE164}`} className="hover:underline" style={{ color: 'var(--text-muted)' }}>
              {ATTRACTION.phoneDisplay}
            </a>
          </p>
          <p className="max-w-3xl mx-auto leading-relaxed">
            <a href={`${SITE_URL}/${locale}`} className="hover:underline">
              {SITE_URL}
            </a>
          </p>
          <p>{t('rights')}</p>
          <p className="text-xs max-w-3xl mx-auto leading-relaxed">{t('disclaimer')}</p>
        </div>
      </div>
    </footer>
  );
}
