import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import AnimatedBlob from './AnimatedBlob';

/**
 * LoadingScreen Component
 * 
 * A full-screen loading component with various styles and optional branding.
 * 
 * Props:
 * - message: string (optional) - Loading message in English
 * - messageHindi: string (optional) - Loading message in Hindi
 * - variant: 'default' | 'branded' | 'minimal' | 'blob' (default: 'default')
 * - showLogo: boolean (default: true for 'branded' variant)
 * - backgroundColor: string (default: theme.colors.white)
 */

const LOADING_MESSAGES = {
  default: {
    message: 'Loading...',
    messageHindi: 'लोड हो रहा है...',
  },
  schemes: {
    message: 'Loading Schemes...',
    messageHindi: 'योजनाएं लोड हो रही हैं...',
  },
  documents: {
    message: 'Processing Document...',
    messageHindi: 'दस्तावेज़ संसाधित हो रहा है...',
  },
  forms: {
    message: 'Loading Form...',
    messageHindi: 'फॉर्म लोड हो रहा है...',
  },
  profile: {
    message: 'Loading Profile...',
    messageHindi: 'प्रोफाइल लोड हो रहा है...',
  },
  syncing: {
    message: 'Syncing Data...',
    messageHindi: 'डेटा सिंक हो रहा है...',
  },
};

export default function LoadingScreen({
  message = null,
  messageHindi = null,
  variant = 'default',
  showLogo = null,
  backgroundColor = theme.colors.white,
  preset = null, // 'schemes', 'documents', 'forms', 'profile', 'syncing'
}) {
  // Use preset messages if provided
  const presetMessages = preset ? LOADING_MESSAGES[preset] : null;
  const displayMessage = message || presetMessages?.message || LOADING_MESSAGES.default.message;
  const displayMessageHindi = messageHindi || presetMessages?.messageHindi || LOADING_MESSAGES.default.messageHindi;
  
  // Determine if logo should be shown
  const shouldShowLogo = showLogo !== null ? showLogo : variant === 'branded';

  const renderContent = () => {
    switch (variant) {
      case 'branded':
        return (
          <View style={styles.brandedContent}>
            {shouldShowLogo && (
              <View style={styles.logoContainer}>
                <View style={styles.logo}>
                  <Ionicons name="megaphone" size={60} color={theme.colors.primary} />
                </View>
                <Text style={styles.appName}>BolBharat</Text>
                <Text style={styles.appNameHindi}>बोल भारत</Text>
              </View>
            )}
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.message}>{displayMessage}</Text>
              <Text style={styles.messageHindi}>{displayMessageHindi}</Text>
            </View>
          </View>
        );

      case 'minimal':
        return (
          <View style={styles.minimalContent}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        );

      case 'blob':
        return (
          <View style={styles.blobContent}>
            <View style={styles.blobWrapper}>
              <AnimatedBlob isListening={true} amplitude={0.5} />
            </View>
            <Text style={styles.message}>{displayMessage}</Text>
            <Text style={styles.messageHindi}>{displayMessageHindi}</Text>
          </View>
        );

      default:
        return (
          <View style={styles.defaultContent}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <View style={styles.messageContainer}>
              <Text style={styles.message}>{displayMessage}</Text>
              <Text style={styles.messageHindi}>{displayMessageHindi}</Text>
            </View>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandedContent: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.xl,
  },
  minimalContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  blobContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.black,
  },
  appNameHindi: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  messageContainer: {
    marginTop: theme.spacing.md,
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.black,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  messageHindi: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  blobWrapper: {
    width: 200,
    height: 200,
    marginBottom: theme.spacing.lg,
  },
});
