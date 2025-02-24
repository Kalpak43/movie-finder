import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Star } from "lucide-react";
import { ButtonLink } from "./ui/ButtonLink";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Link } from "react-router";
import AmbientCard from "./AmbientCard";
import { useTheme } from "@/contexts/ThemeProvider";

function MovieCard({
  movie,
  handleAddToFavorties,
  handleRemoveFavorites,
}: {
  movie: MovieType;
  handleAddToFavorties: (movie: MovieType) => void;
  handleRemoveFavorites: (movie: MovieType) => void;
}) {
  const { theme } = useTheme();
  return (
    <Link to={`/movie/${movie.imdbID}`} className="overflow-hidden">
      <Card className="min-w-[200px] shadow-lg relative h-full flex flex-col hover:scale-105 transition-all duration-300">
        <CardHeader className="p-2">
          <img
            src={movie.Poster === "N/A" ? "/placeholder.png" : movie.Poster}
            alt={`${movie.Title} Poster`}
            className="w-full aspect-square md:aspect-[3/4] object-cover rounded-md border-1 border-[var(--muted-foreground)]"
          />
        </CardHeader>
        <CardContent className="p-2 space-y-2 flex-1">
          <div className="flex flex-col justify-between h-full gap-2">
            <div className="flex-1">
              <CardTitle className="text-md font-semibold line-clamp-1">
                {movie.Title}
              </CardTitle>
              <p className="text-xs text-gray-500">
                {movie.Year} • {movie.Type}
              </p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={(e) => {
                      e.preventDefault(); // Prevent link navigation
                      e.stopPropagation(); // Stop event bubbling
                      movie.fav
                        ? handleRemoveFavorites(movie)
                        : handleAddToFavorties(movie);
                    }}
                    className={`cursor-pointer absolute top-0 right-0 m-4 rounded-full transition-all duration-300 ${
                      movie.fav ? "hover:bg-secondary" : "hover:bg-[#f6c700]"
                    }`}
                  >
                    <Star
                      fill={movie.fav ? "#f6c700" : ""}
                      size={24}
                      className="text-[#f6c700]"
                    />
                    {/* {movie.fav ? "Remove From Favourites" : "Add to Favourites"} */}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {movie.fav ? "Remove from favorites" : "Add to favorites"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <ButtonLink
              to={`/movie/${movie.imdbID}`}
              onClick={(e) => {
                e.stopPropagation(); // Stop event bubbling
              }}
              className="w-full bg-blue-400 flex justify-center items-center gap-2"
            >
              <span className="block mt-1">Learn More</span>{" "}
              <ArrowRight className="mt-1" />
            </ButtonLink>
          </div>
        </CardContent>
        {theme === "dark" && (
          <AmbientCard
            src={movie.Poster}
            className="absolute z-[-1] bottom-0 inset-x-0 opacity-0 hover:opacity-100 transition-all duration-300 delay-300"
            width={300}
            height={300}
          />
        )}
      </Card>
    </Link>
  );
}

export default MovieCard;
