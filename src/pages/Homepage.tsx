import { useAppSelector } from "@/app/hook";
import Searchbar from "@/components/Searchbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect } from "react";
import { Link } from "react-router";

function Homepage() {
  const { movies, status, error } = useAppSelector((state) => state.movies);

  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <>
      <Searchbar />

      <div className="py-4">
        {status == "loading" && <p>Loading...</p>}
        {/* {status == "failed" && <p></p>} */}

        {status === "succeeded" && (
          <>
            <h1 className="text-2xl font-bold">Search Results: </h1>
            <ScrollArea className="w-full whitespace-nowrap overflow-x-auto py-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {movies.map((movie) => (
                  <Card key={movie.imdbID} className="min-w-[200px] shadow-lg">
                    <Link to={`/movie/${movie.imdbID}`}>
                      <CardHeader className="p-2">
                        <img
                          src={movie.Poster}
                          alt={`${movie.Title} Poster`}
                          className="w-full h-[250px] object-cover rounded-md"
                        />
                      </CardHeader>
                      <CardContent className="p-2">
                        <CardTitle className="text-md font-semibold">
                          {movie.Title}
                        </CardTitle>
                        <p className="text-sm text-gray-500">
                          {movie.Year} • {movie.Type}
                        </p>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </>
        )}
      </div>
    </>
  );
}

export default Homepage;
