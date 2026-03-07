import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import LoadingIndicator from '../components/LoadingIndicator';
import LoadingScreen from '../components/LoadingScreen';
import InlineLoader from '../components/InlineLoader';
import SkeletonLoader, { SkeletonCard, SkeletonList, SkeletonText } from '../components/SkeletonLoader';

/**
 * LoadingIndicatorsDemo
 * 
 * Demo screen to showcase all available loading indicators and skeleton loaders.
 * This is a development/testing screen.
 */

export default function LoadingIndicatorsDemo({ navigation }) {
  const [showFullScreen, setShowFullScreen] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);

  if (showFullScreen) {
    return (
      <LoadingScreen
        variant={showFullScreen.variant}
        preset={showFullScreen.preset}
        message={showFullScreen.message}
        messageHindi={showFullScreen.messageHindi}
      />
    );
  }

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
          <Text style={styles.headerTitle}>Loading Indicators Demo</Text>
          <Text style={styles.headerSubtitle}>लोडिंग संकेतक डेमो</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Loading Indicators */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Loading Indicators</Text>
          <Text style={styles.sectionSubtitle}>लोडिंग संकेतक</Text>

          <View style={styles.demoGroup}>
            <Text style={styles.demoTitle}>Spinner (Default)</Text>
            <View style={styles.demoBox}>
              <LoadingIndicator
                size="small"
                message="Loading..."
                messageHindi="लोड हो रहा है..."
              />
            </View>
            <View style={styles.demoBox}>
              <LoadingIndicator
                size="medium"
                message="Please wait"
                messageHindi="कृपया प्रतीक्षा करें"
              />
            </View>
            <View style={styles.demoBox}>
              <LoadingIndicator
                size="large"
                message="Processing your request"
                messageHindi="आपके अनुरोध को संसाधित किया जा रहा है"
              />
            </View>
          </View>

          <View style={styles.demoGroup}>
            <Text style={styles.demoTitle}>Different Types</Text>
            <View style={styles.demoBox}>
              <LoadingIndicator type="spinner" message="Spinner" />
            </View>
            <View style={styles.demoBox}>
              <LoadingIndicator type="dots" message="Dots" />
            </View>
            <View style={styles.demoBox}>
              <LoadingIndicator type="pulse" message="Pulse" />
            </View>
          </View>

          <View style={styles.demoGroup}>
            <Text style={styles.demoTitle}>With Overlay</Text>
            <TouchableOpacity
              style={styles.buttonPrimary}
              onPress={() => setShowOverlay(true)}
            >
              <Text style={styles.buttonText}>Show Overlay Loader</Text>
            </TouchableOpacity>
            {showOverlay && (
              <LoadingIndicator
                overlay={true}
                message="Loading data..."
                messageHindi="डेटा लोड हो रहा है..."
                size="large"
              />
            )}
          </View>
        </View>

        {/* Full Screen Loaders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Full Screen Loaders</Text>
          <Text style={styles.sectionSubtitle}>पूर्ण स्क्रीन लोडर</Text>

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.buttonSecondary}
              onPress={() => setShowFullScreen({ variant: 'default' })}
            >
              <Text style={styles.buttonSecondaryText}>Default</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonSecondary}
              onPress={() => setShowFullScreen({ variant: 'branded' })}
            >
              <Text style={styles.buttonSecondaryText}>Branded</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonSecondary}
              onPress={() => setShowFullScreen({ variant: 'minimal' })}
            >
              <Text style={styles.buttonSecondaryText}>Minimal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonSecondary}
              onPress={() => setShowFullScreen({ variant: 'blob' })}
            >
              <Text style={styles.buttonSecondaryText}>Blob Animation</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.demoGroup}>
            <Text style={styles.demoTitle}>Preset Messages</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.buttonOutline}
                onPress={() => setShowFullScreen({ variant: 'default', preset: 'schemes' })}
              >
                <Text style={styles.buttonOutlineText}>Loading Schemes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonOutline}
                onPress={() => setShowFullScreen({ variant: 'default', preset: 'documents' })}
              >
                <Text style={styles.buttonOutlineText}>Processing Document</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonOutline}
                onPress={() => setShowFullScreen({ variant: 'default', preset: 'syncing' })}
              >
                <Text style={styles.buttonOutlineText}>Syncing Data</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Inline Loaders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inline Loaders</Text>
          <Text style={styles.sectionSubtitle}>इनलाइन लोडर</Text>

          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>Small Size</Text>
            <InlineLoader size="small" message="Loading..." />
          </View>

          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>With Message</Text>
            <InlineLoader
              size="small"
              message="Fetching data..."
              messageHindi="डेटा प्राप्त किया जा रहा है..."
            />
          </View>

          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>Column Direction</Text>
            <InlineLoader
              size="medium"
              direction="column"
              message="Uploading..."
              messageHindi="अपलोड हो रहा है..."
            />
          </View>

          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>In Buttons</Text>
            <View style={styles.buttonWithLoader}>
              <InlineLoader size="small" color={theme.colors.white} />
              <Text style={styles.buttonWithLoaderText}>Processing...</Text>
            </View>
          </View>
        </View>

        {/* Skeleton Loaders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skeleton Loaders</Text>
          <Text style={styles.sectionSubtitle}>स्केलेटन लोडर</Text>

          <View style={styles.demoGroup}>
            <Text style={styles.demoTitle}>Basic Shapes</Text>
            <View style={styles.skeletonDemo}>
              <SkeletonLoader width="100%" height={20} />
              <View style={{ height: 8 }} />
              <SkeletonLoader width="80%" height={20} />
              <View style={{ height: 8 }} />
              <SkeletonLoader width="60%" height={20} />
              <View style={{ height: 16 }} />
              <SkeletonLoader variant="circle" width={60} />
              <View style={{ height: 16 }} />
              <SkeletonLoader width={100} height={40} borderRadius={20} />
            </View>
          </View>

          <View style={styles.demoGroup}>
            <Text style={styles.demoTitle}>Skeleton Card</Text>
            <SkeletonCard />
          </View>

          <View style={styles.demoGroup}>
            <Text style={styles.demoTitle}>Skeleton List</Text>
            <SkeletonList items={4} />
          </View>

          <View style={styles.demoGroup}>
            <Text style={styles.demoTitle}>Skeleton Text</Text>
            <SkeletonText lines={5} />
          </View>
        </View>

        {/* Usage Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={24} color={theme.colors.info} />
            <Text style={styles.infoTitle}>Usage Information</Text>
          </View>
          <Text style={styles.infoText}>
            Import loading components from the components folder:
          </Text>
          <View style={styles.codeBlock}>
            <Text style={styles.codeText}>
              import LoadingIndicator from '../components/LoadingIndicator';{'\n'}
              import LoadingScreen from '../components/LoadingScreen';{'\n'}
              import InlineLoader from '../components/InlineLoader';{'\n'}
              import SkeletonLoader from '../components/SkeletonLoader';
            </Text>
          </View>
        </View>

        {/* Dismiss Overlay Button */}
        {showOverlay && (
          <TouchableOpacity
            style={styles.dismissButton}
            onPress={() => setShowOverlay(false)}
          >
            <Text style={styles.dismissButtonText}>Dismiss Overlay</Text>
          </TouchableOpacity>
        )}
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  section: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.elevation.small,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.black,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginTop: 2,
    marginBottom: theme.spacing.md,
  },
  demoGroup: {
    marginBottom: theme.spacing.md,
  },
  demoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.black,
    marginBottom: theme.spacing.sm,
  },
  demoBox: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    marginBottom: theme.spacing.sm,
    alignItems: 'center',
  },
  skeletonDemo: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
  },
  buttonGroup: {
    gap: theme.spacing.sm,
  },
  buttonPrimary: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.white,
  },
  buttonSecondary: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  buttonSecondaryText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.black,
  },
  buttonOutline: {
    padding: theme.spacing.sm,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonOutlineText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  buttonWithLoader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    gap: theme.spacing.sm,
  },
  buttonWithLoaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.white,
  },
  infoCard: {
    backgroundColor: theme.colors.info + '10',
    borderRadius: 12,
    padding: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.info,
    marginBottom: theme.spacing.md,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.info,
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.black,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  codeBlock: {
    backgroundColor: '#282c34',
    borderRadius: 8,
    padding: theme.spacing.sm,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#61dafb',
    lineHeight: 18,
  },
  dismissButton: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.error,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  dismissButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.white,
  },
});
