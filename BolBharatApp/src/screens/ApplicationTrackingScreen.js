import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, typography } from '../theme';

const STATUS_COLORS = {
  submitted: '#2196F3',
  processing: '#FF9933',
  verification: '#9C27B0',
  approved: '#4CAF50',
  rejected: '#F44336',
  pending: '#FFC107',
};

const STATUS_ICONS = {
  submitted: 'cloud-upload-outline',
  processing: 'sync-outline',
  verification: 'search-outline',
  approved: 'checkmark-circle-outline',
  rejected: 'close-circle-outline',
  pending: 'time-outline',
};

const FILTER_OPTIONS = [
  { key: 'all', labelEn: 'All', labelHi: 'सभी', icon: 'apps-outline' },
  { key: 'submitted', labelEn: 'Submitted', labelHi: 'जमा किया', icon: 'cloud-upload-outline' },
  { key: 'processing', labelEn: 'Processing', labelHi: 'संसाधित', icon: 'sync-outline' },
  { key: 'verification', labelEn: 'Verification', labelHi: 'सत्यापन', icon: 'search-outline' },
  { key: 'approved', labelEn: 'Approved', labelHi: 'स्वीकृत', icon: 'checkmark-circle-outline' },
  { key: 'rejected', labelEn: 'Rejected', labelHi: 'अस्वीकृत', icon: 'close-circle-outline' },
];

export default function ApplicationTrackingScreen({ route, navigation }) {
  const [language, setLanguage] = useState('english');
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  useEffect(() => {
    loadApplications();
    
    // Check if navigated from confirmation screen with new application
    if (route.params?.referenceNumber) {
      setTimeout(() => {
        searchByReference(route.params.referenceNumber);
      }, 500);
    }
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, selectedFilter, searchQuery]);

  const loadApplications = async () => {
    try {
      const stored = await AsyncStorage.getItem('submittedApplications');
      if (stored) {
        const apps = JSON.parse(stored);
        setApplications(apps);
      } else {
        // Mock data for demonstration
        const mockApplications = generateMockApplications();
        setApplications(mockApplications);
        await AsyncStorage.setItem('submittedApplications', JSON.stringify(mockApplications));
      }
    } catch (error) {
      console.error('Error loading applications:', error);
    }
  };

  const generateMockApplications = () => {
    const statuses = ['submitted', 'processing', 'verification', 'approved', 'rejected'];
    const forms = [
      { name: 'Ration Card Application', nameHi: 'राशन कार्ड आवेदन' },
      { name: 'Health Card Application', nameHi: 'स्वास्थ्य कार्ड आवेदन' },
      { name: 'Crop Insurance', nameHi: 'फसल बीमा' },
      { name: 'Voter ID Application', nameHi: 'मतदाता पहचान पत्र आवेदन' },
      { name: 'Pension Application', nameHi: 'पेंशन आवेदन' },
    ];

    return Array.from({ length: 8 }, (_, i) => {
      const form = forms[i % forms.length];
      const status = statuses[i % statuses.length];
      const daysAgo = Math.floor(Math.random() * 30) + 1;
      const submissionDate = new Date();
      submissionDate.setDate(submissionDate.getDate() - daysAgo);

      return {
        id: `app-${i + 1}`,
        referenceNumber: `BOLB${String(12345678 + i).padStart(8, '0')}`,
        formName: form.name,
        formNameHindi: form.nameHi,
        status: status,
        submittedDate: submissionDate.toLocaleDateString('en-IN'),
        lastUpdated: new Date(submissionDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
        department: 'Department of Social Welfare',
        departmentHindi: 'समाज कल्याण विभाग',
        estimatedCompletion: status === 'approved' || status === 'rejected' ? null : '3-5 days',
        timeline: generateTimeline(status),
      };
    });
  };

  const generateTimeline = (currentStatus) => {
    const allSteps = [
      { key: 'submitted', labelEn: 'Submitted', labelHi: 'जमा किया गया', date: null },
      { key: 'processing', labelEn: 'Processing', labelHi: 'संसाधित हो रहा है', date: null },
      { key: 'verification', labelEn: 'Verification', labelHi: 'सत्यापन', date: null },
      { key: currentStatus === 'approved' ? 'approved' : 'rejected', labelEn: currentStatus === 'approved' ? 'Approved' : currentStatus === 'rejected' ? 'Rejected' : 'Final Review', labelHi: currentStatus === 'approved' ? 'स्वीकृत' : currentStatus === 'rejected' ? 'अस्वीकृत' : 'अंतिम समीक्षा', date: null },
    ];

    const statusOrder = ['submitted', 'processing', 'verification', 'approved', 'rejected'];
    const currentIndex = statusOrder.indexOf(currentStatus);

    return allSteps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex,
    }));
  };

  const filterApplications = () => {
    let filtered = applications;

    // Filter by status
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(app => app.status === selectedFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app =>
        app.referenceNumber.toLowerCase().includes(query) ||
        app.formName.toLowerCase().includes(query) ||
        app.formNameHindi.includes(query)
      );
    }

    // Sort by date (most recent first)
    filtered.sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate));

    setFilteredApplications(filtered);
  };

  const searchByReference = (refNumber) => {
    const app = applications.find(a => a.referenceNumber === refNumber);
    if (app) {
      setSelectedApplication(app);
      setIsDetailModalVisible(true);
    } else {
      Alert.alert(
        language === 'hindi' ? 'नहीं मिला' : 'Not Found',
        language === 'hindi'
          ? 'इस संदर्भ संख्या के साथ कोई आवेदन नहीं मिला।'
          : 'No application found with this reference number.'
      );
    }
  };

  const handleApplicationPress = (app) => {
    setSelectedApplication(app);
    setIsDetailModalVisible(true);
  };

  const handleRefresh = async () => {
    // In real implementation, this would fetch from backend
    await loadApplications();
    Alert.alert(
      language === 'hindi' ? 'ताज़ा किया गया' : 'Refreshed',
      language === 'hindi'
        ? 'आवेदन स्थिति अपडेट की गई'
        : 'Application status updated'
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
      </TouchableOpacity>
      <View style={styles.headerTextContainer}>
        <Text style={styles.headerTitle}>
          {language === 'hindi' ? 'आवेदन ट्रैकिंग' : 'Track Applications'}
        </Text>
        <Text style={styles.headerSubtitle}>
          {filteredApplications.length} {language === 'hindi' ? 'आवेदन' : 'applications'}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={handleRefresh}
        activeOpacity={0.7}
      >
        <Ionicons name="refresh" size={24} color={colors.textPrimary} />
      </TouchableOpacity>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={20} color={colors.textDisabled} style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder={language === 'hindi' ? 'संदर्भ संख्या से खोजें...' : 'Search by reference number...'}
        placeholderTextColor={colors.textDisabled}
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoCapitalize="characters"
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity
          onPress={() => setSearchQuery('')}
          style={styles.clearButton}
        >
          <Ionicons name="close-circle" size={20} color={colors.textDisabled} />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderFilters = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filtersContainer}
      contentContainerStyle={styles.filtersContent}
    >
      {FILTER_OPTIONS.map((filter) => (
        <TouchableOpacity
          key={filter.key}
          style={[
            styles.filterChip,
            selectedFilter === filter.key && styles.filterChipActive,
          ]}
          onPress={() => setSelectedFilter(filter.key)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={filter.icon}
            size={16}
            color={selectedFilter === filter.key ? colors.white : colors.textSecondary}
          />
          <Text
            style={[
              styles.filterChipText,
              selectedFilter === filter.key && styles.filterChipTextActive,
            ]}
          >
            {language === 'hindi' ? filter.labelHi : filter.labelEn}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderApplicationCard = (app) => (
    <TouchableOpacity
      key={app.id}
      style={styles.applicationCard}
      onPress={() => handleApplicationPress(app)}
      activeOpacity={0.7}
    >
      {/* Status Badge */}
      <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[app.status] }]}>
        <Ionicons name={STATUS_ICONS[app.status]} size={16} color={colors.white} />
        <Text style={styles.statusBadgeText}>
          {language === 'hindi' 
            ? FILTER_OPTIONS.find(f => f.key === app.status)?.labelHi
            : FILTER_OPTIONS.find(f => f.key === app.status)?.labelEn}
        </Text>
      </View>

      {/* Form Name */}
      <Text style={styles.cardFormName} numberOfLines={2}>
        {language === 'hindi' ? app.formNameHindi : app.formName}
      </Text>

      {/* Reference Number */}
      <View style={styles.cardRow}>
        <Ionicons name="barcode-outline" size={16} color={colors.textSecondary} />
        <Text style={styles.cardReferenceNumber}>{app.referenceNumber}</Text>
      </View>

      {/* Date */}
      <View style={styles.cardRow}>
        <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
        <Text style={styles.cardDate}>
          {language === 'hindi' ? 'जमा: ' : 'Submitted: '}{app.submittedDate}
        </Text>
      </View>

      {/* Last Updated */}
      <View style={styles.cardRow}>
        <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
        <Text style={styles.cardDate}>
          {language === 'hindi' ? 'अपडेट: ' : 'Updated: '}{app.lastUpdated}
        </Text>
      </View>

      {/* Estimated Completion */}
      {app.estimatedCompletion && (
        <View style={styles.estimatedBadge}>
          <MaterialCommunityIcons name="clock-fast" size={14} color="#FF9933" />
          <Text style={styles.estimatedText}>
            {language === 'hindi' ? 'अनुमानित: ' : 'Est: '}{app.estimatedCompletion}
          </Text>
        </View>
      )}

      {/* Arrow */}
      <View style={styles.cardArrow}>
        <Ionicons name="chevron-forward" size={20} color={colors.textDisabled} />
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons name="file-document-alert-outline" size={80} color={colors.textDisabled} />
      <Text style={styles.emptyStateTitle}>
        {language === 'hindi' ? 'कोई आवेदन नहीं मिला' : 'No Applications Found'}
      </Text>
      <Text style={styles.emptyStateMessage}>
        {language === 'hindi'
          ? 'आपके द्वारा जमा किए गए आवेदन यहाँ दिखाई देंगे'
          : 'Applications you submit will appear here'}
      </Text>
      <TouchableOpacity
        style={styles.emptyStateButton}
        onPress={() => navigation.navigate('FormSelection')}
        activeOpacity={0.8}
      >
        <Ionicons name="add-circle" size={20} color={colors.white} />
        <Text style={styles.emptyStateButtonText}>
          {language === 'hindi' ? 'नया फॉर्म भरें' : 'Fill New Form'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderDetailModal = () => {
    if (!selectedApplication) return null;

    return (
      <Modal
        visible={isDetailModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsDetailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {language === 'hindi' ? 'आवेदन विवरण' : 'Application Details'}
              </Text>
              <TouchableOpacity
                onPress={() => setIsDetailModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {/* Status Card */}
              <View style={[styles.detailStatusCard, { backgroundColor: STATUS_COLORS[selectedApplication.status] }]}>
                <Ionicons name={STATUS_ICONS[selectedApplication.status]} size={48} color={colors.white} />
                <Text style={styles.detailStatusText}>
                  {language === 'hindi'
                    ? FILTER_OPTIONS.find(f => f.key === selectedApplication.status)?.labelHi
                    : FILTER_OPTIONS.find(f => f.key === selectedApplication.status)?.labelEn}
                </Text>
              </View>

              {/* Form Details */}
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>
                  {language === 'hindi' ? 'फॉर्म जानकारी' : 'Form Information'}
                </Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>
                    {language === 'hindi' ? 'फॉर्म का नाम:' : 'Form Name:'}
                  </Text>
                  <Text style={styles.detailValue}>
                    {language === 'hindi' ? selectedApplication.formNameHindi : selectedApplication.formName}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>
                    {language === 'hindi' ? 'संदर्भ संख्या:' : 'Reference Number:'}
                  </Text>
                  <Text style={[styles.detailValue, styles.detailValueBold]}>
                    {selectedApplication.referenceNumber}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>
                    {language === 'hindi' ? 'विभाग:' : 'Department:'}
                  </Text>
                  <Text style={styles.detailValue}>
                    {language === 'hindi' ? selectedApplication.departmentHindi : selectedApplication.department}
                  </Text>
                </View>
              </View>

              {/* Timeline */}
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>
                  {language === 'hindi' ? 'प्रगति टाइमलाइन' : 'Progress Timeline'}
                </Text>
                {selectedApplication.timeline.map((step, index) => (
                  <View key={step.key} style={styles.timelineItem}>
                    <View style={styles.timelineIconContainer}>
                      <View style={[
                        styles.timelineIcon,
                        step.completed && styles.timelineIconCompleted,
                        step.current && styles.timelineIconCurrent,
                      ]}>
                        {step.completed ? (
                          <Ionicons name="checkmark" size={16} color={colors.white} />
                        ) : (
                          <View style={styles.timelineIconDot} />
                        )}
                      </View>
                      {index < selectedApplication.timeline.length - 1 && (
                        <View style={[
                          styles.timelineLine,
                          step.completed && styles.timelineLineCompleted,
                        ]} />
                      )}
                    </View>
                    <View style={styles.timelineContent}>
                      <Text style={[
                        styles.timelineLabel,
                        step.completed && styles.timelineLabelCompleted,
                      ]}>
                        {language === 'hindi' ? step.labelHi : step.labelEn}
                      </Text>
                      {step.date && (
                        <Text style={styles.timelineDate}>{step.date}</Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>

              {/* Dates */}
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>
                  {language === 'hindi' ? 'महत्वपूर्ण तिथियां' : 'Important Dates'}
                </Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>
                    {language === 'hindi' ? 'जमा की तारीख:' : 'Submitted Date:'}
                  </Text>
                  <Text style={styles.detailValue}>{selectedApplication.submittedDate}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>
                    {language === 'hindi' ? 'अंतिम अपडेट:' : 'Last Updated:'}
                  </Text>
                  <Text style={styles.detailValue}>{selectedApplication.lastUpdated}</Text>
                </View>
                {selectedApplication.estimatedCompletion && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>
                      {language === 'hindi' ? 'अनुमानित पूर्णता:' : 'Estimated Completion:'}
                    </Text>
                    <Text style={styles.detailValue}>{selectedApplication.estimatedCompletion}</Text>
                  </View>
                )}
              </View>

              {/* Note */}
              <View style={styles.noteCard}>
                <Ionicons name="information-circle" size={20} color="#FF9933" />
                <Text style={styles.noteText}>
                  {language === 'hindi'
                    ? 'अपडेट के लिए अपने पंजीकृत फोन नंबर और ईमेल की जांच करें।'
                    : 'Check your registered phone number and email for updates.'}
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalActionButton}
                  onPress={() => {
                    setIsDetailModalVisible(false);
                    // TODO: Navigate to support/contact
                  }}
                  activeOpacity={0.8}
                >
                  <Ionicons name="help-circle-outline" size={20} color={colors.white} />
                  <Text style={styles.modalActionButtonText}>
                    {language === 'hindi' ? 'सहायता से संपर्क करें' : 'Contact Support'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {renderHeader()}
      
      <View style={styles.content}>
        {renderSearchBar()}
        {renderFilters()}

        <ScrollView
          style={styles.listContainer}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredApplications.length === 0 ? (
            renderEmptyState()
          ) : (
            filteredApplications.map(renderApplicationCard)
          )}
        </ScrollView>
      </View>

      {/* Language Toggle */}
      <TouchableOpacity
        style={styles.languageToggle}
        onPress={() => setLanguage(language === 'english' ? 'hindi' : 'english')}
      >
        <Ionicons name="language" size={20} color={colors.white} />
        <Text style={styles.languageToggleText}>
          {language === 'english' ? 'हिंदी' : 'English'}
        </Text>
      </TouchableOpacity>

      {renderDetailModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: colors.gray200,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.gray200,
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    marginTop: 2,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.gray200,
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    height: 48,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.gray200,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
  },
  clearButton: {
    padding: spacing.xs,
  },

  // Filters
  filtersContainer: {
    marginBottom: spacing.md,
  },
  filtersContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.gray200,
    gap: spacing.xs,
  },
  filterChipActive: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  filterChipText: {
    fontSize: 13,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: colors.white,
  },

  // List
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  // Application Card
  applicationCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.gray200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  statusBadgeText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
    textTransform: 'uppercase',
  },
  cardFormName: {
    fontSize: 17,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  cardReferenceNumber: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  cardDate: {
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },
  estimatedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: '#FFF3E0',
    borderRadius: 6,
    alignSelf: 'flex-start',
    gap: spacing.xs,
  },
  estimatedText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.semiBold,
    color: '#E65100',
  },
  cardArrow: {
    position: 'absolute',
    right: spacing.lg,
    top: '50%',
    marginTop: -10,
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    marginTop: spacing.lg,
  },
  emptyStateMessage: {
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginHorizontal: spacing.xl,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.black,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 12,
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  emptyStateButtonText: {
    fontSize: 15,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: colors.gray200,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.gray200,
  },
  modalScroll: {
    flex: 1,
  },

  // Detail Status Card
  detailStatusCard: {
    margin: spacing.lg,
    padding: spacing.xl,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailStatusText: {
    fontSize: 20,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
    marginTop: spacing.sm,
    textTransform: 'uppercase',
  },

  // Detail Section
  detailSection: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.gray200,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  detailRow: {
    marginBottom: spacing.sm,
  },
  detailLabel: {
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
  },
  detailValueBold: {
    fontFamily: typography.fontFamily.bold,
    letterSpacing: 0.5,
  },

  // Timeline
  timelineItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  timelineIconContainer: {
    alignItems: 'center',
    marginRight: spacing.md,
  },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineIconCompleted: {
    backgroundColor: '#4CAF50',
  },
  timelineIconCurrent: {
    backgroundColor: '#FF9933',
  },
  timelineIconDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textDisabled,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.gray200,
    marginTop: 4,
  },
  timelineLineCompleted: {
    backgroundColor: '#4CAF50',
  },
  timelineContent: {
    flex: 1,
    paddingTop: 4,
  },
  timelineLabel: {
    fontSize: 15,
    fontFamily: typography.fontFamily.medium,
    color: colors.textSecondary,
  },
  timelineLabelCompleted: {
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.semiBold,
  },
  timelineDate: {
    fontSize: 12,
    fontFamily: typography.fontFamily.regular,
    color: colors.textDisabled,
    marginTop: 2,
  },

  // Note Card
  noteCard: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    gap: spacing.sm,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
    color: '#E65100',
  },

  // Modal Actions
  modalActions: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  modalActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.black,
    paddingVertical: spacing.lg,
    borderRadius: 12,
    gap: spacing.sm,
  },
  modalActionButtonText: {
    fontSize: 17,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
  },

  // Language Toggle
  languageToggle: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.black,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    gap: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  languageToggleText: {
    fontSize: 13,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.white,
  },
});
