import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

const API_KEY = import.meta.env.VITE_OMDB_KEY;
const BASE_URL = import.meta.env.VITE_OMDB_URL;

function MoviePage() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URL}?apikey=${API_KEY}&i=${movieId}`)
      .then((res) => {
        setMovie(res.data);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, [movieId]);

  if (loading) {
    return <Skeleton className="w-full h-96" />;
  }

  if (!movie) {
    return <p className="text-center text-red-500">Movie not found.</p>;
  }

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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default MoviePage;
