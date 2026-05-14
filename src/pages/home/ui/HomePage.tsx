import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { HomeHero } from './home-hero';
import { HomeBenefits } from './home-benefits';
import { HomeLocations } from './home-locations';
import { HomeCta } from './home-cta';

export const HomePage = () => {
  const { t, i18n } = useTranslation('seo');
  const lang = i18n.language;

  return (
    <>
      <Helmet>
        <title>{t('home.title')}</title>
        <meta name="description" content={t('home.description')} />
        <meta property="og:title" content={t('home.title')} />
        <meta property="og:description" content={t('home.description')} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`https://almatycamping.kz/${lang === 'kk' ? '' : lang}`} />
        <html lang={lang} />
      </Helmet>
      <div className="flex flex-col">
        <HomeHero />
        <HomeBenefits />
        <HomeLocations />
        <HomeCta />
      </div>
    </>
  );
};
