import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';

const MOCK_SCHEMES = [
  {
    id: '1',
    name: 'Pradhan Mantri Fasal Bima Yojana',
    nameHindi: 'प्रधानमंत्री फसल बीमा योजना',
    category: 'Agriculture',
    relevance: 95,
  },
  {
    id: '2',
    name: 'PM Kisan Samman Nidhi',
    nameHindi: 'पीएम किसान सम्मान निधि',
    category: 'Agriculture',
    relevance: 92,
  },
  {
    id: '3',
    name: 'Ayushman Bharat',
    nameHindi: 'आयुष्मान भारत',
    category: 'Healthcare',
    relevance: 88,
  },
];

export default function SchemesScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const renderSchemeCard = ({ item }) => (
    <TouchableOpacity style={styles.schemeCard}>
      <View style={styles.cardHeader}>
        <View style={styles.relevanceBadge}>
          <Text style={styles.relevanceText}>{item.relevance}% Match</Text>
        </View>
        <Text style={styles.category}>{item.category}</Text>
      </View>
      
      <Text style={styles.schemeName}>{item.name}</Text>
      <Text style={styles.schemeNameHindi}>{item.nameHindi}</Text>
      
      <TouchableOpacity style={styles.detailsButton}>
        <Text style={styles.detailsButtonText}>View Details →</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Schemes</Text>
        <Text style={styles.subtitle}>योजनाएं</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search schemes..."
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity style={[styles.filterTab, styles.filterTabActive]}>
          <Text style={styles.filterTabTextActive}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterTab}>
          <Text style={styles.filterTabText}>Agriculture</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterTab}>
          <Text style={styles.filterTabText}>Healthcare</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterTab}>
          <Text style={styles.filterTabText}>Education</Text>
        </TouchableOpacity>
      </View>

      {/* Schemes List */}
      <FlatList
        data={MOCK_SCHEMES}
        renderItem={renderSchemeCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  searchContainer: {
    padding: theme.spacing.lg,
  },
  searchInput: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.typography.body1,
    color: theme.colors.textPrimary,
  },
  filterContainer: {
    flexDirection: 'row',
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
  filterTabActive: {
    backgroundColor: theme.colors.black,
    borderColor: theme.colors.black,
  },
  filterTabText: {
    ...theme.typography.body2,
    color: theme.colors.textPrimary,
  },
  filterTabTextActive: {
    fontFamily: theme.fontFamilies.semiBold,
    fontSize: theme.typography.fontSize.sm,
    lineHeight: 20,
    color: theme.colors.white,
  },
  listContent: {
    padding: theme.spacing.lg,
  },
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
  relevanceText: {
    fontFamily: theme.fontFamilies.semiBold,
    fontSize: theme.typography.fontSize.xs,
    lineHeight: 16,
    color: theme.colors.white,
  },
  category: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  schemeName: {
    ...theme.typography.subtitle,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  schemeNameHindi: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  detailsButton: {
    alignSelf: 'flex-start',
  },
  detailsButtonText: {
    fontFamily: theme.fontFamilies.semiBold,
    fontSize: theme.typography.fontSize.sm,
    lineHeight: 20,
    color: theme.colors.textPrimary,
  },
});
