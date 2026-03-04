import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { Audio } from 'expo-av'; // Commented out - requires native build
import { theme } from '../theme';
import AnimatedBlob from '../components/AnimatedBlob';

export default function VoiceRecorderScreen({ navigation }) {
  const [recording, setRecording] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [amplitude, setAmplitude] = useState(0);
  const [transcript, setTranscript] = useState('');

  const buttonScale = useRef(new Animated.Value(1)).current;
  const amplitudeInterval = useRef(null);

  useEffect(() => {
    return () => {
      if (amplitudeInterval.current) {
        clearInterval(amplitudeInterval.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      // Simulate recording with animated amplitude
      setIsListening(true);
      
      // Simulate audio amplitude changes
      amplitudeInterval.current = setInterval(() => {
        // Generate random amplitude between 0 and 1
        const randomAmplitude = Math.random() * 0.8 + 0.2;
        setAmplitude(randomAmplitude);
      }, 100);

      // Button press animation
      Animated.sequence([
        Animated.spring(buttonScale, {
          toValue: 0.9,
          useNativeDriver: true,
        }),
        Animated.spring(buttonScale, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();

      // Simulate transcription after 3 seconds
      setTimeout(() => {
        setTranscript('Recording started! Native audio will work after building the app.');
      }, 1500);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    setIsListening(false);
    setAmplitude(0);
    
    if (amplitudeInterval.current) {
      clearInterval(amplitudeInterval.current);
    }

    // Simulate transcription
    setTranscript('यह एक उदाहरण है। Build the app with "expo run:android" to enable real audio recording.');
  };

  const handleMicPress = () => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleClear = () => {
    setTranscript('');
    setAmplitude(0);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Voice Assistant</Text>
          <Text style={styles.headerSubtitle}>आवाज़ सहायक</Text>
        </View>
        <View style={styles.backButton} />
      </View>

      {/* Status */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          {isListening ? 'Listening...' : 'Tap to speak'}
        </Text>
        <Text style={styles.statusSubtext}>
          {isListening ? 'सुन रहे हैं...' : 'बोलने के लिए टैप करें'}
        </Text>
      </View>

      {/* Animated Blob */}
      <View style={styles.blobContainer}>
        <AnimatedBlob isListening={isListening} amplitude={amplitude} />
      </View>

      {/* Transcript */}
      {transcript !== '' && (
        <View style={styles.transcriptContainer}>
          <Text style={styles.transcriptLabel}>Transcript:</Text>
          <Text style={styles.transcriptText}>{transcript}</Text>
        </View>
      )}

      {/* Controls */}
      <View style={styles.controls}>
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            style={[styles.micButton, isListening && styles.micButtonActive]}
            onPress={handleMicPress}
          >
            <Text style={styles.micIcon}>🎤</Text>
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.controlLabel}>
          {isListening ? 'Tap to stop' : 'Tap to start'}
        </Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton} onPress={startRecording}>
          <Text style={styles.actionIcon}>🔄</Text>
          <Text style={styles.actionText}>Retry</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleClear}>
          <Text style={styles.actionIcon}>🗑️</Text>
          <Text style={styles.actionText}>Clear</Text>
        </TouchableOpacity>
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
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: theme.colors.textPrimary,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
  headerSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  statusContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  statusText: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
  statusSubtext: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  blobContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  transcriptContainer: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  transcriptLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  transcriptText: {
    ...theme.typography.body1,
    color: theme.colors.textPrimary,
  },
  controls: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  micButtonActive: {
    backgroundColor: theme.colors.gray700,
  },
  micIcon: {
    fontSize: 36,
  },
  controlLabel: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.lg,
  },
  actionButton: {
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: theme.spacing.xs,
  },
  actionText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
});
