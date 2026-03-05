import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DocumentHistoryContext = createContext();

const STORAGE_KEY = '@BolBharat:documentHistory';

export const useDocumentHistory = () => {
  const context = useContext(DocumentHistoryContext);
  if (!context) {
    throw new Error('useDocumentHistory must be used within DocumentHistoryProvider');
  }
  return context;
};

export const DocumentHistoryProvider = ({ children }) => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const storedDocuments = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedDocuments) {
        setDocuments(JSON.parse(storedDocuments));
      }
    } catch (error) {
      console.error('Error loading document history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveToStorage = async (updatedDocuments) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDocuments));
    } catch (error) {
      console.error('Error saving document history:', error);
    }
  };

  const addDocument = async (document) => {
    const newDocument = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...document,
    };

    const updatedDocuments = [newDocument, ...documents];
    setDocuments(updatedDocuments);
    await saveToStorage(updatedDocuments);
    return newDocument.id;
  };

  const updateDocument = async (documentId, updates) => {
    const updatedDocuments = documents.map((doc) =>
      doc.id === documentId ? { ...doc, ...updates } : doc
    );
    setDocuments(updatedDocuments);
    await saveToStorage(updatedDocuments);
  };

  const deleteDocument = async (documentId) => {
    const updatedDocuments = documents.filter((doc) => doc.id !== documentId);
    setDocuments(updatedDocuments);
    await saveToStorage(updatedDocuments);
  };

  const getDocument = (documentId) => {
    return documents.find((doc) => doc.id === documentId);
  };

  const clearAllDocuments = async () => {
    setDocuments([]);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  const getDocumentCount = () => {
    return documents.length;
  };

  const value = {
    documents,
    isLoading,
    addDocument,
    updateDocument,
    deleteDocument,
    getDocument,
    clearAllDocuments,
    getDocumentCount,
  };

  return (
    <DocumentHistoryContext.Provider value={value}>
      {children}
    </DocumentHistoryContext.Provider>
  );
};
