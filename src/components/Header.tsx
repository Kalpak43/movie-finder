import { Button } from "./ui/button";
import { Link } from "react-router";
import { useAppDispatch, useAppSelector } from "@/app/hook";
import { signOut } from "@/features/auth/authThunk";
import Searchbar from "./Searchbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Header() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleSubmit = () => {
    dispatch(signOut());
  };

  return (
    <header className="bg-black flex items-center gap-8 justify-between border-b-1 py-4 px-4 md:px-8 sticky top-0 z-50">
      <Link to={"/"}>
        <h2 className="text-2xl font-bold text-[#f6c700]">Movie Finder</h2>
      </Link>

      <nav className="flex items-center gap-8">
        <div className="max-md:hidden">
          <Searchbar />
        </div>
        {user ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  variant={"outline"}
                  size={"icon"}
                  className="rounded-full bg-[var(--highlight)] text-black"
                >
                  {user.email?.slice(0, 1).toUpperCase()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <Button className="w-full" variant="ghost">
                  <Link to="/favorites">Favorites</Link>
                </Button>
                <Button
                  className="w-full text-red-500"
                  variant="ghost"
                  onClick={handleSubmit}
                >
                  Sign out
                </Button>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <Link to={"/login"}>Log in</Link>
            <Link to={"/signup"}>Sign up</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
