import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import theme from '../theme';

/**
 * OfflineBanner Component
 * 
 * Displays a banner at the top of the screen when the device is offline or in offline mode.
 * Shows connectivity status, pending sync items, and provides quick actions.
 * 
 * Props:
 * - visible: boolean (optional) - Force show/hide banner regardless of network status
 * - onSync: function (optional) - Callback when sync button is pressed
 * - pendingItems: number (optional) - Number of items pending sync
 * - offlineMode: boolean (optional) - Whether app is in offline mode (even with connection)
 */
export default function OfflineBanner({
  visible = null,
  onSync = null,
  pendingItems = 0,
  offlineMode = false,
}) {
  const [isConnected, setIsConnected] = useState(true);
  const [connectionType, setConnectionType] = useState('unknown');
  const [slideAnim] = useState(new Animated.Value(-100));
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      setConnectionType(state.type);
    });

    // Fetch initial network state
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
      setConnectionType(state.type);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Determine if banner should be shown
    const shouldShow = visible !== null ? visible : (!isConnected || offlineMode);
    
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
  }, [isConnected, offlineMode, visible, showBanner, slideAnim]);

  const handleSync = () => {
    if (onSync) {
      onSync();
    }
  };

  // Don't render if banner shouldn't be shown
  if (!showBanner && visible === null) {
    return null;
  }

  // Determine banner style based on mode
  const isOfflineByChoice = offlineMode && isConnected;
  const isActuallyOffline = !isConnected;
  
  let bannerStyle = styles.bannerOffline;
  let iconName = 'cloud-offline-outline';
  let message = 'No Internet Connection';
  let messageHindi = 'कोई इंटरनेट कनेक्शन नहीं';
  
  if (isOfflineByChoice) {
    bannerStyle = styles.bannerOfflineMode;
    iconName = 'airplane-outline';
    message = 'Offline Mode Enabled';
    messageHindi = 'ऑफ़लाइन मोड सक्षम';
  } else if (connectionType === 'cellular') {
    bannerStyle = styles.bannerLimited;
    iconName = 'cellular-outline';
    message = 'Limited Connection';
    messageHindi = 'सीमित कनेक्शन';
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
            <Text style={styles.messageTextHindi}>{messageHindi}</Text>
            {pendingItems > 0 && (
              <Text style={styles.pendingText}>
                {pendingItems} item{pendingItems > 1 ? 's' : ''} pending sync
              </Text>
            )}
          </View>
        </View>

        {/* Sync Button - only show if connected and there are pending items */}
        {isConnected && pendingItems > 0 && onSync && (
          <TouchableOpacity
            style={styles.syncButton}
            onPress={handleSync}
            activeOpacity={0.7}
          >
            <Ionicons name="sync-outline" size={18} color={theme.colors.white} />
            <Text style={styles.syncButtonText}>Sync</Text>
          </TouchableOpacity>
        )}

        {/* Connection Type Indicator */}
        {isConnected && !offlineMode && connectionType === 'cellular' && (
          <View style={styles.connectionBadge}>
            <Text style={styles.connectionBadgeText}>2G/3G</Text>
          </View>
        )}
      </View>

      {/* Info Text */}
      {isActuallyOffline && (
        <Text style={styles.infoText}>
          You can continue using saved content. Changes will sync when online.
        </Text>
      )}
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
  messageTextHindi: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.white,
    opacity: 0.9,
    marginTop: 2,
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
  connectionBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: theme.spacing.sm,
  },
  connectionBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.white,
  },
  infoText: {
    fontSize: 11,
    color: theme.colors.white,
    opacity: 0.9,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xs,
    textAlign: 'center',
  },
});
