import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { useNavigate } from "react-router";

function Searchbar() {
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (search.trim() !== "") navigate(`/search?q=${search}`);
    else console.log("write something");
  }

  return (
    <div className="search rounded-md ">
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
