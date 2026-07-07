import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import pt from './pt.json';
import en from './en.json';

const saved = localStorage.getItem('claru.language');
const browser = navigator.language?.startsWith('pt') ? 'pt' : 'en';

i18n.use(initReactI18next).init({
  resources: { pt: { translation: pt }, en: { translation: en } },
  lng: saved || browser,
  fallbackLng: 'pt',
  interpolation: { escapeValue: false },
});

i18n.on('languageChanged', (lng) => localStorage.setItem('claru.language', lng));
export default i18n;
