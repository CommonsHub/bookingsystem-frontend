
import React, { createContext, useContext, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { languages } from './i18n';

type TranslationContextType = {
  changeLanguage: (lng: string) => void;
  currentLanguage: string;
  availableLanguages: typeof languages;
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <TranslationContext.Provider
      value={{
        changeLanguage,
        currentLanguage: i18n.language,
        availableLanguages: languages,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

export const useAppTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useAppTranslation must be used within a TranslationProvider');
  }
  return context;
};
