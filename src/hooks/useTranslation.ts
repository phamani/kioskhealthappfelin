"use client";

import { useTranslation as useReactI18nTranslation } from 'react-i18next';
import { useEffect } from 'react';

export function useTranslation(namespace = 'common') {
  const translation = useReactI18nTranslation(namespace);

  useEffect(() => {
    // Ensure i18n is initialized on client side
    if (typeof window !== 'undefined' && !translation.i18n.isInitialized) {
      import('@/lib/i18n');
    }
  }, [translation.i18n.isInitialized]);

  return translation;
}

export default useTranslation; 