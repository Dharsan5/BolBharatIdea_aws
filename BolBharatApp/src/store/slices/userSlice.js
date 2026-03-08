import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userApi } from '../../services/awsApi';

// Async thunks for user operations

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const data = await userApi.getUserProfile(userId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await userApi.updateUserProfile(userData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  profile: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  offlineMode: false,
  preferences: {
    language: 'en',
    notifications: true,
    voiceEnabled: true,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setOfflineMode: (state, action) => {
      state.offlineMode = action.payload;
    },
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    setLanguage: (state, action) => {
      state.preferences.language = action.payload;
    },
    clearUser: (state) => {
      state.profile = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch user profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Update user profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = { ...state.profile, ...action.payload };
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setAuthenticated,
  setOfflineMode,
  updatePreferences,
  setLanguage,
  clearUser,
} = userSlice.actions;

export default userSlice.reducer;
