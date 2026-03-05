import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const BolBharatLogo = ({ size = 100, animated = false }) => {
  const logoSize = size;
  const center = logoSize / 2;
  const spokeCount = 24; // Ashoka Chakra has 24 spokes
  const spokeLength = logoSize * 0.45;
  const innerCircleRadius = logoSize * 0.08;
  const outerRingWidth = 2;
  
  // Animation values for sound waves
  const leftWave1 = useRef(new Animated.Value(1)).current;
  const leftWave2 = useRef(new Animated.Value(1)).current;
  const leftWave3 = useRef(new Animated.Value(1)).current;
  const leftWave4 = useRef(new Animated.Value(1)).current;
  const rightWave1 = useRef(new Animated.Value(1)).current;
  const rightWave2 = useRef(new Animated.Value(1)).current;
  const rightWave3 = useRef(new Animated.Value(1)).current;
  const rightWave4 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!animated) return;

    // Animate sound waves
    const createWaveAnimation = (animValue, delay, minScale = 0.5, maxScale = 1) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: minScale,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: maxScale,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
    };

    // Stagger the wave animations
    Animated.parallel([
      createWaveAnimation(leftWave1, 0, 0.6, 1),
      createWaveAnimation(leftWave2, 100, 0.7, 1),
      createWaveAnimation(leftWave3, 200, 0.5, 1),
      createWaveAnimation(leftWave4, 150, 0.6, 1),
      createWaveAnimation(rightWave1, 50, 0.6, 1),
      createWaveAnimation(rightWave2, 150, 0.5, 1),
      createWaveAnimation(rightWave3, 250, 0.7, 1),
      createWaveAnimation(rightWave4, 100, 0.6, 1),
    ]).start();
  }, [animated]);
  
  // Generate spokes (like Ashoka Chakra)
  const spokes = [];
  for (let i = 0; i < spokeCount; i++) {
    const angle = (i * 360) / spokeCount;
    const radian = (angle * Math.PI) / 180;
    
    const startX = center + Math.cos(radian) * innerCircleRadius;
    const startY = center + Math.sin(radian) * innerCircleRadius;
    const endX = center + Math.cos(radian) * spokeLength;
    const endY = center + Math.sin(radian) * spokeLength;
    
    // Determine color based on position (tricolor effect)
    let color = '#003D7A'; // Navy blue (default)
    if (i < spokeCount * 0.25 || i > spokeCount * 0.75) {
      color = '#FF9933'; // Saffron/Orange
    } else if (i > spokeCount * 0.45 && i < spokeCount * 0.55) {
      color = '#138808'; // Green
    }
    
    spokes.push({
      key: i,
      startX,
      startY,
      endX,
      endY,
      color,
      angle,
    });
  }
  
  // Sound wave bars (left and right sides)
  const leftWaves = [
    { height: 0.3, color: '#FF9933', anim: leftWave1 },
    { height: 0.5, color: '#FF9933', anim: leftWave2 },
    { height: 0.7, color: '#003D7A', anim: leftWave3 },
    { height: 0.4, color: '#003D7A', anim: leftWave4 },
  ];
  
  const rightWaves = [
    { height: 0.4, color: '#003D7A', anim: rightWave1 },
    { height: 0.6, color: '#138808', anim: rightWave2 },
    { height: 0.8, color: '#138808', anim: rightWave3 },
    { height: 0.5, color: '#138808', anim: rightWave4 },
  ];
  
  return (
    <View style={[styles.container, { width: logoSize, height: logoSize }]}>
      {/* Outer circle */}
      <View
        style={[
          styles.outerRing,
          {
            width: logoSize,
            height: logoSize,
            borderRadius: logoSize / 2,
            borderWidth: outerRingWidth,
          },
        ]}
      />
      
      {/* Spokes container */}
      <View style={styles.spokesContainer}>
        {spokes.map((spoke) => (
          <View
            key={spoke.key}
            style={[
              styles.spoke,
              {
                width: spokeLength,
                height: 2,
                left: center,
                top: center - 1,
                backgroundColor: spoke.color,
                transform: [
                  { translateX: -innerCircleRadius },
                  { rotate: `${spoke.angle}deg` },
                ],
              },
            ]}
          />
        ))}
      </View>
      
      {/* Center circle */}
      <View
        style={[
          styles.centerCircle,
          {
            width: innerCircleRadius * 2,
            height: innerCircleRadius * 2,
            borderRadius: innerCircleRadius,
            top: center - innerCircleRadius,
            left: center - innerCircleRadius,
          },
        ]}
      />
      
      {/* Left sound waves */}
      <View style={[styles.waveContainer, styles.leftWaves]}>
        {leftWaves.map((wave, index) => (
          <Animated.View
            key={`left-${index}`}
            style={[
              styles.waveBar,
              {
                height: wave.height * logoSize * 0.6,
                backgroundColor: wave.color,
                marginHorizontal: 2,
                transform: animated ? [{ scaleY: wave.anim }] : [],
              },
            ]}
          />
        ))}
      </View>
      
      {/* Right sound waves */}
      <View style={[styles.waveContainer, styles.rightWaves]}>
        {rightWaves.map((wave, index) => (
          <Animated.View
            key={`right-${index}`}
            style={[
              styles.waveBar,
              {
                height: wave.height * logoSize * 0.6,
                backgroundColor: wave.color,
                marginHorizontal: 2,
                transform: animated ? [{ scaleY: wave.anim }] : [],
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerRing: {
    position: 'absolute',
    borderColor: '#003D7A',
  },
  spokesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  spoke: {
    position: 'absolute',
    transformOrigin: 'left center',
  },
  centerCircle: {
    position: 'absolute',
    backgroundColor: '#003D7A',
  },
  waveContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftWaves: {
    left: -40,
    top: '50%',
    transform: [{ translateY: -20 }],
  },
  rightWaves: {
    right: -40,
    top: '50%',
    transform: [{ translateY: -20 }],
  },
  waveBar: {
    width: 4,
    borderRadius: 2,
  },
});

export default BolBharatLogo;
