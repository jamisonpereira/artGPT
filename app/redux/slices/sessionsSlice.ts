import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  ThunkDispatch,
} from "@reduxjs/toolkit";

interface SessionsState {
  originalImage?: string | null;
  analysis?: string | null;
  brief?: string | null;
  generatedImage?: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: SessionsState = {
  originalImage: null,
  analysis: null,
  brief: null,
  generatedImage: null,
  loading: false,
  error: null,
};

const sessionsSlice = createSlice({
  name: "sessions",
  initialState,
  reducers: {
    setOriginalImage: (state, action: PayloadAction<string | null>) => {
      state.originalImage = action.payload;
    },
    setAnalysis: (state, action: PayloadAction<string | null>) => {
      state.analysis = action.payload;
    },
    setBrief: (state, action: PayloadAction<string | null>) => {
      state.brief = action.payload;
    },
    setGeneratedImage: (state, action: PayloadAction<string | null>) => {
      state.generatedImage = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    // Optionally, you can add a reset action to reset the state to its initial value
    resetSession: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setOriginalImage,
  setAnalysis,
  setBrief,
  setGeneratedImage,
  setLoading,
  setError,
  resetSession,
} = sessionsSlice.actions;

export default sessionsSlice.reducer;
