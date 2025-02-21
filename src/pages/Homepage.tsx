import { useAppDispatch, useAppSelector } from "@/app/hook";
import MovieCard from "@/components/MovieCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getFavorites } from "@/features/movies/movieThunk";
import { useToast } from "@/hooks/use-toast";
import { addToFavorite, removeFavorite } from "@/lib/utils";
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
    <div className="py-4">
      {status == "loading" && <p>Loading...</p>}
      {status == "failed" && <p></p>}

      {status === "succeeded" && moviesWithFav.length > 0 && (
        <>
          <h1 className="text-2xl font-bold">Recommendations: </h1>
          <ScrollArea className="w-full whitespace-nowrap overflow-x-auto py-2 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {moviesWithFav.map((movie) => (
                <MovieCard
                  key={movie.imdbID}
                  movie={movie}
                  handleAddToFavorties={handleAddToFavorties}
                  handleRemoveFavorites={removeFromFavorites}
                />
              ))}
            </div>
          </ScrollArea>
        </>
      )}
    </div>
  );
}

export default Homepage;
