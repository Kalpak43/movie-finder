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


export function getDominantColor(imageData: Uint8ClampedArray, theme: string): string {
  let r = 0,
    g = 0,
    b = 0;
  const pixelCount = imageData.length / 4;

  for (let i = 0; i < imageData.length; i += 4) {
    r += imageData[i];
    g += imageData[i + 1];
    b += imageData[i + 2];
  }

  r = Math.floor(r / pixelCount);
  g = Math.floor(g / pixelCount);
  b = Math.floor(b / pixelCount);

  if (theme === "light") {
    return `rgba(${r},${g},${b}, 0)`;
  }

  return `rgb(${r},${g},${b}, 0.5)`;
}
