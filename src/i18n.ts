import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import zh from './locales/zh.json';

if (!i18n.isInitialized) {
  if (typeof window !== 'undefined') {
    i18n.use(LanguageDetector);
  }

  i18n
    .use(initReactI18next)
    .init({
    fallbackLng: 'en',
    lng: typeof window === 'undefined' ? 'en' : undefined,
    supportedLngs: ['en', 'zh'],
    resources: {
      en: { translation: en },
      zh: { translation: zh },
    },
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });
}

export default i18n;
