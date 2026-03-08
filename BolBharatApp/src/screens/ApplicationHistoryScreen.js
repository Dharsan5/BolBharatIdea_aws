import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  RefreshControl,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, typography } from '../theme';

const STATUS_CONFIG = {
  draft: {
    color: colors.textSecondary,
    bgColor: colors.gray100,
    label: 'Draft',
    labelHindi: 'ड्राफ़्ट',
    icon: 'document-outline',
  },
  submitted: {
    color: '#2196F3',
    bgColor: '#E3F2FD',
    label: 'Submitted',
    labelHindi: 'जमा किया',
    icon: 'cloud-upload-outline',
  },
  processing: {
    color: '#FF9800',
    bgColor: '#FFF3E0',
    label: 'Processing',
    labelHindi: 'संसाधित',
    icon: 'sync-outline',
  },
  under_review: {
    color: '#9C27B0',
    bgColor: '#F3E5F5',
    label: 'Under Review',
    labelHindi: 'समीक्षाधीन',
    icon: 'eye-outline',
  },
  approved: {
    color: '#4CAF50',
    bgColor: '#E8F5E9',
    label: 'Approved',
    labelHindi: 'स्वीकृत',
    icon: 'checkmark-circle-outline',
  },
  rejected: {
    color: '#F44336',
    bgColor: '#FFEBEE',
    label: 'Rejected',
    labelHindi: 'अस्वीकृत',
    icon: 'close-circle-outline',
  },
  completed: {
    color: '#00BCD4',
    bgColor: '#E0F7FA',
    label: 'Completed',
    labelHindi: 'पूर्ण',
    icon: 'checkmark-done-outline',
  },
};

export default function ApplicationHistoryScreen({ navigation }) {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filterCounts, setFilterCounts] = useState({});

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedFilter, searchQuery, applications]);

  const loadApplications = async () => {
    try {
      const storedApps = await AsyncStorage.getItem('submittedApplications');
      const apps = storedApps ? JSON.parse(storedApps) : [];
      setApplications(apps);
      calculateFilterCounts(apps);
    } catch (error) {
      console.error('Failed to load applications:', error);
      setApplications([]);
      calculateFilterCounts([]);
    }
  };

  const calculateFilterCounts = (apps) => {
    const counts = {
      all: apps.length,
      submitted: apps.filter(a => a.status === 'submitted').length,
      processing: apps.filter(a => a.status === 'processing' || a.status === 'under_review').length,
      approved: apps.filter(a => a.status === 'approved' || a.status === 'completed').length,
      draft: apps.filter(a => a.status === 'draft').length,
    };
    setFilterCounts(counts);
  };

  const applyFilters = () => {
    let filtered = [...applications];

    // Apply status filter
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'processing') {
        filtered = filtered.filter(app => 
          app.status === 'processing' || app.status === 'under_review'
        );
      } else if (selectedFilter === 'approved') {
        filtered = filtered.filter(app => 
          app.status === 'approved' || app.status === 'completed'
        );
      } else {
        filtered = filtered.filter(app => app.status === selectedFilter);
      }
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app =>
        app.schemeName.toLowerCase().includes(query) ||
        app.schemeNameHindi.includes(query) ||
        (app.applicationNumber && app.applicationNumber.toLowerCase().includes(query)) ||
        app.category.toLowerCase().includes(query)
      );
    }

    setFilteredApplications(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadApplications();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const renderApplicationCard = (application) => {
    const statusConfig = STATUS_CONFIG[application.status];
    
    return (
      <TouchableOpacity
        key={application.id}
        style={styles.applicationCard}
        onPress={() => {
          // Navigate to application status tracking screen
          navigation.navigate('ApplicationStatusTracking', { applicationId: application.id });
        }}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
              <Ionicons name={statusConfig.icon} size={16} color={statusConfig.color} />
              <Text style={[styles.statusText, { color: statusConfig.color }]}>
                {statusConfig.label}
              </Text>
            </View>
          </View>
          {application.applicationNumber && (
            <Text style={styles.applicationNumber}>#{application.applicationNumber}</Text>
          )}
        </View>

        <Text style={styles.schemeName}>{application.schemeName}</Text>
        <Text style={styles.schemeNameHindi}>{application.schemeNameHindi}</Text>

        <View style={styles.cardDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="folder-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>{application.category}</Text>
          </View>
          {application.submittedDate && (
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.detailText}>
                Submitted: {formatDate(application.submittedDate)}
              </Text>
            </View>
          )}
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>
              Updated: {formatDate(application.lastUpdated)}
            </Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="eye-outline" size={18} color={colors.primary} />
            <Text style={styles.actionButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.black} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.title}>My Applications</Text>
          <Text style={styles.subtitle}>मेरे आवेदन</Text>
        </View>
        <View style={styles.headerButton} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search applications..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterScrollView}
        contentContainerStyle={styles.filterContainer}
      >
        {FILTER_OPTIONS.map((filter) => {
          const isSelected = selectedFilter === filter.id;
          const count = filterCounts[filter.id] || 0;
          
          return (
            <Pressable
              key={filter.id}
              style={({ pressed }) => [
                styles.filterChip,
                isSelected && styles.filterChipSelected,
                pressed && styles.filterChipPressed,
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <Text style={[
                styles.filterChipText,
                isSelected && styles.filterChipTextSelected,
              ]}>
                {filter.label}
              </Text>
              {count > 0 && (
                <View style={[
                  styles.filterBadge,
                  isSelected && styles.filterBadgeSelected,
                ]}>
                  <Text style={[
                    styles.filterBadgeText,
                    isSelected && styles.filterBadgeTextSelected,
                  ]}>
                    {count}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Applications List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredApplications.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="file-document-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyStateTitle}>No Applications Found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery.trim() 
                ? 'Try adjusting your search or filters'
                : 'You haven\'t submitted any applications yet'}
            </Text>
            {!searchQuery.trim() && (
              <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={() => navigation.navigate('Schemes')}
              >
                <Text style={styles.emptyStateButtonText}>Browse Schemes</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <>
            <View style={styles.resultsSummary}>
              <Text style={styles.resultsText}>
                {filteredApplications.length} {filteredApplications.length === 1 ? 'application' : 'applications'} found
              </Text>
            </View>
            {filteredApplications.map(renderApplicationCard)}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  headerButton: {
    padding: spacing.xs,
    minWidth: 60,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    ...typography.h3,
    color: colors.black,
    fontWeight: '600',
  },
  subtitle: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    paddingVertical: spacing.xs,
  },
  filterScrollView: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.lg,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  filterChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipPressed: {
    opacity: 0.7,
  },
  filterChipText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
  },
  filterChipTextSelected: {
    color: colors.white,
  },
  filterBadge: {
    backgroundColor: colors.white,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  filterBadgeSelected: {
    backgroundColor: colors.white,
  },
  filterBadgeText: {
    ...typography.small,
    color: colors.text,
    fontWeight: '600',
    fontSize: 11,
  },
  filterBadgeTextSelected: {
    color: colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  resultsSummary: {
    marginBottom: spacing.sm,
  },
  resultsText: {
    ...typography.small,
    color: colors.textSecondary,
  },
  applicationCard: {
    backgroundColor: colors.white,
    borderRadius: spacing.sm,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  statusText: {
    ...typography.small,
    fontWeight: '600',
    fontSize: 11,
  },
  applicationNumber: {
    ...typography.small,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  schemeName: {
    ...typography.h3,
    color: colors.black,
    fontWeight: '600',
    marginBottom: 4,
  },
  schemeNameHindi: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  cardDetails: {
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  detailText: {
    ...typography.small,
    color: colors.textSecondary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionButtonText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
    paddingHorizontal: spacing.lg,
  },
  emptyStateTitle: {
    ...typography.h3,
    color: colors.black,
    fontWeight: '600',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptyStateText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyStateButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: spacing.sm,
    marginTop: spacing.md,
  },
  emptyStateButtonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: '600',
  },
});
