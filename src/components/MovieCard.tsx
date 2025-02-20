import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

function MovieCard({
  movie,
  handleAddToFavorties,
  handleRemoveFavorites,
}: {
  movie: MovieType;
  handleAddToFavorties: (movie: MovieType) => void;
  handleRemoveFavorites: (movie: MovieType) => void;
}) {
  return (
    <Card className="min-w-[200px] shadow-lg">
      <CardHeader className="p-2">
        <img
          src={movie.Poster}
          alt={`${movie.Title} Poster`}
          className="w-full h-[250px] object-cover rounded-md"
        />
      </CardHeader>
      <CardContent className="p-2">
        <CardTitle className="text-md font-semibold">{movie.Title}</CardTitle>
        <p className="text-sm text-gray-500">
          {movie.Year} • {movie.Type}
        </p>
        <Button
          onClick={() => {
            movie.fav
              ? handleRemoveFavorites(movie)
              : handleAddToFavorties(movie);
          }}
        >
          {movie.fav ? "Remove From Favourites" : "Add to Favourites"}
        </Button>
        <Button>
          <Link to={`/movie/${movie.imdbID}`}>Learn More</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default MovieCard;
