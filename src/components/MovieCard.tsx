import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { ArrowRight, Star } from "lucide-react";

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
    <Card className="min-w-[200px] shadow-lg relative">
      <CardHeader className="p-2">
        <img
          src={movie.Poster}
          alt={`${movie.Title} Poster`}
          className="w-full aspect-[3/4] object-cover rounded-md border-1 border-[var(--muted-foreground)]"
        />
      </CardHeader>
      <CardContent className="p-2 space-y-2">
        <div>
          <CardTitle className="text-md font-semibold">{movie.Title}</CardTitle>
          <p className="text-sm text-gray-500">
            {movie.Year} • {movie.Type}
          </p>
        </div>
        <button
          onClick={() => {
            movie.fav
              ? handleRemoveFavorites(movie)
              : handleAddToFavorties(movie);
          }}
          className={`cursor-pointer absolute top-0 right-0 m-4 rounded-full transition-all duration-300 ${movie.fav ? "hover:bg-secondary" : "hover:bg-[#f6c700]"}`}
        >
          <Star
            fill={movie.fav ? "#f6c700" : ""}
            size={24}
            className="text-[#f6c700]"
          />
          {/* {movie.fav ? "Remove From Favourites" : "Add to Favourites"} */}
        </button>
        <Button className="w-full bg-[#f6c700]">
          <Link
            to={`/movie/${movie.imdbID}`}
            className="w-full justify-center flex items-end gap-2"
          >
            <span className="block">Learn More</span> <ArrowRight />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default MovieCard;
