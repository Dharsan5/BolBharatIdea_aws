import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for scheme operations

export const fetchSchemes = createAsyncThunk(
  'schemes/fetchSchemes',
  async ({ query, category, filters }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.API_URL}/schemes/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, category, filters }),
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

export const fetchSchemeDetails = createAsyncThunk(
  'schemes/fetchSchemeDetails',
  async (schemeId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.API_URL}/schemes/${schemeId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch scheme details');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  schemes: [],
  currentScheme: null,
  savedSchemes: [],
  searchQuery: '',
  filters: {
    category: 'all',
    sortBy: 'relevance',
  },
  isLoading: false,
  error: null,
};

const schemesSlice = createSlice({
  name: 'schemes',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    toggleSaveScheme: (state, action) => {
      const schemeId = action.payload;
      const index = state.savedSchemes.findIndex(s => s.id === schemeId);
      if (index >= 0) {
        state.savedSchemes.splice(index, 1);
      } else {
        const scheme = state.schemes.find(s => s.id === schemeId);
        if (scheme) {
          state.savedSchemes.push(scheme);
        }
      }
    },
    clearSchemes: (state) => {
      state.schemes = [];
      state.currentScheme = null;
      state.searchQuery = '';
    },
  },
  extraReducers: (builder) => {
    // Fetch schemes
    builder
      .addCase(fetchSchemes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSchemes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.schemes = action.payload;
      })
      .addCase(fetchSchemes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Fetch scheme details
    builder
      .addCase(fetchSchemeDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSchemeDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentScheme = action.payload;
      })
      .addCase(fetchSchemeDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSearchQuery,
  setFilters,
  toggleSaveScheme,
  clearSchemes,
} = schemesSlice.actions;

export default schemesSlice.reducer;
