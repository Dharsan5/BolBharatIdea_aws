import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isRecording: false,
  transcript: '',
  isProcessing: false,
  error: null,
  history: [],
};

const voiceSlice = createSlice({
  name: 'voice',
  initialState,
  reducers: {
    startRecording: (state) => {
      state.isRecording = true;
      state.error = null;
    },
    stopRecording: (state) => {
      state.isRecording = false;
    },
    setTranscript: (state, action) => {
      state.transcript = action.payload;
    },
    setProcessing: (state, action) => {
      state.isProcessing = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isRecording = false;
      state.isProcessing = false;
    },
    addToHistory: (state, action) => {
      state.history.unshift({
        id: Date.now().toString(),
        transcript: action.payload.transcript,
        response: action.payload.response,
        timestamp: new Date().toISOString(),
      });
      // Keep only last 50 items
      if (state.history.length > 50) {
        state.history.pop();
      }
    },
    clearTranscript: (state) => {
      state.transcript = '';
    },
    clearHistory: (state) => {
      state.history = [];
    },
  },
});

export const {
  startRecording,
  stopRecording,
  setTranscript,
  setProcessing,
  setError,
  addToHistory,
  clearTranscript,
  clearHistory,
} = voiceSlice.actions;

export default voiceSlice.reducer;
