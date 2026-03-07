import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for scheme operations

export const fetchSchemes = createAsyncThunk(
  'schemes/fetchSchemes',
  async ({ query, category, filters }, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call to AWS Lambda + Bedrock
      // const response = await fetch(`${API_URL}/schemes/search`, {
      //   method: 'POST',
      //   body: JSON.stringify({ query, category, filters }),
      // });
      // return await response.json();
      
      // Mock data for now
      return [
        {
          id: '1',
          name: 'Pradhan Mantri Fasal Bima Yojana',
          nameHindi: 'प्रधानमंत्री फसल बीमा योजना',
          category: 'Agriculture',
          description: 'Crop insurance scheme for farmers',
          relevanceScore: 95,
          benefits: '₹2 Lakh coverage per farmer',
        },
      ];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSchemeDetails = createAsyncThunk(
  'schemes/fetchSchemeDetails',
  async (schemeId, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      return {
        id: schemeId,
        name: 'Scheme Name',
        details: 'Detailed information...',
      };
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
