import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../theme';

// Mock application data - TODO: Replace with actual API call
const MOCK_APPLICATION = {
  id: 'APP_2024_001234',
  schemeId: 'scheme_001',
  schemeName: 'PM Kisan Samman Nidhi',
  schemeNameHindi: 'प्रधानमंत्री किसान सम्मान निधि',
  applicantName: 'राज कुमार',
  applicationDate: '2024-02-15',
  lastUpdated: '2024-03-01',
  currentStatus: 'under_review',
  estimatedCompletion: '2024-03-20',
  category: 'Agriculture',
  categoryHindi: 'कृषि',
  
  // Timeline of status changes
  statusHistory: [
    {
      id: 1,
      status: 'draft',
      statusLabel: 'Draft',
      statusLabelHindi: 'प्रारूप',
      timestamp: '2024-02-14T10:30:00',
      message: 'Application created',
      messageHindi: 'आवेदन बनाया गया',
      completed: true,
    },
    {
      id: 2,
      status: 'submitted',
      statusLabel: 'Submitted',
      statusLabelHindi: 'जमा किया',
      timestamp: '2024-02-15T14:20:00',
      message: 'Application submitted successfully',
      messageHindi: 'आवेदन सफलतापूर्वक जमा किया गया',
      officer: 'Block Development Officer',
      completed: true,
    },
    {
      id: 3,
      status: 'processing',
      statusLabel: 'Processing',
      statusLabelHindi: 'प्रक्रिया में',
      timestamp: '2024-02-18T09:15:00',
      message: 'Initial verification completed',
      messageHindi: 'प्रारंभिक सत्यापन पूर्ण',
      officer: 'District Agriculture Officer',
      completed: true,
    },
    {
      id: 4,
      status: 'under_review',
      statusLabel: 'Under Review',
      statusLabelHindi: 'समीक्षा में',
      timestamp: '2024-03-01T11:00:00',
      message: 'Documents under review by department',
      messageHindi: 'विभाग द्वारा दस्तावेजों की समीक्षा',
      officer: 'State Agriculture Department',
      completed: true,
    },
    {
      id: 5,
      status: 'approved',
      statusLabel: 'Approved',
      statusLabelHindi: 'स्वीकृत',
      timestamp: null,
      message: 'Pending approval',
      messageHindi: 'स्वीकृति लंबित',
      completed: false,
    },
    {
      id: 6,
      status: 'completed',
      statusLabel: 'Completed',
      statusLabelHindi: 'पूर्ण',
      timestamp: null,
      message: 'Benefit disbursement',
      messageHindi: 'लाभ वितरण',
      completed: false,
    },
  ],
  
  // Documents checklist
  documents: [
    {
      id: 1,
      name: 'Aadhaar Card',
      nameHindi: 'आधार कार्ड',
      status: 'verified',
      icon: 'checkmark-circle',
      color: theme.colors.success,
    },
    {
      id: 2,
      name: 'Land Ownership Document',
      nameHindi: 'भूमि स्वामित्व दस्तावेज़',
      status: 'verified',
      icon: 'checkmark-circle',
      color: theme.colors.success,
    },
    {
      id: 3,
      name: 'Bank Account Details',
      nameHindi: 'बैंक खाता विवरण',
      status: 'verified',
      icon: 'checkmark-circle',
      color: theme.colors.success,
    },
    {
      id: 4,
      name: 'Income Certificate',
      nameHindi: 'आय प्रमाण पत्र',
      status: 'pending',
      icon: 'time-outline',
      color: theme.colors.warning,
      note: 'Additional verification required',
      noteHindi: 'अतिरिक्त सत्यापन आवश्यक',
    },
  ],
  
  // Recent updates/notifications
  updates: [
    {
      id: 1,
      title: 'Application Under Review',
      titleHindi: 'आवेदन समीक्षा में',
      message: 'Your application is currently being reviewed by the State Agriculture Department. You will be notified once the review is complete.',
      messageHindi: 'आपके आवेदन की वर्तमान में राज्य कृषि विभाग द्वारा समीक्षा की जा रही है। समीक्षा पूर्ण होने पर आपको सूचित किया जाएगा।',
      timestamp: '2024-03-01T11:00:00',
      type: 'info',
    },
    {
      id: 2,
      title: 'Income Certificate Needs Verification',
      titleHindi: 'आय प्रमाण पत्र के लिए सत्यापन आवश्यक',
      message: 'Your income certificate requires additional verification. Please contact the Block Development Office.',
      messageHindi: 'आपके आय प्रमाण पत्र के लिए अतिरिक्त सत्यापन की आवश्यकता है। कृपया ब्लॉक विकास कार्यालय से संपर्क करें।',
      timestamp: '2024-02-28T15:30:00',
      type: 'warning',
    },
    {
      id: 3,
      title: 'Initial Verification Complete',
      titleHindi: 'प्रारंभिक सत्यापन पूर्ण',
      message: 'Initial verification of your application has been completed successfully.',
      messageHindi: 'आपके आवेदन का प्रारंभिक सत्यापन सफलतापूर्वक पूर्ण हो गया है।',
      timestamp: '2024-02-18T09:15:00',
      type: 'success',
    },
  ],
};

const STATUS_CONFIG = {
  draft: {
    color: theme.colors.textSecondary,
    bgColor: '#f5f5f5',
    icon: 'document-outline',
  },
  submitted: {
    color: theme.colors.info,
    bgColor: '#E3F2FD',
    icon: 'checkmark-done-outline',
  },
  processing: {
    color: theme.colors.warning,
    bgColor: '#FFF3E0',
    icon: 'time-outline',
  },
  under_review: {
    color: '#9C27B0',
    bgColor: '#F3E5F5',
    icon: 'search-outline',
  },
  approved: {
    color: theme.colors.success,
    bgColor: '#E8F5E9',
    icon: 'checkmark-circle-outline',
  },
  rejected: {
    color: theme.colors.error,
    bgColor: '#FFEBEE',
    icon: 'close-circle-outline',
  },
  completed: {
    color: '#00ACC1',
    bgColor: '#E0F7FA',
    icon: 'trophy-outline',
  },
};

export default function ApplicationStatusTrackingScreen({ route, navigation }) {
  const { applicationId } = route.params || {};
  const [refreshing, setRefreshing] = useState(false);
  const [application, setApplication] = useState(MOCK_APPLICATION);

  // TODO: Fetch application details from API
  const fetchApplicationDetails = async () => {
    setRefreshing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // const response = await fetch(`/api/applications/${applicationId}`);
      // const data = await response.json();
      // setApplication(data);
    } catch (error) {
      console.error('Error fetching application:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDownloadApplication = () => {
    Alert.alert(
      'Download Application',
      'आवेदन डाउनलोड करें\n\nDo you want to download the application PDF?',
      [
        { text: 'Cancel / रद्द करें', style: 'cancel' },
        {
          text: 'Download / डाउनलोड',
          onPress: () => {
            // TODO: Implement download functionality
            Alert.alert('Success', 'Application downloaded successfully');
          },
        },
      ]
    );
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'सहायता से संपर्क करें\n\nHow would you like to contact support?',
      [
        { text: 'Cancel / रद्द करें', style: 'cancel' },
        { text: 'Call / कॉल करें', onPress: () => console.log('Call support') },
        { text: 'Message / संदेश', onPress: () => console.log('Message support') },
      ]
    );
  };

  const handleWithdrawApplication = () => {
    Alert.alert(
      'Withdraw Application',
      'आवेदन वापस लें\n\nAre you sure you want to withdraw this application? This action cannot be undone.',
      [
        { text: 'Cancel / रद्द करें', style: 'cancel' },
        {
          text: 'Withdraw / वापस लें',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement withdraw functionality
            Alert.alert('Success', 'Application withdrawn successfully');
            navigation.goBack();
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const currentStatusConfig = STATUS_CONFIG[application.currentStatus] || STATUS_CONFIG.draft;
  const currentStatusData = application.statusHistory.find(
    s => s.status === application.currentStatus
  );

  // Calculate progress percentage
  const completedSteps = application.statusHistory.filter(s => s.completed).length;
  const totalSteps = application.statusHistory.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.black} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Application Status</Text>
          <Text style={styles.headerSubtitle}>आवेदन स्थिति</Text>
        </View>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={fetchApplicationDetails}
        >
          <Ionicons name="refresh" size={24} color={theme.colors.black} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchApplicationDetails} />
        }
      >
        {/* Application Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.applicationInfo}>
              <Text style={styles.applicationNumber}>{application.id}</Text>
              <Text style={styles.schemeName}>{application.schemeName}</Text>
              <Text style={styles.schemeNameHindi}>{application.schemeNameHindi}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Current Status */}
          <View style={styles.currentStatusContainer}>
            <Text style={styles.sectionLabel}>Current Status / वर्तमान स्थिति</Text>
            <View
              style={[
                styles.currentStatusBadge,
                { backgroundColor: currentStatusConfig.bgColor },
              ]}
            >
              <Ionicons
                name={currentStatusConfig.icon}
                size={32}
                color={currentStatusConfig.color}
              />
              <View style={styles.currentStatusText}>
                <Text style={[styles.currentStatusLabel, { color: currentStatusConfig.color }]}>
                  {currentStatusData?.statusLabel}
                </Text>
                <Text style={[styles.currentStatusLabelHindi, { color: currentStatusConfig.color }]}>
                  {currentStatusData?.statusLabelHindi}
                </Text>
              </View>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Progress / प्रगति</Text>
              <Text style={styles.progressPercentage}>{Math.round(progressPercentage)}%</Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${progressPercentage}%`, backgroundColor: currentStatusConfig.color },
                ]}
              />
            </View>
            <Text style={styles.progressSteps}>
              Step {completedSteps} of {totalSteps} completed
            </Text>
          </View>

          {/* Dates */}
          <View style={styles.datesContainer}>
            <View style={styles.dateItem}>
              <Ionicons name="calendar-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.dateLabel}>Applied:</Text>
              <Text style={styles.dateValue}>{formatDate(application.applicationDate)}</Text>
            </View>
            <View style={styles.dateItem}>
              <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.dateLabel}>Last Updated:</Text>
              <Text style={styles.dateValue}>{formatDate(application.lastUpdated)}</Text>
            </View>
            {application.estimatedCompletion && (
              <View style={styles.dateItem}>
                <Ionicons name="flag-outline" size={16} color={theme.colors.info} />
                <Text style={styles.dateLabel}>Estimated:</Text>
                <Text style={[styles.dateValue, { color: theme.colors.info }]}>
                  {formatDate(application.estimatedCompletion)}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Timeline */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Application Timeline</Text>
          <Text style={styles.cardTitleHindi}>आवेदन समयरेखा</Text>

          <View style={styles.timeline}>
            {application.statusHistory.map((item, index) => (
              <View key={item.id} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View
                    style={[
                      styles.timelineDot,
                      {
                        backgroundColor: item.completed
                          ? STATUS_CONFIG[item.status]?.color || theme.colors.textSecondary
                          : theme.colors.border,
                      },
                    ]}
                  >
                    {item.completed && (
                      <Ionicons name="checkmark" size={16} color={theme.colors.white} />
                    )}
                  </View>
                  {index < application.statusHistory.length - 1 && (
                    <View
                      style={[
                        styles.timelineLine,
                        {
                          backgroundColor: item.completed
                            ? theme.colors.border
                            : theme.colors.borderLight,
                        },
                      ]}
                    />
                  )}
                </View>

                <View style={styles.timelineRight}>
                  <View style={styles.timelineContent}>
                    <Text
                      style={[
                        styles.timelineStatus,
                        !item.completed && styles.timelineStatusInactive,
                      ]}
                    >
                      {item.statusLabel}
                    </Text>
                    <Text
                      style={[
                        styles.timelineStatusHindi,
                        !item.completed && styles.timelineStatusInactive,
                      ]}
                    >
                      {item.statusLabelHindi}
                    </Text>
                    {item.timestamp && (
                      <Text style={styles.timelineDate}>{formatDateTime(item.timestamp)}</Text>
                    )}
                    <Text
                      style={[
                        styles.timelineMessage,
                        !item.completed && styles.timelineMessageInactive,
                      ]}
                    >
                      {item.message}
                    </Text>
                    {item.messageHindi && (
                      <Text
                        style={[
                          styles.timelineMessageHindi,
                          !item.completed && styles.timelineMessageInactive,
                        ]}
                      >
                        {item.messageHindi}
                      </Text>
                    )}
                    {item.officer && (
                      <View style={styles.officerInfo}>
                        <Ionicons
                          name="person-outline"
                          size={14}
                          color={theme.colors.textSecondary}
                        />
                        <Text style={styles.officerText}>{item.officer}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Documents */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Documents Submitted</Text>
          <Text style={styles.cardTitleHindi}>जमा किए गए दस्तावेज़</Text>

          <View style={styles.documentsList}>
            {application.documents.map((doc) => (
              <View key={doc.id} style={styles.documentItem}>
                <Ionicons name={doc.icon} size={24} color={doc.color} />
                <View style={styles.documentInfo}>
                  <Text style={styles.documentName}>{doc.name}</Text>
                  <Text style={styles.documentNameHindi}>{doc.nameHindi}</Text>
                  {doc.note && (
                    <>
                      <Text style={styles.documentNote}>{doc.note}</Text>
                      <Text style={styles.documentNoteHindi}>{doc.noteHindi}</Text>
                    </>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Updates & Notifications */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Updates</Text>
          <Text style={styles.cardTitleHindi}>हाल के अपडेट</Text>

          <View style={styles.updatesList}>
            {application.updates.map((update) => (
              <View key={update.id} style={styles.updateItem}>
                <View style={styles.updateHeader}>
                  <View
                    style={[
                      styles.updateIcon,
                      {
                        backgroundColor:
                          update.type === 'success'
                            ? theme.colors.success + '20'
                            : update.type === 'warning'
                            ? theme.colors.warning + '20'
                            : theme.colors.info + '20',
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        update.type === 'success'
                          ? 'checkmark-circle'
                          : update.type === 'warning'
                          ? 'alert-circle'
                          : 'information-circle'
                      }
                      size={20}
                      color={
                        update.type === 'success'
                          ? theme.colors.success
                          : update.type === 'warning'
                          ? theme.colors.warning
                          : theme.colors.info
                      }
                    />
                  </View>
                  <View style={styles.updateHeaderText}>
                    <Text style={styles.updateTitle}>{update.title}</Text>
                    <Text style={styles.updateTitleHindi}>{update.titleHindi}</Text>
                  </View>
                </View>
                <Text style={styles.updateMessage}>{update.message}</Text>
                <Text style={styles.updateMessageHindi}>{update.messageHindi}</Text>
                <Text style={styles.updateTimestamp}>{formatDateTime(update.timestamp)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonPrimary]}
            onPress={handleDownloadApplication}
          >
            <Ionicons name="download-outline" size={20} color={theme.colors.white} />
            <Text style={styles.actionButtonTextPrimary}>Download Application</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonSecondary]}
            onPress={handleContactSupport}
          >
            <Ionicons name="chatbubble-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.actionButtonTextSecondary}>Contact Support</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonDanger]}
            onPress={handleWithdrawApplication}
          >
            <Ionicons name="close-circle-outline" size={20} color={theme.colors.error} />
            <Text style={styles.actionButtonTextDanger}>Withdraw Application</Text>
          </TouchableOpacity>
        </View>

        {/* Help Text */}
        <View style={styles.helpContainer}>
          <Ionicons name="information-circle-outline" size={20} color={theme.colors.textSecondary} />
          <Text style={styles.helpText}>
            For queries, contact your Block Development Office or call the helpline: 1800-XXX-XXXX
          </Text>
        </View>
        <View style={styles.helpContainer}>
          <Text style={styles.helpTextHindi}>
            प्रश्नों के लिए, अपने ब्लॉक विकास कार्यालय से संपर्क करें या हेल्पलाइन पर कॉल करें: 1800-XXX-XXXX
          </Text>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.black,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  headerButton: {
    padding: theme.spacing.xs,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.elevation.small,
  },
  cardHeader: {
    marginBottom: theme.spacing.sm,
  },
  applicationInfo: {
    alignItems: 'center',
  },
  applicationNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  schemeName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.black,
    textAlign: 'center',
  },
  schemeNameHindi: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  currentStatusContainer: {
    marginBottom: theme.spacing.md,
  },
  currentStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: 12,
  },
  currentStatusText: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  currentStatusLabel: {
    fontSize: 20,
    fontWeight: '700',
  },
  currentStatusLabelHindi: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
  progressContainer: {
    marginBottom: theme.spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: theme.spacing.xs,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressSteps: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  datesContainer: {
    gap: theme.spacing.xs,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  dateLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.black,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.black,
    marginBottom: 4,
  },
  cardTitleHindi: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  timeline: {
    marginTop: theme.spacing.sm,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  timelineDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: theme.spacing.xs,
  },
  timelineRight: {
    flex: 1,
    paddingBottom: theme.spacing.md,
  },
  timelineContent: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.sm,
    borderRadius: 8,
  },
  timelineStatus: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.black,
  },
  timelineStatusHindi: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  timelineStatusInactive: {
    color: theme.colors.textSecondary,
    opacity: 0.6,
  },
  timelineDate: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  timelineMessage: {
    fontSize: 14,
    color: theme.colors.black,
    marginTop: theme.spacing.xs,
  },
  timelineMessageHindi: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  timelineMessageInactive: {
    opacity: 0.5,
  },
  officerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  officerText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  documentsList: {
    gap: theme.spacing.sm,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
  },
  documentInfo: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  documentName: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.black,
  },
  documentNameHindi: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  documentNote: {
    fontSize: 13,
    color: theme.colors.warning,
    marginTop: theme.spacing.xs,
  },
  documentNoteHindi: {
    fontSize: 12,
    color: theme.colors.warning,
    marginTop: 2,
  },
  updatesList: {
    gap: theme.spacing.md,
  },
  updateItem: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
  },
  updateHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xs,
  },
  updateIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateHeaderText: {
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  updateTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.black,
  },
  updateTitleHindi: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  updateMessage: {
    fontSize: 14,
    color: theme.colors.black,
    marginTop: theme.spacing.xs,
    lineHeight: 20,
  },
  updateMessageHindi: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  updateTimestamp: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  actionsContainer: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderRadius: 12,
    gap: theme.spacing.xs,
  },
  actionButtonPrimary: {
    backgroundColor: theme.colors.primary,
  },
  actionButtonSecondary: {
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  actionButtonDanger: {
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.error,
  },
  actionButtonTextPrimary: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.white,
  },
  actionButtonTextSecondary: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  actionButtonTextDanger: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.error,
  },
  helpContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  helpText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  helpTextHindi: {
    flex: 1,
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 17,
  },
});
