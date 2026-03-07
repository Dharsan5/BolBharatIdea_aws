import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';

const CACHE_DURATION_OPTIONS = [
  { id: '1_day', name: '1 Day', value: 1 },
  { id: '7_days', name: '7 Days', value: 7 },
  { id: '30_days', name: '30 Days', value: 30 },
  { id: '90_days', name: '90 Days', value: 90 },
];

const SYNC_FREQUENCY_OPTIONS = [
  { id: 'manual', name: 'Manual Only', nativeName: 'केवल मैन्युअल' },
  { id: 'wifi_only', name: 'Wi-Fi Only', nativeName: 'केवल वाई-फाई' },
  { id: 'always', name: 'Always (Wi-Fi + Mobile)', nativeName: 'हमेशा' },
];

export default function OfflineModeScreen({ navigation }) {
  // TODO: Load from AsyncStorage or global state
  const [offlineModeEnabled, setOfflineModeEnabled] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [syncFrequency, setSyncFrequency] = useState('wifi_only');
  const [showSyncPicker, setShowSyncPicker] = useState(false);
  
  // Cache settings
  const [cacheDuration, setCacheDuration] = useState('30_days');
  const [showCachePicker, setShowCachePicker] = useState(false);
  const [cacheSchemes, setCacheSchemes] = useState(true);
  const [cacheDocuments, setCacheDocuments] = useState(true);
  const [cacheVoiceRecordings, setCacheVoiceRecordings] = useState(false);
  const [cacheForms, setCacheForms] = useState(true);
  
  // Data usage (mock data - TODO: get real values)
  const [storageUsed, setStorageUsed] = useState('45.3 MB');
  const [cachedItems, setCachedItems] = useState({
    schemes: 23,
    documents: 12,
    forms: 8,
    recordings: 5,
  });

  const handleToggleOfflineMode = (value) => {
    setOfflineModeEnabled(value);
    // TODO: Save to AsyncStorage
    // TODO: Trigger initial data sync if enabled
    if (value) {
      Alert.alert(
        'Offline Mode Enabled',
        'Data will be downloaded for offline access. This may use your mobile data if Wi-Fi is not available.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleSyncNow = () => {
    Alert.alert(
      'Sync Data',
      'This will download the latest schemes and forms. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sync',
          onPress: () => {
            // TODO: Implement sync logic
            Alert.alert('Success', 'Data synced successfully');
          },
        },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Offline Cache',
      'This will remove all downloaded content. You can re-download it later.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement cache clearing
            Alert.alert('Success', 'Cache cleared successfully');
          },
        },
      ]
    );
  };

  const renderPickerOption = (option, selectedValue, onSelect, showNative = false) => {
    const isSelected = selectedValue === option.id;
    
    return (
      <Pressable
        key={option.id}
        style={({ pressed }) => [
          styles.pickerOption,
          isSelected && styles.pickerOptionSelected,
          pressed && styles.pickerOptionPressed,
        ]}
        onPress={() => {
          onSelect(option.id);
          setShowSyncPicker(false);
          setShowCachePicker(false);
        }}
      >
        <View style={styles.pickerOptionContent}>
          <Text style={[styles.pickerOptionText, isSelected && styles.pickerOptionTextSelected]}>
            {option.name}
          </Text>
          {showNative && option.nativeName && (
            <Text style={[styles.pickerOptionNative, isSelected && styles.pickerOptionNativeSelected]}>
              {option.nativeName}
            </Text>
          )}
        </View>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
        )}
      </Pressable>
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
          <Text style={styles.title}>Offline Mode</Text>
          <Text style={styles.subtitle}>ऑफ़लाइन मोड</Text>
        </View>
        <View style={styles.headerButton} />
      </View>

      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <MaterialCommunityIcons name="cloud-download" size={20} color={colors.primary} />
        <Text style={styles.infoBannerText}>
          Work without internet by downloading content for offline access
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Offline Mode Toggle */}
        <View style={styles.mainToggleCard}>
          <View style={styles.mainToggleContent}>
            <View style={styles.mainToggleIcon}>
              <Ionicons 
                name={offlineModeEnabled ? "cloud-offline" : "cloud-outline"} 
                size={32} 
                color={offlineModeEnabled ? colors.primary : colors.textSecondary} 
              />
            </View>
            <View style={styles.mainToggleInfo}>
              <Text style={styles.mainToggleTitle}>Enable Offline Mode</Text>
              <Text style={styles.mainToggleSubtext}>
                {offlineModeEnabled 
                  ? 'Content available offline' 
                  : 'Download content for offline access'}
              </Text>
            </View>
            <Switch
              value={offlineModeEnabled}
              onValueChange={handleToggleOfflineMode}
              trackColor={{ false: colors.gray300, true: colors.primary }}
              thumbColor={colors.white}
              style={styles.mainSwitch}
            />
          </View>
        </View>

        {/* Storage Usage */}
        <View style={styles.storageCard}>
          <View style={styles.storageHeader}>
            <MaterialCommunityIcons name="database" size={24} color={colors.primary} />
            <Text style={styles.storageTitle}>Storage Used</Text>
          </View>
          <Text style={styles.storageAmount}>{storageUsed}</Text>
          <View style={styles.storageBreakdown}>
            <View style={styles.storageItem}>
              <MaterialCommunityIcons name="file-document" size={16} color={colors.textSecondary} />
              <Text style={styles.storageItemText}>{cachedItems.schemes} Schemes</Text>
            </View>
            <View style={styles.storageItem}>
              <MaterialCommunityIcons name="file-image" size={16} color={colors.textSecondary} />
              <Text style={styles.storageItemText}>{cachedItems.documents} Documents</Text>
            </View>
            <View style={styles.storageItem}>
              <MaterialCommunityIcons name="form-select" size={16} color={colors.textSecondary} />
              <Text style={styles.storageItemText}>{cachedItems.forms} Forms</Text>
            </View>
            <View style={styles.storageItem}>
              <MaterialCommunityIcons name="microphone" size={16} color={colors.textSecondary} />
              <Text style={styles.storageItemText}>{cachedItems.recordings} Recordings</Text>
            </View>
          </View>
        </View>

        {/* Sync Settings */}
        <Text style={styles.sectionTitle}>Sync Settings</Text>

        <View style={styles.settingCard}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Auto-Sync</Text>
              <Text style={styles.settingSubtext}>
                Automatically sync when connection is available
              </Text>
            </View>
            <Switch
              value={autoSync}
              onValueChange={setAutoSync}
              disabled={!offlineModeEnabled}
              trackColor={{ false: colors.gray300, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Sync Frequency</Text>
              <Text style={styles.settingSubtext}>
                {SYNC_FREQUENCY_OPTIONS.find(o => o.id === syncFrequency)?.name}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.expandButton}
              onPress={() => setShowSyncPicker(!showSyncPicker)}
              disabled={!offlineModeEnabled || !autoSync}
            >
              <Ionicons 
                name={showSyncPicker ? "chevron-up" : "chevron-down"} 
                size={24} 
                color={colors.textSecondary} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {showSyncPicker && (
          <View style={styles.pickerContainer}>
            {SYNC_FREQUENCY_OPTIONS.map(option => renderPickerOption(option, syncFrequency, setSyncFrequency, true))}
          </View>
        )}

        {/* Cache Settings */}
        <Text style={styles.sectionTitle}>Cache Settings</Text>

        <View style={styles.settingCard}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Cache Duration</Text>
              <Text style={styles.settingSubtext}>
                Keep offline data for {CACHE_DURATION_OPTIONS.find(o => o.id === cacheDuration)?.name}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.expandButton}
              onPress={() => setShowCachePicker(!showCachePicker)}
              disabled={!offlineModeEnabled}
            >
              <Ionicons 
                name={showCachePicker ? "chevron-up" : "chevron-down"} 
                size={24} 
                color={colors.textSecondary} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {showCachePicker && (
          <View style={styles.pickerContainer}>
            {CACHE_DURATION_OPTIONS.map(option => renderPickerOption(option, cacheDuration, setCacheDuration))}
          </View>
        )}

        {/* What to Cache */}
        <Text style={styles.sectionTitle}>What to Cache</Text>

        <View style={styles.settingCard}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfoWithIcon}>
              <MaterialCommunityIcons name="file-document-outline" size={20} color={colors.primary} />
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Scheme Information</Text>
                <Text style={styles.settingSubtext}>Save scheme details offline</Text>
              </View>
            </View>
            <Switch
              value={cacheSchemes}
              onValueChange={setCacheSchemes}
              disabled={!offlineModeEnabled}
              trackColor={{ false: colors.gray300, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfoWithIcon}>
              <MaterialCommunityIcons name="file-image-outline" size={20} color={colors.primary} />
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Scanned Documents</Text>
                <Text style={styles.settingSubtext}>Keep document scans offline</Text>
              </View>
            </View>
            <Switch
              value={cacheDocuments}
              onValueChange={setCacheDocuments}
              disabled={!offlineModeEnabled}
              trackColor={{ false: colors.gray300, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfoWithIcon}>
              <MaterialCommunityIcons name="form-select" size={20} color={colors.primary} />
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Application Forms</Text>
                <Text style={styles.settingSubtext}>Download forms for offline use</Text>
              </View>
            </View>
            <Switch
              value={cacheForms}
              onValueChange={setCacheForms}
              disabled={!offlineModeEnabled}
              trackColor={{ false: colors.gray300, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfoWithIcon}>
              <MaterialCommunityIcons name="microphone-outline" size={20} color={colors.primary} />
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Voice Recordings</Text>
                <Text style={styles.settingSubtext}>Cache audio for later upload</Text>
              </View>
            </View>
            <Switch
              value={cacheVoiceRecordings}
              onValueChange={setCacheVoiceRecordings}
              disabled={!offlineModeEnabled}
              trackColor={{ false: colors.gray300, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* Actions */}
        <Text style={styles.sectionTitle}>Actions</Text>

        <View style={styles.settingCard}>
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={handleSyncNow}
            disabled={!offlineModeEnabled}
          >
            <View style={styles.actionIconContainer}>
              <MaterialCommunityIcons name="sync" size={24} color={colors.primary} />
            </View>
            <View style={styles.actionInfo}>
              <Text style={[styles.actionLabel, !offlineModeEnabled && styles.disabledText]}>
                Sync Now
              </Text>
              <Text style={styles.actionSubtext}>
                Download latest content
              </Text>
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={24} 
              color={offlineModeEnabled ? colors.textSecondary : colors.gray300} 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionItem}
            onPress={handleClearCache}
            disabled={!offlineModeEnabled}
          >
            <View style={styles.actionIconContainer}>
              <MaterialCommunityIcons name="delete-sweep" size={24} color={colors.warning} />
            </View>
            <View style={styles.actionInfo}>
              <Text style={[styles.actionLabel, !offlineModeEnabled && styles.disabledText]}>
                Clear Cache
              </Text>
              <Text style={styles.actionSubtext}>
                Free up storage space
              </Text>
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={24} 
              color={offlineModeEnabled ? colors.textSecondary : colors.gray300} 
            />
          </TouchableOpacity>
        </View>

        {/* Help Text */}
        <View style={styles.helpBox}>
          <MaterialCommunityIcons name="information" size={20} color={colors.primary} />
          <Text style={styles.helpText}>
            Offline mode allows you to browse schemes, fill forms, and scan documents without internet. Data will sync automatically when you're back online.
          </Text>
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
  mainToggleCard: {
    backgroundColor: colors.white,
    borderRadius: spacing.md,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary,
    marginBottom: spacing.md,
  },
  mainToggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainToggleIcon: {
    marginRight: spacing.sm,
  },
  mainToggleInfo: {
    flex: 1,
  },
  mainToggleTitle: {
    ...typography.h3,
    color: colors.black,
    fontWeight: '600',
  },
  mainToggleSubtext: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  mainSwitch: {
    transform: [{ scale: 1.1 }],
  },
  storageCard: {
    backgroundColor: colors.white,
    borderRadius: spacing.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  storageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  storageTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
  },
  storageAmount: {
    ...typography.h2,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  storageBreakdown: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  storageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
    borderRadius: 4,
  },
  storageItemText: {
    ...typography.small,
    color: colors.textSecondary,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.black,
    fontWeight: '600',
    marginTop: spacing.md,
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
  expandButton: {
    padding: spacing.xs,
  },
  pickerContainer: {
    backgroundColor: colors.white,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pickerOptionSelected: {
    backgroundColor: colors.primaryLight,
  },
  pickerOptionPressed: {
    backgroundColor: colors.gray100,
  },
  pickerOptionContent: {
    flex: 1,
  },
  pickerOptionText: {
    ...typography.body,
    color: colors.text,
  },
  pickerOptionTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  pickerOptionNative: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  pickerOptionNativeSelected: {
    color: colors.primary,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
  disabledText: {
    color: colors.gray300,
  },
  helpBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.sm,
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  helpText: {
    ...typography.small,
    color: colors.text,
    flex: 1,
    lineHeight: 18,
  },
});
