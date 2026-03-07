import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';

const { width } = Dimensions.get('window');

const TUTORIAL_SECTIONS = [
  {
    id: 'voice',
    icon: 'mic',
    iconType: 'ionicons',
    title: 'Voice Interface',
    titleHindi: 'आवाज इंटरफ़ेस',
    description: 'Ask questions and search for schemes using your voice',
    steps: [
      'Tap the microphone button on the home screen',
      'Speak your question in your preferred language',
      'Wait for the app to process your query',
      'View results and ask follow-up questions',
    ],
    tips: [
      'Speak clearly in a quiet environment',
      'You can switch languages anytime',
      'Voice works in Hindi, English, and other regional languages',
    ],
  },
  {
    id: 'schemes',
    icon: 'document-text',
    iconType: 'ionicons',
    title: 'Finding Schemes',
    titleHindi: 'योजनाएं खोजना',
    description: 'Discover government schemes you are eligible for',
    steps: [
      'Search by speaking or typing your needs',
      'Browse through matching schemes',
      'Check eligibility requirements',
      'Save schemes you are interested in',
    ],
    tips: [
      'Be specific about your situation (farmer, student, etc.)',
      'Check the eligibility section carefully',
      'Save schemes for later reference',
    ],
  },
  {
    id: 'documents',
    icon: 'camera',
    iconType: 'ionicons',
    title: 'Document Scanner',
    titleHindi: 'दस्तावेज़ स्कैनर',
    description: 'Scan and simplify complex government documents',
    steps: [
      'Go to Documents tab and tap "Scan Document"',
      'Position the document in the camera frame',
      'Tap capture when the document is clear',
      'Review and save the simplified explanation',
    ],
    tips: [
      'Use good lighting for better results',
      'Keep the document flat and in frame',
      'The app will translate to your preferred language',
    ],
  },
  {
    id: 'forms',
    icon: 'clipboard',
    iconType: 'ionicons',
    title: 'Form Filling',
    titleHindi: 'फ़ॉर्म भरना',
    description: 'Fill government forms with AI assistance',
    steps: [
      'Select a form from the Forms tab',
      'Answer questions in simple language',
      'Review the pre-filled form',
      'Submit directly or download for later',
    ],
    tips: [
      'Have your documents ready (Aadhaar, etc.)',
      'Answer questions honestly',
      'Review all information before submitting',
    ],
  },
  {
    id: 'offline',
    icon: 'cloud-offline',
    iconType: 'ionicons',
    title: 'Offline Mode',
    titleHindi: 'ऑफ़लाइन मोड',
    description: 'Use the app without internet connection',
    steps: [
      'Enable Offline Mode in Profile settings',
      'Download schemes and forms when connected',
      'Work offline - your data syncs later',
      'Changes upload automatically when online',
    ],
    tips: [
      'Enable before traveling to remote areas',
      'Clear cache periodically to save space',
      'Sync on Wi-Fi to save mobile data',
    ],
  },
  {
    id: 'profile',
    icon: 'person',
    iconType: 'ionicons',
    title: 'Profile & Settings',
    titleHindi: 'प्रोफ़ाइल और सेटिंग्स',
    description: 'Manage your information and preferences',
    steps: [
      'Complete your profile with accurate information',
      'Set your location and demographics',
      'Choose your preferred language',
      'Adjust privacy and offline settings',
    ],
    tips: [
      'Keep your profile updated for better matches',
      'Accurate demographics help find relevant schemes',
      'Review privacy settings regularly',
    ],
  },
];

const FAQ_ITEMS = [
  {
    question: 'Is BolBharat free to use?',
    questionHindi: 'क्या बोलभारत उपयोग करने के लिए मुफ़्त है?',
    answer: 'Yes, BolBharat is completely free. It is designed to help citizens access government schemes and benefits.',
  },
  {
    question: 'Which languages are supported?',
    questionHindi: 'कौन सी भाषाएं समर्थित हैं?',
    answer: 'We support Hindi, English, Tamil, Telugu, Kannada, Malayalam, Marathi, Bengali, Gujarati, and Punjabi.',
  },
  {
    question: 'Is my data safe?',
    questionHindi: 'क्या मेरा डेटा सुरक्षित है?',
    answer: 'Yes, all your data is encrypted and stored securely. We never share your personal information without your consent.',
  },
  {
    question: 'Can I use the app without internet?',
    questionHindi: 'क्या मैं बिना इंटरनेट के ऐप का उपयोग कर सकता हूं?',
    answer: 'Yes! Enable Offline Mode in settings to download content and work without internet. Data syncs when you reconnect.',
  },
  {
    question: 'How do I apply for a scheme?',
    questionHindi: 'मैं योजना के लिए कैसे आवेदन करूं?',
    answer: 'Browse schemes, check eligibility, and use our AI form-filling assistant to complete applications step by step.',
  },
];

export default function AppTutorialScreen({ navigation }) {
  const [expandedSection, setExpandedSection] = useState(null);
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const renderIcon = (iconName, iconType, isExpanded) => {
    if (iconType === 'ionicons') {
      return <Ionicons name={iconName} size={32} color={isExpanded ? colors.primary : colors.black} />;
    }
    return <MaterialCommunityIcons name={iconName} size={32} color={isExpanded ? colors.primary : colors.black} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.black} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.title}>Help & Tutorial</Text>
          <Text style={styles.subtitle}>सहायता और ट्यूटोरियल</Text>
        </View>
        <View style={styles.headerButton} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeCard}>
          <MaterialCommunityIcons name="hands-pray" size={48} color={colors.primary} />
          <Text style={styles.welcomeTitle}>Welcome to BolBharat!</Text>
          <Text style={styles.welcomeTitleHindi}>बोलभारत में आपका स्वागत है!</Text>
          <Text style={styles.welcomeText}>
            Your voice-powered assistant for accessing government schemes and services. 
            Learn how to make the most of BolBharat below.
          </Text>
        </View>

        {/* Quick Start */}
        <View style={styles.quickStartCard}>
          <View style={styles.quickStartHeader}>
            <Ionicons name="rocket" size={24} color={colors.primary} />
            <Text style={styles.quickStartTitle}>Quick Start</Text>
          </View>
          <View style={styles.quickStartSteps}>
            <View style={styles.quickStartStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.quickStartText}>Complete your profile</Text>
            </View>
            <View style={styles.quickStartStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.quickStartText}>Choose your language</Text>
            </View>
            <View style={styles.quickStartStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.quickStartText}>Start exploring schemes!</Text>
            </View>
          </View>
        </View>

        {/* Features Tutorial */}
        <Text style={styles.sectionTitle}>How to Use Features</Text>
        {TUTORIAL_SECTIONS.map((section) => {
          const isExpanded = expandedSection === section.id;
          
          return (
            <View key={section.id} style={styles.tutorialCard}>
              <TouchableOpacity
                style={styles.tutorialHeader}
                onPress={() => toggleSection(section.id)}
              >
                <View style={styles.tutorialHeaderLeft}>
                  <View style={[styles.iconContainer, isExpanded && styles.iconContainerActive]}>
                    {renderIcon(section.icon, section.iconType, isExpanded)}
                  </View>
                  <View style={styles.tutorialHeaderText}>
                    <Text style={[styles.tutorialTitle, isExpanded && styles.tutorialTitleActive]}>
                      {section.title}
                    </Text>
                    <Text style={styles.tutorialTitleHindi}>{section.titleHindi}</Text>
                  </View>
                </View>
                <Ionicons 
                  name={isExpanded ? "chevron-up" : "chevron-down"} 
                  size={24} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.tutorialContent}>
                  <Text style={styles.tutorialDescription}>{section.description}</Text>
                  
                  <Text style={styles.subsectionTitle}>Steps:</Text>
                  {section.steps.map((step, index) => (
                    <View key={index} style={styles.stepItem}>
                      <View style={styles.stepDot} />
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  ))}

                  <Text style={styles.subsectionTitle}>Tips:</Text>
                  {section.tips.map((tip, index) => (
                    <View key={index} style={styles.tipItem}>
                      <Ionicons name="bulb" size={16} color={colors.warning} />
                      <Text style={styles.tipText}>{tip}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}

        {/* FAQ Section */}
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        {FAQ_ITEMS.map((faq, index) => {
          const isExpanded = expandedFAQ === index;
          
          return (
            <View key={index} style={styles.faqCard}>
              <TouchableOpacity
                style={styles.faqHeader}
                onPress={() => toggleFAQ(index)}
              >
                <View style={styles.faqHeaderText}>
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  <Text style={styles.faqQuestionHindi}>{faq.questionHindi}</Text>
                </View>
                <Ionicons 
                  name={isExpanded ? "chevron-up" : "chevron-down"} 
                  size={24} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.faqContent}>
                  <Text style={styles.faqAnswer}>{faq.answer}</Text>
                </View>
              )}
            </View>
          );
        })}

        {/* Contact Support */}
        <View style={styles.supportCard}>
          <MaterialCommunityIcons name="lifebuoy" size={32} color={colors.primary} />
          <Text style={styles.supportTitle}>Need More Help?</Text>
          <Text style={styles.supportText}>
            Contact our support team anytime. We're here to help!
          </Text>
          <TouchableOpacity style={styles.supportButton}>
            <Ionicons name="mail" size={20} color={colors.white} />
            <Text style={styles.supportButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  headerButton: {
    padding: spacing.xs,
    minWidth: 60,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    ...typography.h3,
    color: colors.black,
    fontWeight: '600',
  },
  subtitle: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  welcomeCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: spacing.md,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  welcomeTitle: {
    ...typography.h2,
    color: colors.black,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  welcomeTitleHindi: {
    ...typography.h3,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  welcomeText: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  quickStartCard: {
    backgroundColor: colors.white,
    borderRadius: spacing.sm,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickStartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  quickStartTitle: {
    ...typography.h3,
    color: colors.black,
    fontWeight: '600',
  },
  quickStartSteps: {
    gap: spacing.sm,
  },
  quickStartStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    ...typography.body,
    color: colors.white,
    fontWeight: '700',
  },
  quickStartText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.black,
    fontWeight: '600',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  tutorialCard: {
    backgroundColor: colors.white,
    borderRadius: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  tutorialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  tutorialHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: spacing.sm,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerActive: {
    backgroundColor: colors.primaryLight,
  },
  tutorialHeaderText: {
    flex: 1,
  },
  tutorialTitle: {
    ...typography.body,
    color: colors.black,
    fontWeight: '600',
  },
  tutorialTitleActive: {
    color: colors.primary,
  },
  tutorialTitleHindi: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  tutorialContent: {
    padding: spacing.md,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tutorialDescription: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  subsectionTitle: {
    ...typography.body,
    color: colors.black,
    fontWeight: '600',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
    paddingLeft: spacing.xs,
  },
  stepDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 7,
    marginRight: spacing.xs,
  },
  stepText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
    lineHeight: 20,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
    backgroundColor: colors.warningLight,
    padding: spacing.xs,
    borderRadius: 4,
    gap: spacing.xs,
  },
  tipText: {
    ...typography.small,
    color: colors.text,
    flex: 1,
    lineHeight: 18,
  },
  faqCard: {
    backgroundColor: colors.white,
    borderRadius: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  faqHeaderText: {
    flex: 1,
    marginRight: spacing.sm,
  },
  faqQuestion: {
    ...typography.body,
    color: colors.black,
    fontWeight: '500',
  },
  faqQuestionHindi: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  faqContent: {
    padding: spacing.md,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  faqAnswer: {
    ...typography.body,
    color: colors.text,
    lineHeight: 20,
  },
  supportCard: {
    backgroundColor: colors.successLight,
    borderRadius: spacing.sm,
    padding: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.success,
  },
  supportTitle: {
    ...typography.h3,
    color: colors.black,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  supportText: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: spacing.sm,
    gap: spacing.xs,
  },
  supportButtonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: '600',
  },
});
