import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import kkCommon from '@/shared/i18n/kk/common.json';
import kkHome from '@/shared/i18n/kk/home.json';
import kkCatalog from '@/shared/i18n/kk/catalog.json';
import kkOrder from '@/shared/i18n/kk/order.json';
import kkAuth from '@/shared/i18n/kk/auth.json';
import kkMyOrders from '@/shared/i18n/kk/myOrders.json';
import kkAdmin from '@/shared/i18n/kk/admin.json';
import kkSeo from '@/shared/i18n/kk/seo.json';

import ruCommon from '@/shared/i18n/ru/common.json';
import ruHome from '@/shared/i18n/ru/home.json';
import ruCatalog from '@/shared/i18n/ru/catalog.json';
import ruOrder from '@/shared/i18n/ru/order.json';
import ruAuth from '@/shared/i18n/ru/auth.json';
import ruMyOrders from '@/shared/i18n/ru/myOrders.json';
import ruAdmin from '@/shared/i18n/ru/admin.json';
import ruSeo from '@/shared/i18n/ru/seo.json';

import enCommon from '@/shared/i18n/en/common.json';
import enHome from '@/shared/i18n/en/home.json';
import enCatalog from '@/shared/i18n/en/catalog.json';
import enOrder from '@/shared/i18n/en/order.json';
import enAuth from '@/shared/i18n/en/auth.json';
import enMyOrders from '@/shared/i18n/en/myOrders.json';
import enAdmin from '@/shared/i18n/en/admin.json';
import enSeo from '@/shared/i18n/en/seo.json';

const resources = {
  kk: {
    common: kkCommon,
    home: kkHome,
    catalog: kkCatalog,
    order: kkOrder,
    auth: kkAuth,
    myOrders: kkMyOrders,
    admin: kkAdmin,
    seo: kkSeo,
  },
  ru: {
    common: ruCommon,
    home: ruHome,
    catalog: ruCatalog,
    order: ruOrder,
    auth: ruAuth,
    myOrders: ruMyOrders,
    admin: ruAdmin,
    seo: ruSeo,
  },
  en: {
    common: enCommon,
    home: enHome,
    catalog: enCatalog,
    order: enOrder,
    auth: enAuth,
    myOrders: enMyOrders,
    admin: enAdmin,
    seo: enSeo,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'kk',
    supportedLngs: ['kk', 'ru', 'en'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
