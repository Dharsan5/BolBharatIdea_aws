import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FormSelectionScreen from '../screens/FormSelectionScreen';
import ConversationalFormScreen from '../screens/ConversationalFormScreen';
import FormPreviewScreen from '../screens/FormPreviewScreen';

const Stack = createNativeStackNavigator();

export default function FormsStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="FormSelection"
        component={FormSelectionScreen}
      />
      <Stack.Screen
        name="FormConversation"
        component={ConversationalFormScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="FormPreview"
        component={FormPreviewScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      {/* Additional screens will be added here:
          - FormConfirmation (confirmation screen)
          - FormSubmission (submission status)
          - FormTracking (application tracking)
      */}
    </Stack.Navigator>
  );
}
