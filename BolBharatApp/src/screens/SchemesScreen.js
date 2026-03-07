import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { useLanguage } from '../i18n/LanguageContext';
import { saveApplication } from '../api/database';

const LAMBDA_URL = 'https://ci45mlntxomy3rta7a2rb6qidu0wusvg.lambda-url.eu-north-1.on.aws/';

const CATEGORIES = ['All', 'Agriculture', 'Healthcare', 'Housing', 'Financial Services', 'Women Empowerment', 'Social Welfare'];

const USER_ID = 'user123'; // Replace with real user ID later

export default function SchemesScreen() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [schemes, setSchemes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [applyingId, setApplyingId] = useState(null);
  const [appliedIds, setAppliedIds] = useState([]);

  const fetchSchemes = async (category, query) => {
    setIsLoading(true);
    setHasSearched(true);

    const prompt = query
      ? `List 5 Indian government schemes related to "${query}" in the ${category === 'All' ? 'any' : category} category.`
      : `List 6 Indian government schemes in the ${category === 'All' ? 'all categories' : category} category.`;

    try {
      const res = await fetch(LAMBDA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: 'en',
          userMessage: `${prompt}
          
Return ONLY a JSON array (no explanation, no markdown) like this:
[
  {
    "id": "1",
    "name": "Scheme Name",
    "category": "Agriculture",
    "relevance": 95,
    "description": "Short description in 1 sentence.",
    "eligibility": "Who can apply",
    "benefit": "Key benefit amount or type"
  }
]`,
        }),
      });

      const data = await res.json();
      const text = data.response || '';

      // Extract JSON from response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setSchemes(parsed);
      } else {
        setSchemes([]);
      }
    } catch (err) {
      console.error('Schemes fetch error:', err);
      setSchemes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    fetchSchemes(category, searchQuery);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchSchemes(activeCategory, searchQuery);
    }
  };

  const handleApply = async (scheme) => {
    setApplyingId(scheme.id);
    await saveApplication(USER_ID, scheme.name);
    setAppliedIds(prev => [...prev, scheme.id]);
    setApplyingId(null);
  };

  const renderSchemeCard = ({ item }) => (
    <View style={styles.schemeCard}>
      <View style={styles.cardHeader}>
        <View style={styles.relevanceBadge}>
          <Text style={styles.relevanceText}>{item.relevance}% match</Text>
        </View>
        <Text style={styles.category}>{item.category}</Text>
      </View>

      <Text style={styles.schemeName}>{item.name}</Text>
      <Text style={styles.schemeDescription}>{item.description}</Text>

      {item.eligibility && (
        <View style={styles.infoRow}>
          <Ionicons name="people-outline" size={14} color={theme.colors.textSecondary} />
          <Text style={styles.infoText}>{item.eligibility}</Text>
        </View>
      )}

      {item.benefit && (
        <View style={styles.infoRow}>
          <Ionicons name="gift-outline" size={14} color={theme.colors.textSecondary} />
          <Text style={styles.infoText}>{item.benefit}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.applyButton, appliedIds.includes(item.id) && styles.applyButtonDone]}
        onPress={() => handleApply(item)}
        disabled={appliedIds.includes(item.id) || applyingId === item.id}
      >
        {applyingId === item.id ? (
          <ActivityIndicator size="small" color={theme.colors.white} />
        ) : (
          <Text style={styles.applyButtonText}>
            {appliedIds.includes(item.id) ? '✅ Applied' : 'Apply Now'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('schemes')}</Text>
        <Text style={styles.subtitle}>AI-powered scheme finder</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search schemes (e.g. crop loan, housing)"
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={20} color={theme.colors.white} />
        </TouchableOpacity>
      </View>

      {/* Category Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.filterTab, activeCategory === category && styles.filterTabActive]}
              onPress={() => handleCategorySelect(category)}
            >
              <Text style={[styles.filterTabText, activeCategory === category && styles.filterTabTextActive]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Finding schemes for you...</Text>
        </View>
      ) : !hasSearched ? (
        <View style={styles.centerContainer}>
          <Ionicons name="search-circle-outline" size={80} color={theme.colors.border} />
          <Text style={styles.emptyTitle}>Discover Government Schemes</Text>
          <Text style={styles.emptyText}>Select a category or search to find schemes you qualify for</Text>
          <TouchableOpacity style={styles.exploreButton} onPress={() => handleCategorySelect('All')}>
            <Text style={styles.exploreButtonText}>Explore All Schemes</Text>
          </TouchableOpacity>
        </View>
      ) : schemes.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No schemes found. Try a different search.</Text>
        </View>
      ) : (
        <FlatList
          data={schemes}
          renderItem={renderSchemeCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: { ...theme.typography.h2, color: theme.colors.textPrimary },
  subtitle: { ...theme.typography.body2, color: theme.colors.textSecondary, marginTop: 2 },
  searchContainer: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.typography.body1,
    color: theme.colors.textPrimary,
  },
  searchButton: {
    width: 48,
    height: 48,
    backgroundColor: theme.colors.black,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  filterTab: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterTabActive: { backgroundColor: theme.colors.black, borderColor: theme.colors.black },
  filterTabText: { ...theme.typography.body2, color: theme.colors.textPrimary },
  filterTabTextActive: { color: theme.colors.white, fontWeight: 'bold' },
  listContent: { padding: theme.spacing.lg },
  schemeCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  relevanceBadge: {
    backgroundColor: theme.colors.black,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  relevanceText: { fontSize: 11, color: theme.colors.white, fontWeight: 'bold' },
  category: { ...theme.typography.caption, color: theme.colors.textSecondary },
  schemeName: { ...theme.typography.h4, color: theme.colors.textPrimary, marginBottom: 4 },
  schemeDescription: { ...theme.typography.body2, color: theme.colors.textSecondary, marginBottom: theme.spacing.sm },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 4 },
  infoText: { ...theme.typography.caption, color: theme.colors.textSecondary, flex: 1 },
  applyButton: {
    backgroundColor: theme.colors.black,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignSelf: 'flex-start',
    marginTop: theme.spacing.md,
    minWidth: 100,
    alignItems: 'center',
  },
  applyButtonDone: { backgroundColor: '#4CAF50' },
  applyButtonText: { color: theme.colors.white, fontWeight: 'bold', fontSize: 13 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.xl },
  loadingText: { ...theme.typography.body2, color: theme.colors.textSecondary, marginTop: theme.spacing.md },
  emptyTitle: { ...theme.typography.h3, color: theme.colors.textPrimary, marginTop: theme.spacing.lg, textAlign: 'center' },
  emptyText: { ...theme.typography.body2, color: theme.colors.textSecondary, textAlign: 'center', marginTop: theme.spacing.sm },
  exploreButton: {
    backgroundColor: theme.colors.black,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    marginTop: theme.spacing.xl,
  },
  exploreButtonText: { color: theme.colors.white, fontWeight: 'bold' },
});