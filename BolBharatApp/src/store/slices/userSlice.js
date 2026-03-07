import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for user operations

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (userId, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${API_URL}/users/${userId}`);
      // return await response.json();
      
      // Mock data for now
      return {
        id: userId,
        name: 'User Name',
        phone: '+91 98765 43210',
        email: 'user@example.com',
        language: 'hi',
        location: {
          state: 'Maharashtra',
          district: 'Mumbai',
          pincode: '400001',
        },
        demographics: {
          age: 35,
          occupation: 'Farmer',
          income: 'Below 2.5L',
          category: 'General',
        },
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${API_URL}/users/${userData.id}`, {
      //   method: 'PUT',
      //   body: JSON.stringify(userData),
      // });
      // return await response.json();
      
      return userData;
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
