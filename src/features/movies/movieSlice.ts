import { createSlice } from "@reduxjs/toolkit";
import { getFavorites, searchMovies } from "./movieThunk";

interface MovieSliceType {
  movies: MovieType[];
  favorites: MovieType[];
  status: "idle" | "loading" | "failed" | "succeeded";
  error: unknown | null;
}

const initialState: MovieSliceType = {
  movies: [],
  favorites: [],
  status: "idle",
  error: null,
};

export const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(searchMovies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.movies = action.payload;
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getFavorites.fulfilled, (state, action) => {
        (state.status = "succeeded"), (state.favorites = action.payload);
      });
  },
});

export default movieSlice.reducer;
