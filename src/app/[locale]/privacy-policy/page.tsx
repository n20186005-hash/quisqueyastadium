import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default async function PrivacyPolicy({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Instead of using useTranslations, we can use a server component or just use it here since next-intl works in both
  // But actually wait, we need to pass translations or use useTranslations (which requires NextIntlClientProvider or can be used in server components too)
  // We'll make it a simple server component and use next-intl's getTranslations. Wait, let's just use `useTranslations` (it works in server components in Next.js 13+ app router with next-intl)

  return <PrivacyContent />;
}

// Separate component to easily use useTranslations
function PrivacyContent() {
  const t = useTranslations('privacy');
  
  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-16 px-4" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-display font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            {t('title')}
          </h1>
          <p className="text-sm mb-12" style={{ color: 'var(--text-muted)' }}>
            {t('lastUpdated')}
          </p>

          <div className="space-y-8">
            {t.raw('sections').map((section: any, index: number) => (
              <div key={index} className="space-y-3">
                <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {section.heading}
                </h2>
                <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
