import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';

export default function PrivacySettingsScreen({ navigation }) {
  // TODO: Load from AsyncStorage or global state
  // Data Privacy
  const [shareDataWithGovt, setShareDataWithGovt] = useState(true);
  const [dataRetention, setDataRetention] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  
  // Communication
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [schemeAlerts, setSchemeAlerts] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  
  // Security
  const [biometricLock, setBiometricLock] = useState(false);
  const [autoLogout, setAutoLogout] = useState(false);
  
  // Permissions
  const [voiceRecording, setVoiceRecording] = useState(true);
  const [cameraAccess, setCameraAccess] = useState(true);
  const [locationAccess, setLocationAccess] = useState(true);

  const handleDownloadData = () => {
    Alert.alert(
      'Download Your Data',
      'We will prepare a copy of your data and send it to your registered email address within 48 hours.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Request Download', 
          onPress: () => {
            // TODO: Implement data download request
            Alert.alert('Success', 'Your data download request has been submitted.');
          }
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action is permanent and cannot be undone. All your data, saved schemes, and application history will be deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete Account', 
          style: 'destructive',
          onPress: () => {
            // TODO: Implement account deletion
            Alert.alert('Confirmation Required', 'Please contact support to complete account deletion.');
          }
        },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear App Data',
      'This will clear all cached documents, voice recordings, and offline data. Your account and saved schemes will remain.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear Data', 
          style: 'destructive',
          onPress: () => {
            // TODO: Implement data clearing
            Alert.alert('Success', 'App data has been cleared.');
          }
        },
      ]
    );
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
          <Text style={styles.title}>Privacy Settings</Text>
          <Text style={styles.subtitle}>गोपनीयता सेटिंग्स</Text>
        </View>
        <View style={styles.headerButton} />
      </View>

      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
        <Text style={styles.infoBannerText}>
          Your privacy and data security are our top priorities
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Data Privacy Section */}
        <Text style={styles.sectionTitle}>Data Privacy</Text>

        <View style={styles.settingCard}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Share Data with Government</Text>
              <Text style={styles.settingSubtext}>
                Allow sharing your profile with government portals for scheme applications
              </Text>
            </View>
            <Switch
              value={shareDataWithGovt}
              onValueChange={setShareDataWithGovt}
              trackColor={{ false: colors.gray300, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Data Retention</Text>
              <Text style={styles.settingSubtext}>
                Keep your application history and documents for future reference
              </Text>
            </View>
            <Switch
              value={dataRetention}
              onValueChange={setDataRetention}
              trackColor={{ false: colors.gray300, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Usage Analytics</Text>
              <Text style={styles.settingSubtext}>
                Help improve the app by sharing anonymous usage data
              </Text>
            </View>
            <Switch
              value={analyticsEnabled}
              onValueChange={setAnalyticsEnabled}
              trackColor={{ false: colors.gray300, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* App Permissions Section */}
        <Text style={styles.sectionTitle}>App Permissions</Text>

        <View style={styles.settingCard}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfoWithIcon}>
              <Ionicons name="mic" size={20} color={colors.primary} />
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Voice Recording</Text>
                <Text style={styles.settingSubtext}>
                  Required for voice-based interactions
                </Text>
              </View>
            </View>
            <Switch
              value={voiceRecording}
              onValueChange={setVoiceRecording}
              trackColor={{ false: colors.gray300, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfoWithIcon}>
              <Ionicons name="camera" size={20} color={colors.primary} />
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Camera Access</Text>
                <Text style={styles.settingSubtext}>
                  Required for document scanning
                </Text>
              </View>
            </View>
            <Switch
              value={cameraAccess}
              onValueChange={setCameraAccess}
              trackColor={{ false: colors.gray300, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfoWithIcon}>
              <Ionicons name="location" size={20} color={colors.primary} />
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Location Access</Text>
                <Text style={styles.settingSubtext}>
                  Required for finding local schemes
                </Text>
              </View>
            </View>
            <Switch
              value={locationAccess}
              onValueChange={setLocationAccess}
              trackColor={{ false: colors.gray300, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* Communication Preferences */}
        <Text style={styles.sectionTitle}>Communication Preferences</Text>

        <View style={styles.settingCard}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Text style={styles.settingSubtext}>
                Receive app notifications
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.gray300, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Scheme Alerts</Text>
              <Text style={styles.settingSubtext}>
                Get notified about new relevant schemes
              </Text>
            </View>
            <Switch
              value={schemeAlerts}
              onValueChange={setSchemeAlerts}
              trackColor={{ false: colors.gray300, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Marketing Communications</Text>
              <Text style={styles.settingSubtext}>
                Receive updates and promotional content
              </Text>
            </View>
            <Switch
              value={marketingEmails}
              onValueChange={setMarketingEmails}
              trackColor={{ false: colors.gray300, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* Security Section */}
        <Text style={styles.sectionTitle}>Security</Text>

        <View style={styles.settingCard}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfoWithIcon}>
              <Ionicons name="finger-print" size={20} color={colors.primary} />
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Biometric Lock</Text>
                <Text style={styles.settingSubtext}>
                  Use fingerprint/face ID to secure app
                </Text>
              </View>
            </View>
            <Switch
              value={biometricLock}
              onValueChange={setBiometricLock}
              trackColor={{ false: colors.gray300, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Auto Logout</Text>
              <Text style={styles.settingSubtext}>
                Automatically logout after 30 minutes of inactivity
              </Text>
            </View>
            <Switch
              value={autoLogout}
              onValueChange={setAutoLogout}
              trackColor={{ false: colors.gray300, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* Data Management Section */}
        <Text style={styles.sectionTitle}>Data Management</Text>

        <View style={styles.settingCard}>
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={handleDownloadData}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="download-outline" size={24} color={colors.primary} />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionLabel}>Download Your Data</Text>
              <Text style={styles.actionSubtext}>
                Get a copy of all your data
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionItem}
            onPress={handleClearData}
          >
            <View style={styles.actionIconContainer}>
              <MaterialCommunityIcons name="broom" size={24} color={colors.warning} />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionLabel}>Clear App Data</Text>
              <Text style={styles.actionSubtext}>
                Clear cached documents and recordings
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionItem, styles.actionItemDanger]}
            onPress={handleDeleteAccount}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="trash-outline" size={24} color={colors.error} />
            </View>
            <View style={styles.actionInfo}>
              <Text style={[styles.actionLabel, styles.dangerText]}>Delete Account</Text>
              <Text style={styles.actionSubtext}>
                Permanently delete your account
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Privacy Policy Link */}
        <View style={styles.footerSection}>
          <TouchableOpacity style={styles.linkButton}>
            <Ionicons name="document-text-outline" size={20} color={colors.primary} />
            <Text style={styles.linkText}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkButton}>
            <Ionicons name="shield-outline" size={20} color={colors.primary} />
            <Text style={styles.linkText}>Terms of Service</Text>
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
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: spacing.sm,
    gap: spacing.xs,
  },
  infoBannerText: {
    ...typography.small,
    color: colors.text,
    flex: 1,
    lineHeight: 18,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.black,
    fontWeight: '600',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  settingCard: {
    backgroundColor: colors.white,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  settingInfoWithIcon: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  settingLabel: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
  },
  settingSubtext: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actionItemDanger: {
    borderBottomWidth: 0,
  },
  actionIconContainer: {
    marginRight: spacing.sm,
  },
  actionInfo: {
    flex: 1,
  },
  actionLabel: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
  },
  actionSubtext: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  dangerText: {
    color: colors.error,
  },
  footerSection: {
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  linkText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '500',
  },
});
