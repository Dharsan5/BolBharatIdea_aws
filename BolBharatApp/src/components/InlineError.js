import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

/**
 * InlineError Component
 * 
 * A small inline error message component for use in forms, inputs, and other UI elements.
 * 
 * Props:
 * - message: string - Error message to display
 * - messageHindi: string (optional) - Error message in Hindi
 * - icon: string (optional) - Ionicon name (default: 'alert-circle')
 * - visible: boolean (optional) - Show/hide error (default: true)
 * - style: object (optional) - Additional styles for container
 */

export default function InlineError({
  message,
  messageHindi = null,
  icon = 'alert-circle',
  visible = true,
  style = {},
}) {
  if (!visible || !message) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <Ionicons name={icon} size={16} color={theme.colors.error} style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.message}>{message}</Text>
        {messageHindi && <Text style={styles.messageHindi}>{messageHindi}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    backgroundColor: theme.colors.error + '10',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.error,
  },
  icon: {
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
    marginLeft: theme.spacing.xs,
  },
  message: {
    fontSize: 13,
    color: theme.colors.error,
    lineHeight: 18,
  },
  messageHindi: {
    fontSize: 12,
    color: theme.colors.error,
    opacity: 0.8,
    lineHeight: 16,
    marginTop: 2,
  },
});
