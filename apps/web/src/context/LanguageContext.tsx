'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, translations, TranslationSchema } from '@/translations';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationSchema;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    try {
      const savedLocale = localStorage.getItem('ausbildung_locale') as Locale;
      if (savedLocale && ['bn', 'en', 'de'].includes(savedLocale)) {
        const timer = setTimeout(() => {
          setLocaleState(savedLocale);
        }, 0);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore fallback in SSR or restricted storage
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem('ausbildung_locale', newLocale);
      document.documentElement.lang = newLocale;
    } catch {
      // Storage failure graceful handling
    }
  };

  const t = translations[locale];

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
