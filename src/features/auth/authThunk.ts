import supabase from "@/supabase";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const checkSession = createAsyncThunk("auth/checkSession", async () => {
  const { data } = await supabase.auth.getSession();
  return data.session?.user || null;
});

export const signUp = createAsyncThunk(
  "auth/signUp",
  async ({ email, password }: { email: string; password: string }) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data.user;
  }
);

export const signIn = createAsyncThunk(
  "auth/signIn",
  async ({ email, password }: { email: string; password: string }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data.user;
  }
);

export const signOut = createAsyncThunk("auth/signOut", async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return null;
});
