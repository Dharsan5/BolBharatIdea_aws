import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Modal, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { theme } from '../theme';
import { useLanguage } from '../i18n/LanguageContext';
import { saveUser, getUser, getApplications } from '../api/database';

const USER_ID = 'user123'; // Replace with real user ID later
const STATES = ['Tamil Nadu', 'Uttar Pradesh', 'Telangana', 'Maharashtra', 'Karnataka', 'Delhi'];

export default function ProfileScreen() {
  const { language, setLanguage, t } = useLanguage();
  const [offlineMode, setOfflineMode] = useState(false);
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [applications, setApplications] = useState([]);

  const [userName, setUserName] = useState('User Name');
  const [userPhone, setUserPhone] = useState('+91 98765 43210');
  const [location, setLocation] = useState('Not set');

  const languages = [
    { id: 'en', label: 'English', nativeLabel: 'English' },
    { id: 'hi', label: 'Hindi', nativeLabel: 'हिंदी' },
    { id: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
    { id: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
    { id: 'hinglish', label: 'Hinglish', nativeLabel: 'Hinglish' },
  ];

  // 🔥 Load user from DynamoDB
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const result = await getUser(USER_ID);
        if (result.success && result.user) {
          setUserName(result.user.name || 'User Name');
          setLocation(result.user.state || 'Not set');
        }

        const appsResult = await getApplications(USER_ID);
        if (appsResult.success) {
          setApplications(appsResult.applications || []);
        }
      } catch (err) {
        console.error('Load profile error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleLocationSelect = async (loc) => {
    setLocation(loc);
    setIsLocationModalVisible(false);
    await saveUser({ userId: USER_ID, name: userName, state: loc, language });
  };

  // 🔥 Save profile to DynamoDB
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await saveUser({
        userId: USER_ID,
        name: userName,
        state: location,
        language,
      });
    } catch (err) {
      console.error('Save profile error:', err);
    } finally {
      setIsSaving(false);
      setIsEditModalVisible(false);
    }
  };

  const currentLanguageLabel = languages.find(l => l.id === language)?.nativeLabel || 'English';

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('profile')}</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* User Info */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={48} color={theme.colors.white} />
          </View>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userPhone}>{userPhone}</Text>
          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditModalVisible(true)}>
            <Text style={styles.editButtonText}>{t('editProfile')}</Text>
          </TouchableOpacity>
        </View>

        {/* Applications Summary */}
        {applications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Applications ({applications.length})</Text>
            {applications.slice(0, 3).map((app) => (
              <View key={app.applicationId} style={styles.appItem}>
                <View style={styles.appInfo}>
                  <Text style={styles.appName}>{app.schemeName}</Text>
                  <Text style={styles.appDate}>{new Date(app.appliedAt).toLocaleDateString()}</Text>
                </View>
                <View style={[styles.statusBadge,
                  app.status === 'Approved' && styles.statusApproved,
                  app.status === 'Rejected' && styles.statusRejected,
                ]}>
                  <Text style={styles.statusText}>{app.status}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings')}</Text>

          <TouchableOpacity style={styles.settingItem} onPress={() => setIsLanguageModalVisible(true)}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="globe-outline" size={24} color={theme.colors.black} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>{t('language')}</Text>
              <Text style={styles.settingValue}>{currentLanguageLabel}</Text>
            </View>
            <Feather name="chevron-right" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={() => setIsLocationModalVisible(true)}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="location-outline" size={24} color={theme.colors.black} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>{t('location')}</Text>
              <Text style={styles.settingValue}>{location}</Text>
            </View>
            <Feather name="chevron-right" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="wifi-outline" size={24} color={theme.colors.black} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>{t('offlineMode')}</Text>
              <Text style={styles.settingValue}>{t('saveData')}</Text>
            </View>
            <Switch
              value={offlineMode}
              onValueChange={setOfflineMode}
              trackColor={{ false: theme.colors.gray300, true: theme.colors.gray700 }}
              thumbColor={offlineMode ? theme.colors.black : theme.colors.gray400}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.version}>{t('version')} 1.0.0</Text>
        </View>
      </ScrollView>

      {/* Language Modal */}
      <Modal visible={isLanguageModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('selectLanguage')}</Text>
              <TouchableOpacity onPress={() => setIsLanguageModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.black} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={languages}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.optionItem, language === item.id && styles.optionItemActive]}
                  onPress={() => { setLanguage(item.id); setIsLanguageModalVisible(false); }}
                >
                  <Text style={styles.optionLabel}>{item.nativeLabel}</Text>
                  {language === item.id && <Ionicons name="checkmark" size={24} color={theme.colors.primary} />}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Location Modal */}
      <Modal visible={isLocationModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('location')}</Text>
              <TouchableOpacity onPress={() => setIsLocationModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.black} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={STATES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.optionItem, location === item && styles.optionItemActive]}
                  onPress={() => handleLocationSelect(item)}
                >
                  <Text style={styles.optionLabel}>{item}</Text>
                  {location === item && <Ionicons name="checkmark" size={24} color={theme.colors.primary} />}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal visible={isEditModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.editCard}>
            <Text style={styles.modalTitle}>{t('editProfile')}</Text>
            <TextInput style={styles.input} value={userName} onChangeText={setUserName} placeholder="Full Name" />
            <TextInput style={styles.input} value={userPhone} editable={false} placeholder="Phone Number" />
            <View style={styles.editActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile} disabled={isSaving}>
                {isSaving
                  ? <ActivityIndicator size="small" color={theme.colors.white} />
                  : <Text style={styles.saveButtonText}>Save</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { ...theme.typography.body2, color: theme.colors.textSecondary, marginTop: theme.spacing.md },
  header: { padding: theme.spacing.lg, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  title: { ...theme.typography.h2, color: theme.colors.textPrimary },
  content: { flex: 1 },
  userCard: {
    alignItems: 'center', padding: theme.spacing.xl,
    backgroundColor: theme.colors.surface, margin: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl, borderWidth: 1, borderColor: theme.colors.border,
  },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: theme.colors.black, justifyContent: 'center', alignItems: 'center', marginBottom: theme.spacing.md },
  userName: { ...theme.typography.h3, color: theme.colors.textPrimary },
  userPhone: { ...theme.typography.body2, color: theme.colors.textSecondary, marginBottom: theme.spacing.md },
  editButton: { paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.sm, borderRadius: theme.borderRadius.full, borderWidth: 1, borderColor: theme.colors.border },
  editButtonText: { ...theme.typography.caption, color: theme.colors.textPrimary, fontWeight: 'bold' },
  section: { padding: theme.spacing.lg },
  sectionTitle: { ...theme.typography.h4, color: theme.colors.textPrimary, marginBottom: theme.spacing.md },
  appItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, padding: theme.spacing.md, borderRadius: theme.borderRadius.lg, marginBottom: theme.spacing.sm, borderWidth: 1, borderColor: theme.colors.border },
  appInfo: { flex: 1 },
  appName: { ...theme.typography.body2, color: theme.colors.textPrimary, fontWeight: 'bold' },
  appDate: { ...theme.typography.caption, color: theme.colors.textSecondary },
  statusBadge: { backgroundColor: '#FFC107', paddingHorizontal: theme.spacing.sm, paddingVertical: 2, borderRadius: theme.borderRadius.sm },
  statusApproved: { backgroundColor: '#4CAF50' },
  statusRejected: { backgroundColor: '#F44336' },
  statusText: { fontSize: 11, color: theme.colors.white, fontWeight: 'bold' },
  settingItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, padding: theme.spacing.lg, borderRadius: theme.borderRadius.lg, marginBottom: theme.spacing.sm, borderWidth: 1, borderColor: theme.colors.border },
  settingIconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.white, borderWidth: 1, borderColor: theme.colors.border, justifyContent: 'center', alignItems: 'center', marginRight: theme.spacing.md },
  settingInfo: { flex: 1 },
  settingLabel: { ...theme.typography.body1, color: theme.colors.textPrimary },
  settingValue: { ...theme.typography.caption, color: theme.colors.textSecondary },
  footer: { alignItems: 'center', padding: theme.spacing.xl },
  version: { ...theme.typography.caption, color: theme.colors.textSecondary },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: theme.colors.white, borderTopLeftRadius: theme.borderRadius.xl, borderTopRightRadius: theme.borderRadius.xl, padding: theme.spacing.lg, maxHeight: '60%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg },
  modalTitle: { ...theme.typography.h3 },
  optionItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing.lg, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  optionItemActive: { backgroundColor: theme.colors.surface },
  optionLabel: { ...theme.typography.body1 },
  editCard: { backgroundColor: theme.colors.white, margin: theme.spacing.xl, borderRadius: theme.borderRadius.xl, padding: theme.spacing.xl, width: '90%', alignSelf: 'center', marginBottom: '50%' },
  input: { backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg, padding: theme.spacing.md, marginTop: theme.spacing.lg, borderWidth: 1, borderColor: theme.colors.border, ...theme.typography.body1 },
  editActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: theme.spacing.xl, gap: theme.spacing.md },
  cancelButton: { padding: theme.spacing.md },
  cancelButtonText: { color: theme.colors.textSecondary },
  saveButton: { backgroundColor: theme.colors.black, paddingHorizontal: theme.spacing.xl, paddingVertical: theme.spacing.md, borderRadius: theme.borderRadius.lg, minWidth: 80, alignItems: 'center' },
  saveButtonText: { color: theme.colors.white, fontWeight: 'bold' },
});