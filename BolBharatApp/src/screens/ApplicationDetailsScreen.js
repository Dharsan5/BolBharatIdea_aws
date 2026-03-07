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
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../theme';

// Mock application data - TODO: Replace with actual API call
const MOCK_APPLICATION_DETAILS = {
  id: 'APP_2024_001234',
  applicationNumber: 'APP_2024_001234',
  schemeId: 'scheme_001',
  schemeName: 'PM Kisan Samman Nidhi',
  schemeNameHindi: 'प्रधानमंत्री किसान सम्मान निधि',
  category: 'Agriculture',
  categoryHindi: 'कृषि',
  status: 'under_review',
  statusLabel: 'Under Review',
  statusLabelHindi: 'समीक्षा में',
  
  // Dates
  submittedDate: '2024-02-15T14:20:00',
  lastUpdated: '2024-03-01T11:00:00',
  estimatedCompletion: '2024-03-20',
  
  // Applicant Information
  applicantInfo: {
    title: 'Applicant Information',
    titleHindi: 'आवेदक की जानकारी',
    fields: [
      { label: 'Full Name', labelHindi: 'पूरा नाम', value: 'राज कुमार' },
      { label: 'Father\'s Name', labelHindi: 'पिता का नाम', value: 'श्री राम कुमार' },
      { label: 'Date of Birth', labelHindi: 'जन्म तिथि', value: '15/08/1985' },
      { label: 'Age', labelHindi: 'आयु', value: '38 years' },
      { label: 'Gender', labelHindi: 'लिंग', value: 'Male / पुरुष' },
      { label: 'Mobile Number', labelHindi: 'मोबाइल नंबर', value: '+91 98765 43210' },
      { label: 'Email', labelHindi: 'ईमेल', value: 'raj.kumar@example.com' },
      { label: 'Aadhaar Number', labelHindi: 'आधार नंबर', value: 'XXXX XXXX 5678' },
    ],
  },
  
  // Address Information
  addressInfo: {
    title: 'Address Details',
    titleHindi: 'पता विवरण',
    fields: [
      { label: 'Village/Town', labelHindi: 'गांव/शहर', value: 'Rampur' },
      { label: 'Post Office', labelHindi: 'डाकघर', value: 'Rampur' },
      { label: 'Block', labelHindi: 'ब्लॉक', value: 'Rampur' },
      { label: 'District', labelHindi: 'जिला', value: 'Sitapur' },
      { label: 'State', labelHindi: 'राज्य', value: 'Uttar Pradesh / उत्तर प्रदेश' },
      { label: 'PIN Code', labelHindi: 'पिन कोड', value: '261001' },
    ],
  },
  
  // Land Details (scheme-specific)
  landDetails: {
    title: 'Land Details',
    titleHindi: 'भूमि विवरण',
    fields: [
      { label: 'Total Land', labelHindi: 'कुल भूमि', value: '2.5 Hectares' },
      { label: 'Cultivable Land', labelHindi: 'खेती योग्य भूमि', value: '2.0 Hectares' },
      { label: 'Khasra Number', labelHindi: 'खसरा नंबर', value: '123/2, 124/1' },
      { label: 'Land Ownership', labelHindi: 'भूमि स्वामित्व', value: 'Self-Owned / स्वयं का' },
      { label: 'Crops Grown', labelHindi: 'उगाई गई फसलें', value: 'Wheat, Rice, Sugarcane' },
    ],
  },
  
  // Bank Details
  bankDetails: {
    title: 'Bank Account Details',
    titleHindi: 'बैंक खाता विवरण',
    fields: [
      { label: 'Bank Name', labelHindi: 'बैंक का नाम', value: 'State Bank of India' },
      { label: 'Branch', labelHindi: 'शाखा', value: 'Sitapur Main Branch' },
      { label: 'Account Number', labelHindi: 'खाता संख्या', value: 'XXXX XXXX 1234' },
      { label: 'IFSC Code', labelHindi: 'IFSC कोड', value: 'SBIN0001234' },
      { label: 'Account Type', labelHindi: 'खाता प्रकार', value: 'Savings / बचत' },
      { label: 'Account Holder', labelHindi: 'खाताधारक', value: 'राज कुमार' },
    ],
  },
  
  // Additional Information
  additionalInfo: {
    title: 'Additional Information',
    titleHindi: 'अतिरिक्त जानकारी',
    fields: [
      { label: 'Category', labelHindi: 'श्रेणी', value: 'General' },
      { label: 'Annual Income', labelHindi: 'वार्षिक आय', value: '₹1,50,000' },
      { label: 'BPL Card', labelHindi: 'BPL कार्ड', value: 'No / नहीं' },
      { label: 'Previous Beneficiary', labelHindi: 'पिछला लाभार्थी', value: 'No / नहीं' },
    ],
  },
  
  // Documents
  documents: [
    {
      id: 1,
      name: 'Aadhaar Card',
      nameHindi: 'आधार कार्ड',
      type: 'Identity Proof',
      typeHindi: 'पहचान प्रमाण',
      status: 'verified',
      uploadDate: '2024-02-15',
      fileSize: '245 KB',
      icon: 'card-outline',
    },
    {
      id: 2,
      name: 'Land Ownership Certificate',
      nameHindi: 'भूमि स्वामित्व प्रमाणपत्र',
      type: 'Property Document',
      typeHindi: 'संपत्ति दस्तावेज़',
      status: 'verified',
      uploadDate: '2024-02-15',
      fileSize: '1.2 MB',
      icon: 'document-text-outline',
    },
    {
      id: 3,
      name: 'Bank Passbook',
      nameHindi: 'बैंक पासबुक',
      type: 'Bank Proof',
      typeHindi: 'बैंक प्रमाण',
      status: 'verified',
      uploadDate: '2024-02-15',
      fileSize: '380 KB',
      icon: 'wallet-outline',
    },
    {
      id: 4,
      name: 'Income Certificate',
      nameHindi: 'आय प्रमाण पत्र',
      type: 'Income Proof',
      typeHindi: 'आय प्रमाण',
      status: 'pending',
      uploadDate: '2024-02-15',
      fileSize: '425 KB',
      icon: 'document-outline',
      note: 'Verification pending',
      noteHindi: 'सत्यापन लंबित',
    },
    {
      id: 5,
      name: 'Passport Size Photo',
      nameHindi: 'पासपोर्ट साइज़ फ़ोटो',
      type: 'Photograph',
      typeHindi: 'फोटोग्राफ',
      status: 'verified',
      uploadDate: '2024-02-15',
      fileSize: '156 KB',
      icon: 'image-outline',
    },
  ],
  
  // Processing Info
  processingInfo: {
    title: 'Processing Information',
    titleHindi: 'प्रसंस्करण जानकारी',
    fields: [
      { label: 'Reference Number', labelHindi: 'संदर्भ संख्या', value: 'REF202400123456' },
      { label: 'Processing Office', labelHindi: 'प्रसंस्करण कार्यालय', value: 'District Agriculture Office, Sitapur' },
      { label: 'Assigned Officer', labelHindi: 'नियुक्त अधिकारी', value: 'श्री अमित वर्मा' },
      { label: 'Officer Contact', labelHindi: 'अधिकारी संपर्क', value: '0522-XXXXXXX' },
      { label: 'Processing Days', labelHindi: 'प्रसंस्करण दिन', value: '15 days' },
    ],
  },
  
  // Scheme Benefits
  schemeBenefits: {
    title: 'Scheme Benefits',
    titleHindi: 'योजना लाभ',
    points: [
      {
        text: 'Financial assistance of ₹6,000 per year',
        textHindi: '₹6,000 प्रति वर्ष का वित्तीय सहायता',
      },
      {
        text: 'Amount transferred in three equal installments',
        textHindi: 'तीन समान किस्तों में राशि हस्तांतरित',
      },
      {
        text: 'Direct Benefit Transfer (DBT) to bank account',
        textHindi: 'बैंक खाते में प्रत्यक्ष लाभ अंतरण (DBT)',
      },
      {
        text: 'No middleman, direct government support',
        textHindi: 'कोई बिचौलिया नहीं, सीधा सरकारी समर्थन',
      },
    ],
  },
  
  // Remarks
  remarks: 'All documents have been submitted and verified. Application is currently under review by the State Agriculture Department. Expected approval within 15 working days.',
  remarksHindi: 'सभी दस्तावेज़ जमा और सत्यापित किए गए हैं। आवेदन वर्तमान में राज्य कृषि विभाग द्वारा समीक्षा के अधीन है। 15 कार्य दिवसों के भीतर स्वीकृति की उम्मीद है।',
};

const STATUS_CONFIG = {
  draft: { color: theme.colors.textSecondary, bgColor: '#f5f5f5', icon: 'document-outline' },
  submitted: { color: theme.colors.info, bgColor: '#E3F2FD', icon: 'checkmark-done-outline' },
  processing: { color: theme.colors.warning, bgColor: '#FFF3E0', icon: 'time-outline' },
  under_review: { color: '#9C27B0', bgColor: '#F3E5F5', icon: 'search-outline' },
  approved: { color: theme.colors.success, bgColor: '#E8F5E9', icon: 'checkmark-circle-outline' },
  rejected: { color: theme.colors.error, bgColor: '#FFEBEE', icon: 'close-circle-outline' },
  completed: { color: '#00ACC1', bgColor: '#E0F7FA', icon: 'trophy-outline' },
};

const DOCUMENT_STATUS = {
  verified: { color: theme.colors.success, label: 'Verified', labelHindi: 'सत्यापित', icon: 'checkmark-circle' },
  pending: { color: theme.colors.warning, label: 'Pending', labelHindi: 'लंबित', icon: 'time-outline' },
  rejected: { color: theme.colors.error, label: 'Rejected', labelHindi: 'अस्वीकृत', icon: 'close-circle' },
};

export default function ApplicationDetailsScreen({ route, navigation }) {
  const { applicationId } = route.params || {};
  const [refreshing, setRefreshing] = useState(false);
  const [application, setApplication] = useState(MOCK_APPLICATION_DETAILS);
  const [expandedSections, setExpandedSections] = useState({
    applicantInfo: true,
    addressInfo: true,
    landDetails: true,
    bankDetails: false,
    additionalInfo: false,
    documents: true,
    processingInfo: false,
    schemeBenefits: false,
  });

  // TODO: Fetch application details from API
  const fetchApplicationDetails = async () => {
    setRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // const response = await fetch(`/api/applications/${applicationId}/details`);
      // const data = await response.json();
      // setApplication(data);
    } catch (error) {
      console.error('Error fetching application:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `BolBharat Application Details\n\nScheme: ${application.schemeName}\nApplication Number: ${application.applicationNumber}\nStatus: ${application.statusLabel}\n\nCheck your application status on BolBharat app.`,
        title: 'Share Application Details',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleDownload = () => {
    Alert.alert(
      'Download Application',
      'आवेदन डाउनलोड करें\n\nDo you want to download the complete application with all documents as PDF?',
      [
        { text: 'Cancel / रद्द करें', style: 'cancel' },
        {
          text: 'Download / डाउनलोड',
          onPress: () => {
            // TODO: Implement download functionality
            Alert.alert('Success', 'Application PDF downloaded successfully');
          },
        },
      ]
    );
  };

  const handleViewStatus = () => {
    navigation.navigate('ApplicationStatusTracking', { applicationId: application.id });
  };

  const handleViewDocument = (document) => {
    Alert.alert(
      document.name,
      `${document.nameHindi}\n\nFile Size: ${document.fileSize}\nUploaded: ${document.uploadDate}\nStatus: ${DOCUMENT_STATUS[document.status].label}`,
      [
        { text: 'Close / बंद करें', style: 'cancel' },
        {
          text: 'View / देखें',
          onPress: () => {
            // TODO: Open document viewer
            console.log('View document:', document.id);
          },
        },
        {
          text: 'Download / डाउनलोड',
          onPress: () => {
            // TODO: Download document
            Alert.alert('Success', `${document.name} downloaded`);
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

  const statusConfig = STATUS_CONFIG[application.status] || STATUS_CONFIG.draft;

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
          <Text style={styles.headerTitle}>Application Details</Text>
          <Text style={styles.headerSubtitle}>आवेदन विवरण</Text>
        </View>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleShare}
        >
          <Ionicons name="share-outline" size={24} color={theme.colors.black} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchApplicationDetails} />
        }
      >
        {/* Application Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.schemeInfo}>
            <Text style={styles.schemeName}>{application.schemeName}</Text>
            <Text style={styles.schemeNameHindi}>{application.schemeNameHindi}</Text>
            <Text style={styles.applicationNumber}>Application #{application.applicationNumber}</Text>
          </View>
          
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
            <Ionicons name={statusConfig.icon} size={20} color={statusConfig.color} />
            <View style={styles.statusText}>
              <Text style={[styles.statusLabel, { color: statusConfig.color }]}>
                {application.statusLabel}
              </Text>
              <Text style={[styles.statusLabelHindi, { color: statusConfig.color }]}>
                {application.statusLabelHindi}
              </Text>
            </View>
          </View>

          <View style={styles.dateInfo}>
            <View style={styles.dateItem}>
              <Ionicons name="calendar-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.dateLabel}>Submitted: {formatDate(application.submittedDate)}</Text>
            </View>
            <View style={styles.dateItem}>
              <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.dateLabel}>Updated: {formatDate(application.lastUpdated)}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.viewStatusButton} onPress={handleViewStatus}>
            <Text style={styles.viewStatusText}>View Status Timeline</Text>
            <Ionicons name="arrow-forward" size={18} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Applicant Information */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('applicantInfo')}
          >
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="person-outline" size={24} color={theme.colors.primary} />
              <View style={styles.sectionHeaderText}>
                <Text style={styles.sectionTitle}>{application.applicantInfo.title}</Text>
                <Text style={styles.sectionTitleHindi}>{application.applicantInfo.titleHindi}</Text>
              </View>
            </View>
            <Ionicons
              name={expandedSections.applicantInfo ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
          
          {expandedSections.applicantInfo && (
            <View style={styles.sectionContent}>
              {application.applicantInfo.fields.map((field, index) => (
                <View key={index} style={styles.fieldRow}>
                  <View style={styles.fieldLabel}>
                    <Text style={styles.labelText}>{field.label}</Text>
                    <Text style={styles.labelTextHindi}>{field.labelHindi}</Text>
                  </View>
                  <Text style={styles.fieldValue}>{field.value}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Address Information */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('addressInfo')}
          >
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="location-outline" size={24} color={theme.colors.primary} />
              <View style={styles.sectionHeaderText}>
                <Text style={styles.sectionTitle}>{application.addressInfo.title}</Text>
                <Text style={styles.sectionTitleHindi}>{application.addressInfo.titleHindi}</Text>
              </View>
            </View>
            <Ionicons
              name={expandedSections.addressInfo ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
          
          {expandedSections.addressInfo && (
            <View style={styles.sectionContent}>
              {application.addressInfo.fields.map((field, index) => (
                <View key={index} style={styles.fieldRow}>
                  <View style={styles.fieldLabel}>
                    <Text style={styles.labelText}>{field.label}</Text>
                    <Text style={styles.labelTextHindi}>{field.labelHindi}</Text>
                  </View>
                  <Text style={styles.fieldValue}>{field.value}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Land Details */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('landDetails')}
          >
            <View style={styles.sectionHeaderLeft}>
              <MaterialCommunityIcons name="terrain" size={24} color={theme.colors.primary} />
              <View style={styles.sectionHeaderText}>
                <Text style={styles.sectionTitle}>{application.landDetails.title}</Text>
                <Text style={styles.sectionTitleHindi}>{application.landDetails.titleHindi}</Text>
              </View>
            </View>
            <Ionicons
              name={expandedSections.landDetails ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
          
          {expandedSections.landDetails && (
            <View style={styles.sectionContent}>
              {application.landDetails.fields.map((field, index) => (
                <View key={index} style={styles.fieldRow}>
                  <View style={styles.fieldLabel}>
                    <Text style={styles.labelText}>{field.label}</Text>
                    <Text style={styles.labelTextHindi}>{field.labelHindi}</Text>
                  </View>
                  <Text style={styles.fieldValue}>{field.value}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Bank Details */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('bankDetails')}
          >
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="wallet-outline" size={24} color={theme.colors.primary} />
              <View style={styles.sectionHeaderText}>
                <Text style={styles.sectionTitle}>{application.bankDetails.title}</Text>
                <Text style={styles.sectionTitleHindi}>{application.bankDetails.titleHindi}</Text>
              </View>
            </View>
            <Ionicons
              name={expandedSections.bankDetails ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
          
          {expandedSections.bankDetails && (
            <View style={styles.sectionContent}>
              {application.bankDetails.fields.map((field, index) => (
                <View key={index} style={styles.fieldRow}>
                  <View style={styles.fieldLabel}>
                    <Text style={styles.labelText}>{field.label}</Text>
                    <Text style={styles.labelTextHindi}>{field.labelHindi}</Text>
                  </View>
                  <Text style={styles.fieldValue}>{field.value}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Additional Information */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('additionalInfo')}
          >
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="information-circle-outline" size={24} color={theme.colors.primary} />
              <View style={styles.sectionHeaderText}>
                <Text style={styles.sectionTitle}>{application.additionalInfo.title}</Text>
                <Text style={styles.sectionTitleHindi}>{application.additionalInfo.titleHindi}</Text>
              </View>
            </View>
            <Ionicons
              name={expandedSections.additionalInfo ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
          
          {expandedSections.additionalInfo && (
            <View style={styles.sectionContent}>
              {application.additionalInfo.fields.map((field, index) => (
                <View key={index} style={styles.fieldRow}>
                  <View style={styles.fieldLabel}>
                    <Text style={styles.labelText}>{field.label}</Text>
                    <Text style={styles.labelTextHindi}>{field.labelHindi}</Text>
                  </View>
                  <Text style={styles.fieldValue}>{field.value}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Documents */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('documents')}
          >
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="document-text-outline" size={24} color={theme.colors.primary} />
              <View style={styles.sectionHeaderText}>
                <Text style={styles.sectionTitle}>Submitted Documents ({application.documents.length})</Text>
                <Text style={styles.sectionTitleHindi}>जमा किए गए दस्तावेज़ ({application.documents.length})</Text>
              </View>
            </View>
            <Ionicons
              name={expandedSections.documents ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
          
          {expandedSections.documents && (
            <View style={styles.sectionContent}>
              {application.documents.map((doc) => {
                const docStatus = DOCUMENT_STATUS[doc.status];
                return (
                  <TouchableOpacity
                    key={doc.id}
                    style={styles.documentCard}
                    onPress={() => handleViewDocument(doc)}
                  >
                    <View style={styles.documentIcon}>
                      <Ionicons name={doc.icon} size={32} color={theme.colors.primary} />
                    </View>
                    <View style={styles.documentInfo}>
                      <Text style={styles.documentName}>{doc.name}</Text>
                      <Text style={styles.documentNameHindi}>{doc.nameHindi}</Text>
                      <Text style={styles.documentType}>{doc.type} • {doc.fileSize}</Text>
                      <View style={styles.documentStatusBadge}>
                        <Ionicons name={docStatus.icon} size={14} color={docStatus.color} />
                        <Text style={[styles.documentStatusText, { color: docStatus.color }]}>
                          {docStatus.label} / {docStatus.labelHindi}
                        </Text>
                      </View>
                      {doc.note && (
                        <Text style={styles.documentNote}>{doc.note}</Text>
                      )}
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* Processing Information */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('processingInfo')}
          >
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="settings-outline" size={24} color={theme.colors.primary} />
              <View style={styles.sectionHeaderText}>
                <Text style={styles.sectionTitle}>{application.processingInfo.title}</Text>
                <Text style={styles.sectionTitleHindi}>{application.processingInfo.titleHindi}</Text>
              </View>
            </View>
            <Ionicons
              name={expandedSections.processingInfo ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
          
          {expandedSections.processingInfo && (
            <View style={styles.sectionContent}>
              {application.processingInfo.fields.map((field, index) => (
                <View key={index} style={styles.fieldRow}>
                  <View style={styles.fieldLabel}>
                    <Text style={styles.labelText}>{field.label}</Text>
                    <Text style={styles.labelTextHindi}>{field.labelHindi}</Text>
                  </View>
                  <Text style={styles.fieldValue}>{field.value}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Scheme Benefits */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('schemeBenefits')}
          >
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="gift-outline" size={24} color={theme.colors.primary} />
              <View style={styles.sectionHeaderText}>
                <Text style={styles.sectionTitle}>{application.schemeBenefits.title}</Text>
                <Text style={styles.sectionTitleHindi}>{application.schemeBenefits.titleHindi}</Text>
              </View>
            </View>
            <Ionicons
              name={expandedSections.schemeBenefits ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
          
          {expandedSections.schemeBenefits && (
            <View style={styles.sectionContent}>
              {application.schemeBenefits.points.map((point, index) => (
                <View key={index} style={styles.benefitPoint}>
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={theme.colors.success}
                    style={styles.benefitIcon}
                  />
                  <View style={styles.benefitText}>
                    <Text style={styles.benefitTextEn}>{point.text}</Text>
                    <Text style={styles.benefitTextHi}>{point.textHindi}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Remarks */}
        {application.remarks && (
          <View style={styles.remarksCard}>
            <View style={styles.remarksHeader}>
              <Ionicons name="chatbox-ellipses-outline" size={20} color={theme.colors.info} />
              <Text style={styles.remarksTitle}>Remarks / टिप्पणियां</Text>
            </View>
            <Text style={styles.remarksText}>{application.remarks}</Text>
            <Text style={styles.remarksTextHindi}>{application.remarksHindi}</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonPrimary]}
            onPress={handleDownload}
          >
            <Ionicons name="download-outline" size={20} color={theme.colors.white} />
            <Text style={styles.actionButtonTextPrimary}>Download PDF</Text>
          </TouchableOpacity>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonSecondary, styles.actionButtonHalf]}
              onPress={handleShare}
            >
              <Ionicons name="share-social-outline" size={20} color={theme.colors.primary} />
              <Text style={styles.actionButtonTextSecondary}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonSecondary, styles.actionButtonHalf]}
              onPress={handleViewStatus}
            >
              <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
              <Text style={styles.actionButtonTextSecondary}>Track Status</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Help Text */}
        <View style={styles.helpCard}>
          <Ionicons name="help-circle-outline" size={20} color={theme.colors.textSecondary} />
          <Text style={styles.helpText}>
            For any queries or corrections, please contact the processing office or call the helpline: 1800-XXX-XXXX
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
  headerCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.elevation.medium,
  },
  schemeInfo: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  schemeName: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.black,
    textAlign: 'center',
  },
  schemeNameHindi: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  applicationNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
    marginTop: theme.spacing.xs,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 20,
    marginBottom: theme.spacing.md,
  },
  statusText: {
    marginLeft: theme.spacing.sm,
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  statusLabelHindi: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  dateInfo: {
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  dateLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  viewStatusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.primary + '10',
    borderRadius: 8,
    gap: theme.spacing.xs,
  },
  viewStatusText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  section: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    ...theme.elevation.small,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionHeaderText: {
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.black,
  },
  sectionTitleHindi: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  sectionContent: {
    padding: theme.spacing.md,
    paddingTop: 0,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  fieldLabel: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  labelText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  labelTextHindi: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  fieldValue: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.black,
    textAlign: 'right',
    flex: 1,
  },
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    marginBottom: theme.spacing.sm,
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentInfo: {
    flex: 1,
    marginLeft: theme.spacing.sm,
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
  documentType: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  documentStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  documentStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  documentNote: {
    fontSize: 12,
    color: theme.colors.warning,
    marginTop: 4,
    fontStyle: 'italic',
  },
  benefitPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  benefitIcon: {
    marginTop: 2,
  },
  benefitText: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  benefitTextEn: {
    fontSize: 14,
    color: theme.colors.black,
    lineHeight: 20,
  },
  benefitTextHi: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    marginTop: 2,
  },
  remarksCard: {
    backgroundColor: theme.colors.info + '10',
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.info,
  },
  remarksHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  remarksTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.info,
  },
  remarksText: {
    fontSize: 14,
    color: theme.colors.black,
    lineHeight: 20,
  },
  remarksTextHindi: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    marginTop: theme.spacing.xs,
  },
  actionsContainer: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
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
  actionButtonHalf: {
    flex: 1,
  },
  actionButtonTextPrimary: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.white,
  },
  actionButtonTextSecondary: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    gap: theme.spacing.sm,
  },
  helpText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
});
