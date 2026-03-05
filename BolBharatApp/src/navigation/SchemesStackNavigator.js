import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SchemesScreen from '../screens/SchemesScreen';
import SchemeDetailScreen from '../screens/SchemeDetailScreen';
import SavedSchemesScreen from '../screens/SavedSchemesScreen';

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
    </Stack.Navigator>
  );
}
