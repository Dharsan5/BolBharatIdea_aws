import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import ErrorScreen from '../components/ErrorScreen';
import InlineError from '../components/InlineError';

/**
 * ErrorScreensDemo
 * 
 * Demo screen to showcase all available error screen types and inline errors.
 * This is a development/testing screen and should not be included in production.
 */

const ERROR_TYPES = [
  { id: 'network', label: 'Network Error', labelHindi: 'नेटवर्क त्रुटि' },
  { id: 'notFound', label: 'Not Found (404)', labelHindi: 'नहीं मिला (404)' },
  { id: 'server', label: 'Server Error (500)', labelHindi: 'सर्वर त्रुटि (500)' },
  { id: 'permission', label: 'Permission Denied', labelHindi: 'अनुमति अस्वीकृत' },
  { id: 'generic', label: 'Generic Error', labelHindi: 'सामान्य त्रुटि' },
  { id: 'empty', label: 'Empty State', labelHindi: 'खाली स्थिति' },
  { id: 'maintenance', label: 'Maintenance', labelHindi: 'रखरखाव' },
  { id: 'timeout', label: 'Request Timeout', labelHindi: 'समय समाप्त' },
];

export default function ErrorScreensDemo({ navigation }) {
  const [selectedError, setSelectedError] = useState(null);
  const [showInlineErrors, setShowInlineErrors] = useState(true);

  const handleRetry = () => {
    console.log('Retry button pressed');
    setSelectedError(null);
  };

  const handleGoBack = () => {
    console.log('Go back button pressed');
    setSelectedError(null);
  };

  const handleGoHome = () => {
    console.log('Go home button pressed');
    setSelectedError(null);
  };

  // If an error type is selected, show the error screen
  if (selectedError) {
    return (
      <ErrorScreen
        type={selectedError}
        onRetry={handleRetry}
        onGoBack={handleGoBack}
        onGoHome={handleGoHome}
        showGoHome={true}
      />
    );
  }

  // Otherwise, show the demo selection screen
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.black} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Error Screens Demo</Text>
          <Text style={styles.headerSubtitle}>त्रुटि स्क्रीन डेमो</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Full Page Error Screens */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Full Page Error Screens</Text>
          <Text style={styles.sectionSubtitle}>पूर्ण पृष्ठ त्रुटि स्क्रीन</Text>
          <Text style={styles.sectionDescription}>
            Tap any error type to see the full-screen error display
          </Text>

          <View style={styles.errorTypesList}>
            {ERROR_TYPES.map((errorType) => (
              <TouchableOpacity
                key={errorType.id}
                style={styles.errorTypeCard}
                onPress={() => setSelectedError(errorType.id)}
                activeOpacity={0.7}
              >
                <View style={styles.errorTypeContent}>
                  <Text style={styles.errorTypeLabel}>{errorType.label}</Text>
                  <Text style={styles.errorTypeLabelHindi}>{errorType.labelHindi}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Inline Errors */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Inline Errors</Text>
              <Text style={styles.sectionSubtitle}>इनलाइन त्रुटियां</Text>
            </View>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setShowInlineErrors(!showInlineErrors)}
            >
              <Text style={styles.toggleButtonText}>
                {showInlineErrors ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionDescription}>
            Inline error messages for use in forms and validations
          </Text>

          {showInlineErrors && (
            <View style={styles.inlineErrorsList}>
              <View style={styles.inlineErrorDemo}>
                <Text style={styles.fieldLabel}>Email Address</Text>
                <View style={styles.inputPlaceholder}>
                  <Text style={styles.inputText}>user@exampl</Text>
                </View>
                <InlineError
                  message="Please enter a valid email address"
                  messageHindi="कृपया एक वैध ईमेल पता दर्ज करें"
                />
              </View>

              <View style={styles.inlineErrorDemo}>
                <Text style={styles.fieldLabel}>Phone Number</Text>
                <View style={styles.inputPlaceholder}>
                  <Text style={styles.inputText}>98765432</Text>
                </View>
                <InlineError
                  message="Phone number must be 10 digits"
                  messageHindi="फोन नंबर 10 अंकों का होना चाहिए"
                  icon="call-outline"
                />
              </View>

              <View style={styles.inlineErrorDemo}>
                <Text style={styles.fieldLabel}>Password</Text>
                <View style={styles.inputPlaceholder}>
                  <Text style={styles.inputText}>••••</Text>
                </View>
                <InlineError
                  message="Password must be at least 8 characters with numbers and symbols"
                  messageHindi="पासवर्ड कम से कम 8 वर्णों का होना चाहिए जिसमें संख्याएं और चिह्न हों"
                  icon="lock-closed-outline"
                />
              </View>

              <View style={styles.inlineErrorDemo}>
                <Text style={styles.fieldLabel}>File Upload</Text>
                <View style={styles.inputPlaceholder}>
                  <Text style={styles.inputText}>document.exe</Text>
                </View>
                <InlineError
                  message="Invalid file format. Please upload PDF, JPG, or PNG files only"
                  messageHindi="अमान्य फ़ाइल प्रारूप। कृपया केवल PDF, JPG, या PNG फ़ाइलें अपलोड करें"
                  icon="document-outline"
                />
              </View>

              <View style={styles.inlineErrorDemo}>
                <Text style={styles.fieldLabel}>Connection Status</Text>
                <InlineError
                  message="Unable to connect to server. Check your internet connection."
                  messageHindi="सर्वर से कनेक्ट करने में असमर्थ। अपना इंटरनेट कनेक्शन जांचें।"
                  icon="cloud-offline-outline"
                />
              </View>
            </View>
          )}
        </View>

        {/* Usage Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={24} color={theme.colors.info} />
            <Text style={styles.infoTitle}>Usage Information</Text>
          </View>
          <Text style={styles.infoText}>
            These error components are reusable throughout the app. Import them from the components folder:
          </Text>
          <View style={styles.codeBlock}>
            <Text style={styles.codeText}>
              import ErrorScreen from '../components/ErrorScreen';{'\n'}
              import InlineError from '../components/InlineError';{'\n'}
              import ErrorBoundary from '../components/ErrorBoundary';
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.black,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  section: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.elevation.small,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.black,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  sectionDescription: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    lineHeight: 18,
  },
  errorTypesList: {
    gap: theme.spacing.sm,
  },
  errorTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  errorTypeContent: {
    flex: 1,
  },
  errorTypeLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.black,
  },
  errorTypeLabelHindi: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  toggleButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.white,
  },
  inlineErrorsList: {
    gap: theme.spacing.lg,
  },
  inlineErrorDemo: {
    gap: theme.spacing.xs,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.black,
    marginBottom: 4,
  },
  inputPlaceholder: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  inputText: {
    fontSize: 15,
    color: theme.colors.black,
  },
  infoCard: {
    backgroundColor: theme.colors.info + '10',
    borderRadius: 12,
    padding: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.info,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.info,
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.black,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  codeBlock: {
    backgroundColor: '#282c34',
    borderRadius: 8,
    padding: theme.spacing.sm,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#61dafb',
    lineHeight: 18,
  },
});
