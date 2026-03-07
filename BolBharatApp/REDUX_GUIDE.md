# Redux Toolkit State Management Guide

## Overview
BolBharat app uses Redux Toolkit for centralized state management across the application. This provides predictable state updates, middleware support, and better debugging capabilities.

## Store Structure

```
src/store/
├── index.js              # Store configuration
├── hooks.js              # Typed hooks (useAppDispatch, useAppSelector)
└── slices/
    ├── userSlice.js      # User profile, auth, preferences
    ├── schemesSlice.js   # Government schemes data
    ├── documentsSlice.js # Document processing state
    ├── formsSlice.js     # Form filling and applications
    └── voiceSlice.js     # Voice recording and transcription
```

## Installation

Already installed:
```bash
npm install @reduxjs/toolkit react-redux
```

## Usage

### 1. Using Hooks

```javascript
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setLanguage, updatePreferences } from '../store/slices/userSlice';

function MyComponent() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.profile);
  const isLoading = useAppSelector((state) => state.user.isLoading);

  const handleLanguageChange = (language) => {
    dispatch(setLanguage(language));
  };

  return <Text>{user?.name}</Text>;
}
```

### 2. User Slice

**State:**
- `profile` - User profile data
- `isAuthenticated` - Authentication status
- `offlineMode` - Offline mode toggle
- `preferences` - User preferences (language, notifications, etc.)

**Actions:**
```javascript
import { 
  setAuthenticated, 
  setOfflineMode, 
  updatePreferences,
  setLanguage,
  clearUser,
  fetchUserProfile,
  updateUserProfile
} from '../store/slices/userSlice';

// Sync actions
dispatch(setAuthenticated(true));
dispatch(setOfflineMode(false));
dispatch(setLanguage('hi'));
dispatch(updatePreferences({ notifications: true }));

// Async actions
dispatch(fetchUserProfile(userId));
dispatch(updateUserProfile({ name: 'New Name' }));
```

### 3. Schemes Slice

**State:**
- `schemes` - List of schemes
- `currentScheme` - Selected scheme details
- `savedSchemes` - User's saved schemes
- `searchQuery` - Current search query
- `filters` - Active filters

**Actions:**
```javascript
import { 
  setSearchQuery, 
  setFilters,
  toggleSaveScheme,
  clearSchemes,
  fetchSchemes,
  fetchSchemeDetails
} from '../store/slices/schemesSlice';

// Sync actions
dispatch(setSearchQuery('farming schemes'));
dispatch(setFilters({ category: 'Agriculture', sortBy: 'relevance' }));
dispatch(toggleSaveScheme(schemeId));

// Async actions
dispatch(fetchSchemes({ query: 'farming', category: 'all', filters: {} }));
dispatch(fetchSchemeDetails(schemeId));
```

### 4. Documents Slice

**State:**
- `documents` - List of processed documents
- `currentDocument` - Currently selected document
- `isProcessing` - OCR processing status

**Actions:**
```javascript
import { 
  setCurrentDocument,
  deleteDocument,
  clearDocuments,
  processDocument,
  fetchDocumentHistory
} from '../store/slices/documentsSlice';

// Sync actions
dispatch(setCurrentDocument(document));
dispatch(deleteDocument(documentId));

// Async actions
dispatch(processDocument({ imageUri, documentType: 'Ration Card' }));
dispatch(fetchDocumentHistory());
```

### 5. Forms Slice

**State:**
- `currentForm` - Current form being filled
- `formProgress` - Progress data for all forms
- `applications` - Submitted applications
- `isSubmitting` - Submission status

**Actions:**
```javascript
import { 
  setCurrentForm,
  updateFormProgress,
  saveFormData,
  clearCurrentForm,
  submitForm,
  fetchApplications
} from '../store/slices/formsSlice';

// Sync actions
dispatch(setCurrentForm(formData));
dispatch(updateFormProgress({ formId: 'ration-card', progress: 50 }));
dispatch(saveFormData({ formId: 'ration-card', data: { name: 'John' } }));

// Async actions
dispatch(submitForm({ formId: 'ration-card', formData: {} }));
dispatch(fetchApplications());
```

### 6. Voice Slice

**State:**
- `isRecording` - Recording status
- `transcript` - Current transcript
- `isProcessing` - Processing status
- `history` - Voice interaction history

**Actions:**
```javascript
import { 
  startRecording,
  stopRecording,
  setTranscript,
  setProcessing,
  setError,
  addToHistory,
  clearTranscript,
  clearHistory
} from '../store/slices/voiceSlice';

// All sync actions
dispatch(startRecording());
dispatch(stopRecording());
dispatch(setTranscript('User said something...'));
dispatch(setProcessing(true));
dispatch(addToHistory({ transcript: 'User', response: 'AI Response' }));
```

## Selectors

### Simple Selectors
```javascript
const user = useAppSelector((state) => state.user.profile);
const schemes = useAppSelector((state) => state.schemes.schemes);
const isLoading = useAppSelector((state) => state.user.isLoading);
```

### Complex Selectors (with logic)
```javascript
import { createSelector } from '@reduxjs/toolkit';

// Memoized selector
const selectSavedSchemeIds = createSelector(
  [(state) => state.schemes.savedSchemes],
  (savedSchemes) => savedSchemes.map(scheme => scheme.id)
);

const savedSchemeIds = useAppSelector(selectSavedSchemeIds);
```

## Async Operations

All async operations use `createAsyncThunk`:

```javascript
// Pending state - loading starts
fetchUserProfile.pending

// Fulfilled state - success
fetchUserProfile.fulfilled

// Rejected state - error
fetchUserProfile.rejected
```

**Handling in components:**
```javascript
function MyComponent() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.user.isLoading);
  const error = useAppSelector((state) => state.user.error);
  const user = useAppSelector((state) => state.user.profile);

  useEffect(() => {
    dispatch(fetchUserProfile(userId))
      .unwrap()
      .then((user) => console.log('Success:', user))
      .catch((error) => console.error('Error:', error));
  }, [dispatch, userId]);

  if (isLoading) return <LoadingIndicator />;
  if (error) return <ErrorScreen message={error} />;
  if (!user) return null;

  return <UserProfile user={user} />;
}
```

## Migration from Context API

The app currently uses Context API for some features. You can gradually migrate:

**Before (Context API):**
```javascript
const { savedSchemes, toggleScheme } = useSavedSchemes();
```

**After (Redux):**
```javascript
const savedSchemes = useAppSelector((state) => state.schemes.savedSchemes);
const dispatch = useAppDispatch();

const handleToggle = (schemeId) => {
  dispatch(toggleSaveScheme(schemeId));
};
```

## Persist State (Future Enhancement)

To persist state across app restarts, use `redux-persist`:

```bash
npm install redux-persist
```

Then wrap your reducers with `persistReducer`.

## DevTools

Redux DevTools are enabled in development mode by default. This allows you to:
- Inspect actions
- View state changes
- Time-travel debugging
- Export/import state

## Best Practices

1. **Use typed hooks:** Always use `useAppDispatch` and `useAppSelector`
2. **Keep reducers pure:** No side effects in reducers
3. **Use async thunks:** For API calls and async logic
4. **Normalize data:** Store data in a flat structure
5. **Selective updates:** Use `createSelector` for derived state
6. **Error handling:** Always handle rejected states
7. **Loading states:** Track loading for better UX

## Key Features

✅ 5 feature slices (user, schemes, documents, forms, voice)
✅ Async operations with createAsyncThunk
✅ Loading and error states for all async actions
✅ Typed hooks for better developer experience
✅ Serializable state check middleware
✅ Integrated with existing Context API
✅ Ready for API integration (marked with TODO comments)

## Next Steps

1. Replace mock data with actual API calls
2. Add redux-persist for offline support
3. Create more complex selectors as needed
4. Consider migrating existing Context API to Redux
5. Add middleware for analytics/logging
6. Implement optimistic updates for better UX

## API Integration Template

When integrating with AWS services:

```javascript
export const fetchSchemes = createAsyncThunk(
  'schemes/fetchSchemes',
  async ({ query }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_GATEWAY_URL}/schemes/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch schemes');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```
