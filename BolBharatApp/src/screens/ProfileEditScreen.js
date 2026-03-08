import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, typography } from '../theme';
import { saveUser } from '../api/database';

const STATES_OF_INDIA = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

const OCCUPATION_OPTIONS = [
  'Farmer', 'Agricultural Worker', 'Self-Employed', 'Daily Wage Worker',
  'Government Employee', 'Private Employee', 'Business Owner', 'Homemaker',
  'Student', 'Retired', 'Unemployed', 'Other'
];

const GENDER_OPTIONS = [
  { key: 'male', labelEn: 'Male', labelHi: 'पुरुष' },
  { key: 'female', labelEn: 'Female', labelHi: 'महिला' },
  { key: 'other', labelEn: 'Other', labelHi: 'अन्य' },
  { key: 'prefer_not_to_say', labelEn: 'Prefer not to say', labelHi: 'नहीं बताना चाहते' },
];

const CATEGORY_OPTIONS = [
  { key: 'general', labelEn: 'General', labelHi: 'सामान्य' },
  { key: 'obc', labelEn: 'OBC', labelHi: 'ओबीसी' },
  { key: 'sc', labelEn: 'SC', labelHi: 'अनुसूचित जाति' },
  { key: 'st', labelEn: 'ST', labelHi: 'अनुसूचित जनजाति' },
  { key: 'ews', labelEn: 'EWS', labelHi: 'आर्थिक रूप से कमजोर वर्ग' },
];

export default function ProfileEditScreen({ navigation }) {
  const [language, setLanguage] = useState('english');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Basic Information
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  // Demographics
  const [gender, setGender] = useState('');
  const [category, setCategory] = useState('');
  const [occupation, setOccupation] = useState('');

  // Location
  const [address, setAddress] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  // Family Information
  const [familyMembers, setFamilyMembers] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');

  // Selection Modals
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showOccupationModal, setShowOccupationModal] = useState(false);
  const [showStateModal, setShowStateModal] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profileData = await AsyncStorage.getItem('userProfile');
      if (profileData) {
        const profile = JSON.parse(profileData);
        setFullName(profile.fullName || '');
        setPhoneNumber(profile.phoneNumber || '');
        setEmail(profile.email || '');
        setAadharNumber(profile.aadharNumber || '');
        setDateOfBirth(profile.dateOfBirth || '');
        setGender(profile.gender || '');
        setCategory(profile.category || '');
        setOccupation(profile.occupation || '');
        setAddress(profile.address || '');
        setVillage(profile.village || '');
        setDistrict(profile.district || '');
        setState(profile.state || '');
        setPincode(profile.pincode || '');
        setFamilyMembers(profile.familyMembers || '');
        setMonthlyIncome(profile.monthlyIncome || '');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (!fullName.trim()) {
      Alert.alert(
        language === 'hindi' ? 'आवश्यक फील्ड' : 'Required Field',
        language === 'hindi' ? 'कृपया अपना पूरा नाम दर्ज करें' : 'Please enter your full name'
      );
      return false;
    }

    if (phoneNumber && !/^[6-9]\d{9}$/.test(phoneNumber)) {
      Alert.alert(
        language === 'hindi' ? 'अमान्य फोन नंबर' : 'Invalid Phone Number',
        language === 'hindi'
          ? 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें'
          : 'Please enter a valid 10-digit mobile number'
      );
      return false;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert(
        language === 'hindi' ? 'अमान्य ईमेल' : 'Invalid Email',
        language === 'hindi'
          ? 'कृपया एक वैध ईमेल पता दर्ज करें'
          : 'Please enter a valid email address'
      );
      return false;
    }

    if (aadharNumber && !/^\d{12}$/.test(aadharNumber)) {
      Alert.alert(
        language === 'hindi' ? 'अमान्य आधार' : 'Invalid Aadhar',
        language === 'hindi'
          ? 'कृपया 12 अंकों का वैध आधार नंबर दर्ज करें'
          : 'Please enter a valid 12-digit Aadhar number'
      );
      return false;
    }

    if (pincode && !/^\d{6}$/.test(pincode)) {
      Alert.alert(
        language === 'hindi' ? 'अमान्य पिनकोड' : 'Invalid Pincode',
        language === 'hindi'
          ? 'कृपया 6 अंकों का वैध पिनकोड दर्ज करें'
          : 'Please enter a valid 6-digit pincode'
      );
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const profileData = {
        fullName,
        phoneNumber,
        email,
        aadharNumber,
        dateOfBirth,
        gender,
        category,
        occupation,
        address,
        village,
        district,
        state,
        pincode,
        familyMembers,
        monthlyIncome,
        lastUpdated: new Date().toISOString(),
      };

      await AsyncStorage.setItem('userProfile', JSON.stringify(profileData));

      // Save to cloud database
      try {
        const userId = phoneNumber || fullName.replace(/\s+/g, '_').toLowerCase();
        await saveUser({ userId, ...profileData });
        console.log('Profile saved to database');
      } catch (dbErr) {
        console.warn('Failed to sync profile to cloud:', dbErr);
      }

      Alert.alert(
        language === 'hindi' ? 'सफल' : 'Success',
        language === 'hindi' ? 'प्रोफ़ाइल सफलतापूर्वक अपडेट की गई' : 'Profile updated successfully',
        [
          {
            text: language === 'hindi' ? 'ठीक है' : 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert(
        language === 'hindi' ? 'त्रुटि' : 'Error',
        language === 'hindi'
          ? 'प्रोफ़ाइल सहेजने में त्रुटि हुई'
          : 'Error saving profile. Please try again.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
      </TouchableOpacity>
      <View style={styles.headerTextContainer}>
        <Text style={styles.headerTitle}>
          {language === 'hindi' ? 'प्रोफ़ाइल संपादित करें' : 'Edit Profile'}
        </Text>
        <Text style={styles.headerSubtitle}>
          {language === 'hindi' ? 'अपनी जानकारी अपडेट करें' : 'Update your information'}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={isSaving}
        activeOpacity={0.8}
      >
        {isSaving ? (
          <MaterialCommunityIcons name="loading" size={20} color={colors.white} />
        ) : (
          <Ionicons name="checkmark" size={20} color={colors.white} />
        )}
      </TouchableOpacity>
    </View>
  );

  const renderSection = (title, titleHi, icon) => (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionIconContainer}>
        <Ionicons name={icon} size={20} color={colors.white} />
      </View>
      <Text style={styles.sectionTitle}>
        {language === 'hindi' ? titleHi : title}
      </Text>
    </View>
  );

  const renderInput = (label, labelHi, value, onChangeText, options = {}) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>
        {language === 'hindi' ? labelHi : label}
        {options.required && <Text style={styles.required}> *</Text>}
      </Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={options.placeholder || (language === 'hindi' ? labelHi : label)}
        placeholderTextColor={colors.textDisabled}
        keyboardType={options.keyboardType || 'default'}
        maxLength={options.maxLength}
        editable={!isSaving}
        autoCapitalize={options.autoCapitalize || 'words'}
      />
    </View>
  );

  const renderSelector = (label, labelHi, value, onPress, icon = 'chevron-down') => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>
        {language === 'hindi' ? labelHi : label}
      </Text>
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={onPress}
        activeOpacity={0.7}
        disabled={isSaving}
      >
        <Text style={[styles.selectorText, !value && styles.selectorPlaceholder]}>
          {value || (language === 'hindi' ? 'चुनें' : 'Select')}
        </Text>
        <Ionicons name={icon} size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );

  const renderSelectionModal = (visible, setVisible, options, onSelect, title, titleHi) => {
    if (!visible) return null;

    return (
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        />
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {language === 'hindi' ? titleHi : title}
            </Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalList}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.modalOption}
                onPress={() => {
                  onSelect(option);
                  setVisible(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.modalOptionText}>
                  {typeof option === 'string' ? option : (language === 'hindi' ? option.labelHi : option.labelEn)}
                </Text>
                <Ionicons name="chevron-forward" size={20} color={colors.textDisabled} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <MaterialCommunityIcons name="loading" size={48} color={colors.black} />
          <Text style={styles.loadingText}>
            {language === 'hindi' ? 'लोड हो रहा है...' : 'Loading...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {renderHeader()}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Picture */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={64} color={colors.white} />
              </View>
              <TouchableOpacity style={styles.avatarEditButton} activeOpacity={0.8}>
                <Ionicons name="camera" size={20} color={colors.white} />
              </TouchableOpacity>
            </View>
            <Text style={styles.avatarHint}>
              {language === 'hindi' ? 'फोटो बदलने के लिए टैप करें' : 'Tap to change photo'}
            </Text>
          </View>

          {/* Basic Information */}
          {renderSection('Basic Information', 'मूल जानकारी', 'person-outline')}
          <View style={styles.card}>
            {renderInput('Full Name', 'पूरा नाम', fullName, setFullName, {
              required: true,
              placeholder: language === 'hindi' ? 'अपना पूरा नाम दर्ज करें' : 'Enter your full name',
            })}
            {renderInput('Phone Number', 'फोन नंबर', phoneNumber, setPhoneNumber, {
              keyboardType: 'phone-pad',
              maxLength: 10,
              placeholder: '+91 98765 43210',
            })}
            {renderInput('Email Address', 'ईमेल पता', email, setEmail, {
              keyboardType: 'email-address',
              autoCapitalize: 'none',
              placeholder: 'example@email.com',
            })}
            {renderInput('Aadhar Number', 'आधार नंबर', aadharNumber, setAadharNumber, {
              keyboardType: 'number-pad',
              maxLength: 12,
              placeholder: '1234 5678 9012',
            })}
            {renderInput('Date of Birth', 'जन्म तिथि', dateOfBirth, setDateOfBirth, {
              placeholder: 'DD/MM/YYYY',
            })}
          </View>

          {/* Demographics */}
          {renderSection('Demographics', 'जनसांख्यिकी', 'people-outline')}
          <View style={styles.card}>
            {renderSelector(
              'Gender',
              'लिंग',
              gender ? GENDER_OPTIONS.find(g => g.key === gender)?.[language === 'hindi' ? 'labelHi' : 'labelEn'] : '',
              () => setShowGenderModal(true)
            )}
            {renderSelector(
              'Category',
              'श्रेणी',
              category ? CATEGORY_OPTIONS.find(c => c.key === category)?.[language === 'hindi' ? 'labelHi' : 'labelEn'] : '',
              () => setShowCategoryModal(true)
            )}
            {renderSelector(
              'Occupation',
              'व्यवसाय',
              occupation,
              () => setShowOccupationModal(true)
            )}
          </View>

          {/* Location */}
          {renderSection('Location', 'स्थान', 'location-outline')}
          <View style={styles.card}>
            {renderInput('Address', 'पता', address, setAddress, {
              placeholder: language === 'hindi' ? 'मकान नंबर, गली का नाम' : 'House No., Street Name',
            })}
            {renderInput('Village/Town', 'गाँव/शहर', village, setVillage)}
            {renderInput('District', 'जिला', district, setDistrict)}
            {renderSelector(
              'State',
              'राज्य',
              state,
              () => setShowStateModal(true)
            )}
            {renderInput('Pincode', 'पिनकोड', pincode, setPincode, {
              keyboardType: 'number-pad',
              maxLength: 6,
              placeholder: '123456',
            })}
          </View>

          {/* Family Information */}
          {renderSection('Family Information', 'परिवार की जानकारी', 'home-outline')}
          <View style={styles.card}>
            {renderInput('Family Members', 'परिवार के सदस्य', familyMembers, setFamilyMembers, {
              keyboardType: 'number-pad',
              placeholder: language === 'hindi' ? 'कुल सदस्यों की संख्या' : 'Total number of members',
            })}
            {renderInput('Monthly Income (₹)', 'मासिक आय (₹)', monthlyIncome, setMonthlyIncome, {
              keyboardType: 'number-pad',
              placeholder: language === 'hindi' ? 'रुपये में' : 'In Rupees',
            })}
          </View>

          {/* Info Note */}
          <View style={styles.noteCard}>
            <Ionicons name="information-circle" size={20} color="#2196F3" />
            <Text style={styles.noteText}>
              {language === 'hindi'
                ? 'आपकी जानकारी सुरक्षित रूप से संग्रहीत की जाती है और केवल आपके आवेदनों के लिए उपयोग की जाती है।'
                : 'Your information is stored securely and used only for your applications.'}
            </Text>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButtonLarge, isSaving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isSaving}
            activeOpacity={0.8}
          >
            {isSaving ? (
              <MaterialCommunityIcons name="loading" size={24} color={colors.white} />
            ) : (
              <Ionicons name="checkmark-circle" size={24} color={colors.white} />
            )}
            <Text style={styles.saveButtonText}>
              {isSaving
                ? (language === 'hindi' ? 'सहेजा जा रहा है...' : 'Saving...')
                : (language === 'hindi' ? 'प्रोफ़ाइल सहेजें' : 'Save Profile')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

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

      {/* Selection Modals */}
      {renderSelectionModal(
        showGenderModal,
        setShowGenderModal,
        GENDER_OPTIONS,
        (option) => setGender(option.key),
        'Select Gender',
        'लिंग चुनें'
      )}
      {renderSelectionModal(
        showCategoryModal,
        setShowCategoryModal,
        CATEGORY_OPTIONS,
        (option) => setCategory(option.key),
        'Select Category',
        'श्रेणी चुनें'
      )}
      {renderSelectionModal(
        showOccupationModal,
        setShowOccupationModal,
        OCCUPATION_OPTIONS,
        (option) => setOccupation(option),
        'Select Occupation',
        'व्यवसाय चुनें'
      )}
      {renderSelectionModal(
        showStateModal,
        setShowStateModal,
        STATES_OF_INDIA,
        (option) => setState(option),
        'Select State',
        'राज्य चुनें'
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.medium,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: colors.gray200,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.gray200,
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    marginTop: 2,
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },

  // Content
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl * 2,
  },

  // Avatar
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarEditButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  avatarHint: {
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },

  // Section
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },

  // Card
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.gray200,
    marginBottom: spacing.md,
  },

  // Input
  inputContainer: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  required: {
    color: '#F44336',
  },
  input: {
    height: 48,
    borderWidth: 2,
    borderColor: colors.gray200,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    fontSize: 15,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
    backgroundColor: colors.background,
  },

  // Selector
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    borderWidth: 2,
    borderColor: colors.gray200,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
  },
  selectorText: {
    fontSize: 15,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
  },
  selectorPlaceholder: {
    color: colors.textDisabled,
  },

  // Modal
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: colors.gray200,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },
  modalList: {
    maxHeight: 400,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  modalOptionText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
  },

  // Note Card
  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E3F2FD',
    padding: spacing.md,
    borderRadius: 12,
    marginVertical: spacing.md,
    gap: spacing.sm,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    color: '#1565C0',
    lineHeight: 18,
  },

  // Save Button Large
  saveButtonLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: spacing.lg,
    borderRadius: 12,
    marginTop: spacing.md,
    gap: spacing.sm,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonText: {
    fontSize: 17,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
  },

  // Language Toggle
  languageToggle: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.black,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    gap: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  languageToggleText: {
    fontSize: 13,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.white,
  },
});
