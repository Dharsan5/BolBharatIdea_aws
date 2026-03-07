import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { useLanguage } from '../i18n/LanguageContext';
import { saveUser, saveApplication } from '../api/database';

const USER_ID = 'user123'; // Replace with real user ID later

const MOCK_FORMS = [
  { id: '1', name: 'Ration Card', icon: 'document-text-outline', time: '10 mins', key: 'rationCard' },
  { id: '2', name: 'Health Card', icon: 'medical-outline', time: '15 mins', key: 'healthCard' },
  { id: '3', name: 'Crop Insurance', icon: 'leaf-outline', time: '12 mins', key: 'cropInsurance' },
];

const FORM_QUESTIONS = [
  { id: 'name', question: "What is your full name as per Aadhaar?", type: 'text' },
  { id: 'age', question: "What is your age?", type: 'number' },
  { id: 'income', question: "What is your annual family income?", type: 'number' },
  { id: 'land', question: "How many acres of land do you own?", type: 'number' },
];

export default function FormsScreen() {
  const { t } = useLanguage();
  const [activeForm, setActiveForm] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const startForm = (form) => {
    setActiveForm(form);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setInputValue('');
    setIsSubmitted(false);
  };

  const handleNext = () => {
    const currentQuestion = FORM_QUESTIONS[currentQuestionIndex];
    const newAnswers = { ...answers, [currentQuestion.id]: inputValue };
    setAnswers(newAnswers);
    setInputValue('');

    if (currentQuestionIndex < FORM_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit(newAnswers);
    }
  };

  // 🔥 Save to DynamoDB on submit
  const handleSubmit = async (finalAnswers) => {
    setIsSaving(true);
    try {
      // Save user profile
      await saveUser({
        userId: USER_ID,
        name: finalAnswers.name || '',
        income: finalAnswers.income || '',
        occupation: 'Farmer',
        language: 'hi',
        familyMembers: 4,
        ownsLand: parseFloat(finalAnswers.land || 0) > 0,
        state: 'Tamil Nadu',
      });

      // Save application
      await saveApplication(USER_ID, activeForm?.name || 'Form');

    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
      setIsSubmitted(true);
    }
  };

  const closeForm = () => {
    setActiveForm(null);
    setIsSubmitted(false);
  };

  const renderAssistantModal = () => (
    <Modal visible={!!activeForm} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.assistantModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{activeForm ? t(activeForm.key) : ''} {t('assistant')}</Text>
            <TouchableOpacity onPress={closeForm}>
              <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {!isSubmitted ? (
            <View style={styles.modalBody}>
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${((currentQuestionIndex + 1) / FORM_QUESTIONS.length) * 100}%` }]} />
              </View>

              <ScrollView style={styles.chatContainer}>
                <View style={styles.aiMessage}>
                  <View style={styles.robotIcon}>
                    <MaterialCommunityIcons name="robot" size={20} color={theme.colors.white} />
                  </View>
                  <View style={styles.messageBubble}>
                    <Text style={styles.messageText}>{FORM_QUESTIONS[currentQuestionIndex].question}</Text>
                  </View>
                </View>

                {Object.entries(answers).map(([key, value]) => (
                  <View key={key} style={styles.userMessage}>
                    <View style={styles.userBubble}>
                      <Text style={styles.userMessageText}>{value}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>

              <View style={styles.inputArea}>
                <TextInput
                  style={styles.input}
                  placeholder="Type your answer..."
                  value={inputValue}
                  onChangeText={setInputValue}
                  keyboardType={FORM_QUESTIONS[currentQuestionIndex].type === 'number' ? 'numeric' : 'default'}
                />
                <TouchableOpacity
                  style={[styles.sendButton, !inputValue && styles.sendButtonDisabled]}
                  onPress={handleNext}
                  disabled={!inputValue}
                >
                  <Ionicons name="send" size={20} color={theme.colors.white} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.successContainer}>
              {isSaving ? (
                <>
                  <ActivityIndicator size="large" color={theme.colors.primary} />
                  <Text style={styles.savingText}>Saving to database...</Text>
                </>
              ) : (
                <>
                  <View style={styles.successIcon}>
                    <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
                  </View>
                  <Text style={styles.successTitle}>Application Submitted! ✅</Text>
                  <Text style={styles.successText}>Your details have been saved successfully.</Text>

                  <View style={styles.summaryContainer}>
                    {Object.entries(answers).map(([key, value]) => (
                      <View key={key} style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}:</Text>
                        <Text style={styles.summaryValue}>{value}</Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity style={styles.doneButton} onPress={closeForm}>
                    <Text style={styles.doneButtonText}>Done</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('forms')}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.assistantCard}>
          <MaterialCommunityIcons name="robot-outline" size={48} color={theme.colors.white} />
          <Text style={styles.assistantTitle}>{t('aiFormAssistant')}</Text>
          <Text style={styles.assistantText}>{t('helpFillForms')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('availableForms')}</Text>
          {MOCK_FORMS.map((form) => (
            <TouchableOpacity key={form.id} style={styles.formCard} onPress={() => startForm(form)}>
              <View style={styles.formIconContainer}>
                <Ionicons name={form.icon} size={24} color={theme.colors.black} />
              </View>
              <View style={styles.formInfo}>
                <Text style={styles.formName}>{t(form.key)}</Text>
                <Text style={styles.formTime}>~{form.time}</Text>
              </View>
              <Ionicons name="arrow-forward" size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {renderAssistantModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { padding: theme.spacing.lg, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  title: { ...theme.typography.h2, color: theme.colors.textPrimary },
  content: { flex: 1 },
  assistantCard: {
    backgroundColor: theme.colors.black,
    margin: theme.spacing.lg,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
  },
  assistantTitle: { ...theme.typography.h3, color: theme.colors.white, marginBottom: theme.spacing.md },
  assistantText: { ...theme.typography.body1, color: theme.colors.gray200, textAlign: 'center' },
  section: { padding: theme.spacing.lg },
  sectionTitle: { ...theme.typography.h4, color: theme.colors.textPrimary, marginBottom: theme.spacing.md },
  formCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  formIconContainer: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: theme.colors.white, borderWidth: 1, borderColor: theme.colors.border,
    justifyContent: 'center', alignItems: 'center', marginRight: theme.spacing.md,
  },
  formInfo: { flex: 1 },
  formName: { ...theme.typography.subtitle, color: theme.colors.textPrimary, marginBottom: theme.spacing.xs },
  formTime: { ...theme.typography.caption, color: theme.colors.textSecondary },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  assistantModal: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    height: '85%',
    padding: theme.spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: theme.spacing.lg, paddingBottom: theme.spacing.md,
    borderBottomWidth: 1, borderBottomColor: theme.colors.border,
  },
  modalTitle: { ...theme.typography.h3 },
  modalBody: { flex: 1 },
  progressContainer: { height: 4, backgroundColor: theme.colors.border, borderRadius: 2, marginBottom: theme.spacing.xl },
  progressBar: { height: '100%', backgroundColor: theme.colors.primary, borderRadius: 2 },
  chatContainer: { flex: 1 },
  aiMessage: { flexDirection: 'row', marginBottom: theme.spacing.lg },
  robotIcon: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center',
  },
  messageBubble: {
    backgroundColor: theme.colors.surface, padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg, marginLeft: theme.spacing.sm,
    maxWidth: '80%', borderWidth: 1, borderColor: theme.colors.border,
  },
  messageText: { ...theme.typography.body1 },
  userMessage: { alignItems: 'flex-end', marginBottom: theme.spacing.lg },
  userBubble: { backgroundColor: theme.colors.black, padding: theme.spacing.md, borderRadius: theme.borderRadius.lg, maxWidth: '80%' },
  userMessageText: { ...theme.typography.body1, color: theme.colors.white },
  inputArea: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: theme.spacing.md, borderTopWidth: 1, borderTopColor: theme.colors.border,
  },
  input: {
    flex: 1, backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg, padding: theme.spacing.md,
    marginRight: theme.spacing.sm, ...theme.typography.body1,
  },
  sendButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: theme.colors.black, justifyContent: 'center', alignItems: 'center' },
  sendButtonDisabled: { opacity: 0.5 },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  savingText: { ...theme.typography.body2, color: theme.colors.textSecondary, marginTop: theme.spacing.md },
  successIcon: { marginBottom: theme.spacing.lg },
  successTitle: { ...theme.typography.h2, textAlign: 'center' },
  successText: { ...theme.typography.body1, color: theme.colors.textSecondary, textAlign: 'center', marginTop: theme.spacing.sm, marginBottom: theme.spacing.xl },
  summaryContainer: { width: '100%', backgroundColor: theme.colors.surface, padding: theme.spacing.lg, borderRadius: theme.borderRadius.lg, marginBottom: theme.spacing.xl },
  summaryItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.sm },
  summaryLabel: { ...theme.typography.body2, color: theme.colors.textSecondary },
  summaryValue: { ...theme.typography.subtitle, color: theme.colors.textPrimary },
  doneButton: { backgroundColor: theme.colors.black, paddingVertical: theme.spacing.lg, paddingHorizontal: theme.spacing.xxl, borderRadius: theme.borderRadius.lg },
  doneButtonText: { ...theme.typography.button, color: theme.colors.white },
});