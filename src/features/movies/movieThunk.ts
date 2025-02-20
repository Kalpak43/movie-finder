import supabase from "@/supabase";
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

      const { data } = response;

      if (data.Error) return thunkAPI.rejectWithValue(data.Error);

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

export const getFavorites = createAsyncThunk(
  "movies/getFavorites",
  async (user_id: string, thunkAPI) => {
    try {
      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user_id);

      if (error) {
        console.error("Error fetching favorites:", error);
        return [];
      }

      return data;
    } catch (e) {
      if (e instanceof Error) {
        return thunkAPI.rejectWithValue(e.message);
      } else {
        return thunkAPI.rejectWithValue("Some unknown error occured");
      }
    }
  }
);
