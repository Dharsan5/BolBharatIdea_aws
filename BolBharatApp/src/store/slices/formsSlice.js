import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getApplications, saveApplication } from '../../api/database';

// Async thunks for form operations

export const submitForm = createAsyncThunk(
  'forms/submitForm',
  async ({ formId, formData }, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${API_URL}/forms/submit`, {
      //   method: 'POST',
      //   body: JSON.stringify({ formId, formData }),
      // });
      // return await response.json();
      
      // Mock data for now
      return {
        id: Date.now().toString(),
        formId,
        formData,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        applicationNumber: `APP${Date.now()}`,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchApplications = createAsyncThunk(
  'forms/fetchApplications',
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) return [];
      const response = await getApplications(userId);
      return response?.applications || response?.data || response?.items || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  currentForm: null,
  formProgress: {},
  applications: [],
  isSubmitting: false,
  error: null,
};

const formsSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    setCurrentForm: (state, action) => {
      state.currentForm = action.payload;
    },
    updateFormProgress: (state, action) => {
      const { formId, progress } = action.payload;
      state.formProgress[formId] = progress;
    },
    saveFormData: (state, action) => {
      const { formId, data } = action.payload;
      if (!state.formProgress[formId]) {
        state.formProgress[formId] = {};
      }
      state.formProgress[formId].data = {
        ...state.formProgress[formId].data,
        ...data,
      };
    },
    clearCurrentForm: (state) => {
      state.currentForm = null;
    },
  },
  extraReducers: (builder) => {
    // Submit form
    builder
      .addCase(submitForm.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(submitForm.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.applications.unshift(action.payload);
        // Clear form progress after successful submission
        if (action.payload.formId) {
          delete state.formProgress[action.payload.formId];
        }
      })
      .addCase(submitForm.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      });

    // Fetch applications
    builder
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.applications = action.payload;
      });
  },
});

export const {
  setCurrentForm,
  updateFormProgress,
  saveFormData,
  clearCurrentForm,
} = formsSlice.actions;

export default formsSlice.reducer;
