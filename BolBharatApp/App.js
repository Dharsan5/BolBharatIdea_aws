import './src/config/amplify';
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store';
import RootNavigator from './src/navigation';
import { fonts } from './src/theme';
import { SavedSchemesProvider } from './src/context/SavedSchemesContext';
import { DocumentHistoryProvider } from './src/context/DocumentHistoryContext';
import { ToastProvider } from './src/context/ToastContext';
import { LanguageProvider } from './src/context/LanguageContext';
import offlineManager from './src/utils/offlineManager';
import OfflineBanner from './src/components/OfflineBanner';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts
        await Font.loadAsync(fonts);
        
        // Initialize offline manager
        await offlineManager.initialize();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
    
    // Cleanup on unmount
    return () => {
      offlineManager.cleanup();
    };
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastProvider>
          <LanguageProvider>
            <SavedSchemesProvider>
              <DocumentHistoryProvider>
                <OfflineBanner />
                <RootNavigator />
                <StatusBar style="dark" />
              </DocumentHistoryProvider>
            </SavedSchemesProvider>
          </LanguageProvider>
        </ToastProvider>
      </PersistGate>
    </Provider>
  );
}
