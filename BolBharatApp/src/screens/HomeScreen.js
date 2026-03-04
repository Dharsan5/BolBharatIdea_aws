import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome to</Text>
          <Text style={styles.title}>BolBharat</Text>
          <Text style={styles.subtitle}>Voice for Bharat</Text>
        </View>

        {/* Voice Interface Card */}
        <TouchableOpacity style={styles.voiceCard}>
          <View style={styles.voiceCircle}>
            <Text style={styles.voiceIcon}>🎤</Text>
          </View>
          <Text style={styles.voiceText}>Tap to speak</Text>
          <Text style={styles.voiceSubtext}>या बोलें</Text>
        </TouchableOpacity>

        {/* Quick Access Cards */}
        <View style={styles.quickAccess}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          
          <View style={styles.cardRow}>
            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardIcon}>🎯</Text>
              <Text style={styles.cardTitle}>Find Schemes</Text>
              <Text style={styles.cardSubtitle}>योजनाएं खोजें</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardIcon}>📄</Text>
              <Text style={styles.cardTitle}>Scan Document</Text>
              <Text style={styles.cardSubtitle}>दस्तावेज़ स्कैन करें</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardRow}>
            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardIcon}>📝</Text>
              <Text style={styles.cardTitle}>Fill Forms</Text>
              <Text style={styles.cardSubtitle}>फॉर्म भरें</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardIcon}>📋</Text>
              <Text style={styles.cardTitle}>My Applications</Text>
              <Text style={styles.cardSubtitle}>मेरे आवेदन</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  },
  header: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  greeting: {
    ...theme.typography.body1,
    color: theme.colors.textSecondary,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  voiceCard: {
    backgroundColor: theme.colors.black,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.md,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
  },
  voiceCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.gray800,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  voiceIcon: {
    fontSize: 48,
  },
  voiceText: {
    ...theme.typography.h3,
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  voiceSubtext: {
    ...theme.typography.body2,
    color: theme.colors.gray300,
  },
  quickAccess: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  card: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginHorizontal: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: theme.spacing.sm,
  },
  cardTitle: {
    ...theme.typography.subtitle,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  cardSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
});
