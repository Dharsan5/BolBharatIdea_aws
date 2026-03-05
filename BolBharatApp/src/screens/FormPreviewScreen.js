import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';

export default function FormPreviewScreen({ route, navigation }) {
  const { formId, formName, formNameHindi, questions, answers } = route.params || {};
  const [language, setLanguage] = useState('english');

  const handleEdit = (questionIndex) => {
    // Navigate back to conversation screen at specific question
    navigation.navigate('FormConversation', {
      formId,
      editMode: true,
      jumpToQuestion: questionIndex,
    });
  };

  const handleSubmit = () => {
    Alert.alert(
      language === 'hindi' ? 'फॉर्म जमा करें?' : 'Submit Form?',
      language === 'hindi'
        ? 'क्या आप वाकई इस फॉर्म को जमा करना चाहते हैं? जमा करने के बाद आप इसे संपादित नहीं कर पाएंगे।'
        : 'Are you sure you want to submit this form? You will not be able to edit it after submission.',
      [
        { text: language === 'hindi' ? 'रद्द करें' : 'Cancel', style: 'cancel' },
        {
          text: language === 'hindi' ? 'जमा करें' : 'Submit',
          style: 'default',
          onPress: () => {
            // Navigate to submission screen
            navigation.navigate('FormSubmission', {
              formId,
              formName,
              formNameHindi,
              answers,
            });
          },
        },
      ]
    );
  };

  const handleBack = () => {
    Alert.alert(
      language === 'hindi' ? 'वापस जाएं?' : 'Go Back?',
      language === 'hindi'
        ? 'क्या आप वाकई वापस जाना चाहते हैं? आपके परिवर्तन सहेजे नहीं जाएंगे।'
        : 'Are you sure you want to go back? Your changes will not be saved.',
      [
        { text: language === 'hindi' ? 'रहें' : 'Stay', style: 'cancel' },
        { text: language === 'hindi' ? 'वापस जाएं' : 'Go Back', onPress: () => navigation.goBack() },
      ]
    );
  };

  const formatAnswer = (question, answer) => {
    if (answer === undefined || answer === null || answer === '') {
      return language === 'hindi' ? 'उत्तर नहीं दिया गया' : 'Not answered';
    }

    if (typeof answer === 'boolean') {
      return answer
        ? (language === 'hindi' ? 'हाँ' : 'Yes')
        : (language === 'hindi' ? 'नहीं' : 'No');
    }

    if (question.type === 'select' && question.options) {
      const option = question.options.find((opt) => opt.value === answer);
      if (option) {
        return language === 'hindi' ? option.labelHindi : option.label;
      }
    }

    return String(answer);
  };

  const getQuestionText = (question) => {
    return language === 'hindi' ? question.questionHindi : question.question;
  };

  const renderAnswerItem = (question, index) => {
    const answer = answers[question.id];
    
    // Skip questions without answers (could be conditional questions that were skipped)
    if (answer === undefined || answer === null) {
      return null;
    }

    return (
      <View key={question.id} style={styles.answerItem}>
        <View style={styles.answerHeader}>
          <View style={styles.questionNumberBadge}>
            <Text style={styles.questionNumberText}>{index + 1}</Text>
          </View>
          <View style={styles.answerHeaderContent}>
            <Text style={styles.questionText}>{getQuestionText(question)}</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEdit(index)}
          >
            <Ionicons name="create-outline" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <View style={styles.answerContent}>
          <View style={styles.answerBubble}>
            <Ionicons name="chatbubble" size={16} color="#003D7A" style={styles.answerIcon} />
            <Text style={styles.answerText}>{formatAnswer(question, answer)}</Text>
          </View>
        </View>
      </View>
    );
  };

  const answeredQuestions = questions.filter(q => answers[q.id] !== undefined && answers[q.id] !== null);
  const totalAnswered = answeredQuestions.length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            {language === 'hindi' ? 'फॉर्म समीक्षा' : 'Review Form'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {language === 'hindi' ? formNameHindi : formName}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setLanguage(language === 'english' ? 'hindi' : 'english')}
          style={styles.headerButton}
        >
          <Ionicons name="language" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}>
            <MaterialCommunityIcons name="file-document-check" size={40} color={colors.white} />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryTitle}>
              {language === 'hindi' ? 'आपका फॉर्म तैयार है' : 'Your Form is Ready'}
            </Text>
            <Text style={styles.summaryDescription}>
              {language === 'hindi'
                ? 'जमा करने से पहले अपने उत्तरों की समीक्षा करें। आप किसी भी उत्तर को संपादित कर सकते हैं।'
                : 'Review your answers before submitting. You can edit any answer.'}
            </Text>
            <View style={styles.summaryStats}>
              <View style={styles.summaryStatItem}>
                <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
                <Text style={styles.summaryStatText}>
                  {totalAnswered} {language === 'hindi' ? 'उत्तर' : 'answers'}
                </Text>
              </View>
              <View style={styles.summaryStatItem}>
                <MaterialCommunityIcons name="clock-outline" size={20} color={colors.textSecondary} />
                <Text style={styles.summaryStatText}>
                  {language === 'hindi' ? 'लगभग 5 मिनट' : '~5 min to process'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <Ionicons name="information-circle" size={20} color="#003D7A" />
          <Text style={styles.instructionsText}>
            {language === 'hindi'
              ? 'किसी भी उत्तर को संपादित करने के लिए संपादित बटन पर टैप करें।'
              : 'Tap the edit button to modify any answer.'}
          </Text>
        </View>

        {/* Answers Section */}
        <View style={styles.answersSection}>
          <Text style={styles.sectionTitle}>
            {language === 'hindi' ? 'आपके उत्तर' : 'Your Answers'}
          </Text>
          {questions.map((question, index) => renderAnswerItem(question, index))}
        </View>

        {/* Spacer for bottom button */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="send" size={24} color={colors.white} />
          <Text style={styles.submitButtonText}>
            {language === 'hindi' ? 'फॉर्म जमा करें' : 'Submit Form'}
          </Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: spacing.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // Content
  content: {
    flex: 1,
  },

  // Summary Card
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: colors.black,
    margin: spacing.lg,
    padding: spacing.lg,
    borderRadius: 16,
  },
  summaryIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  summaryContent: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  summaryDescription: {
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  summaryStats: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  summaryStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  summaryStatText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    color: 'rgba(255, 255, 255, 0.9)',
  },

  // Instructions
  instructionsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.md,
    borderRadius: 12,
    gap: spacing.sm,
  },
  instructionsText: {
    flex: 1,
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
    color: '#003D7A',
    lineHeight: 18,
  },

  // Answers Section
  answersSection: {
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },

  // Answer Item
  answerItem: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.gray200,
  },
  answerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  questionNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  questionNumberText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
  },
  answerHeaderContent: {
    flex: 1,
  },
  questionText: {
    fontSize: 15,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.gray50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  answerContent: {
    marginLeft: 44, // Align with question text
  },
  answerBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: spacing.md,
    borderRadius: 12,
    gap: spacing.sm,
  },
  answerIcon: {
    marginTop: 2,
  },
  answerText: {
    flex: 1,
    fontSize: 15,
    fontFamily: typography.fontFamily.medium,
    color: '#003D7A',
    lineHeight: 22,
  },

  // Bottom
  bottomSpacer: {
    height: 100,
  },
  bottomBar: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    padding: spacing.lg,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#138808',
    paddingVertical: spacing.lg,
    borderRadius: 12,
    gap: spacing.sm,
  },
  submitButtonText: {
    fontSize: 17,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
  },
});
