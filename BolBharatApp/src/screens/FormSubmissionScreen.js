import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';

const SUBMISSION_STATES = {
  SUBMITTING: 'submitting',
  SUCCESS: 'success',
  ERROR: 'error',
};

export default function FormSubmissionScreen({ route, navigation }) {
  const { formId, formName, formNameHindi, answers } = route.params || {};
  const [submissionState, setSubmissionState] = useState(SUBMISSION_STATES.SUBMITTING);
  const [language, setLanguage] = useState('english');
  const [progress, setProgress] = useState(0);
  
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    // Simulate form submission process
    simulateSubmission();
  }, []);

  const simulateSubmission = async () => {
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 300);

      // Simulate API call delay (3 seconds)
      await new Promise((resolve) => setTimeout(resolve, 3000));
      
      clearInterval(progressInterval);
      setProgress(100);

      // 90% success rate simulation
      const isSuccess = Math.random() > 0.1;

      if (isSuccess) {
        setSubmissionState(SUBMISSION_STATES.SUCCESS);
        
        // Animate success icon
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }).start();

        // Navigate to confirmation after short delay
        setTimeout(() => {
          navigation.replace('FormConfirmation', {
            formId,
            formName,
            formNameHindi,
            answers,
          });
        }, 1500);
      } else {
        setSubmissionState(SUBMISSION_STATES.ERROR);
        
        // Animate error icon
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 100,
            friction: 5,
            useNativeDriver: true,
          }),
        ]).start();
      }
    } catch (error) {
      setSubmissionState(SUBMISSION_STATES.ERROR);
      setProgress(0);
    }
  };

  const handleRetry = () => {
    setSubmissionState(SUBMISSION_STATES.SUBMITTING);
    setProgress(0);
    scaleAnim.setValue(0);
    simulateSubmission();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleContactSupport = () => {
    // TODO: Navigate to support or open email/phone
    alert(language === 'hindi' ? 'सहायता से संपर्क करें' : 'Contact Support');
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const renderSubmitting = () => (
    <>
      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [{ rotate: spin }],
          },
        ]}
      >
        <MaterialCommunityIcons name="cloud-upload" size={80} color={colors.black} />
      </Animated.View>

      <Text style={styles.title}>
        {language === 'hindi' ? 'फॉर्म जमा किया जा रहा है...' : 'Submitting Form...'}
      </Text>
      <Text style={styles.subtitle}>
        {language === 'hindi'
          ? 'कृपया प्रतीक्षा करें, हम आपका आवेदन संसाधित कर रहे हैं'
          : 'Please wait, we are processing your application'}
      </Text>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: `${progress}%`,
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>{progress}%</Text>
      </View>

      {/* Progress Steps */}
      <View style={styles.stepsContainer}>
        <View style={[styles.step, progress >= 30 && styles.stepActive]}>
          <Ionicons
            name={progress >= 30 ? 'checkmark-circle' : 'ellipse-outline'}
            size={20}
            color={progress >= 30 ? '#4CAF50' : colors.textDisabled}
          />
          <Text style={[styles.stepText, progress >= 30 && styles.stepTextActive]}>
            {language === 'hindi' ? 'सत्यापन' : 'Validating'}
          </Text>
        </View>
        <View style={[styles.step, progress >= 60 && styles.stepActive]}>
          <Ionicons
            name={progress >= 60 ? 'checkmark-circle' : 'ellipse-outline'}
            size={20}
            color={progress >= 60 ? '#4CAF50' : colors.textDisabled}
          />
          <Text style={[styles.stepText, progress >= 60 && styles.stepTextActive]}>
            {language === 'hindi' ? 'अपलोडिंग' : 'Uploading'}
          </Text>
        </View>
        <View style={[styles.step, progress >= 90 && styles.stepActive]}>
          <Ionicons
            name={progress >= 90 ? 'checkmark-circle' : 'ellipse-outline'}
            size={20}
            color={progress >= 90 ? '#4CAF50' : colors.textDisabled}
          />
          <Text style={[styles.stepText, progress >= 90 && styles.stepTextActive]}>
            {language === 'hindi' ? 'पूर्ण' : 'Finalizing'}
          </Text>
        </View>
      </View>

      <Text style={styles.note}>
        {language === 'hindi'
          ? 'यह प्रक्रिया कुछ सेकंड ले सकती है'
          : 'This process may take a few seconds'}
      </Text>
    </>
  );

  const renderSuccess = () => (
    <>
      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.successIcon}>
          <Ionicons name="checkmark" size={80} color={colors.white} />
        </View>
      </Animated.View>

      <Text style={styles.title}>
        {language === 'hindi' ? 'सफलतापूर्वक जमा किया गया!' : 'Successfully Submitted!'}
      </Text>
      <Text style={styles.subtitle}>
        {language === 'hindi'
          ? 'आपका आवेदन सफलतापूर्वक प्राप्त हो गया है'
          : 'Your application has been received successfully'}
      </Text>

      <View style={styles.successNote}>
        <MaterialCommunityIcons name="information" size={20} color="#4CAF50" />
        <Text style={styles.successNoteText}>
          {language === 'hindi'
            ? 'आपको अगली स्क्रीन पर भेजा जा रहा है...'
            : 'Redirecting you to the next screen...'}
        </Text>
      </View>
    </>
  );

  const renderError = () => (
    <>
      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.errorIcon}>
          <Ionicons name="close" size={80} color={colors.white} />
        </View>
      </Animated.View>

      <Text style={styles.title}>
        {language === 'hindi' ? 'सबमिशन विफल' : 'Submission Failed'}
      </Text>
      <Text style={styles.subtitle}>
        {language === 'hindi'
          ? 'आपका फॉर्म जमा नहीं किया जा सका। कृपया पुनः प्रयास करें।'
          : 'We could not submit your form. Please try again.'}
      </Text>

      {/* Error Reasons */}
      <View style={styles.errorReasonsCard}>
        <Text style={styles.errorReasonsTitle}>
          {language === 'hindi' ? 'संभावित कारण:' : 'Possible reasons:'}
        </Text>
        <View style={styles.errorReason}>
          <Ionicons name="wifi-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.errorReasonText}>
            {language === 'hindi' ? 'इंटरनेट कनेक्शन की समस्या' : 'Internet connection issue'}
          </Text>
        </View>
        <View style={styles.errorReason}>
          <Ionicons name="server-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.errorReasonText}>
            {language === 'hindi' ? 'सर्वर अस्थायी रूप से अनुपलब्ध' : 'Server temporarily unavailable'}
          </Text>
        </View>
        <View style={styles.errorReason}>
          <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.errorReasonText}>
            {language === 'hindi' ? 'अनुरोध टाइम आउट' : 'Request timeout'}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.errorActions}>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={handleRetry}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="refresh" size={24} color={colors.white} />
          <Text style={styles.retryButtonText}>
            {language === 'hindi' ? 'पुनः प्रयास करें' : 'Retry Submission'}
          </Text>
        </TouchableOpacity>

        <View style={styles.secondaryActionsRow}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleContactSupport}
            activeOpacity={0.7}
          >
            <Ionicons name="help-circle-outline" size={20} color={colors.textPrimary} />
            <Text style={styles.secondaryButtonText}>
              {language === 'hindi' ? 'सहायता' : 'Support'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleCancel}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back-outline" size={20} color={colors.textPrimary} />
            <Text style={styles.secondaryButtonText}>
              {language === 'hindi' ? 'वापस जाएं' : 'Go Back'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        {submissionState === SUBMISSION_STATES.SUBMITTING && renderSubmitting()}
        {submissionState === SUBMISSION_STATES.SUCCESS && renderSuccess()}
        {submissionState === SUBMISSION_STATES.ERROR && renderError()}
      </View>

      {/* Language Toggle */}
      {submissionState !== SUBMISSION_STATES.SUBMITTING && (
        <TouchableOpacity
          style={styles.languageToggle}
          onPress={() => setLanguage(language === 'english' ? 'hindi' : 'english')}
        >
          <Ionicons name="language" size={20} color={colors.white} />
          <Text style={styles.languageToggleText}>
            {language === 'english' ? 'हिंदी' : 'English'}
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },

  // Icon
  iconContainer: {
    marginBottom: spacing.xl,
  },
  successIcon: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  errorIcon: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F44336',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  // Text
  title: {
    fontSize: 24,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  note: {
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    color: colors.textDisabled,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: spacing.lg,
  },

  // Progress
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: colors.gray200,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.black,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textSecondary,
  },

  // Steps
  stepsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  step: {
    flex: 1,
    alignItems: 'center',
    opacity: 0.5,
  },
  stepActive: {
    opacity: 1,
  },
  stepText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    color: colors.textDisabled,
    marginTop: spacing.xs,
  },
  stepTextActive: {
    color: colors.textPrimary,
  },

  // Success Note
  successNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: spacing.md,
    borderRadius: 12,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  successNoteText: {
    flex: 1,
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
    color: '#2E7D32',
  },

  // Error
  errorReasonsCard: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    marginTop: spacing.lg,
    borderWidth: 2,
    borderColor: colors.gray200,
  },
  errorReasonsTitle: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  errorReason: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  errorReasonText: {
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },

  // Error Actions
  errorActions: {
    width: '100%',
    marginTop: spacing.xl,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.black,
    paddingVertical: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  retryButtonText: {
    fontSize: 17,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.gray200,
    gap: spacing.xs,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
  },

  // Language Toggle
  languageToggle: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.black,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    gap: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  languageToggleText: {
    fontSize: 13,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.white,
  },
});
