import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en.json';
import frTranslation from './locales/fr.json';

i18n
  .use(LanguageDetector) // Détection de la langue du navigateur
  .use(initReactI18next) // Intégration avec React
  .init({
    resources: {
      en: { translation: enTranslation },
      fr: { translation: frTranslation }
    },
    fallbackLng: 'en', // Langue par défaut si non trouvée
    interpolation: {
      escapeValue: false, // Permet d'éviter les failles XSS
    },
    detection: {
      order: ['localStorage', 'navigator'], // Vérifie d'abord localStorage puis la langue du navigateur
      caches: ['localStorage'], // Sauvegarde la langue choisie dans le localStorage
    }
  });

export default i18n;
