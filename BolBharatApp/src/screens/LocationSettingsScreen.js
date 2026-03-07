import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';

// Major Indian states
const STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Puducherry',
];

export default function LocationSettingsScreen({ navigation }) {
  // TODO: Load saved location from AsyncStorage or global state
  const [selectedState, setSelectedState] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [showStatePicker, setShowStatePicker] = useState(false);

  const handleSave = () => {
    if (!selectedState) {
      Alert.alert('Required', 'Please select your state');
      return;
    }

    // TODO: Save to AsyncStorage or global state management
    // TODO: Update user profile in backend
    navigation.goBack();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleDetectLocation = () => {
    // TODO: Implement location detection using expo-location
    Alert.alert(
      'Detect Location',
      'This feature will use your device location to automatically fill location details.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Allow', onPress: () => console.log('Location detection requested') },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={handleCancel}
        >
          <Ionicons name="arrow-back" size={24} color={colors.black} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.title}>Location Settings</Text>
          <Text style={styles.subtitle}>स्थान सेटिंग्स</Text>
        </View>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Description */}
      <View style={styles.descriptionContainer}>
        <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
        <Text style={styles.description}>
          Your location helps us find relevant government schemes and services available in your area
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Auto Detect Location */}
        <TouchableOpacity 
          style={styles.detectButton}
          onPress={handleDetectLocation}
        >
          <Ionicons name="locate" size={24} color={colors.primary} />
          <View style={styles.detectButtonText}>
            <Text style={styles.detectButtonTitle}>Detect My Location</Text>
            <Text style={styles.detectButtonSubtitle}>Use GPS to auto-fill</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR ENTER MANUALLY</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* State Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            State / राज्य <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={[styles.pickerButton, selectedState && styles.pickerButtonFilled]}
            onPress={() => setShowStatePicker(!showStatePicker)}
          >
            <Text style={[styles.pickerButtonText, !selectedState && styles.placeholderText]}>
              {selectedState || 'Select your state'}
            </Text>
            <Ionicons 
              name={showStatePicker ? "chevron-up" : "chevron-down"} 
              size={24} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>

        {/* State Picker Dropdown */}
        {showStatePicker && (
          <View style={styles.stateList}>
            <ScrollView 
              style={styles.stateListScroll}
              nestedScrollEnabled={true}
            >
              {STATES.map((state) => (
                <Pressable
                  key={state}
                  style={({ pressed }) => [
                    styles.stateItem,
                    selectedState === state && styles.stateItemSelected,
                    pressed && styles.stateItemPressed,
                  ]}
                  onPress={() => {
                    setSelectedState(state);
                    setShowStatePicker(false);
                  }}
                >
                  <Text style={[
                    styles.stateItemText,
                    selectedState === state && styles.stateItemTextSelected,
                  ]}>
                    {state}
                  </Text>
                  {selectedState === state && (
                    <Ionicons name="checkmark" size={20} color={colors.primary} />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {/* District Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>District / जिला</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your district"
            placeholderTextColor={colors.textSecondary}
            value={district}
            onChangeText={setDistrict}
          />
        </View>

        {/* City/Village Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>City / Village / शहर / गाँव</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your city or village"
            placeholderTextColor={colors.textSecondary}
            value={city}
            onChangeText={setCity}
          />
        </View>

        {/* Pincode Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Pincode / पिन कोड</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter 6-digit pincode"
            placeholderTextColor={colors.textSecondary}
            value={pincode}
            onChangeText={setPincode}
            keyboardType="number-pad"
            maxLength={6}
          />
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
          <Text style={styles.infoText}>
            Your location data is used only to match relevant schemes and is kept private and secure
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
  saveButton: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'right',
  },
  descriptionContainer: {
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
  description: {
    ...typography.small,
    color: colors.text,
    flex: 1,
    lineHeight: 18,
  },
  scrollView: {
    flex: 1,
    marginTop: spacing.md,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  detectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: spacing.sm,
    borderWidth: 2,
    borderColor: colors.primary,
    gap: spacing.sm,
  },
  detectButtonText: {
    flex: 1,
  },
  detectButtonTitle: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  detectButtonSubtitle: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
    gap: spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.small,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  required: {
    color: colors.error,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pickerButtonFilled: {
    borderColor: colors.primary,
  },
  pickerButtonText: {
    ...typography.body,
    color: colors.text,
  },
  placeholderText: {
    color: colors.textSecondary,
  },
  textInput: {
    ...typography.body,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
  },
  stateList: {
    backgroundColor: colors.white,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    maxHeight: 300,
    overflow: 'hidden',
  },
  stateListScroll: {
    maxHeight: 300,
  },
  stateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  stateItemSelected: {
    backgroundColor: colors.primaryLight,
  },
  stateItemPressed: {
    backgroundColor: colors.gray100,
  },
  stateItemText: {
    ...typography.body,
    color: colors.text,
  },
  stateItemTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.successLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.sm,
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  infoText: {
    ...typography.small,
    color: colors.text,
    flex: 1,
    lineHeight: 18,
  },
});
