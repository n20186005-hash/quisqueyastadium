import { useTranslations, useMessages } from 'next-intl';

type StoryPart = { heading: string; text: string };

function renderRich(text: string) {
  return text.replace(
    /\*\*(.*?)\*\*/g,
    '<strong style="color: var(--text-primary); font-weight: 600;">$1</strong>'
  );
}

export default function StorySection() {
  const t = useTranslations('story');
  const messages = useMessages() as any;
  const parts: StoryPart[] = messages?.story?.parts ?? [];

  return (
    <section id="story" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-4xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <p className="mb-4" style={{ color: 'var(--text-muted)' }}>{t('subtitle')}</p>
        <div className="w-12 h-0.5 mb-10" style={{ background: 'var(--accent)' }} />

        <div className="space-y-10">
          {parts.map((part, i) => (
            <article key={i}>
              <div className="flex items-start gap-4">
                <span
                  className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center font-display text-sm font-bold shrink-0 mt-0.5"
                  style={{ background: 'var(--bg-tertiary)', color: 'var(--accent)', border: '1px solid var(--border-color)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3
                    className="font-display text-xl sm:text-2xl font-semibold mb-3"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {part.heading}
                  </h3>
                  <div
                    className="text-base leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                    dangerouslySetInnerHTML={{ __html: renderRich(part.text) }}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>

        <p
          className="mt-10 text-xs leading-relaxed border-t pt-6"
          style={{ color: 'var(--text-muted)', borderColor: 'var(--border-color)' }}
        >
          {t('note')}
        </p>
      </div>
    </section>
  );
}
