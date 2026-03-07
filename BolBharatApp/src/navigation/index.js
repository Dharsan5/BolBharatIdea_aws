import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import WelcomeScreen from '../screens/WelcomeScreen';
import LanguageSelectionScreen from '../screens/LanguageSelectionScreen';
import PhoneAuthScreen from '../screens/PhoneAuthScreen';
import UserProfileSetupScreen from '../screens/UserProfileSetupScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
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
