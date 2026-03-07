import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations } from './translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState('en');

  useEffect(() => {
    // Load saved language on mount
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('user_language');
        if (savedLanguage && translations[savedLanguage]) {
          setLanguageState(savedLanguage);
        }
      } catch (error) {
        console.error('Failed to load language', error);
      }
    };
    loadLanguage();
  }, []);

  const setLanguage = async (lang) => {
    if (translations[lang]) {
      try {
        setLanguageState(lang);
        await AsyncStorage.setItem('user_language', lang);
      } catch (error) {
        console.error('Failed to save language', error);
      }
    }
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
