import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SavedSchemesContext = createContext();

const SAVED_SCHEMES_KEY = '@BolBharat:savedSchemes';

export const SavedSchemesProvider = ({ children }) => {
  const [savedSchemeIds, setSavedSchemeIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved schemes from AsyncStorage on mount
  useEffect(() => {
    loadSavedSchemes();
  }, []);

  const loadSavedSchemes = async () => {
    try {
      const saved = await AsyncStorage.getItem(SAVED_SCHEMES_KEY);
      if (saved) {
        setSavedSchemeIds(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading saved schemes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveToStorage = async (ids) => {
    try {
      await AsyncStorage.setItem(SAVED_SCHEMES_KEY, JSON.stringify(ids));
    } catch (error) {
      console.error('Error saving schemes:', error);
    }
  };

  const toggleSaveScheme = async (schemeId) => {
    let newSavedIds;
    if (savedSchemeIds.includes(schemeId)) {
      // Remove from saved
      newSavedIds = savedSchemeIds.filter(id => id !== schemeId);
    } else {
      // Add to saved
      newSavedIds = [...savedSchemeIds, schemeId];
    }
    setSavedSchemeIds(newSavedIds);
    await saveToStorage(newSavedIds);
  };

  const isSchemeSaved = (schemeId) => {
    return savedSchemeIds.includes(schemeId);
  };

  const getSavedSchemesCount = () => {
    return savedSchemeIds.length;
  };

  const clearAllSaved = async () => {
    setSavedSchemeIds([]);
    await saveToStorage([]);
  };

  return (
    <SavedSchemesContext.Provider
      value={{
        savedSchemeIds,
        toggleSaveScheme,
        isSchemeSaved,
        getSavedSchemesCount,
        clearAllSaved,
        isLoading,
      }}
    >
      {children}
    </SavedSchemesContext.Provider>
  );
};

export const useSavedSchemes = () => {
  const context = useContext(SavedSchemesContext);
  if (!context) {
    throw new Error('useSavedSchemes must be used within SavedSchemesProvider');
  }
  return context;
};
