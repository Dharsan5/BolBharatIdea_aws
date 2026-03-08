import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { getApplications } from '../api/database';
import { colors, spacing, typography } from '../theme';

const STATUS_COLORS = {
  submitted: '#2196F3',
  processing: '#FF9933',
  verification: '#9C27B0',
  approved: '#4CAF50',
  rejected: '#F44336',
  pending: '#FFC107',
  completed: '#00BCD4',
  under_review: '#9C27B0',
  draft: '#757575',
};

const STATUS_ICONS = {
  submitted: 'cloud-upload-outline',
  processing: 'sync-outline',
  verification: 'search-outline',
  approved: 'checkmark-circle-outline',
  rejected: 'close-circle-outline',
  pending: 'time-outline',
  completed: 'trophy-outline',
  under_review: 'eye-outline',
  draft: 'document-outline',
};

const STATUS_STEPS = ['submitted', 'processing', 'verification', 'approved'];

const FILTER_OPTIONS = [
  { key: 'all', labelEn: 'All', labelHi: 'सभी', icon: 'apps-outline' },
  { key: 'submitted', labelEn: 'Submitted', labelHi: 'जमा किया', icon: 'cloud-upload-outline' },
  { key: 'processing', labelEn: 'Processing', labelHi: 'संसाधित', icon: 'sync-outline' },
  { key: 'verification', labelEn: 'Verification', labelHi: 'सत्यापन', icon: 'search-outline' },
  { key: 'approved', labelEn: 'Approved', labelHi: 'स्वीकृत', icon: 'checkmark-circle-outline' },
  { key: 'rejected', labelEn: 'Rejected', labelHi: 'अस्वीकृत', icon: 'close-circle-outline' },
];

const generateTimeline = (currentStatus) => {
  const statusOrder = ['submitted', 'processing', 'verification', 'approved'];
  const currentIndex = statusOrder.indexOf(currentStatus);
  const effectiveIndex = currentStatus === 'rejected' ? 2 : currentIndex;

  return [
    { key: 'submitted', labelEn: 'Submitted', labelHi: 'जमा किया गया' },
    { key: 'processing', labelEn: 'Processing', labelHi: 'संसाधित' },
    { key: 'verification', labelEn: 'Verification', labelHi: 'सत्यापन' },
    {
      key: currentStatus === 'rejected' ? 'rejected' : 'approved',
      labelEn: currentStatus === 'rejected' ? 'Rejected' : 'Approved',
      labelHi: currentStatus === 'rejected' ? 'अस्वीकृत' : 'स्वीकृत',
    },
  ].map((step, index) => ({
    ...step,
    completed: index <= effectiveIndex,
    current: index === effectiveIndex,
  }));
};

const normalizeApplication = (app) => ({
  id: app.id || app.referenceNumber || `app-${Date.now()}`,
  referenceNumber:
    app.referenceNumber ||
    `BOLB${(app.id || '').slice(-8) || Date.now().toString().slice(-8)}`,
  formName: app.formName || app.schemeName || app.scheme_name || 'Application',
  formNameHindi:
    app.formNameHindi || app.schemeNameHindi || app.formName || 'आवेदन',
  status: app.status || 'submitted',
  submittedDate:
    app.submittedDate || app.createdAt || app.created_at
      ? new Date(
          app.submittedDate || app.createdAt || app.created_at
        ).toLocaleDateString('en-IN')
      : new Date().toLocaleDateString('en-IN'),
  lastUpdated:
    app.lastUpdated || app.updatedAt || app.updated_at
      ? new Date(
          app.lastUpdated || app.updatedAt || app.updated_at
        ).toLocaleDateString('en-IN')
      : new Date().toLocaleDateString('en-IN'),
  department: app.department || 'Government of India',
  departmentHindi: app.departmentHindi || 'भारत सरकार',
  estimatedCompletion:
    app.estimatedCompletion ||
    (['submitted', 'processing', 'verification'].includes(
      app.status || 'submitted'
    )
      ? '5-7 days'
      : null),
  timeline: app.timeline || generateTimeline(app.status || 'submitted'),
});

function InfoRow({ icon, label, value, noBorder }) {
  return (
    <View style={[styles.infoRow, !noBorder && styles.infoRowBorder]}>
      <Ionicons
        name={icon}
        size={16}
        color={colors.textSecondary}
        style={styles.infoRowIcon}
      />
      <View style={styles.infoRowContent}>
        <Text style={styles.infoRowLabel}>{label}</Text>
        <Text style={styles.infoRowValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function ApplicationTrackingScreen({ route, navigation }) {
  const userProfile = useSelector((state) => state.user?.profile);
  const userId =
    userProfile?.id ||
    userProfile?.userId ||
    userProfile?.phone ||
    userProfile?.phoneNumber;

  const [language, setLanguage] = useState('english');
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadApplications(true);
    if (route.params?.referenceNumber) {
      setTimeout(() => searchByReference(route.params.referenceNumber), 800);
    }
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, selectedFilter, searchQuery]);

  const loadApplications = useCallback(
    async (showLoader = false) => {
      if (showLoader) setIsLoading(true);
      setError(null);

      try {
        if (userId) {
          const response = await getApplications(userId);
          if (response?.success) {
            const rawApps =
              response.applications ||
              response.data ||
              response.items ||
              [];
            if (rawApps.length > 0) {
              const apps = rawApps.map(normalizeApplication);
              setApplications(apps);
              await AsyncStorage.setItem(
                'submittedApplications',
                JSON.stringify(apps)
              );
              return;
            }
          }
        }

        // Fallback: AsyncStorage
        const stored = await AsyncStorage.getItem('submittedApplications');
        if (stored) {
          setApplications(JSON.parse(stored).map(normalizeApplication));
        } else {
          setApplications([]);
        }
      } catch (err) {
        console.error('Error loading applications:', err);
        try {
          const stored = await AsyncStorage.getItem('submittedApplications');
          if (stored) {
            setApplications(JSON.parse(stored).map(normalizeApplication));
          } else {
            setError(
              language === 'hindi'
                ? 'डेटा लोड करने में विफल'
                : 'Failed to load data'
            );
            setApplications([]);
          }
        } catch {
          setError(
            language === 'hindi'
              ? 'डेटा लोड करने में विफल'
              : 'Failed to load data'
          );
          setApplications([]);
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [userId, language]
  );

  const filterApplications = () => {
    let filtered = [...applications];

    if (selectedFilter !== 'all') {
      filtered = filtered.filter((app) => app.status === selectedFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.referenceNumber?.toLowerCase().includes(query) ||
          app.formName?.toLowerCase().includes(query) ||
          app.formNameHindi?.includes(query)
      );
    }

    filtered.sort((a, b) => {
      const dA = new Date(a.submittedDate);
      const dB = new Date(b.submittedDate);
      return isNaN(dB) || isNaN(dA) ? 0 : dB - dA;
    });

    setFilteredApplications(filtered);
  };

  const searchByReference = (refNumber) => {
    const app = applications.find((a) => a.referenceNumber === refNumber);
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

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadApplications(false);
  };

  const getStatusLabel = (statusKey, lang) => {
    const opt = FILTER_OPTIONS.find((f) => f.key === statusKey);
    if (opt) return lang === 'hindi' ? opt.labelHi : opt.labelEn;
    return statusKey;
  };

  const getProgressPercent = (status) => {
    const idx = STATUS_STEPS.indexOf(status);
    if (status === 'rejected') return 75;
    if (status === 'completed') return 100;
    if (idx < 0) return 10;
    return Math.round(((idx + 1) / STATUS_STEPS.length) * 100);
  };

  // ─── Renders ───────────────────────────────────────────────────────────────

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
      </TouchableOpacity>
      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>
          {language === 'hindi' ? 'आवेदन ट्रैकिंग' : 'Track Applications'}
        </Text>
        <Text style={styles.headerSubtitle}>
          {filteredApplications.length}{' '}
          {language === 'hindi' ? 'आवेदन' : 'applications'}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={handleRefresh}
        disabled={isRefreshing}
      >
        <Ionicons
          name="refresh"
          size={22}
          color={isRefreshing ? colors.textDisabled : colors.textPrimary}
        />
      </TouchableOpacity>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={18} color={colors.textDisabled} />
      <TextInput
        style={styles.searchInput}
        placeholder={
          language === 'hindi'
            ? 'संदर्भ संख्या या नाम से खोजें...'
            : 'Search by reference or name...'
        }
        placeholderTextColor={colors.textDisabled}
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoCapitalize="characters"
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={() => setSearchQuery('')}>
          <Ionicons name="close-circle" size={18} color={colors.textDisabled} />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderFilters = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filtersScroll}
      contentContainerStyle={styles.filtersContent}
    >
      {FILTER_OPTIONS.map((f) => {
        const count =
          f.key === 'all'
            ? applications.length
            : applications.filter((a) => a.status === f.key).length;
        const active = selectedFilter === f.key;
        return (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, active && styles.filterChipActive]}
            onPress={() => setSelectedFilter(f.key)}
          >
            <Ionicons
              name={f.icon}
              size={14}
              color={active ? colors.white : colors.textSecondary}
            />
            <Text
              style={[
                styles.filterChipText,
                active && styles.filterChipTextActive,
              ]}
            >
              {language === 'hindi' ? f.labelHi : f.labelEn}
            </Text>
            {count > 0 && (
              <View
                style={[
                  styles.filterBadge,
                  active && styles.filterBadgeActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterBadgeText,
                    active && styles.filterBadgeTextActive,
                  ]}
                >
                  {count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  const renderApplicationCard = (app) => {
    const statusColor = STATUS_COLORS[app.status] || '#757575';
    const progress = getProgressPercent(app.status);

    return (
      <TouchableOpacity
        key={app.id}
        style={styles.card}
        onPress={() => {
          setSelectedApplication(app);
          setIsDetailModalVisible(true);
        }}
        activeOpacity={0.75}
      >
        <View style={[styles.cardStrip, { backgroundColor: statusColor }]} />
        <View style={styles.cardBody}>
          <View style={styles.cardTopRow}>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: statusColor + '20',
                  borderColor: statusColor + '50',
                },
              ]}
            >
              <Ionicons
                name={STATUS_ICONS[app.status] || 'document-outline'}
                size={13}
                color={statusColor}
              />
              <Text style={[styles.statusBadgeText, { color: statusColor }]}>
                {getStatusLabel(app.status, language).toUpperCase()}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.textDisabled}
            />
          </View>

          <Text style={styles.cardName} numberOfLines={2}>
            {language === 'hindi' ? app.formNameHindi : app.formName}
          </Text>

          <View style={styles.cardMeta}>
            <Ionicons
              name="barcode-outline"
              size={14}
              color={colors.textSecondary}
            />
            <Text style={styles.cardRef}>{app.referenceNumber}</Text>
          </View>

          <View style={styles.cardDatesRow}>
            <View style={styles.cardMeta}>
              <Ionicons
                name="calendar-outline"
                size={13}
                color={colors.textDisabled}
              />
              <Text style={styles.cardDateText}>{app.submittedDate}</Text>
            </View>
            {app.estimatedCompletion && (
              <View style={styles.etaBadge}>
                <MaterialCommunityIcons
                  name="clock-fast"
                  size={12}
                  color="#E65100"
                />
                <Text style={styles.etaText}>{app.estimatedCompletion}</Text>
              </View>
            )}
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%`, backgroundColor: statusColor },
              ]}
            />
          </View>
          <Text style={styles.progressLabel}>
            {progress}%{' '}
            {language === 'hindi' ? 'पूर्ण' : 'complete'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderLoading = () => (
    <View style={styles.centerState}>
      <ActivityIndicator size="large" color={colors.black} />
      <Text style={styles.centerStateText}>
        {language === 'hindi'
          ? 'आवेदन लोड हो रहे हैं...'
          : 'Loading applications...'}
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.centerState}>
      <MaterialCommunityIcons
        name="cloud-off-outline"
        size={64}
        color={colors.textDisabled}
      />
      <Text style={styles.centerStateTitle}>
        {language === 'hindi' ? 'लोड करने में समस्या' : 'Failed to Load'}
      </Text>
      <Text style={styles.centerStateText}>{error}</Text>
      <TouchableOpacity
        style={styles.actionBtn}
        onPress={() => loadApplications(true)}
      >
        <Ionicons name="refresh" size={18} color={colors.white} />
        <Text style={styles.actionBtnText}>
          {language === 'hindi' ? 'पुनः प्रयास करें' : 'Retry'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.centerState}>
      <MaterialCommunityIcons
        name="file-document-alert-outline"
        size={72}
        color={colors.textDisabled}
      />
      <Text style={styles.centerStateTitle}>
        {selectedFilter !== 'all' || searchQuery
          ? language === 'hindi'
            ? 'कोई परिणाम नहीं'
            : 'No Results'
          : language === 'hindi'
          ? 'कोई आवेदन नहीं'
          : 'No Applications Yet'}
      </Text>
      <Text style={styles.centerStateText}>
        {selectedFilter !== 'all' || searchQuery
          ? language === 'hindi'
            ? 'अपना फ़िल्टर बदलें'
            : 'Try a different filter or search term'
          : language === 'hindi'
          ? 'आपके जमा किए गए आवेदन यहाँ दिखेंगे'
          : 'Applications you submit will appear here'}
      </Text>
      {selectedFilter === 'all' && !searchQuery && (
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate('FormSelection')}
        >
          <Ionicons name="add-circle-outline" size={18} color={colors.white} />
          <Text style={styles.actionBtnText}>
            {language === 'hindi' ? 'नया फॉर्म भरें' : 'Fill New Form'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderDetailModal = () => {
    if (!selectedApplication) return null;
    const app = selectedApplication;
    const statusColor = STATUS_COLORS[app.status] || '#757575';

    return (
      <Modal
        visible={isDetailModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsDetailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {language === 'hindi' ? 'आवेदन विवरण' : 'Application Details'}
              </Text>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setIsDetailModalVisible(false)}
              >
                <Ionicons name="close" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.modalScroll}
            >
              {/* Status hero */}
              <View
                style={[styles.statusHero, { backgroundColor: statusColor }]}
              >
                <Ionicons
                  name={STATUS_ICONS[app.status] || 'document-outline'}
                  size={44}
                  color={colors.white}
                />
                <Text style={styles.statusHeroText}>
                  {getStatusLabel(app.status, language).toUpperCase()}
                </Text>
                <Text style={styles.statusHeroRef}>{app.referenceNumber}</Text>
              </View>

              {/* Info card */}
              <View style={styles.infoCard}>
                <InfoRow
                  icon="document-text-outline"
                  label={language === 'hindi' ? 'फॉर्म का नाम' : 'Form Name'}
                  value={
                    language === 'hindi' ? app.formNameHindi : app.formName
                  }
                />
                <InfoRow
                  icon="business-outline"
                  label={language === 'hindi' ? 'विभाग' : 'Department'}
                  value={
                    language === 'hindi'
                      ? app.departmentHindi
                      : app.department
                  }
                />
                <InfoRow
                  icon="calendar-outline"
                  label={language === 'hindi' ? 'जमा दिनांक' : 'Submitted'}
                  value={app.submittedDate}
                />
                <InfoRow
                  icon="time-outline"
                  label={
                    language === 'hindi' ? 'अंतिम अपडेट' : 'Last Updated'
                  }
                  value={app.lastUpdated}
                  noBorder
                />
              </View>

              {/* Timeline */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>
                  {language === 'hindi'
                    ? 'प्रगति टाइमलाइन'
                    : 'Progress Timeline'}
                </Text>
                {(app.timeline || generateTimeline(app.status)).map(
                  (step, index, arr) => (
                    <View key={step.key} style={styles.timelineRow}>
                      <View style={styles.timelineLeft}>
                        <View
                          style={[
                            styles.timelineDot,
                            step.completed && {
                              backgroundColor: '#4CAF50',
                              borderColor: '#4CAF50',
                            },
                            step.current && {
                              backgroundColor: statusColor,
                              borderColor: statusColor,
                            },
                          ]}
                        >
                          {step.completed && (
                            <Ionicons
                              name="checkmark"
                              size={12}
                              color={colors.white}
                            />
                          )}
                        </View>
                        {index < arr.length - 1 && (
                          <View
                            style={[
                              styles.timelineConnector,
                              step.completed && {
                                backgroundColor: '#4CAF50',
                              },
                            ]}
                          />
                        )}
                      </View>
                      <View style={styles.timelineRight}>
                        <Text
                          style={[
                            styles.timelineLabel,
                            step.completed && styles.timelineLabelDone,
                            step.current && {
                              color: statusColor,
                              fontFamily: typography.fontFamily.bold,
                            },
                          ]}
                        >
                          {language === 'hindi' ? step.labelHi : step.labelEn}
                        </Text>
                        {step.current && (
                          <Text
                            style={[
                              styles.timelineSubLabel,
                              { color: statusColor },
                            ]}
                          >
                            {language === 'hindi'
                              ? 'वर्तमान स्थिति'
                              : 'Current stage'}
                          </Text>
                        )}
                      </View>
                    </View>
                  )
                )}
              </View>

              {/* Notes */}
              {app.estimatedCompletion && (
                <View style={[styles.noteCard, { backgroundColor: '#FFF3E0' }]}>
                  <MaterialCommunityIcons
                    name="clock-fast"
                    size={18}
                    color="#E65100"
                  />
                  <Text style={[styles.noteText, { color: '#E65100' }]}>
                    {language === 'hindi'
                      ? `अनुमानित पूर्णता: ${app.estimatedCompletion}`
                      : `Estimated completion: ${app.estimatedCompletion}`}
                  </Text>
                </View>
              )}

              <View style={[styles.noteCard, { backgroundColor: '#EBF5FB' }]}>
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color="#1565C0"
                />
                <Text style={[styles.noteText, { color: '#1565C0' }]}>
                  {language === 'hindi'
                    ? 'अपडेट के लिए अपने पंजीकृत मोबाइल और ईमेल की जाँच करते रहें।'
                    : 'Check your registered mobile and email for status updates.'}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => setIsDetailModalVisible(false)}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color={colors.white}
                />
                <Text style={styles.actionBtnText}>
                  {language === 'hindi' ? 'ठीक है' : 'Got It'}
                </Text>
              </TouchableOpacity>

              <View style={{ height: spacing.xxl }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  // ─── Main ─────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {renderHeader()}

      <View style={styles.body}>
        {renderSearchBar()}
        {renderFilters()}

        {isLoading ? (
          renderLoading()
        ) : error ? (
          renderError()
        ) : (
          <ScrollView
            style={styles.list}
            contentContainerStyle={[
              styles.listContent,
              filteredApplications.length === 0 && styles.listContentEmpty,
            ]}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor={colors.black}
                colors={[colors.black]}
              />
            }
          >
            {filteredApplications.length === 0
              ? renderEmpty()
              : filteredApplications.map(renderApplicationCard)}
          </ScrollView>
        )}
      </View>

      {/* Language toggle */}
      <TouchableOpacity
        style={styles.langToggle}
        onPress={() =>
          setLanguage((l) => (l === 'english' ? 'hindi' : 'english'))
        }
      >
        <Ionicons name="language" size={18} color={colors.white} />
        <Text style={styles.langToggleText}>
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
  body: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
    backgroundColor: colors.white,
  },
  headerCenter: {
    flex: 1,
    marginHorizontal: spacing.md,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    marginTop: 1,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray200,
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    height: 44,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray200,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
    paddingVertical: 0,
  },

  // Filters
  filtersScroll: {
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
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray200,
    gap: 5,
  },
  filterChipActive: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  filterChipText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: colors.white,
  },
  filterBadge: {
    backgroundColor: colors.gray200,
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
  },
  filterBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  filterBadgeText: {
    fontSize: 10,
    fontFamily: typography.fontFamily.bold,
    color: colors.textSecondary,
  },
  filterBadgeTextActive: {
    color: colors.white,
  },

  // List
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: 90,
    gap: spacing.md,
  },
  listContentEmpty: {
    flex: 1,
  },

  // Card
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.gray200,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardStrip: {
    width: 4,
  },
  cardBody: {
    flex: 1,
    padding: spacing.md,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    gap: 4,
  },
  statusBadgeText: {
    fontSize: 10,
    fontFamily: typography.fontFamily.bold,
    letterSpacing: 0.3,
  },
  cardName: {
    fontSize: 15,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    marginBottom: 6,
    lineHeight: 21,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  cardRef: {
    fontSize: 12,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  cardDatesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  cardDateText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.regular,
    color: colors.textDisabled,
  },
  etaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    gap: 3,
  },
  etaText: {
    fontSize: 11,
    fontFamily: typography.fontFamily.semiBold,
    color: '#E65100',
  },
  progressTrack: {
    height: 4,
    backgroundColor: colors.gray200,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressLabel: {
    fontSize: 10,
    fontFamily: typography.fontFamily.regular,
    color: colors.textDisabled,
  },

  // Center states
  centerState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  centerStateTitle: {
    fontSize: 17,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  centerStateText: {
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: spacing.sm,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.black,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 10,
    marginTop: spacing.xl,
    marginHorizontal: spacing.lg,
    gap: spacing.sm,
    justifyContent: 'center',
  },
  actionBtnText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    maxHeight: '92%',
    paddingTop: spacing.sm,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.gray200,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },
  modalScroll: {
    flex: 1,
  },

  // Status hero
  statusHero: {
    margin: spacing.lg,
    borderRadius: 16,
    paddingVertical: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  statusHeroText: {
    fontSize: 20,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
    letterSpacing: 1,
  },
  statusHeroRef: {
    fontSize: 13,
    fontFamily: typography.fontFamily.semiBold,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 1,
  },

  // Info card
  infoCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.gray200,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  infoRowIcon: {
    marginRight: spacing.md,
  },
  infoRowContent: {
    flex: 1,
  },
  infoRowLabel: {
    fontSize: 11,
    fontFamily: typography.fontFamily.medium,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  infoRowValue: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
  },

  // Section card
  sectionCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.gray200,
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },

  // Timeline
  timelineRow: {
    flexDirection: 'row',
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: spacing.md,
    width: 24,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.gray200,
    borderWidth: 2,
    borderColor: colors.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineConnector: {
    width: 2,
    flex: 1,
    backgroundColor: colors.gray200,
    minHeight: 20,
    marginVertical: 2,
  },
  timelineRight: {
    flex: 1,
    paddingBottom: spacing.md,
    paddingTop: 2,
  },
  timelineLabel: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    color: colors.textSecondary,
  },
  timelineLabelDone: {
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.semiBold,
  },
  timelineSubLabel: {
    fontSize: 11,
    fontFamily: typography.fontFamily.regular,
    marginTop: 2,
  },

  // Note card
  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: 10,
    gap: spacing.sm,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    lineHeight: 18,
  },

  // Language toggle
  langToggle: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.black,
    paddingVertical: 8,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    gap: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  langToggleText: {
    fontSize: 13,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.white,
  },
});
