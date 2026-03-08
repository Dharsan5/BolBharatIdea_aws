/**
 * Example Usage of Offline Manager in Redux Slices
 * 
 * This file demonstrates how to integrate offlineManager with Redux async thunks
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import offlineManager from '../utils/offlineManager';

// =======================
// Example 1: Fetch Schemes (GET with Cache)
// =======================

export const fetchSchemes = createAsyncThunk(
  'schemes/fetchSchemes',
  async ({ query, category, filters }, { rejectWithValue }) => {
    try {
      const { data, fromCache } = await offlineManager.fetch(
        `/api/schemes?query=${query}&category=${category}`,
        {
          method: 'GET',
          cache: true, // Enable caching for offline access
        }
      );

      return { schemes: data, fromCache };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// =======================
// Example 2: Submit Form (POST with Queue)
// =======================

export const submitForm = createAsyncThunk(
  'forms/submitForm',
  async ({ formId, formData }, { rejectWithValue }) => {
    try {
      const { data } = await offlineManager.fetch(
        `/api/forms/${formId}/submit`,
        {
          method: 'POST',
          body: JSON.stringify(formData),
          priority: 'high', // High priority for form submissions
          cache: false, // Don't cache POST requests
        }
      );

      return data;
    } catch (error) {
      // Request is automatically queued if offline
      return rejectWithValue(error.message);
    }
  }
);

// =======================
// Example 3: Process Document (POST with Queue)
// =======================

export const processDocument = createAsyncThunk(
  'documents/processDocument',
  async ({ imageUri, documentType }, { rejectWithValue }) => {
    try {
      const { data } = await offlineManager.fetch(
        `/api/documents/process`,
        {
          method: 'POST',
          body: JSON.stringify({
            imageUri,
            documentType,
            timestamp: Date.now(),
          }),
          priority: 'normal',
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// =======================
// Example 4: Update User Profile (PUT with Queue)
// =======================

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await offlineManager.fetch(
        `/api/user/profile`,
        {
          method: 'PUT',
          body: JSON.stringify(userData),
          priority: 'normal',
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// =======================
// Example 5: Save Scheme (POST)
// =======================

export const saveScheme = createAsyncThunk(
  'schemes/saveScheme',
  async (schemeId, { rejectWithValue }) => {
    try {
      const { data } = await offlineManager.fetch(
        `/api/schemes/${schemeId}/save`,
        {
          method: 'POST',
          priority: 'normal',
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// =======================
// Example 6: Component Usage
// =======================

/*
import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useNetworkStatus } from '../hooks/useOffline';
import { fetchSchemes } from '../store/slices/schemesSlice';

function SchemesScreen() {
  const dispatch = useAppDispatch();
  const { isOnline } = useNetworkStatus();
  const { schemes, isLoading, fromCache } = useAppSelector(state => state.schemes);

  useEffect(() => {
    dispatch(fetchSchemes({ query: 'farming', category: 'all', filters: {} }));
  }, []);

  return (
    <View>
      {!isOnline && <Text>Offline Mode</Text>}
      {fromCache && <Text>Showing cached data</Text>}
      
      {isLoading && <Text>Loading...</Text>}
      
      {schemes.map(scheme => (
        <Text key={scheme.id}>{scheme.name}</Text>
      ))}
      
      <Button 
        title="Refresh" 
        onPress={() => dispatch(fetchSchemes({ query: 'farming' }))}
        disabled={!isOnline}
      />
    </View>
  );
}
*/

// =======================
// Example 7: Manual Queue Management
// =======================

/*
import offlineManager from '../utils/offlineManager';

// Check queue status
const status = offlineManager.getQueueStatus();
console.log(`${status.count} items in queue`);

// Manual sync
await offlineManager.syncQueue();

// Clear queue
await offlineManager.clearQueue();

// Clear cache
await offlineManager.clearCache();
*/

// =======================
// Example 8: Custom Fetch with Auth
// =======================

export const fetchWithAuth = async (url, options = {}) => {
  const token = await getAuthToken(); // Your auth token getter
  
  return offlineManager.fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });
};

// Use in thunk:
/*
export const fetchUserData = createAsyncThunk(
  'user/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await fetchWithAuth('/api/user/data', {
        method: 'GET',
        cache: true,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
*/

// =======================
// Example 9: Handling fromCache in Reducer
// =======================

/*
extraReducers: (builder) => {
  builder
    .addCase(fetchSchemes.fulfilled, (state, action) => {
      state.schemes = action.payload.schemes;
      state.fromCache = action.payload.fromCache;
      state.isLoading = false;
      state.error = null;
      state.lastUpdated = action.payload.fromCache ? state.lastUpdated : Date.now();
    });
}
*/

// =======================
// Example 10: Toast Notifications for Offline
// =======================

/*
import { useToast } from '../hooks/useToast';
import { useNetworkStatus } from '../hooks/useOffline';

function FormSubmit() {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { isOnline } = useNetworkStatus();

  const handleSubmit = async (formData) => {
    try {
      await dispatch(submitForm({ formId: 'ration-card', formData })).unwrap();
      
      if (isOnline) {
        showToast('Form submitted successfully!', 'success');
      } else {
        showToast('Form saved. Will sync when online.', 'info');
      }
    } catch (error) {
      showToast('Error submitting form', 'error');
    }
  };

  return (
    <Button title="Submit" onPress={() => handleSubmit(data)} />
  );
}
*/
