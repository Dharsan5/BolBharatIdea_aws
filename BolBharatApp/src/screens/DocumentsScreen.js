import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../theme';
import { useLanguage } from '../i18n/LanguageContext';

export default function DocumentsScreen() {
  const { t } = useLanguage();
  const [image, setImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      processImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      processImage(result.assets[0].uri);
    }
  };

  const processImage = (uri) => {
    setImage(uri);
    setIsProcessing(true);
    
    // Simulate OCR processing
    setTimeout(() => {
      setIsProcessing(false);
      setOcrResult({
        title: 'Pradhan Mantri Awas Yojana Notice',
        summary: 'This notice confirms that your application for the rural housing scheme has been received and is currently under verification. You will receive an update within 15 working days.',
        steps: [
          'Keep your Aadhar card ready',
          'Visit the block office if no update in 20 days',
          'Do not share your OTP with anyone'
        ]
      });
      setShowResult(true);
    }, 3000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('documents')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Camera Card */}
        <TouchableOpacity style={styles.cameraCard} onPress={takePhoto}>
          <View style={styles.cameraIcon}>
            <Ionicons name="camera" size={48} color={theme.colors.white} />
          </View>
          <Text style={styles.cameraText}>{t('scanDocument')}</Text>
          <Text style={styles.cameraSubtext}>Take a clear photo of the notice</Text>
        </TouchableOpacity>

        {/* Gallery Button */}
        <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
          <Ionicons name="images" size={24} color={theme.colors.textPrimary} />
          <Text style={styles.galleryButtonText}>Upload from Gallery</Text>
        </TouchableOpacity>

        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>{t('howItWorks')}</Text>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>1</Text>
            <Text style={styles.instructionText}>{t('takePhoto')}</Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>2</Text>
            <Text style={styles.instructionText}>{t('extractSimplify')}</Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>3</Text>
            <Text style={styles.instructionText}>{t('listenExplanation')}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Processing Modal */}
      <Modal visible={isProcessing} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.processingCard}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.processingText}>Processing Document...</Text>
            <Text style={styles.processingSubtext}>Our AI is simplifying this for you</Text>
          </View>
        </View>
      </Modal>

      {/* Result Modal */}
      <Modal visible={showResult} animationType="slide" transparent>
        <View style={styles.resultOverlay}>
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>Document Summary</Text>
              <TouchableOpacity onPress={() => setShowResult(false)}>
                <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.resultBody}>
              {image && <Image source={{ uri: image }} style={styles.resultImage} />}
              
              <Text style={styles.docTitle}>{ocrResult?.title}</Text>
              
              <View style={styles.summaryBox}>
                <Ionicons name="information-circle" size={20} color={theme.colors.primary} />
                <Text style={styles.summaryText}>{ocrResult?.summary}</Text>
              </View>

              <Text style={styles.sectionTitle}>What to do next:</Text>
              {ocrResult?.steps.map((step, index) => (
                <View key={index} style={styles.stepItem}>
                  <Ionicons name="checkmark-circle" size={18} color={theme.colors.success || '#4CAF50'} />
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}

              <TouchableOpacity style={styles.listenButton}>
                <Ionicons name="volume-high" size={20} color={theme.colors.white} />
                <Text style={styles.listenButtonText}>Listen to Explanation</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  content: {
    padding: theme.spacing.lg,
  },
  cameraCard: {
    backgroundColor: theme.colors.black,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  cameraIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.gray800,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  cameraText: {
    ...theme.typography.h3,
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  cameraSubtext: {
    ...theme.typography.body2,
    color: theme.colors.gray300,
  },
  galleryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.xl,
  },
  galleryButtonText: {
    ...theme.typography.button,
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.sm,
  },
  instructions: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  instructionsTitle: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.black,
    color: theme.colors.white,
    fontFamily: theme.fontFamilies.semiBold,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 24,
    marginRight: theme.spacing.md,
  },
  instructionText: {
    ...theme.typography.body2,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  processingCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    width: '100%',
  },
  processingText: {
    ...theme.typography.h3,
    marginTop: theme.spacing.lg,
    color: theme.colors.textPrimary,
  },
  processingSubtext: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  resultOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  resultCard: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    height: '90%',
    padding: theme.spacing.lg,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  resultTitle: {
    ...theme.typography.h3,
  },
  resultBody: {
    flex: 1,
  },
  resultImage: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
  },
  docTitle: {
    ...theme.typography.h4,
    marginBottom: theme.spacing.md,
  },
  summaryBox: {
    backgroundColor: theme.colors.primary + '10',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
  },
  summaryText: {
    ...theme.typography.body2,
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  sectionTitle: {
    ...theme.typography.h4,
    fontSize: 16,
    marginBottom: theme.spacing.sm,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  stepText: {
    ...theme.typography.body2,
    marginLeft: theme.spacing.sm,
  },
  listenButton: {
    backgroundColor: theme.colors.black,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  listenButtonText: {
    ...theme.typography.button,
    color: theme.colors.white,
    marginLeft: theme.spacing.sm,
  }
});
