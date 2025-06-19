import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from '../../public/locales/en/common.json';
import arTranslations from '../../public/locales/ar/common.json';

const resources = {
  en: {
    common: enTranslations,
  },
  ar: {
    common: arTranslations,
  },
};

// Initialize i18n
const initializeI18n = () => {
  if (!i18n.isInitialized) {
    return i18n
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        resources,
        fallbackLng: 'en',
        defaultNS: 'common',
        debug: false,
        interpolation: {
          escapeValue: false,
        },
        detection: {
          order: ['localStorage', 'navigator'],
          caches: ['localStorage'],
          lookupLocalStorage: 'i18nextLng',
          checkWhitelist: true,
        },
        whitelist: ['en', 'ar'],
        react: {
          useSuspense: false, // Disable suspense for SSR compatibility
        },
      });
  }
  return Promise.resolve();
};

// Auto-initialize on import if in browser
if (typeof window !== 'undefined') {
  initializeI18n();
}

export { initializeI18n };
export default i18n; 