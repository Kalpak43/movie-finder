import { useAppDispatch, useAppSelector } from "@/app/hook";
import MovieCard from "@/components/MovieCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getFavorites, searchMovies } from "@/features/movies/movieThunk";
import { addToFavorite, removeFavorite } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

function Searchpage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const { movies, favorites, status } = useAppSelector((state) => state.movies);
  const { user } = useAppSelector((state) => state.auth);

  const [moviesWithFav, setMoviesWithFav] = useState<MovieType[]>(movies);

  useEffect(() => {
    if (query.trim() !== "") dispatch(searchMovies(query));
  }, [query]);

  useEffect(() => {
    if (movies) {
      const updatedMovies = movies.map((movie) => {
        const isFavorite = favorites.some((fav) => fav.imdbID === movie.imdbID);
        return { ...movie, fav: isFavorite };
      });

      setMoviesWithFav(updatedMovies);
    }
  }, [movies, favorites]);

  const handleAddToFavorties = async (movie: MovieType) => {
    if (!user) navigate("/login");
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
    <div className="py-4">
      {status == "loading" && (
        <div className="min-h-[80dvh] flex items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      )}
      {/* {status == "failed" && <p></p>} */}

      {status === "succeeded" && moviesWithFav.length > 0 ? (
        <>
          <h1 className="text-2xl font-bold">
            Showing search results for:{" "}
            <span className="text-[var(--highlight)]">{query}</span>{" "}
          </h1>
          <ScrollArea className="w-full whitespace-nowrap overflow-x-auto py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {moviesWithFav.map((movie) => (
                <MovieCard
                  movie={movie}
                  handleAddToFavorties={handleAddToFavorties}
                  handleRemoveFavorites={removeFromFavorites}
                  key={movie.imdbID}
                />
              ))}
            </div>
          </ScrollArea>
        </>
      ) : (
        <div className="min-h-[70dvh] text-lg flex items-center justify-center">
          No movies found for term:
          <span className="text-[var(--highlight)]"> {query}</span>
        </div>
      )}
    </div>
  );
}

export default Searchpage;
