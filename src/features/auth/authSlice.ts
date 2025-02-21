import { createSlice } from "@reduxjs/toolkit";
import { User } from "@supabase/supabase-js";
import {
  checkSession,
  signIn,
  signInWithFacebook,
  signInWithGoogle,
  signOut,
  signUp,
} from "./authThunk";

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
      .addCase(signInWithGoogle.pending, (state) => {
        state.loading = true;
      })
      .addCase(signInWithFacebook.pending, (state) => {
        state.loading = true;
      })
      .addCase(signOut.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(signUp.fulfilled, (state) => {
        // state.user = action.payload;
        state.loading = false;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(signInWithGoogle.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signInWithFacebook.fulfilled, (state) => {
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
      .addCase(signInWithGoogle.rejected, (state, action) => {
        if (action.error instanceof Error) {
          state.error = action.error.message;
        } else {
          state.error = "Some unknown error occured.";
        }
      })
      .addCase(signInWithFacebook.rejected, (state, action) => {
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
