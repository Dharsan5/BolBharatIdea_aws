import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';
import * as Speech from 'expo-speech';
import theme from '../theme';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n/translations';
import AnimatedBlob from '../components/AnimatedBlob';
import { saveConversation } from '../api/database';

// 👇 Paste your Lambda Function URL here
const LAMBDA_URL = 'https://ci45mlntxomy3rta7a2rb6qidu0wusvg.lambda-url.eu-north-1.on.aws/';

// Map app language codes to BCP-47 locale codes for speech recognition
const getRecognitionLang = (language) => {
  switch (language) {
    case 'hi': return 'hi-IN';
    case 'ta': return 'ta-IN';
    case 'te': return 'te-IN';
    case 'hinglish': return 'hi-IN'; // Use Hindi recognizer for Hinglish
    default: return 'en-IN';
  }
};

// Map app language codes to TTS language codes
const getTTSLang = (language) => {
  switch (language) {
    case 'hi': return 'hi-IN';
    case 'ta': return 'ta-IN';
    case 'te': return 'te-IN';
    case 'hinglish': return 'hi-IN';
    default: return 'en-IN';
  }
};

export default function VoiceRecorderScreen({ navigation }) {
  const { currentLanguage } = useLanguage();
  const language = currentLanguage.id;
  const t = (key) => translations[language]?.[key] || translations['en'][key] || key;
  
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [amplitude, setAmplitude] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [error, setError] = useState('');

  const buttonScale = useRef(new Animated.Value(1)).current;

  // --- Speech Recognition Event Handlers ---
  useSpeechRecognitionEvent('start', () => {
    setIsListening(true);
  });

  useSpeechRecognitionEvent('end', () => {
    setIsListening(false);
    setAmplitude(0);
  });

  useSpeechRecognitionEvent('result', (event) => {
    const text = event.results[0]?.transcript || '';
    setTranscript(text);

    // If this is a final result, send to AI
    if (event.isFinal && text.trim().length > 0) {
      handleAICall(text);
    }
  });

  useSpeechRecognitionEvent('error', (event) => {
    console.log('Speech recognition error:', event.error, event.message);
    setIsListening(false);
    setAmplitude(0);

    if (event.error === 'no-speech') {
      setError(t('noSpeechDetected') || 'No speech detected. Please try again.');
    } else if (event.error === 'not-allowed') {
      setError('Microphone permission is required. Please enable it in Settings.');
    } else if (event.error === 'network') {
      setError('Network error. Please check your connection.');
    } else {
      setError(`Error: ${event.message || event.error}`);
    }
  });

  useSpeechRecognitionEvent('volumechange', (event) => {
    // event.value is between -2 and 10, normalize to 0-1
    const normalized = Math.max(0, Math.min(1, (event.value + 2) / 12));
    setAmplitude(normalized);
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      ExpoSpeechRecognitionModule.abort();
      Speech.stop();
    };
  }, []);

  // 🔥 Real AI call to Lambda
  const getAIResponse = async (userMessage) => {
    try {
      const res = await fetch(LAMBDA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: userMessage,
          language: language,
        }),
      });
      const data = await res.json();
      if (data.success) {
        return data.response;
      } else {
        return 'Sorry, could not get a response. Please try again.';
      }
    } catch (err) {
      console.error('Lambda error:', err);
      return 'Network error. Please check your connection and try again.';
    }
  };

  const handleAICall = async (userText) => {
    setIsLoading(true);
    const response = await getAIResponse(userText);
    setAiResponse(response);
    setIsLoading(false);

    // Save conversation to database
    saveConversation('guest_user', userText, response, language).catch((err) =>
      console.warn('Failed to save conversation:', err)
    );
  };

  const startRecording = async () => {
    setTranscript('');
    setAiResponse('');
    setError('');

    // Stop any ongoing TTS
    Speech.stop();
    setIsSpeaking(false);

    // Request permissions
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!result.granted) {
      setError('Microphone permission is required. Please enable it in Settings.');
      return;
    }

    // Animate button
    Animated.sequence([
      Animated.spring(buttonScale, { toValue: 0.9, useNativeDriver: true }),
      Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }),
    ]).start();

    // Start speech recognition
    ExpoSpeechRecognitionModule.start({
      lang: getRecognitionLang(language),
      interimResults: true,
      continuous: false,
      addsPunctuation: true,
      volumeChangeEventOptions: {
        enabled: true,
        intervalMillis: 200,
      },
    });
  };

  const stopRecording = () => {
    ExpoSpeechRecognitionModule.stop();
  };

  const handleMicPress = () => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleListenResponse = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      return;
    }

    if (aiResponse) {
      setIsSpeaking(true);
      Speech.speak(aiResponse, {
        language: getTTSLang(language),
        rate: 0.9,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }
  };

  const handleClear = () => {
    setTranscript('');
    setAiResponse('');
    setAmplitude(0);
    setError('');
    Speech.stop();
    setIsSpeaking(false);
    ExpoSpeechRecognitionModule.abort();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('voiceAssistant')}</Text>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="help-circle-outline" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Status */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            {isListening
              ? t('listening')
              : isLoading
              ? t('processing')
              : transcript
              ? t('processing')
              : t('tapToSpeak')}
          </Text>
        </View>

        {/* Animated Blob */}
        <View style={styles.blobContainer}>
          <AnimatedBlob isListening={isListening} amplitude={amplitude} />
        </View>

        {/* Interaction Area */}
        <View style={styles.interactionArea}>
          {transcript !== '' && (
            <View style={styles.messageBubble}>
              <Text style={styles.messageLabel}>{t('youSaid')}</Text>
              <Text style={styles.messageText}>{transcript}</Text>
            </View>
          )}

          {/* Loading indicator while waiting for AI */}
          {isLoading && (
            <View style={[styles.messageBubble, styles.aiBubble]}>
              <View style={styles.aiHeader}>
                <MaterialCommunityIcons name="robot" size={16} color={theme.colors.primary} />
                <Text style={styles.aiLabel}>BolBharat {t('assistant')}</Text>
              </View>
              <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginTop: 8 }} />
              <Text style={[styles.messageText, { color: theme.colors.textSecondary, marginTop: 4 }]}>
                Thinking...
              </Text>
            </View>
          )}

          {aiResponse !== '' && !isLoading && (
            <View style={[styles.messageBubble, styles.aiBubble]}>
              <View style={styles.aiHeader}>
                <MaterialCommunityIcons name="robot" size={16} color={theme.colors.primary} />
                <Text style={styles.aiLabel}>BolBharat {t('assistant')}</Text>
              </View>
              <Text style={styles.messageText}>{aiResponse}</Text>
              <TouchableOpacity style={styles.listenButton} onPress={handleListenResponse}>
                <Ionicons name={isSpeaking ? "stop-circle" : "volume-high"} size={18} color={theme.colors.white} />
                <Text style={styles.listenText}>{isSpeaking ? 'Stop' : 'Listen'}</Text>
              </TouchableOpacity>
            </View>
          )}

          {error !== '' && (
            <View style={[styles.messageBubble, styles.errorBubble]}>
              <Ionicons name="warning" size={16} color="#e53935" />
              <Text style={[styles.messageText, { color: '#e53935', marginLeft: 8 }]}>{error}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Controls */}
      <View style={styles.footer}>
        <View style={styles.controls}>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleClear}>
            <Ionicons name="trash-outline" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[styles.micButton, isListening && styles.micButtonActive]}
              onPress={handleMicPress}
              disabled={isLoading}
            >
              <Ionicons name={isListening ? "stop" : "mic"} size={32} color={theme.colors.white} />
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity style={styles.secondaryButton} onPress={() => {}}>
            <Ionicons name="keypad-outline" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.controlLabel}>
          {isLoading ? 'Getting AI response...' : isListening ? t('tapToStop') : t('tapToStart')}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
  scrollContent: {
    flexGrow: 1,
  },
  statusContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  statusText: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
  blobContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  interactionArea: {
    padding: theme.spacing.lg,
  },
  messageBubble: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  aiBubble: {
    backgroundColor: theme.colors.primary + '10',
    borderColor: theme.colors.primary + '30',
  },
  errorBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    borderColor: '#e53935' + '30',
  },
  messageLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  aiLabel: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  messageText: {
    ...theme.typography.body1,
    color: theme.colors.textPrimary,
  },
  listenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.black,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: theme.spacing.md,
  },
  listenText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  footer: {
    paddingBottom: theme.spacing.xl,
    alignItems: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xxl,
  },
  micButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  micButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  secondaryButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  controlLabel: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
});