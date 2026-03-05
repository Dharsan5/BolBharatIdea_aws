import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';
import FormProgressModal from '../components/FormProgressModal';

// Mock form structure - In production, this would come from backend
const FORM_TEMPLATES = {
  '1': {
    id: '1',
    name: 'Ration Card Application',
    nameHindi: 'राशन कार्ड आवेदन',
    questions: [
      {
        id: 'q1',
        question: 'What is the full name of the head of the family?',
        questionHindi: 'परिवार के मुखिया का पूरा नाम क्या है?',
        type: 'text',
        required: true,
        validation: { minLength: 2, maxLength: 100 },
        placeholder: 'Enter full name',
      },
      {
        id: 'q2',
        question: "What is your father's or husband's name?",
        questionHindi: 'आपके पिता या पति का नाम क्या है?',
        type: 'text',
        required: true,
        placeholder: "Enter father's/husband's name",
      },
      {
        id: 'q3',
        question: 'What is your complete address?',
        questionHindi: 'आपका पूरा पता क्या है?',
        type: 'text',
        required: true,
        multiline: true,
        placeholder: 'Enter house number, street, area, city, state, PIN',
      },
      {
        id: 'q4',
        question: 'What is your mobile number?',
        questionHindi: 'आपका मोबाइल नंबर क्या है?',
        type: 'phone',
        required: true,
        validation: { pattern: /^[6-9]\d{9}$/, message: 'Invalid phone number' },
        placeholder: '10-digit mobile number',
      },
      {
        id: 'q5',
        question: 'How many family members will be included in this ration card?',
        questionHindi: 'इस राशन कार्ड में कितने परिवार के सदस्य शामिल होंगे?',
        type: 'number',
        required: true,
        validation: { min: 1, max: 20 },
        placeholder: 'Enter number of family members',
      },
      {
        id: 'q6',
        question: 'What is your annual family income?',
        questionHindi: 'आपकी वार्षिक पारिवारिक आय क्या है?',
        type: 'select',
        required: true,
        options: [
          { value: 'below_15000', label: 'Below ₹15,000', labelHindi: '₹15,000 से कम' },
          { value: '15000_50000', label: '₹15,000 - ₹50,000', labelHindi: '₹15,000 - ₹50,000' },
          { value: '50000_100000', label: '₹50,000 - ₹1,00,000', labelHindi: '₹50,000 - ₹1,00,000' },
          { value: 'above_100000', label: 'Above ₹1,00,000', labelHindi: '₹1,00,000 से अधिक' },
        ],
      },
      {
        id: 'q7',
        question: 'Do you have an Aadhaar card?',
        questionHindi: 'क्या आपके पास आधार कार्ड है?',
        type: 'boolean',
        required: true,
      },
      {
        id: 'q8',
        question: 'What is your Aadhaar number?',
        questionHindi: 'आपका आधार नंबर क्या है?',
        type: 'text',
        required: true,
        dependsOn: { questionId: 'q7', value: true },
        validation: { pattern: /^\d{12}$/, message: 'Aadhaar must be 12 digits' },
        placeholder: '12-digit Aadhaar number',
      },
    ],
  },
  // Additional form templates would be added here
};

export default function ConversationalFormScreen({ route, navigation }) {
  const { formId } = route.params || {};
  const formTemplate = FORM_TEMPLATES[formId] || FORM_TEMPLATES['1'];

  const [messages, setMessages] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [language, setLanguage] = useState('english');
  const [isProgressModalVisible, setIsProgressModalVisible] = useState(false);

  const flatListRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Start the conversation with a greeting
    addAIMessage(
      `Hello! I'll help you fill out the ${formTemplate.name}. I'll ask you a few simple questions. Let's begin!`,
      `नमस्ते! मैं ${formTemplate.nameHindi} भरने में आपकी मदद करूंगा। मैं आपसे कुछ सरल प्रश्न पूछूंगा। आइए शुरू करें!`
    );

    // Ask the first question after a short delay
    setTimeout(() => {
      askQuestion(0);
    }, 1000);
  }, []);

  const addAIMessage = (text, textHindi) => {
    const message = {
      id: Date.now().toString(),
      type: 'ai',
      text,
      textHindi,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, message]);

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const addUserMessage = (text, questionId) => {
    const message = {
      id: Date.now().toString(),
      type: 'user',
      text,
      questionId,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, message]);

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const askQuestion = (index) => {
    const questions = formTemplate.questions;
    
    // Check if we've reached the end
    if (index >= questions.length) {
      completeForm();
      return;
    }

    const question = questions[index];

    // Check if question has dependencies
    if (question.dependsOn) {
      const dependentAnswer = answers[question.dependsOn.questionId];
      if (dependentAnswer !== question.dependsOn.value) {
        // Skip this question, move to next
        setCurrentQuestionIndex(index + 1);
        setTimeout(() => askQuestion(index + 1), 500);
        return;
      }
    }

    const questionText = language === 'hindi' ? question.questionHindi : question.question;
    addAIMessage(questionText, question.questionHindi);
    setCurrentQuestionIndex(index);
  };

  const validateAnswer = (question, answer) => {
    if (question.required && (!answer || answer.trim() === '')) {
      return { valid: false, message: 'This field is required' };
    }

    if (question.type === 'phone' && question.validation?.pattern) {
      if (!question.validation.pattern.test(answer)) {
        return { valid: false, message: question.validation.message || 'Invalid format' };
      }
    }

    if (question.type === 'text' && question.validation?.pattern) {
      if (!question.validation.pattern.test(answer)) {
        return { valid: false, message: question.validation.message || 'Invalid format' };
      }
    }

    if (question.type === 'number') {
      const num = parseInt(answer, 10);
      if (isNaN(num)) {
        return { valid: false, message: 'Please enter a valid number' };
      }
      if (question.validation?.min && num < question.validation.min) {
        return { valid: false, message: `Minimum value is ${question.validation.min}` };
      }
      if (question.validation?.max && num > question.validation.max) {
        return { valid: false, message: `Maximum value is ${question.validation.max}` };
      }
    }

    return { valid: true };
  };

  const handleSubmitAnswer = () => {
    if (inputText.trim() === '') return;

    const currentQuestion = formTemplate.questions[currentQuestionIndex];
    const answer = inputText.trim();

    // Validate answer
    const validation = validateAnswer(currentQuestion, answer);
    if (!validation.valid) {
      Alert.alert('Invalid Input', validation.message);
      return;
    }

    // Add user message
    addUserMessage(answer, currentQuestion.id);

    // Save answer
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answer,
    }));

    // Clear input
    setInputText('');

    // Show processing
    setIsProcessing(true);

    // Move to next question after a brief delay
    setTimeout(() => {
      setIsProcessing(false);
      askQuestion(currentQuestionIndex + 1);
    }, 800);
  };

  const handleSelectOption = (option) => {
    const currentQuestion = formTemplate.questions[currentQuestionIndex];
    const displayValue = language === 'hindi' ? option.labelHindi : option.label;

    // Add user message
    addUserMessage(displayValue, currentQuestion.id);

    // Save answer
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option.value,
    }));

    // Show processing
    setIsProcessing(true);

    // Move to next question
    setTimeout(() => {
      setIsProcessing(false);
      askQuestion(currentQuestionIndex + 1);
    }, 800);
  };

  const handleBooleanAnswer = (value) => {
    const currentQuestion = formTemplate.questions[currentQuestionIndex];
    const displayValue = value ? 'Yes / हाँ' : 'No / नहीं';

    // Add user message
    addUserMessage(displayValue, currentQuestion.id);

    // Save answer
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));

    // Show processing
    setIsProcessing(true);

    // Move to next question
    setTimeout(() => {
      setIsProcessing(false);
      askQuestion(currentQuestionIndex + 1);
    }, 800);
  };

  const completeForm = () => {
    addAIMessage(
      'Great! I have all the information I need. Let me show you a summary of your application.',
      'बहुत बढ़िया! मेरे पास सभी जानकारी है। मैं आपको आपके आवेदन का सारांश दिखाता हूं।'
    );

    setTimeout(() => {
      // Navigate to form preview screen
      // navigation.navigate('FormPreview', { formId, answers });
      Alert.alert(
        'Form Complete',
        'Your form is ready for review!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }, 2000);
  };

  const handleSaveDraft = () => {
    Alert.alert(
      'Save Draft',
      'Your progress will be saved and you can continue later.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: () => {
            // TODO: Save to AsyncStorage or backend
            Alert.alert('Draft Saved', 'You can continue filling this form later.');
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleJumpToQuestion = (questionIndex) => {
    // Allow jumping back to previous questions to review/edit answers
    if (questionIndex < currentQuestionIndex) {
      setCurrentQuestionIndex(questionIndex);
      askQuestion(questionIndex);
    }
  };

  const handleExit = () => {
    Alert.alert(
      'Exit Form',
      'Are you sure you want to exit? Your progress will be lost.',
      [
        { text: 'Stay', style: 'cancel' },
        { text: 'Exit', style: 'destructive', onPress: () => navigation.goBack() },
      ]
    );
  };

  const getCurrentQuestion = () => {
    return formTemplate.questions[currentQuestionIndex];
  };

  const renderMessage = ({ item }) => {
    const isAI = item.type === 'ai';
    const text = language === 'hindi' && item.textHindi ? item.textHindi : item.text;

    return (
      <View style={[styles.messageContainer, isAI ? styles.aiMessageContainer : styles.userMessageContainer]}>
        {isAI && (
          <View style={styles.aiAvatar}>
            <MaterialCommunityIcons name="robot" size={20} color={colors.white} />
          </View>
        )}
        <View style={[styles.messageBubble, isAI ? styles.aiMessageBubble : styles.userMessageBubble]}>
          <Text style={[styles.messageText, isAI ? styles.aiMessageText : styles.userMessageText]}>
            {text}
          </Text>
        </View>
        {!isAI && (
          <View style={styles.userAvatar}>
            <Ionicons name="person" size={20} color={colors.white} />
          </View>
        )}
      </View>
    );
  };

  const renderInputArea = () => {
    const currentQuestion = getCurrentQuestion();
    
    if (!currentQuestion || isProcessing) {
      return (
        <View style={styles.inputContainer}>
          <View style={styles.processingContainer}>
            <MaterialCommunityIcons name="dots-horizontal" size={24} color={colors.textSecondary} />
            <Text style={styles.processingText}>Processing...</Text>
          </View>
        </View>
      );
    }

    // Boolean question (Yes/No)
    if (currentQuestion.type === 'boolean') {
      return (
        <View style={styles.inputContainer}>
          <View style={styles.booleanContainer}>
            <TouchableOpacity
              style={[styles.booleanButton, styles.yesButton]}
              onPress={() => handleBooleanAnswer(true)}
            >
              <Ionicons name="checkmark-circle" size={24} color={colors.white} />
              <Text style={styles.booleanButtonText}>Yes / हाँ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.booleanButton, styles.noButton]}
              onPress={() => handleBooleanAnswer(false)}
            >
              <Ionicons name="close-circle" size={24} color={colors.white} />
              <Text style={styles.booleanButtonText}>No / नहीं</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    // Select question (options)
    if (currentQuestion.type === 'select') {
      return (
        <View style={styles.inputContainer}>
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.optionButton}
                onPress={() => handleSelectOption(option)}
              >
                <Text style={styles.optionButtonText}>
                  {language === 'hindi' ? option.labelHindi : option.label}
                </Text>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }

    // Text input (default)
    return (
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={[styles.textInput, currentQuestion.multiline && styles.textInputMultiline]}
          placeholder={currentQuestion.placeholder || 'Type your answer...'}
          placeholderTextColor={colors.textDisabled}
          value={inputText}
          onChangeText={setInputText}
          multiline={currentQuestion.multiline}
          keyboardType={currentQuestion.type === 'phone' || currentQuestion.type === 'number' ? 'numeric' : 'default'}
          autoFocus
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={handleSubmitAnswer}
          disabled={!inputText.trim()}
        >
          <Ionicons name="send" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>
    );
  };

  const progress = ((currentQuestionIndex + 1) / formTemplate.questions.length) * 100;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleExit} style={styles.headerButton}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {language === 'hindi' ? formTemplate.nameHindi : formTemplate.name}
          </Text>
          <Text style={styles.headerSubtitle}>
            Question {Math.min(currentQuestionIndex + 1, formTemplate.questions.length)} of {formTemplate.questions.length}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => setIsProgressModalVisible(true)} style={styles.headerButton}>
            <MaterialCommunityIcons name="progress-check" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSaveDraft} style={styles.headerButton}>
            <MaterialCommunityIcons name="content-save-outline" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Input Area */}
        {renderInputArea()}
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

      {/* Progress Modal */}
      <FormProgressModal
        visible={isProgressModalVisible}
        onClose={() => setIsProgressModalVisible(false)}
        formName={formTemplate.name}
        formNameHindi={formTemplate.nameHindi}
        questions={formTemplate.questions}
        answers={answers}
        currentQuestionIndex={currentQuestionIndex}
        language={language}
        onJumpToQuestion={handleJumpToQuestion}
      />
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: spacing.sm,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // Progress Bar
  progressBarContainer: {
    height: 4,
    backgroundColor: colors.gray200,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#138808',
  },

  // Content
  content: {
    flex: 1,
  },
  messagesList: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },

  // Messages
  messageContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    alignItems: 'flex-end',
  },
  aiMessageContainer: {
    justifyContent: 'flex-start',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#003D7A',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  messageBubble: {
    maxWidth: '70%',
    borderRadius: 16,
    padding: spacing.md,
  },
  aiMessageBubble: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.gray200,
    borderBottomLeftRadius: 4,
  },
  userMessageBubble: {
    backgroundColor: colors.black,
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    fontFamily: typography.fontFamily.regular,
    lineHeight: 22,
  },
  aiMessageText: {
    color: colors.textPrimary,
  },
  userMessageText: {
    color: colors.white,
  },

  // Input Area
  inputContainer: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    padding: spacing.md,
  },
  textInput: {
    backgroundColor: colors.gray50,
    borderRadius: 24,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 15,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: colors.gray200,
  },
  textInputMultiline: {
    minHeight: 80,
    paddingTop: spacing.md,
    borderRadius: 16,
  },
  sendButton: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.gray300,
  },

  // Processing
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  processingText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },

  // Boolean Options
  booleanContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  booleanButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    borderRadius: 12,
    gap: spacing.sm,
  },
  yesButton: {
    backgroundColor: '#4CAF50',
  },
  noButton: {
    backgroundColor: '#F44336',
  },
  booleanButtonText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
  },

  // Select Options
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
    padding: spacing.lg,
  },
  optionButtonText: {
    flex: 1,
    fontSize: 15,
    fontFamily: typography.fontFamily.medium,
    color: colors.textPrimary,
  },

  // Language Toggle
  languageToggle: {
    position: 'absolute',
    bottom: spacing.xxl,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.black,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    gap: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  languageToggleText: {
    fontSize: 13,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.white,
  },
});
