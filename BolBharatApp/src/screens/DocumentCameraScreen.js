import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';
import { colors, spacing, typography } from '../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function DocumentCameraScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [flashMode, setFlashMode] = useState('off');
  const cameraRef = useRef(null);

  // Animations
  const captureButtonScale = useRef(new Animated.Value(1)).current;
  const overlayOpacity = useRef(new Animated.Value(1)).current;
  const guidelinesOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse animation for guidelines
    Animated.loop(
      Animated.sequence([
        Animated.timing(guidelinesOpacity, {
          toValue: 0.5,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(guidelinesOpacity, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.black} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <MaterialCommunityIcons
            name="camera-off"
            size={64}
            color={colors.textDisabled}
            style={styles.permissionIcon}
          />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            BolBharat needs access to your camera to scan documents and extract text.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleCapture = async () => {
    if (!cameraRef.current || isProcessing) return;

    // Animate button press
    Animated.sequence([
      Animated.timing(captureButtonScale, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(captureButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setIsProcessing(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.9,
        base64: false,
        exif: false,
      });

      if (photo) {
        // Fade out overlay
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();

        setCapturedImage(photo.uri);
      }
    } catch (error) {
      console.error('Error capturing image:', error);
      Alert.alert('Error', 'Failed to capture image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    // Fade in overlay
    Animated.timing(overlayOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleUsePhoto = async () => {
    if (!capturedImage) return;

    setIsProcessing(true);

    try {
      // Auto-enhance the image
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        capturedImage,
        [
          { resize: { width: 1200 } }, // Resize for faster processing
        ],
        {
          compress: 0.8,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      // Navigate to preview screen with the image
      navigation.navigate('DocumentPreview', {
        imageUri: manipulatedImage.uri,
        originalUri: capturedImage,
      });
    } catch (error) {
      console.error('Error processing image:', error);
      Alert.alert('Error', 'Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleFlash = () => {
    setFlashMode((current) => {
      if (current === 'off') return 'on';
      if (current === 'on') return 'auto';
      return 'off';
    });
  };

  const getFlashIcon = () => {
    if (flashMode === 'off') return 'flash-off';
    if (flashMode === 'on') return 'flash';
    return 'flash-auto';
  };

  if (capturedImage) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />

          {/* Preview Controls */}
          <View style={styles.previewControls}>
            <TouchableOpacity
              style={[styles.previewButton, styles.retakeButton]}
              onPress={handleRetake}
              disabled={isProcessing}
            >
              <Ionicons name="refresh" size={24} color={colors.black} />
              <Text style={styles.retakeButtonText}>Retake</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.previewButton, styles.useButton]}
              onPress={handleUsePhoto}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <>
                  <Ionicons name="checkmark" size={24} color={colors.white} />
                  <Text style={styles.useButtonText}>Use Photo</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        flash={flashMode}
      >
        {/* Camera Overlay with Guidelines */}
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
          {/* Top Controls */}
          <SafeAreaView edges={['top']} style={styles.topControls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="close" size={28} color={colors.white} />
            </TouchableOpacity>

            <View style={styles.topControlsRight}>
              <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
                <Ionicons name={getFlashIcon()} size={28} color={colors.white} />
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          {/* Document Frame Guidelines */}
          <View style={styles.guidelinesContainer}>
            <Animated.View
              style={[styles.guidelines, { opacity: guidelinesOpacity }]}
            >
              {/* Corners */}
              <View style={[styles.corner, styles.cornerTopLeft]} />
              <View style={[styles.corner, styles.cornerTopRight]} />
              <View style={[styles.corner, styles.cornerBottomLeft]} />
              <View style={[styles.corner, styles.cornerBottomRight]} />

              {/* Instructions */}
              <View style={styles.instructionsBadge}>
                <MaterialCommunityIcons
                  name="file-document-outline"
                  size={20}
                  color={colors.white}
                />
                <Text style={styles.instructionsText}>
                  Align document within frame
                </Text>
              </View>
            </Animated.View>
          </View>

          {/* Bottom Controls */}
          <SafeAreaView edges={['bottom']} style={styles.bottomControls}>
            <View style={styles.captureContainer}>
              {/* Tips */}
              <View style={styles.tipsContainer}>
                <View style={styles.tip}>
                  <Ionicons
                    name="contrast-outline"
                    size={16}
                    color={colors.white}
                  />
                  <Text style={styles.tipText}>Good lighting</Text>
                </View>
                <View style={styles.tip}>
                  <Ionicons name="scan-outline" size={16} color={colors.white} />
                  <Text style={styles.tipText}>Clear text</Text>
                </View>
              </View>

              {/* Capture Button */}
              <View style={styles.captureButtonContainer}>
                <TouchableOpacity
                  style={styles.captureButtonOuter}
                  onPress={handleCapture}
                  disabled={isProcessing}
                  activeOpacity={0.8}
                >
                  <Animated.View
                    style={[
                      styles.captureButton,
                      { transform: [{ scale: captureButtonScale }] },
                    ]}
                  >
                    {isProcessing ? (
                      <ActivityIndicator size="large" color={colors.white} />
                    ) : (
                      <Ionicons name="camera" size={36} color={colors.white} />
                    )}
                  </Animated.View>
                </TouchableOpacity>
              </View>

              {/* Placeholder for symmetry */}
              <View style={styles.tipsContainer} />
            </View>
          </SafeAreaView>
        </Animated.View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },

  // Camera
  camera: {
    flex: 1,
  },

  // Overlay
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },

  // Top Controls
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  topControlsRight: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Guidelines
  guidelinesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  guidelines: {
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_WIDTH * 0.85 * 1.41, // A4 aspect ratio
    maxHeight: SCREEN_HEIGHT * 0.5,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: colors.white,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  instructionsBadge: {
    position: 'absolute',
    top: -50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 20,
    gap: spacing.xs,
  },
  instructionsText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.white,
  },

  // Bottom Controls
  bottomControls: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  captureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tipsContainer: {
    flex: 1,
    gap: spacing.xs,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  tipText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    color: colors.white,
  },

  // Capture Button
  captureButtonContainer: {
    alignItems: 'center',
  },
  captureButtonOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Permission Screen
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
  },
  permissionIcon: {
    marginBottom: spacing.xl,
  },
  permissionTitle: {
    fontSize: 24,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xxl,
  },
  permissionButton: {
    backgroundColor: colors.black,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  permissionButtonText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.white,
  },
  backButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  backButtonText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    color: colors.textSecondary,
  },

  // Preview
  previewContainer: {
    flex: 1,
    backgroundColor: colors.black,
  },
  previewImage: {
    flex: 1,
    resizeMode: 'contain',
  },
  previewControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    backgroundColor: 'rgba(0,0,0,0.8)',
    gap: spacing.md,
  },
  previewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: 12,
    gap: spacing.xs,
  },
  retakeButton: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.white,
  },
  retakeButtonText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.black,
  },
  useButton: {
    backgroundColor: colors.black,
    borderWidth: 2,
    borderColor: colors.white,
  },
  useButtonText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.white,
  },
});
