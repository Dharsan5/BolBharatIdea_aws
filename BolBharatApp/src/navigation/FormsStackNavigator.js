import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FormSelectionScreen from '../screens/FormSelectionScreen';

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
      {/* Additional screens will be added here:
          - FormConversation (conversational interface)
          - FormProgress (progress indicator)
          - FormPreview (form summary/review)
          - FormConfirmation (confirmation screen)
          - FormSubmission (submission status)
          - FormTracking (application tracking)
      */}
    </Stack.Navigator>
  );
}
