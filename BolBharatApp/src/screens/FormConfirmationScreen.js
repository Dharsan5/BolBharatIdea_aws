import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { saveApplication } from '../api/database';
import { colors, spacing, typography } from '../theme';

export default function FormConfirmationScreen({ route, navigation }) {
  const { formId, formName, formNameHindi, answers } = route.params || {};
  const [language, setLanguage] = useState('english');
  const [scaleAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));
  const hasSaved = useRef(false);

  const userProfile = useSelector(state => state.user?.profile);
  const userId = userProfile?.id || userProfile?.userId || userProfile?.phone || userProfile?.phoneNumber;

  // Generate reference number once and keep it stable
  const referenceNumber = useRef(`BOLB${Date.now().toString().slice(-8)}`).current;
  const submissionDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const submissionDateHindi = new Date().toLocaleDateString('hi-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  useEffect(() => {
    persistApplication();
    // Success animation
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const persistApplication = async () => {
    if (hasSaved.current) return;
    hasSaved.current = true;

    const applicationData = {
      id: referenceNumber,
      referenceNumber,
      formId: formId || 'unknown',
      formName: formName || 'Application',
      formNameHindi: formNameHindi || 'आवेदन',
      schemeName: formName || 'Application',
      status: 'submitted',
      submittedDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      department: 'Government of India',
      departmentHindi: 'भारत सरकार',
    };

    // Save to AsyncStorage for offline access
    try {
      const stored = await AsyncStorage.getItem('submittedApplications');
      const existing = stored ? JSON.parse(stored) : [];
      const alreadyExists = existing.some(a => a.referenceNumber === referenceNumber);
      if (!alreadyExists) {
        await AsyncStorage.setItem(
          'submittedApplications',
          JSON.stringify([applicationData, ...existing])
        );
      }
    } catch (err) {
      console.error('AsyncStorage save error:', err);
    }

    // Save to backend
    if (userId) {
      try {
        await saveApplication(userId, applicationData);
      } catch (err) {
        console.error('Backend save error:', err);
      }
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${language === 'hindi' ? 'आवेदन संदर्भ संख्या' : 'Application Reference Number'}: ${referenceNumber}\n${language === 'hindi' ? 'फॉर्म' : 'Form'}: ${language === 'hindi' ? formNameHindi : formName}\n${language === 'hindi' ? 'जमा दिनांक' : 'Submitted on'}: ${language === 'hindi' ? submissionDateHindi : submissionDate}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleTrackApplication = () => {
    // Navigate to application tracking screen
    navigation.navigate('ApplicationTracking', { referenceNumber });
  };

  const handleGoHome = () => {
    navigation.navigate('FormSelection');
  };

  const handleFillAnother = () => {
    navigation.navigate('FormSelection');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon */}
        <Animated.View
          style={[
            styles.successIconContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.successIconCircle}>
            <Ionicons name="checkmark" size={80} color={colors.white} />
          </View>
          <View style={styles.celebrationIcon1}>
            <MaterialCommunityIcons name="party-popper" size={32} color="#FF9933" />
          </View>
          <View style={styles.celebrationIcon2}>
            <MaterialCommunityIcons name="party-popper" size={32} color="#138808" />
          </View>
        </Animated.View>

        {/* Success Message */}
        <Animated.View style={[styles.messageContainer, { opacity: fadeAnim }]}>
          <Text style={styles.successTitle}>
            {language === 'hindi' ? 'सफलतापूर्वक जमा किया गया!' : 'Successfully Submitted!'}
          </Text>
          <Text style={styles.successSubtitle}>
            {language === 'hindi'
              ? 'आपका फॉर्म सफलतापूर्वक जमा कर दिया गया है'
              : 'Your form has been submitted successfully'}
          </Text>
        </Animated.View>

        {/* Reference Card */}
        <Animated.View style={[styles.referenceCard, { opacity: fadeAnim }]}>
          <View style={styles.referenceHeader}>
            <MaterialCommunityIcons name="file-document-check" size={24} color={colors.textPrimary} />
            <Text style={styles.referenceHeaderText}>
              {language === 'hindi' ? 'संदर्भ संख्या' : 'Reference Number'}
            </Text>
          </View>
          <View style={styles.referenceNumberContainer}>
            <Text style={styles.referenceNumber}>{referenceNumber}</Text>
            <TouchableOpacity onPress={handleShare} style={styles.copyButton}>
              <Ionicons name="share-outline" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.referenceNote}>
            {language === 'hindi'
              ? 'इस नंबर को भविष्य के संदर्भ के लिए सुरक्षित रखें'
              : 'Save this number for future reference'}
          </Text>
        </Animated.View>

        {/* Form Details */}
        <Animated.View style={[styles.detailsCard, { opacity: fadeAnim }]}>
          <View style={styles.detailRow}>
            <Ionicons name="document-text" size={20} color={colors.textSecondary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>
                {language === 'hindi' ? 'फॉर्म का नाम' : 'Form Name'}
              </Text>
              <Text style={styles.detailValue}>
                {language === 'hindi' ? formNameHindi : formName}
              </Text>
            </View>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={20} color={colors.textSecondary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>
                {language === 'hindi' ? 'जमा दिनांक' : 'Submitted On'}
              </Text>
              <Text style={styles.detailValue}>
                {language === 'hindi' ? submissionDateHindi : submissionDate}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* What's Next Section */}
        <Animated.View style={[styles.nextStepsCard, { opacity: fadeAnim }]}>
          <Text style={styles.nextStepsTitle}>
            {language === 'hindi' ? 'आगे क्या होगा?' : "What's Next?"}
          </Text>
          
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>
                {language === 'hindi' ? 'प्रसंस्करण' : 'Processing'}
              </Text>
              <Text style={styles.stepDescription}>
                {language === 'hindi'
                  ? 'आपका आवेदन अगले 5-7 कार्य दिवसों में संसाधित किया जाएगा'
                  : 'Your application will be processed within 5-7 working days'}
              </Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>
                {language === 'hindi' ? 'सत्यापन' : 'Verification'}
              </Text>
              <Text style={styles.stepDescription}>
                {language === 'hindi'
                  ? 'संबंधित विभाग आपके दस्तावेजों का सत्यापन करेगा'
                  : 'The concerned department will verify your documents'}
              </Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>
                {language === 'hindi' ? 'अनुमोदन' : 'Approval'}
              </Text>
              <Text style={styles.stepDescription}>
                {language === 'hindi'
                  ? 'स्वीकृति के बाद आपको SMS और ईमेल द्वारा सूचित किया जाएगा'
                  : 'You will be notified via SMS and email after approval'}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Important Note */}
        <Animated.View style={[styles.noteCard, { opacity: fadeAnim }]}>
          <Ionicons name="information-circle" size={20} color="#FF9800" />
          <Text style={styles.noteText}>
            {language === 'hindi'
              ? 'कृपया अपने फोन नंबर और ईमेल की नियमित जांच करें। यदि अतिरिक्त दस्तावेजों की आवश्यकता हो तो हम आपसे संपर्क करेंगे।'
              : 'Please check your phone and email regularly. We will contact you if additional documents are required.'}
          </Text>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View style={[styles.actionsContainer, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleTrackApplication}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="map-marker-path" size={24} color={colors.white} />
            <Text style={styles.primaryButtonText}>
              {language === 'hindi' ? 'आवेदन ट्रैक करें' : 'Track Application'}
            </Text>
          </TouchableOpacity>

          <View style={styles.secondaryButtonsRow}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleGoHome}
              activeOpacity={0.7}
            >
              <Ionicons name="home-outline" size={20} color={colors.textPrimary} />
              <Text style={styles.secondaryButtonText}>
                {language === 'hindi' ? 'होम' : 'Home'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleFillAnother}
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle-outline" size={20} color={colors.textPrimary} />
              <Text style={styles.secondaryButtonText}>
                {language === 'hindi' ? 'अन्य फॉर्म' : 'Fill Another'}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Language Toggle */}
      <TouchableOpacity
        style={styles.languageToggle}
        onPress={() => setLanguage(language === 'english' ? 'hindi' : 'english')}
      >
        <Ionicons name="language" size={20} color={colors.white} />
        <Text style={styles.languageToggleText}>
          {language === 'english' ? 'हिंदी' : 'English'}
        </Text>
      </TouchableOpacity>
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
  },
  scrollContent: {
    padding: spacing.lg,
  },

  // Success Icon
  successIconContainer: {
    alignItems: 'center',
    marginTop: spacing.xxl,
    marginBottom: spacing.lg,
  },
  successIconCircle: {
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
  celebrationIcon1: {
    position: 'absolute',
    top: 20,
    left: '20%',
    transform: [{ rotate: '-15deg' }],
  },
  celebrationIcon2: {
    position: 'absolute',
    top: 20,
    right: '20%',
    transform: [{ rotate: '15deg' }],
  },

  // Success Message
  messageContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  successTitle: {
    fontSize: 28,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  successSubtitle: {
    fontSize: 16,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },

  // Reference Card
  referenceCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  referenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  referenceHeaderText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textSecondary,
  },
  referenceNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.gray50,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  referenceNumber: {
    fontSize: 22,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    letterSpacing: 2,
  },
  copyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  referenceNote: {
    fontSize: 12,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // Details Card
  detailsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.gray200,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    marginBottom: spacing.xs / 2,
  },
  detailValue: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
  },
  detailDivider: {
    height: 1,
    backgroundColor: colors.gray200,
    marginVertical: spacing.md,
  },

  // Next Steps
  nextStepsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.gray200,
  },
  nextStepsTitle: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  stepNumberText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.xs / 2,
  },
  stepDescription: {
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  // Note Card
  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF3E0',
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
    color: '#E65100',
    lineHeight: 18,
  },

  // Action Buttons
  actionsContainer: {
    marginBottom: spacing.lg,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.black,
    paddingVertical: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  primaryButtonText: {
    fontSize: 17,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
  },
  secondaryButtonsRow: {
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

  // Bottom Spacer
  bottomSpacer: {
    height: spacing.xl,
  },
});
