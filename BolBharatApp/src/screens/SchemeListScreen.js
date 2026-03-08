import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../theme';
import { useSavedSchemes } from '../context/SavedSchemesContext';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSchemes } from '../store/slices/schemesSlice';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - theme.spacing.lg * 2;

export default function SchemeListScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const reduxSchemes = useSelector(state => state.schemes.schemes);
  const schemesLoading = useSelector(state => state.schemes.loading);
  
  const { query = '', category = 'all', userProfile = {} } = route.params || {};
  const { savedSchemeIds, isSchemeSaved, toggleSaveScheme } = useSavedSchemes();
  
  const [schemes, setSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [filterCategory, setFilterCategory] = useState(category);
  const [showFilters, setShowFilters] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fetch schemes based on query and category
    dispatch(fetchSchemes({ query, category }));
  }, [dispatch, query, category]);

  useEffect(() => {
    if (reduxSchemes && reduxSchemes.length > 0) {
      setSchemes(reduxSchemes);
    }
  }, [reduxSchemes]);

  useEffect(() => {
    if (schemes.length > 0) {
      applyFiltersAndSort();
    }
  }, [sortBy, filterCategory, schemes]);

  const applyFiltersAndSort = () => {
    let filtered = [...schemes];

    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(scheme => scheme.category === filterCategory);
    }

    // Apply sorting
    if (sortBy === 'relevance') {
      filtered.sort((a, b) => b.relevanceScore - a.relevanceScore);
    } else if (sortBy === 'benefits') {
      // Sort by benefit amount (simplified)
      filtered.sort((a, b) => {
        const amountA = parseInt(a.benefits.match(/\d+/)?.[0] || 0);
        const amountB = parseInt(b.benefits.match(/\d+/)?.[0] || 0);
        return amountB - amountA;
      });
    }

    setFilteredSchemes(filtered);
  };

  const getRelevanceColor = (score) => {
    if (score >= 90) return theme.colors.success;
    if (score >= 75) return theme.colors.primary;
    if (score >= 60) return theme.colors.warning;
    return theme.colors.gray500;
  };

  const getRelevanceLabel = (score) => {
    if (score >= 90) return { en: 'Excellent Match', hi: 'बेहतरीन मिलान' };
    if (score >= 75) return { en: 'Good Match', hi: 'अच्छा मिलान' };
    if (score >= 60) return { en: 'Fair Match', hi: 'उचित मिलान' };
    return { en: 'Possible Match', hi: 'संभावित मिलान' };
  };

  const renderSchemeCard = ({ item, index }) => {
    const isSaved = isSchemeSaved(item.id);
    const relevanceColor = getRelevanceColor(item.relevanceScore);
    const relevanceLabel = getRelevanceLabel(item.relevanceScore);

    return (
      <View style={styles.schemeCard}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('SchemeDetail', { schemeId: item.id })}
        >
          {/* Relevance Score Badge */}
          <View style={styles.cardHeader}>
            <View style={[styles.relevanceBadge, { backgroundColor: relevanceColor + '20' }]}>
              <View style={[styles.relevanceCircle, { borderColor: relevanceColor }]}>
                <Text style={[styles.relevanceScore, { color: relevanceColor }]}>
                  {item.relevanceScore}
                </Text>
                <Text style={[styles.relevancePercent, { color: relevanceColor }]}>%</Text>
              </View>
              <View style={styles.relevanceLabelContainer}>
                <Text style={[styles.relevanceLabel, { color: relevanceColor }]}>
                  {relevanceLabel.en}
                </Text>
                <Text style={[styles.relevanceLabelHindi, { color: relevanceColor }]}>
                  {relevanceLabel.hi}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.bookmarkButton}
              onPress={() => toggleSaveScheme(item.id)}
            >
              <Ionicons
                name={isSaved ? 'bookmark' : 'bookmark-outline'}
                size={24}
                color={isSaved ? theme.colors.primary : theme.colors.gray500}
              />
            </TouchableOpacity>
          </View>

          {/* Scheme Info */}
          <View style={styles.cardContent}>
            <View style={styles.categoryBadge}>
              <MaterialCommunityIcons
                name={item.ministryIcon}
                size={16}
                color={theme.colors.primary}
              />
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>

            <Text style={styles.schemeName}>{item.name}</Text>
            <Text style={styles.schemeNameHindi}>{item.nameHindi}</Text>

            <Text style={styles.schemeDescription} numberOfLines={2}>
              {item.description}
            </Text>

            {/* Match Reason */}
            <View style={styles.matchReasonContainer}>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
              <Text style={styles.matchReasonText} numberOfLines={2}>
                {item.matchReason}
              </Text>
            </View>

            {/* Benefits */}
            <View style={styles.benefitsContainer}>
              <MaterialCommunityIcons name="gift" size={18} color={theme.colors.primary} />
              <View style={styles.benefitsTextContainer}>
                <Text style={styles.benefitsText}>{item.benefits}</Text>
                <Text style={styles.benefitsTextHindi}>{item.benefitsHindi}</Text>
              </View>
            </View>

            {/* Eligibility Matches */}
            <View style={styles.tagsContainer}>
              {item.eligibilityMatch.map((tag, idx) => (
                <View key={idx} style={styles.tag}>
                  <Ionicons name="checkmark" size={12} color={theme.colors.success} />
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>

            {/* Deadline */}
            {item.applicationDeadline !== 'Always Open' && (
              <View style={styles.deadlineContainer}>
                <Ionicons name="time-outline" size={14} color={theme.colors.warning} />
                <Text style={styles.deadlineText}>Apply by: {item.applicationDeadline}</Text>
              </View>
            )}
          </View>

          {/* Action Footer */}
          <View style={styles.cardFooter}>
            <TouchableOpacity
              style={styles.viewDetailsButton}
              onPress={() => navigation.navigate('SchemeDetail', { schemeId: item.id })}
            >
              <Text style={styles.viewDetailsText}>View Details</Text>
              <Ionicons name="arrow-forward" size={16} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.listHeader}>
      <View style={styles.resultsInfo}>
        <Text style={styles.resultsCount}>
          {filteredSchemes.length} Schemes Found
        </Text>
        <Text style={styles.resultsCountHindi}>
          {filteredSchemes.length} योजनाएं मिलीं
        </Text>
      </View>

      {query && (
        <View style={styles.queryCard}>
          <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
          <Text style={styles.queryText}>"{query}"</Text>
        </View>
      )}

      {/* Filters */}
      <View style={styles.filtersSection}>
        <Text style={styles.filterLabel}>Filter by Category:</Text>
        <FlatList
          horizontal
          data={FILTER_CATEGORIES}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                filterCategory === item.id && styles.filterChipActive,
              ]}
              onPress={() => setFilterCategory(item.id)}
            >
              <Ionicons
                name={item.icon}
                size={16}
                color={filterCategory === item.id ? theme.colors.white : theme.colors.gray600}
              />
              <Text
                style={[
                  styles.filterChipText,
                  filterCategory === item.id && styles.filterChipTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Sort Options */}
      <View style={styles.sortSection}>
        <Text style={styles.filterLabel}>Sort by:</Text>
        <View style={styles.sortButtons}>
          {SORT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.sortButton,
                sortBy === option.id && styles.sortButtonActive,
              ]}
              onPress={() => setSortBy(option.id)}
            >
              <Ionicons
                name={option.icon}
                size={16}
                color={sortBy === option.id ? theme.colors.primary : theme.colors.gray600}
              />
              <Text
                style={[
                  styles.sortButtonText,
                  sortBy === option.id && styles.sortButtonTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="file-document-outline" size={64} color={theme.colors.gray400} />
      <Text style={styles.emptyTitle}>No Schemes Found</Text>
      <Text style={styles.emptySubtitle}>Try adjusting your filters or search query</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Matching Schemes</Text>
          <Text style={styles.headerSubtitle}>मेल खाती योजनाएं</Text>
        </View>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('SavedSchemes')}
        >
          <Ionicons name="bookmark" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Scheme List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Finding best schemes for you...</Text>
          <Text style={styles.loadingTextHindi}>आपके लिए सर्वोत्तम योजनाएं खोज रहे हैं...</Text>
        </View>
      ) : (
        <Animated.FlatList
          data={filteredSchemes}
          renderItem={renderSchemeCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    ...theme.elevation.small,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  headerTitle: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
  },
  headerSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  headerButton: {
    padding: theme.spacing.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  loadingText: {
    ...theme.typography.body1,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.md,
  },
  loadingTextHindi: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  listContent: {
    padding: theme.spacing.lg,
  },
  listHeader: {
    marginBottom: theme.spacing.md,
  },
  resultsInfo: {
    marginBottom: theme.spacing.md,
  },
  resultsCount: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
  },
  resultsCountHindi: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
  },
  queryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.gray100,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  queryText: {
    ...theme.typography.body1,
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  filtersSection: {
    marginBottom: theme.spacing.md,
  },
  filterLabel: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    fontWeight: '600',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.gray100,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
  },
  filterChipText: {
    ...theme.typography.body2,
    color: theme.colors.gray600,
    marginLeft: theme.spacing.xs,
  },
  filterChipTextActive: {
    color: theme.colors.white,
    fontWeight: '600',
  },
  sortSection: {
    marginBottom: theme.spacing.lg,
  },
  sortButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sortButtonActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '10',
  },
  sortButtonText: {
    ...theme.typography.body2,
    color: theme.colors.gray600,
    marginLeft: theme.spacing.xs,
  },
  sortButtonTextActive: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  schemeCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    ...theme.elevation.medium,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.gray50,
  },
  relevanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  relevanceCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
  },
  relevanceScore: {
    ...theme.typography.h3,
    fontWeight: '700',
    lineHeight: 28,
  },
  relevancePercent: {
    ...theme.typography.caption,
    fontWeight: '600',
  },
  relevanceLabelContainer: {
    marginLeft: theme.spacing.sm,
  },
  relevanceLabel: {
    ...theme.typography.body2,
    fontWeight: '600',
  },
  relevanceLabelHindi: {
    ...theme.typography.caption,
  },
  bookmarkButton: {
    padding: theme.spacing.xs,
  },
  cardContent: {
    padding: theme.spacing.lg,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary + '15',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.sm,
  },
  categoryText: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: '600',
    marginLeft: theme.spacing.xs,
  },
  schemeName: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  schemeNameHindi: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  schemeDescription: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  matchReasonContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.success + '10',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.md,
  },
  matchReasonText: {
    ...theme.typography.caption,
    color: theme.colors.success,
    marginLeft: theme.spacing.xs,
    flex: 1,
    fontWeight: '500',
  },
  benefitsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '10',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  benefitsTextContainer: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  benefitsText: {
    ...theme.typography.body1,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  benefitsTextHindi: {
    ...theme.typography.caption,
    color: theme.colors.primary,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.gray100,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  tagText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginLeft: 2,
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deadlineText: {
    ...theme.typography.caption,
    color: theme.colors.warning,
    marginLeft: theme.spacing.xs,
    fontWeight: '600',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    padding: theme.spacing.md,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewDetailsText: {
    ...theme.typography.body1,
    color: theme.colors.primary,
    fontWeight: '600',
    marginRight: theme.spacing.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    marginTop: theme.spacing.xxl,
  },
  emptyTitle: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.md,
  },
  emptySubtitle: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
});
