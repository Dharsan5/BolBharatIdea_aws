import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import theme from '../theme';

export default function FormsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Forms</Text>
        <Text style={styles.subtitle}>फॉर्म</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Voice Assistant Card */}
        <View style={styles.assistantCard}>
          <MaterialCommunityIcons name="robot-outline" size={48} color={theme.colors.black} />
          <Text style={styles.assistantTitle}>AI Form Assistant</Text>
          <Text style={styles.assistantText}>
            I'll help you fill forms by asking simple questions
          </Text>
          <Text style={styles.assistantTextHindi}>
            मैं सरल सवाल पूछकर फॉर्म भरने में आपकी मदद करूंगा
          </Text>
        </View>

        {/* Available Forms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Forms</Text>
          
          <TouchableOpacity style={styles.formCard}>
            <View style={styles.formIconContainer}>
              <Ionicons name="document-text-outline" size={24} color={theme.colors.black} />
            </View>
            <View style={styles.formInfo}>
              <Text style={styles.formName}>Ration Card Application</Text>
              <Text style={styles.formNameHindi}>राशन कार्ड आवेदन</Text>
              <Text style={styles.formTime}>~10 minutes</Text>
            </View>
            <Ionicons name="arrow-forward" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.formCard}>
            <View style={styles.formIconContainer}>
              <Ionicons name="medical-outline" size={24} color={theme.colors.black} />
            </View>
            <View style={styles.formInfo}>
              <Text style={styles.formName}>Health Card Registration</Text>
              <Text style={styles.formNameHindi}>स्वास्थ्य कार्ड पंजीकरण</Text>
              <Text style={styles.formTime}>~15 minutes</Text>
            </View>
            <Ionicons name="arrow-forward" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.formCard}>
            <View style={styles.formIconContainer}>
              <MaterialCommunityIcons name="sprout-outline" size={24} color={theme.colors.black} />
            </View>
            <View style={styles.formInfo}>
              <Text style={styles.formName}>Crop Insurance Form</Text>
              <Text style={styles.formNameHindi}>फसल बीमा फॉर्म</Text>
              <Text style={styles.formTime}>~12 minutes</Text>
            </View>
            <Ionicons name="arrow-forward" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Saved Drafts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saved Drafts</Text>
          <Text style={styles.emptyText}>No saved drafts</Text>
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
  },
  assistantCard: {
    backgroundColor: theme.colors.black,
    margin: theme.spacing.lg,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
  },
  assistantTitle: {
    ...theme.typography.h3,
    color: theme.colors.white,
    marginBottom: theme.spacing.md,
  },
  assistantText: {
    ...theme.typography.body1,
    color: theme.colors.gray200,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  assistantTextHindi: {
    ...theme.typography.body2,
    color: theme.colors.gray300,
    textAlign: 'center',
  },
  section: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  formCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  formIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  formInfo: {
    flex: 1,
  },
  formName: {
    ...theme.typography.subtitle,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  formNameHindi: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  formTime: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  emptyText: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
});
