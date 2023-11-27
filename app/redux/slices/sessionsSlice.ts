import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  ThunkDispatch,
} from "@reduxjs/toolkit";

interface BriefProps {
  artworkStyle: string;
  colorPalette: string;
  imageryMotifs: string;
  composition: string;
  medium: string;
  finish: string;
  additionalNotes: string;
  [key: string]: string; // Add an index signature to allow indexing with strings
}

interface SessionsState {
  originalImage?: string | null;
  analysis?: string | null;
  brief?: BriefProps | null;
  generatedImage?: string | null;
  loading: boolean;
  error: string | null;
}

export const fetchOpenAIAnalysis = createAsyncThunk(
  "sessions/fetchOpenAIAnalysis",
  async ({ imageUrl }: { imageUrl: string }) => {
    // console.log("fetchOpenAIAnalysis imageUrl:", imageUrl);
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    const apiURL = `${baseURL}/vision-analysis`;
    const response = await fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageUrl,
      }),
    });
    const data = await response.json();
    console.log("fetchOpenAIAnalysis response data:", data);

    try {
      const content = await JSON.parse(data);
      console.log("Parsed content:", content);
      return content;
    } catch (error) {
      console.error("Error parsing content:", error);
    }
  }
);

export const fetchGeneratedImage = createAsyncThunk(
  "sessions/fetchGeneratedImage",
  async ({ brief }: { brief: string }) => {
    // console.log("fetchOpenAIAnalysis imageUrl:", imageUrl);
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    const apiURL = `${baseURL}/image-generation`;

    const response = await fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: brief,
      }),
    });
    const data = await response.json();
    console.log("generated image data:", data);
    return data;
  }
);

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
  extraReducers: (builder) => {
    builder.addCase(fetchOpenAIAnalysis.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchOpenAIAnalysis.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      console.log("extraReducer action");
      console.log(
        "fetchOpenAIAnalysis.fulfilled action.payload:",
        action.payload
      );
      state.analysis = action.payload.analysis;
      state.brief = action.payload.brief;
    });
    builder.addCase(fetchOpenAIAnalysis.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(fetchGeneratedImage.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchGeneratedImage.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      console.log("extraReducer action");
      console.log(
        "fetchGeneratedImage.fulfilled action.payload:",
        action.payload
      );
      state.generatedImage = action.payload;
    });
    builder.addCase(fetchGeneratedImage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
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
