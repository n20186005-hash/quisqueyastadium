import { useTranslations, useMessages, useLocale } from 'next-intl';
import { nearbyGuides } from '@/lib/nearby-guides';

type NearbyItem = { name: string; note: string };

const featuredNearby = [
  { slug: 'zona-colonial', image: 'https://upload.wikimedia.org/wikipedia/commons/2/27/Zona_colonial.jpg', source: 'https://commons.wikimedia.org/wiki/File:Zona_colonial.jpg' },
  { slug: 'parque-mirador-del-sur', image: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Parque_Mirador_Sur_-_Santo_Domingo.jpg', source: 'https://commons.wikimedia.org/wiki/File:Parque_Mirador_Sur_-_Santo_Domingo.jpg' },
  { slug: 'malecon-santo-domingo', image: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Malecon_de_Santo_Domingo_2013-10-01_21-33.jpg', source: 'https://commons.wikimedia.org/wiki/File:Malecon_de_Santo_Domingo_2013-10-01_21-33.jpg' },
  { slug: 'faro-a-colon', image: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Faro_a_Colon_SD_RD_02_2017_1859.jpg', source: 'https://commons.wikimedia.org/wiki/File:Faro_a_Colon_SD_RD_02_2017_1859.jpg' },
] as const;

export default function NearbySection() {
  const t = useTranslations('nearby');
  const locale = useLocale() as 'es' | 'en' | 'zh';
  const messages = useMessages() as any;
  const items = (messages?.nearby?.items || []) as NearbyItem[];

  return (
    <section id="nearby" className="section-padding">
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-8" style={{ background: 'var(--accent)' }} />

        <p
          className="text-lg leading-relaxed mb-10"
          style={{ color: 'var(--text-secondary)' }}
          dangerouslySetInnerHTML={{
            __html: t('lead').replace(
              /\*\*(.*?)\*\*/g,
              '<strong style="color: var(--text-primary)">$1</strong>'
            ),
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
            >
              <a href={`/${locale}/nearby/${featuredNearby[i].slug}`} aria-label={item.name}>
                <img src={featuredNearby[i].image} alt={item.name} loading="lazy" className="w-full h-52 object-cover" />
              </a>
              <div className="p-6">
              <h3 className="font-display text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                <a href={`/${locale}/nearby/${featuredNearby[i].slug}`} className="hover:underline">{item.name}</a>
              </h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                {item.note}
              </p>
              <a
                href={`/${locale}/nearby/${featuredNearby[i].slug}`}
                className="inline-flex items-center gap-1.5 text-sm hover:underline"
                style={{ color: 'var(--accent)' }}
              >
                {nearbyGuides[featuredNearby[i].slug].localized[locale].title}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
              <a href={featuredNearby[i].source} target="_blank" rel="noopener noreferrer" className="block mt-3 text-xs hover:underline" style={{ color: 'var(--text-muted)' }}>Wikimedia Commons</a>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(Object.keys(nearbyGuides) as Array<keyof typeof nearbyGuides>).map(slug => {
            const guide = nearbyGuides[slug];
            return <a key={slug} href={`/${locale}/nearby/${slug}`} className="rounded-2xl overflow-hidden transition-transform hover:-translate-y-1" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
              <img src={guide.image} alt={guide.name} loading="lazy" className="w-full h-52 object-cover" />
              <div className="p-6"><h3 className="font-display text-xl font-semibold mb-2">{guide.localized[locale].title}</h3><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{guide.localized[locale].intro}</p></div>
            </a>;
          })}
        </div>
      </div>
    </section>
  );
}
