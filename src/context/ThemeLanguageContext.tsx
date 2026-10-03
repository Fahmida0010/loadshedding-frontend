'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Translation Dictionary for Whole Website
const translations: any = {
  en: {
    dashboard: 'Dashboard',
    users: 'Users',
    schedules: 'Schedules',
    substations: 'Substations',
    outages: 'Outages',
    settings: 'Settings',
    darkMode: 'Dark Mode',
    savePreferences: 'Save Preferences',
    // Arw onnanno common text ekhane add korte paren
  },
  bn: {
    dashboard: 'ড্যাশবোর্ড',
    users: 'ব্যবহারকারী',
    schedules: 'সময়সূচী',
    substations: 'সাবস্টেশন',
    outages: 'বিপর্যয় (আউটটেজ)',
    settings: 'সেটিংস',
    darkMode: 'ডার্ক মোড',
    savePreferences: 'পছন্দসমূহ সংরক্ষণ করুন',
  }
};

const ThemeLanguageContext = createContext<any>(null);

export function ThemeLanguageProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // LocalStorage theke initial state load kora
    const savedTheme = localStorage.getItem('theme');
    const savedLang = localStorage.getItem('language') || 'en';

    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }

    setLanguage(savedLang);
  }, []);

  const toggleDarkMode = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string) => {
    return translations[language]?.[key] || translations['en'][key] || key;
  };

  return (
    <ThemeLanguageContext.Provider value={{ darkMode, toggleDarkMode, language, changeLanguage, t }}>
      {children}
    </ThemeLanguageContext.Provider>
  );
}

export function useThemeLanguage() {
  return useContext(ThemeLanguageContext);
}