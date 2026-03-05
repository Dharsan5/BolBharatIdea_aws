import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';

const { width } = Dimensions.get('window');

const MOCK_SCHEMES = [
  {
    id: '1',
    name: 'Pradhan Mantri Fasal Bima Yojana',
    nameHindi: 'प्रधानमंत्री फसल बीमा योजना',
    category: 'Agriculture',
    description: 'Crop insurance scheme for farmers against crop loss',
    relevance: 95,
    benefits: '₹2 Lakh coverage per farmer',
  },
  {
    id: '2',
    name: 'PM Kisan Samman Nidhi',
    nameHindi: 'पीएम किसान सम्मान निधि',
    category: 'Agriculture',
    description: 'Direct income support of ₹6,000 per year to farmers',
    relevance: 92,
    benefits: '₹2,000 per installment, 3 times a year',
  },
  {
    id: '3',
    name: 'Ayushman Bharat',
    nameHindi: 'आयुष्मान भारत',
    category: 'Healthcare',
    description: 'Health insurance scheme providing free treatment',
    relevance: 88,
    benefits: '₹5 Lakh annual health coverage',
  },
  {
    id: '4',
    name: 'PM Awas Yojana',
    nameHindi: 'पीएम आवास योजना',
    category: 'Housing',
    description: 'Affordable housing scheme for economically weaker sections',
    relevance: 85,
    benefits: '₹2.5 Lakh subsidy on home loans',
  },
  {
    id: '5',
    name: 'Pradhan Mantri Mudra Yojana',
    nameHindi: 'प्रधानमंत्री मुद्रा योजना',
    category: 'Finance',
    description: 'Micro-loans for small businesses and entrepreneurs',
    relevance: 82,
    benefits: 'Loans up to ₹10 Lakh',
  },
];

const QUICK_SEARCH_CATEGORIES = [
  { id: 'agriculture', label: 'Agriculture', iconFamily: MaterialCommunityIcons, iconName: 'leaf' },
  { id: 'healthcare', label: 'Healthcare', iconFamily: Ionicons, iconName: 'medical-outline' },
  { id: 'education', label: 'Education', iconFamily: Ionicons, iconName: 'school-outline' },
  { id: 'housing', label: 'Housing', iconFamily: Ionicons, iconName: 'home-outline' },
  { id: 'finance', label: 'Finance', iconFamily: Ionicons, iconName: 'cash-outline' },
  { id: 'employment', label: 'Employment', iconFamily: Ionicons, iconName: 'briefcase-outline' },
];

export default function SchemesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [schemes, setSchemes] = useState(MOCK_SCHEMES);
  
  const voiceButtonScale = useRef(new Animated.Value(1)).current;
  const searchBarFade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isVoiceMode) {
      // Animate voice button
      Animated.loop(
        Animated.sequence([
          Animated.timing(voiceButtonScale, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(voiceButtonScale, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      voiceButtonScale.setValue(1);
    }
  }, [isVoiceMode]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query.trim().length > 0) {
      // Filter schemes based on query
      const filtered = MOCK_SCHEMES.filter(scheme =>
        scheme.name.toLowerCase().includes(query.toLowerCase()) ||
        scheme.nameHindi.includes(query) ||
        scheme.category.toLowerCase().includes(query.toLowerCase()) ||
        scheme.description.toLowerCase().includes(query.toLowerCase())
      );
      setSchemes(filtered);
    } else {
      setSchemes(MOCK_SCHEMES);
    }
  };

  const handleVoiceSearch = () => {
    setIsVoiceMode(!isVoiceMode);
    
    if (!isVoiceMode) {
      // TODO: Implement actual voice recording
      console.log('Starting voice search...');
      
      // Simulate voice search
      setTimeout(() => {
        setIsVoiceMode(false);
        setSearchQuery('farming schemes');
        handleSearch('farming schemes');
      }, 3000);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category.id);
    setSearchQuery(category.label);
    handleSearch(category.label);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSchemes(MOCK_SCHEMES);
  };

  const renderSchemeCard = ({ item }) => (
    <TouchableOpacity style={styles.schemeCard} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View style={styles.relevanceBadge}>
          <View style={styles.relevanceDot} />
          <Text style={styles.relevanceText}>{item.relevance}% Match</Text>
        </View>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      </View>
      
      <Text style={styles.schemeName}>{item.name}</Text>
      <Text style={styles.schemeNameHindi}>{item.nameHindi}</Text>
      <Text style={styles.schemeDescription} numberOfLines={2}>
        {item.description}
      </Text>
      
      <View style={styles.benefitsContainer}>
        <Text style={styles.benefitsLabel}>Benefits:</Text>
        <Text style={styles.benefitsText}>{item.benefits}</Text>
      </View>
      
      <TouchableOpacity style={styles.detailsButton}>
        <Text style={styles.detailsButtonText}>View Details</Text>
        <Ionicons name="arrow-forward" size={16} color={colors.white} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Find Schemes</Text>
          <Text style={styles.subtitle}>योजनाएं खोजें</Text>
        </View>
      </View>

      {/* Search Bar with Voice */}
      <View style={styles.searchSection}>
        {!isVoiceMode ? (
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color={colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search schemes..."
              placeholderTextColor={colors.textDisabled}
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
                <Ionicons name="close" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.voiceActiveContainer}>
            <ActivityIndicator size="small" color={colors.black} />
            <Text style={styles.voiceActiveText}>Listening...</Text>
          </View>
        )}

        <Animated.View style={{ transform: [{ scale: voiceButtonScale }] }}>
          <TouchableOpacity
            style={[
              styles.voiceButton,
              isVoiceMode && styles.voiceButtonActive,
            ]}
            onPress={handleVoiceSearch}
          >
            <Ionicons name="mic-outline" size={24} color={isVoiceMode ? colors.white : colors.black} />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Quick Search Categories */}
      {!searchQuery && (
        <View style={styles.categoriesSection}>
          <Text style={styles.categoriesTitle}>Quick Search</Text>
          <View style={styles.categoriesGrid}>
            {QUICK_SEARCH_CATEGORIES.map((category) => {
              const IconComponent = category.iconFamily;
              return (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryChip,
                    selectedCategory === category.id && styles.categoryChipSelected,
                  ]}
                  onPress={() => handleCategorySelect(category)}
                >
                  <IconComponent 
                    name={category.iconName} 
                    size={20} 
                    color={selectedCategory === category.id ? colors.white : colors.black}
                    style={styles.categoryIcon}
                  />
                  <Text
                    style={[
                      styles.categoryLabel,
                      selectedCategory === category.id && styles.categoryLabelSelected,
                    ]}
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {schemes.length} schemes found
        </Text>
        {searchQuery && (
          <Text style={styles.resultsQuery}>for "{searchQuery}"</Text>
        )}
      </View>

      {/* Schemes List */}
      <FlatList
        data={schemes}
        renderItem={renderSchemeCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={64} color={colors.textDisabled} style={styles.emptyIcon} />
            <Text style={styles.emptyText}>No schemes found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your search or use voice search
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: 32,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  
  // Search Section
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray50,
    borderWidth: 2,
    borderColor: colors.gray200,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
  },
  clearButton: {
    padding: spacing.xs,
  },
  voiceActiveContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray50,
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 16,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  voiceActiveText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.medium,
    color: colors.textPrimary,
  },
  voiceButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  voiceButtonActive: {
    backgroundColor: '#FF4444',
  },
  
  // Categories Section
  categoriesSection: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  categoriesTitle: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.gray200,
    borderRadius: 20,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  categoryChipSelected: {
    borderColor: colors.black,
    backgroundColor: colors.black,
  },
  categoryLabel: {
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
    color: colors.textSecondary,
  },
  categoryLabelSelected: {
    color: colors.black,
    fontFamily: typography.fontFamily.semiBold,
  },
  
  // Results Header
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  resultsText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
  },
  resultsQuery: {
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },
  
  // Scheme Cards
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  schemeCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.gray200,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  relevanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray50,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 12,
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
  categoryBadge: {
    backgroundColor: colors.black,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    fontFamily: typography.fontFamily.medium,
    color: colors.white,
  },
  schemeName: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    lineHeight: 24,
  },
  schemeNameHindi: {
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  schemeDescription: {
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  benefitsContainer: {
    backgroundColor: colors.gray50,
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  benefitsLabel: {
    fontSize: 11,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.xs / 2,
  },
  benefitsText: {
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
    color: colors.textPrimary,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.black,
    borderRadius: 12,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  detailsButtonText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.white,
  },
  
  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  emptyIcon: {
    marginBottom: spacing.lg,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
});
