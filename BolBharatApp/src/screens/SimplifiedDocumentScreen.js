import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
// import { Audio } from 'expo-av'; // Commented out - requires native build, will use AWS Polly
import { colors, spacing, typography } from '../theme';
import { useDocumentHistory } from '../context/DocumentHistoryContext';

// Mock data - In production, this would come from AWS Textract + Bedrock
const MOCK_DOCUMENT_DATA = {
  title: 'Ration Card Application',
  titleHindi: 'राशन कार्ड आवेदन',
  documentType: 'Government Form',
  extractedText: `APPLICATION FOR RATION CARD

To,
The Tahsildar,
[District Name]

Subject: Application for New Ration Card

Sir/Madam,

I, the undersigned, hereby apply for the issuance of a new ration card for my family. I request you to kindly issue the ration card in the name of the head of the family as mentioned below.

Details of Head of Family:
Name: ____________
Father's/Husband's Name: ____________
Address: ____________
Mobile Number: ____________

Family Members:
1. Name: ____________ Relation: ____________ Age: ____
2. Name: ____________ Relation: ____________ Age: ____
3. Name: ____________ Relation: ____________ Age: ____

Required Documents Enclosed:
1. Address Proof
2. Identity Proof (Aadhaar Card)
3. Income Certificate
4. Passport Size Photographs

I hereby declare that the information provided above is true and correct to the best of my knowledge.

Date: ____________
Place: ____________
Signature: ____________`,
  simplifiedText: `This is an application form to get a new ration card for your family.

What you need to do:
1. Fill in your name and address
2. List all family members (name, relationship, age)
3. Attach these documents:
   • Address proof (like electricity bill)
   • Aadhaar card
   • Income certificate
   • Your photographs

Submit this form to your local Tahsildar office. They will verify your documents and issue a ration card within 30 days.

The ration card helps you buy essential items like rice, wheat, and sugar at lower prices from government shops.`,
  simplifiedTextHindi: `यह आपके परिवार के लिए नया राशन कार्ड प्राप्त करने का आवेदन पत्र है।

आपको क्या करना है:
1. अपना नाम और पता भरें
2. सभी परिवार के सदस्यों की सूची बनाएं (नाम, रिश्ता, उम्र)
3. ये दस्तावेज़ संलग्न करें:
   • पते का प्रमाण (जैसे बिजली बिल)
   • आधार कार्ड
   • आय प्रमाण पत्र
   • आपकी फोटो

इस फॉर्म को अपने स्थानीय तहसीलदार कार्यालय में जमा करें। वे आपके दस्तावेज़ों की जांच करेंगे और 30 दिनों के भीतर राशन कार्ड जारी करेंगे।

राशन कार्ड आपको सरकारी दुकानों से चावल, गेहूं और चीनी जैसी आवश्यक वस्तुओं को कम कीमत पर खरीदने में मदद करता है।`,
  keyPoints: [
    {
      title: 'Who can apply?',
      content: 'Any head of household without an existing ration card',
      icon: 'person',
    },
    {
      title: 'Processing time',
      content: '30 days from submission',
      icon: 'time',
    },
    {
      title: 'Cost',
      content: 'No fee required',
      icon: 'cash',
    },
    {
      title: 'Where to submit',
      content: 'Local Tahsildar office',
      icon: 'location',
    },
  ],
};

export default function SimplifiedDocumentScreen({ route, navigation }) {
  const { imageUri, originalUri, documentId } = route.params || {};
  
  const [activeTab, setActiveTab] = useState('simplified'); // 'original', 'simplified'
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savedDocumentId, setSavedDocumentId] = useState(documentId || null);
  const [language, setLanguage] = useState('english'); // 'english', 'hindi'

  const { addDocument, updateDocument, getDocument } = useDocumentHistory();
  const tabIndicatorPosition = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Check if this document is already saved
    if (documentId) {
      const existingDoc = getDocument(documentId);
      if (existingDoc) {
        setIsSaved(true);
        setSavedDocumentId(documentId);
      }
    }
  }, [documentId]);

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;

    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setActiveTab(tab);
      
      // Animate indicator
      Animated.spring(tabIndicatorPosition, {
        toValue: tab === 'original' ? 0 : 1,
        useNativeDriver: true,
      }).start();

      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  const handlePlayAudio = () => {
    // Audio feature requires AWS Polly integration
    Alert.alert(
      'Audio Feature',
      'Text-to-speech will be enabled when AWS Polly is integrated.',
      [{ text: 'OK' }]
    );
    
    // TODO: Implement actual text-to-speech with AWS Polly
    // This will convert the simplified text to audio in the selected language
  };

  const handleSave = async () => {
    if (isSaved && savedDocumentId) {
      // Already saved, show confirmation to unsave
      Alert.alert(
        'Remove Document',
        'Are you sure you want to remove this document from history?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: () => {
              setIsSaved(false);
              setSavedDocumentId(null);
              // Note: We don't delete here, just mark as unsaved in UI
            },
          },
        ]
      );
    } else {
      // Save new document
      try {
        const docId = await addDocument({
          imageUri,
          originalUri,
          title: MOCK_DOCUMENT_DATA.title,
          titleHindi: MOCK_DOCUMENT_DATA.titleHindi,
          documentType: MOCK_DOCUMENT_DATA.documentType,
          extractedText: MOCK_DOCUMENT_DATA.extractedText,
          simplifiedText: MOCK_DOCUMENT_DATA.simplifiedText,
          simplifiedTextHindi: MOCK_DOCUMENT_DATA.simplifiedTextHindi,
          keyPoints: MOCK_DOCUMENT_DATA.keyPoints,
        });
        setIsSaved(true);
        setSavedDocumentId(docId);
        Alert.alert('Success', 'Document saved to history!');
      } catch (error) {
        console.error('Error saving document:', error);
        Alert.alert('Error', 'Failed to save document. Please try again.');
      }
    }
  };

  const handleShare = () => {
    Alert.alert('Share Document', 'Share functionality coming soon!');
  };

  const renderOriginalTab = () => (
    <Animated.View style={[styles.tabContent, { opacity: fadeAnim }]}>
      {/* Document Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.documentImage} />
      </View>

      {/* Extracted Text */}
      <View style={styles.textCard}>
        <View style={styles.textCardHeader}>
          <MaterialCommunityIcons name="text-recognition" size={24} color={colors.black} />
          <Text style={styles.textCardTitle}>Extracted Text</Text>
        </View>
        <ScrollView style={styles.extractedTextScroll} nestedScrollEnabled>
          <Text style={styles.extractedText}>{MOCK_DOCUMENT_DATA.extractedText}</Text>
        </ScrollView>
      </View>
    </Animated.View>
  );

  const renderSimplifiedTab = () => {
    const currentText = language === 'hindi' 
      ? MOCK_DOCUMENT_DATA.simplifiedTextHindi 
      : MOCK_DOCUMENT_DATA.simplifiedText;

    return (
      <Animated.View style={[styles.tabContent, { opacity: fadeAnim }]}>
        {/* Document Info */}
        <View style={styles.documentInfo}>
          <View style={styles.documentHeader}>
            <View style={styles.documentIconContainer}>
              <MaterialCommunityIcons
                name="file-document-outline"
                size={28}
                color={colors.black}
              />
            </View>
            <View style={styles.documentTitleContainer}>
              <Text style={styles.documentTitle}>
                {language === 'hindi' ? MOCK_DOCUMENT_DATA.titleHindi : MOCK_DOCUMENT_DATA.title}
              </Text>
              <Text style={styles.documentType}>{MOCK_DOCUMENT_DATA.documentType}</Text>
            </View>
          </View>

          {/* Language Toggle */}
          <View style={styles.languageToggle}>
            <TouchableOpacity
              style={[
                styles.languageButton,
                language === 'english' && styles.languageButtonActive,
              ]}
              onPress={() => setLanguage('english')}
            >
              <Text
                style={[
                  styles.languageButtonText,
                  language === 'english' && styles.languageButtonTextActive,
                ]}
              >
                English
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.languageButton,
                language === 'hindi' && styles.languageButtonActive,
              ]}
              onPress={() => setLanguage('hindi')}
            >
              <Text
                style={[
                  styles.languageButtonText,
                  language === 'hindi' && styles.languageButtonTextActive,
                ]}
              >
                हिंदी
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Audio Player */}
        <TouchableOpacity style={styles.audioPlayer} onPress={handlePlayAudio}>
          <View style={styles.audioPlayerIcon}>
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={24}
              color={colors.white}
            />
          </View>
          <View style={styles.audioPlayerContent}>
            <Text style={styles.audioPlayerTitle}>
              {isPlaying ? 'Playing...' : 'Listen to explanation'}
            </Text>
            <Text style={styles.audioPlayerSubtitle}>
              {language === 'hindi' ? 'हिंदी में सुनें' : 'Audio in your language'}
            </Text>
          </View>
          {isPlaying && (
            <ActivityIndicator size="small" color={colors.white} />
          )}
        </TouchableOpacity>

        {/* Simplified Text */}
        <View style={styles.simplifiedCard}>
          <View style={styles.simplifiedHeader}>
            <MaterialCommunityIcons
              name="file-document-edit-outline"
              size={24}
              color={colors.black}
            />
            <Text style={styles.simplifiedTitle}>Simplified Explanation</Text>
          </View>
          <Text style={styles.simplifiedText}>{currentText}</Text>
        </View>

        {/* Key Points */}
        <View style={styles.keyPointsSection}>
          <Text style={styles.sectionTitle}>Key Information</Text>
          <View style={styles.keyPointsGrid}>
            {MOCK_DOCUMENT_DATA.keyPoints.map((point, index) => (
              <View key={index} style={styles.keyPointCard}>
                <View style={styles.keyPointIconContainer}>
                  <Ionicons name={point.icon} size={20} color={colors.black} />
                </View>
                <Text style={styles.keyPointTitle}>{point.title}</Text>
                <Text style={styles.keyPointContent}>{point.content}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Original Image Preview */}
        <View style={styles.originalPreview}>
          <Text style={styles.sectionTitle}>Original Document</Text>
          <TouchableOpacity
            style={styles.originalImageContainer}
            onPress={() => handleTabChange('original')}
          >
            <Image source={{ uri: imageUri }} style={styles.originalImage} />
            <View style={styles.originalImageOverlay}>
              <Ionicons name="expand" size={24} color={colors.white} />
              <Text style={styles.originalImageText}>View Original</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.black} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Document Simplified</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIconButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={22} color={colors.black} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => handleTabChange('simplified')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'simplified' && styles.tabTextActive,
            ]}
          >
            Simplified
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => handleTabChange('original')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'original' && styles.tabTextActive,
            ]}
          >
            Original
          </Text>
        </TouchableOpacity>
        <Animated.View
          style={[
            styles.tabIndicator,
            {
              transform: [
                {
                  translateX: tabIndicatorPosition.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 160],
                  }),
                },
              ],
            },
          ]}
        />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'original' ? renderOriginalTab() : renderSimplifiedTab()}
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.actionButton, styles.saveButton]}
          onPress={handleSave}
        >
          <Ionicons
            name={isSaved ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={colors.black}
          />
          <Text style={styles.saveButtonText}>
            {isSaved ? 'Saved' : 'Save'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.doneButton]}
          onPress={() => navigation.navigate('DocumentsList')}
        >
          <Text style={styles.doneButtonText}>Done</Text>
          <Ionicons name="checkmark" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>
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
  headerButton: {
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
  headerTitle: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 40,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
    position: 'relative',
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 15,
    fontFamily: typography.fontFamily.medium,
    color: colors.textSecondary,
  },
  tabTextActive: {
    fontFamily: typography.fontFamily.semiBold,
    color: colors.black,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '50%',
    height: 3,
    backgroundColor: colors.black,
  },

  // Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  tabContent: {
    padding: spacing.xl,
  },

  // Original Tab
  imageContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.gray200,
  },
  documentImage: {
    width: '100%',
    aspectRatio: 0.707,
    borderRadius: 12,
    resizeMode: 'contain',
  },
  textCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.gray200,
  },
  textCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  textCardTitle: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },
  extractedTextScroll: {
    maxHeight: 300,
  },
  extractedText: {
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
    lineHeight: 20,
  },

  // Simplified Tab
  documentInfo: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.gray200,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  documentIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.gray50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  documentTitleContainer: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs / 2,
  },
  documentType: {
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },

  // Language Toggle
  languageToggle: {
    flexDirection: 'row',
    backgroundColor: colors.gray50,
    borderRadius: 12,
    padding: spacing.xs,
    gap: spacing.xs,
  },
  languageButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: 10,
  },
  languageButtonActive: {
    backgroundColor: colors.black,
  },
  languageButtonText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    color: colors.textSecondary,
  },
  languageButtonTextActive: {
    fontFamily: typography.fontFamily.semiBold,
    color: colors.white,
  },

  // Audio Player
  audioPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.black,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  audioPlayerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioPlayerContent: {
    flex: 1,
  },
  audioPlayerTitle: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.white,
    marginBottom: spacing.xs / 2,
  },
  audioPlayerSubtitle: {
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    color: 'rgba(255,255,255,0.7)',
  },

  // Simplified Text
  simplifiedCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.gray200,
  },
  simplifiedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  simplifiedTitle: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },
  simplifiedText: {
    fontSize: 15,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
    lineHeight: 24,
  },

  // Key Points
  keyPointsSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  keyPointsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  keyPointCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.gray200,
  },
  keyPointIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  keyPointTitle: {
    fontSize: 13,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  keyPointContent: {
    fontSize: 12,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    lineHeight: 18,
  },

  // Original Preview
  originalPreview: {
    marginBottom: spacing.lg,
  },
  originalImageContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.gray200,
  },
  originalImage: {
    width: '100%',
    aspectRatio: 1.5,
    resizeMode: 'cover',
  },
  originalImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  originalImageText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.white,
    marginTop: spacing.sm,
  },

  // Bottom Bar
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    gap: spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    gap: spacing.xs,
  },
  saveButton: {
    flex: 0.35,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.black,
  },
  saveButtonText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.black,
  },
  doneButton: {
    flex: 0.65,
    backgroundColor: colors.black,
  },
  doneButtonText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.white,
  },
});
