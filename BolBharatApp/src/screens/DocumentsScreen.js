import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../theme';
import { useDocumentHistory } from '../context/DocumentHistoryContext';

export default function DocumentsScreen({ navigation }) {
  const { documents, deleteDocument, isLoading } = useDocumentHistory();

  const handleOpenCamera = () => {
    navigation.navigate('DocumentCamera');
  };

  const handleDocumentPress = (document) => {
    navigation.navigate('SimplifiedDocument', {
      imageUri: document.imageUri,
      originalUri: document.originalUri,
      documentId: document.id,
    });
  };

  const handleDeleteDocument = (documentId, documentTitle) => {
    Alert.alert(
      'Delete Document',
      `Are you sure you want to delete "${documentTitle}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteDocument(documentId);
          },
        },
      ]
    );
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
  };

  const renderDocumentCard = ({ item }) => (
    <TouchableOpacity
      style={styles.documentCard}
      onPress={() => handleDocumentPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.documentImageContainer}>
        <Image
          source={{ uri: item.imageUri }}
          style={styles.documentThumbnail}
          resizeMode="cover"
        />
      </View>
      <View style={styles.documentInfo}>
        <Text style={styles.documentTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.documentType}>{item.documentType}</Text>
        <View style={styles.documentMeta}>
          <Ionicons name="time-outline" size={14} color={theme.colors.textSecondary} />
          <Text style={styles.documentDate}>{formatDate(item.timestamp)}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteDocument(item.id, item.title)}
      >
        <Ionicons name="trash-outline" size={20} color={theme.colors.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <>
      {/* Camera Card */}
      <TouchableOpacity style={styles.cameraCard} onPress={handleOpenCamera}>
        <View style={styles.cameraIcon}>
          <Ionicons name="camera" size={48} color={theme.colors.white} />
        </View>
        <Text style={styles.cameraText}>Scan Document</Text>
        <Text style={styles.cameraSubtext}>दस्तावेज़ स्कैन करें</Text>
      </TouchableOpacity>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionsTitle}>How it works</Text>
        <View style={styles.instructionItem}>
          <Text style={styles.instructionNumber}>1</Text>
          <Text style={styles.instructionText}>Take a photo of your document</Text>
        </View>
        <View style={styles.instructionItem}>
          <Text style={styles.instructionNumber}>2</Text>
          <Text style={styles.instructionText}>We'll extract and simplify the text</Text>
        </View>
        <View style={styles.instructionItem}>
          <Text style={styles.instructionNumber}>3</Text>
          <Text style={styles.instructionText}>Listen to explanation in your language</Text>
        </View>
      </View>

      {/* Recent Documents Header */}
      <View style={styles.recentHeader}>
        <Text style={styles.recentTitle}>Recent Documents</Text>
        {documents.length > 0 && (
          <Text style={styles.documentsCount}>{documents.length}</Text>
        )}
      </View>
    </>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons
        name="file-document-outline"
        size={64}
        color={theme.colors.textDisabled}
      />
      <Text style={styles.emptyText}>No documents yet</Text>
      <Text style={styles.emptySubtext}>
        Scan your first document to get started
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Documents</Text>
        <Text style={styles.subtitle}>दस्तावेज़</Text>
      </View>

      <FlatList
        data={documents}
        renderItem={renderDocumentCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!isLoading && renderEmptyState}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
  listContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  cameraCard: {
    backgroundColor: theme.colors.black,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  cameraIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
  instructions: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
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
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  recentTitle: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
  },
  documentsCount: {
    backgroundColor: theme.colors.black,
    color: theme.colors.white,
    fontFamily: theme.fontFamilies.semiBold,
    fontSize: 12,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  documentCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  documentImageContainer: {
    width: 60,
    height: 80,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    backgroundColor: theme.colors.gray100,
    marginRight: theme.spacing.md,
  },
  documentThumbnail: {
    width: '100%',
    height: '100%',
  },
  documentInfo: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  documentTitle: {
    ...theme.typography.body1,
    fontFamily: theme.fontFamilies.semiBold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs / 2,
  },
  documentType: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  documentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs / 2,
  },
  documentDate: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.xl,
  },
  emptyText: {
    ...theme.typography.body1,
    fontFamily: theme.fontFamilies.semiBold,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xs,
  },
  emptySubtext: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
