import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DocumentsScreen from '../screens/DocumentsScreen';
import DocumentCameraScreen from '../screens/DocumentCameraScreen';
import DocumentPreviewScreen from '../screens/DocumentPreviewScreen';
import SimplifiedDocumentScreen from '../screens/SimplifiedDocumentScreen';

const Stack = createNativeStackNavigator();

export default function DocumentsStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="DocumentsList" component={DocumentsScreen} />
      <Stack.Screen 
        name="DocumentCamera" 
        component={DocumentCameraScreen}
        options={{
          animation: 'fade',
        }}
      />
      <Stack.Screen 
        name="DocumentPreview" 
        component={DocumentPreviewScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="SimplifiedDocument" 
        component={SimplifiedDocumentScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
}
