import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

/**
 * LoadingIndicator Component
 * 
 * A versatile loading indicator component with multiple styles and configurations.
 * 
 * Props:
 * - size: 'small' | 'medium' | 'large' (default: 'medium')
 * - color: string (default: theme.colors.primary)
 * - message: string (optional) - Loading message in English
 * - messageHindi: string (optional) - Loading message in Hindi
 * - style: object (optional) - Additional container styles
 * - type: 'spinner' | 'dots' | 'pulse' (default: 'spinner')
 * - overlay: boolean (default: false) - Show as full-screen overlay
 * - transparent: boolean (default: false) - Transparent background for overlay
 */

export default function LoadingIndicator({
  size = 'medium',
  color = theme.colors.primary,
  message = null,
  messageHindi = null,
  style = {},
  type = 'spinner',
  overlay = false,
  transparent = false,
}) {
  const sizeMap = {
    small: 24,
    medium: 40,
    large: 60,
  };

  const indicatorSize = sizeMap[size] || sizeMap.medium;

  const renderLoader = () => {
    switch (type) {
      case 'spinner':
        return (
          <ActivityIndicator
            size={size === 'small' ? 'small' : 'large'}
            color={color}
            style={styles.spinner}
          />
        );
      
      case 'dots':
        return (
          <View style={styles.dotsContainer}>
            <View style={[styles.dot, { backgroundColor: color }]} />
            <View style={[styles.dot, styles.dotMiddle, { backgroundColor: color }]} />
            <View style={[styles.dot, { backgroundColor: color }]} />
          </View>
        );
      
      case 'pulse':
        return (
          <View style={[styles.pulseContainer, { width: indicatorSize, height: indicatorSize }]}>
            <View style={[styles.pulse, { backgroundColor: color }]} />
          </View>
        );
      
      default:
        return <ActivityIndicator size="large" color={color} />;
    }
  };

  const content = (
    <View style={[
      styles.container,
      overlay && styles.overlayContainer,
      transparent && styles.transparentOverlay,
      style
    ]}>
      {renderLoader()}
      
      {(message || messageHindi) && (
        <View style={styles.messageContainer}>
          {message && <Text style={styles.message}>{message}</Text>}
          {messageHindi && <Text style={styles.messageHindi}>{messageHindi}</Text>}
        </View>
      )}
    </View>
  );

  if (overlay) {
    return (
      <Modal
        transparent={true}
        animationType="fade"
        visible={true}
        statusBarTranslucent={true}
      >
        {content}
      </Modal>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  transparentOverlay: {
    backgroundColor: 'transparent',
  },
  spinner: {
    marginVertical: theme.spacing.sm,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    opacity: 0.3,
  },
  dotMiddle: {
    opacity: 0.6,
  },
  pulseContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulse: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
    opacity: 0.6,
  },
  messageContainer: {
    marginTop: theme.spacing.md,
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.black,
    textAlign: 'center',
  },
  messageHindi: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
});
