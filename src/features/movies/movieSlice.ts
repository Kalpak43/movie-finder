import { createSlice } from "@reduxjs/toolkit";
import { getFavorites, getRecommendations, searchMovies } from "./movieThunk";
import { signOut } from "../auth/authThunk";

interface MovieSliceType {
  movies: MovieType[];
  favorites: MovieType[];
  recommendations: MovieType[];
  status: "idle" | "loading" | "failed" | "succeeded";
  error: unknown | null;
}

const initialState: MovieSliceType = {
  movies: [],
  favorites: [],
  recommendations: [],
  status: "idle",
  error: null,
};

export const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setMovies: (state, action) => {
      state.movies = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getRecommendations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.movies = action.payload;
      })
      .addCase(getFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
      })
      .addCase(getRecommendations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.recommendations = action.payload;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.favorites = [];
        state.status = "succeeded";
      });
  },
});

export const { setStatus, setMovies } = movieSlice.actions;

export default movieSlice.reducer;
