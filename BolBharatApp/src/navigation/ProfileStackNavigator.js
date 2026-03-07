import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/ProfileScreen';
import ProfileEditScreen from '../screens/ProfileEditScreen';
import LanguagePreferencesScreen from '../screens/LanguagePreferencesScreen';
import LocationSettingsScreen from '../screens/LocationSettingsScreen';
import DemographicsUpdateScreen from '../screens/DemographicsUpdateScreen';
import PrivacySettingsScreen from '../screens/PrivacySettingsScreen';
import OfflineModeScreen from '../screens/OfflineModeScreen';
import AppTutorialScreen from '../screens/AppTutorialScreen';
import ApplicationHistoryScreen from '../screens/ApplicationHistoryScreen';
import ApplicationStatusTrackingScreen from '../screens/ApplicationStatusTrackingScreen';
import ApplicationDetailsScreen from '../screens/ApplicationDetailsScreen';

const Stack = createNativeStackNavigator();

export default function ProfileStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
      />
      <Stack.Screen
        name="ProfileEdit"
        component={ProfileEditScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="LanguagePreferences"
        component={LanguagePreferencesScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="LocationSettings"
        component={LocationSettingsScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="DemographicsUpdate"
        component={DemographicsUpdateScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="PrivacySettings"
        component={PrivacySettingsScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="OfflineMode"
        component={OfflineModeScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="AppTutorial"
        component={AppTutorialScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="ApplicationHistory"
        component={ApplicationHistoryScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="ApplicationStatusTracking"
        component={ApplicationStatusTrackingScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="ApplicationDetails"
        component={ApplicationDetailsScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
}
