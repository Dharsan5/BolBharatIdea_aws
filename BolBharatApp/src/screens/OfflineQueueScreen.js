import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNetworkStatus, useOfflineQueue, useOfflineCache } from '../hooks/useOffline';
import theme from '../theme';

/**
 * OfflineQueueScreen
 * 
 * Displays the offline queue status, pending requests, and cache information.
 * Allows users to manually sync or clear the queue.
 */
export default function OfflineQueueScreen({ navigation }) {
  const { isOnline } = useNetworkStatus();
  const { queueStatus, syncQueue, clearQueue, syncInProgress, refreshStatus: refreshQueue } = useOfflineQueue();
  const { cacheStatus, clearCache, refreshStatus: refreshCache } = useOfflineCache();
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    refreshQueue();
    refreshCache();
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleSync = async () => {
    try {
      await syncQueue();
    } catch (error) {
      console.error('Error syncing queue:', error);
    }
  };

  const handleClearQueue = async () => {
    try {
      await clearQueue();
    } catch (error) {
      console.error('Error clearing queue:', error);
    }
  };

  const handleClearCache = async () => {
    try {
      await clearCache();
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) {
      return 'Just now';
    } else if (diff < 3600000) {
      return `${Math.floor(diff / 60000)}m ago`;
    } else if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Connection Status */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons 
            name={isOnline ? "wifi" : "wifi-off"} 
            size={24} 
            color={isOnline ? theme.colors.success : theme.colors.error} 
          />
          <Text style={styles.sectionTitle}>
            {isOnline ? 'Online' : 'Offline'}
          </Text>
        </View>
        <Text style={styles.sectionDescription}>
          {isOnline 
            ? 'Connected to the internet. Queued items will sync automatically.'
            : 'No internet connection. Changes will be saved and synced when online.'}
        </Text>
      </View>

      {/* Queue Status */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="list" size={24} color={theme.colors.primary} />
          <Text style={styles.sectionTitle}>Sync Queue</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{queueStatus.count}</Text>
            <Text style={styles.statLabel}>Pending Items</Text>
          </View>
        </View>

        {queueStatus.count > 0 && (
          <>
            <View style={styles.queueList}>
              {queueStatus.items.slice(0, 5).map((item, index) => (
                <View key={item.id} style={styles.queueItem}>
                  <View style={styles.queueItemHeader}>
                    <View style={[
                      styles.methodBadge,
                      item.method === 'POST' && styles.methodBadgePost,
                      item.method === 'PUT' && styles.methodBadgePut,
                      item.method === 'DELETE' && styles.methodBadgeDelete,
                    ]}>
                      <Text style={styles.methodBadgeText}>{item.method}</Text>
                    </View>
                    <Text style={styles.queueItemTime}>
                      {formatTimestamp(item.timestamp)}
                    </Text>
                  </View>
                  <Text style={styles.queueItemUrl} numberOfLines={1}>
                    {item.url}
                  </Text>
                  {item.attempts > 0 && (
                    <Text style={styles.queueItemAttempts}>
                      {item.attempts} attempts
                    </Text>
                  )}
                  {item.priority === 'high' && (
                    <View style={styles.priorityBadge}>
                      <Text style={styles.priorityBadgeText}>High Priority</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
            
            {queueStatus.count > 5 && (
              <Text style={styles.moreItemsText}>
                +{queueStatus.count - 5} more items
              </Text>
            )}

            <View style={styles.actionButtons}>
              {isOnline && (
                <TouchableOpacity
                  style={[styles.button, styles.syncButton]}
                  onPress={handleSync}
                  disabled={syncInProgress}
                >
                  <Ionicons 
                    name={syncInProgress ? "hourglass-outline" : "sync"} 
                    size={20} 
                    color={theme.colors.white} 
                  />
                  <Text style={styles.buttonText}>
                    {syncInProgress ? 'Syncing...' : 'Sync Now'}
                  </Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={[styles.button, styles.clearButton]}
                onPress={handleClearQueue}
              >
                <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
                <Text style={[styles.buttonText, styles.clearButtonText]}>
                  Clear Queue
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {queueStatus.count === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle-outline" size={48} color={theme.colors.success} />
            <Text style={styles.emptyStateText}>All synced up!</Text>
            <Text style={styles.emptyStateSubtext}>
              No pending changes to sync
            </Text>
          </View>
        )}
      </View>

      {/* Cache Status */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="archive" size={24} color={theme.colors.primary} />
          <Text style={styles.sectionTitle}>Cache</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{cacheStatus.count}</Text>
            <Text style={styles.statLabel}>Cached Items</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{cacheStatus.sizeKB} KB</Text>
            <Text style={styles.statLabel}>Storage Used</Text>
          </View>
        </View>

        <Text style={styles.cacheDescription}>
          Cached data helps the app work offline. Cache is automatically cleared after 24 hours.
        </Text>

        {cacheStatus.count > 0 && (
          <TouchableOpacity
            style={[styles.button, styles.clearButton]}
            onPress={handleClearCache}
          >
            <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
            <Text style={[styles.buttonText, styles.clearButtonText]}>
              Clear Cache
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tips */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="information-circle" size={24} color={theme.colors.primary} />
          <Text style={styles.sectionTitle}>Tips</Text>
        </View>
        
        <View style={styles.tipsList}>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
            <Text style={styles.tipText}>
              Your changes are saved locally and will sync automatically when online
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
            <Text style={styles.tipText}>
              Cached data allows you to view previously loaded content offline
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
            <Text style={styles.tipText}>
              High priority items are synced first when connection returns
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  section: {
    backgroundColor: theme.colors.white,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  sectionDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.primaryLight,
    padding: theme.spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  queueList: {
    marginTop: theme.spacing.md,
  },
  queueItem: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.sm,
    borderRadius: 8,
    marginBottom: theme.spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  queueItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  methodBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
  },
  methodBadgePost: {
    backgroundColor: theme.colors.success,
  },
  methodBadgePut: {
    backgroundColor: theme.colors.warning,
  },
  methodBadgeDelete: {
    backgroundColor: theme.colors.error,
  },
  methodBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.white,
  },
  queueItemTime: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  queueItemUrl: {
    fontSize: 13,
    color: theme.colors.text,
    fontFamily: 'monospace',
  },
  queueItemAttempts: {
    fontSize: 11,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
  priorityBadge: {
    backgroundColor: theme.colors.error,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: theme.spacing.xs,
  },
  priorityBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.white,
  },
  moreItemsText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.sm,
    borderRadius: 8,
    gap: theme.spacing.xs,
  },
  syncButton: {
    backgroundColor: theme.colors.primary,
  },
  clearButton: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.white,
  },
  clearButtonText: {
    color: theme.colors.error,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  cacheDescription: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  tipsList: {
    marginTop: theme.spacing.sm,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
});
