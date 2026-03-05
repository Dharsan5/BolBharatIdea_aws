import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';

// Mock form data - In production, this would come from backend
const AVAILABLE_FORMS = [
  {
    id: '1',
    name: 'Ration Card Application',
    nameHindi: 'राशन कार्ड आवेदन',
    category: 'Essential Services',
    categoryHindi: 'आवश्यक सेवाएं',
    estimatedTime: '10 minutes',
    difficulty: 'Easy',
    icon: 'card-account-details-outline',
    iconFamily: 'MaterialCommunityIcons',
    description: 'Apply for a new ration card to access subsidized food grains',
    fields: 15,
    requiredDocuments: ['Address Proof', 'Aadhaar Card', 'Income Certificate'],
  },
  {
    id: '2',
    name: 'Health Card Registration',
    nameHindi: 'स्वास्थ्य कार्ड पंजीकरण',
    category: 'Healthcare',
    categoryHindi: 'स्वास्थ्य सेवा',
    estimatedTime: '15 minutes',
    difficulty: 'Easy',
    icon: 'medical-bag',
    iconFamily: 'MaterialCommunityIcons',
    description: 'Register for Ayushman Bharat health insurance scheme',
    fields: 20,
    requiredDocuments: ['Aadhaar Card', 'Ration Card', 'Income Certificate'],
  },
  {
    id: '3',
    name: 'Crop Insurance Form',
    nameHindi: 'फसल बीमा फॉर्म',
    category: 'Agriculture',
    categoryHindi: 'कृषि',
    estimatedTime: '12 minutes',
    difficulty: 'Medium',
    icon: 'sprout',
    iconFamily: 'MaterialCommunityIcons',
    description: 'Insure your crops under PM Fasal Bima Yojana',
    fields: 18,
    requiredDocuments: ['Land Records', 'Aadhaar Card', 'Bank Details'],
  },
  {
    id: '4',
    name: 'Voter ID Application',
    nameHindi: 'मतदाता पहचान पत्र आवेदन',
    category: 'Government ID',
    categoryHindi: 'सरकारी पहचान पत्र',
    estimatedTime: '8 minutes',
    difficulty: 'Easy',
    icon: 'vote',
    iconFamily: 'MaterialCommunityIcons',
    description: 'Apply for a new voter identification card',
    fields: 12,
    requiredDocuments: ['Address Proof', 'Date of Birth Proof', 'Photograph'],
  },
  {
    id: '5',
    name: 'Pension Application',
    nameHindi: 'पेंशन आवेदन',
    category: 'Social Welfare',
    categoryHindi: 'सामाजिक कल्याण',
    estimatedTime: '20 minutes',
    difficulty: 'Medium',
    icon: 'account-cash',
    iconFamily: 'MaterialCommunityIcons',
    description: 'Apply for old age, widow, or disability pension',
    fields: 25,
    requiredDocuments: ['Age Proof', 'Income Certificate', 'Bank Details', 'Aadhaar'],
  },
  {
    id: '6',
    name: 'Birth Certificate',
    nameHindi: 'जन्म प्रमाण पत्र',
    category: 'Certificates',
    categoryHindi: 'प्रमाण पत्र',
    estimatedTime: '10 minutes',
    difficulty: 'Easy',
    icon: 'baby-face-outline',
    iconFamily: 'MaterialCommunityIcons',
    description: 'Register birth and obtain certificate',
    fields: 14,
    requiredDocuments: ['Hospital Records', 'Parent IDs', 'Address Proof'],
  },
  {
    id: '7',
    name: 'Driving License',
    nameHindi: 'ड्राइविंग लाइसेंस',
    category: 'Transport',
    categoryHindi: 'परिवहन',
    estimatedTime: '18 minutes',
    difficulty: 'Medium',
    icon: 'car',
    iconFamily: 'MaterialCommunityIcons',
    description: 'Apply for learner or permanent driving license',
    fields: 22,
    requiredDocuments: ['Age Proof', 'Address Proof', 'Medical Certificate'],
  },
  {
    id: '8',
    name: 'Scholarship Application',
    nameHindi: 'छात्रवृत्ति आवेदन',
    category: 'Education',
    categoryHindi: 'शिक्षा',
    estimatedTime: '16 minutes',
    difficulty: 'Medium',
    icon: 'school',
    iconFamily: 'MaterialCommunityIcons',
    description: 'Apply for government education scholarship',
    fields: 20,
    requiredDocuments: ['Marksheet', 'Income Certificate', 'Caste Certificate', 'Bank Details'],
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Forms', labelHindi: 'सभी फॉर्म' },
  { id: 'Essential Services', label: 'Essential', labelHindi: 'आवश्यक' },
  { id: 'Healthcare', label: 'Healthcare', labelHindi: 'स्वास्थ्य' },
  { id: 'Agriculture', label: 'Agriculture', labelHindi: 'कृषि' },
  { id: 'Education', label: 'Education', labelHindi: 'शिक्षा' },
];

export default function FormSelectionScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleFormSelect = (form) => {
    // Navigate to conversational form filling screen
    navigation.navigate('FormConversation', { formId: form.id });
  };

  const filteredForms = AVAILABLE_FORMS.filter((form) => {
    const matchesSearch =
      form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.nameHindi.includes(searchQuery) ||
      form.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory =
      selectedCategory === 'all' || form.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return '#4CAF50';
      case 'Medium':
        return '#FF9800';
      case 'Hard':
        return '#F44336';
      default:
        return colors.textSecondary;
    }
  };

  const renderFormCard = ({ item }) => (
    <TouchableOpacity
      style={styles.formCard}
      onPress={() => handleFormSelect(item)}
      activeOpacity={0.7}
    >
      <View style={styles.formIconContainer}>
        <MaterialCommunityIcons
          name={item.icon}
          size={32}
          color={colors.black}
        />
      </View>
      <View style={styles.formContent}>
        <View style={styles.formHeader}>
          <View style={styles.formTitleContainer}>
            <Text style={styles.formName}>{item.name}</Text>
            <Text style={styles.formNameHindi}>{item.nameHindi}</Text>
          </View>
          <Ionicons name="arrow-forward" size={20} color={colors.textSecondary} />
        </View>
        
        <Text style={styles.formDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.formMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>{item.estimatedTime}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="list-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>{item.fields} fields</Text>
          </View>
          <View style={styles.metaBadge}>
            <Text
              style={[
                styles.difficultyText,
                { color: getDifficultyColor(item.difficulty) },
              ]}
            >
              {item.difficulty}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <>
      {/* AI Assistant Banner */}
      <View style={styles.aiAssistantBanner}>
        <View style={styles.aiIconContainer}>
          <MaterialCommunityIcons name="robot" size={32} color={colors.white} />
        </View>
        <View style={styles.aiContent}>
          <Text style={styles.aiTitle}>AI Form Assistant</Text>
          <Text style={styles.aiSubtitle}>
            I'll help you fill forms by asking simple questions
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search forms..."
          placeholderTextColor={colors.textDisabled}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filter */}
      <View style={styles.categoriesContainer}>
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.categoryChipSelected,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextSelected,
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {filteredForms.length} form{filteredForms.length !== 1 ? 's' : ''} available
        </Text>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.title}>Forms</Text>
          <Text style={styles.subtitle}>फॉर्म</Text>
        </View>
      </View>

      {/* Forms List */}
      <FlatList
        data={filteredForms}
        renderItem={renderFormCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
  },

  // List
  listContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  // AI Assistant Banner
  aiAssistantBanner: {
    flexDirection: 'row',
    backgroundColor: colors.black,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  aiIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  aiContent: {
    flex: 1,
  },
  aiTitle: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
    marginBottom: spacing.xs / 2,
  },
  aiSubtitle: {
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 18,
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.gray200,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.lg,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
  },

  // Categories
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  categoryChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.gray200,
  },
  categoryChipSelected: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  categoryText: {
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
    color: colors.textSecondary,
  },
  categoryTextSelected: {
    color: colors.white,
    fontFamily: typography.fontFamily.semiBold,
  },

  // Results Header
  resultsHeader: {
    marginBottom: spacing.md,
  },
  resultsText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    color: colors.textSecondary,
  },

  // Form Card
  formCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: colors.gray200,
  },
  formIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.gray50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  formContent: {
    flex: 1,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  formTitleContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  formName: {
    fontSize: 16,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs / 2,
  },
  formNameHindi: {
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },
  formDescription: {
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  formMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs / 2,
  },
  metaText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    color: colors.textSecondary,
  },
  metaBadge: {
    backgroundColor: colors.gray50,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 11,
    fontFamily: typography.fontFamily.semiBold,
  },
});
