import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';

const { width } = Dimensions.get('window');

export default function FormProgressModal({
  visible,
  onClose,
  formName,
  formNameHindi,
  questions,
  answers,
  currentQuestionIndex,
  language,
  onJumpToQuestion,
}) {
  const totalQuestions = questions.length;
  const answeredQuestions = Object.keys(answers).length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  const getQuestionStatus = (questionIndex, question) => {
    const hasAnswer = answers.hasOwnProperty(question.id);
    
    if (hasAnswer) {
      return 'completed';
    } else if (questionIndex === currentQuestionIndex) {
      return 'current';
    } else if (questionIndex < currentQuestionIndex) {
      // Skipped question (due to dependencies)
      return 'skipped';
    } else {
      return 'upcoming';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'current':
        return '#FF9800';
      case 'skipped':
        return colors.gray300;
      case 'upcoming':
        return colors.gray200;
      default:
        return colors.gray200;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'checkmark-circle';
      case 'current':
        return 'arrow-forward-circle';
      case 'skipped':
        return 'remove-circle-outline';
      case 'upcoming':
        return 'ellipse-outline';
      default:
        return 'ellipse-outline';
    }
  };

  const canJumpToQuestion = (questionIndex, status) => {
    // Can only jump to completed questions or current question
    return status === 'completed' || status === 'current';
  };

  const handleQuestionPress = (questionIndex, status) => {
    if (canJumpToQuestion(questionIndex, status)) {
      onJumpToQuestion(questionIndex);
      onClose();
    }
  };

  const formatAnswer = (question, answer) => {
    if (typeof answer === 'boolean') {
      return answer ? 'Yes / हाँ' : 'No / नहीं';
    }
    
    if (question.type === 'select' && question.options) {
      const option = question.options.find((opt) => opt.value === answer);
      if (option) {
        return language === 'hindi' ? option.labelHindi : option.label;
      }
    }
    
    return String(answer);
  };

  const renderQuestionItem = (question, index) => {
    const status = getQuestionStatus(index, question);
    const statusColor = getStatusColor(status);
    const statusIcon = getStatusIcon(status);
    const answer = answers[question.id];
    const canJump = canJumpToQuestion(index, status);

    const questionText = language === 'hindi' ? question.questionHindi : question.question;

    return (
      <TouchableOpacity
        key={question.id}
        style={[
          styles.questionItem,
          !canJump && styles.questionItemDisabled,
        ]}
        onPress={() => handleQuestionPress(index, status)}
        disabled={!canJump}
        activeOpacity={canJump ? 0.7 : 1}
      >
        <View style={styles.questionIconContainer}>
          <Ionicons name={statusIcon} size={28} color={statusColor} />
        </View>
        <View style={styles.questionContent}>
          <View style={styles.questionHeader}>
            <Text style={styles.questionNumber}>Question {index + 1}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <Text style={styles.statusBadgeText}>
                {status === 'completed' && 'Done'}
                {status === 'current' && 'Current'}
                {status === 'skipped' && 'Skipped'}
                {status === 'upcoming' && 'Pending'}
              </Text>
            </View>
          </View>
          <Text style={styles.questionText} numberOfLines={2}>
            {questionText}
          </Text>
          {answer && (
            <View style={styles.answerContainer}>
              <Ionicons name="chatbubble-ellipses" size={14} color={colors.textSecondary} />
              <Text style={styles.answerText} numberOfLines={1}>
                {formatAnswer(question, answer)}
              </Text>
            </View>
          )}
          {status === 'skipped' && (
            <Text style={styles.skippedNote}>
              Not applicable based on previous answers
            </Text>
          )}
        </View>
        {canJump && (
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderLeft}>
              <MaterialCommunityIcons name="progress-check" size={24} color={colors.textPrimary} />
              <View style={styles.modalTitleContainer}>
                <Text style={styles.modalTitle}>Progress</Text>
                <Text style={styles.modalSubtitle}>
                  {language === 'hindi' ? formNameHindi : formName}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Progress Summary */}
          <View style={styles.progressSummary}>
            <View style={styles.progressCircleContainer}>
              <View style={styles.progressCircle}>
                <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
                <Text style={styles.progressLabel}>Complete</Text>
              </View>
            </View>
            <View style={styles.progressStats}>
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: '#4CAF50' }]}>
                  <Ionicons name="checkmark" size={20} color={colors.white} />
                </View>
                <View>
                  <Text style={styles.statValue}>{answeredQuestions}</Text>
                  <Text style={styles.statLabel}>Answered</Text>
                </View>
              </View>
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: colors.gray300 }]}>
                  <Ionicons name="help" size={20} color={colors.white} />
                </View>
                <View>
                  <Text style={styles.statValue}>{totalQuestions - answeredQuestions}</Text>
                  <Text style={styles.statLabel}>Remaining</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Questions List */}
          <View style={styles.questionsListContainer}>
            <Text style={styles.questionsListTitle}>All Questions</Text>
            <ScrollView
              style={styles.questionsList}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.questionsListContent}
            >
              {questions.map((question, index) => renderQuestionItem(question, index))}
            </ScrollView>
          </View>

          {/* Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.legendText}>Answered</Text>
            </View>
            <View style={styles.legendItem}>
              <Ionicons name="arrow-forward-circle" size={16} color="#FF9800" />
              <Text style={styles.legendText}>Current</Text>
            </View>
            <View style={styles.legendItem}>
              <Ionicons name="ellipse-outline" size={16} color={colors.gray300} />
              <Text style={styles.legendText}>Pending</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: spacing.lg,
  },

  // Header
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalTitleContainer: {
    marginLeft: spacing.md,
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    marginTop: 2,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Progress Summary
  progressSummary: {
    flexDirection: 'row',
    padding: spacing.lg,
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.gray200,
  },
  progressCircleContainer: {
    marginRight: spacing.lg,
  },
  progressCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 28,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
  },
  progressLabel: {
    fontSize: 12,
    fontFamily: typography.fontFamily.regular,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  progressStats: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },

  // Questions List
  questionsListContainer: {
    flex: 1,
    marginTop: spacing.lg,
  },
  questionsListTitle: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textSecondary,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  questionsList: {
    flex: 1,
  },
  questionsListContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },

  // Question Item
  questionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: colors.gray200,
  },
  questionItemDisabled: {
    opacity: 0.6,
  },
  questionIconContainer: {
    marginRight: spacing.md,
  },
  questionContent: {
    flex: 1,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs / 2,
  },
  questionNumber: {
    fontSize: 12,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 10,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.white,
  },
  questionText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    color: colors.textPrimary,
    lineHeight: 20,
    marginBottom: spacing.xs / 2,
  },
  answerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  answerText: {
    flex: 1,
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  skippedNote: {
    fontSize: 11,
    fontFamily: typography.fontFamily.regular,
    color: colors.textDisabled,
    fontStyle: 'italic',
    marginTop: spacing.xs / 2,
  },

  // Legend
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },
});
