import { useAppDispatch, useAppSelector } from "@/app/hook";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getFavorites } from "@/features/movies/movieThunk";
import { addToFavorite, removeFavorite } from "@/lib/utils";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

const API_KEY = import.meta.env.VITE_OMDB_KEY;
const BASE_URL = import.meta.env.VITE_OMDB_URL;

function MoviePage() {
  const { movieId } = useParams();
  const dispatch = useAppDispatch();
  const { favorites } = useAppSelector((state) => state.movies);
  const { user } = useAppSelector((state) => state.auth);
  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URL}?apikey=${API_KEY}&i=${movieId}`)
      .then((res) => {
        const movieData = res.data;
        const isFavorite = favorites.some(
          (fav) => fav.imdbID === movieData.imdbID
        );
        setMovie({ ...movieData, fav: isFavorite });
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, [movieId]);

  useEffect(() => {
    if (movie) {
      const isFavorite = favorites.some((fav) => fav.imdbID === movie?.imdbID);
      setMovie((x) =>
        x
          ? {
              ...x,
              fav: isFavorite,
            }
          : null
      );
    }
  }, [favorites]);

  if (loading) {
    return <Skeleton className="w-full h-96" />;
  }

  if (!movie) {
    return <p className="text-center text-red-500">Movie not found.</p>;
  }

  const handleAddToFavorties = async (movie: MovieType) => {
    const { error } = await addToFavorite(user?.id!, movie);

    if (error) console.error(error);

    dispatch(getFavorites(user?.id!));
  };

  const removeFromFavorites = async (movie: MovieType) => {
    const { error } = await removeFavorite(user?.id!, movie.imdbID);

    if (error) console.error(error);

    dispatch(getFavorites(user?.id!));
  };

  return (
    <div className="flex justify-center mt-10">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>
            {movie.Title} ({movie.Year})
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <img
            src={movie.Poster}
            alt={movie.Title}
            className="w-48 rounded-lg shadow-md"
          />
          <div className="flex flex-col gap-2">
            <p>
              <strong>Genre:</strong> {movie.Genre}
            </p>
            <p>
              <strong>Director:</strong> {movie.Director}
            </p>
            <p>
              <strong>Actors:</strong> {movie.Actors}
            </p>
            <p>
              <strong>Plot:</strong> {movie.Plot}
            </p>
            <p>
              <strong>Runtime:</strong> {movie.Runtime}
            </p>
            <p>
              <strong>Language:</strong> {movie.Language}
            </p>
            <p>
              <strong>Country:</strong> {movie.Country}
            </p>
            <p>
              <strong>IMDb Rating:</strong> <Badge>{movie.imdbRating}</Badge>
            </p>

            <Button
              onClick={() => {
                movie.fav
                  ? removeFromFavorites(movie)
                  : handleAddToFavorties(movie);
              }}
            >
              {movie.fav ? "Remove From Favourites" : "Add to Favourites"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default MoviePage;
