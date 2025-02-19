import { useEffect } from "react";
import "./App.css";
import { useAppSelector } from "./app/hook";
import Header from "./components/Header";
import Searchbar from "./components/Searchbar";

function App() {
  const { movies } = useAppSelector((state) => state.movies);

  useEffect(() => {
    console.log(movies);
  }, [movies]);

  return (
    <>
      <Header />
      <main className="px-8 md:px-20 py-10">
        <Searchbar />

        <div className="py-4">
          {movies.map((movie) => {
            return (
              <div key={movie.imdbID}>
                <img src={movie.Poster} alt={movie.Title + " Poster"} />
                <h3 className="text-xl font-[600]">{movie.Title}</h3>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}

export default App;
