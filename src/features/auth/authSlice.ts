import { createSlice } from "@reduxjs/toolkit";
import { User } from "@supabase/supabase-js";
import { checkSession, signIn, signOut, signUp } from "./authThunk";

interface AuthSliceType {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthSliceType = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(checkSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(signUp.pending, (state) => {
        state.loading = true;
      })
      .addCase(signIn.pending, (state) => {
        state.loading = true;
      })
      .addCase(signOut.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
      })
      .addCase(signUp.rejected, (state, action) => {
        if (action.error instanceof Error) {
          state.error = action.error.message;
        } else {
          state.error = "Some unknown error occured.";
        }
      })
      .addCase(signIn.rejected, (state, action) => {
        if (action.error instanceof Error) {
          state.error = action.error.message;
        } else {
          state.error = "Some unknown error occured.";
        }
      })
      .addCase(signOut.rejected, (state, action) => {
        if (action.error instanceof Error) {
          state.error = action.error.message;
        } else {
          state.error = "Some unknown error occured.";
        }
      });
  },
});

export default authSlice.reducer;
