import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../theme';

/**
 * ErrorScreen Component
 * 
 * A reusable error screen component that displays various error states
 * with appropriate icons, messages, and action buttons.
 * 
 * Props:
 * - type: string - Type of error ('network', 'notFound', 'server', 'permission', 'generic', 'empty')
 * - title: string (optional) - Custom error title
 * - titleHindi: string (optional) - Custom error title in Hindi
 * - message: string (optional) - Custom error message
 * - messageHindi: string (optional) - Custom error message in Hindi
 * - onRetry: function (optional) - Callback for retry button
 * - onGoBack: function (optional) - Callback for go back button
 * - onGoHome: function (optional) - Callback for go home button
 * - retryLabel: string (optional) - Custom retry button label
 * - showRetry: boolean (optional) - Show/hide retry button (default: true)
 * - showGoBack: boolean (optional) - Show/hide go back button (default: true)
 * - showGoHome: boolean (optional) - Show/hide go home button (default: false)
 */

const ERROR_CONFIGS = {
  network: {
    icon: 'cloud-offline-outline',
    iconType: 'ionicons',
    iconColor: theme.colors.error,
    title: 'No Internet Connection',
    titleHindi: 'कोई इंटरनेट कनेक्शन नहीं',
    message: 'Please check your internet connection and try again. You can still browse cached content in offline mode.',
    messageHindi: 'कृपया अपना इंटरनेट कनेक्शन जांचें और पुनः प्रयास करें। आप अभी भी ऑफ़लाइन मोड में कैश की गई सामग्री ब्राउज़ कर सकते हैं।',
  },
  notFound: {
    icon: 'search-outline',
    iconType: 'ionicons',
    iconColor: theme.colors.textSecondary,
    title: 'Not Found',
    titleHindi: 'नहीं मिला',
    message: 'The page or content you are looking for could not be found. It may have been removed or does not exist.',
    messageHindi: 'आप जो पृष्ठ या सामग्री खोज रहे हैं वह नहीं मिली। इसे हटाया जा सकता है या यह मौजूद नहीं है।',
  },
  server: {
    icon: 'server-off',
    iconType: 'material',
    iconColor: theme.colors.error,
    title: 'Server Error',
    titleHindi: 'सर्वर त्रुटि',
    message: 'Something went wrong on our end. Our team has been notified and is working to fix the issue. Please try again later.',
    messageHindi: 'हमारी ओर से कुछ गलत हो गया। हमारी टीम को सूचित किया गया है और समस्या को ठीक करने के लिए काम कर रही है। कृपया बाद में पुन: प्रयास करें।',
  },
  permission: {
    icon: 'lock-closed-outline',
    iconType: 'ionicons',
    iconColor: theme.colors.warning,
    title: 'Permission Required',
    titleHindi: 'अनुमति आवश्यक',
    message: 'You don\'t have permission to access this content. Please check your account settings or contact support.',
    messageHindi: 'आपको इस सामग्री को एक्सेस करने की अनुमति नहीं है। कृपया अपनी खाता सेटिंग्स जांचें या सहायता से संपर्क करें।',
  },
  generic: {
    icon: 'alert-circle-outline',
    iconType: 'ionicons',
    iconColor: theme.colors.error,
    title: 'Something Went Wrong',
    titleHindi: 'कुछ गलत हो गया',
    message: 'An unexpected error occurred. Please try again. If the problem persists, contact our support team.',
    messageHindi: 'एक अप्रत्याशित त्रुटि हुई। कृपया पुन: प्रयास करें। यदि समस्या बनी रहती है, तो हमारी सहायता टीम से संपर्क करें।',
  },
  empty: {
    icon: 'folder-open-outline',
    iconType: 'ionicons',
    iconColor: theme.colors.textSecondary,
    title: 'No Data Available',
    titleHindi: 'कोई डेटा उपलब्ध नहीं',
    message: 'There is no content to display at the moment. Please check back later or refresh to see updates.',
    messageHindi: 'इस समय प्रदर्शित करने के लिए कोई सामग्री नहीं है। कृपया बाद में जांचें या अपडेट देखने के लिए रीफ्रेश करें।',
  },
  maintenance: {
    icon: 'construct-outline',
    iconType: 'ionicons',
    iconColor: theme.colors.info,
    title: 'Under Maintenance',
    titleHindi: 'रखरखाव के अधीन',
    message: 'We are currently performing scheduled maintenance to improve your experience. Please check back shortly.',
    messageHindi: 'हम आपके अनुभव को बेहतर बनाने के लिए वर्तमान में निर्धारित रखरखाव कर रहे हैं। कृपया जल्द ही वापस जांचें।',
  },
  timeout: {
    icon: 'time-outline',
    iconType: 'ionicons',
    iconColor: theme.colors.warning,
    title: 'Request Timeout',
    titleHindi: 'अनुरोध समय समाप्त',
    message: 'The request took too long to complete. Please check your connection and try again.',
    messageHindi: 'अनुरोध को पूरा होने में बहुत अधिक समय लगा। कृपया अपना कनेक्शन जांचें और पुन: प्रयास करें।',
  },
};

export default function ErrorScreen({
  type = 'generic',
  title = null,
  titleHindi = null,
  message = null,
  messageHindi = null,
  onRetry = null,
  onGoBack = null,
  onGoHome = null,
  retryLabel = 'Try Again',
  retryLabelHindi = 'पुन: प्रयास करें',
  showRetry = true,
  showGoBack = true,
  showGoHome = false,
}) {
  const config = ERROR_CONFIGS[type] || ERROR_CONFIGS.generic;

  const errorTitle = title || config.title;
  const errorTitleHindi = titleHindi || config.titleHindi;
  const errorMessage = message || config.message;
  const errorMessageHindi = messageHindi || config.messageHindi;

  const renderIcon = () => {
    if (config.iconType === 'material') {
      return (
        <MaterialCommunityIcons
          name={config.icon}
          size={120}
          color={config.iconColor}
        />
      );
    }
    return (
      <Ionicons
        name={config.icon}
        size={120}
        color={config.iconColor}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.white} />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            {renderIcon()}
          </View>

          {/* Title */}
          <Text style={styles.title}>{errorTitle}</Text>
          <Text style={styles.titleHindi}>{errorTitleHindi}</Text>

          {/* Message */}
          <Text style={styles.message}>{errorMessage}</Text>
          <Text style={styles.messageHindi}>{errorMessageHindi}</Text>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            {showRetry && onRetry && (
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={onRetry}
                activeOpacity={0.8}
              >
                <Ionicons name="refresh-outline" size={20} color={theme.colors.white} />
                <Text style={styles.primaryButtonText}>{retryLabel}</Text>
                <Text style={styles.primaryButtonTextHindi}>{retryLabelHindi}</Text>
              </TouchableOpacity>
            )}

            {showGoBack && onGoBack && (
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={onGoBack}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-back-outline" size={20} color={theme.colors.primary} />
                <Text style={styles.secondaryButtonText}>Go Back</Text>
                <Text style={styles.secondaryButtonTextHindi}>वापस जाएं</Text>
              </TouchableOpacity>
            )}

            {showGoHome && onGoHome && (
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={onGoHome}
                activeOpacity={0.8}
              >
                <Ionicons name="home-outline" size={20} color={theme.colors.primary} />
                <Text style={styles.secondaryButtonText}>Go to Home</Text>
                <Text style={styles.secondaryButtonTextHindi}>होम पर जाएं</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Help Text */}
          {type === 'network' && (
            <View style={styles.helpContainer}>
              <Ionicons name="information-circle-outline" size={20} color={theme.colors.info} />
              <Text style={styles.helpText}>
                Tip: Enable offline mode in settings to access saved content without internet.
              </Text>
            </View>
          )}

          {(type === 'server' || type === 'generic') && (
            <View style={styles.helpContainer}>
              <Ionicons name="help-circle-outline" size={20} color={theme.colors.textSecondary} />
              <View style={styles.helpTextContainer}>
                <Text style={styles.helpText}>Need help? Contact support:</Text>
                <Text style={styles.helpTextBold}>Helpline: 1800-XXX-XXXX</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xl,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
  },
  iconContainer: {
    marginBottom: theme.spacing.xl,
    opacity: 0.8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.black,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  titleHindi: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  message: {
    fontSize: 16,
    color: theme.colors.black,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: theme.spacing.xs,
  },
  messageHindi: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.xl,
  },
  actionsContainer: {
    width: '100%',
    gap: theme.spacing.sm,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: 12,
    gap: theme.spacing.xs,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.white,
  },
  primaryButtonTextHindi: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.white,
    opacity: 0.9,
  },
  secondaryButton: {
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  secondaryButtonTextHindi: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
    opacity: 0.8,
  },
  helpContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: theme.spacing.xl,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    gap: theme.spacing.sm,
  },
  helpTextContainer: {
    flex: 1,
  },
  helpText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  helpTextBold: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.black,
    marginTop: 4,
  },
});
