import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_KEY = import.meta.env.VITE_OMDB_KEY;
const BASE_URL = import.meta.env.VITE_OMDB_URL;

export const searchMovies = createAsyncThunk(
  "movies/searchMovies",
  async (searchQuery: string, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}?s=${searchQuery}&apikey=${API_KEY}`
      );

      if (response.status !== 200) {
        return thunkAPI.rejectWithValue(response.statusText);
      }

      return response.data.Search;
    } catch (e) {
      if (e instanceof Error) {
        return thunkAPI.rejectWithValue(e.message);
      } else {
        return thunkAPI.rejectWithValue("Some unknown error occured");
      }
    }
  }
);
