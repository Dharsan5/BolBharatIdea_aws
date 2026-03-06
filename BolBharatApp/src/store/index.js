import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import schemesReducer from './slices/schemesSlice';
import documentsReducer from './slices/documentsSlice';
import formsReducer from './slices/formsSlice';
import voiceReducer from './slices/voiceSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    schemes: schemesReducer,
    documents: documentsReducer,
    forms: formsReducer,
    voice: voiceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['voice/addToHistory'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['voice.history'],
      },
    }),
});

export default store;
