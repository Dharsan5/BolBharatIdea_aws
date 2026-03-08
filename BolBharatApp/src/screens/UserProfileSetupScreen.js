import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Easing,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, typography } from '../theme';
import { saveUser } from '../api/database';

const { width, height } = Dimensions.get('window');

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Puducherry',
];

const OCCUPATION_TYPES = [
  'Farmer', 'Daily Wage Worker', 'Self-Employed', 'Small Business Owner',
  'Salaried Employee', 'Student', 'Homemaker', 'Retired', 'Unemployed', 'Other',
];

const INCOME_CATEGORIES = [
  'Below ₹1 Lakh/year',
  '₹1-3 Lakhs/year',
  '₹3-5 Lakhs/year',
  '₹5-10 Lakhs/year',
  'Above ₹10 Lakhs/year',
];

export default function UserProfileSetupScreen({ navigation }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    state: '',
    district: '',
    occupation: '',
    incomeCategory: '',
    familySize: '',
  });
  const [showStatePicker, setShowStatePicker] = useState(false);
  const [showOccupationPicker, setShowOccupationPicker] = useState(false);
  const [showIncomePicker, setShowIncomePicker] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const totalSteps = 3;

  useEffect(() => {
    animateIn();
    updateProgress();
  }, [currentStep]);

  const animateIn = () => {
    fadeAnim.setValue(0);
    slideAnim.setValue(30);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const updateProgress = () => {
    Animated.timing(progressAnim, {
      toValue: currentStep / totalSteps,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleUpdateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const isStepValid = () => {
    if (currentStep === 1) {
      return formData.name.trim().length > 0 && 
             formData.age.trim().length > 0 && 
             formData.gender.length > 0;
    }
    if (currentStep === 2) {
      return formData.state.length > 0 && formData.district.trim().length > 0;
    }
    if (currentStep === 3) {
      return formData.occupation.length > 0 && 
             formData.incomeCategory.length > 0;
    }
    return false;
  };

  const handleNext = () => {
    if (!isStepValid()) return;

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      // Save to local storage
      await AsyncStorage.setItem('userProfile', JSON.stringify({
        fullName: formData.name,
        gender: formData.gender,
        state: formData.state,
        district: formData.district,
        occupation: formData.occupation,
        monthlyIncome: formData.incomeCategory,
        familyMembers: formData.familySize,
        lastUpdated: new Date().toISOString(),
      }));

      // Save to cloud database
      const userId = formData.name.replace(/\s+/g, '_').toLowerCase() + '_' + Date.now();
      await saveUser({
        userId,
        name: formData.name,
        age: formData.age,
        gender: formData.gender,
        state: formData.state,
        district: formData.district,
        occupation: formData.occupation,
        incomeCategory: formData.incomeCategory,
        familySize: formData.familySize,
      });
      console.log('Profile saved to database');
    } catch (err) {
      console.warn('Error saving profile:', err);
    }
    navigation.replace('Main');
  };

  const handleSkip = () => {
    navigation.replace('Main');
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                { width: progressWidth },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            Step {currentStep} of {totalSteps}
          </Text>
        </View>

        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {currentStep === 1 && (
            <Step1
              formData={formData}
              onUpdateField={handleUpdateField}
            />
          )}

          {currentStep === 2 && (
            <Step2
              formData={formData}
              onUpdateField={handleUpdateField}
              showStatePicker={showStatePicker}
              setShowStatePicker={setShowStatePicker}
            />
          )}

          {currentStep === 3 && (
            <Step3
              formData={formData}
              onUpdateField={handleUpdateField}
              showOccupationPicker={showOccupationPicker}
              setShowOccupationPicker={setShowOccupationPicker}
              showIncomePicker={showIncomePicker}
              setShowIncomePicker={setShowIncomePicker}
            />
          )}
        </Animated.View>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        {currentStep > 1 && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.nextButton,
            !isStepValid() && styles.nextButtonDisabled,
            currentStep === 1 && styles.nextButtonFull,
          ]}
          onPress={handleNext}
          disabled={!isStepValid()}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === totalSteps ? 'Complete' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// Step 1: Basic Information
function Step1({ formData, onUpdateField }) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Basic Information</Text>
      <Text style={styles.stepDescription}>
        Help us personalize your experience
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          value={formData.name}
          onChangeText={(text) => onUpdateField('name', text)}
          placeholderTextColor={colors.textDisabled}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Age *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your age"
          value={formData.age}
          onChangeText={(text) => onUpdateField('age', text.replace(/[^0-9]/g, ''))}
          keyboardType="numeric"
          maxLength={3}
          placeholderTextColor={colors.textDisabled}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Gender *</Text>
        <View style={styles.genderContainer}>
          {['Male', 'Female', 'Other'].map((gender) => (
            <TouchableOpacity
              key={gender}
              style={[
                styles.genderButton,
                formData.gender === gender && styles.genderButtonSelected,
              ]}
              onPress={() => onUpdateField('gender', gender)}
            >
              <Text
                style={[
                  styles.genderButtonText,
                  formData.gender === gender && styles.genderButtonTextSelected,
                ]}
              >
                {gender}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

// Step 2: Location
function Step2({ formData, onUpdateField, showStatePicker, setShowStatePicker }) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Location</Text>
      <Text style={styles.stepDescription}>
        We'll find schemes available in your area
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>State *</Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowStatePicker(!showStatePicker)}
        >
          <Text
            style={[
              styles.pickerButtonText,
              !formData.state && styles.pickerPlaceholder,
            ]}
          >
            {formData.state || 'Select your state'}
          </Text>
          <Text style={styles.pickerArrow}>▼</Text>
        </TouchableOpacity>

        {showStatePicker && (
          <ScrollView style={styles.pickerList} nestedScrollEnabled>
            {STATES.map((state) => (
              <TouchableOpacity
                key={state}
                style={styles.pickerItem}
                onPress={() => {
                  onUpdateField('state', state);
                  setShowStatePicker(false);
                }}
              >
                <Text style={styles.pickerItemText}>{state}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>District *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your district"
          value={formData.district}
          onChangeText={(text) => onUpdateField('district', text)}
          placeholderTextColor={colors.textDisabled}
        />
      </View>
    </View>
  );
}

// Step 3: Economic Information
function Step3({
  formData,
  onUpdateField,
  showOccupationPicker,
  setShowOccupationPicker,
  showIncomePicker,
  setShowIncomePicker,
}) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Economic Information</Text>
      <Text style={styles.stepDescription}>
        Helps us match you with relevant schemes
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Occupation *</Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowOccupationPicker(!showOccupationPicker)}
        >
          <Text
            style={[
              styles.pickerButtonText,
              !formData.occupation && styles.pickerPlaceholder,
            ]}
          >
            {formData.occupation || 'Select your occupation'}
          </Text>
          <Text style={styles.pickerArrow}>▼</Text>
        </TouchableOpacity>

        {showOccupationPicker && (
          <ScrollView style={styles.pickerList} nestedScrollEnabled>
            {OCCUPATION_TYPES.map((occupation) => (
              <TouchableOpacity
                key={occupation}
                style={styles.pickerItem}
                onPress={() => {
                  onUpdateField('occupation', occupation);
                  setShowOccupationPicker(false);
                }}
              >
                <Text style={styles.pickerItemText}>{occupation}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Annual Household Income *</Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowIncomePicker(!showIncomePicker)}
        >
          <Text
            style={[
              styles.pickerButtonText,
              !formData.incomeCategory && styles.pickerPlaceholder,
            ]}
          >
            {formData.incomeCategory || 'Select income range'}
          </Text>
          <Text style={styles.pickerArrow}>▼</Text>
        </TouchableOpacity>

        {showIncomePicker && (
          <View style={styles.pickerList}>
            {INCOME_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                style={styles.pickerItem}
                onPress={() => {
                  onUpdateField('incomeCategory', category);
                  setShowIncomePicker(false);
                }}
              >
                <Text style={styles.pickerItemText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Family Size</Text>
        <TextInput
          style={styles.input}
          placeholder="Number of family members"
          value={formData.familySize}
          onChangeText={(text) => onUpdateField('familySize', text.replace(/[^0-9]/g, ''))}
          keyboardType="numeric"
          maxLength={2}
          placeholderTextColor={colors.textDisabled}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingTop: spacing.xxl * 2,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    marginRight: spacing.lg,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.gray200,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.black,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    color: colors.textSecondary,
  },
  skipButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  skipText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  stepContainer: {
    marginTop: spacing.lg,
  },
  stepTitle: {
    fontSize: 28,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  stepDescription: {
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.gray50,
    borderWidth: 2,
    borderColor: colors.gray200,
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontSize: 16,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  genderButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.gray200,
    backgroundColor: colors.gray50,
    alignItems: 'center',
  },
  genderButtonSelected: {
    borderColor: colors.black,
    backgroundColor: colors.gray100,
  },
  genderButtonText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    color: colors.textSecondary,
  },
  genderButtonTextSelected: {
    color: colors.black,
    fontFamily: typography.fontFamily.semiBold,
  },
  pickerButton: {
    backgroundColor: colors.gray50,
    borderWidth: 2,
    borderColor: colors.gray200,
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerButtonText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
  },
  pickerPlaceholder: {
    color: colors.textDisabled,
  },
  pickerArrow: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  pickerList: {
    maxHeight: 200,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.gray200,
    borderRadius: 12,
    marginTop: spacing.sm,
  },
  pickerItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  pickerItemText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    flexDirection: 'row',
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    backgroundColor: colors.white,
  },
  backButton: {
    flex: 1,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.gray300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
  },
  nextButton: {
    flex: 2,
    backgroundColor: colors.black,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonFull: {
    flex: 1,
  },
  nextButtonDisabled: {
    backgroundColor: colors.gray400,
    opacity: 0.5,
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.white,
  },
});
