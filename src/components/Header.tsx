import { Button } from "./ui/button";
import { Link, useLocation, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/app/hook";
import { signOut } from "@/features/auth/authThunk";
import Searchbar from "./Searchbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Search, SearchIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ButtonLink } from "./ui/ButtonLink";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Card } from "./ui/card";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useTheme } from "@/contexts/ThemeProvider";
import { setMovies } from "@/features/movies/movieSlice";

function Header() {
  const { theme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { movies } = useAppSelector((state) => state.movies);

  const [open, setOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!open) dispatch(setMovies([]));
  }, [open]);

  const handleSignout = async () => {
    await dispatch(signOut());
    toast({
      title: "Logged out successfully",
      variant: "destructive",
    });
  };

  const onClickNavigate = async (path: string) => {
    navigate(path, { state: { from: location } });
  };

  return (
    <header className=" flex items-center shadow-md gap-8 justify-between border-b-1 py-4 px-4 md:px-8 sticky top-0 z-50">
      <Link to={"/"}>
        <h2 className="md:text-2xl font-bold text-black">Movie Finder</h2>
      </Link>

      <nav className="flex items-center gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="md:hidden text-black"
                variant={"ghost"}
                onClick={() => setOpen((x) => !x)}
              >
                {open ? <X /> : <Search />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Search a movie</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="max-md:hidden relative">
          <Searchbar setIsFocused={setIsFocused} />
          {isFocused && (
            <Card className="search-panel absolute top-full my-2 inset-x-0 rounded-md overflow-hidden">
              <ScrollArea className=" max-h-[300px] overflow-y-auto space-y-2 py-4">
                {movies.length > 0 ? (
                  movies.map((movie) => (
                    <Link
                      key={movie.imdbID}
                      to={`/movie/${movie.imdbID}`}
                      className={`flex items-center gap-4 p-2 rounded-md transition-colors ${
                        theme === "dark"
                          ? "hover:bg-gray-800"
                          : "hover:bg-gray-200"
                      }`}
                    >
                      <img
                        src={
                          movie.Poster === "N/A"
                            ? "/placeholder.png"
                            : movie.Poster
                        }
                        alt={movie.Title}
                        className="h-16 w-16 object-cover rounded"
                      />
                      <div>
                        <h4 className="font-semibold">{movie.Title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {movie.Year}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <>
                    <div className="h-full w-full flex items-center justify-center gap-2">
                      <SearchIcon size={20} />
                      Search Something
                    </div>
                  </>
                )}
              </ScrollArea>
            </Card>
          )}
        </div>
        {user ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={"outline"}
                        size={"icon"}
                        className="rounded-full bg-[var(--highlight)] text-black"
                      >
                        {user.user_metadata.avatar_url ? (
                          <img
                            src={user.user_metadata.avatar_url}
                            alt=""
                            className="rounded-full"
                          />
                        ) : (
                          user.email?.slice(0, 1).toUpperCase()
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View your options</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <ButtonLink to="/favorites" className="w-full" variant="ghost">
                  Favorites
                </ButtonLink>
                <Button
                  className="w-full text-red-500"
                  variant="ghost"
                  onClick={handleSignout}
                >
                  Sign out
                </Button>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={"outline"}
                        size={"icon"}
                        className="rounded-full"
                      >
                        <EllipsisVertical />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>More options</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <Button
                  onClick={() => onClickNavigate("/login")}
                  className="w-full"
                  variant="ghost"
                >
                  Log in
                </Button>
                <Button
                  onClick={() => onClickNavigate("/signup")}
                  className="w-full"
                  variant="ghost"
                >
                  Sign up
                </Button>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </nav>

      {open && (
        <div className="p-4 absolute inset-x-0 top-full bg-[var(--header)] md:hidden">
          <Searchbar setIsFocused={setOpen} />

          <div className="absolute top-full inset-x-0 overflow-hidden bg-card">
            <ScrollArea className=" max-h-[300px] overflow-y-auto space-y-2 py-4 px-2">
              {movies.length > 0 ? (
                movies.map((movie) => (
                  <Link
                    key={movie.imdbID}
                    to={`/movie/${movie.imdbID}`}
                    className={`flex items-center gap-4 p-2 rounded-md transition-colors ${
                      theme === "dark"
                        ? "hover:bg-gray-800"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    <img
                      src={
                        movie.Poster === "N/A"
                          ? "/placeholder.png"
                          : movie.Poster
                      }
                      alt={movie.Title}
                      className="h-16 w-16 object-cover rounded"
                    />
                    <div>
                      <h4 className="font-semibold">{movie.Title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {movie.Year}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <>
                  <div className="h-full w-full flex items-center justify-center gap-2">
                    <SearchIcon size={20} />
                    Search Something
                  </div>
                </>
              )}
            </ScrollArea>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
