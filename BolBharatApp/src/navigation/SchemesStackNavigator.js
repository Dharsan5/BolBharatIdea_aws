import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SchemesScreen from '../screens/SchemesScreen';
import SchemeListScreen from '../screens/SchemeListScreen';
import SchemeDetailScreen from '../screens/SchemeDetailScreen';
import SavedSchemesScreen from '../screens/SavedSchemesScreen';
import EligibilityCheckerScreen from '../screens/EligibilityCheckerScreen';

const Stack = createNativeStackNavigator();

export default function SchemesStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="SchemesList" component={SchemesScreen} />
      <Stack.Screen 
        name="SchemeList" 
        component={SchemeListScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="SchemeDetail" 
        component={SchemeDetailScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="SavedSchemes" 
        component={SavedSchemesScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="EligibilityChecker" 
        component={EligibilityCheckerScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
}
