import { useAppDispatch, useAppSelector } from "@/app/hook";
import MovieCard from "@/components/MovieCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getFavorites, searchMovies } from "@/features/movies/movieThunk";
import { useToast } from "@/hooks/use-toast";
import { addToFavorite, removeFavorite } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";

function Searchpage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useAppDispatch();
  const { movies, favorites, status, recommendations } = useAppSelector(
    (state) => state.movies
  );
  const { user } = useAppSelector((state) => state.auth);

  const [moviesWithFav, setMoviesWithFav] = useState<MovieType[]>(movies);

  useEffect(() => {
    console.log(recommendations);
  }, [recommendations]);

  useEffect(() => {
    if (query && query.trim() !== "") dispatch(searchMovies(query));
  }, [query]);

  useEffect(() => {
    if (movies && favorites) {
      const updatedMovies = movies.map((movie) => {
        const isFavorite = favorites.some((fav) => fav.imdbID === movie.imdbID);
        return { ...movie, fav: isFavorite };
      });

      setMoviesWithFav(updatedMovies);
    }
  }, [movies, favorites]);

  const handleAddToFavorties = async (movie: MovieType) => {
    if (!user) {
      navigate("/login", { state: { from: location } });
      return;
    }
    const { error } = await addToFavorite(user?.id!, movie);

    if (error) console.error(error);

    await dispatch(getFavorites(user?.id!));

    toast({
      title: "Movie added to favorites",
      variant: "success",
      action: (
        <ButtonLink
          to="/favorites"
          className="bg-green-600 hover:bg-green-700"
          variant="outline"
        >
          Go to Favorites
        </ButtonLink>
      ),
    });
  };

  const removeFromFavorites = async (movie: MovieType) => {
    const { error } = await removeFavorite(user?.id!, movie.imdbID);

    if (error) console.error(error);

    await dispatch(getFavorites(user?.id!));

    toast({
      title: "Movie removed from favorites",
      variant: "destructive",
    });
  };

  return (
    <main className="px-8 md:px-20 py-10">
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
              <span className="text-[var(--highlight-3)]">{query}</span>{" "}
            </h1>
            <ScrollArea className="w-full whitespace-nowrap overflow-x-auto py-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
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
          <div className="min-h-[70dvh] text-lg text-center flex flex-col justify-center items-center justify-center">
            <p>
              No movies found for term:
              <span className="text-[var(--highlight)]"> {query}</span>
            </p>
            <ButtonLink to={"/"} variant="outline" className="ml-4">
              Go back
            </ButtonLink>
          </div>
        )}
      </div>
    </main>
  );
}

export default Searchpage;
