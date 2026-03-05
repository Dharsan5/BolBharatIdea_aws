import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';
import { useSavedSchemes } from '../context/SavedSchemesContext';

const { width } = Dimensions.get('window');

// Extended mock data with full details
const SCHEME_DETAILS = {
  '1': {
    id: '1',
    name: 'Pradhan Mantri Fasal Bima Yojana',
    nameHindi: 'प्रधानमंत्री फसल बीमा योजना',
    category: 'Agriculture',
    description: 'Crop insurance scheme for farmers against crop loss due to natural calamities, pests, and diseases',
    relevance: 95,
    benefits: [
      '₹2 Lakh coverage per farmer per season',
      'Premium subsidy by government (up to 90%)',
      'Coverage for pre-sowing to post-harvest losses',
      'Quick claim settlement within 30 days',
    ],
    eligibility: [
      'All farmers including sharecroppers and tenant farmers',
      'Farmers growing notified crops in notified areas',
      'Land ownership proof or tenant agreement required',
      'Valid Aadhaar card and bank account',
    ],
    documents: [
      'Aadhaar Card',
      'Land ownership certificate or tenant agreement',
      'Bank account passbook',
      'Sowing certificate from village officer',
      'Photo identity proof',
    ],
    applicationProcess: [
      'Visit nearest Common Service Centre (CSC) or bank',
      'Fill application form with personal and land details',
      'Submit required documents',
      'Pay farmer\'s share of premium',
      'Receive policy document within 7 days',
    ],
    officialWebsite: 'https://pmfby.gov.in',
    helplineNumber: '1800-180-1551',
  },
  '2': {
    id: '2',
    name: 'PM Kisan Samman Nidhi',
    nameHindi: 'पीएम किसान सम्मान निधि',
    category: 'Agriculture',
    description: 'Direct income support scheme providing ₹6,000 per year to all farmer families',
    relevance: 92,
    benefits: [
      '₹6,000 per year in three installments',
      '₹2,000 per installment credited directly to bank',
      'No maximum land holding limit',
      'Automatic payment without application after first enrollment',
    ],
    eligibility: [
      'All land-holding farmer families',
      'Small and marginal farmers prioritized',
      'Valid Aadhaar linked to bank account',
      'Land records should be updated',
    ],
    documents: [
      'Aadhaar Card',
      'Land ownership documents',
      'Bank account details with IFSC code',
      'Mobile number',
    ],
    applicationProcess: [
      'Visit PM Kisan portal or nearest CSC',
      'Register with Aadhaar number',
      'Fill farmer details and bank information',
      'Upload land records',
      'Verification by local authorities',
      'Receive first installment after approval',
    ],
    officialWebsite: 'https://pmkisan.gov.in',
    helplineNumber: '155261 / 1800115526',
  },
  '3': {
    id: '3',
    name: 'Ayushman Bharat',
    nameHindi: 'आयुष्मान भारत',
    category: 'Healthcare',
    description: 'National health protection scheme providing free treatment up to ₹5 lakh per family per year',
    relevance: 88,
    benefits: [
      '₹5 Lakh annual health coverage per family',
      'Cashless treatment at empaneled hospitals',
      'Covers 1,393 medical procedures',
      'Pre and post-hospitalization coverage',
      'No family size or age limit',
    ],
    eligibility: [
      'Families identified in SECC 2011 database',
      'Economically weaker sections',
      'Deprived categories based on SECC criteria',
      'Check eligibility on official website',
    ],
    documents: [
      'Ration Card',
      'Aadhaar Card',
      'Proof of residence',
      'Mobile number for registration',
    ],
    applicationProcess: [
      'Visit nearest empaneled hospital or Ayushman Mitra',
      'Verify eligibility with Aadhaar',
      'Get Ayushman Bharat card issued',
      'Use card for cashless treatment',
      'No application fee required',
    ],
    officialWebsite: 'https://pmjay.gov.in',
    helplineNumber: '14555',
  },
  '4': {
    id: '4',
    name: 'PM Awas Yojana',
    nameHindi: 'पीएम आवास योजना',
    category: 'Housing',
    description: 'Affordable housing scheme providing subsidy for economically weaker sections to build or buy homes',
    relevance: 85,
    benefits: [
      'Subsidy of ₹2.5 Lakh on home loans',
      'Interest subsidy up to 6.5% for 20 years',
      'Priority for women, SC/ST, and minorities',
      'Online application and tracking',
    ],
    eligibility: [
      'EWS: Family income up to ₹3 Lakh per annum',
      'LIG: Family income ₹3-6 Lakh per annum',
      'MIG-I: Family income ₹6-12 Lakh per annum',
      'Must not own pucca house in India',
      'First-time home buyers',
    ],
    documents: [
      'Aadhaar Card',
      'Income certificate',
      'Property documents',
      'Bank account details',
      'Caste certificate (if applicable)',
      'Self-declaration of not owning house',
    ],
    applicationProcess: [
      'Visit PMAY official portal',
      'Select appropriate category (CLSS/BLC/AHP)',
      'Fill online application form',
      'Upload required documents',
      'Application forwarded to bank/implementing agency',
      'Site verification and approval',
      'Subsidy credited to loan account',
    ],
    officialWebsite: 'https://pmaymis.gov.in',
    helplineNumber: '1800-11-6163',
  },
  '5': {
    id: '5',
    name: 'Pradhan Mantri Mudra Yojana',
    nameHindi: 'प्रधानमंत्री मुद्रा योजना',
    category: 'Finance',
    description: 'Micro-financing scheme providing loans up to ₹10 lakh for small businesses and entrepreneurs',
    relevance: 82,
    benefits: [
      'Collateral-free loans up to ₹10 Lakh',
      'Three categories: Shishu, Kishore, Tarun',
      'Lower interest rates than market',
      'No processing fees',
      'Quick approval process',
    ],
    eligibility: [
      'Small business owners and entrepreneurs',
      'Manufacturing, trading, service sectors',
      'Age: 18 years or above',
      'Business should be operational',
    ],
    documents: [
      'Identity proof (Aadhaar/PAN)',
      'Address proof',
      'Business plan or project report',
      'Bank statements (last 6 months)',
      'Quotation of machinery/equipment',
      'Business registration certificate',
    ],
    applicationProcess: [
      'Visit nearest bank or NBFC',
      'Choose loan category (Shishu/Kishore/Tarun)',
      'Submit application with business plan',
      'Provide required documents',
      'Bank evaluation and approval',
      'Loan disbursement to bank account',
    ],
    officialWebsite: 'https://www.mudra.org.in',
    helplineNumber: '1800-180-1111',
  },
};

export default function SchemeDetailScreen({ route, navigation }) {
  const { schemeId } = route.params;
  const scheme = SCHEME_DETAILS[schemeId];
  
  const { isSchemeSaved, toggleSaveScheme } = useSavedSchemes();
  const isSaved = isSchemeSaved(schemeId);
  const [activeSection, setActiveSection] = useState('overview');
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const handleSave = () => {
    toggleSaveScheme(schemeId);
  };

  const handleApply = () => {
    // Navigate to application process or open website
    console.log('Apply for scheme:', scheme.name);
  };

  const Section = ({ title, children, icon }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Ionicons name={icon} size={20} color={colors.black} />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  const BulletList = ({ items }) => (
    <View style={styles.bulletList}>
      {items.map((item, index) => (
        <View key={index} style={styles.bulletItem}>
          <View style={styles.bullet} />
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );

  const StepList = ({ steps }) => (
    <View style={styles.stepList}>
      {steps.map((step, index) => (
        <View key={index} style={styles.stepItem}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>{index + 1}</Text>
          </View>
          <Text style={styles.stepText}>{step}</Text>
        </View>
      ))}
    </View>
  );

  if (!scheme) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.textDisabled} />
          <Text style={styles.errorText}>Scheme not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Fixed Header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{scheme.name}</Text>
        <TouchableOpacity style={styles.headerButton} onPress={handleSave}>
          <Ionicons 
            name={isSaved ? "bookmark" : "bookmark-outline"} 
            size={24} 
            color={colors.black} 
          />
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <TouchableOpacity 
              style={styles.backIconButton} 
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={colors.black} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveIconButton} onPress={handleSave}>
              <Ionicons 
                name={isSaved ? "bookmark" : "bookmark-outline"} 
                size={24} 
                color={colors.black} 
              />
            </TouchableOpacity>
          </View>

          <View style={styles.badges}>
            <View style={styles.categoryBadge}>
              <MaterialCommunityIcons 
                name="tag-outline" 
                size={14} 
                color={colors.white} 
              />
              <Text style={styles.categoryBadgeText}>{scheme.category}</Text>
            </View>
            <View style={styles.relevanceBadge}>
              <View style={styles.relevanceDot} />
              <Text style={styles.relevanceText}>{scheme.relevance}% Match</Text>
            </View>
          </View>

          <Text style={styles.schemeName}>{scheme.name}</Text>
          <Text style={styles.schemeNameHindi}>{scheme.nameHindi}</Text>
          <Text style={styles.schemeDescription}>{scheme.description}</Text>
        </View>

        {/* Content Sections */}
        <View style={styles.content}>
          <Section title="Key Benefits" icon="gift-outline">
            <BulletList items={scheme.benefits} />
          </Section>

          <Section title="Eligibility Criteria" icon="checkmark-circle-outline">
            <BulletList items={scheme.eligibility} />
          </Section>

          <Section title="Required Documents" icon="document-text-outline">
            <BulletList items={scheme.documents} />
          </Section>

          <Section title="Application Process" icon="clipboard-outline">
            <StepList steps={scheme.applicationProcess} />
          </Section>

          <Section title="Contact Information" icon="call-outline">
            <View style={styles.contactCard}>
              <TouchableOpacity style={styles.contactItem}>
                <Ionicons name="globe-outline" size={20} color={colors.black} />
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>Official Website</Text>
                  <Text style={styles.contactValue}>{scheme.officialWebsite}</Text>
                </View>
              </TouchableOpacity>
              
              <View style={styles.divider} />
              
              <TouchableOpacity style={styles.contactItem}>
                <Ionicons name="call-outline" size={20} color={colors.black} />
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>Helpline Number</Text>
                  <Text style={styles.contactValue}>{scheme.helplineNumber}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Section>

          {/* Bottom spacing */}
          <View style={{ height: 120 }} />
        </View>
      </Animated.ScrollView>

      {/* Fixed Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.iconButton]}
          onPress={handleSave}
        >
          <Ionicons 
            name={isSaved ? "bookmark" : "bookmark-outline"} 
            size={24} 
            color={colors.black} 
          />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.eligibilityButton]}
          onPress={() => navigation.navigate('EligibilityChecker', { schemeId })}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color={colors.black} />
          <Text style={styles.eligibilityButtonText}>Check Eligibility</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.applyButton]}
          onPress={handleApply}
        >
          <Text style={styles.applyButtonText}>Apply</Text>
          <Ionicons name="arrow-forward" size={20} color={colors.white} />
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
  
  // Fixed Header
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
    zIndex: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginHorizontal: spacing.sm,
  },
  
  scrollView: {
    flex: 1,
  },
  
  // Hero Section
  hero: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
    backgroundColor: colors.gray50,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  backIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  saveIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.black,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 16,
    gap: spacing.xs,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.white,
  },
  relevanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 16,
    gap: spacing.xs,
  },
  relevanceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
  },
  relevanceText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
  },
  schemeName: {
    fontSize: 28,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    lineHeight: 36,
    marginBottom: spacing.xs,
  },
  schemeNameHindi: {
    fontSize: 16,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  schemeDescription: {
    fontSize: 16,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  
  // Content
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },
  sectionContent: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  
  // Bullet List
  bulletList: {
    gap: spacing.md,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.black,
    marginTop: 7,
    marginRight: spacing.sm,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  
  // Step List
  stepList: {
    gap: spacing.md,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  stepNumberText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.white,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
    lineHeight: 20,
    paddingTop: 2,
  },
  
  // Contact Card
  contactCard: {
    gap: spacing.md,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    color: colors.textSecondary,
    marginBottom: spacing.xs / 2,
  },
  contactValue: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray200,
  },
  
  // Bottom Action Bar
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
  iconButton: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.black,
    paddingHorizontal: spacing.md,
  },
  eligibilityButton: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.black,
  },
  eligibilityButtonText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.black,
  },
  applyButton: {
    flex: 1,
    backgroundColor: colors.black,
  },
  applyButtonText: {
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
  backButton: {
    backgroundColor: colors.black,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.white,
  },
});
