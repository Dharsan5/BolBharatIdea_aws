import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../theme';

/**
 * HelpSupportScreen
 * 
 * Provides help and support options for users including:
 * - Contact methods (call, email, WhatsApp, chat)
 * - FAQ links
 * - Help topics and guides
 * - Support hours
 * - App version information
 * 
 * Fully bilingual (English/Hindi)
 */

export default function HelpSupportScreen({ navigation }) {
  const [supportHoursExpanded, setSupportHoursExpanded] = useState(false);

  // Contact methods
  const handleCall = () => {
    const phoneNumber = '1800-123-4567'; // Toll-free number
    Alert.alert(
      'Call Support',
      `Do you want to call ${phoneNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => Linking.openURL(`tel:${phoneNumber}`),
        },
      ]
    );
  };

  const handleEmail = () => {
    const email = 'support@bolbharat.gov.in';
    const subject = 'Support Request - BolBharat App';
    const body = 'Please describe your issue:\n\n';
    Linking.openURL(`mailto:${email}?subject=${subject}&body=${body}`);
  };

  const handleWhatsApp = () => {
    const phoneNumber = '919876543210'; // WhatsApp number (without +)
    const message = 'Hi, I need help with BolBharat app';
    Linking.openURL(`whatsapp://send?phone=${phoneNumber}&text=${message}`);
  };

  const handleChat = () => {
    // Navigate to chat screen or open chat functionality
    Alert.alert(
      'Live Chat',
      'Live chat is currently unavailable. Please try other contact methods.',
      [{ text: 'OK' }]
    );
  };

  const handleFAQs = () => {
    navigation.navigate('FAQs');
  };

  const handleTutorial = () => {
    navigation.navigate('AppTutorial');
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
          <Text style={styles.headerTitle}>Help & Support</Text>
          <Text style={styles.headerSubtitle}>सहायता और समर्थन</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Quick Contact Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="call" size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Contact Us</Text>
          </View>
          <Text style={styles.sectionSubtitle}>हमसे संपर्क करें</Text>

          <View style={styles.contactGrid}>
            {/* Phone */}
            <TouchableOpacity style={styles.contactCard} onPress={handleCall}>
              <View style={[styles.contactIconContainer, { backgroundColor: theme.colors.success + '20' }]}>
                <Ionicons name="call" size={28} color={theme.colors.success} />
              </View>
              <Text style={styles.contactLabel}>Call</Text>
              <Text style={styles.contactLabelHindi}>कॉल करें</Text>
            </TouchableOpacity>

            {/* Email */}
            <TouchableOpacity style={styles.contactCard} onPress={handleEmail}>
              <View style={[styles.contactIconContainer, { backgroundColor: theme.colors.info + '20' }]}>
                <Ionicons name="mail" size={28} color={theme.colors.info} />
              </View>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactLabelHindi}>ईमेल</Text>
            </TouchableOpacity>

            {/* WhatsApp */}
            <TouchableOpacity style={styles.contactCard} onPress={handleWhatsApp}>
              <View style={[styles.contactIconContainer, { backgroundColor: '#25D366' + '20' }]}>
                <MaterialCommunityIcons name="whatsapp" size={28} color="#25D366" />
              </View>
              <Text style={styles.contactLabel}>WhatsApp</Text>
              <Text style={styles.contactLabelHindi}>व्हाट्सएप</Text>
            </TouchableOpacity>

            {/* Chat */}
            <TouchableOpacity style={styles.contactCard} onPress={handleChat}>
              <View style={[styles.contactIconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                <Ionicons name="chatbubbles" size={28} color={theme.colors.primary} />
              </View>
              <Text style={styles.contactLabel}>Chat</Text>
              <Text style={styles.contactLabelHindi}>चैट</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.contactInfo}>
            <View style={styles.contactInfoRow}>
              <Ionicons name="call-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.contactInfoText}>Toll-Free: 1800-123-4567</Text>
            </View>
            <View style={styles.contactInfoRow}>
              <Ionicons name="mail-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.contactInfoText}>support@bolbharat.gov.in</Text>
            </View>
          </View>
        </View>

        {/* Support Hours */}
        <TouchableOpacity
          style={styles.section}
          onPress={() => setSupportHoursExpanded(!supportHoursExpanded)}
          activeOpacity={0.7}
        >
          <View style={styles.sectionHeader}>
            <Ionicons name="time" size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Support Hours</Text>
            <Ionicons
              name={supportHoursExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color={theme.colors.textSecondary}
              style={styles.expandIcon}
            />
          </View>
          <Text style={styles.sectionSubtitle}>सहायता समय</Text>

          {supportHoursExpanded && (
            <View style={styles.hoursContainer}>
              <View style={styles.hoursRow}>
                <Text style={styles.hoursDay}>Monday - Friday</Text>
                <Text style={styles.hoursTime}>9:00 AM - 6:00 PM</Text>
              </View>
              <View style={styles.hoursRow}>
                <Text style={styles.hoursDayHindi}>सोमवार - शुक्रवार</Text>
                <Text style={styles.hoursTimeHindi}>सुबह 9:00 - शाम 6:00</Text>
              </View>

              <View style={[styles.hoursRow, { marginTop: theme.spacing.sm }]}>
                <Text style={styles.hoursDay}>Saturday</Text>
                <Text style={styles.hoursTime}>10:00 AM - 4:00 PM</Text>
              </View>
              <View style={styles.hoursRow}>
                <Text style={styles.hoursDayHindi}>शनिवार</Text>
                <Text style={styles.hoursTimeHindi}>सुबह 10:00 - शाम 4:00</Text>
              </View>

              <View style={[styles.hoursRow, { marginTop: theme.spacing.sm }]}>
                <Text style={styles.hoursDay}>Sunday & Holidays</Text>
                <Text style={[styles.hoursTime, { color: theme.colors.error }]}>Closed</Text>
              </View>
              <View style={styles.hoursRow}>
                <Text style={styles.hoursDayHindi}>रविवार और छुट्टियां</Text>
                <Text style={[styles.hoursTimeHindi, { color: theme.colors.error }]}>बंद</Text>
              </View>
            </View>
          )}
        </TouchableOpacity>

        {/* Help Topics */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="help-circle" size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Help Topics</Text>
          </View>
          <Text style={styles.sectionSubtitle}>सहायता विषय</Text>

          <TouchableOpacity style={styles.topicItem} onPress={handleFAQs}>
            <View style={styles.topicIconContainer}>
              <Ionicons name="document-text" size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.topicTextContainer}>
              <Text style={styles.topicTitle}>Frequently Asked Questions</Text>
              <Text style={styles.topicTitleHindi}>अक्सर पूछे जाने वाले प्रश्न</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.topicItem} onPress={handleTutorial}>
            <View style={styles.topicIconContainer}>
              <Ionicons name="play-circle" size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.topicTextContainer}>
              <Text style={styles.topicTitle}>App Tutorial</Text>
              <Text style={styles.topicTitleHindi}>ऐप ट्यूटोरियल</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.topicItem}
            onPress={() => navigation.navigate('SchemesScreen')}
          >
            <View style={styles.topicIconContainer}>
              <Ionicons name="briefcase" size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.topicTextContainer}>
              <Text style={styles.topicTitle}>How to Find Schemes</Text>
              <Text style={styles.topicTitleHindi}>योजनाएं कैसे खोजें</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.topicItem}
            onPress={() => navigation.navigate('FormsScreen')}
          >
            <View style={styles.topicIconContainer}>
              <Ionicons name="document" size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.topicTextContainer}>
              <Text style={styles.topicTitle}>How to Fill Forms</Text>
              <Text style={styles.topicTitleHindi}>फॉर्म कैसे भरें</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.topicItem}
            onPress={() => navigation.navigate('DocumentsScreen')}
          >
            <View style={styles.topicIconContainer}>
              <Ionicons name="camera" size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.topicTextContainer}>
              <Text style={styles.topicTitle}>Document Scanner Guide</Text>
              <Text style={styles.topicTitleHindi}>दस्तावेज़ स्कैनर गाइड</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.topicItem}
            onPress={() => navigation.navigate('ProfileScreen')}
          >
            <View style={styles.topicIconContainer}>
              <Ionicons name="person" size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.topicTextContainer}>
              <Text style={styles.topicTitle}>Profile & Settings Help</Text>
              <Text style={styles.topicTitleHindi}>प्रोफ़ाइल और सेटिंग्स सहायता</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Feedback */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="chatbox-ellipses" size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Feedback</Text>
          </View>
          <Text style={styles.sectionSubtitle}>प्रतिक्रिया</Text>

          <TouchableOpacity
            style={styles.feedbackButton}
            onPress={() => {
              Alert.alert(
                'Send Feedback',
                'This will open a feedback form.',
                [{ text: 'OK' }]
              );
            }}
          >
            <Ionicons name="star" size={20} color={theme.colors.warning} />
            <View style={styles.feedbackTextContainer}>
              <Text style={styles.feedbackText}>Rate Our App</Text>
              <Text style={styles.feedbackTextHindi}>हमारे ऐप को रेट करें</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.feedbackButton}
            onPress={() => {
              Alert.alert(
                'Report Issue',
                'This will open a bug report form.',
                [{ text: 'OK' }]
              );
            }}
          >
            <Ionicons name="bug" size={20} color={theme.colors.error} />
            <View style={styles.feedbackTextContainer}>
              <Text style={styles.feedbackText}>Report a Problem</Text>
              <Text style={styles.feedbackTextHindi}>समस्या की रिपोर्ट करें</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.feedbackButton}
            onPress={() => {
              Alert.alert(
                'Suggest Feature',
                'This will open a feature request form.',
                [{ text: 'OK' }]
              );
            }}
          >
            <Ionicons name="bulb" size={20} color={theme.colors.info} />
            <View style={styles.feedbackTextContainer}>
              <Text style={styles.feedbackText}>Suggest a Feature</Text>
              <Text style={styles.feedbackTextHindi}>सुविधा सुझाएं</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>App Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ऐप संस्करण</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={[styles.infoRow, { marginTop: theme.spacing.sm }]}>
            <Text style={styles.infoLabel}>Last Updated</Text>
            <Text style={styles.infoValue}>March 2026</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>अंतिम अपडेट</Text>
            <Text style={styles.infoValue}>मार्च 2026</Text>
          </View>
        </View>

        {/* Legal Links */}
        <View style={styles.legalContainer}>
          <TouchableOpacity onPress={() => Alert.alert('Privacy Policy', 'This will open Privacy Policy')}>
            <Text style={styles.legalLink}>Privacy Policy • गोपनीयता नीति</Text>
          </TouchableOpacity>
          <Text style={styles.legalSeparator}>|</Text>
          <TouchableOpacity onPress={() => Alert.alert('Terms', 'This will open Terms of Service')}>
            <Text style={styles.legalLink}>Terms of Service • सेवा की शर्तें</Text>
          </TouchableOpacity>
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
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.black,
    flex: 1,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginTop: 2,
    marginBottom: theme.spacing.md,
  },
  expandIcon: {
    marginLeft: 'auto',
  },
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  contactCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  contactIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  contactLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.black,
    marginTop: theme.spacing.xs,
  },
  contactLabelHindi: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  contactInfo: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: theme.spacing.xs,
  },
  contactInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  contactInfoText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  hoursContainer: {
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  hoursDay: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.black,
  },
  hoursTime: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.success,
  },
  hoursDayHindi: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  hoursTimeHindi: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    marginBottom: theme.spacing.xs,
  },
  topicIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  topicTextContainer: {
    flex: 1,
  },
  topicTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.black,
  },
  topicTitleHindi: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    marginBottom: theme.spacing.xs,
    gap: theme.spacing.sm,
  },
  feedbackTextContainer: {
    flex: 1,
  },
  feedbackText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.black,
  },
  feedbackTextHindi: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.elevation.small,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.black,
  },
  legalContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.lg,
  },
  legalLink: {
    fontSize: 13,
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
  legalSeparator: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
});
