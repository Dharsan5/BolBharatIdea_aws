import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { theme } from '../theme';

const AnimatedBlob = ({ isListening, amplitude = 0 }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Continuous rotation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  useEffect(() => {
    // Pulse animation when listening
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      Animated.spring(pulseAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  }, [isListening]);

  // React to voice amplitude
  useEffect(() => {
    if (isListening && amplitude > 0) {
      const scale = 1 + (amplitude * 0.5); // Scale based on amplitude
      Animated.spring(scaleAnim, {
        toValue: scale,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  }, [amplitude, isListening]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const combinedScale = Animated.multiply(scaleAnim, pulseAnim);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.blobContainer,
          {
            transform: [
              { scale: combinedScale },
              { rotate },
            ],
          },
        ]}
      >
        <View style={styles.blob}>
          {/* Outer glow */}
          <View style={[styles.blobLayer, styles.outerGlow]} />
          
          {/* Middle layer */}
          <View style={[styles.blobLayer, styles.middleLayer]} />
          
          {/* Inner core */}
          <View style={[styles.blobLayer, styles.innerCore]} />
          
          {/* Center highlight */}
          <View style={styles.centerHighlight} />
        </View>
      </Animated.View>

      {/* Listening indicator text */}
      {isListening && (
        <Animated.View style={[styles.indicator, { opacity: pulseAnim }]}>
          <View style={styles.indicatorDot} />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blobContainer: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blob: {
    width: 220,
    height: 220,
    borderRadius: 110,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blobLayer: {
    position: 'absolute',
    borderRadius: 9999,
  },
  outerGlow: {
    width: 220,
    height: 220,
    backgroundColor: theme.colors.gray200,
    opacity: 0.3,
  },
  middleLayer: {
    width: 180,
    height: 180,
    backgroundColor: theme.colors.gray300,
    opacity: 0.5,
  },
  innerCore: {
    width: 140,
    height: 140,
    backgroundColor: theme.colors.gray400,
    opacity: 0.7,
  },
  centerHighlight: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.gray600,
  },
  indicator: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.black,
    marginRight: 8,
  },
});

export default AnimatedBlob;
