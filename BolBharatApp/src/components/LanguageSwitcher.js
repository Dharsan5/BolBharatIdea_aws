import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../theme';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';
import useToast from '../hooks/useToast';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * LanguageSwitcher Component
 * 
 * A modal component for switching between different languages.
 * Can be triggered from anywhere in the app.
 * 
 * Props:
 * - visible: boolean - Controls modal visibility
 * - onClose: function - Called when modal is closed
 * - showAsButton: boolean - If true, renders as a button that opens the modal
 */

export default function LanguageSwitcher({ visible = false, onClose, showAsButton = false }) {
  const [isModalVisible, setIsModalVisible] = useState(visible);
  const { currentLanguage, changeLanguage, languages } = useLanguage();
  const { showToast } = useToast();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    setIsModalVisible(visible);
  }, [visible]);

  useEffect(() => {
    if (isModalVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isModalVisible]);

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    if (onClose) {
      onClose();
    }
  };

  const handleLanguageSelect = async (language) => {
    const success = await changeLanguage(language.id);
    if (success) {
      showToast(
        `Language changed to ${language.name}`,
        'success'
      );
      handleCloseModal();
    } else {
      showToast(
        'Failed to change language',
        'error'
      );
    }
  };

  const renderLanguageOption = (language) => {
    const isSelected = currentLanguage.id === language.id;

    return (
      <View
        key={language.id}
        style={[
          styles.languageOption,
          isSelected && styles.languageOptionSelected,
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleLanguageSelect(language)}
          style={styles.languageButton}
        >
          <View style={styles.languageInfo}>
            <MaterialCommunityIcons name="translate" size={22} color={theme.colors.textSecondary} />
            <View style={styles.languageTextContainer}>
              <Text
                style={[
                  styles.languageName,
                  isSelected && styles.languageNameSelected,
                ]}
              >
                {language.name}
              </Text>
              <Text
                style={[
                  styles.languageNativeName,
                  isSelected && styles.languageNativeNameSelected,
                ]}
              >
                {language.nativeName}
              </Text>
            </View>
          </View>
          
          {isSelected && (
            <View style={styles.selectedIndicator}>
              <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const modalElement = (
    <Modal
      visible={isModalVisible}
      transparent
      animationType="none"
      onRequestClose={handleCloseModal}
    >
      <View style={styles.modalContainer}>
        {/* Backdrop */}
        <Animated.View
          style={[
            styles.backdrop,
            { opacity: fadeAnim },
          ]}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={handleCloseModal}
          />
        </Animated.View>

        {/* Modal Content */}
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderTitleContainer}>
              <MaterialCommunityIcons
                name="translate"
                size={28}
                color={theme.colors.primary}
              />
              <View style={styles.modalHeaderText}>
                <Text style={styles.modalTitle}>Choose Language</Text>
                <Text style={styles.modalSubtitle}>भाषा चुनें</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseModal}
            >
              <Ionicons name="close" size={28} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Language List */}
          <ScrollView
            style={styles.languageList}
            contentContainerStyle={styles.languageListContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.sectionHeader}>
              <Ionicons name="globe-outline" size={18} color={theme.colors.textSecondary} />
              <Text style={styles.sectionHeaderText}>
                Select your preferred language for the app
              </Text>
            </View>

            {languages.map(renderLanguageOption)}

            {/* Info Footer */}
            <View style={styles.infoFooter}>
              <Ionicons name="information-circle-outline" size={20} color={theme.colors.info} />
              <Text style={styles.infoText}>
                Voice recognition and text-to-speech will use your selected language
              </Text>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );

  if (showAsButton) {
    return (
      <>
        <TouchableOpacity
          style={styles.triggerButton}
          onPress={handleOpenModal}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="translate"
            size={24}
            color={theme.colors.textPrimary}
          />
          <Text style={styles.triggerButtonText}>
            {currentLanguage.nativeName}
          </Text>
          <Ionicons
            name="chevron-down"
            size={16}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
        {modalElement}
      </>
    );
  }

  return modalElement;
}

const styles = StyleSheet.create({
  // Trigger Button Styles
  triggerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.elevation.small,
  },
  triggerButtonText: {
    ...theme.typography.body1,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    marginHorizontal: theme.spacing.sm,
  },

  // Modal Container
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: SCREEN_WIDTH - theme.spacing.xl * 2,
    maxHeight: SCREEN_HEIGHT * 0.75,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    ...theme.elevation.large,
  },

  // Header
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.gray50,
  },
  modalHeaderTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalHeaderText: {
    marginLeft: theme.spacing.md,
  },
  modalTitle: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
  },
  modalSubtitle: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
  },

  // Language List
  languageList: {
    flex: 1,
  },
  languageListContent: {
    padding: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.info + '10',
    borderRadius: theme.borderRadius.md,
  },
  sectionHeaderText: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },

  // Language Options
  languageOption: {
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  languageOptionSelected: {
    borderColor: theme.colors.success,
    backgroundColor: theme.colors.success + '08',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  languageFlag: {
    fontSize: 32,
    marginRight: theme.spacing.md,
  },
  languageTextContainer: {
    flex: 1,
  },
  languageName: {
    ...theme.typography.body1,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  languageNameSelected: {
    color: theme.colors.success,
  },
  languageNativeName: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  languageNativeNameSelected: {
    color: theme.colors.success,
  },
  selectedIndicator: {
    marginLeft: theme.spacing.sm,
  },

  // Info Footer
  infoFooter: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.info + '10',
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.info,
  },
  infoText: {
    ...theme.typography.caption,
    color: theme.colors.info,
    marginLeft: theme.spacing.sm,
    flex: 1,
    lineHeight: 18,
  },
});
