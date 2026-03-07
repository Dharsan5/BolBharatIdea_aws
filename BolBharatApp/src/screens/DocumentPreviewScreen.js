import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';

export default function DocumentPreviewScreen({ route, navigation }) {
  const { imageUri, originalUri } = route.params || {};
  const [isProcessing, setIsProcessing] = useState(false);

  if (!imageUri) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.textDisabled} />
          <Text style={styles.errorText}>No image found</Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleProcess = () => {
    // Navigate to OCR Processing screen with the captured image
    // The OCR Processing screen will handle the simulated processing
    // and automatically navigate to SimplifiedDocument when complete
    navigation.navigate('OCRProcessing', {
      imageUri,
      documentType: 'Government Form', // In production, this could be auto-detected
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.black} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Document Preview</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      {/* Image Preview */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <MaterialCommunityIcons
              name="information-outline"
              size={24}
              color={colors.black}
            />
            <Text style={styles.infoTitle}>What's Next?</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="scan" size={20} color={colors.black} />
            </View>
            <Text style={styles.infoText}>
              Extract text from document using OCR
            </Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <MaterialCommunityIcons
                name="text-box-outline"
                size={20}
                color={colors.black}
              />
            </View>
            <Text style={styles.infoText}>
              Simplify complex government language
            </Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="volume-high" size={20} color={colors.black} />
            </View>
            <Text style={styles.infoText}>
              Listen to explanation in your language
            </Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.actionButton, styles.retakeButton]}
          onPress={() => navigation.goBack()}
          disabled={isProcessing}
        >
          <Ionicons name="camera" size={20} color={colors.black} />
          <Text style={styles.retakeButtonText}>Retake</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.processButton]}
          onPress={handleProcess}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <ActivityIndicator size="small" color={colors.white} />
              <Text style={styles.processButtonText}>Processing...</Text>
            </>
          ) : (
            <>
              <Text style={styles.processButtonText}>Process Document</Text>
              <Ionicons name="arrow-forward" size={20} color={colors.white} />
            </>
          )}
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
  },
  headerRight: {
    width: 40,
  },

  // Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  imageContainer: {
    backgroundColor: colors.gray50,
    marginHorizontal: spacing.xl,
    marginTop: spacing.lg,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.gray200,
  },
  image: {
    width: '100%',
    aspectRatio: 0.707, // A4 ratio
    resizeMode: 'contain',
  },

  // Info Card
  infoCard: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.xl,
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.gray200,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.gray50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  // Bottom Bar
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    gap: spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    gap: spacing.xs,
  },
  retakeButton: {
    flex: 0.35,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.black,
  },
  retakeButtonText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.black,
  },
  processButton: {
    flex: 0.65,
    backgroundColor: colors.black,
  },
  processButtonText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.white,
  },

  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  errorText: {
    fontSize: 18,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  errorButton: {
    backgroundColor: colors.black,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderRadius: 12,
  },
  errorButtonText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.white,
  },
});
