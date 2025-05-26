
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Available languages
export const languages = {
  en: { name: 'English', flag: '🇬🇧', nativeName: 'English' },
  fr: { name: 'French', flag: '🇫🇷', nativeName: 'Français' },
  nl: { name: 'Dutch', flag: '🇳🇱', nativeName: 'Nederlands' }
};

i18n
  // Load translation using http -> see /public/locales
  // Learn more: https://github.com/i18next/i18next-http-backend
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    supportedLngs: Object.keys(languages),
    fallbackLng: 'en',
    debug: import.meta.env.DEV,

    // Backend configuration - where to load translations from
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    // Detection options - allows automatic detection of user language
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false, // React already safes from XSS
    },

    // Multiple namespaces for organized translations
    defaultNS: 'common',
    ns: [
      'common',
      'auth',
      'bookings',
      'booking',
      'forms',
      'pricing',
      'status',
      'navigation',
      'alerts',
      'buttons',
      'messages',
      'rooms',
      'errors'
    ],
    
    // Use React's Suspense for loading translations
    react: {
      useSuspense: true,
    },
  });

export default i18n;
