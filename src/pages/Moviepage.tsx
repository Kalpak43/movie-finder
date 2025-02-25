import { useAppDispatch, useAppSelector } from "@/app/hook";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { getFavorites } from "@/features/movies/movieThunk";
import { addToFavorite, removeFavorite } from "@/lib/utils";
import axios from "axios";
import { Loader2, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { FaImdb } from "react-icons/fa6";
import { SiMetacritic, SiRottentomatoes } from "react-icons/si";
import { useTheme } from "@/contexts/ThemeProvider";
import { useToast } from "@/hooks/use-toast";
import { ButtonLink } from "@/components/ui/ButtonLink";

import { motion } from "motion/react";
import AmbientCard from "@/components/AmbientCard";

const API_KEY = import.meta.env.VITE_OMDB_KEY;
const BASE_URL = import.meta.env.VITE_OMDB_URL;

function MoviePage() {
  const { movieId } = useParams();
  const { toast } = useToast();

  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useAppDispatch();
  const { favorites } = useAppSelector((state) => state.movies);
  const { user } = useAppSelector((state) => state.auth);
  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [loading, setLoading] = useState(true);

  const { theme } = useTheme();
  const [whereToWatch, setWhereToWatch] = useState<any>(null);
  const [loadingWatch, setLoadingWatch] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    setLoading(true);
    if (movieId && movieId != undefined && movieId !== "")
      axios
        .get(`${BASE_URL}?apikey=${API_KEY}&i=${movieId}`)
        .then((res) => {
          const movieData = res.data;
          const isFavorite = favorites.some(
            (fav) => fav.imdbID === movieData.imdbID
          );
          setMovie({ ...movieData, fav: isFavorite });
          setLoading(false);
        })
        .catch((e) => {
          console.error(e);
          setLoading(false);
        });
  }, [movieId]);

  useEffect(() => {
    if (movieId && movieId != undefined && movieId !== "") {
      console.log("MOVIE: ", movieId);
      setLoadingWatch(true);
      axios
        .get(
          `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=362594fd6ba4d449d0bb695b52fb5cad`
        )
        .then((res) => {
          setLoadingWatch(false);
          setWhereToWatch(res.data.results["IN"]);
        })
        .catch((e) => {
          setLoadingWatch(false);
          console.error(e);
        });
    }
  }, [movieId]);

  useEffect(() => {
    if (movie) {
      const isFavorite = favorites.some((fav) => fav.imdbID === movie?.imdbID);
      setMovie((x) =>
        x
          ? {
              ...x,
              fav: isFavorite,
            }
          : null
      );
    }
  }, [favorites]);

  if (loading) {
    return (
      <div className="min-h-[80dvh] flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!movie) {
    return <p className="text-center text-red-500">Movie not found.</p>;
  }

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

  const getDefaultTab = () => {
    if (!whereToWatch) return "";
    if (whereToWatch.flatrate) return "subscription";
    if (whereToWatch.rent) return "rent";
    if (whereToWatch.buy) return "buy";
    return ""; // Fallback, should never be reached if at least one option is available
  };

  return (
    <main className="px-8 md:px-20 py-10">
      <div className="space-y-2 pb-4 overflow-x-hidden">
        {theme == "dark" && movie.Poster && (
          <AmbientCard src={movie.Poster} width={1920} height={1080} />
        )}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-[500]">{movie.Title}</h1>
          <div className="flex max-md:flex-col  md:items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground pr-2">{movie.Year}</p>
              <div className="p-[2px] bg-muted-foreground rounded-full"></div>
              <p className="text-sm text-muted-foreground pr-2">
                {movie.Rated}
              </p>
              <div className="p-[2px] bg-muted-foreground rounded-full"></div>
              <p className="text-sm text-muted-foreground">{movie.Runtime}</p>
            </div>

            <Button
              onClick={() => {
                movie.fav
                  ? removeFromFavorites(movie)
                  : handleAddToFavorties(movie);
              }}
              className={`max-md:hidden ${
                movie.fav
                  ? "bg-[#f6c700]"
                  : "border-1 border-[#f6c700] bg-transparent text-primary hover:bg-[#f6c700]"
              }`}
            >
              <Star />
              {movie.fav ? "Remove From Favourites" : "Add to Favourites"}
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="w-full overflow-clip">
              <img
                src={movie.Poster === "N/A" ? "/placeholder.png" : movie.Poster}
                alt={movie.Title}
                className="w-full h-full rounded-lg shadow-md object-cover"
              />
            </Card>
          </motion.div>
          <Button
            onClick={() => {
              movie.fav
                ? removeFromFavorites(movie)
                : handleAddToFavorties(movie);
            }}
            className={`md:hidden w-full ${
              movie.fav
                ? "bg-[#f6c700]"
                : "border-1 border-[#f6c700] bg-transparent text-primary hover:bg-[#f6c700]"
            }`}
          >
            <Star />
            {movie.fav ? "Remove From Favourites" : "Add to Favourites"}
          </Button>
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 xl:col-span-3 h-full"
          >
            <Card className="h-full p-4 flex flex-col gap-4">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-[600]">Genre</TableCell>
                    <TableCell>
                      <div className="flex gap-2 flex-wrap">
                        {movie.Genre &&
                          movie.Genre.split(",").map((g) => (
                            <Badge
                              key={g}
                              className="py-1 px-4"
                              variant={"secondary"}
                            >
                              {g}
                            </Badge>
                          ))}
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-[600]">Plot</TableCell>
                    <TableCell>{movie.Plot}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-[600]">Country</TableCell>
                    <TableCell>{movie.Country}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-[600]">Language</TableCell>
                    <TableCell>{movie.Language}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="flex max-md:flex-col justify-center items-center gap-8 flex-wrap flex-1">
                {movie.Ratings.length > 0 ? (
                  movie.Ratings.map((rating) => {
                    return (
                      <div key={rating.Source} className="text-center">
                        {rating.Source == "Internet Movie Database" && (
                          <FaImdb className="text-[#e2b616] text-6xl xl:text-8xl" />
                        )}
                        {rating.Source == "Rotten Tomatoes" && (
                          <SiRottentomatoes className="text-[#fa320a] text-6xl xl:text-8xl" />
                        )}
                        {rating.Source == "Metacritic" && (
                          <SiMetacritic className="text-[#00ce7a] text-6xl xl:text-8xl" />
                        )}
                        <p className="text-[var(--highlight)]">
                          {rating.Value}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <h3 className="text-xl font-[600] text-[var(--highlight)]">
                    No Ratings Available
                  </h3>
                )}
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
        >
          <Card className="h-full p-4 mt-4">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-[600]">Director</TableCell>
                  <TableCell className="text-[var(--highlight)]">
                    {movie.Director}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-[600]">Writers</TableCell>
                  <TableCell className="text-[var(--highlight)]">
                    {movie.Writer}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-[600]">Cast</TableCell>
                  <TableCell className="text-[var(--highlight)]">
                    {movie.Actors}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-[600]">Awards</TableCell>
                  <TableCell className="text-[var(--highlight)]">
                    {movie.Awards}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-[600]">Collection</TableCell>
                  <TableCell className="text-[var(--highlight)]">
                    {movie.BoxOffice ?? "N/A"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
        >
          <Card className="h-full p-4 mt-4 space-y-4">
            <CardTitle>
              <h3 className="text-xl">Where to watch</h3>
            </CardTitle>
            <CardContent className="p-0">
              {!loadingWatch ? (
                whereToWatch ? (
                  <>
                    <Tabs defaultValue={getDefaultTab()} className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        {whereToWatch.flatrate && (
                          <TabsTrigger value="subscription">
                            Subscription
                          </TabsTrigger>
                        )}
                        {whereToWatch.rent && (
                          <TabsTrigger value="rent">Rent</TabsTrigger>
                        )}
                        {whereToWatch.buy && (
                          <TabsTrigger value="buy">Buy</TabsTrigger>
                        )}
                      </TabsList>

                      {/* Subscription */}
                      {whereToWatch.flatrate && (
                        <TabsContent value="subscription">
                          <ProviderList providers={whereToWatch.flatrate} />
                        </TabsContent>
                      )}

                      {/* Rent */}
                      {whereToWatch.rent && (
                        <TabsContent value="rent">
                          <ProviderList providers={whereToWatch.rent} />
                        </TabsContent>
                      )}

                      {/* Buy */}
                      {whereToWatch.buy && (
                        <TabsContent value="buy">
                          <ProviderList providers={whereToWatch.buy} />
                        </TabsContent>
                      )}
                    </Tabs>
                    {whereToWatch && (
                      <p className="text-xs mt-4 text-muted-foreground">
                        Data made available from{" "}
                        <Link
                          to={whereToWatch.link}
                          className="underline"
                          target="__blank"
                        >
                          TMDB API
                        </Link>
                      </p>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-[100px]">
                    <p className="text-center text-[var(--highlight-3)]">
                      No Services found
                    </p>
                  </div>
                )
              ) : (
                <div className="flex items-center justify-center h-[100px]">
                  <Loader2 className="animate-spin" />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}

export default MoviePage;

const ProviderList = ({ providers }: { providers: any }) => (
  <ul className="flex max-md:flex-col items-center gap-4 py-4 px-2">
    {providers.map((provider: any) => (
      <li
        key={provider.provider_id}
        className="flex flex-col items-center gap-2 text-center"
      >
        <img
          src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
          alt={provider.provider_name}
          className="w-16 h-16 rounded-md border-1 border-[var(--muted-foreground)] shadow"
        />
        <p className="text-sm">{provider.provider_name}</p>
      </li>
    ))}
  </ul>
);
