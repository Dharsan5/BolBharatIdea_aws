import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Processing stages for the OCR pipeline
const PROCESSING_STAGES = [
  {
    id: 1,
    icon: 'scan',
    label: 'Scanning Document',
    labelHindi: 'दस्तावेज़ स्कैन कर रहे हैं',
    duration: 2000,
  },
  {
    id: 2,
    icon: 'text',
    label: 'Extracting Text',
    labelHindi: 'टेक्स्ट निकाल रहे हैं',
    duration: 2500,
  },
  {
    id: 3,
    icon: 'brain',
    label: 'Analyzing Content',
    labelHindi: 'सामग्री का विश्लेषण कर रहे हैं',
    duration: 2000,
  },
  {
    id: 4,
    icon: 'clipboard-text',
    label: 'Simplifying Language',
    labelHindi: 'भाषा को सरल बना रहे हैं',
    duration: 1500,
  },
];

export default function OCRProcessingScreen({ navigation, route }) {
  const { imageUri, documentType } = route.params || {};
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  
  // Animation values
  const scanLinePosition = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const stageOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start scan line animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLinePosition, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLinePosition, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse animation for active stage icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    // Progress through stages
    let totalDuration = 0;
    PROCESSING_STAGES.forEach((stage, index) => {
      const stageDuration = stage.duration;
      totalDuration += stageDuration;

      setTimeout(() => {
        // Fade out current stage
        Animated.timing(stageOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setCurrentStage(index);
          // Fade in next stage
          Animated.timing(stageOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
        });

        setProgress((index + 1) / PROCESSING_STAGES.length);
      }, totalDuration - stageDuration);
    });

    // Navigate to simplified document screen after processing
    const totalTime = PROCESSING_STAGES.reduce((sum, stage) => sum + stage.duration, 0);
    setTimeout(() => {
      // In production, this would pass the actual OCR results
      navigation.replace('SimplifiedDocument', {
        documentImage: imageUri,
        documentType: documentType || 'Government Form',
      });
    }, totalTime + 500);
  }, []);

  const currentStageData = PROCESSING_STAGES[currentStage] || PROCESSING_STAGES[0];

  const scanLineTranslateY = scanLinePosition.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300],
  });

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Processing Document</Text>
            <Text style={styles.headerSubtitle}>दस्तावेज़ प्रोसेस हो रहा है</Text>
          </View>
        </View>

        {/* Document Preview with Scan Effect */}
        <View style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.documentImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <MaterialCommunityIcons
                  name="file-document-outline"
                  size={80}
                  color={theme.colors.gray400}
                />
              </View>
            )}
            
            {/* Scanning overlay effect */}
            <View style={styles.scanOverlay}>
              <Animated.View
                style={[
                  styles.scanLine,
                  {
                    transform: [{ translateY: scanLineTranslateY }],
                  },
                ]}
              />
            </View>

            {/* Corner brackets */}
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: `${progress * 100}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round(progress * 100)}%
          </Text>
        </View>

        {/* Current Stage */}
        <Animated.View
          style={[
            styles.stageContainer,
            { opacity: stageOpacity },
          ]}
        >
          <Animated.View
            style={[
              styles.stageIconContainer,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <MaterialCommunityIcons
              name={currentStageData.icon}
              size={36}
              color={theme.colors.primary}
            />
          </Animated.View>
          <Text style={styles.stageLabel}>{currentStageData.label}</Text>
          <Text style={styles.stageLabelHindi}>{currentStageData.labelHindi}</Text>
        </Animated.View>

        {/* Processing Steps List */}
        <View style={styles.stepsList}>
          {PROCESSING_STAGES.map((stage, index) => {
            const isCompleted = index < currentStage;
            const isCurrent = index === currentStage;
            const isPending = index > currentStage;

            return (
              <View key={stage.id} style={styles.stepItem}>
                <View
                  style={[
                    styles.stepIndicator,
                    isCompleted && styles.stepIndicatorCompleted,
                    isCurrent && styles.stepIndicatorCurrent,
                  ]}
                >
                  {isCompleted ? (
                    <Ionicons name="checkmark" size={16} color={theme.colors.white} />
                  ) : isCurrent ? (
                    <ActivityIndicator size="small" color={theme.colors.white} />
                  ) : (
                    <View style={styles.stepIndicatorEmpty} />
                  )}
                </View>
                
                <View style={styles.stepContent}>
                  <Text
                    style={[
                      styles.stepLabel,
                      isCompleted && styles.stepLabelCompleted,
                      isCurrent && styles.stepLabelCurrent,
                      isPending && styles.stepLabelPending,
                    ]}
                  >
                    {stage.label}
                  </Text>
                  <Text
                    style={[
                      styles.stepLabelHindi,
                      isPending && styles.stepLabelPending,
                    ]}
                  >
                    {stage.labelHindi}
                  </Text>
                </View>

                {isCompleted && (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={theme.colors.success}
                  />
                )}
              </View>
            );
          })}
        </View>

        {/* Info Message */}
        <View style={styles.infoContainer}>
          <Ionicons name="information-circle" size={20} color={theme.colors.info} />
          <Text style={styles.infoText}>
            This may take a few moments depending on document complexity
          </Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  imageWrapper: {
    width: SCREEN_WIDTH - theme.spacing.lg * 2,
    height: 300,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: theme.colors.gray100,
    ...theme.elevation.medium,
  },
  documentImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.gray100,
  },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
  },
  scanLine: {
    width: '100%',
    height: 3,
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  cornerTopLeft: {
    position: 'absolute',
    top: theme.spacing.md,
    left: theme.spacing.md,
    width: 24,
    height: 24,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: theme.colors.primary,
  },
  cornerTopRight: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    width: 24,
    height: 24,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: theme.colors.primary,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: theme.spacing.md,
    left: theme.spacing.md,
    width: 24,
    height: 24,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: theme.colors.primary,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: theme.spacing.md,
    right: theme.spacing.md,
    width: 24,
    height: 24,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: theme.colors.primary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: theme.colors.gray200,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
    marginRight: theme.spacing.md,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
  },
  progressText: {
    ...theme.typography.body2,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    minWidth: 45,
    textAlign: 'right',
  },
  stageContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
  },
  stageIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  stageLabel: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  stageLabelHindi: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
  },
  stepsList: {
    marginBottom: theme.spacing.lg,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  stepIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.gray300,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  stepIndicatorCompleted: {
    backgroundColor: theme.colors.success,
  },
  stepIndicatorCurrent: {
    backgroundColor: theme.colors.primary,
  },
  stepIndicatorEmpty: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.white,
  },
  stepContent: {
    flex: 1,
  },
  stepLabel: {
    ...theme.typography.body1,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  stepLabelCompleted: {
    color: theme.colors.success,
    fontWeight: '500',
  },
  stepLabelCurrent: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  stepLabelPending: {
    color: theme.colors.textDisabled,
  },
  stepLabelHindi: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.info + '15',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.info,
  },
  infoText: {
    ...theme.typography.body2,
    color: theme.colors.info,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
});
