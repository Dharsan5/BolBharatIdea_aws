import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import theme from '../theme';
import AnimatedBlob from '../components/AnimatedBlob';
import OfflineBanner from '../components/OfflineBanner';

export default function HomeScreen({ navigation }) {
  const [isListening, setIsListening] = useState(false);
  const [amplitude, setAmplitude] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [pendingSync, setPendingSync] = useState(0); // For demo: number of items pending sync
  
  const amplitudeInterval = useRef(null);
  const micButtonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    return () => {
      if (amplitudeInterval.current) {
        clearInterval(amplitudeInterval.current);
      }
    };
  }, []);

  const startListening = () => {
    setIsListening(true);
    setTranscript('');
    
    // Simulate audio amplitude changes
    amplitudeInterval.current = setInterval(() => {
      const randomAmplitude = Math.random() * 0.8 + 0.2;
      setAmplitude(randomAmplitude);
    }, 100);

    // Button press animation
    Animated.sequence([
      Animated.spring(micButtonScale, {
        toValue: 0.9,
        useNativeDriver: true,
      }),
      Animated.spring(micButtonScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();

    // Simulate response after 3 seconds
    setTimeout(() => {
      stopListening();
      setTranscript('नमस्ते! मैं आपकी कैसे मदद कर सकता हूं?\n\nHello! How can I assist you today?');
    }, 3000);
  };

  const stopListening = () => {
    setIsListening(false);
    setAmplitude(0);
    
    if (amplitudeInterval.current) {
      clearInterval(amplitudeInterval.current);
    }
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
    setAmplitude(0);
    stopListening();
  };

  const handleSync = () => {
    // TODO: Implement actual sync logic
    Alert.alert(
      'Syncing',
      'Syncing pending items with server...',
      [{ text: 'OK', onPress: () => setPendingSync(0) }]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Offline Banner - shows when no connection or in offline mode */}
      <OfflineBanner 
        onSync={handleSync}
        pendingItems={pendingSync}
        offlineMode={false} // Set to true to test offline mode when connected
      />
      
      {/* Header */}
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
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="mic-outline" size={20} color={theme.colors.black} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Feather name="edit-2" size={18} color={theme.colors.black} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Status */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          {isListening ? 'Listening...' : transcript ? 'Response' : 'Ready to help'}
        </Text>
      </View>

      {/* Large Blob */}
      <View style={styles.blobContainer}>
        <AnimatedBlob isListening={isListening} amplitude={amplitude} />
      </View>

      {/* Transcript or Poetic Text */}
      {transcript ? (
        <View style={styles.transcriptContainer}>
          <Text style={styles.transcriptText}>{transcript}</Text>
        </View>
      ) : (
        <View style={styles.poeticTextContainer}>
          <Text style={styles.poeticText}>
            Voice for the nation,{'\n'}
            bridging the digital divide{'\n'}
            one conversation at a time.
          </Text>
        </View>
      )}

      {/* Action Cards */}
      <View style={styles.cardsContainer}>
        <TouchableOpacity style={styles.actionCard}>
          <View style={styles.cardIconContainer}>
            <Ionicons name="musical-notes" size={24} color={theme.colors.black} />
          </View>
          <View style={styles.cardArrow}>
            <Feather name="arrow-up-right" size={20} color={theme.colors.textSecondary} />
          </View>
          <Text style={styles.actionCardTitle}>Your Voice{'\n'}Clips</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <View style={styles.cardIconContainer}>
            <MaterialIcons name="mic-none" size={24} color={theme.colors.black} />
          </View>
          <View style={styles.cardArrow}>
            <Feather name="arrow-up-right" size={20} color={theme.colors.textSecondary} />
          </View>
          <Text style={styles.actionCardTitle}>Rapid Speech{'\n'}Capture</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.bottomButton}
          onPress={startListening}
          disabled={isListening}
        >
          <Ionicons name="refresh" size={24} color={theme.colors.black} />
        </TouchableOpacity>

        <Animated.View style={{ transform: [{ scale: micButtonScale }] }}>
          <TouchableOpacity 
            style={[styles.micButton, isListening && styles.micButtonActive]}
            onPress={handleMicPress}
          >
            <View style={styles.micButtonInner}>
              <Ionicons 
                name={isListening ? "stop" : "mic"} 
                size={32} 
                color={theme.colors.white} 
              />
            </View>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity 
          style={styles.bottomButton}
          onPress={handleClear}
        >
          <Ionicons name="trash-outline" size={24} color={theme.colors.black} />
        </TouchableOpacity>
      </View>

      {/* Home Indicator */}
      <View style={styles.homeIndicator} />
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
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLine: {
    width: 20,
    height: 2,
    backgroundColor: theme.colors.black,
    marginVertical: 2,
  },
  betaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.black,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },
  betaText: {
    ...theme.typography.body2,
    fontFamily: theme.fontFamilies.semiBold,
    color: theme.colors.white,
    marginRight: theme.spacing.xs,
  },
  betaTag: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  betaTagText: {
    fontFamily: theme.fontFamilies.bold,
    fontSize: 10,
    color: theme.colors.black,
  },
  headerActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  statusText: {
    ...theme.typography.body1,
    fontFamily: theme.fontFamilies.light,
    color: theme.colors.textSecondary,
  },
  blobContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  transcriptContainer: {
    marginHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  transcriptText: {
    ...theme.typography.body1,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    lineHeight: 24,
  },
  poeticTextContainer: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  poeticText: {
    ...theme.typography.body1,
    fontFamily: theme.fontFamilies.light,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    lineHeight: 24,
  },
  cardsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  actionCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: 120,
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  cardArrow: {
    position: 'absolute',
    top: theme.spacing.lg,
    right: theme.spacing.lg,
  },
  actionCardTitle: {
    ...theme.typography.body2,
    fontFamily: theme.fontFamilies.semiBold,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.sm,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
  },
  bottomButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
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
  micButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.black,
    borderWidth: 2,
    borderColor: theme.colors.gray300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: theme.colors.black,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: theme.spacing.sm,
  },
});
