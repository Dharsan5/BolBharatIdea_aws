import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';
import { useLanguage } from '../context/LanguageContext';

export default function LanguagePreferencesScreen({ navigation }) {
  const { currentLanguage, changeLanguage, languages } = useLanguage();
  const [tempSelection, setTempSelection] = useState(currentLanguage.id);

  const handleSave = async () => {
    await changeLanguage(tempSelection);
    navigation.goBack();
  };

  const handleCancel = () => {
    setTempSelection(currentLanguage.id);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={handleCancel}
        >
          <Ionicons name="arrow-back" size={24} color={colors.black} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.title}>Language Preferences</Text>
          <Text style={styles.subtitle}>भाषा प्राथमिकताएँ</Text>
        </View>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Description */}
      <View style={styles.descriptionContainer}>
        <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
        <Text style={styles.description}>
          Select your preferred language for the app interface and voice interactions
        </Text>
      </View>

      {/* Language List */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {languages.map((language) => {
          const isSelected = tempSelection === language.id;
          
          return (
            <Pressable
              key={language.id}
              style={({ pressed }) => [
                styles.languageItem,
                isSelected && styles.languageItemSelected,
                pressed && styles.languageItemPressed,
              ]}
              onPress={() => setTempSelection(language.id)}
            >
              <View style={styles.languageInfo}>
                <Text style={[
                  styles.languageName,
                  isSelected && styles.languageNameSelected,
                ]}>
                  {language.name}
                </Text>
                <Text style={[
                  styles.languageNativeName,
                  isSelected && styles.languageNativeNameSelected,
                ]}>
                  {language.nativeName}
                </Text>
              </View>
              {isSelected && (
                <View style={styles.checkmarkContainer}>
                  <Ionicons name="checkmark-circle" size={28} color={colors.primary} />
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Bottom Note */}
      <View style={styles.bottomNote}>
        <Ionicons name="globe-outline" size={18} color={colors.textSecondary} />
        <Text style={styles.bottomNoteText}>
          Voice recognition supports all listed languages
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerButton: {
    padding: spacing.xs,
    minWidth: 60,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    ...typography.h3,
    color: colors.black,
    fontWeight: '600',
  },
  subtitle: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  saveButton: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'right',
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: spacing.sm,
    gap: spacing.xs,
  },
  description: {
    ...typography.small,
    color: colors.text,
    flex: 1,
    lineHeight: 18,
  },
  scrollView: {
    flex: 1,
    marginTop: spacing.md,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: colors.border,
  },
  languageItemSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  languageItemPressed: {
    opacity: 0.7,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
    marginBottom: 4,
  },
  languageNameSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  languageNativeName: {
    ...typography.small,
    color: colors.textSecondary,
    fontWeight: '400',
  },
  languageNativeNameSelected: {
    color: colors.primary,
  },
  checkmarkContainer: {
    marginLeft: spacing.sm,
  },
  bottomNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  bottomNoteText: {
    ...typography.small,
    color: colors.textSecondary,
  },
});
