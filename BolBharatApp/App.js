import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import RootNavigator from './src/navigation';
import { fonts } from './src/theme';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts
        await Font.loadAsync({
          'ClashDisplay-ExtraLight': fonts.ClashDisplay.ExtraLight,
          'ClashDisplay-Light': fonts.ClashDisplay.Light,
          'ClashDisplay-Regular': fonts.ClashDisplay.Regular,
          'ClashDisplay-Medium': fonts.ClashDisplay.Medium,
          'ClashDisplay-SemiBold': fonts.ClashDisplay.SemiBold,
          'ClashDisplay-Bold': fonts.ClashDisplay.Bold,
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <>
      <RootNavigator />
      <StatusBar style="dark" />
    </>
  );
}
