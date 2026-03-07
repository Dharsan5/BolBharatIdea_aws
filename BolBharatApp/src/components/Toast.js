import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Toast Component
 * 
 * Individual toast notification that displays temporary messages.
 * Supports auto-dismiss, swipe to dismiss, and bilingual text.
 * 
 * @param {string} type - Type of toast: 'success', 'error', 'info', 'warning'
 * @param {string} message - Main message in English
 * @param {string} messageHindi - Message in Hindi
 * @param {number} duration - Auto-dismiss duration in ms (0 = no auto-dismiss)
 * @param {function} onDismiss - Callback when toast is dismissed
 * @param {string} actionText - Optional action button text
 * @param {function} onActionPress - Callback for action button
 * @param {string} position - Position: 'top' or 'bottom'
 */

const Toast = ({
  type = 'info',
  message,
  messageHindi,
  duration = 3000,
  onDismiss,
  actionText,
  onActionPress,
  position = 'top',
}) => {
  const translateY = useRef(new Animated.Value(position === 'top' ? -100 : 100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const dismissTimer = useRef(null);

  // Toast type configurations
  const toastConfig = {
    success: {
      backgroundColor: theme.colors.success,
      icon: 'checkmark-circle',
      textColor: theme.colors.white,
    },
    error: {
      backgroundColor: theme.colors.error,
      icon: 'close-circle',
      textColor: theme.colors.white,
    },
    warning: {
      backgroundColor: theme.colors.warning,
      icon: 'warning',
      textColor: theme.colors.black,
    },
    info: {
      backgroundColor: theme.colors.info,
      icon: 'information-circle',
      textColor: theme.colors.white,
    },
  };

  const config = toastConfig[type] || toastConfig.info;

  // Pan responder for swipe to dismiss
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to vertical swipes
        return Math.abs(gestureState.dy) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (position === 'top') {
          // Swipe up to dismiss from top
          if (gestureState.dy < 0) {
            translateY.setValue(gestureState.dy);
          }
        } else {
          // Swipe down to dismiss from bottom
          if (gestureState.dy > 0) {
            translateY.setValue(gestureState.dy);
          }
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const threshold = 50;
        if (
          (position === 'top' && gestureState.dy < -threshold) ||
          (position === 'bottom' && gestureState.dy > threshold)
        ) {
          handleDismiss();
        } else {
          // Snap back to position
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    // Slide in animation
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-dismiss timer
    if (duration > 0) {
      dismissTimer.current = setTimeout(() => {
        handleDismiss();
      }, duration);
    }

    return () => {
      if (dismissTimer.current) {
        clearTimeout(dismissTimer.current);
      }
    };
  }, []);

  const handleDismiss = () => {
    if (dismissTimer.current) {
      clearTimeout(dismissTimer.current);
    }

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: position === 'top' ? -100 : 100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onDismiss) {
        onDismiss();
      }
    });
  };

  const handleActionPress = () => {
    if (onActionPress) {
      onActionPress();
    }
    handleDismiss();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: config.backgroundColor,
          transform: [{ translateY }],
          opacity,
        },
        position === 'top' ? styles.positionTop : styles.positionBottom,
      ]}
      {...panResponder.panHandlers}
    >
      <View style={styles.content}>
        <Ionicons
          name={config.icon}
          size={24}
          color={config.textColor}
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          <Text style={[styles.message, { color: config.textColor }]}>
            {message}
          </Text>
          {messageHindi && (
            <Text style={[styles.messageHindi, { color: config.textColor }]}>
              {messageHindi}
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={handleDismiss}
          style={styles.closeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={20} color={config.textColor} />
        </TouchableOpacity>
      </View>
      {actionText && onActionPress && (
        <View style={styles.actionContainer}>
          <TouchableOpacity
            onPress={handleActionPress}
            style={styles.actionButton}
          >
            <Text style={[styles.actionText, { color: config.textColor }]}>
              {actionText}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: theme.spacing.md,
    right: theme.spacing.md,
    borderRadius: 12,
    ...theme.elevation.medium,
    overflow: 'hidden',
  },
  positionTop: {
    top: theme.spacing.md,
  },
  positionBottom: {
    bottom: theme.spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  messageHindi: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    marginTop: 2,
    opacity: 0.9,
  },
  closeButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
  actionContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});

export default Toast;
