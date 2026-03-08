import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import theme from '../theme';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';

export default function ProfileScreen({ navigation }) {
  const [offlineMode, setOfflineMode] = useState(false);
  const [showLanguageSwitcher, setShowLanguageSwitcher] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const { currentLanguage } = useLanguage();

  const loadProfile = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem('userProfile');
      if (stored) setUserProfile(JSON.parse(stored));
    } catch (e) {
      console.error('Failed to load profile', e);
    }
  }, []);

  useFocusEffect(useCallback(() => {
    loadProfile();
  }, [loadProfile]));

  const displayName = userProfile?.fullName || 'User';
  const displayPhone = userProfile?.phoneNumber || '';
  const displayLocation = userProfile?.state
    ? `${userProfile.state}${userProfile.district ? ', ' + userProfile.district : ''}`
    : 'Not set';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>प्रोफ़ाइल</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* User Info */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={48} color={theme.colors.white} />
          </View>
          <Text style={styles.userName}>{displayName}</Text>
          {!!displayPhone && <Text style={styles.userPhone}>{displayPhone}</Text>}
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setShowLanguageSwitcher(true)}
          >
            <View style={styles.settingIconContainer}>
              <Ionicons name="globe-outline" size={24} color={theme.colors.black} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Language</Text>
              <Text style={styles.settingValue}>{currentLanguage.nativeName}</Text>
            </View>
            <Feather name="chevron-right" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => navigation.navigate('LocationSettings')}
          >
            <View style={styles.settingIconContainer}>
              <Ionicons name="location-outline" size={24} color={theme.colors.black} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Location</Text>
              <Text style={styles.settingValue}>{displayLocation}</Text>
            </View>
            <Feather name="chevron-right" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => navigation.navigate('OfflineMode')}
          >
            <View style={styles.settingIconContainer}>
              <Ionicons name="cloud-offline-outline" size={24} color={theme.colors.black} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Offline Mode</Text>
              <Text style={styles.settingValueSecondary}>
                {offlineMode ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
            <Feather name="chevron-right" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => navigation.navigate('ProfileEdit')}
          >
            <View style={styles.settingIconContainer}>
              <Ionicons name="person-outline" size={24} color={theme.colors.black} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Edit Profile</Text>
            </View>
            <Feather name="chevron-right" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => navigation.navigate('DemographicsUpdate')}
          >
            <View style={styles.settingIconContainer}>
              <MaterialIcons name="family-restroom" size={24} color={theme.colors.black} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Demographics</Text>
              <Text style={styles.settingValueSecondary}>Age, category, occupation</Text>
            </View>
            <Feather name="chevron-right" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => navigation.navigate('ApplicationHistory')}
          >
            <View style={styles.settingIconContainer}>
              <Ionicons name="list-outline" size={24} color={theme.colors.black} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>My Applications</Text>
            </View>
            <Feather name="chevron-right" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => navigation.navigate('PrivacySettings')}
          >
            <View style={styles.settingIconContainer}>
              <Ionicons name="lock-closed-outline" size={24} color={theme.colors.black} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Privacy Settings</Text>
            </View>
            <Feather name="chevron-right" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Help Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help & Support</Text>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => navigation.navigate('AppTutorial')}
          >
            <View style={styles.settingIconContainer}>
              <Ionicons name="book-outline" size={24} color={theme.colors.black} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>App Tutorial</Text>
            </View>
            <Feather name="chevron-right" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="help-circle-outline" size={24} color={theme.colors.black} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>FAQs</Text>
            </View>
            <Feather name="chevron-right" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="call-outline" size={24} color={theme.colors.black} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Contact Support</Text>
            </View>
            <Feather name="chevron-right" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="information-circle-outline" size={24} color={theme.colors.black} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>About BolBharat</Text>
            </View>
            <Feather name="chevron-right" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>
      </ScrollView>

      {/* Language Switcher Modal */}
      <LanguageSwitcher
        visible={showLanguageSwitcher}
        onClose={() => setShowLanguageSwitcher(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  content: {
    flex: 1,
  },
  userCard: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    margin: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  userName: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  userPhone: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
  },
  section: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    ...theme.typography.body1,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  settingValue: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  settingValueSecondary: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  footer: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  version: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
});
