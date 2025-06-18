"use client";

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);

  useEffect(() => {
    // Initialize i18n if not already loaded
    if (typeof window !== 'undefined') {
      import('@/lib/i18n');
    }
  }, []);

  useEffect(() => {
    if (i18n && i18n.language) {
      const current = languages.find(lang => lang.code === i18n.language) || languages[0];
      setCurrentLanguage(current);
      
      // Update document direction for Arabic
      if (typeof document !== 'undefined') {
        document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = i18n.language;
      }
    }
  }, [i18n?.language]);

  const changeLanguage = (languageCode: string) => {
    if (i18n && typeof i18n.changeLanguage === 'function') {
      i18n.changeLanguage(languageCode);
      localStorage.setItem('i18nextLng', languageCode);
      
      // Manually update document direction for immediate feedback
      if (typeof document !== 'undefined') {
        document.documentElement.dir = languageCode === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = languageCode;
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 px-3 py-2"
        >
          <Globe size={16} />
          <span className="text-lg">{currentLanguage.flag}</span>
          <span className="hidden sm:inline">{currentLanguage.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={`flex items-center gap-3 cursor-pointer ${
              currentLanguage.code === language.code ? 'bg-accent' : ''
            }`}
          >
            <span className="text-lg">{language.flag}</span>
            <span>{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 