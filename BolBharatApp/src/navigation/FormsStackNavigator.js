import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FormSelectionScreen from '../screens/FormSelectionScreen';
import ConversationalFormScreen from '../screens/ConversationalFormScreen';
import FormPreviewScreen from '../screens/FormPreviewScreen';
import FormSubmissionScreen from '../screens/FormSubmissionScreen';
import FormConfirmationScreen from '../screens/FormConfirmationScreen';

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
      <Stack.Screen
        name="FormSubmission"
        component={FormSubmissionScreen}
        options={{
          animation: 'fade',
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="FormConfirmation"
        component={FormConfirmationScreen}
        options={{
          animation: 'slide_from_bottom',
          gestureEnabled: false,
        }}
      />
      {/* Additional screens will be added here:
          - FormSubmission (submission status)
          - FormTracking (application tracking)
      */}
    </Stack.Navigator>
  );
}
