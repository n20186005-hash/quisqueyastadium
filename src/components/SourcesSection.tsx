import { useTranslations, useMessages } from 'next-intl';

type SourceItem = { name: string; url: string; note: string };

export default function SourcesSection() {
  const t = useTranslations('sources');
  const messages = useMessages() as any;
  const items = (messages?.sources?.items || []) as SourceItem[];

  return (
    <section id="sources" className="section-padding">
      <div className="max-w-4xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-8" style={{ background: 'var(--accent)' }} />

        <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
          {t('lead')}
        </p>

        <ul className="space-y-3 mb-8">
          {items.map((item, i) => (
            <li
              key={i}
              className="rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
            >
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:underline shrink-0"
                style={{ color: 'var(--accent)' }}
              >
                {item.name}
              </a>
              <span className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {item.note}
              </span>
            </li>
          ))}
        </ul>

        {/* 图片来源与版权声明 */}
        <p
          className="text-xs leading-relaxed p-4 rounded-lg"
          style={{ background: 'var(--bg-tertiary)', border: '1px dashed var(--border-color)', color: 'var(--text-muted)' }}
        >
          {t('imageRights')}
        </p>
      </div>
    </section>
  );
}
