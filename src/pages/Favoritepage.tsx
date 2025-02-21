import { useAppDispatch, useAppSelector } from "@/app/hook";
import MovieCard from "@/components/MovieCard";
import { getFavorites } from "@/features/movies/movieThunk";
import { addToFavorite, removeFavorite } from "@/lib/utils";
import { useEffect } from "react";

function Favoritepage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { favorites } = useAppSelector((state) => state.movies);

  useEffect(() => {
    if (user) dispatch(getFavorites(user.id));
  }, [user]);

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
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Your Favorites: </h1>
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
    </div>
  );
}

export default Favoritepage;
