import { useAppDispatch, useAppSelector } from "@/app/hook";
import MovieCard from "@/components/MovieCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getFavorites } from "@/features/movies/movieThunk";
import { useToast } from "@/hooks/use-toast";
import { addToFavorite, removeFavorite } from "@/lib/utils";
import { useEffect } from "react";

function Favoritepage() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { user } = useAppSelector((state) => state.auth);
  const { favorites } = useAppSelector((state) => state.movies);

  useEffect(() => {
    if (user) dispatch(getFavorites(user.id));
  }, [user]);

  const handleAddToFavorties = async (movie: MovieType) => {
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
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Your Favorites: </h1>
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {favorites.map((fav) => (
            <MovieCard
              key={fav.imdbID}
              movie={fav}
              handleAddToFavorties={handleAddToFavorties}
              handleRemoveFavorites={removeFromFavorites}
            />
          ))}
        </div>
      ) : (
        <div className="min-h-[600px] text-center flex items-center justify-center text-red-500">
          <p>No Favorites found. Movies marked as favorite are shown here.</p>
        </div>
      )}
    </div>
  );
}

export default Favoritepage;
