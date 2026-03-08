import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { documentsApi } from '../../services/awsApi';

// Async thunks for document operations

export const processDocument = createAsyncThunk(
  'documents/processDocument',
  async ({ imageUri, documentType }, { rejectWithValue }) => {
    try {
        const data = await documentsApi.processDocument({ imageUri, documentType });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDocumentHistory = createAsyncThunk(
  'documents/fetchHistory',
  async (_, { rejectWithValue }) => {
    try {
        const data = await documentsApi.getDocumentHistory();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  documents: [],
  currentDocument: null,
  isProcessing: false,
  error: null,
};

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    setCurrentDocument: (state, action) => {
      state.currentDocument = action.payload;
    },
    deleteDocument: (state, action) => {
      state.documents = state.documents.filter(doc => doc.id !== action.payload);
    },
    clearDocuments: (state) => {
      state.documents = [];
      state.currentDocument = null;
    },
  },
  extraReducers: (builder) => {
    // Process document
    builder
      .addCase(processDocument.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(processDocument.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.currentDocument = action.payload;
        state.documents.unshift(action.payload);
      })
      .addCase(processDocument.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.payload;
      });

    // Fetch history
    builder
      .addCase(fetchDocumentHistory.fulfilled, (state, action) => {
        state.documents = action.payload;
      });
  },
});

export const {
  setCurrentDocument,
  deleteDocument,
  clearDocuments,
} = documentsSlice.actions;

export default documentsSlice.reducer;
