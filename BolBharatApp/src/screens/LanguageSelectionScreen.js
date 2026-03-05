import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';
import BolBharatLogo from '../components/BolBharatLogo';

const { width, height } = Dimensions.get('window');

const LANGUAGES = [
  {
    id: 'en',
    name: 'English',
    nativeName: 'English',
  },
  {
    id: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
  },
  {
    id: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
  },
  {
    id: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
  },
  {
    id: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
  },
  {
    id: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
  },
  {
    id: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
  },
  {
    id: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
  },
  {
    id: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
  },
  {
    id: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
  },
];

export default function LanguageSelectionScreen({ navigation }) {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language.id);
    
    // Animate and navigate after a short delay
    setTimeout(() => {
      // TODO: Store selected language in AsyncStorage or state management
      // Navigate to profile setup
      navigation.replace('UserProfileSetup');
    }, 300);
  };

  return (
    <View style={styles.container}>
      {/* Background gradient */}
      <View style={styles.gradientBackground}>
        <View style={styles.gradientLayer1} />
        <View style={styles.gradientLayer2} />
      </View>

      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.logoContainer}>
          <BolBharatLogo size={60} animated={false} />
        </View>
        <Text style={styles.title}>Choose Your Language</Text>
        <Text style={styles.subtitle}>भाषा चुनें | மொழியைத் தேர்ந்தெடுக்கவும்</Text>
        <Text style={styles.description}>
          Select your preferred language to continue
        </Text>
      </Animated.View>

      {/* Language Grid */}
      <Animated.View
        style={[
          styles.languageContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.languageGrid}>
            {LANGUAGES.map((language, index) => (
              <LanguageCard
                key={language.id}
                language={language}
                isSelected={selectedLanguage === language.id}
                onSelect={handleLanguageSelect}
                delay={index * 50}
              />
            ))}
          </View>
        </ScrollView>
      </Animated.View>

      {/* Footer */}
      <Animated.View
        style={[
          styles.footer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Text style={styles.footerText}>
          You can change this later in settings
        </Text>
      </Animated.View>
    </View>
  );
}

function LanguageCard({ language, isSelected, onSelect, delay }) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onSelect(language);
    });
  };

  return (
    <Animated.View
      style={[
        styles.languageCardContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.languageCard,
          isSelected && styles.languageCardSelected,
        ]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        {isSelected && <View style={styles.selectedIndicator} />}
        <View style={styles.languageIconContainer}>
          <Ionicons 
            name="language-outline" 
            size={32} 
            color={isSelected ? colors.black : colors.textSecondary} 
          />
        </View>
        <Text style={styles.languageNative}>{language.nativeName}</Text>
        <Text style={styles.languageEnglish}>{language.name}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  gradientBackground: {
    position: 'absolute',
    width: width,
    height: height,
    overflow: 'hidden',
  },
  gradientLayer1: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: '#FFF5E6',
    top: -width * 0.3,
    right: -width * 0.3,
    opacity: 0.4,
  },
  gradientLayer2: {
    position: 'absolute',
    width: width * 1,
    height: width * 1,
    borderRadius: width * 0.5,
    backgroundColor: '#E8F5E9',
    bottom: -width * 0.2,
    left: -width * 0.3,
    opacity: 0.3,
  },
  header: {
    paddingTop: spacing.xxl * 2,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logoContainer: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  languageContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
  },
  languageCardContainer: {
    width: (width - spacing.lg * 2 - spacing.md) / 2,
    marginBottom: spacing.md,
  },
  languageCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
    borderWidth: 2,
    borderColor: colors.gray200,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  languageCardSelected: {
    borderColor: colors.black,
    borderWidth: 3,
    backgroundColor: colors.gray50,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageIconContainer: {
    marginBottom: spacing.sm,
  },
  languageNative: {
    fontSize: 20,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  languageEnglish: {
    fontSize: 12,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.regular,
    color: colors.textDisabled,
    textAlign: 'center',
  },
});
