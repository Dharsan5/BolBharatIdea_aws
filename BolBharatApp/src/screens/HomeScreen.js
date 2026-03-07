import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { useLanguage } from '../i18n/LanguageContext';
import AnimatedBlob from '../components/AnimatedBlob';
import { getUser, getConversations, getApplications, saveConversation } from '../api/database';

const USER_ID = 'user123'; // Replace with real user ID later
const LAMBDA_URL = 'https://ci45mlntxomy3rta7a2rb6qidu0wusvg.lambda-url.eu-north-1.on.aws/'; // 👈 paste your bolbharat-ai-handler URL

export default function HomeScreen({ navigation }) {
  const { t, language } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [amplitude, setAmplitude] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  // Database state
  const [userName, setUserName] = useState('');
  const [recentConversations, setRecentConversations] = useState([]);
  const [applicationsCount, setApplicationsCount] = useState(0);

  const amplitudeInterval = useRef(null);
  const micButtonScale = useRef(new Animated.Value(1)).current;

  // 🔥 Load user data from DynamoDB on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [userResult, convsResult, appsResult] = await Promise.all([
          getUser(USER_ID),
          getConversations(USER_ID),
          getApplications(USER_ID),
        ]);
        if (userResult.success && userResult.user) setUserName(userResult.user.name || '');
        if (convsResult.success) setRecentConversations((convsResult.conversations || []).slice(0, 3));
        if (appsResult.success) setApplicationsCount((appsResult.applications || []).length);
      } catch (err) {
        console.error('HomeScreen load error:', err);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    return () => {
      if (amplitudeInterval.current) clearInterval(amplitudeInterval.current);
    };
  }, []);

  const getSimulatedTranscript = () => {
    switch (language) {
      case 'hi': return 'नमस्ते, मुझे फसल बीमा योजना के बारे में जानकारी चाहिए।';
      case 'ta': return 'வணக்கம், எனக்கு பயிர் காப்பீட்டுத் திட்டம் பற்றிய தகவல் தேவை.';
      case 'te': return 'నమస్తే, నాకు పంట భీమా పథకం గురించి సమాచారం కావాలి.';
      case 'hinglish': return 'Hello, mujhe crop insurance scheme ke baare mein bataiye.';
      default: return 'Hello, I need information about the crop insurance scheme.';
    }
  };

  // 🔥 Real AI call to Lambda
  const getAIResponse = async (userMessage) => {
    try {
      const res = await fetch(LAMBDA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage, language }),
      });
      const data = await res.json();
      return data.success ? data.response : 'Sorry, could not get a response. Please try again.';
    } catch (err) {
      return 'Network error. Please check your connection.';
    }
  };

  const startListening = () => {
    setIsListening(true);
    setTranscript('');
    setAiResponse('');

    amplitudeInterval.current = setInterval(() => {
      setAmplitude(Math.random() * 0.8 + 0.2);
    }, 100);

    Animated.sequence([
      Animated.spring(micButtonScale, { toValue: 0.9, useNativeDriver: true }),
      Animated.spring(micButtonScale, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  const stopListening = async () => {
    setIsListening(false);
    setAmplitude(0);
    if (amplitudeInterval.current) clearInterval(amplitudeInterval.current);

    const userText = getSimulatedTranscript();
    setTranscript(userText);

    // 🔥 Get real AI response
    setIsLoading(true);
    const response = await getAIResponse(userText);
    setAiResponse(response);
    setIsLoading(false);

    // 🔥 Save to DynamoDB + refresh conversations
    await saveConversation(USER_ID, userText, response, language);
    const convsResult = await getConversations(USER_ID);
    if (convsResult.success) setRecentConversations((convsResult.conversations || []).slice(0, 3));
  };

  const handleMicPress = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleClear = () => {
    setTranscript('');
    setAiResponse('');
    setAmplitude(0);
    if (isListening) {
      setIsListening(false);
      clearInterval(amplitudeInterval.current);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header — original design */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
        </TouchableOpacity>

        <View style={styles.betaBadge}>
          <Text style={styles.betaText}>BolBharat</Text>
          <View style={styles.betaTag}>
            <Text style={styles.betaTagText}>BETA</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('VoiceRecorder')}>
            <Ionicons name="mic-outline" size={20} color={theme.colors.black} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Feather name="edit-2" size={18} color={theme.colors.black} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Greeting with user name from DB */}
        {userName !== '' && (
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>नमस्ते, {userName} 👋</Text>
          </View>
        )}

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="file-document-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.statNumber}>{applicationsCount}</Text>
            <Text style={styles.statLabel}>Applications</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="chat-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.statNumber}>{recentConversations.length}</Text>
            <Text style={styles.statLabel}>Conversations</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="translate" size={20} color={theme.colors.primary} />
            <Text style={styles.statNumber}>{language.toUpperCase()}</Text>
            <Text style={styles.statLabel}>Language</Text>
          </View>
        </View>

        {/* Status — original */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            {isListening ? t('listening') : isLoading ? 'Thinking...' : transcript ? t('response') : t('readyToHelp')}
          </Text>
        </View>

        {/* Large Blob — original */}
        <View style={styles.blobContainer}>
          <AnimatedBlob isListening={isListening} amplitude={amplitude} />
        </View>

        {/* Transcript / Poetic text — original layout */}
        {transcript ? (
          <View style={styles.transcriptContainer}>
            <Text style={styles.transcriptLabel}>You said:</Text>
            <Text style={styles.transcriptText}>{transcript}</Text>
          </View>
        ) : (
          <View style={styles.poeticTextContainer}>
            <Text style={styles.poeticText}>{t('voiceForNation')}</Text>
          </View>
        )}

        {/* Loading spinner */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={styles.loadingText}>BolBharat is thinking...</Text>
          </View>
        )}

        {/* AI Response */}
        {aiResponse !== '' && !isLoading && (
          <View style={styles.aiResponseContainer}>
            <View style={styles.aiHeader}>
              <MaterialCommunityIcons name="robot" size={16} color={theme.colors.primary} />
              <Text style={styles.aiLabel}>BolBharat</Text>
            </View>
            <Text style={styles.aiResponseText}>{aiResponse}</Text>
            <TouchableOpacity style={styles.listenButton}>
              <Ionicons name="volume-high" size={16} color={theme.colors.white} />
              <Text style={styles.listenText}>Listen</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Recent Conversations from DB */}
        {recentConversations.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.recentTitle}>Recent Conversations</Text>
            {recentConversations.map((conv, index) => (
              <View key={index} style={styles.convCard}>
                <View style={styles.convQuestion}>
                  <Ionicons name="person-circle-outline" size={16} color={theme.colors.textSecondary} />
                  <Text style={styles.convQuestionText} numberOfLines={1}>{conv.question}</Text>
                </View>
                <Text style={styles.convResponse} numberOfLines={2}>{conv.aiResponse}</Text>
                <Text style={styles.convTime}>{new Date(conv.timestamp).toLocaleDateString()}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Action Cards — original design */}
        <View style={styles.cardsContainer}>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Schemes')}>
            <View style={styles.cardIconContainer}>
              <Ionicons name="musical-notes" size={24} color={theme.colors.black} />
            </View>
            <View style={styles.cardArrow}>
              <Feather name="arrow-up-right" size={20} color={theme.colors.textSecondary} />
            </View>
            <Text style={styles.actionCardTitle}>{t('yourVoiceClips')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Forms')}>
            <View style={styles.cardIconContainer}>
              <MaterialIcons name="mic-none" size={24} color={theme.colors.black} />
            </View>
            <View style={styles.cardArrow}>
              <Feather name="arrow-up-right" size={20} color={theme.colors.textSecondary} />
            </View>
            <Text style={styles.actionCardTitle}>{t('rapidSpeechCapture')}</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Bottom Action Bar — original design */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomButton} onPress={handleClear}>
          <Ionicons name="refresh" size={24} color={theme.colors.black} />
        </TouchableOpacity>

        <Animated.View style={{ transform: [{ scale: micButtonScale }] }}>
          <TouchableOpacity
            style={[styles.micButton, isListening && styles.micButtonActive]}
            onPress={handleMicPress}
            disabled={isLoading}
          >
            <View style={styles.micButtonInner}>
              <Ionicons name={isListening ? 'stop' : 'mic'} size={32} color={theme.colors.white} />
            </View>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity style={styles.bottomButton} onPress={handleClear}>
          <Ionicons name="trash-outline" size={24} color={theme.colors.black} />
        </TouchableOpacity>
      </View>

      {/* Home Indicator — original */}
      <View style={styles.homeIndicator} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { paddingBottom: 140 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md,
  },
  menuButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  menuLine: { width: 20, height: 2, backgroundColor: theme.colors.black, marginVertical: 2 },
  betaBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.black,
    paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, borderRadius: theme.borderRadius.full,
  },
  betaText: { ...theme.typography.body2, fontFamily: theme.fontFamilies.semiBold, color: theme.colors.white, marginRight: theme.spacing.xs },
  betaTag: { backgroundColor: theme.colors.white, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  betaTagText: { fontFamily: theme.fontFamilies.bold, fontSize: 10, color: theme.colors.black },
  headerActions: { flexDirection: 'row', gap: theme.spacing.sm },
  headerIcon: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: theme.colors.surface,
    borderWidth: 1, borderColor: theme.colors.border, justifyContent: 'center', alignItems: 'center',
  },
  greetingContainer: { paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.sm },
  greetingText: { ...theme.typography.h3, color: theme.colors.textPrimary },
  statsRow: {
    flexDirection: 'row', paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm, marginTop: theme.spacing.md,
  },
  statCard: {
    flex: 1, backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md, alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border,
  },
  statNumber: { ...theme.typography.h3, color: theme.colors.textPrimary, marginTop: 4 },
  statLabel: { ...theme.typography.caption, color: theme.colors.textSecondary, marginTop: 2 },
  statusContainer: { alignItems: 'center', paddingVertical: theme.spacing.md },
  statusText: { ...theme.typography.body1, fontFamily: theme.fontFamilies.light, color: theme.colors.textSecondary },
  blobContainer: { height: 200, justifyContent: 'center', alignItems: 'center', paddingVertical: theme.spacing.lg },
  transcriptContainer: {
    marginHorizontal: theme.spacing.xl, paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg, backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg, borderWidth: 1, borderColor: theme.colors.border,
  },
  transcriptLabel: { ...theme.typography.caption, color: theme.colors.textSecondary, marginBottom: 4 },
  transcriptText: {
    ...theme.typography.body1, fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textPrimary, textAlign: 'center', lineHeight: 24,
  },
  poeticTextContainer: { paddingHorizontal: theme.spacing.xl, paddingVertical: theme.spacing.lg, alignItems: 'center' },
  poeticText: {
    ...theme.typography.body1, fontFamily: theme.fontFamilies.light,
    color: theme.colors.textPrimary, textAlign: 'center', lineHeight: 24,
  },
  loadingContainer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    padding: theme.spacing.md, gap: theme.spacing.sm,
  },
  loadingText: { ...theme.typography.body2, color: theme.colors.textSecondary },
  aiResponseContainer: {
    marginHorizontal: theme.spacing.lg, padding: theme.spacing.md,
    backgroundColor: theme.colors.primary + '10', borderRadius: theme.borderRadius.lg,
    borderWidth: 1, borderColor: theme.colors.primary + '30', marginTop: theme.spacing.md,
  },
  aiHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 4 },
  aiLabel: { ...theme.typography.caption, color: theme.colors.primary, fontWeight: 'bold' },
  aiResponseText: { ...theme.typography.body1, color: theme.colors.textPrimary },
  listenButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.black,
    paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20,
    alignSelf: 'flex-start', marginTop: theme.spacing.sm, gap: 4,
  },
  listenText: { color: theme.colors.white, fontSize: 12, fontWeight: 'bold' },
  recentSection: { paddingHorizontal: theme.spacing.lg, marginTop: theme.spacing.lg },
  recentTitle: { ...theme.typography.h4, color: theme.colors.textPrimary, marginBottom: theme.spacing.sm },
  convCard: {
    backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md, marginBottom: theme.spacing.sm,
    borderWidth: 1, borderColor: theme.colors.border,
  },
  convQuestion: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  convQuestionText: { ...theme.typography.caption, color: theme.colors.textSecondary, flex: 1 },
  convResponse: { ...theme.typography.body2, color: theme.colors.textPrimary, marginBottom: 4 },
  convTime: { ...theme.typography.caption, color: theme.colors.textSecondary },
  cardsContainer: {
    flexDirection: 'row', paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md, marginTop: theme.spacing.lg, marginBottom: theme.spacing.lg,
  },
  actionCard: {
    flex: 1, backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg, borderWidth: 1, borderColor: theme.colors.border, minHeight: 120,
  },
  cardIconContainer: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.white,
    borderWidth: 1, borderColor: theme.colors.border, justifyContent: 'center', alignItems: 'center', marginBottom: theme.spacing.sm,
  },
  cardArrow: { position: 'absolute', top: theme.spacing.lg, right: theme.spacing.lg },
  actionCardTitle: { ...theme.typography.body2, fontFamily: theme.fontFamilies.semiBold, color: theme.colors.textPrimary, marginTop: theme.spacing.sm },
  bottomBar: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    paddingHorizontal: theme.spacing.xl, paddingVertical: theme.spacing.lg,
  },
  bottomButton: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: theme.colors.surface,
    borderWidth: 1, borderColor: theme.colors.border, justifyContent: 'center', alignItems: 'center',
  },
  micButton: {
    width: 70, height: 70, borderRadius: 35, backgroundColor: theme.colors.black,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: theme.colors.black, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 8,
  },
  micButtonActive: { backgroundColor: theme.colors.gray700 },
  micButtonInner: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: theme.colors.black,
    borderWidth: 2, borderColor: theme.colors.gray300, justifyContent: 'center', alignItems: 'center',
  },
  homeIndicator: {
    width: 134, height: 5, backgroundColor: theme.colors.black,
    borderRadius: 3, alignSelf: 'center', marginBottom: theme.spacing.sm,
  },
});