import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import useToast from '../hooks/useToast';

/**
 * ToastDemo
 * 
 * Demo screen to showcase all toast notification types and features.
 * This is a development/testing screen.
 */

export default function ToastDemo({ navigation }) {
  const toast = useToast();
  const [position, setPosition] = useState('top');

  // Example toast messages
  const examples = {
    success: {
      message: 'Profile updated successfully!',
      messageHindi: 'प्रोफ़ाइल सफलतापूर्वक अपडेट किया गया!',
    },
    error: {
      message: 'Failed to upload document',
      messageHindi: 'दस्तावेज़ अपलोड करने में विफल',
    },
    warning: {
      message: 'Low storage space remaining',
      messageHindi: 'कम स्टोरेज स्पेस शेष है',
    },
    info: {
      message: 'New scheme matching your profile',
      messageHindi: 'आपकी प्रोफ़ाइल से मेल खाने वाली नई योजना',
    },
  };

  const showBasicToasts = () => {
    toast.showSuccess(examples.success.message, examples.success.messageHindi, { position });
  };

  const showErrorToast = () => {
    toast.showError(examples.error.message, examples.error.messageHindi, { position });
  };

  const showWarningToast = () => {
    toast.showWarning(examples.warning.message, examples.warning.messageHindi, { position });
  };

  const showInfoToast = () => {
    toast.showInfo(examples.info.message, examples.info.messageHindi, { position });
  };

  const showWithAction = () => {
    toast.showToast({
      type: 'info',
      message: 'New message received',
      messageHindi: 'नया संदेश प्राप्त हुआ',
      actionText: 'View',
      onActionPress: () => {
        Alert.alert('Action Pressed', 'You pressed the action button!');
      },
      position,
    });
  };

  const showLongDuration = () => {
    toast.showInfo(
      'This toast will stay for 10 seconds',
      'यह टोस्ट 10 सेकंड तक रहेगा',
      { duration: 10000, position }
    );
  };

  const showMultiple = () => {
    toast.showSuccess('First toast', 'पहला टोस्ट', { position });
    setTimeout(() => {
      toast.showInfo('Second toast', 'दूसरा टोस्ट', { position });
    }, 500);
    setTimeout(() => {
      toast.showWarning('Third toast', 'तीसरा टोस्ट', { position });
    }, 1000);
  };

  const showNoPersistent = () => {
    toast.showToast({
      type: 'warning',
      message: 'This toast will not auto-dismiss',
      messageHindi: 'यह टोस्ट स्वतः खारिज नहीं होगा',
      duration: 0, // 0 means no auto-dismiss
      position,
    });
  };

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
          <Text style={styles.headerTitle}>Toast Notifications Demo</Text>
          <Text style={styles.headerSubtitle}>टोस्ट सूचनाएं डेमो</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Position Toggle */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Toast Position</Text>
          <Text style={styles.sectionSubtitle}>टोस्ट स्थिति</Text>
          
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                position === 'top' && styles.toggleButtonActive,
              ]}
              onPress={() => setPosition('top')}
            >
              <Text
                style={[
                  styles.toggleText,
                  position === 'top' && styles.toggleTextActive,
                ]}
              >
                Top
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                position === 'bottom' && styles.toggleButtonActive,
              ]}
              onPress={() => setPosition('bottom')}
            >
              <Text
                style={[
                  styles.toggleText,
                  position === 'bottom' && styles.toggleTextActive,
                ]}
              >
                Bottom
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Basic Toast Types */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Toast Types</Text>
          <Text style={styles.sectionSubtitle}>टोस्ट प्रकार</Text>

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.colors.success }]}
              onPress={showBasicToasts}
            >
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.white} />
              <Text style={styles.buttonText}>Success</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.colors.error }]}
              onPress={showErrorToast}
            >
              <Ionicons name="close-circle" size={20} color={theme.colors.white} />
              <Text style={styles.buttonText}>Error</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.colors.warning }]}
              onPress={showWarningToast}
            >
              <Ionicons name="warning" size={20} color={theme.colors.white} />
              <Text style={[styles.buttonText, { color: theme.colors.black }]}>Warning</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.colors.info }]}
              onPress={showInfoToast}
            >
              <Ionicons name="information-circle" size={20} color={theme.colors.white} />
              <Text style={styles.buttonText}>Info</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Advanced Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Advanced Features</Text>
          <Text style={styles.sectionSubtitle}>उन्नत सुविधाएँ</Text>

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.buttonSecondary}
              onPress={showWithAction}
            >
              <Text style={styles.buttonSecondaryText}>With Action Button</Text>
              <Text style={styles.buttonSecondarySubtext}>एक्शन बटन के साथ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonSecondary}
              onPress={showLongDuration}
            >
              <Text style={styles.buttonSecondaryText}>Long Duration (10s)</Text>
              <Text style={styles.buttonSecondarySubtext}>लंबी अवधि (10 सेकंड)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonSecondary}
              onPress={showNoPersistent}
            >
              <Text style={styles.buttonSecondaryText}>No Auto-Dismiss</Text>
              <Text style={styles.buttonSecondarySubtext}>स्वतः खारिज नहीं</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonSecondary}
              onPress={showMultiple}
            >
              <Text style={styles.buttonSecondaryText}>Multiple Toasts</Text>
              <Text style={styles.buttonSecondarySubtext}>एकाधिक टोस्ट</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Control Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Controls</Text>
          <Text style={styles.sectionSubtitle}>नियंत्रण</Text>

          <TouchableOpacity
            style={styles.buttonDanger}
            onPress={() => toast.dismissAll()}
          >
            <Ionicons name="close-circle-outline" size={20} color={theme.colors.white} />
            <Text style={styles.buttonText}>Dismiss All Toasts</Text>
          </TouchableOpacity>
        </View>

        {/* Usage Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={24} color={theme.colors.info} />
            <Text style={styles.infoTitle}>Usage Information</Text>
          </View>
          <Text style={styles.infoText}>
            Import useToast hook in your component:
          </Text>
          <View style={styles.codeBlock}>
            <Text style={styles.codeText}>
              import useToast from '../hooks/useToast';{'\n\n'}
              const toast = useToast();{'\n\n'}
              // Show toast{'\n'}
              toast.showSuccess('Saved!', 'सहेजा गया!');
            </Text>
          </View>
          <Text style={styles.infoText}>
            {'\n'}Don't forget to wrap your app with ToastProvider in App.js!
          </Text>
        </View>

        {/* Interaction Tips */}
        <View style={[styles.infoCard, { borderLeftColor: theme.colors.warning }]}>
          <View style={styles.infoHeader}>
            <Ionicons name="hand-left" size={24} color={theme.colors.warning} />
            <Text style={[styles.infoTitle, { color: theme.colors.warning }]}>Interaction Tips</Text>
          </View>
          <Text style={styles.infoText}>
            • <Text style={styles.bold}>Swipe</Text> toasts up/down to dismiss them{'\n'}
            • <Text style={styles.bold}>Tap X</Text> button to close manually{'\n'}
            • Toasts auto-dismiss after 3 seconds (default){'\n'}
            • Multiple toasts stack automatically
          </Text>
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
    marginBottom: theme.spacing.md,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  toggleText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  toggleTextActive: {
    color: theme.colors.white,
  },
  buttonGroup: {
    gap: theme.spacing.sm,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderRadius: 12,
    gap: theme.spacing.sm,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.white,
  },
  buttonSecondary: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  buttonSecondaryText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.black,
  },
  buttonSecondarySubtext: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  buttonDanger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.error,
    borderRadius: 12,
    gap: theme.spacing.sm,
  },
  infoCard: {
    backgroundColor: theme.colors.info + '10',
    borderRadius: 12,
    padding: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.info,
    marginBottom: theme.spacing.md,
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
  },
  bold: {
    fontWeight: '700',
  },
  codeBlock: {
    backgroundColor: '#282c34',
    borderRadius: 8,
    padding: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#61dafb',
    lineHeight: 18,
  },
});
