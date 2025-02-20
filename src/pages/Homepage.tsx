import { useAppDispatch, useAppSelector } from "@/app/hook";
import MovieCard from "@/components/MovieCard";
import Searchbar from "@/components/Searchbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getFavorites } from "@/features/movies/movieThunk";
import { addToFavorite, removeFavorite } from "@/lib/utils";
import { useEffect, useState } from "react";

function Homepage() {
  const dispatch = useAppDispatch();
  const { movies, favorites, status } = useAppSelector((state) => state.movies);
  const { user } = useAppSelector((state) => state.auth);

  const [moviesWithFav, setMoviesWithFav] = useState<MovieType[]>(movies);

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
    <>
      <Searchbar />

      <div>Home Page</div>

      {/* <div className="py-4">
        {status == "loading" && <p>Loading...</p>}
        {status == "failed" && <p></p>}

        {status === "succeeded" && moviesWithFav.length > 0 && (
          <>
            <h1 className="text-2xl font-bold">Search Results: </h1>
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
        )}
      </div> */}
    </>
  );
}

export default Homepage;
