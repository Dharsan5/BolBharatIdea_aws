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
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';

const GENDER_OPTIONS = [
  { id: 'male', name: 'Male', nativeName: 'पुरुष' },
  { id: 'female', name: 'Female', nativeName: 'महिला' },
  { id: 'other', name: 'Other', nativeName: 'अन्य' },
];

const MARITAL_STATUS_OPTIONS = [
  { id: 'single', name: 'Single', nativeName: 'अविवाहित' },
  { id: 'married', name: 'Married', nativeName: 'विवाहित' },
  { id: 'widowed', name: 'Widowed', nativeName: 'विधवा/विधुर' },
  { id: 'divorced', name: 'Divorced', nativeName: 'तलाकशुदा' },
];

const CATEGORY_OPTIONS = [
  { id: 'general', name: 'General', nativeName: 'सामान्य' },
  { id: 'obc', name: 'OBC (Other Backward Class)', nativeName: 'ओबीसी' },
  { id: 'sc', name: 'SC (Scheduled Caste)', nativeName: 'अनुसूचित जाति' },
  { id: 'st', name: 'ST (Scheduled Tribe)', nativeName: 'अनुसूचित जनजाति' },
  { id: 'ews', name: 'EWS (Economically Weaker Section)', nativeName: 'ईडब्ल्यूएस' },
];

const OCCUPATION_OPTIONS = [
  'Farmer / किसान',
  'Agricultural Worker / कृषि मजदूर',
  'Daily Wage Worker / दिहाड़ी मजदूर',
  'Self-Employed / स्वरोजगार',
  'Small Business Owner / छोटा व्यवसायी',
  'Government Employee / सरकारी कर्मचारी',
  'Private Sector Employee / निजी क्षेत्र कर्मचारी',
  'Homemaker / गृहिणी',
  'Student / छात्र',
  'Retired / सेवानिवृत्त',
  'Unemployed / बेरोजगार',
  'Other / अन्य',
];

const EDUCATION_OPTIONS = [
  { id: 'no_formal', name: 'No Formal Education', nativeName: 'कोई औपचारिक शिक्षा नहीं' },
  { id: 'primary', name: 'Primary (1-5)', nativeName: 'प्राथमिक' },
  { id: 'middle', name: 'Middle School (6-8)', nativeName: 'मध्य विद्यालय' },
  { id: 'secondary', name: 'Secondary (9-10)', nativeName: 'माध्यमिक' },
  { id: 'senior_secondary', name: 'Senior Secondary (11-12)', nativeName: 'उच्च माध्यमिक' },
  { id: 'graduate', name: 'Graduate', nativeName: 'स्नातक' },
  { id: 'postgraduate', name: 'Post Graduate', nativeName: 'स्नातकोत्तर' },
  { id: 'diploma', name: 'Diploma / ITI', nativeName: 'डिप्लोमा / आईटीआई' },
];

const INCOME_RANGE_OPTIONS = [
  { id: 'below_1', name: 'Below ₹1 Lakh/year', nativeName: '₹1 लाख/वर्ष से कम' },
  { id: '1_to_2.5', name: '₹1 - 2.5 Lakhs/year', nativeName: '₹1 - 2.5 लाख/वर्ष' },
  { id: '2.5_to_5', name: '₹2.5 - 5 Lakhs/year', nativeName: '₹2.5 - 5 लाख/वर्ष' },
  { id: '5_to_10', name: '₹5 - 10 Lakhs/year', nativeName: '₹5 - 10 लाख/वर्ष' },
  { id: 'above_10', name: 'Above ₹10 Lakhs/year', nativeName: '₹10 लाख/वर्ष से अधिक' },
];

export default function DemographicsUpdateScreen({ navigation }) {
  // TODO: Load from AsyncStorage or global state
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [category, setCategory] = useState('');
  const [occupation, setOccupation] = useState('');
  const [education, setEducation] = useState('');
  const [incomeRange, setIncomeRange] = useState('');
  const [familySize, setFamilySize] = useState('');
  const [dependents, setDependents] = useState('');
  
  // Special categories
  const [hasBPLCard, setHasBPLCard] = useState(false);
  const [hasDisability, setHasDisability] = useState(false);
  const [isMinority, setIsMinority] = useState(false);
  
  // Pickers visibility
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showMaritalPicker, setShowMaritalPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showOccupationPicker, setShowOccupationPicker] = useState(false);
  const [showEducationPicker, setShowEducationPicker] = useState(false);
  const [showIncomePicker, setShowIncomePicker] = useState(false);

  const handleSave = () => {
    // Validation
    if (!age || !gender || !category || !occupation) {
      Alert.alert('Required Fields', 'Please fill in all required fields');
      return;
    }

    // TODO: Save to AsyncStorage or global state management
    // TODO: Update user profile in backend
    Alert.alert('Success', 'Demographics updated successfully', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  const renderPickerOption = (option, selectedValue, onSelect, showNative = true) => {
    const isSelected = selectedValue === option.id || selectedValue === option.name || selectedValue === option;
    
    return (
      <Pressable
        key={option.id || option}
        style={({ pressed }) => [
          styles.pickerOption,
          isSelected && styles.pickerOptionSelected,
          pressed && styles.pickerOptionPressed,
        ]}
        onPress={() => {
          onSelect(option.id || option);
          // Close all pickers
          setShowGenderPicker(false);
          setShowMaritalPicker(false);
          setShowCategoryPicker(false);
          setShowOccupationPicker(false);
          setShowEducationPicker(false);
          setShowIncomePicker(false);
        }}
      >
        <View style={styles.pickerOptionContent}>
          <Text style={[styles.pickerOptionText, isSelected && styles.pickerOptionTextSelected]}>
            {option.name || option}
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
          <Text style={styles.title}>Demographics</Text>
          <Text style={styles.subtitle}>जनसांख्यिकी</Text>
        </View>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
        <Text style={styles.infoBannerText}>
          This information helps us find schemes you're eligible for. All data is kept secure.
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Personal Information Section */}
        <Text style={styles.sectionTitle}>Personal Information</Text>

        {/* Age */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Age / आयु <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your age"
            placeholderTextColor={colors.textSecondary}
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
            maxLength={3}
          />
        </View>

        {/* Gender */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Gender / लिंग <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={[styles.pickerButton, gender && styles.pickerButtonFilled]}
            onPress={() => setShowGenderPicker(!showGenderPicker)}
          >
            <Text style={[styles.pickerButtonText, !gender && styles.placeholderText]}>
              {gender ? GENDER_OPTIONS.find(g => g.id === gender)?.name : 'Select gender'}
            </Text>
            <Ionicons 
              name={showGenderPicker ? "chevron-up" : "chevron-down"} 
              size={24} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>

        {showGenderPicker && (
          <View style={styles.pickerContainer}>
            {GENDER_OPTIONS.map(option => renderPickerOption(option, gender, setGender))}
          </View>
        )}

        {/* Marital Status */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Marital Status / वैवाहिक स्थिति</Text>
          <TouchableOpacity
            style={[styles.pickerButton, maritalStatus && styles.pickerButtonFilled]}
            onPress={() => setShowMaritalPicker(!showMaritalPicker)}
          >
            <Text style={[styles.pickerButtonText, !maritalStatus && styles.placeholderText]}>
              {maritalStatus ? MARITAL_STATUS_OPTIONS.find(m => m.id === maritalStatus)?.name : 'Select status'}
            </Text>
            <Ionicons 
              name={showMaritalPicker ? "chevron-up" : "chevron-down"} 
              size={24} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>

        {showMaritalPicker && (
          <View style={styles.pickerContainer}>
            {MARITAL_STATUS_OPTIONS.map(option => renderPickerOption(option, maritalStatus, setMaritalStatus))}
          </View>
        )}

        {/* Socio-Economic Information */}
        <Text style={styles.sectionTitle}>Socio-Economic Information</Text>

        {/* Category */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Category / श्रेणी <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={[styles.pickerButton, category && styles.pickerButtonFilled]}
            onPress={() => setShowCategoryPicker(!showCategoryPicker)}
          >
            <Text style={[styles.pickerButtonText, !category && styles.placeholderText]}>
              {category ? CATEGORY_OPTIONS.find(c => c.id === category)?.name : 'Select category'}
            </Text>
            <Ionicons 
              name={showCategoryPicker ? "chevron-up" : "chevron-down"} 
              size={24} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>

        {showCategoryPicker && (
          <View style={styles.pickerContainer}>
            {CATEGORY_OPTIONS.map(option => renderPickerOption(option, category, setCategory))}
          </View>
        )}

        {/* Occupation */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Occupation / व्यवसाय <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={[styles.pickerButton, occupation && styles.pickerButtonFilled]}
            onPress={() => setShowOccupationPicker(!showOccupationPicker)}
          >
            <Text style={[styles.pickerButtonText, !occupation && styles.placeholderText]}>
              {occupation || 'Select occupation'}
            </Text>
            <Ionicons 
              name={showOccupationPicker ? "chevron-up" : "chevron-down"} 
              size={24} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>

        {showOccupationPicker && (
          <View style={styles.pickerContainer}>
            <ScrollView style={styles.pickerScroll} nestedScrollEnabled>
              {OCCUPATION_OPTIONS.map(option => renderPickerOption(option, occupation, setOccupation, false))}
            </ScrollView>
          </View>
        )}

        {/* Education */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Education Level / शिक्षा स्तर</Text>
          <TouchableOpacity
            style={[styles.pickerButton, education && styles.pickerButtonFilled]}
            onPress={() => setShowEducationPicker(!showEducationPicker)}
          >
            <Text style={[styles.pickerButtonText, !education && styles.placeholderText]}>
              {education ? EDUCATION_OPTIONS.find(e => e.id === education)?.name : 'Select education level'}
            </Text>
            <Ionicons 
              name={showEducationPicker ? "chevron-up" : "chevron-down"} 
              size={24} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>

        {showEducationPicker && (
          <View style={styles.pickerContainer}>
            <ScrollView style={styles.pickerScroll} nestedScrollEnabled>
              {EDUCATION_OPTIONS.map(option => renderPickerOption(option, education, setEducation))}
            </ScrollView>
          </View>
        )}

        {/* Annual Income */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Annual Family Income / वार्षिक पारिवारिक आय</Text>
          <TouchableOpacity
            style={[styles.pickerButton, incomeRange && styles.pickerButtonFilled]}
            onPress={() => setShowIncomePicker(!showIncomePicker)}
          >
            <Text style={[styles.pickerButtonText, !incomeRange && styles.placeholderText]}>
              {incomeRange ? INCOME_RANGE_OPTIONS.find(i => i.id === incomeRange)?.name : 'Select income range'}
            </Text>
            <Ionicons 
              name={showIncomePicker ? "chevron-up" : "chevron-down"} 
              size={24} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>

        {showIncomePicker && (
          <View style={styles.pickerContainer}>
            {INCOME_RANGE_OPTIONS.map(option => renderPickerOption(option, incomeRange, setIncomeRange))}
          </View>
        )}

        {/* Family Information */}
        <Text style={styles.sectionTitle}>Family Information</Text>

        {/* Family Size */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Total Family Members / कुल परिवार के सदस्य</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Number of family members"
            placeholderTextColor={colors.textSecondary}
            value={familySize}
            onChangeText={setFamilySize}
            keyboardType="number-pad"
            maxLength={2}
          />
        </View>

        {/* Dependents */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Number of Dependents / आश्रितों की संख्या</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Number of dependents"
            placeholderTextColor={colors.textSecondary}
            value={dependents}
            onChangeText={setDependents}
            keyboardType="number-pad"
            maxLength={2}
          />
        </View>

        {/* Special Categories */}
        <Text style={styles.sectionTitle}>Special Categories</Text>

        {/* BPL Card */}
        <View style={styles.switchItem}>
          <View style={styles.switchInfo}>
            <Text style={styles.switchLabel}>BPL Card Holder</Text>
            <Text style={styles.switchSubtext}>Below Poverty Line / गरीबी रेखा से नीचे</Text>
          </View>
          <Switch
            value={hasBPLCard}
            onValueChange={setHasBPLCard}
            trackColor={{ false: colors.gray300, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>

        {/* Disability */}
        <View style={styles.switchItem}>
          <View style={styles.switchInfo}>
            <Text style={styles.switchLabel}>Person with Disability (PWD)</Text>
            <Text style={styles.switchSubtext}>विकलांग व्यक्ति</Text>
          </View>
          <Switch
            value={hasDisability}
            onValueChange={setHasDisability}
            trackColor={{ false: colors.gray300, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>

        {/* Minority */}
        <View style={styles.switchItem}>
          <View style={styles.switchInfo}>
            <Text style={styles.switchLabel}>Minority Community</Text>
            <Text style={styles.switchSubtext}>अल्पसंख्यक समुदाय</Text>
          </View>
          <Switch
            value={isMinority}
            onValueChange={setIsMinority}
            trackColor={{ false: colors.gray300, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>

        {/* Help Text */}
        <View style={styles.helpBox}>
          <MaterialCommunityIcons name="shield-check" size={20} color={colors.success} />
          <Text style={styles.helpText}>
            Accurate demographic information ensures you don't miss out on eligible schemes and benefits
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
  saveButton: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'right',
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
    marginBottom: spacing.md,
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
  pickerContainer: {
    backgroundColor: colors.white,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    maxHeight: 250,
    overflow: 'hidden',
  },
  pickerScroll: {
    maxHeight: 250,
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
  switchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  switchInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  switchLabel: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
  },
  switchSubtext: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  helpBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.successLight,
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
