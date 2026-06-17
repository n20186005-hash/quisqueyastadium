import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default async function CookieSettings({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CookieContent />;
}

function CookieContent() {
  const t = useTranslations('cookieSettings');
  
  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-16 px-4" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-display font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            {t('title')}
          </h1>
          <div className="text-sm mb-12 whitespace-pre-line" style={{ color: 'var(--text-muted)' }}>
            {t('description')}
          </div>

          <div className="space-y-6">
            {/* Essential */}
            <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{t('essential.title')}</h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{t('essential.description')}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  {t('essential.badge')}
                </span>
              </div>
            </div>

            {/* Analytics */}
            <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{t('analytics.title')}</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{t('analytics.description')}</p>
              
              <div className="space-y-4">
                {t.raw('analytics.items').map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-center py-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
                    <div>
                      <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{item.name}</div>
                      <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{item.description}</div>
                    </div>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Marketing */}
            <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{t('marketing.title')}</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{t('marketing.description')}</p>
              
              <div className="space-y-4">
                {t.raw('marketing.items').map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-center py-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
                    <div>
                      <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{item.name}</div>
                      <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{item.description}</div>
                    </div>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Preferences */}
            <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{t('preferences.title')}</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{t('preferences.description')}</p>
              
              <div className="space-y-4">
                {t.raw('preferences.items').map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-center py-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
                    <div>
                      <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{item.name}</div>
                      <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{item.description}</div>
                    </div>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <p className="text-sm mt-8" style={{ color: 'var(--text-muted)' }}>
              {t('consentManagement')}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
