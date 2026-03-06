import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import schemesReducer from './slices/schemesSlice';
import documentsReducer from './slices/documentsSlice';
import formsReducer from './slices/formsSlice';
import voiceReducer from './slices/voiceSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user', 'schemes', 'documents'], // Only persist these reducers
  blacklist: ['forms', 'voice'], // Don't persist temporary state
};

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  schemes: schemesReducer,
  documents: documentsReducer,
  forms: formsReducer,
  voice: voiceReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
          'persist/FLUSH',
          'voice/addToHistory',
        ],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.timestamp', 'register', 'rehydrate'],
        // Ignore these paths in the state
        ignoredPaths: ['voice.history'],
      },
    }),
});

export const persistor = persistStore(store);

export default store;
