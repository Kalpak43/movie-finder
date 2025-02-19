import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { useAppDispatch } from "@/app/hook";
import { searchMovies } from "@/features/movies/movieThunk";

function Searchbar() {
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState<string>("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    console.log(search);

    dispatch(searchMovies(search));
  }

  return (
    <div>
      <form className="relative mx-auto md:w-fit" onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Search a movie"
          className="w-full md:min-w-md max-w-xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          variant={"ghost"}
          size={"icon"}
          className="absolute inset-y-0 right-0"
        >
          <Search />
        </Button>
      </form>
    </div>
  );
}

export default Searchbar;
