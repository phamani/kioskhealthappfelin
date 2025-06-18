"use client";

import { useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface I18nProviderProps {
  children: ReactNode;
}

export default function I18nProvider({ children }: I18nProviderProps) {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Initialize i18n
    if (typeof window !== 'undefined') {
      // Import the i18n configuration
      import('@/lib/i18n').then(() => {
        // Set initial language from localStorage or default to English
        const savedLanguage = localStorage.getItem('i18nextLng') || 'en';
        if (i18n.language !== savedLanguage) {
          i18n.changeLanguage(savedLanguage);
        }
        
        // Update document direction and language
        document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = savedLanguage;
      });
    }
  }, [i18n]);

  useEffect(() => {
    // Listen for language changes and update document attributes
    const handleLanguageChanged = (lng: string) => {
      if (typeof document !== 'undefined') {
        document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lng;
      }
    };

    i18n.on('languageChanged', handleLanguageChanged);

    // Cleanup listener
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  return <>{children}</>;
} 