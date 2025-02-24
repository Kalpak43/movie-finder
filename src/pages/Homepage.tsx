import { useAppDispatch, useAppSelector } from "@/app/hook";
import AmbientCard from "@/components/AmbientCard";
import MovieCard from "@/components/MovieCard";
import Searchbar from "@/components/Searchbar";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeProvider";
import { setStatus } from "@/features/movies/movieSlice";
import { getFavorites } from "@/features/movies/movieThunk";
import { useToast } from "@/hooks/use-toast";
import { addToFavorite, removeFavorite } from "@/lib/utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Loader2, SearchIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

function Homepage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { theme } = useTheme();
  const { recommendations, favorites, status } = useAppSelector(
    (state) => state.movies
  );
  const { user } = useAppSelector((state) => state.auth);
  const { movies } = useAppSelector((state) => state.movies);
  const [isFocused, setIsFocused] = useState(false);

  const [moviesWithFav, setMoviesWithFav] =
    useState<MovieType[]>(recommendations);

  useEffect(() => {
    if (recommendations) dispatch(setStatus("succeeded"));
  }, [recommendations]);

  // useEffect(() => {
  //   dispatch(getRecommendations());
  // }, [dispatch]);

  useEffect(() => {
    if (recommendations) {
      const updatedMovies = recommendations.map((movie) => {
        const isFavorite = favorites.some((fav) => fav.imdbID === movie.imdbID);
        return { ...movie, fav: isFavorite };
      });

      setMoviesWithFav(updatedMovies);
    }
  }, [recommendations, favorites]);

  const handleAddToFavorties = async (movie: MovieType) => {
    if (!user) {
      navigate("/login");
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
    <>
      <div className="px-4 hero w-full min-h-[90dvh] relative flex items-center justify-center">
        <div className="overlay z-10" />
        <div className="relative z-20 space-y-4 text-center text-white">
          <h1 className="text-4xl font-[600]">
            Welcome to <span className="text-[#f6c700]">Movie Finder</span>
          </h1>
          <div>
            <Searchbar
              className="bg-white text-black"
              setIsFocused={setIsFocused}
            />
            {isFocused && (
              <Card className="search-panel absolute top-full my-2 inset-x-0 rounded-md overflow-hidden">
                <ScrollArea className=" max-h-[300px] overflow-y-auto space-y-2 py-4">
                  {movies.length > 0 ? (
                    movies.map((movie) => (
                      <Link
                        key={movie.imdbID}
                        to={`/movie/${movie.imdbID}`}
                        className={`flex items-center gap-4 p-2 rounded-md transition-colors ${
                          theme === "dark"
                            ? "hover:bg-gray-800"
                            : "hover:bg-gray-200"
                        }`}
                      >
                        <img
                          src={
                            movie.Poster === "N/A"
                              ? "/placeholder.png"
                              : movie.Poster
                          }
                          alt={movie.Title}
                          className="h-16 w-16 object-cover rounded"
                        />
                        <div className="text-left">
                          <h4 className="font-semibold">{movie.Title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {movie.Year}
                          </p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <>
                      <div className="h-full w-full flex items-center justify-center gap-2">
                        <SearchIcon size={20} />
                        Search Something
                      </div>
                    </>
                  )}
                </ScrollArea>
              </Card>
            )}
          </div>
        </div>
      </div>

      <main className="px-8 md:px-20 py-10">
        <div className="py-4 space-y-4">
          {status == "loading" && (
            <div className="min-h-[80dvh] flex items-center justify-center">
              <Loader2 className="animate-spin" />
            </div>
          )}
          {status == "failed" && <p>Failed to fetch</p>}

          {status === "succeeded" && moviesWithFav.length > 0 && (
            <>
              <h1 className="text-2xl font-bold p-2 bg-[var(--highlight-2)] rounded-md text-center shadow-md">
                Recommendations
              </h1>

              <AnimatePresence>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {moviesWithFav.map((movie) => (
                    <motion.div
                      layout
                      key={movie.imdbID}
                      initial={{ opacity: 0, y: 100 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -100 }}
                      transition={{ delay: 0.3 }}
                    >
                      <MovieCard
                        key={movie.imdbID}
                        movie={movie}
                        handleAddToFavorties={handleAddToFavorties}
                        handleRemoveFavorites={removeFromFavorites}
                      />
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default Homepage;
