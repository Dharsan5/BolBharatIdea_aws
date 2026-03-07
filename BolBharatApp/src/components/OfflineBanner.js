import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNetworkStatus, useOfflineQueue } from '../hooks/useOffline';
import theme from '../theme';

/**
 * OfflineBanner Component
 * 
 * Displays a banner at the top of the screen when the device is offline.
 * Shows connectivity status, pending sync items, and provides quick sync action.
 * Now uses the offline manager for queue tracking and sync.
 */
export default function OfflineBanner({ offlineMode = false }) {
  const { isOnline } = useNetworkStatus();
  const { queueStatus, syncQueue, syncInProgress } = useOfflineQueue();
  const [slideAnim] = useState(new Animated.Value(-100));
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Determine if banner should be shown
    const shouldShow = !isOnline || offlineMode;
    
    if (shouldShow !== showBanner) {
      setShowBanner(shouldShow);
      
      // Animate banner in/out
      Animated.spring(slideAnim, {
        toValue: shouldShow ? 0 : -100,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    }
  }, [isOnline, offlineMode, showBanner, slideAnim]);

  const handleSync = () => {
    if (isOnline && queueStatus.count > 0) {
      syncQueue();
    }
  };

  // Don't render if banner shouldn't be shown
  if (!showBanner) {
    return null;
  }

  // Determine banner style based on mode
  const isOfflineByChoice = offlineMode && isOnline;
  
  let bannerStyle = styles.bannerOffline;
  let iconName = 'cloud-offline-outline';
  let message = 'No Internet Connection';
  
  if (isOfflineByChoice) {
    bannerStyle = styles.bannerOfflineMode;
    iconName = 'airplane-outline';
    message = 'Offline Mode Enabled';
  }

  return (
    <Animated.View
      style={[
        styles.container,
        bannerStyle,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.contentContainer}>
        <View style={styles.leftSection}>
          <View style={styles.iconContainer}>
            <Ionicons name={iconName} size={20} color={theme.colors.white} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.messageText}>{message}</Text>
            {queueStatus.count > 0 && (
              <Text style={styles.pendingText}>
                {queueStatus.count} item{queueStatus.count > 1 ? 's' : ''} pending sync
              </Text>
            )}
          </View>
        </View>

        {/* Sync Button - only show if online and there are pending items */}
        {isOnline && queueStatus.count > 0 && (
          <TouchableOpacity
            style={styles.syncButton}
            onPress={handleSync}
            activeOpacity={0.7}
            disabled={syncInProgress}
          >
            <Ionicons 
              name={syncInProgress ? "hourglass-outline" : "sync-outline"} 
              size={18} 
              color={theme.colors.white} 
            />
            <Text style={styles.syncButtonText}>
              {syncInProgress ? 'Syncing...' : 'Sync'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: Platform.OS === 'ios' ? 44 : 0, // Account for status bar on iOS
    ...theme.elevation.high,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  bannerOffline: {
    backgroundColor: theme.colors.error,
  },
  bannerOfflineMode: {
    backgroundColor: '#FF9800', // Orange for intentional offline mode
  },
  bannerLimited: {
    backgroundColor: theme.colors.warning,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  messageText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.white,
  },
  pendingText: {
    fontSize: 11,
    color: theme.colors.white,
    opacity: 0.8,
    marginTop: 2,
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
    marginLeft: theme.spacing.sm,
  },
  syncButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.white,
  },
});
