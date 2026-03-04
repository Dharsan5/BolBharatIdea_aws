import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';

export default function DocumentsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Documents</Text>
        <Text style={styles.subtitle}>दस्तावेज़</Text>
      </View>

      <View style={styles.content}>
        {/* Camera Card */}
        <TouchableOpacity style={styles.cameraCard}>
          <View style={styles.cameraIcon}>
            <Text style={styles.iconText}>📷</Text>
          </View>
          <Text style={styles.cameraText}>Scan Document</Text>
          <Text style={styles.cameraSubtext}>दस्तावेज़ स्कैन करें</Text>
        </TouchableOpacity>

        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>How it works</Text>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>1</Text>
            <Text style={styles.instructionText}>Take a photo of your document</Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>2</Text>
            <Text style={styles.instructionText}>We'll extract and simplify the text</Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>3</Text>
            <Text style={styles.instructionText}>Listen to explanation in your language</Text>
          </View>
        </View>

        {/* Recent Documents */}
        <View style={styles.recent}>
          <Text style={styles.recentTitle}>Recent Documents</Text>
          <Text style={styles.emptyText}>No documents yet</Text>
        </View>
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
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  cameraCard: {
    backgroundColor: theme.colors.black,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  cameraIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.gray800,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  iconText: {
    fontSize: 40,
  },
  cameraText: {
    ...theme.typography.h3,
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  cameraSubtext: {
    ...theme.typography.body2,
    color: theme.colors.gray300,
  },
  instructions: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  instructionsTitle: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.black,
    color: theme.colors.white,
    fontFamily: theme.fontFamilies.semiBold,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 24,
    marginRight: theme.spacing.md,
  },
  instructionText: {
    ...theme.typography.body2,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  recent: {
    flex: 1,
  },
  recentTitle: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  emptyText: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
});
