import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch } from "@/app/hook";
import { searchMovies } from "@/features/movies/movieThunk";
import { setMovies } from "@/features/movies/movieSlice";

function Searchbar({
  setIsFocused,
}: {
  setIsFocused: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (search.trim() !== "") {
      navigate(`/search?q=${search}`);
      // dispatch(searchMovies(search));
    } else console.log("write something");
  }

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setSearch(value);
    if (value.trim() !== "") {
      console.log(value);
      await dispatch(searchMovies(value));
    } else {
      dispatch(setMovies([]));
    }
  }

  return (
    <div className="search rounded-md ">
      <form className="relative mx-auto md:w-fit" onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Search a movie"
          className="w-full md:min-w-md max-w-xl"
          value={search}
          onChange={(e) => handleChange(e)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
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
