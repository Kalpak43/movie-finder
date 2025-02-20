import supabase from "@/supabase";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function addToFavorite(user_id: string, movie: MovieType) {
  const { data, error } = await supabase.from("favorites").upsert(
    {
      user_id: user_id,
      Poster: movie.Poster,
      Title: movie.Title,
      Type: movie.Type,
      Year: movie.Year,
      imdbID: movie.imdbID,
    },
    { onConflict: "user_id, imdbID" }
  );

  return {
    data,
    error,
  };
}

export async function removeFavorite(user_id: string, movie_id: string) {
  const { data, error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", user_id)
    .eq("imdbID", movie_id);

  return {
    data,
    error,
  };
}
