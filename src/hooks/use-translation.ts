
import { useTranslation as useI18nTranslation } from 'react-i18next';
import { languages } from '@/i18n/i18n';

export const useAppTranslation = () => {
  const { t, i18n } = useI18nTranslation();
  
  const currentLanguage = languages[i18n.language as keyof typeof languages] || languages.en;
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  
  return {
    t,
    i18n,
    currentLanguage,
    availableLanguages: languages,
    changeLanguage
  };
};
