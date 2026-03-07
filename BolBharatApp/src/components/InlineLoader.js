import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import theme from '../theme';

/**
 * InlineLoader Component
 * 
 * A small inline loading indicator for buttons, list items, and UI components.
 * 
 * Props:
 * - size: 'small' | 'medium' (default: 'small')
 * - color: string (default: theme.colors.primary)
 * - message: string (optional) - Loading message
 * - messageHindi: string (optional) - Loading message in Hindi
 * - style: object (optional) - Additional container styles
 * - direction: 'row' | 'column' (default: 'row')
 */

export default function InlineLoader({
  size = 'small',
  color = theme.colors.primary,
  message = null,
  messageHindi = null,
  style = {},
  direction = 'row',
}) {
  return (
    <View style={[
      styles.container,
      direction === 'column' ? styles.containerColumn : styles.containerRow,
      style
    ]}>
      <ActivityIndicator
        size={size === 'small' ? 'small' : 'large'}
        color={color}
      />
      
      {(message || messageHindi) && (
        <View style={[
          styles.messageContainer,
          direction === 'row' && styles.messageContainerRow
        ]}>
          {message && <Text style={[styles.message, { color }]}>{message}</Text>}
          {messageHindi && <Text style={[styles.messageHindi, { color }]}>{messageHindi}</Text>}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  containerRow: {
    flexDirection: 'row',
  },
  containerColumn: {
    flexDirection: 'column',
  },
  messageContainer: {
    alignItems: 'center',
  },
  messageContainerRow: {
    marginLeft: theme.spacing.sm,
  },
  message: {
    fontSize: 14,
    fontWeight: '600',
  },
  messageHindi: {
    fontSize: 12,
    opacity: 0.8,
    marginTop: 2,
  },
});
