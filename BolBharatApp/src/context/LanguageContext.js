import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_STORAGE_KEY = '@bolbharat_language';

// Supported languages
export const LANGUAGES = [
  {
    id: 'en',
    name: 'English',
    nativeName: 'English',
    code: 'en-IN',
    flag: '🇮🇳',
  },
  {
    id: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    code: 'hi-IN',
    flag: '🇮🇳',
  },
  {
    id: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    code: 'ta-IN',
    flag: '🇮🇳',
  },
  {
    id: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    code: 'te-IN',
    flag: '🇮🇳',
  },
  {
    id: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    code: 'kn-IN',
    flag: '🇮🇳',
  },
  {
    id: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    code: 'ml-IN',
    flag: '🇮🇳',
  },
  {
    id: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    code: 'mr-IN',
    flag: '🇮🇳',
  },
  {
    id: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    code: 'gu-IN',
    flag: '🇮🇳',
  },
  {
    id: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    code: 'bn-IN',
    flag: '🇮🇳',
  },
  {
    id: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    code: 'pa-IN',
    flag: '🇮🇳',
  },
];

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState(LANGUAGES[0]); // Default to English
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const savedLanguageId = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguageId) {
        const language = LANGUAGES.find(lang => lang.id === savedLanguageId);
        if (language) {
          setCurrentLanguage(language);
        }
      }
    } catch (error) {
      console.error('Error loading saved language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = async (languageId) => {
    try {
      const language = LANGUAGES.find(lang => lang.id === languageId);
      if (language) {
        setCurrentLanguage(language);
        await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageId);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error saving language:', error);
      return false;
    }
  };

  const getLanguageById = (languageId) => {
    return LANGUAGES.find(lang => lang.id === languageId);
  };

  const value = {
    currentLanguage,
    changeLanguage,
    getLanguageById,
    languages: LANGUAGES,
    isLoading,
  };

  return (
    <LanguageContext.Provider value={value}>
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

export default LanguageContext;
