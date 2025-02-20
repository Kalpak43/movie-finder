import { useAppDispatch, useAppSelector } from "@/app/hook";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getFavorites } from "@/features/movies/movieThunk";
import { addToFavorite, removeFavorite } from "@/lib/utils";
import axios from "axios";
import { Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { FaImdb } from "react-icons/fa6";
import { SiMetacritic, SiRottentomatoes } from "react-icons/si";

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

        console.log(movieData);
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
    <div className="space-y-2">
      <div className="space-y-2">
        <h1 className="text-3xl font-[500]">{movie.Title}</h1>
        <div className="flex max-md:flex-col  md:items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground pr-2">{movie.Year}</p>
            <div className="p-[2px] bg-muted-foreground rounded-full"></div>
            <p className="text-sm text-muted-foreground pr-2">{movie.Rated}</p>
            <div className="p-[2px] bg-muted-foreground rounded-full"></div>
            <p className="text-sm text-muted-foreground">{movie.Runtime}</p>
          </div>

          <Button
            onClick={() => {
              movie.fav
                ? removeFromFavorites(movie)
                : handleAddToFavorties(movie);
            }}
            className={`max-md:hidden ${
              movie.fav
                ? "bg-[#f6c700]"
                : "border-1 border-[#f6c700] bg-transparent text-primary hover:bg-[#f6c700]"
            }`}
          >
            <Star />
            {movie.fav ? "Remove From Favourites" : "Add to Favourites"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <Card className="w-full">
          <img
            src={movie.Poster}
            alt={movie.Title}
            className="w-full rounded-lg shadow-md"
          />
        </Card>
        <div className="md:col-span-3 h-full">
          <Card className="h-full p-4 flex flex-col gap-4">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-[600]">Genre</TableCell>
                  <TableCell>
                    <div className="flex gap-2 flex-wrap">
                      {movie.Genre.split(",").map((g) => (
                        <Badge
                          key={g}
                          className="py-1 px-4"
                          variant={"secondary"}
                        >
                          {g}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-[600]">Plot</TableCell>
                  <TableCell>{movie.Plot}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-[600]">Country</TableCell>
                  <TableCell>{movie.Country}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-[600]">Language</TableCell>
                  <TableCell>{movie.Language}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="flex max-md:flex-col justify-center items-center gap-8 flex-wrap flex-1">
              {movie.Ratings.map((rating) => {
                return (
                  <div key={rating.Source} className="text-center">
                    {rating.Source == "Internet Movie Database" && (
                      <FaImdb className="text-[#e2b616]" size={100} />
                    )}
                    {rating.Source == "Rotten Tomatoes" && (
                      <SiRottentomatoes className="text-[#fa320a]" size={100} />
                    )}
                    {rating.Source == "Metacritic" && (
                      <SiMetacritic className="text-[#00ce7a]" size={100} />
                    )}
                    <p className="text-[var(--highlight)]">{rating.Value}</p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      <Card className="h-full p-4">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-[600]">Director</TableCell>
              <TableCell className="text-[var(--highlight)]">
                {movie.Director}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-[600]">Writers</TableCell>
              <TableCell className="text-[var(--highlight)]">
                {movie.Writer}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-[600]">Cast</TableCell>
              <TableCell className="text-[var(--highlight)]">
                {movie.Actors}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-[600]">Awards</TableCell>
              <TableCell className="text-[var(--highlight)]">
                {movie.Awards}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-[600]">Website</TableCell>
              <TableCell className="text-[var(--highlight)]">
                {movie.Website}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

export default MoviePage;
