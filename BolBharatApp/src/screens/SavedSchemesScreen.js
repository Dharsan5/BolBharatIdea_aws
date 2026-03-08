import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';
import { useSavedSchemes } from '../context/SavedSchemesContext';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSchemeDetails } from '../store/slices/schemesSlice';

export default function SavedSchemesScreen({ navigation }) {
  const dispatch = useDispatch();
  const reduxSchemes = useSelector(state => state.schemes.schemes);
  const { savedSchemeIds, removeSavedScheme } = useSavedSchemes();
  const [removingId, setRemovingId] = useState(null);

  // Convert Redux schemes array to object for easy lookup
  const schemesMap = {};
  if (reduxSchemes) {
    reduxSchemes.forEach(scheme => {
      schemesMap[scheme.id] = scheme;
    });
  }

  const savedSchemes = savedSchemeIds
    .map(id => schemesMap[id])
    .filter(Boolean);

  const handleRemoveSaved = async (schemeId) => {
    setRemovingId(schemeId);
    // Add slight delay for animation feedback
    setTimeout(async () => {
      await removeSavedScheme(schemeId);
      setRemovingId(null);
    }, 200);
  };

  const handleViewDetails = (schemeId) => {
    navigation.navigate('SchemeDetail', { schemeId });
  };

  const renderSchemeCard = ({ item }) => {
    const isRemoving = removingId === item.id;
    
    return (
      <Animated.View
        style={[
          styles.schemeCard,
          isRemoving && styles.schemeCardRemoving,
        ]}
      >
        <TouchableOpacity
          style={styles.cardContent}
          onPress={() => handleViewDetails(item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
            <View style={styles.relevanceBadge}>
              <View style={styles.relevanceDot} />
              <Text style={styles.relevanceText}>{item.relevance}% Match</Text>
            </View>
          </View>

          <Text style={styles.schemeName}>{item.name}</Text>
          <Text style={styles.schemeNameHindi}>{item.nameHindi}</Text>
          <Text style={styles.schemeDescription} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.benefitsContainer}>
            <Ionicons name="gift-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.benefitsText} numberOfLines={1}>
              {item.benefits}
            </Text>
          </View>

          <View style={styles.cardActions}>
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => handleViewDetails(item.id)}
            >
              <Text style={styles.viewButtonText}>View Details</Text>
              <Ionicons name="arrow-forward" size={16} color={colors.white} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveSaved(item.id)}
            >
              <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="bookmark-outline" size={64} color={colors.textDisabled} />
      </View>
      <Text style={styles.emptyTitle}>No Saved Schemes</Text>
      <Text style={styles.emptySubtext}>
        Schemes you bookmark will appear here for quick access
      </Text>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => navigation.navigate('SchemesList')}
      >
        <Ionicons name="search-outline" size={20} color={colors.white} />
        <Text style={styles.exploreButtonText}>Explore Schemes</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading saved schemes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.black} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.title}>Saved Schemes</Text>
          <Text style={styles.subtitle}>
            {savedSchemes.length} scheme{savedSchemes.length !== 1 ? 's' : ''} saved
          </Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      {/* Schemes List */}
      <FlatList
        data={savedSchemes}
        renderItem={renderSchemeCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          savedSchemes.length === 0 && styles.listContentEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState />}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
  },
  headerRight: {
    width: 40,
  },
  
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },
  
  // List
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  
  // Scheme Card
  schemeCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.gray200,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  schemeCardRemoving: {
    opacity: 0.5,
    transform: [{ scale: 0.98 }],
  },
  cardContent: {
    padding: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray50,
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  benefitsText: {
    flex: 1,
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
    color: colors.textPrimary,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  viewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.black,
    borderRadius: 12,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  viewButtonText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.white,
  },
  removeButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.gray50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl * 2,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.gray50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: 16,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.black,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    gap: spacing.sm,
  },
  exploreButtonText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.white,
  },
});
