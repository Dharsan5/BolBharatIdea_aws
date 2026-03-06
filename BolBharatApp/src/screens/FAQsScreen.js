import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

/**
 * FAQsScreen
 * 
 * Frequently Asked Questions screen with:
 * - Search functionality
 * - Category filtering
 * - Expandable FAQ items
 * - Bilingual content (English/Hindi)
 * 
 * Categories: All, Schemes, Forms, Documents, Profile, App Usage, Technical
 */

const FAQ_DATA = [
  // Schemes Category
  {
    id: 1,
    category: 'schemes',
    question: 'How do I find schemes that I am eligible for?',
    questionHindi: 'मैं कैसे पता करूं कि मैं किन योजनाओं के लिए पात्र हूं?',
    answer: 'Go to the Schemes tab and use the voice search or text search. The app will analyze your profile and show schemes that match your eligibility criteria. You can also use the Eligibility Checker for any specific scheme.',
    answerHindi: 'योजनाएं टैब पर जाएं और वॉयस सर्च या टेक्स्ट सर्च का उपयोग करें। ऐप आपकी प्रोफ़ाइल का विश्लेषण करेगा और उन योजनाओं को दिखाएगा जो आपकी पात्रता मानदंड से मेल खाती हैं। आप किसी विशिष्ट योजना के लिए पात्रता जांचकर्ता का भी उपयोग कर सकते हैं।',
  },
  {
    id: 2,
    category: 'schemes',
    question: 'Can I save schemes for later?',
    questionHindi: 'क्या मैं योजनाओं को बाद के लिए सहेज सकता हूं?',
    answer: 'Yes! Tap the bookmark icon on any scheme detail page to save it. You can access all your saved schemes from the Saved Schemes screen in the Schemes tab.',
    answerHindi: 'हां! किसी भी योजना विवरण पृष्ठ पर बुकमार्क आइकन पर टैप करें। आप योजनाएं टैब में सहेजी गई योजनाएं स्क्रीन से अपनी सभी सहेजी गई योजनाओं तक पहुंच सकते हैं।',
  },
  {
    id: 3,
    category: 'schemes',
    question: 'How often is the scheme database updated?',
    questionHindi: 'योजना डेटाबेस कितनी बार अपडेट किया जाता है?',
    answer: 'The scheme database is updated regularly with information from official government sources. New schemes and updates are typically reflected within 24-48 hours of official announcements.',
    answerHindi: 'योजना डेटाबेस को नियमित रूप से आधिकारिक सरकारी स्रोतों से जानकारी के साथ अपडेट किया जाता है। नई योजनाएं और अपडेट आमतौर पर आधिकारिक घोषणाओं के 24-48 घंटों के भीतर प्रतिबिंबित होते हैं।',
  },
  
  // Forms Category
  {
    id: 4,
    category: 'forms',
    question: 'How does the conversational form filling work?',
    questionHindi: 'वार्तालाप फॉर्म भरना कैसे काम करता है?',
    answer: 'Instead of filling complex forms manually, our app asks you simple questions one at a time. You can answer using your voice or by typing. The app automatically fills in the form fields based on your answers.',
    answerHindi: 'जटिल फॉर्म मैन्युअल रूप से भरने के बजाय, हमारा ऐप आपसे एक समय में सरल प्रश्न पूछता है। आप अपनी आवाज़ का उपयोग करके या टाइप करके उत्तर दे सकते हैं। ऐप स्वचालित रूप से आपके उत्तरों के आधार पर फॉर्म फ़ील्ड भरता है।',
  },
  {
    id: 5,
    category: 'forms',
    question: 'Can I save a form and complete it later?',
    questionHindi: 'क्या मैं फॉर्म सहेज सकता हूं और बाद में पूरा कर सकता हूं?',
    answer: 'Yes! Your progress is automatically saved. You can exit the form at any time and resume from where you left off. All saved forms are available in the Application Tracking screen.',
    answerHindi: 'हां! आपकी प्रगति स्वचालित रूप से सहेजी जाती है। आप किसी भी समय फॉर्म से बाहर निकल सकते हैं और जहां आपने छोड़ा था वहां से फिर से शुरू कर सकते हैं। सभी सहेजे गए फॉर्म एप्लिकेशन ट्रैकिंग स्क्रीन में उपलब्ध हैं।',
  },
  {
    id: 6,
    category: 'forms',
    question: 'What happens after I submit a form?',
    questionHindi: 'फॉर्म जमा करने के बाद क्या होता है?',
    answer: 'After submission, you will receive a confirmation with a reference number. You can track the status of your application in the Application Tracking screen. You will also receive notifications about status updates.',
    answerHindi: 'सबमिशन के बाद, आपको एक संदर्भ संख्या के साथ पुष्टि प्राप्त होगी। आप एप्लिकेशन ट्रैकिंग स्क्रीन में अपने आवेदन की स्थिति ट्रैक कर सकते हैं। आपको स्थिति अपडेट के बारे में सूचनाएं भी प्राप्त होंगी।',
  },
  
  // Documents Category
  {
    id: 7,
    category: 'documents',
    question: 'How do I scan documents using the app?',
    questionHindi: 'मैं ऐप का उपयोग करके दस्तावेज़ कैसे स्कैन करूं?',
    answer: 'Go to the Documents tab and tap the camera icon. Point your camera at the document and tap capture. The app will automatically detect edges and enhance the image. You can then review and save the scanned document.',
    answerHindi: 'दस्तावेज़ टैब पर जाएं और कैमरा आइकन पर टैप करें। अपने कैमरे को दस्तावेज़ की ओर इंगित करें और कैप्चर पर टैप करें। ऐप स्वचालित रूप से किनारों का पता लगाएगा और छवि को बढ़ाएगा। फिर आप स्कैन किए गए दस्तावेज़ की समीक्षा और सहेज सकते हैं।',
  },
  {
    id: 8,
    category: 'documents',
    question: 'Can the app simplify complex government documents?',
    questionHindi: 'क्या ऐप जटिल सरकारी दस्तावेज़ों को सरल बना सकता है?',
    answer: 'Yes! After scanning a document, tap "Simplify" to get an easy-to-understand summary in simple language. You can also listen to an audio explanation if you prefer.',
    answerHindi: 'हां! दस्तावेज़ स्कैन करने के बाद, सरल भाषा में समझने में आसान सारांश प्राप्त करने के लिए "सरल बनाएं" पर टैप करें। यदि आप चाहें तो ऑडियो स्पष्टीकरण भी सुन सकते हैं।',
  },
  {
    id: 9,
    category: 'documents',
    question: 'Where are my scanned documents stored?',
    questionHindi: 'मेरे स्कैन किए गए दस्तावेज़ कहां संग्रहीत हैं?',
    answer: 'All your scanned documents are securely stored on your device and in the cloud (if enabled). You can access them anytime from the Document History screen in the Documents tab.',
    answerHindi: 'आपके सभी स्कैन किए गए दस्तावेज़ सुरक्षित रूप से आपके डिवाइस पर और क्लाउड में (यदि सक्षम हो) संग्रहीत हैं। आप उन्हें दस्तावेज़ टैब में दस्तावेज़ इतिहास स्क्रीन से कभी भी एक्सेस कर सकते हैं।',
  },
  
  // Profile Category
  {
    id: 10,
    category: 'profile',
    question: 'Why do I need to complete my profile?',
    questionHindi: 'मुझे अपनी प्रोफ़ाइल पूरी करने की आवश्यकता क्यों है?',
    answer: 'A complete profile helps the app provide more accurate scheme recommendations and pre-fill forms with your information, saving you time. Your profile data is kept secure and private.',
    answerHindi: 'एक पूर्ण प्रोफ़ाइल ऐप को अधिक सटीक योजना सिफारिशें प्रदान करने और आपकी जानकारी के साथ फॉर्म को पूर्व-भरने में मदद करती है, जिससे आपका समय बचता है। आपका प्रोफ़ाइल डेटा सुरक्षित और निजी रखा जाता है।',
  },
  {
    id: 11,
    category: 'profile',
    question: 'How do I update my profile information?',
    questionHindi: 'मैं अपनी प्रोफ़ाइल जानकारी कैसे अपडेट करूं?',
    answer: 'Go to the Profile tab and tap "Edit Profile". You can update your personal details, location, demographics, and other information. Don\'t forget to save your changes.',
    answerHindi: 'प्रोफ़ाइल टैब पर जाएं और "प्रोफ़ाइल संपादित करें" पर टैप करें। आप अपने व्यक्तिगत विवरण, स्थान, जनसांख्यिकी और अन्य जानकारी अपडेट कर सकते हैं। अपने परिवर्तनों को सहेजना न भूलें।',
  },
  {
    id: 12,
    category: 'profile',
    question: 'Is my personal information safe?',
    questionHindi: 'क्या मेरी व्यक्तिगत जानकारी सुरक्षित है?',
    answer: 'Yes! We use industry-standard encryption to protect your data. Your information is only used to provide you with personalized services and is never shared with third parties without your consent.',
    answerHindi: 'हां! हम आपके डेटा की सुरक्षा के लिए उद्योग-मानक एन्क्रिप्शन का उपयोग करते हैं। आपकी जानकारी का उपयोग केवल आपको वैयक्तिकृत सेवाएं प्रदान करने के लिए किया जाता है और आपकी सहमति के बिना कभी भी तीसरे पक्ष के साथ साझा नहीं की जाती है।',
  },
  
  // App Usage Category
  {
    id: 13,
    category: 'app',
    question: 'How do I use voice commands?',
    questionHindi: 'मैं वॉयस कमांड का उपयोग कैसे करूं?',
    answer: 'Look for the microphone icon throughout the app. Tap and hold it while speaking, then release. The app will transcribe your speech and respond accordingly. You can use voice for searching schemes, answering form questions, and more.',
    answerHindi: 'ऐप में माइक्रोफ़ोन आइकन देखें। बोलते समय इसे टैप करें और होल्ड करें, फिर छोड़ दें। ऐप आपके भाषण को ट्रांसक्राइब करेगा और तदनुसार प्रतिक्रिया देगा। आप योजनाओं को खोजने, फॉर्म प्रश्नों के उत्तर देने और अधिक के लिए वॉयस का उपयोग कर सकते हैं।',
  },
  {
    id: 14,
    category: 'app',
    question: 'Can I change the app language?',
    questionHindi: 'क्या मैं ऐप की भाषा बदल सकता हूं?',
    answer: 'Yes! Go to Profile > Language Settings to choose your preferred language. The app supports multiple Indian languages including Hindi, Tamil, Telugu, and more.',
    answerHindi: 'हां! अपनी पसंदीदा भाषा चुनने के लिए प्रोफ़ाइल > भाषा सेटिंग्स पर जाएं। ऐप हिंदी, तमिल, तेलुगु और अधिक सहित कई भारतीय भाषाओं का समर्थन करता है।',
  },
  {
    id: 15,
    category: 'app',
    question: 'Does the app work offline?',
    questionHindi: 'क्या ऐप ऑफ़लाइन काम करता है?',
    answer: 'Yes! Most features work offline including viewing saved schemes, accessing your documents, and filling forms. Your data will automatically sync when you reconnect to the internet.',
    answerHindi: 'हां! अधिकांश सुविधाएं ऑफ़लाइन काम करती हैं जिसमें सहेजी गई योजनाओं को देखना, अपने दस्तावेजों तक पहुंचना और फॉर्म भरना शामिल है। जब आप इंटरनेट से फिर से कनेक्ट होते हैं तो आपका डेटा स्वचालित रूप से सिंक हो जाएगा।',
  },
  
  // Technical Category
  {
    id: 16,
    category: 'technical',
    question: 'The app is running slowly. What should I do?',
    questionHindi: 'ऐप धीमी गति से चल रहा है। मुझे क्या करना चाहिए?',
    answer: 'Try clearing the app cache from Profile > Settings > Clear Cache. Also ensure you have a stable internet connection and sufficient storage space on your device. Restarting the app can also help.',
    answerHindi: 'प्रोफ़ाइल > सेटिंग्स > कैश साफ़ करें से ऐप कैश साफ़ करने का प्रयास करें। यह भी सुनिश्चित करें कि आपके पास एक स्थिर इंटरनेट कनेक्शन है और आपके डिवाइस पर पर्याप्त स्टोरेज स्पेस है। ऐप को पुनरारंभ करने से भी मदद मिल सकती है।',
  },
  {
    id: 17,
    category: 'technical',
    question: 'I am not receiving notifications. How do I fix this?',
    questionHindi: 'मुझे सूचनाएं नहीं मिल रही हैं। मैं इसे कैसे ठीक करूं?',
    answer: 'Go to your device Settings > Apps > BolBharat > Notifications and ensure notifications are enabled. Also check that you have enabled notifications in the app settings under Profile > Privacy Settings.',
    answerHindi: 'अपने डिवाइस सेटिंग्स > ऐप्स > BolBharat > सूचनाएं पर जाएं और सुनिश्चित करें कि सूचनाएं सक्षम हैं। यह भी जांचें कि आपने प्रोफ़ाइल > गोपनीयता सेटिंग्स के तहत ऐप सेटिंग्स में सूचनाएं सक्षम की हैं।',
  },
  {
    id: 18,
    category: 'technical',
    question: 'How do I report a bug or technical issue?',
    questionHindi: 'मैं बग या तकनीकी समस्या की रिपोर्ट कैसे करूं?',
    answer: 'Go to Profile > Help & Support and tap "Report a Problem". Describe the issue in detail and our support team will investigate and respond as soon as possible.',
    answerHindi: 'प्रोफ़ाइल > सहायता और समर्थन पर जाएं और "समस्या की रिपोर्ट करें" पर टैप करें। समस्या का विस्तार से वर्णन करें और हमारी समर्थन टीम जांच करेगी और जल्द से जल्द जवाब देगी।',
  },
];

const CATEGORIES = [
  { id: 'all', name: 'All', nameHindi: 'सभी', icon: 'apps' },
  { id: 'schemes', name: 'Schemes', nameHindi: 'योजनाएं', icon: 'briefcase' },
  { id: 'forms', name: 'Forms', nameHindi: 'फॉर्म', icon: 'document-text' },
  { id: 'documents', name: 'Documents', nameHindi: 'दस्तावेज़', icon: 'camera' },
  { id: 'profile', name: 'Profile', nameHindi: 'प्रोफ़ाइल', icon: 'person' },
  { id: 'app', name: 'App Usage', nameHindi: 'ऐप उपयोग', icon: 'phone-portrait' },
  { id: 'technical', name: 'Technical', nameHindi: 'तकनीकी', icon: 'settings' },
];

export default function FAQsScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  // Filter FAQs based on search and category
  const filteredFAQs = useMemo(() => {
    let filtered = FAQ_DATA;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(faq =>
        faq.question.toLowerCase().includes(query) ||
        faq.questionHindi.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.answerHindi.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  const toggleFAQ = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

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
          <Text style={styles.headerTitle}>FAQs</Text>
          <Text style={styles.headerSubtitle}>अक्सर पूछे जाने वाले प्रश्न</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search FAQs..."
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContainer}
      >
        {CATEGORIES.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Ionicons
              name={category.icon}
              size={18}
              color={selectedCategory === category.id ? theme.colors.white : theme.colors.primary}
            />
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* FAQ List */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {filteredFAQs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={64} color={theme.colors.textSecondary} />
            <Text style={styles.emptyText}>No FAQs found</Text>
            <Text style={styles.emptyTextHindi}>कोई प्रश्न नहीं मिला</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your search or category filter
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.resultsCount}>
              {filteredFAQs.length} question{filteredFAQs.length !== 1 ? 's' : ''} found
            </Text>
            {filteredFAQs.map(faq => (
              <TouchableOpacity
                key={faq.id}
                style={styles.faqItem}
                onPress={() => toggleFAQ(faq.id)}
                activeOpacity={0.7}
              >
                <View style={styles.faqHeader}>
                  <View style={styles.faqQuestionContainer}>
                    <Text style={styles.faqQuestion}>{faq.question}</Text>
                    <Text style={styles.faqQuestionHindi}>{faq.questionHindi}</Text>
                  </View>
                  <Ionicons
                    name={expandedId === faq.id ? "chevron-up" : "chevron-down"}
                    size={24}
                    color={theme.colors.primary}
                  />
                </View>
                {expandedId === faq.id && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                    <Text style={styles.faqAnswerTextHindi}>{faq.answerHindi}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Still Have Questions */}
        <View style={styles.helpCard}>
          <Ionicons name="help-circle" size={32} color={theme.colors.primary} />
          <Text style={styles.helpCardTitle}>Still have questions?</Text>
          <Text style={styles.helpCardTitleHindi}>अभी भी प्रश्न हैं?</Text>
          <Text style={styles.helpCardText}>
            Contact our support team for personalized assistance
          </Text>
          <TouchableOpacity
            style={styles.helpButton}
            onPress={() => navigation.navigate('HelpSupport')}
          >
            <Text style={styles.helpButtonText}>Contact Support</Text>
            <Text style={styles.helpButtonTextHindi}>सहायता से संपर्क करें</Text>
          </TouchableOpacity>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.black,
    paddingVertical: theme.spacing.xs,
  },
  categoryScroll: {
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  categoryContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    gap: theme.spacing.xs,
  },
  categoryChipActive: {
    backgroundColor: theme.colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  categoryTextActive: {
    color: theme.colors.white,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  resultsCount: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  faqItem: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    ...theme.elevation.small,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
  },
  faqQuestionContainer: {
    flex: 1,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.black,
    lineHeight: 22,
  },
  faqQuestionHindi: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textSecondary,
    marginTop: 4,
    lineHeight: 20,
  },
  faqAnswer: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  faqAnswerText: {
    fontSize: 15,
    color: theme.colors.black,
    lineHeight: 22,
  },
  faqAnswerTextHindi: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  emptyTextHindi: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  helpCard: {
    backgroundColor: theme.colors.primary + '10',
    borderRadius: 12,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
  },
  helpCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.black,
    marginTop: theme.spacing.sm,
  },
  helpCardTitleHindi: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  helpCardText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  helpButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  helpButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.white,
  },
  helpButtonTextHindi: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.white,
    marginTop: 2,
  },
});
