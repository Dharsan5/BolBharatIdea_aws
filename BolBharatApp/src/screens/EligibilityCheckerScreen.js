import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';

// Eligibility criteria templates for different schemes
const ELIGIBILITY_CRITERIA = {
  '1': { // Pradhan Mantri Fasal Bima Yojana
    name: 'Pradhan Mantri Fasal Bima Yojana',
    requirements: {
      occupation: ['Farmer', 'Agricultural Worker'],
      landOwnership: ['Owner', 'Tenant', 'Sharecropper'],
      hasAadhaar: true,
      hasBankAccount: true,
    },
  },
  '2': { // PM Kisan Samman Nidhi
    name: 'PM Kisan Samman Nidhi',
    requirements: {
      occupation: ['Farmer'],
      hasAadhaar: true,
      hasBankAccount: true,
      hasLandRecords: true,
    },
  },
  '3': { // Ayushman Bharat
    name: 'Ayushman Bharat',
    requirements: {
      incomeCategory: ['Below Poverty Line', 'Low Income'],
      hasRationCard: true,
    },
  },
  '4': { // PM Awas Yojana
    name: 'PM Awas Yojana',
    requirements: {
      incomeCategory: ['Below Poverty Line', 'Low Income', 'Middle Income'],
      maxAnnualIncome: 1200000, // 12 lakhs
      doesNotOwnHouse: true,
    },
  },
  '5': { // Pradhan Mantri Mudra Yojana
    name: 'Pradhan Mantri Mudra Yojana',
    requirements: {
      occupation: ['Business Owner', 'Self Employed', 'Entrepreneur'],
      minAge: 18,
      hasBusinessPlan: true,
    },
  },
};

const QUESTIONS = [
  {
    id: 'occupation',
    question: 'What is your occupation?',
    type: 'select',
    options: [
      'Farmer',
      'Agricultural Worker',
      'Business Owner',
      'Self Employed',
      'Entrepreneur',
      'Salaried Employee',
      'Daily Wage Worker',
      'Student',
      'Unemployed',
      'Other',
    ],
  },
  {
    id: 'age',
    question: 'What is your age?',
    type: 'number',
    placeholder: 'Enter your age',
  },
  {
    id: 'incomeCategory',
    question: 'What is your income category?',
    type: 'select',
    options: [
      'Below Poverty Line',
      'Low Income (₹3-6 Lakh/year)',
      'Middle Income (₹6-12 Lakh/year)',
      'Above ₹12 Lakh/year',
    ],
  },
  {
    id: 'annualIncome',
    question: 'What is your annual household income?',
    type: 'number',
    placeholder: 'Enter amount in ₹',
  },
  {
    id: 'landOwnership',
    question: 'Do you own or cultivate agricultural land?',
    type: 'select',
    options: ['Owner', 'Tenant', 'Sharecropper', 'No agricultural land'],
  },
  {
    id: 'hasAadhaar',
    question: 'Do you have an Aadhaar card?',
    type: 'boolean',
  },
  {
    id: 'hasBankAccount',
    question: 'Do you have a bank account?',
    type: 'boolean',
  },
  {
    id: 'hasRationCard',
    question: 'Do you have a ration card?',
    type: 'boolean',
  },
  {
    id: 'hasLandRecords',
    question: 'Do you have updated land records?',
    type: 'boolean',
  },
  {
    id: 'doesNotOwnHouse',
    question: 'Do you currently not own a pucca house?',
    type: 'boolean',
  },
  {
    id: 'hasBusinessPlan',
    question: 'Do you have a business plan or existing business?',
    type: 'boolean',
  },
];

export default function EligibilityCheckerScreen({ route, navigation }) {
  const { schemeId } = route.params || {};
  const schemeCriteria = schemeId ? ELIGIBILITY_CRITERIA[schemeId] : null;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [eligibilityResults, setEligibilityResults] = useState([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Animate question entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentQuestionIndex]);

  const animateQuestionChange = (callback) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -20,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      slideAnim.setValue(20);
      callback();
    });
  };

  const getRelevantQuestions = () => {
    if (!schemeCriteria) {
      return QUESTIONS;
    }
    // Filter questions based on scheme requirements
    const requirements = schemeCriteria.requirements;
    return QUESTIONS.filter(q => requirements.hasOwnProperty(q.id));
  };

  const relevantQuestions = getRelevantQuestions();
  const currentQuestion = relevantQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / relevantQuestions.length) * 100;

  const handleAnswer = (answer) => {
    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);

    if (currentQuestionIndex < relevantQuestions.length - 1) {
      animateQuestionChange(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      });
    } else {
      // All questions answered, check eligibility
      checkEligibility(newAnswers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      animateQuestionChange(() => {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      });
    }
  };

  const checkEligibility = (userAnswers) => {
    const results = [];

    Object.entries(ELIGIBILITY_CRITERIA).forEach(([id, criteria]) => {
      const { name, requirements } = criteria;
      let isEligible = true;
      let missingRequirements = [];

      // Check each requirement
      Object.entries(requirements).forEach(([key, value]) => {
        const userAnswer = userAnswers[key];

        if (Array.isArray(value)) {
          // Check if user's answer is in the allowed array
          if (!value.includes(userAnswer)) {
            isEligible = false;
            missingRequirements.push(key);
          }
        } else if (typeof value === 'boolean') {
          // Check boolean requirements
          if (userAnswer !== value) {
            isEligible = false;
            missingRequirements.push(key);
          }
        } else if (typeof value === 'number') {
          // Check numeric requirements (e.g., max income, min age)
          if (key.startsWith('max') && parseFloat(userAnswer) > value) {
            isEligible = false;
            missingRequirements.push(key);
          } else if (key.startsWith('min') && parseFloat(userAnswer) < value) {
            isEligible = false;
            missingRequirements.push(key);
          }
        }
      });

      results.push({
        schemeId: id,
        name,
        isEligible,
        missingRequirements,
        matchPercentage: Math.round(
          ((Object.keys(requirements).length - missingRequirements.length) /
            Object.keys(requirements).length) *
            100
        ),
      });
    });

    // Sort by eligibility and match percentage
    results.sort((a, b) => {
      if (a.isEligible !== b.isEligible) {
        return b.isEligible - a.isEligible;
      }
      return b.matchPercentage - a.matchPercentage;
    });

    setEligibilityResults(results);
    setShowResults(true);
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    fadeAnim.setValue(0);
    slideAnim.setValue(20);
  };

  const handleViewScheme = (schemeId) => {
    navigation.navigate('SchemeDetail', { schemeId });
  };

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    return (
      <Animated.View
        style={[
          styles.questionContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.questionNumber}>
          Question {currentQuestionIndex + 1} of {relevantQuestions.length}
        </Text>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>

        {currentQuestion.type === 'select' && (
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  answers[currentQuestion.id] === option && styles.optionButtonSelected,
                ]}
                onPress={() => handleAnswer(option)}
              >
                <Text
                  style={[
                    styles.optionText,
                    answers[currentQuestion.id] === option && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
                {answers[currentQuestion.id] === option && (
                  <Ionicons name="checkmark-circle" size={20} color={colors.white} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {currentQuestion.type === 'boolean' && (
          <View style={styles.booleanContainer}>
            <TouchableOpacity
              style={[
                styles.booleanButton,
                answers[currentQuestion.id] === true && styles.booleanButtonSelected,
              ]}
              onPress={() => handleAnswer(true)}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={32}
                color={answers[currentQuestion.id] === true ? colors.white : colors.black}
              />
              <Text
                style={[
                  styles.booleanText,
                  answers[currentQuestion.id] === true && styles.booleanTextSelected,
                ]}
              >
                Yes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.booleanButton,
                answers[currentQuestion.id] === false && styles.booleanButtonSelected,
              ]}
              onPress={() => handleAnswer(false)}
            >
              <Ionicons
                name="close-circle-outline"
                size={32}
                color={answers[currentQuestion.id] === false ? colors.white : colors.black}
              />
              <Text
                style={[
                  styles.booleanText,
                  answers[currentQuestion.id] === false && styles.booleanTextSelected,
                ]}
              >
                No
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {currentQuestion.type === 'number' && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={currentQuestion.placeholder}
              placeholderTextColor={colors.textDisabled}
              keyboardType="numeric"
              value={answers[currentQuestion.id]?.toString() || ''}
              onChangeText={(text) =>
                setAnswers({ ...answers, [currentQuestion.id]: text })
              }
            />
            <TouchableOpacity
              style={[
                styles.nextButton,
                !answers[currentQuestion.id] && styles.nextButtonDisabled,
              ]}
              onPress={() => handleAnswer(answers[currentQuestion.id])}
              disabled={!answers[currentQuestion.id]}
            >
              <Text style={styles.nextButtonText}>Next</Text>
              <Ionicons name="arrow-forward" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    );
  };

  const renderResults = () => {
    const eligibleSchemes = eligibilityResults.filter(r => r.isEligible);
    const partiallyEligible = eligibilityResults.filter(
      r => !r.isEligible && r.matchPercentage >= 50
    );

    return (
      <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.resultsHeader}>
          <View style={styles.resultsIconContainer}>
            <Ionicons
              name={eligibleSchemes.length > 0 ? 'checkmark-circle' : 'information-circle'}
              size={48}
              color={eligibleSchemes.length > 0 ? '#4CAF50' : colors.textSecondary}
            />
          </View>
          <Text style={styles.resultsTitle}>Eligibility Results</Text>
          <Text style={styles.resultsSubtitle}>
            You are eligible for {eligibleSchemes.length} scheme
            {eligibleSchemes.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {eligibleSchemes.length > 0 && (
          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>Eligible Schemes</Text>
            {eligibleSchemes.map((result) => (
              <TouchableOpacity
                key={result.schemeId}
                style={styles.resultCard}
                onPress={() => handleViewScheme(result.schemeId)}
              >
                <View style={styles.resultCardHeader}>
                  <View style={styles.eligibleBadge}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text style={styles.eligibleText}>Eligible</Text>
                  </View>
                  <View style={styles.matchBadge}>
                    <Text style={styles.matchText}>{result.matchPercentage}% Match</Text>
                  </View>
                </View>
                <Text style={styles.resultCardTitle}>{result.name}</Text>
                <View style={styles.resultCardFooter}>
                  <Text style={styles.viewDetailsText}>View Details</Text>
                  <Ionicons name="arrow-forward" size={16} color={colors.textSecondary} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {partiallyEligible.length > 0 && (
          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>Partially Eligible</Text>
            {partiallyEligible.map((result) => (
              <TouchableOpacity
                key={result.schemeId}
                style={[styles.resultCard, styles.resultCardPartial]}
                onPress={() => handleViewScheme(result.schemeId)}
              >
                <View style={styles.resultCardHeader}>
                  <View style={styles.partialBadge}>
                    <Ionicons name="alert-circle" size={16} color="#FF9800" />
                    <Text style={styles.partialText}>Partially Eligible</Text>
                  </View>
                  <View style={styles.matchBadge}>
                    <Text style={styles.matchText}>{result.matchPercentage}% Match</Text>
                  </View>
                </View>
                <Text style={styles.resultCardTitle}>{result.name}</Text>
                <Text style={styles.missingRequirements}>
                  Missing {result.missingRequirements.length} requirement
                  {result.missingRequirements.length !== 1 ? 's' : ''}
                </Text>
                <View style={styles.resultCardFooter}>
                  <Text style={styles.viewDetailsText}>View Details</Text>
                  <Ionicons name="arrow-forward" size={16} color={colors.textSecondary} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
          <Ionicons name="refresh" size={20} color={colors.black} />
          <Text style={styles.restartButtonText}>Check Again</Text>
        </TouchableOpacity>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.black} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>
            {schemeCriteria ? `${schemeCriteria.name}` : 'Eligibility Checker'}
          </Text>
          {!schemeCriteria && (
            <Text style={styles.headerSubtitle}>Check for all schemes</Text>
          )}
        </View>
        <View style={styles.headerRight} />
      </View>

      {!showResults && (
        <>
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBackground}>
              <Animated.View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${progress}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>{Math.round(progress)}% Complete</Text>
          </View>

          {/* Questions */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {renderQuestion()}
          </ScrollView>

          {/* Navigation Buttons */}
          {currentQuestionIndex > 0 && (
            <View style={styles.navigationBar}>
              <TouchableOpacity style={styles.previousButton} onPress={handlePrevious}>
                <Ionicons name="arrow-back" size={20} color={colors.black} />
                <Text style={styles.previousButtonText}>Previous</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

      {showResults && renderResults()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
  },
  headerRight: {
    width: 40,
  },

  // Progress
  progressContainer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: colors.gray200,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.black,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textSecondary,
    textAlign: 'right',
  },

  // Questions
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  questionContainer: {
    marginTop: spacing.lg,
  },
  questionNumber: {
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  questionText: {
    fontSize: 24,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    lineHeight: 32,
    marginBottom: spacing.xl,
  },

  // Options
  optionsContainer: {
    gap: spacing.sm,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.gray200,
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  optionButtonSelected: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: typography.fontFamily.medium,
    color: colors.textPrimary,
  },
  optionTextSelected: {
    color: colors.white,
  },

  // Boolean
  booleanContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  booleanButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.gray200,
    borderRadius: 12,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  booleanButtonSelected: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  booleanText: {
    fontSize: 18,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  booleanTextSelected: {
    color: colors.white,
  },

  // Input
  inputContainer: {
    gap: spacing.md,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.gray200,
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontSize: 16,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.black,
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.white,
  },

  // Navigation
  navigationBar: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  previousButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
  },
  previousButtonText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.black,
  },

  // Results
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
  },
  resultsIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.gray50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  resultsTitle: {
    fontSize: 24,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  resultsSubtitle: {
    fontSize: 16,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  // Result Sections
  resultSection: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },

  // Result Cards
  resultCard: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.gray200,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  resultCardPartial: {
    borderColor: '#FF9800',
  },
  resultCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  eligibleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 12,
    gap: spacing.xs,
  },
  eligibleText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.semiBold,
    color: '#4CAF50',
  },
  partialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 12,
    gap: spacing.xs,
  },
  partialText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.semiBold,
    color: '#FF9800',
  },
  matchBadge: {
    backgroundColor: colors.gray50,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 12,
  },
  matchText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
  },
  resultCardTitle: {
    fontSize: 16,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  missingRequirements: {
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  resultCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  viewDetailsText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
  },

  // Restart Button
  restartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    marginHorizontal: spacing.xl,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  restartButtonText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.black,
  },
});
