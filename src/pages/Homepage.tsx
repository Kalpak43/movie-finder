import { useAppDispatch, useAppSelector } from "@/app/hook";
import MovieCard from "@/components/MovieCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getFavorites, getRecommendations } from "@/features/movies/movieThunk";
import { useToast } from "@/hooks/use-toast";
import { addToFavorite, removeFavorite } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

function Homepage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { recommendations, favorites, status } = useAppSelector(
    (state) => state.movies
  );
  const { user } = useAppSelector((state) => state.auth);

  const [moviesWithFav, setMoviesWithFav] =
    useState<MovieType[]>(recommendations);

  useEffect(() => {
    dispatch(getRecommendations());
  }, [dispatch]);

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
    <div className="py-4 space-y-4">
      {status == "loading" && (
        <div className="min-h-[80dvh] flex items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      )}
      {status == "failed" && <p></p>}

      {status === "succeeded" && moviesWithFav.length > 0 && (
        <>
          <h1 className="text-2xl font-bold">Recommendations: </h1>

          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
  );
}

export default Homepage;
