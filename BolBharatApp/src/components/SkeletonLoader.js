import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
} from 'react-native';
import theme from '../theme';

/**
 * SkeletonLoader Component
 * 
 * An animated skeleton loader for content placeholders.
 * 
 * Props:
 * - width: number | string (default: '100%')
 * - height: number (default: 20)
 * - borderRadius: number (default: 4)
 * - style: object (optional) - Additional styles
 * - variant: 'text' | 'circle' | 'rect' (default: 'rect')
 */

export function SkeletonLoader({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style = {},
  variant = 'rect',
}) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  let computedStyle = {
    width,
    height,
    borderRadius,
  };

  if (variant === 'circle') {
    const size = typeof width === 'number' ? width : height;
    computedStyle = {
      width: size,
      height: size,
      borderRadius: size / 2,
    };
  } else if (variant === 'text') {
    computedStyle.height = 16;
    computedStyle.borderRadius = 4;
  }

  return (
    <Animated.View
      style={[
        styles.skeleton,
        computedStyle,
        { opacity },
        style,
      ]}
    />
  );
}

/**
 * SkeletonCard Component
 * 
 * Pre-built skeleton loader for card layouts.
 */
export function SkeletonCard({ style = {} }) {
  return (
    <View style={[styles.card, style]}>
      {/* Header with circle avatar and text */}
      <View style={styles.cardHeader}>
        <SkeletonLoader variant="circle" width={50} />
        <View style={styles.cardHeaderText}>
          <SkeletonLoader width="70%" height={16} />
          <View style={{ height: 4 }} />
          <SkeletonLoader width="50%" height={12} />
        </View>
      </View>

      {/* Content area */}
      <View style={styles.cardContent}>
        <SkeletonLoader width="100%" height={14} />
        <View style={{ height: 8 }} />
        <SkeletonLoader width="95%" height={14} />
        <View style={{ height: 8 }} />
        <SkeletonLoader width="85%" height={14} />
      </View>

      {/* Image placeholder */}
      <SkeletonLoader width="100%" height={200} borderRadius={8} />

      {/* Footer */}
      <View style={styles.cardFooter}>
        <SkeletonLoader width={80} height={32} borderRadius={16} />
        <SkeletonLoader width={80} height={32} borderRadius={16} />
      </View>
    </View>
  );
}

/**
 * SkeletonList Component
 * 
 * Pre-built skeleton loader for list items.
 */
export function SkeletonList({ items = 3, style = {} }) {
  return (
    <View style={style}>
      {Array.from({ length: items }).map((_, index) => (
        <View key={index} style={styles.listItem}>
          <SkeletonLoader variant="circle" width={40} />
          <View style={styles.listItemContent}>
            <SkeletonLoader width="80%" height={16} />
            <View style={{ height: 6 }} />
            <SkeletonLoader width="60%" height={12} />
          </View>
        </View>
      ))}
    </View>
  );
}

/**
 * SkeletonText Component
 * 
 * Pre-built skeleton loader for text blocks.
 */
export function SkeletonText({ lines = 3, style = {} }) {
  return (
    <View style={style}>
      {Array.from({ length: lines }).map((_, index) => (
        <View key={index} style={styles.textLine}>
          <SkeletonLoader
            width={index === lines - 1 ? '70%' : '100%'}
            height={14}
            variant="text"
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: theme.colors.border,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.elevation.small,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  cardHeaderText: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  cardContent: {
    marginBottom: theme.spacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  listItemContent: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  textLine: {
    marginBottom: theme.spacing.xs,
  },
});

export default SkeletonLoader;
