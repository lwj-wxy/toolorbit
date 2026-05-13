import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import zh from './locales/zh.json';

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
    fallbackLng: 'en',
    lng: 'en',
    supportedLngs: ['en', 'zh'],
    resources: {
      en: { translation: en },
      zh: { translation: zh },
    },
    interpolation: {
      escapeValue: false
    },
  });
}

export default i18n;
