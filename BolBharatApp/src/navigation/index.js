import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import BottomTabNavigator from './BottomTabNavigator';
import WelcomeScreen from '../screens/WelcomeScreen';
import LanguageSelectionScreen from '../screens/LanguageSelectionScreen';
import PhoneAuthScreen from '../screens/PhoneAuthScreen';
import UserProfileSetupScreen from '../screens/UserProfileSetupScreen';
import { useLanguage } from '../context/LanguageContext';

const Stack = createNativeStackNavigator();
const ONBOARDING_COMPLETE_KEY = '@bolbharat_onboarding_complete';

export default function RootNavigator() {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const { hasSelectedLanguage, isLoading: isLanguageLoading } = useLanguage();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const completed = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY);
        if (completed === 'true') {
          setHasCompletedOnboarding(true);
          return;
        }

        // Backward compatibility: users who completed profile before this key was introduced.
        const existingProfile = await AsyncStorage.getItem('userProfile');
        const profileExists = !!existingProfile;
        setHasCompletedOnboarding(profileExists);

        if (profileExists) {
          await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
        }
      } catch (error) {
        console.error('Failed to read onboarding status', error);
      } finally {
        setIsCheckingOnboarding(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  const initialRouteName = useMemo(() => {
    if (!hasSelectedLanguage) {
      return 'Welcome';
    }

    if (!isAuthenticated) {
      return 'PhoneAuth';
    }

    if (!hasCompletedOnboarding) {
      return 'UserProfileSetup';
    }

    return 'Main';
  }, [hasCompletedOnboarding, hasSelectedLanguage, isAuthenticated]);

  if (isLanguageLoading || isCheckingOnboarding) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
        <Stack.Screen name="PhoneAuth" component={PhoneAuthScreen} />
        <Stack.Screen name="UserProfileSetup" component={UserProfileSetupScreen} />
        <Stack.Screen name="Main" component={BottomTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
