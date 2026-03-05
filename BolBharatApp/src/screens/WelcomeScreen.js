import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Easing,
} from 'react-native';
import { colors, spacing, typography } from '../theme';
import BolBharatLogo from '../components/BolBharatLogo';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  // Core animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(60)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  
  // Logo animations
  const logoRotate = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  
  // Ring animations (for logo layers)
  const ring1Scale = useRef(new Animated.Value(0.5)).current;
  const ring2Scale = useRef(new Animated.Value(0.5)).current;
  const ring3Scale = useRef(new Animated.Value(0.5)).current;
  const ring1Opacity = useRef(new Animated.Value(0)).current;
  const ring2Opacity = useRef(new Animated.Value(0)).current;
  const ring3Opacity = useRef(new Animated.Value(0)).current;
  
  // Text animations
  const brandFade = useRef(new Animated.Value(0)).current;
  const brandSlide = useRef(new Animated.Value(20)).current;
  const taglineFade = useRef(new Animated.Value(0)).current;
  const taglineSlide = useRef(new Animated.Value(30)).current;
  
  // Button animation
  const buttonFade = useRef(new Animated.Value(0)).current;
  const buttonSlide = useRef(new Animated.Value(40)).current;
  const buttonScale = useRef(new Animated.Value(0.9)).current;
  
  // Floating particles
  const particle1Y = useRef(new Animated.Value(0)).current;
  const particle2Y = useRef(new Animated.Value(0)).current;
  const particle3Y = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Orchestrated animation sequence
    Animated.sequence([
      // Step 1: Logo rings expand (staggered)
      Animated.stagger(150, [
        Animated.parallel([
          Animated.timing(ring1Scale, {
            toValue: 1,
            duration: 800,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(ring1Opacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(ring2Scale, {
            toValue: 1,
            duration: 800,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(ring2Opacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(ring3Scale, {
            toValue: 1,
            duration: 800,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(ring3Opacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ]),
      
      // Step 2: Logo center appears with rotation
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      
      // Step 3: Brand name appears
      Animated.parallel([
        Animated.timing(brandFade, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(brandSlide, {
          toValue: 0,
          tension: 40,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      
      // Step 4: Tagline appears
      Animated.parallel([
        Animated.timing(taglineFade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(taglineSlide, {
          toValue: 0,
          tension: 40,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      
      // Step 5: Button appears
      Animated.parallel([
        Animated.timing(buttonFade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(buttonSlide, {
          toValue: 0,
          tension: 40,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(buttonScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Continuous subtle animations
    // Floating particles
    Animated.loop(
      Animated.sequence([
        Animated.timing(particle1Y, {
          toValue: -20,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(particle1Y, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(particle2Y, {
          toValue: -30,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(particle2Y, {
          toValue: 0,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(particle3Y, {
          toValue: -25,
          duration: 3500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(particle3Y, {
          toValue: 0,
          duration: 3500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Gentle logo breathing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1.03,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleGetStarted = () => {
    // Fade out animation before navigation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.replace('LanguageSelection');
    });
  };

  const rotation = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Latte gradient background */}
      <View style={styles.gradientBackground}>
        <View style={styles.gradientLayer1} />
        <View style={styles.gradientLayer2} />
        <View style={styles.gradientLayer3} />
      </View>

      {/* Floating particles */}
      <Animated.View
        style={[
          styles.particle,
          styles.particle1,
          { transform: [{ translateY: particle1Y }] },
        ]}
      />
      <Animated.View
        style={[
          styles.particle,
          styles.particle2,
          { transform: [{ translateY: particle2Y }] },
        ]}
      />
      <Animated.View
        style={[
          styles.particle,
          styles.particle3,
          { transform: [{ translateY: particle3Y }] },
        ]}
      />

      {/* Main content */}
      <View style={styles.content}>
        {/* Logo with animated rings */}
        <View style={styles.logoContainer}>
          {/* Outer ring 3 */}
          <Animated.View
            style={[
              styles.logoRing,
              styles.logoRing3,
              {
                opacity: ring3Opacity,
                transform: [{ scale: ring3Scale }],
              },
            ]}
          />
          
          {/* Middle ring 2 */}
          <Animated.View
            style={[
              styles.logoRing,
              styles.logoRing2,
              {
                opacity: ring2Opacity,
                transform: [{ scale: ring2Scale }],
              },
            ]}
          />
          
          {/* Inner ring 1 */}
          <Animated.View
            style={[
              styles.logoRing,
              styles.logoRing1,
              {
                opacity: ring1Opacity,
                transform: [{ scale: ring1Scale }],
              },
            ]}
          />
          
          {/* BolBharat Logo center */}
          <Animated.View
            style={[
              styles.logoCenter,
              {
                opacity: logoOpacity,
                transform: [
                  { scale: logoScale },
                  { rotate: rotation },
                ],
              },
            ]}
          >
            <BolBharatLogo size={120} animated={true} />
          </Animated.View>
        </View>

        {/* Brand name */}
        <Animated.View
          style={[
            styles.brandContainer,
            {
              opacity: brandFade,
              transform: [{ translateY: brandSlide }],
            },
          ]}
        >
          <Text style={styles.brandName}>BolBharat</Text>
          <View style={styles.brandUnderline} />
        </Animated.View>

        {/* Tagline */}
        <Animated.View
          style={[
            styles.taglineContainer,
            {
              opacity: taglineFade,
              transform: [{ translateY: taglineSlide }],
            },
          ]}
        >
          <Text style={styles.tagline}>Voice for Bharat</Text>
          <Text style={styles.subTagline}>
            Empowering India with AI-powered assistance for government schemes & services
          </Text>
        </Animated.View>
      </View>

      {/* Bottom section */}
      <Animated.View
        style={[
          styles.bottomContainer,
          {
            opacity: buttonFade,
            transform: [
              { translateY: buttonSlide },
              { scale: buttonScale },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={handleGetStarted}
          activeOpacity={0.85}
        >
          <View style={styles.buttonGradient}>
            <Text style={styles.getStartedText}>Get Started</Text>
            <View style={styles.buttonArrow}>
              <Text style={styles.arrowText}>→</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.featuresContainer}>
          <FeatureItem text="Voice Interface" delay={0} />
          <FeatureItem text="Scheme Finder" delay={100} />
          <FeatureItem text="Form Assistant" delay={200} />
        </View>

        <Text style={styles.languageHint}>
          Available in Hindi, Tamil, Telugu & more
        </Text>
      </Animated.View>
    </View>
  );
}

function FeatureItem({ text, delay }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 2500 + delay);
  }, []);

  return (
    <Animated.View style={[styles.featureItem, { opacity: fadeAnim }]}>
      <View style={styles.featureDot} />
      <Text style={styles.featureText}>{text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  
  // Latte gradient background layers
  gradientBackground: {
    position: 'absolute',
    width: width,
    height: height,
    overflow: 'hidden',
  },
  gradientLayer1: {
    position: 'absolute',
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    backgroundColor: '#FFF5E6', // Subtle saffron tint
    top: -width * 0.5,
    left: -width * 0.25,
    opacity: 0.4,
  },
  gradientLayer2: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: '#E8F5E9', // Subtle green tint
    bottom: -width * 0.3,
    right: -width * 0.3,
    opacity: 0.3,
  },
  gradientLayer3: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: '#E3F2FD', // Subtle blue tint
    top: height * 0.6,
    left: -width * 0.2,
    opacity: 0.3,
  },
  
  // Floating particles
  particle: {
    position: 'absolute',
    borderRadius: 50,
  },
  particle1: {
    width: 80,
    height: 80,
    top: height * 0.15,
    right: width * 0.1,
    opacity: 0.08,
    backgroundColor: '#FF9933', // Saffron
  },
  particle2: {
    width: 120,
    height: 120,
    top: height * 0.7,
    left: width * 0.05,
    opacity: 0.06,
    backgroundColor: '#138808', // Green
  },
  particle3: {
    width: 60,
    height: 60,
    top: height * 0.4,
    left: width * 0.75,
    opacity: 0.07,
    backgroundColor: '#003D7A', // Blue
  },
  
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xxl,
  },
  
  // Logo with concentric rings
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl * 1.5,
    height: 200,
    width: 200,
  },
  logoRing: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 150,
  },
  logoRing3: {
    width: 190,
    height: 190,
    borderColor: colors.gray300,
    opacity: 0.3,
  },
  logoRing2: {
    width: 160,
    height: 160,
    borderColor: colors.gray400,
    opacity: 0.4,
  },
  logoRing1: {
    width: 130,
    height: 130,
    borderColor: colors.gray600,
    opacity: 0.5,
  },
  logoCenter: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  
  // Brand name
  brandContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  brandName: {
    fontSize: 48,
    fontFamily: typography.fontFamily.bold,
    color: colors.black,
    letterSpacing: -1,
    marginBottom: spacing.sm,
  },
  brandUnderline: {
    width: 40,
    height: 3,
    backgroundColor: colors.black,
    borderRadius: 2,
  },
  
  // Tagline
  taglineContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  tagline: {
    fontSize: 18,
    fontFamily: typography.fontFamily.medium,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subTagline: {
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: spacing.md,
  },
  
  // Bottom section
  bottomContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl * 1.5,
    alignItems: 'center',
    width: '100%',
  },
  getStartedButton: {
    backgroundColor: colors.black,
    borderRadius: 32,
    marginBottom: spacing.xl,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg + 2,
    paddingHorizontal: spacing.xxl * 2,
    minWidth: width * 0.75,
  },
  getStartedText: {
    fontSize: 18,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.white,
    letterSpacing: 0.8,
    marginRight: spacing.sm,
  },
  buttonArrow: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: 'bold',
  },
  
  // Features
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  featureDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.black,
    marginRight: spacing.xs,
  },
  featureText: {
    fontSize: 11,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    letterSpacing: 0.2,
  },
  languageHint: {
    fontSize: 10,
    fontFamily: typography.fontFamily.regular,
    color: colors.textDisabled,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});

